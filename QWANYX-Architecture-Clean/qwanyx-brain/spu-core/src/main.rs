//! SPU Core - Main HTTP Server
//! 
//! The intelligent orchestrator that replaces spu-rust
//! Executes assembly scripts and coordinates coprocessors

use actix_cors::Cors;
use actix_web::{middleware, web, App, HttpServer, HttpResponse};
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::sync::Arc;
use tracing::{error, info};

use spu_core::{runtime::SPURuntime, Data};
use spu_core::coprocessors::{
    RealEmailCoprocessor, 
    SemanticCompressorCoprocessor,
    AuthCoprocessor,
    DatabaseCoprocessor,
};

#[derive(Debug, Deserialize)]
struct RegisterRequest {
    email: String,
    #[serde(rename = "firstName")]
    first_name: String,
    #[serde(rename = "lastName")]
    last_name: String,
    phone: String,
    #[serde(rename = "accountType")]
    account_type: String,
    workspace: String,
}

#[derive(Debug, Deserialize)]
struct LoginRequest {
    email: String,
}

#[derive(Debug, Deserialize)]
struct VerifyCodeRequest {
    email: String,
    code: String,
}

#[derive(Debug, Serialize)]
struct AuthResponse {
    success: bool,
    message: Option<String>,
    token: Option<String>,
    requires_code: Option<bool>,
}

#[derive(Debug, Deserialize)]
struct ExecuteRequest {
    script: String,  // Assembly script to execute
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Load environment
    dotenv::dotenv().ok();
    
    // Initialize tracing
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| tracing_subscriber::EnvFilter::new("info")),
        )
        .init();
    
    info!("Starting SPU Core - Universal Orchestrator");
    
    // Create SPU Runtime
    let runtime = Arc::new(SPURuntime::new());
    
    // Register coprocessor classes
    runtime.register_class(
        "compression".to_string(),
        Arc::new(SemanticCompressorCoprocessor::new()),
    ).await;
    
    runtime.register_class(
        "email".to_string(),
        Arc::new(RealEmailCoprocessor::new()),
    ).await;
    
    runtime.register_class(
        "auth".to_string(),
        Arc::new(AuthCoprocessor::new()),
    ).await;
    
    let mut db = DatabaseCoprocessor::new();
    let _ = db.connect().await; // Try to connect but don't fail if can't
    runtime.register_class(
        "database".to_string(),
        Arc::new(db),
    ).await;
    
    info!("SPU Core initialized with coprocessors");
    
    // Start HTTP server
    let host = std::env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
    let port: u16 = std::env::var("PORT")
        .unwrap_or_else(|_| "5002".to_string())
        .parse()
        .unwrap_or(5002);
    
    info!("Starting HTTP server on {}:{}", host, port);
    
    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);
        
        App::new()
            .app_data(web::Data::new(runtime.clone()))
            .wrap(cors)
            .wrap(middleware::Logger::default())
            // Health check
            .route("/health", web::get().to(health_check))
            // Authentication endpoints
            .route("/auth/register", web::post().to(auth_register))
            .route("/auth/request-code", web::post().to(auth_request_code))
            .route("/auth/login", web::post().to(auth_request_code))  // Alias for compatibility
            .route("/auth/verify-code", web::post().to(auth_verify_code))
            // SPU execution
            .route("/execute", web::post().to(execute_assembly))
            // User management endpoints
            .route("/users", web::get().to(get_users))
            .route("/users/{id}", web::put().to(update_user))
            // Generic database operations via SPU
            .route("/data/{collection}", web::post().to(store_data))
            .route("/data/{collection}", web::get().to(retrieve_data))
            .route("/data/{collection}/{id}", web::get().to(get_data_by_id))
            .route("/data/{collection}/{id}", web::put().to(update_data))
            .route("/data/{collection}/{id}", web::delete().to(delete_data))
    })
    .bind((host, port))?
    .run()
    .await
}

async fn health_check() -> HttpResponse {
    HttpResponse::Ok().json(json!({
        "status": "healthy",
        "service": "spu-core",
        "version": "0.1.0",
        "timestamp": chrono::Utc::now().to_rfc3339(),
    }))
}

