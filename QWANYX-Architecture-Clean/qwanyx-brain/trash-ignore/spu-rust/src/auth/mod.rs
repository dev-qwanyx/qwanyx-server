//! Authentication module - JWT and passwordless auth

use actix_web::{HttpResponse, Result};
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use lettre::message::header::ContentType;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};
use mongodb::bson::{doc, Document};
use mongodb::{Client as MongoClient, Collection};
use rand::Rng;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tracing::{error, info};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,        // user_id
    pub email: String,
    pub workspace: String,
    pub exp: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<mongodb::bson::oid::ObjectId>,
    pub email: String,
    #[serde(default)]
    pub first_name: String,
    #[serde(default)]
    pub last_name: String,
    #[serde(default)]
    pub phone: String,
    #[serde(default)]
    pub account_type: String,
    #[serde(default)]
    pub workspace: String,
    pub created_at: chrono::DateTime<Utc>,
    pub last_login: Option<chrono::DateTime<Utc>>,
    #[serde(default)]
    pub is_verified: bool,
    #[serde(default)]
    pub auth_method: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AuthCode {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<mongodb::bson::oid::ObjectId>,
    pub email: String,
    pub code: String,
    pub created_at: chrono::DateTime<Utc>,
    pub expires_at: chrono::DateTime<Utc>,
    pub used: bool,
    pub used_at: Option<chrono::DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct RegisterRequest {
    pub email: String,
    #[serde(default)]
    pub first_name: String,
    #[serde(default)]
    pub last_name: String,
    #[serde(default)]
    pub phone: String,
    #[serde(default)]
    pub account_type: String,
    #[serde(default)]
    pub workspace: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    #[serde(default)]
    pub workspace: String,
}

#[derive(Debug, Deserialize)]
pub struct VerifyCodeRequest {
    pub email: String,
    pub code: String,
}

#[derive(Debug, Serialize)]
pub struct AuthResponse {
    pub success: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub requires_code: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none", rename = "access_token")]
    pub token: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub user: Option<UserInfo>,
}

#[derive(Debug, Serialize)]
pub struct UserInfo {
    pub id: String,
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub workspace: String,
}

pub struct AuthService {
    pub mongo_client: Arc<MongoClient>,
    pub jwt_secret: String,
    pub smtp_config: SmtpConfig,
}

pub struct SmtpConfig {
    pub host: String,
    pub port: u16,
    pub user: String,
    pub password: String,
    pub from: String,
}

impl AuthService {
    pub fn new(mongo_client: Arc<MongoClient>) -> Self {
        Self {
            mongo_client,
            jwt_secret: std::env::var("JWT_SECRET_KEY")
                .unwrap_or_else(|_| "qwanyx-secret-key-change-this-in-production".to_string()),
            smtp_config: SmtpConfig {
                host: std::env::var("SMTP_HOST")
                    .unwrap_or_else(|_| "email-smtp.us-east-1.amazonaws.com".to_string()),
                port: std::env::var("SMTP_PORT")
                    .unwrap_or_else(|_| "587".to_string())
                    .parse()
                    .unwrap_or(587),
                user: std::env::var("SMTP_USER")
                    .unwrap_or_else(|_| "AKIASIUVSCNOIYDDKYUC".to_string()),
                password: std::env::var("SMTP_PASS")
                    .unwrap_or_else(|_| "BI222lL2lNMOLeHvX7+sHZoAyrkPWXozXsiIkwplaXNX".to_string()),
                from: std::env::var("SMTP_FROM")
                    .unwrap_or_else(|_| "Phil QWANYX <phil@qwanyx.com>".to_string()),
            },
        }
    }

    fn get_db(&self) -> mongodb::Database {
        self.mongo_client.database("autodin")
    }

    fn users_collection(&self) -> Collection<Document> {
        self.get_db().collection("users")
    }

    fn auth_codes_collection(&self) -> Collection<Document> {
        self.get_db().collection("auth_codes")
    }

    fn generate_code() -> String {
        let mut rng = rand::thread_rng();
        format!("{:06}", rng.gen_range(100000..999999))
    }

    async fn send_auth_email(&self, email: &str, code: &str, workspace: &str) -> anyhow::Result<()> {
        let workspace_name = if workspace == "autodin" { "Autodin" } else { "QWANYX" };
        
        let email_body = format!(
            r#"<html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Votre code de connexion {}</h2>
                <p>Utilisez ce code pour vous connecter :</p>
                <h1 style="background: #f0f0f0; padding: 20px; text-align: center; letter-spacing: 5px;">
                    {}
                </h1>
                <p>Ce code expire dans 10 minutes.</p>
                <p>Si vous n'avez pas demandé ce code, ignorez cet email.</p>
            </body>
            </html>"#,
            workspace_name, code
        );

        let message = Message::builder()
            .from(self.smtp_config.from.parse()?)
            .to(email.parse()?)
            .subject(format!("{} - Code de connexion", workspace_name))
            .header(ContentType::TEXT_HTML)
            .body(email_body)?;

        let creds = Credentials::new(
            self.smtp_config.user.clone(),
            self.smtp_config.password.clone(),
        );

        // Use STARTTLS for port 587 (AWS SES requirement)
        let mailer = if self.smtp_config.port == 587 {
            SmtpTransport::starttls_relay(&self.smtp_config.host)?
                .port(self.smtp_config.port)
                .credentials(creds)
                .build()
        } else {
            // Use direct TLS for port 465
            SmtpTransport::relay(&self.smtp_config.host)?
                .port(self.smtp_config.port)
                .credentials(creds)
                .build()
        };

        mailer.send(&message)?;
        info!("Email sent to {} with code", email);
        
        Ok(())
    }

    fn generate_jwt(&self, user_id: &str, email: &str, workspace: &str) -> anyhow::Result<String> {
        let expiration = Utc::now()
            .checked_add_signed(Duration::days(7))
            .expect("valid timestamp")
            .timestamp();

        let claims = Claims {
            sub: user_id.to_string(),
            email: email.to_string(),
            workspace: workspace.to_string(),
            exp: expiration,
        };

        let token = encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.jwt_secret.as_ref()),
        )?;

        Ok(token)
    }

    pub async fn register(&self, req: RegisterRequest) -> Result<HttpResponse> {
        let users = self.users_collection();
        
        // Check if user exists
        let existing = users
            .find_one(doc! { "email": &req.email }, None)
            .await
            .map_err(|e| {
                error!("Database error: {}", e);
                actix_web::error::ErrorInternalServerError("Database error")
            })?;

        if existing.is_some() {
            return Ok(HttpResponse::BadRequest().json(serde_json::json!({
                "error": "User already exists"
            })));
        }

        // Create user
        let now = Utc::now();
        let workspace = if req.workspace.is_empty() { "autodin" } else { &req.workspace };
        
        let user_doc = doc! {
            "email": &req.email,
            "firstName": &req.first_name,
            "lastName": &req.last_name,
            "phone": &req.phone,
            "accountType": if req.account_type.is_empty() { "particulier" } else { &req.account_type },
            "workspace": workspace,
            "createdAt": bson::DateTime::from_system_time(std::time::SystemTime::from(now)),
            "lastLogin": bson::Bson::Null,
            "isVerified": false,
            "authMethod": "code"
        };

        let _insert_result = users.insert_one(user_doc, None).await.map_err(|e| {
            error!("Failed to create user: {}", e);
            actix_web::error::ErrorInternalServerError("Failed to create user")
        })?;

        // Generate and store auth code
        let code = Self::generate_code();
        let auth_codes = self.auth_codes_collection();
        
        let auth_code_doc = doc! {
            "email": &req.email,
            "code": &code,
            "createdAt": bson::DateTime::from_system_time(std::time::SystemTime::from(now)),
            "expiresAt": bson::DateTime::from_system_time(std::time::SystemTime::from(now + Duration::minutes(10))),
            "used": false
        };

        auth_codes.insert_one(auth_code_doc, None).await.map_err(|e| {
            error!("Failed to store auth code: {}", e);
            actix_web::error::ErrorInternalServerError("Failed to store auth code")
        })?;

        // Send email (don't fail if email fails)
        if let Err(e) = self.send_auth_email(&req.email, &code, workspace).await {
            error!("Failed to send email: {}, but continuing", e);
        }

        // Always log code for development
        info!("AUTH CODE for {}: {}", req.email, code);

        Ok(HttpResponse::Ok().json(AuthResponse {
            success: true,
            message: Some("Registration successful. Check your email for verification code.".to_string()),
            requires_code: Some(true),
            token: None,
            user: None,
        }))
    }

    pub async fn request_code(&self, req: LoginRequest) -> Result<HttpResponse> {
        let users = self.users_collection();
        
        // Check if user exists
        let user = users
            .find_one(doc! { "email": &req.email }, None)
            .await
            .map_err(|e| {
                error!("Database error: {}", e);
                actix_web::error::ErrorInternalServerError("Database error")
            })?;

        if user.is_none() {
            return Ok(HttpResponse::NotFound().json(serde_json::json!({
                "error": "Aucun compte trouvé avec cet email. Veuillez vous inscrire."
            })));
        }

        // Generate new code
        let code = Self::generate_code();
        let auth_codes = self.auth_codes_collection();
        let now = Utc::now();

        // Invalidate old codes
        auth_codes
            .update_many(
                doc! { "email": &req.email, "used": false },
                doc! { "$set": { "used": true } },
                None,
            )
            .await
            .map_err(|e| {
                error!("Failed to invalidate old codes: {}", e);
                actix_web::error::ErrorInternalServerError("Database error")
            })?;

        // Insert new code
        let auth_code_doc = doc! {
            "email": &req.email,
            "code": &code,
            "createdAt": bson::DateTime::from_system_time(std::time::SystemTime::from(now)),
            "expiresAt": bson::DateTime::from_system_time(std::time::SystemTime::from(now + Duration::minutes(10))),
            "used": false
        };

        auth_codes.insert_one(auth_code_doc, None).await.map_err(|e| {
            error!("Failed to store auth code: {}", e);
            actix_web::error::ErrorInternalServerError("Failed to store auth code")
        })?;

        let workspace = if req.workspace.is_empty() { "autodin" } else { &req.workspace };
        
        // Send email - NO FALLBACKS, NO CLEANUP, JUST FAIL
        self.send_auth_email(&req.email, &code, workspace).await.map_err(|e| {
            error!("EMAIL SEND FAILED: {} - {}", req.email, e);
            actix_web::error::ErrorInternalServerError(format!("Email sending failed: {}", e))
        })?;

        info!("Email successfully sent to {} with auth code", req.email);

        Ok(HttpResponse::Ok().json(AuthResponse {
            success: true,
            message: Some("Code sent".to_string()),
            requires_code: Some(true),
            token: None,
            user: None,
        }))
    }

    pub async fn verify_code(&self, req: VerifyCodeRequest) -> Result<HttpResponse> {
        let auth_codes = self.auth_codes_collection();
        let now = Utc::now();
        
        // Find valid code
        let auth_code = auth_codes
            .find_one(
                doc! {
                    "email": &req.email,
                    "code": &req.code,
                    "used": false,
                    "expiresAt": { "$gt": bson::DateTime::from_system_time(std::time::SystemTime::from(now)) }
                },
                None,
            )
            .await
            .map_err(|e| {
                error!("Database error: {}", e);
                actix_web::error::ErrorInternalServerError("Database error")
            })?;

        if auth_code.is_none() {
            return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
                "error": "Invalid or expired code"
            })));
        }

        let auth_code_doc = auth_code.unwrap();
        let auth_code_id = auth_code_doc.get_object_id("_id").unwrap();

        // Mark code as used
        auth_codes
            .update_one(
                doc! { "_id": auth_code_id },
                doc! { "$set": { "used": true, "usedAt": bson::DateTime::from_system_time(std::time::SystemTime::from(now)) } },
                None,
            )
            .await
            .map_err(|e| {
                error!("Failed to update auth code: {}", e);
                actix_web::error::ErrorInternalServerError("Database error")
            })?;

        // Get user
        let users = self.users_collection();
        let user_doc = users
            .find_one(doc! { "email": &req.email }, None)
            .await
            .map_err(|e| {
                error!("Database error: {}", e);
                actix_web::error::ErrorInternalServerError("Database error")
            })?;

        if user_doc.is_none() {
            return Ok(HttpResponse::NotFound().json(serde_json::json!({
                "error": "User not found"
            })));
        }

        let user = user_doc.unwrap();
        let user_id = user.get_object_id("_id").unwrap().to_hex();
        let email = user.get_str("email").unwrap_or("");
        let workspace = user.get_str("workspace").unwrap_or("autodin");

        // Update last login
        users
            .update_one(
                doc! { "email": &req.email },
                doc! {
                    "$set": {
                        "lastLogin": bson::DateTime::from_system_time(std::time::SystemTime::from(now)),
                        "isVerified": true
                    }
                },
                None,
            )
            .await
            .map_err(|e| {
                error!("Failed to update user: {}", e);
                actix_web::error::ErrorInternalServerError("Database error")
            })?;

        // Generate JWT
        let token = self.generate_jwt(&user_id, email, workspace).map_err(|e| {
            error!("Failed to generate token: {}", e);
            actix_web::error::ErrorInternalServerError("Failed to generate token")
        })?;

        info!("User logged in with code: {}", email);

        Ok(HttpResponse::Ok().json(AuthResponse {
            success: true,
            message: None,
            requires_code: None,
            token: Some(token),
            user: Some(UserInfo {
                id: user_id,
                email: email.to_string(),
                first_name: user.get_str("firstName").unwrap_or("").to_string(),
                last_name: user.get_str("lastName").unwrap_or("").to_string(),
                workspace: workspace.to_string(),
            }),
        }))
    }

    pub async fn verify_token(&self, token: &str) -> Result<HttpResponse> {
        let token_data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.jwt_secret.as_ref()),
            &Validation::new(Algorithm::HS256),
        );

        match token_data {
            Ok(data) => {
                Ok(HttpResponse::Ok().json(serde_json::json!({
                    "valid": true,
                    "user": {
                        "id": data.claims.sub,
                        "email": data.claims.email,
                        "workspace": data.claims.workspace
                    }
                })))
            }
            Err(e) => {
                error!("Invalid token: {}", e);
                Ok(HttpResponse::Unauthorized().json(serde_json::json!({
                    "error": "Invalid token"
                })))
            }
        }
    }
}