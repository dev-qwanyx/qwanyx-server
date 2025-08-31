//! Auth Coprocessor
//! 
//! Handles user authentication logic
//! Delegates email sending to EmailCoprocessor and database operations to DatabaseCoprocessor

use crate::{Coprocessor, CoprocessorError, Data, Health, MethodSignature};
use async_trait::async_trait;
use std::collections::HashMap;
use tracing::{error, info};
use rand::Rng;

/// Auth Coprocessor
/// 
/// Provides authentication functionality without directly handling email or database.
/// This follows the orchestrator pattern - auth knows the logic but delegates the work.
pub struct AuthCoprocessor {
    jwt_secret: String,
}

impl AuthCoprocessor {
    pub fn new() -> Self {
        Self {
            jwt_secret: std::env::var("JWT_SECRET_KEY")
                .unwrap_or_else(|_| "qwanyx-secret-key-change-this-in-production".to_string()),
        }
    }
    
    fn generate_code() -> String {
        let mut rng = rand::thread_rng();
        format!("{:06}", rng.gen_range(100000..999999))
    }
}

impl Default for AuthCoprocessor {
    fn default() -> Self {
        Self::new()
    }
}

#[async_trait]
impl Coprocessor for AuthCoprocessor {
    fn class_name(&self) -> String {
        "auth".to_string()
    }

    fn methods(&self) -> Vec<MethodSignature> {
        vec![
            MethodSignature {
                name: "generate_code".to_string(),
                description: "Generate a 6-digit authentication code".to_string(),
                input_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "email": { 
                            "type": "string",
                            "description": "Email address to generate code for"
                        }
                    },
                    "required": ["email"]
                })),
                output_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "code": { 
                            "type": "string",
                            "description": "6-digit code"
                        },
                        "expires_at": {
                            "type": "string",
                            "description": "ISO timestamp when code expires"
                        }
                    }
                })),
            },
            MethodSignature {
                name: "verify_code".to_string(),
                description: "Verify an authentication code".to_string(),
                input_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "email": { "type": "string" },
                        "code": { "type": "string" }
                    },
                    "required": ["email", "code"]
                })),
                output_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "valid": { "type": "boolean" },
                        "token": { 
                            "type": ["string", "null"],
                            "description": "JWT token if valid"
                        },
                        "error": {
                            "type": ["string", "null"],
                            "description": "Error message if invalid"
                        }
                    }
                })),
            },
            MethodSignature {
                name: "register".to_string(),
                description: "Register a new user (returns data to be stored)".to_string(),
                input_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "email": { "type": "string" },
                        "firstName": { "type": "string" },
                        "lastName": { "type": "string" },
                        "phone": { "type": "string" },
                        "accountType": { "type": "string" },
                        "workspace": { "type": "string" }
                    },
                    "required": ["email"]
                })),
                output_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "user_data": {
                            "type": "object",
                            "description": "User data to be stored in database"
                        },
                        "code": {
                            "type": "string",
                            "description": "Generated verification code"
                        }
                    }
                })),
            },
            MethodSignature {
                name: "generate_token".to_string(),
                description: "Generate a JWT token for a user".to_string(),
                input_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "user_id": { "type": "string" },
                        "email": { "type": "string" },
                        "workspace": { "type": "string" }
                    },
                    "required": ["user_id", "email"]
                })),
                output_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "token": { "type": "string" },
                        "expires_at": { "type": "string" }
                    }
                })),
            },
        ]
    }

    async fn invoke(&self, method: &str, args: Data) -> Result<Data, CoprocessorError> {
        match method {
            "generate_code" => self.generate_auth_code(args).await,
            "verify_code" => self.verify_auth_code(args).await,
            "register" => self.register_user(args).await,
            "generate_token" => self.generate_jwt_token(args).await,
            _ => Err(CoprocessorError::MethodNotFound(method.to_string())),
        }
    }

    async fn health(&self) -> Health {
        Health::Healthy
    }
}

impl AuthCoprocessor {
    async fn generate_auth_code(&self, args: Data) -> Result<Data, CoprocessorError> {
        let email = match args {
            Data::Object(ref obj) => match obj.get("email") {
                Some(Data::String(s)) => s.clone(),
                _ => {
                    return Err(CoprocessorError::InvalidArguments(
                        "Missing or invalid 'email' field".to_string(),
                    ))
                }
            },
            _ => {
                return Err(CoprocessorError::InvalidArguments(
                    "Expected object with 'email' field".to_string(),
                ))
            }
        };
        
        let code = Self::generate_code();
        let expires_at = chrono::Utc::now() + chrono::Duration::minutes(10);
        
        info!("Generated auth code for {}: {}", email, code);
        
        let mut response = HashMap::new();
        response.insert("code".to_string(), Data::String(code));
        response.insert("expires_at".to_string(), Data::String(expires_at.to_rfc3339()));
        
        Ok(Data::Object(response))
    }
    