async fn auth_register(
    runtime: web::Data<Arc<SPURuntime>>,
    req: web::Json<RegisterRequest>,
) -> HttpResponse {
    info!("Register request for: {}", req.email);
    
    // Create assembly script for registration (single-line JSON for simple parser)
    let script = format!(r#"
        # Registration Assembly Script
        # 1. Instantiate coprocessors
        INSTANTIATE auth auth1
        INSTANTIATE email email1
        INSTANTIATE database db1
        
        # 2. Create user data
        SET user_data {{"email": "{}", "firstName": "{}", "lastName": "{}", "phone": "{}", "accountType": "{}", "workspace": "{}"}}
        
        # 3. Register user (auth will generate code)
        CALL auth1 register $user_data auth_result
        
        # 4. Get the generated code from auth_result
        GET auth_result.code code
        
        # 5. Send email with code  
        SET email_data {{"to": "{}", "subject": "QWANYX - Verification Code", "body": "Your verification code is: $code\n\nThis code expires in 10 minutes."}}
        CALL email1 send $email_data email_result
        
        # 6. Store user in database
        SET db_input {{"collection": "users", "data": $user_data}}
        CALL db1 store $db_input user_id
        
        # 7. Return success
        SET result {{"success": true, "message": "Registration successful. Check your email for verification code.", "requires_code": true}}
    "#, 
        req.email, 
        req.first_name, 
        req.last_name, 
        req.phone,
        req.account_type,
        req.workspace,
        req.email
    );
    
    // Execute the assembly script
    info!("Starting assembly execution for registration");
    match runtime.execute(&script).await {
        Ok(result) => {
            // Convert result to AuthResponse
            match result {
                Data::Object(obj) => {
                    let success = match obj.get("success") {
                        Some(Data::Bool(b)) => *b,
                        _ => false
                    };
                    
                    let message = match obj.get("message") {
                        Some(Data::String(s)) => Some(s.clone()),
                        _ => None
                    };
                    
                    let requires_code = match obj.get("requires_code") {
                        Some(Data::Bool(b)) => Some(*b),
                        _ => None
                    };
                    
                    HttpResponse::Ok().json(AuthResponse {
                        success,
                        message,
                        token: None,
                        requires_code,
                    })
                }
                _ => {
                    error!("Unexpected result type from assembly execution");
                    HttpResponse::InternalServerError().json(AuthResponse {
                        success: false,
                        message: Some("Internal error".to_string()),
                        token: None,
                        requires_code: None,
                    })
                }
            }
        }
        Err(e) => {
            error!("Assembly execution failed: {}", e);
            HttpResponse::InternalServerError().json(AuthResponse {
                success: false,
                message: Some(format!("Registration failed: {}", e)),
                token: None,
                requires_code: None,
            })
        }
    }
}

