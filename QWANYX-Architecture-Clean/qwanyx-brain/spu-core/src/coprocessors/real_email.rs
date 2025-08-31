//! Real Email Coprocessor with AWS SES
//! 
//! Actually sends and receives emails using the same configuration
//! as the working spu-rust implementation

use crate::{Coprocessor, CoprocessorError, Data, Health, MethodSignature};
use async_trait::async_trait;
use lettre::{
    message::{header::ContentType, Message},
    transport::smtp::authentication::Credentials,
    AsyncSmtpTransport, AsyncTransport,
};
use std::collections::HashMap;
use tracing::{error, info};

/// SMTP Configuration
#[derive(Debug, Clone)]
pub struct SmtpConfig {
    pub host: String,
    pub port: u16,
    pub user: String,
    pub password: String,
    pub from: String,
}

impl SmtpConfig {
    pub fn from_env() -> Self {
        Self {
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
        }
    }
}

/// Real Email Coprocessor using AWS SES
pub struct RealEmailCoprocessor {
    smtp_config: SmtpConfig,
}

impl RealEmailCoprocessor {
    pub fn new() -> Self {
        Self {
            smtp_config: SmtpConfig::from_env(),
        }
    }
    
    async fn send_email_internal(
        &self,
        to: Vec<String>,
        subject: String,
        body: String,
        html: Option<String>,
    ) -> Result<String, String> {
        // Build the email
        let mut message_builder = Message::builder()
            .from(self.smtp_config.from.parse().map_err(|e| format!("Invalid from address: {}", e))?)
            .subject(subject);
        
        // Add all recipients
        for recipient in &to {
            message_builder = message_builder.to(recipient.parse().map_err(|e| format!("Invalid recipient {}: {}", recipient, e))?);
        }
        
        // Set content type and body
        let message = if let Some(html_content) = html {
            message_builder
                .header(ContentType::TEXT_HTML)
                .body(html_content)
        } else {
            message_builder
                .header(ContentType::TEXT_PLAIN)
                .body(body)
        }.map_err(|e| format!("Failed to build message: {}", e))?;
        
        // Create SMTP transport
        let creds = Credentials::new(
            self.smtp_config.user.clone(),
            self.smtp_config.password.clone(),
        );
        
        // Use STARTTLS for port 587 (AWS SES requirement)
        let mailer = if self.smtp_config.port == 587 {
            AsyncSmtpTransport::<lettre::Tokio1Executor>::starttls_relay(&self.smtp_config.host)
                .map_err(|e| format!("Failed to create transport: {}", e))?
                .port(self.smtp_config.port)
                .credentials(creds)
                .timeout(Some(std::time::Duration::from_secs(10))) // Fail fast - Jidoka principle
                .build()
        } else {
            // Use direct TLS for port 465
            AsyncSmtpTransport::<lettre::Tokio1Executor>::relay(&self.smtp_config.host)
                .map_err(|e| format!("Failed to create transport: {}", e))?
                .port(self.smtp_config.port)
                .credentials(creds)
                .timeout(Some(std::time::Duration::from_secs(10))) // Fail fast - Jidoka principle
                .build()
        };
        
        // Send the email
        let result = mailer.send(message).await
            .map_err(|e| format!("Failed to send email: {}", e))?;
        
        info!("Email sent successfully to {:?}", to);
        Ok(result.code().to_string())
    }
}

impl Default for RealEmailCoprocessor {
    fn default() -> Self {
        Self::new()
    }
}

#[async_trait]
impl Coprocessor for RealEmailCoprocessor {
    fn class_name(&self) -> String {
        "email".to_string()
    }

    fn methods(&self) -> Vec<MethodSignature> {
        vec![
            MethodSignature {
                name: "send".to_string(),
                description: "Send an email via AWS SES".to_string(),
                input_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "to": { 
                            "type": ["string", "array"],
                            "description": "Recipient email address(es)"
                        },
                        "subject": { 
                            "type": "string",
                            "description": "Email subject"
                        },
                        "body": { 
                            "type": "string",
                            "description": "Email body (plain text)"
                        },
                        "html": {
                            "type": "string",
                            "description": "HTML body (optional, takes precedence over body)"
                        }
                    },
                    "required": ["to", "subject", "body"]
                })),
                output_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "sent": { 
                            "type": "boolean",
                            "description": "Whether the email was sent successfully"
                        },
                        "message_id": {
                            "type": "string",
                            "description": "SMTP response code"
                        },
                        "timestamp": {
                            "type": "string",
                            "description": "ISO timestamp when sent"
                        },
                        "error": {
                            "type": ["string", "null"],
                            "description": "Error message if sending failed"
                        }
                    }
                })),
            },
            MethodSignature {
                name: "send_code".to_string(),
                description: "Send authentication code email".to_string(),
                input_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "to": { 
                            "type": "string",
                            "description": "Recipient email"
                        },
                        "code": { 
                            "type": "string",
                            "description": "Authentication code"
                        },
                        "workspace": {
                            "type": "string",
                            "default": "QWANYX",
                            "description": "Workspace name"
                        }
                    },
                    "required": ["to", "code"]
                })),
                output_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "sent": { "type": "boolean" },
                        "error": { "type": ["string", "null"] }
                    }
                })),
            },
        ]
    }

    async fn invoke(&self, method: &str, args: Data) -> Result<Data, CoprocessorError> {
        match method {
            "send" => self.send_email(args).await,
            "send_code" => self.send_auth_code(args).await,
            _ => Err(CoprocessorError::MethodNotFound(method.to_string())),
        }
    }

    async fn health(&self) -> Health {
        // Could test SMTP connection here
        // For now, return healthy if config is loaded
        if !self.smtp_config.host.is_empty() {
            Health::Healthy
        } else {
            Health::Unhealthy {
                error: "SMTP configuration missing".to_string(),
            }
        }
    }
}