    async fn verify_auth_code(&self, args: Data) -> Result<Data, CoprocessorError> {
        let (email, code) = match args {
            Data::Object(ref obj) => {
                let email = match obj.get("email") {
                    Some(Data::String(s)) => s.clone(),
                    _ => {
                        return Err(CoprocessorError::InvalidArguments(
                            "Missing or invalid 'email' field".to_string(),
                        ))
                    }
                };
                
                let code = match obj.get("code") {
                    Some(Data::String(s)) => s.clone(),
                    _ => {
                        return Err(CoprocessorError::InvalidArguments(
                            "Missing or invalid 'code' field".to_string(),
                        ))
                    }
                };
                
                (email, code)
            }
            _ => {
                return Err(CoprocessorError::InvalidArguments(
                    "Expected object with 'email' and 'code' fields".to_string(),
                ))
            }
        };
        
        // In a real implementation, this would check against stored codes
        // For now, we'll accept any 6-digit code for testing
        let valid = code.len() == 6 && code.chars().all(|c| c.is_numeric());
        
        let mut response = HashMap::new();
        
        if valid {
            // Generate a mock JWT token
            let token = format!("jwt_token_for_{}", email);
            response.insert("valid".to_string(), Data::Bool(true));
            response.insert("token".to_string(), Data::String(token));
            response.insert("error".to_string(), Data::Null);
            
            info!("Code verified successfully for {}", email);
        } else {
            response.insert("valid".to_string(), Data::Bool(false));
            response.insert("token".to_string(), Data::Null);
            response.insert("error".to_string(), Data::String("Invalid code".to_string()));
            
            error!("Invalid code for {}", email);
        }
        
        Ok(Data::Object(response))
    }
    
    async fn register_user(&self, args: Data) -> Result<Data, CoprocessorError> {
        let user_data = match args {
            Data::Object(ref obj) => {
                // Extract all user fields
                let email = match obj.get("email") {
                    Some(Data::String(s)) => s.clone(),
                    _ => {
                        return Err(CoprocessorError::InvalidArguments(
                            "Missing or invalid 'email' field".to_string(),
                        ))
                    }
                };
                
                let first_name = match obj.get("firstName") {
                    Some(Data::String(s)) => s.clone(),
                    _ => String::new(),
                };
                
                let last_name = match obj.get("lastName") {
                    Some(Data::String(s)) => s.clone(),
                    _ => String::new(),
                };
                
                let phone = match obj.get("phone") {
                    Some(Data::String(s)) => s.clone(),
                    _ => String::new(),
                };
                
                let account_type = match obj.get("accountType") {
                    Some(Data::String(s)) => s.clone(),
                    _ => "particulier".to_string(),
                };
                
                let workspace = match obj.get("workspace") {
                    Some(Data::String(s)) => s.clone(),
                    _ => "autodin".to_string(),
                };
                
                // Build user data object
                let mut user = HashMap::new();
                user.insert("email".to_string(), Data::String(email.clone()));
                user.insert("firstName".to_string(), Data::String(first_name));
                user.insert("lastName".to_string(), Data::String(last_name));
                user.insert("phone".to_string(), Data::String(phone));
                user.insert("accountType".to_string(), Data::String(account_type));
                user.insert("workspace".to_string(), Data::String(workspace));
                user.insert("createdAt".to_string(), Data::String(chrono::Utc::now().to_rfc3339()));
                user.insert("isVerified".to_string(), Data::Bool(false));
                user.insert("authMethod".to_string(), Data::String("code".to_string()));
                
                user
            }
            _ => {
                return Err(CoprocessorError::InvalidArguments(
                    "Expected object with user fields".to_string(),
                ))
            }
        };
        
        // Generate verification code
        let code = Self::generate_code();
        
        info!("Registered user: {:?}", user_data.get("email"));
        
        let mut response = HashMap::new();
        response.insert("user_data".to_string(), Data::Object(user_data));
        response.insert("code".to_string(), Data::String(code));
        
        Ok(Data::Object(response))
    }
    
    async fn generate_jwt_token(&self, args: Data) -> Result<Data, CoprocessorError> {
        let (user_id, email, workspace) = match args {
            Data::Object(ref obj) => {
                let user_id = match obj.get("user_id") {
                    Some(Data::String(s)) => s.clone(),
                    _ => {
                        return Err(CoprocessorError::InvalidArguments(
                            "Missing or invalid 'user_id' field".to_string(),
                        ))
                    }
                };
                
                let email = match obj.get("email") {
                    Some(Data::String(s)) => s.clone(),
                    _ => {
                        return Err(CoprocessorError::InvalidArguments(
                            "Missing or invalid 'email' field".to_string(),
                        ))
                    }
                };
                
                let workspace = match obj.get("workspace") {
                    Some(Data::String(s)) => s.clone(),
                    _ => "autodin".to_string(),
                };
                
                (user_id, email, workspace)
            }
            _ => {
                return Err(CoprocessorError::InvalidArguments(
                    "Expected object with 'user_id' and 'email' fields".to_string(),
                ))
            }
        };
        
        // In a real implementation, this would use jsonwebtoken crate
        // For now, create a mock token
        let token = format!("jwt_{}_{}_{}_{}", 
            user_id, 
            email.replace('@', "_"), 
            workspace,
            chrono::Utc::now().timestamp()
        );
        
        let expires_at = chrono::Utc::now() + chrono::Duration::days(7);
        
        let mut response = HashMap::new();
        response.insert("token".to_string(), Data::String(token));
        response.insert("expires_at".to_string(), Data::String(expires_at.to_rfc3339()));
        
        Ok(Data::Object(response))
    }
}