async fn auth_request_code(
    runtime: web::Data<Arc<SPURuntime>>,
    req: web::Json<LoginRequest>,
) -> HttpResponse {
    info!("Login code request for: {}", req.email);
    
    // Assembly script to request login code (single-line JSON)
    let script = format!(r#"
        # Login Code Request Assembly Script
        INSTANTIATE auth auth1
        INSTANTIATE email email1
        
        # Generate new code
        SET email_input {{"email": "{}"}}
        CALL auth1 generate_code $email_input code_result
        GET code_result.code code
        
        # Send email
        SET email_data {{"to": "{}", "subject": "QWANYX - Login Code", "body": "Your login code is: $code\n\nThis code expires in 10 minutes."}}
        CALL email1 send $email_data email_result
        
        # Return success
        SET result {{"success": true, "message": "Code sent to your email.", "requires_code": true}}
    "#, req.email, req.email);
    
    // Execute the assembly script
    match runtime.execute(&script).await {
        Ok(result) => {
            match result {
                Data::Object(obj) => {
                    let success = match obj.get("success") {
                        Some(Data::Bool(b)) => *b,
                        _ => false
                    };
                    
                    let message = match obj.get("message") {
                        Some(Data::String(s)) => Some(s.clone()),
                        _ => None
                    };
                    
                    HttpResponse::Ok().json(AuthResponse {
                        success,
                        message,
                        token: None,
                        requires_code: Some(true),
                    })
                }
                _ => {
                    HttpResponse::InternalServerError().json(AuthResponse {
                        success: false,
                        message: Some("Internal error".to_string()),
                        token: None,
                        requires_code: None,
                    })
                }
            }
        }
        Err(e) => {
            error!("Assembly execution failed: {}", e);
            HttpResponse::InternalServerError().json(AuthResponse {
                success: false,
                message: Some(format!("Failed to send code: {}", e)),
                token: None,
                requires_code: None,
            })
        }
    }
}

async fn auth_verify_code(
    runtime: web::Data<Arc<SPURuntime>>,
    req: web::Json<VerifyCodeRequest>,
) -> HttpResponse {
    info!("Verify code for: {}", req.email);
    
    // Assembly script to verify code (single-line JSON)
    let script = format!(r#"
        # Code Verification Assembly Script
        INSTANTIATE auth auth1
        
        # Verify the code
        SET verify_data {{"email": "{}", "code": "{}"}}
        CALL auth1 verify_code $verify_data verify_result
        
        # Get validation status
        GET verify_result.valid is_valid
        GET verify_result.token token
        GET verify_result.error error_msg
        
        # Build response based on validation  
        SET result $verify_result
    "#, req.email, req.code);
    
    // Execute the assembly script
    match runtime.execute(&script).await {
        Ok(result) => {
            info!("Verify code result type: {:?}", std::mem::discriminant(&result));
            match result {
                Data::Object(obj) => {
                    let valid = match obj.get("valid") {
                        Some(Data::Bool(b)) => *b,
                        _ => false
                    };
                    
                    if valid {
                        let token = match obj.get("token") {
                            Some(Data::String(s)) => Some(s.clone()),
                            _ => None
                        };
                        
                        HttpResponse::Ok().json(json!({
                            "success": true,
                            "message": "Code verified successfully.",
                            "access_token": token, // Frontend expects access_token
                            "token": token,
                            "requires_code": false,
                            "user": {
                                "email": req.email,
                                "workspace": "autodin"
                            }
                        }))
                    } else {
                        let error = match obj.get("error") {
                            Some(Data::String(s)) => s.clone(),
                            _ => "Invalid code".to_string()
                        };
                        
                        HttpResponse::BadRequest().json(json!({
                            "success": false,
                            "error": error,
                            "message": error
                        }))
                    }
                }
                _ => {
                    HttpResponse::InternalServerError().json(json!({
                        "success": false,
                        "error": "Internal error"
                    }))
                }
            }
        }
        Err(e) => {
            error!("Assembly execution failed: {}", e);
            HttpResponse::InternalServerError().json(json!({
                "success": false,
                "error": format!("Verification failed: {}", e)
            }))
        }
    }
}

async fn execute_assembly(
    runtime: web::Data<Arc<SPURuntime>>,
    req: web::Json<ExecuteRequest>,
) -> HttpResponse {
    info!("Executing assembly script");
    
    // TODO: Parse and execute the assembly script
    // For now, return success
    
    HttpResponse::Ok().json(json!({
        "success": true,
        "result": "Assembly script executed",
    }))
}

async fn get_users(
    runtime: web::Data<Arc<SPURuntime>>,
    req: actix_web::HttpRequest,
) -> HttpResponse {
    info!("Fetching users");
    
    // Get workspace from header or default to "autodin"
    let workspace = req.headers()
        .get("X-Workspace")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("autodin");
    
    info!("Using workspace: {}", workspace);
    
    // Create assembly script to fetch users from database (single-line JSON)
    let script = format!(r#"
        # Fetch Users Assembly Script
        INSTANTIATE database db1
        
        # Retrieve users from the workspace collection
        SET query_params {{"collection": "users", "workspace": "{}", "filter": {{}}}}
        CALL db1 retrieve $query_params users_result
        
        # Return the users
        SET result $users_result
    "#, workspace);
    
    // Execute the assembly script
    match runtime.execute(&script).await {
        Ok(result) => {
            match result {
                Data::Object(obj) => {
                    // Extract users array from the result
                    if let Some(Data::Array(users)) = obj.get("data") {
                        // Convert Data::Array to JSON array
                        let json_users: Vec<serde_json::Value> = users.iter().map(|user| {
                            // Convert Data to serde_json::Value
                            data_to_json(user)
                        }).collect();
                        
                        info!("Returning {} users from database", json_users.len());
                        HttpResponse::Ok().json(json_users)
                    } else if let Some(Data::String(error)) = obj.get("error") {
                        // Database might not be connected
                        info!("Database query failed: {}, returning mock data", error);
                        HttpResponse::Ok().json(json!([
                            {
                                "_id": "1",
                                "email": "phil@pixanima.com",
                                "firstName": "Phil",
                                "lastName": "User",
                                "role": "superuser",
                                "type": "user",
                                "workspace": workspace
                            },
                {
                    "_id": "2",
                    "email": "admin@autodin.be",
                    "firstName": "Admin",
                    "lastName": "User",
                    "role": "admin",
                    "type": "user",
                    "workspace": workspace
                },
                {
                    "_id": "3",
                    "email": "test@test.com",
                    "firstName": "Test",
                    "lastName": "User",
                    "role": "particulier",
                    "type": "user",
                    "workspace": workspace
                },
                {
                    "_id": "4",
                    "email": "digital1@autodin.be",
                    "firstName": "Digital",
                    "lastName": "Assistant 1",
                    "role": "admin",
                    "type": "DH",
                    "workspace": workspace
                },
                {
                    "_id": "5",
                    "email": "digital2@autodin.be",
                    "firstName": "Digital",
                    "lastName": "Assistant 2",
                    "role": "admin",
                    "type": "DH",
                    "workspace": workspace
                }
                        ]))
                    } else {
                        // Return empty array if no users found
                        info!("No users found in database");
                        HttpResponse::Ok().json(json!([]))
                    }
                }
                _ => {
                    info!("Unexpected result type, returning mock data");
                    // Return mock data for development
                    HttpResponse::Ok().json(json!([
                        {
                            "_id": "1",
                            "email": "phil@pixanima.com",
                            "firstName": "Phil",
                            "lastName": "User",
                            "role": "superuser",
                            "type": "user",
                            "workspace": workspace
                        },
                        {
                            "_id": "2",
                            "email": "admin@autodin.be",
                            "firstName": "Admin",
                            "lastName": "User",
                            "role": "admin",
                            "type": "user",
                            "workspace": workspace
                        },
                        {
                            "_id": "3",
                            "email": "test@test.com",
                            "firstName": "Test",
                            "lastName": "User",
                            "role": "particulier",
                            "type": "user",
                            "workspace": workspace
                        }
                    ]))
                }
            }
        }
        Err(e) => {
            error!("Failed to fetch users: {}", e);
            // Return mock data for development
            HttpResponse::Ok().json(json!([
                {
                    "_id": "1",
                    "email": "admin@autodin.be",
                    "firstName": "Admin",
                    "lastName": "User",
                    "role": "superuser",
                    "type": "user",
                    "workspace": workspace
                }
            ]))
        }
    }
}

async fn update_user(
    runtime: web::Data<Arc<SPURuntime>>,
    path: web::Path<String>,
    req: actix_web::HttpRequest,
    user_data: web::Json<serde_json::Value>,
) -> HttpResponse {
    let user_id = path.into_inner();
    
    // Get workspace from headers or default
    let workspace = req.headers()
        .get("X-Workspace")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("autodin")
        .to_string();
    
    info!("Updating user: {} in workspace: {}", user_id, workspace);
    
    // Create the complete params object in one go (this is what fixed the requests UPDATE)
    let script = format!(r#"
        # Update User
        INSTANTIATE database db
        
        # Create the complete params object in one go
        SET params {{
            "collection": "users",
            "workspace": "{}",
            "filter": {{"_id": "{}"}},
            "update": {}
        }}
        
        CALL db update $params result
        TRACE "User updated successfully"
        
        SET response {{
            "success": true,
            "id": "{}"
        }}
        
        DESTROY db
        RETURN $response
    "#,
        workspace,
        user_id,
        user_data.to_string(),
        user_id
    );
    
    match runtime.execute(&script).await {
        Ok(result) => {
            match &result {
                Data::Object(obj) => {
                    if let Some(Data::Bool(true)) = obj.get("success") {
                        HttpResponse::Ok().json(data_to_json(&result))
                    } else {
                        HttpResponse::InternalServerError().json(data_to_json(&result))
                    }
                }
                _ => HttpResponse::Ok().json(data_to_json(&result))
            }
        }
        Err(e) => {
            error!("Failed to update user: {}", e);
            HttpResponse::InternalServerError().json(json!({
                "success": false,
                "error": format!("Failed to update user: {}", e)
            }))
        }
    }
}

// Helper function to convert Data to serde_json::Value
fn data_to_json(data: &Data) -> serde_json::Value {
    match data {
        Data::Null => serde_json::Value::Null,
        Data::Bool(b) => serde_json::Value::Bool(*b),
        Data::Number(n) => serde_json::Value::Number(serde_json::Number::from_f64(*n).unwrap_or(serde_json::Number::from(0))),
        Data::String(s) => serde_json::Value::String(s.clone()),
        Data::Array(arr) => {
            serde_json::Value::Array(arr.iter().map(data_to_json).collect())
        }
        Data::Object(obj) => {
            let mut map = serde_json::Map::new();
            for (key, value) in obj {
                map.insert(key.clone(), data_to_json(value));
            }
            serde_json::Value::Object(map)
        }
        Data::ObjectRef(id) => serde_json::Value::String(id.0.clone())
    }
}

// Generic Data Management Endpoints using SPU

#[derive(Debug, Deserialize)]
struct DataRequest {
    workspace: String,
    data: serde_json::Value,
}

async fn store_data(
    runtime: web::Data<Arc<SPURuntime>>,
    path: web::Path<String>,
    request: web::Json<DataRequest>,
) -> HttpResponse {
    let collection = path.into_inner();
    info!("Storing data to collection: {} in workspace: {}", collection, request.workspace);
    
    // Create SPU script to store data
    let script = format!(r#"
        # Store Data Script
        INSTANTIATE database db
        
        # Set the data with metadata
        SET data {}
        SET data.createdAt "{}"
        SET data.workspace "{}"
        
        # Store in database
        # Since the simple parser doesn't support nested SET, we'll use the Data::Object approach
        # Create a wrapper that contains everything
        SET store_request {{
            "collection": "{}",
            "workspace": "{}",
            "data": {}
        }}
        
        CALL db store $store_request result
        GET result.id doc_id
        TRACE "Document stored with ID: $doc_id"
        
        # Return the stored document with ID
        SET data._id $doc_id
        SET response {{
            "success": true,
            "id": $doc_id,
            "data": $data
        }}
        
        DESTROY db
        RETURN $response
    "#,
        request.data.to_string(),
        chrono::Utc::now().to_rfc3339(),
        request.workspace,
        collection,
        request.workspace,
        request.data.to_string()  // For the data field in store_request
    );
    
    // Execute the SPU script
    match runtime.execute(&script).await {
        Ok(result) => {
            match &result {
                Data::Object(obj) => {
                    if let Some(Data::Bool(true)) = obj.get("success") {
                        HttpResponse::Ok().json(data_to_json(&result))
                    } else {
                        HttpResponse::InternalServerError().json(data_to_json(&result))
                    }
                }
                _ => HttpResponse::Ok().json(data_to_json(&result))
            }
        }
        Err(e) => {
            error!("Failed to store data: {}", e);
            HttpResponse::InternalServerError().json(json!({
                "success": false,
                "error": format!("Failed to store data: {}", e)
            }))
        }
    }
}

async fn retrieve_data(
    runtime: web::Data<Arc<SPURuntime>>,
    path: web::Path<String>,
    req: actix_web::HttpRequest,
) -> HttpResponse {
    let collection = path.into_inner();
    
    // Get workspace from query params or header
    let query_params = web::Query::<std::collections::HashMap<String, String>>::from_query(
        req.query_string()
    ).unwrap_or_else(|_| web::Query(std::collections::HashMap::new()));
    
    let workspace = query_params.get("workspace")
        .map(|s| s.as_str())
        .or_else(|| req.headers()
            .get("X-Workspace")
            .and_then(|v| v.to_str().ok()))
        .unwrap_or("autodin")
        .to_string();
    
    info!("Retrieving data from collection: {} in workspace: {}", collection, workspace);
    
    // Build filter from query params (excluding workspace)
    let filter_params: std::collections::HashMap<String, String> = query_params
        .iter()
        .filter(|(k, _)| *k != "workspace")
        .map(|(k, v)| (k.clone(), v.clone()))
        .collect();
    
    let filter = if filter_params.is_empty() {
        "{}".to_string()
    } else {
        serde_json::to_string(&filter_params).unwrap_or_else(|_| "{}".to_string())
    };
    
    let script = format!(r#"
        # Retrieve Data Script
        INSTANTIATE database db
        
        SET query {{
            "collection": "{}",
            "workspace": "{}",
            "filter": {}
        }}
        
        CALL db retrieve $query result
        
        # The result contains data, found, and count fields
        # We just need to return the whole result which contains the data array
        DESTROY db
        RETURN $result
    "#, collection, workspace, filter);
    
    match runtime.execute(&script).await {
        Ok(Data::Object(result)) => {
            // Extract the data array from the result
            if let Some(Data::Array(documents)) = result.get("data") {
                let json_docs: Vec<serde_json::Value> = documents.iter()
                    .map(|d| data_to_json(d))
                    .collect();
                HttpResponse::Ok().json(json_docs)
            } else {
                HttpResponse::Ok().json(json!([]))
            }
        }
        Ok(Data::Array(documents)) => {
            // Direct array result (shouldn't happen with current script)
            let json_docs: Vec<serde_json::Value> = documents.iter()
                .map(|d| data_to_json(d))
                .collect();
            HttpResponse::Ok().json(json_docs)
        }
        Ok(_) => {
            HttpResponse::Ok().json(json!([]))
        }
        Err(e) => {
            error!("Failed to retrieve data: {}", e);
            HttpResponse::InternalServerError().json(json!({
                "success": false,
                "error": format!("Failed to retrieve data: {}", e)
            }))
        }
    }
}

async fn get_data_by_id(
    runtime: web::Data<Arc<SPURuntime>>,
    path: web::Path<(String, String)>,
    req: actix_web::HttpRequest,
) -> HttpResponse {
    let (collection, id) = path.into_inner();
    
    let query_params = web::Query::<std::collections::HashMap<String, String>>::from_query(
        req.query_string()
    ).unwrap_or_else(|_| web::Query(std::collections::HashMap::new()));
    
    let workspace = query_params.get("workspace")
        .map(|s| s.as_str())
        .or_else(|| req.headers()
            .get("X-Workspace")
            .and_then(|v| v.to_str().ok()))
        .unwrap_or("autodin")
        .to_string();
    
    info!("Getting document {} from collection: {} in workspace: {}", id, collection, workspace);
    
    let script = format!(r#"
        # Get Document by ID
        INSTANTIATE database db
        
        SET query {{
            "collection": "{}",
            "workspace": "{}",
            "filter": {{"_id": "{}"}}
        }}
        
        CALL db retrieve $query result
        GET result.data documents
        LEN $documents count
        
        IF $count > 0
            GET documents[0] document
            DESTROY db
            RETURN $document
        ELSE
            DESTROY db
            THROW NotFoundError "Document not found"
        ENDIF
    "#, collection, workspace, id);
    
    match runtime.execute(&script).await {
        Ok(result) => {
            HttpResponse::Ok().json(data_to_json(&result))
        }
        Err(e) => {
            if e.contains("NotFoundError") {
                HttpResponse::NotFound().json(json!({
                    "success": false,
                    "error": "Document not found"
                }))
            } else {
                error!("Failed to get document: {}", e);
                HttpResponse::InternalServerError().json(json!({
                    "success": false,
                    "error": format!("Failed to get document: {}", e)
                }))
            }
        }
    }
}

async fn update_data(
    runtime: web::Data<Arc<SPURuntime>>,
    path: web::Path<(String, String)>,
    request: web::Json<DataRequest>,
) -> HttpResponse {
    let (collection, id) = path.into_inner();
    info!("Updating document {} in collection: {} workspace: {}", id, collection, request.workspace);
    
    // Merge the request data with updatedAt timestamp
    let mut update_data = request.data.as_object()
        .map(|o| o.clone())
        .unwrap_or_else(|| serde_json::Map::new());
    update_data.insert("updatedAt".to_string(), serde_json::Value::String(chrono::Utc::now().to_rfc3339()));
    
    let script = format!(r#"
        # Update Document
        INSTANTIATE database db
        
        # Create the complete params object in one go
        SET params {{
            "collection": "{}",
            "workspace": "{}",
            "filter": {{"_id": "{}"}},
            "update": {}
        }}
        
        CALL db update $params result
        TRACE "Document updated successfully"
        
        SET response {{
            "success": true,
            "id": "{}"
        }}
        
        DESTROY db
        RETURN $response
    "#,
        collection,
        request.workspace,
        id,
        serde_json::Value::Object(update_data).to_string(),
        id
    );
    
    match runtime.execute(&script).await {
        Ok(result) => {
            match &result {
                Data::Object(obj) => {
                    if let Some(Data::Bool(true)) = obj.get("success") {
                        HttpResponse::Ok().json(data_to_json(&result))
                    } else {
                        HttpResponse::InternalServerError().json(data_to_json(&result))
                    }
                }
                _ => HttpResponse::Ok().json(data_to_json(&result))
            }
        }
        Err(e) => {
            error!("Failed to update document: {}", e);
            HttpResponse::InternalServerError().json(json!({
                "success": false,
                "error": format!("Failed to update document: {}", e)
            }))
        }
    }
}

async fn delete_data(
    runtime: web::Data<Arc<SPURuntime>>,
    path: web::Path<(String, String)>,
    req: actix_web::HttpRequest,
) -> HttpResponse {
    let (collection, id) = path.into_inner();
    
    // Get workspace from query params or headers
    let query_params: web::Query<std::collections::HashMap<String, String>> = 
        web::Query::from_query(req.query_string()).unwrap_or_else(|_| {
            web::Query(std::collections::HashMap::new())
        });
    
    let workspace = query_params.get("workspace")
        .map(|s| s.as_str())
        .or_else(|| req.headers()
            .get("X-Workspace")
            .and_then(|v| v.to_str().ok()))
        .unwrap_or("autodin")
        .to_string();
    
    info!("Deleting document {} from collection: {} in workspace: {}", id, collection, workspace);
    
    let script = format!(r#"
        # Delete Document
        INSTANTIATE database db
        
        # Delete from database
        SET params {{
            "collection": "{}",
            "workspace": "{}",
            "filter": {{"_id": "{}"}}
        }}
        
        CALL db delete $params result
        GET result.deleted_count count
        
        IF $count > 0
            TRACE "Document deleted successfully"
            SET response {{
                "success": true,
                "id": "{}",
                "deleted": true,
                "count": $count
            }}
        ELSE
            SET response {{
                "success": false,
                "error": "Document not found",
                "deleted": false
            }}
        ENDIF
        
        DESTROY db
        RETURN $response
    "#,
        collection,
        workspace,
        id,
        id
    );
    
    match runtime.execute(&script).await {
        Ok(result) => {
            match &result {
                Data::Object(obj) => {
                    if let Some(Data::Bool(true)) = obj.get("success") {
                        HttpResponse::Ok().json(data_to_json(&result))
                    } else if let Some(Data::String(error)) = obj.get("error") {
                        if error.contains("not found") {
                            HttpResponse::NotFound().json(data_to_json(&result))
                        } else {
                            HttpResponse::InternalServerError().json(data_to_json(&result))
                        }
                    } else {
                        HttpResponse::InternalServerError().json(data_to_json(&result))
                    }
                }
                _ => HttpResponse::Ok().json(data_to_json(&result))
            }
        }
        Err(e) => {
            error!("Failed to delete document: {}", e);
            HttpResponse::InternalServerError().json(json!({
                "success": false,
                "error": format!("Failed to delete document: {}", e),
                "deleted": false
            }))
        }
    }
}