//! Email Coprocessor
//! 
//! Wraps the existing EmailService to work as an SPU coprocessor
//! following the universal JSON interface contract.

use crate::{Coprocessor, CoprocessorError, Data, Health, MethodSignature};
use async_trait::async_trait;
use std::collections::HashMap;

/// Email Coprocessor
/// 
/// Provides email parsing and sending functionality.
/// Follows the SPU coprocessor contract with JSON in/out interface.
pub struct EmailCoprocessor {
    // In a real implementation, this would hold the EmailService
    // For now, we'll provide mock functionality that matches the interface
}

impl EmailCoprocessor {
    /// Create a new email coprocessor
    pub fn new() -> Self {
        Self {}
    }
}

impl Default for EmailCoprocessor {
    fn default() -> Self {
        Self::new()
    }
}

#[async_trait]
impl Coprocessor for EmailCoprocessor {
    fn class_name(&self) -> String {
        "email".to_string()
    }

    fn methods(&self) -> Vec<MethodSignature> {
        vec![
            MethodSignature {
                name: "parse".to_string(),
                description: "Parse raw email content".to_string(),
                input_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "raw": { 
                            "type": "string",
                            "description": "Raw email content (RFC822 format)"
                        }
                    },
                    "required": ["raw"]
                })),
                output_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "from": { 
                            "type": "string",
                            "description": "Sender email address"
                        },
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
                            "description": "Plain text body"
                        },
                        "html": {
                            "type": ["string", "null"],
                            "description": "HTML body if available"
                        },
                        "date": {
                            "type": ["string", "null"],
                            "description": "Date sent"
                        },
                        "headers": {
                            "type": "object",
                            "description": "Email headers"
                        }
                    }
                })),
            },
            MethodSignature {
                name: "send".to_string(),
                description: "Send an email".to_string(),
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
                            "description": "HTML body (optional)"
                        },
                        "from": {
                            "type": "string",
                            "description": "Sender email (optional, uses default if not provided)"
                        },
                        "cc": {
                            "type": "array",
                            "items": { "type": "string" },
                            "description": "CC recipients"
                        },
                        "bcc": {
                            "type": "array",
                            "items": { "type": "string" },
                            "description": "BCC recipients"
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
                        "id": {
                            "type": "string",
                            "description": "Message ID"
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
                name: "check_inbox".to_string(),
                description: "Check for new emails in inbox".to_string(),
                input_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "folder": {
                            "type": "string",
                            "default": "INBOX",
                            "description": "Folder to check"
                        },
                        "unread_only": {
                            "type": "boolean",
                            "default": true,
                            "description": "Only return unread emails"
                        },
                        "limit": {
                            "type": "number",
                            "default": 10,
                            "description": "Maximum number of emails to return"
                        }
                    }
                })),
                output_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "emails": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "id": { "type": "string" },
                                    "from": { "type": "string" },
                                    "subject": { "type": "string" },
                                    "preview": { "type": "string" },
                                    "date": { "type": "string" },
                                    "unread": { "type": "boolean" }
                                }
                            }
                        },
                        "total": {
                            "type": "number",
                            "description": "Total number of emails found"
                        }
                    }
                })),
            },
            MethodSignature {
                name: "extract_attachments".to_string(),
                description: "Extract attachments from an email".to_string(),
                input_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "raw": {
                            "type": "string",
                            "description": "Raw email content"
                        }
                    },
                    "required": ["raw"]
                })),
                output_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "attachments": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "filename": { "type": "string" },
                                    "content_type": { "type": "string" },
                                    "size": { "type": "number" },
                                    "content": { 
                                        "type": "string",
                                        "description": "Base64 encoded content"
                                    }
                                }
                            }
                        }
                    }
                })),
            },
        ]
    }

    async fn invoke(&self, method: &str, args: Data) -> Result<Data, CoprocessorError> {
        match method {
            "parse" => self.parse_email(args).await,
            "send" => self.send_email(args).await,
            "check_inbox" => self.check_inbox(args).await,
            "extract_attachments" => self.extract_attachments(args).await,
            _ => Err(CoprocessorError::MethodNotFound(method.to_string())),
        }
    }

    async fn health(&self) -> Health {
        // In real implementation, would check IMAP/SMTP connectivity
        // For now, return healthy
        Health::Healthy
    }
}

impl EmailCoprocessor {
    /// Parse email content
    async fn parse_email(&self, args: Data) -> Result<Data, CoprocessorError> {
        let raw = match args {
            Data::Object(ref obj) => match obj.get("raw") {
                Some(Data::String(s)) => s.clone(),
                _ => {
                    return Err(CoprocessorError::InvalidArguments(
                        "Missing or invalid 'raw' field (expected string)".to_string(),
                    ))
                }
            },
            _ => {
                return Err(CoprocessorError::InvalidArguments(
                    "Expected object with 'raw' field".to_string(),
                ))
            }
        };

        // Mock parsing for testing
        // In real implementation, would use mail-parser crate
        let mut response = HashMap::new();
        
        // Extract basic info from raw email (simplified)
        let from = if raw.contains("From:") {
            "sender@example.com".to_string()
        } else {
            "unknown@example.com".to_string()
        };
        
        let subject = if raw.contains("Subject:") {
            "Test Subject".to_string()
        } else {
            "No Subject".to_string()
        };
        
        response.insert("from".to_string(), Data::String(from));
        response.insert("to".to_string(), Data::String("recipient@example.com".to_string()));
        response.insert("subject".to_string(), Data::String(subject));
        response.insert("body".to_string(), Data::String("Email body content".to_string()));
        response.insert("html".to_string(), Data::Null);
        response.insert("date".to_string(), Data::String(chrono::Utc::now().to_rfc3339()));
        
        let mut headers = HashMap::new();
        headers.insert("Message-ID".to_string(), Data::String(format!("<{}@example.com>", uuid::Uuid::new_v4())));
        response.insert("headers".to_string(), Data::Object(headers));

        Ok(Data::Object(response))
    }