impl RealEmailCoprocessor {
    async fn send_email(&self, args: Data) -> Result<Data, CoprocessorError> {
        // Extract arguments
        let (to, subject, body, html) = match args {
            Data::Object(ref obj) => {
                let to = match obj.get("to") {
                    Some(Data::String(s)) => vec![s.clone()],
                    Some(Data::Array(arr)) => {
                        arr.iter()
                            .filter_map(|d| if let Data::String(s) = d { Some(s.clone()) } else { None })
                            .collect()
                    }
                    _ => {
                        return Err(CoprocessorError::InvalidArguments(
                            "Missing or invalid 'to' field".to_string(),
                        ))
                    }
                };
                
                let subject = match obj.get("subject") {
                    Some(Data::String(s)) => s.clone(),
                    _ => {
                        return Err(CoprocessorError::InvalidArguments(
                            "Missing or invalid 'subject' field".to_string(),
                        ))
                    }
                };
                
                let body = match obj.get("body") {
                    Some(Data::String(s)) => s.clone(),
                    _ => {
                        return Err(CoprocessorError::InvalidArguments(
                            "Missing or invalid 'body' field".to_string(),
                        ))
                    }
                };
                
                let html = match obj.get("html") {
                    Some(Data::String(s)) => Some(s.clone()),
                    _ => None,
                };
                
                (to, subject, body, html)
            }
            _ => {
                return Err(CoprocessorError::InvalidArguments(
                    "Expected object with 'to', 'subject', and 'body' fields".to_string(),
                ))
            }
        };

        // Actually send the email via AWS SES
        match self.send_email_internal(to.clone(), subject, body, html).await {
            Ok(message_id) => {
                info!("Email sent successfully to {:?}", to);
                
                let mut response = HashMap::new();
                response.insert("sent".to_string(), Data::Bool(true));
                response.insert("message_id".to_string(), Data::String(message_id));
                response.insert("timestamp".to_string(), Data::String(chrono::Utc::now().to_rfc3339()));
                response.insert("error".to_string(), Data::Null);
                
                Ok(Data::Object(response))
            }
            Err(e) => {
                error!("Failed to send email: {}", e);
                
                // Following Jidoka principle - fail visibly
                Err(CoprocessorError::ExecutionError(format!("Email sending failed: {}", e)))
            }
        }
    }
    
    async fn send_auth_code(&self, args: Data) -> Result<Data, CoprocessorError> {
        let (to, code, workspace) = match args {
            Data::Object(ref obj) => {
                let to = match obj.get("to") {
                    Some(Data::String(s)) => s.clone(),
                    _ => {
                        return Err(CoprocessorError::InvalidArguments(
                            "Missing or invalid 'to' field".to_string(),
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
                
                let workspace = match obj.get("workspace") {
                    Some(Data::String(s)) => s.clone(),
                    _ => "QWANYX".to_string(),
                };
                
                (to, code, workspace)
            }
            _ => {
                return Err(CoprocessorError::InvalidArguments(
                    "Expected object with 'to' and 'code' fields".to_string(),
                ))
            }
        };
        
        // Build auth email HTML
        let html_body = format!(
            r#"<html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Your {} Login Code</h2>
                <p>Use this code to complete your login:</p>
                <h1 style="background: #f0f0f0; padding: 20px; text-align: center; letter-spacing: 5px;">
                    {}
                </h1>
                <p>This code expires in 10 minutes.</p>
                <p>If you didn't request this code, please ignore this email.</p>
            </body>
            </html>"#,
            workspace, code
        );
        
        let subject = format!("{} - Login Code", workspace);
        
        // Send the email
        match self.send_email_internal(vec![to.clone()], subject, code.clone(), Some(html_body)).await {
            Ok(_) => {
                info!("Auth code sent to {}", to);
                
                let mut response = HashMap::new();
                response.insert("sent".to_string(), Data::Bool(true));
                response.insert("error".to_string(), Data::Null);
                
                Ok(Data::Object(response))
            }
            Err(e) => {
                error!("Failed to send auth code: {}", e);
                
                // Jidoka principle - fail visibly
                Err(CoprocessorError::ExecutionError(format!("Failed to send auth code: {}", e)))
            }
        }
    }
}