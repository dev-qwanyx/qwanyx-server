//! QWANYX SPU - Main entry point

use actix_web::{web, App, HttpServer, middleware, HttpRequest};
use actix_cors::Cors;
use tracing::{info, error};
use tracing_subscriber::EnvFilter;
use std::sync::Arc;

use qwanyx_spu::{Config, SemanticProcessor};
use mongodb::Client as MongoClient;
use base64::Engine;

mod api;
mod auth;
use api::dh_memory::{push_memory, pull_memory};
use auth::{AuthService, RegisterRequest, LoginRequest, VerifyCodeRequest};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Load .env file from qwanyx-brain directory
    dotenv::from_filename("../../.env").ok();
    dotenv::dotenv().ok();
    
    // Initialize tracing
    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| EnvFilter::new("info"))
        )
        .init();
    
    info!("Starting QWANYX SPU v{}", qwanyx_spu::VERSION);
    
    // Load configuration
    let config = Config::from_env()
        .unwrap_or_else(|e| {
            error!("Failed to load config: {}", e);
            Config::default()
        });
    
    info!("Configuration loaded: {:?}", config.server);
    
    // Initialize SPU
    let spu = Arc::new(
        SemanticProcessor::new(config.spu.clone())
            .expect("Failed to create SPU")
    );
    
    info!("SPU initialized with ID: {}", spu.id);
    
    // Initialize database connections
    let mongo_uri = std::env::var("MONGO_URI")
        .unwrap_or_else(|_| "mongodb://localhost:27017/?serverSelectionTimeoutMS=5000".to_string());
    
    info!("Connecting to MongoDB at {}", mongo_uri);
    let mongo_client = match MongoClient::with_uri_str(&mongo_uri).await {
        Ok(client) => {
            info!("Successfully connected to MongoDB");
            Arc::new(client)
        }
        Err(e) => {
            error!("Failed to connect to MongoDB: {}", e);
            panic!("Cannot start without MongoDB connection");
        }
    };
    
    // Initialize AuthService
    let auth_service = Arc::new(AuthService::new(mongo_client.clone()));
    
    // TODO: Connect to Redis
    
    // Clone config for server
    let server_config = config.server.clone();
    
    // Start HTTP server
    info!("Starting server on {}:{}", server_config.host, server_config.port);
    
    HttpServer::new(move || {
        // Configure CORS
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);
        
        App::new()
            .app_data(web::Data::new(spu.clone()))
            .app_data(web::Data::new(config.clone()))
            .app_data(web::Data::new(mongo_client.clone()))
            .app_data(web::Data::new(auth_service.clone()))
            .wrap(cors)
            .wrap(middleware::Logger::default())
            .wrap(middleware::Compress::default())
            // Health check
            .route("/health", web::get().to(health_check))
            // Authentication endpoints
            .route("/auth/register", web::post().to(auth_register))
            .route("/auth/request-code", web::post().to(auth_request_code))
            .route("/auth/login", web::post().to(auth_request_code)) // Alias
            .route("/auth/verify-code", web::post().to(auth_verify_code))
            .route("/auth/verify", web::get().to(auth_verify_token))
            // SPU endpoints
            .route("/compress", web::post().to(compress_text))
            .route("/analyze", web::post().to(analyze_email))
            .route("/execute", web::post().to(execute_spu))
            // DH Memory API - Compatible with Python Flask API
            .route("/api/dh/push", web::post().to(push_memory))
            .route("/api/dh/pull", web::post().to(pull_memory))
    })
    .bind((server_config.host, server_config.port))?
    .workers(server_config.workers.unwrap_or_else(num_cpus::get))
    .run()
    .await
}

// Handler functions

async fn health_check() -> impl actix_web::Responder {
    actix_web::HttpResponse::Ok().json(serde_json::json!({
        "status": "healthy",
        "version": qwanyx_spu::VERSION,
        "timestamp": chrono::Utc::now().to_rfc3339(),
    }))
}

async fn compress_text(
    spu: web::Data<Arc<SemanticProcessor>>,
    body: web::Json<CompressRequest>,
) -> impl actix_web::Responder {
    match spu.compress(&body.text, body.precision, body.max_chars).await {
        Ok(compressed) => {
            actix_web::HttpResponse::Ok().json(serde_json::json!({
                "compressed": base64::Engine::encode(&base64::engine::general_purpose::STANDARD, &compressed),
                "original_length": body.text.len(),
                "compressed_length": compressed.len(),
                "ratio": body.text.len() as f32 / compressed.len() as f32,
            }))
        }
        Err(e) => {
            actix_web::HttpResponse::InternalServerError().json(serde_json::json!({
                "error": e.to_string(),
            }))
        }
    }
}

async fn analyze_email(
    spu: web::Data<Arc<SemanticProcessor>>,
    body: web::Json<AnalyzeRequest>,
) -> impl actix_web::Responder {
    match spu.analyze_email(&body.email).await {
        Ok(analysis) => actix_web::HttpResponse::Ok().json(analysis),
        Err(e) => {
            actix_web::HttpResponse::InternalServerError().json(serde_json::json!({
                "error": e.to_string(),
            }))
        }
    }
}

async fn execute_spu(
    spu: web::Data<Arc<SemanticProcessor>>,
    body: web::Json<ExecuteRequest>,
) -> impl actix_web::Responder {
    match spu.execute(&body.code).await {
        Ok(result) => {
            actix_web::HttpResponse::Ok().json(serde_json::json!({
                "result": base64::Engine::encode(&base64::engine::general_purpose::STANDARD, &result),
            }))
        }
        Err(e) => {
            actix_web::HttpResponse::InternalServerError().json(serde_json::json!({
                "error": e.to_string(),
            }))
        }
    }
}

// Request types

#[derive(serde::Deserialize)]
struct CompressRequest {
    text: String,
    precision: Option<f32>,
    max_chars: Option<usize>,
}

#[derive(serde::Deserialize)]
struct AnalyzeRequest {
    email: String,
}

#[derive(serde::Deserialize)]
struct ExecuteRequest {
    code: String,
}

// Auth handler functions

async fn auth_register(
    auth: web::Data<Arc<AuthService>>,
    req: web::Json<RegisterRequest>,
) -> impl actix_web::Responder {
    auth.register(req.into_inner()).await
}

async fn auth_request_code(
    auth: web::Data<Arc<AuthService>>,
    req: web::Json<LoginRequest>,
) -> impl actix_web::Responder {
    auth.request_code(req.into_inner()).await
}

async fn auth_verify_code(
    auth: web::Data<Arc<AuthService>>,
    req: web::Json<VerifyCodeRequest>,
) -> impl actix_web::Responder {
    auth.verify_code(req.into_inner()).await
}

async fn auth_verify_token(
    auth: web::Data<Arc<AuthService>>,
    req: HttpRequest,
) -> impl actix_web::Responder {
    let token = req.headers()
        .get("Authorization")
        .and_then(|h| h.to_str().ok())
        .and_then(|h| h.strip_prefix("Bearer "))
        .unwrap_or("");
    
    auth.verify_token(token).await
}

// Add missing dependencies
use base64;
use num_cpus;