    /// Send an email
    async fn send_email(&self, args: Data) -> Result<Data, CoprocessorError> {
        // Extract arguments
        let (to, subject, body) = match args {
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
                
                (to, subject, body)
            }
            _ => {
                return Err(CoprocessorError::InvalidArguments(
                    "Expected object with 'to', 'subject', and 'body' fields".to_string(),
                ))
            }
        };

        // Mock sending
        // In real implementation, would use SMTP
        let mut response = HashMap::new();
        response.insert("sent".to_string(), Data::Bool(true));
        response.insert("id".to_string(), Data::String(format!("<{}@example.com>", uuid::Uuid::new_v4())));
        response.insert("timestamp".to_string(), Data::String(chrono::Utc::now().to_rfc3339()));
        response.insert("error".to_string(), Data::Null);

        // Log the email that would be sent
        tracing::info!("Would send email to {:?}: {} - {}", to, subject, body);

        Ok(Data::Object(response))
    }

    /// Check inbox for new emails
    async fn check_inbox(&self, args: Data) -> Result<Data, CoprocessorError> {
        // Extract optional parameters
        let (folder, unread_only, limit) = if let Data::Object(ref obj) = args {
            let folder = match obj.get("folder") {
                Some(Data::String(s)) => s.clone(),
                _ => "INBOX".to_string(),
            };
            
            let unread_only = match obj.get("unread_only") {
                Some(Data::Bool(b)) => *b,
                _ => true,
            };
            
            let limit = match obj.get("limit") {
                Some(Data::Number(n)) => *n as usize,
                _ => 10,
            };
            
            (folder, unread_only, limit)
        } else {
            ("INBOX".to_string(), true, 10)
        };

        // Mock inbox check
        let mut emails = Vec::new();
        
        // Add some mock emails
        for i in 0..limit.min(3) {
            let mut email = HashMap::new();
            email.insert("id".to_string(), Data::String(format!("msg_{}", i + 1)));
            email.insert("from".to_string(), Data::String(format!("sender{}@example.com", i)));
            email.insert("subject".to_string(), Data::String(format!("Test Email {}", i + 1)));
            email.insert("preview".to_string(), Data::String("This is a preview of the email...".to_string()));
            email.insert("date".to_string(), Data::String(chrono::Utc::now().to_rfc3339()));
            email.insert("unread".to_string(), Data::Bool(unread_only));
            emails.push(Data::Object(email));
        }

        let mut response = HashMap::new();
        response.insert("emails".to_string(), Data::Array(emails));
        response.insert("total".to_string(), Data::Number(3.0));

        tracing::info!("Checked {} folder (unread_only={}, limit={})", folder, unread_only, limit);

        Ok(Data::Object(response))
    }

    /// Extract attachments from an email
    async fn extract_attachments(&self, args: Data) -> Result<Data, CoprocessorError> {
        let _raw = match args {
            Data::Object(ref obj) => match obj.get("raw") {
                Some(Data::String(s)) => s.clone(),
                _ => {
                    return Err(CoprocessorError::InvalidArguments(
                        "Missing or invalid 'raw' field".to_string(),
                    ))
                }
            },
            _ => {
                return Err(CoprocessorError::InvalidArguments(
                    "Expected object with 'raw' field".to_string(),
                ))
            }
        };

        // Mock attachment extraction
        let attachments = Vec::new(); // No attachments in mock

        let mut response = HashMap::new();
        response.insert("attachments".to_string(), Data::Array(attachments));

        Ok(Data::Object(response))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_class_name() {
        let coprocessor = EmailCoprocessor::new();
        assert_eq!(coprocessor.class_name(), "email");
    }

    #[tokio::test]
    async fn test_methods_list() {
        let coprocessor = EmailCoprocessor::new();
        let methods = coprocessor.methods();
        assert_eq!(methods.len(), 4);
        
        let method_names: Vec<String> = methods.iter().map(|m| m.name.clone()).collect();
        assert!(method_names.contains(&"parse".to_string()));
        assert!(method_names.contains(&"send".to_string()));
        assert!(method_names.contains(&"check_inbox".to_string()));
        assert!(method_names.contains(&"extract_attachments".to_string()));
    }

    #[tokio::test]
    async fn test_parse_email() {
        let coprocessor = EmailCoprocessor::new();
        
        let mut args = HashMap::new();
        args.insert("raw".to_string(), Data::String("From: test@example.com\nSubject: Test\n\nBody".to_string()));
        
        let result = coprocessor.invoke("parse", Data::Object(args)).await;
        assert!(result.is_ok());
        
        if let Ok(Data::Object(response)) = result {
            assert!(response.contains_key("from"));
            assert!(response.contains_key("subject"));
            assert!(response.contains_key("body"));
        }
    }

    #[tokio::test]
    async fn test_send_email() {
        let coprocessor = EmailCoprocessor::new();
        
        let mut args = HashMap::new();
        args.insert("to".to_string(), Data::String("recipient@example.com".to_string()));
        args.insert("subject".to_string(), Data::String("Test Subject".to_string()));
        args.insert("body".to_string(), Data::String("Test body".to_string()));
        
        let result = coprocessor.invoke("send", Data::Object(args)).await;
        assert!(result.is_ok());
        
        if let Ok(Data::Object(response)) = result {
            assert!(response.contains_key("sent"));
            assert!(response.contains_key("id"));
            if let Some(Data::Bool(sent)) = response.get("sent") {
                assert!(*sent);
            }
        }
    }
}