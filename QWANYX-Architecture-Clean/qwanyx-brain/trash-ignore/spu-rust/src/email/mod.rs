//! Email module - IMAP/SMTP processing for QWANYX Brain

use anyhow::Result;
use imap::Session;
use native_tls::TlsStream;
use std::net::TcpStream;
use std::sync::Arc;
use tracing::{error, info, warn};
use mongodb::{Client as MongoClient, bson::doc};

pub struct EmailService {
    imap_host: String,
    imap_port: u16,
    imap_user: String,
    imap_password: String,
    check_interval_seconds: u64,
    mongo_client: Arc<MongoClient>,
}

impl EmailService {
    pub fn new(mongo_client: Arc<MongoClient>) -> Self {
        Self {
            imap_host: std::env::var("IMAP_HOST").unwrap_or_else(|_| "mail.qwanyx.com".to_string()),
            imap_port: std::env::var("IMAP_PORT").unwrap_or_else(|_| "993".to_string()).parse().unwrap_or(993),
            imap_user: std::env::var("IMAP_USER").unwrap_or_else(|_| "phil@qwanyx.com".to_string()),
            imap_password: std::env::var("IMAP_PASSWORD").unwrap_or_else(|_| "password".to_string()),
            check_interval_seconds: std::env::var("CHECK_INTERVAL_SECONDS").unwrap_or_else(|_| "30".to_string()).parse().unwrap_or(30),
            mongo_client,
        }
    }

    /// Connect to IMAP server and return session
    pub fn connect_imap(&self) -> Result<Session<TlsStream<TcpStream>>> {
        info!("Connecting to IMAP server: {}", self.imap_host);
        
        // Create TLS connector - Allow invalid certificates for testing
        let tls = native_tls::TlsConnector::builder()
            .danger_accept_invalid_certs(true)
            .build()?;
        
        // Connect to IMAP server
        let client = imap::connect(
            (self.imap_host.as_str(), self.imap_port),
            &self.imap_host,
            &tls,
        )?;
        
        // Login
        let mut imap_session = client
            .login(&self.imap_user, &self.imap_password)
            .map_err(|e| anyhow::anyhow!("IMAP login failed: {:?}", e))?;
        
        info!("Successfully connected to IMAP as {}", self.imap_user);
        
        // Select INBOX
        imap_session.select("INBOX")?;
        
        Ok(imap_session)
    }
    
    /// Check for new emails and process them
    pub async fn check_new_emails(&self) -> Result<Vec<ProcessedEmail>> {
        // Connect to IMAP for this check
        let mut session = self.connect_imap()?;
        let mut processed = Vec::new();
        
        // Search for unseen messages
        let messages = session.search("UNSEEN")?;
        
        if messages.is_empty() {
            return Ok(processed);
        }
        
        info!("Found {} new emails", messages.len());
        
        for msg_id in messages.iter() {
            match self.process_email(&mut session, *msg_id).await {
                Ok(email) => {
                    info!("Processed email from: {}", email.from);
                    processed.push(email);
                    
                    // Mark as seen
                    session.store(format!("{}", msg_id), "+FLAGS (\\Seen)")?;
                }
                Err(e) => {
                    error!("Failed to process email {}: {}", msg_id, e);
                }
            }
        }
        
        Ok(processed)
    }
    
    /// Process a single email
    async fn process_email(&self, session: &mut Session<TlsStream<TcpStream>>, msg_id: u32) -> Result<ProcessedEmail> {
        // Fetch the message
        let messages = session.fetch(msg_id.to_string(), "RFC822")?;
        let message = messages
            .iter()
            .next()
            .ok_or_else(|| anyhow::anyhow!("Message not found"))?;
        
        let body = message
            .body()
            .ok_or_else(|| anyhow::anyhow!("No message body"))?;
        
        // Parse email using mail-parser
        let parsed = mail_parser::MessageParser::default()
            .parse(body)
            .ok_or_else(|| anyhow::anyhow!("Failed to parse email"))?;
        
        let from = parsed.from()
            .and_then(|addrs| addrs.first())
            .and_then(|addr| addr.address())
            .unwrap_or("unknown")
            .to_string();
        
        let subject = parsed.subject()
            .unwrap_or("No subject")
            .to_string();
        
        let text_body = parsed.body_text(0)
            .map(|s| s.to_string())
            .unwrap_or_else(|| "No text body".to_string());
        
        let html_body = parsed.body_html(0)
            .map(|s| s.to_string());
        
        // Store in MongoDB
        let email_doc = doc! {
            "from": &from,
            "subject": &subject,
            "text_body": &text_body,
            "html_body": html_body.as_ref(),
            "received_at": chrono::Utc::now().to_rfc3339(),
            "processed": false,
            "workspace": "qwanyx"
        };
        
        let collection = self.mongo_client
            .database("qwanyx_brain")
            .collection("emails");
        
        collection.insert_one(email_doc, None).await?;
        
        info!("Email stored in MongoDB: {} - {}", from, subject);
        
        Ok(ProcessedEmail {
            from,
            subject,
            text_body,
            html_body,
        })
    }
    
    /// Start monitoring emails in a loop
    pub async fn start_monitoring(self: Arc<Self>) {
        let check_interval = std::time::Duration::from_secs(self.check_interval_seconds);
        
        info!("Starting email monitoring, checking every {} seconds", self.check_interval_seconds);
        
        loop {
            match self.check_new_emails().await {
                Ok(emails) => {
                    if !emails.is_empty() {
                        info!("Processed {} new emails", emails.len());
                        
                        // TODO: Trigger SPU processing for each email
                        for email in emails {
                            info!("New email: {} - {}", email.from, email.subject);
                            // Here we can trigger semantic processing, AI analysis, etc.
                        }
                    }
                }
                Err(e) => {
                    error!("Error checking emails: {}", e);
                    
                    // Try to reconnect
                    warn!("Attempting to reconnect to IMAP...");
                    // Note: This requires &mut self, so we'd need to refactor for reconnection
                }
            }
            
            tokio::time::sleep(check_interval).await;
        }
    }
}

#[derive(Debug, Clone)]
pub struct ProcessedEmail {
    pub from: String,
    pub subject: String,
    pub text_body: String,
    pub html_body: Option<String>,
}