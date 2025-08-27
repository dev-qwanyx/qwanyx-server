//! Configuration for QWANYX SPU

use serde::{Deserialize, Serialize};
use std::path::PathBuf;

/// Main configuration structure
#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Config {
    pub server: ServerConfig,
    pub database: DatabaseConfig,
    pub spu: SPUConfig,
    pub email: EmailConfig,
    pub auth: AuthConfig,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct ServerConfig {
    pub host: String,
    pub port: u16,
    pub workers: Option<usize>,
    pub max_connections: usize,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct DatabaseConfig {
    pub mongodb_uri: String,
    pub mongodb_database: String,
    pub redis_url: Option<String>,
    pub connection_pool_size: u32,
}

#[derive(Debug, Clone, Deserialize, Serialize, Default)]
pub struct SPUConfig {
    /// Maximum number of brains per server
    pub max_brains: usize,
    /// Compression precision (0.0 to 1.0)
    pub default_compression_precision: f32,
    /// Enable continuous thinking
    pub enable_continuous_thinking: bool,
    /// Thinking interval in milliseconds
    pub thinking_interval_ms: u64,
    /// Cache size in MB
    pub cache_size_mb: usize,
    /// Enable GPU acceleration if available
    pub enable_gpu: bool,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct EmailConfig {
    pub imap_host: String,
    pub imap_port: u16,
    pub imap_user: String,
    pub imap_password: String,
    pub smtp_host: String,
    pub smtp_port: u16,
    pub smtp_user: String,
    pub smtp_password: String,
    pub check_interval_seconds: u64,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct AuthConfig {
    pub jwt_secret: String,
    pub jwt_expiration_days: i64,
    pub code_expiration_minutes: i64,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            server: ServerConfig {
                host: "0.0.0.0".to_string(),
                port: 5002,
                workers: None,
                max_connections: 10000,
            },
            database: DatabaseConfig {
                mongodb_uri: "mongodb://localhost:27017".to_string(),
                mongodb_database: "qwanyx_spu".to_string(),
                redis_url: Some("redis://127.0.0.1/".to_string()),
                connection_pool_size: 10,
            },
            spu: SPUConfig {
                max_brains: 1000,
                default_compression_precision: 0.5,
                enable_continuous_thinking: true,
                thinking_interval_ms: 100,
                cache_size_mb: 1024,
                enable_gpu: false,
            },
            email: EmailConfig {
                imap_host: "mail.example.com".to_string(),
                imap_port: 993,
                imap_user: "user@example.com".to_string(),
                imap_password: "password".to_string(),
                smtp_host: "mail.example.com".to_string(),
                smtp_port: 587,
                smtp_user: "user@example.com".to_string(),
                smtp_password: "password".to_string(),
                check_interval_seconds: 30,
            },
            auth: AuthConfig {
                jwt_secret: "change_me_in_production".to_string(),
                jwt_expiration_days: 7,
                code_expiration_minutes: 10,
            },
        }
    }
}

impl Config {
    /// Load configuration from file
    pub fn from_file(path: &PathBuf) -> crate::Result<Self> {
        let settings = config::Config::builder()
            .add_source(config::File::from(path.as_ref()))
            .add_source(config::Environment::with_prefix("QWANYX"))
            .build()
            .map_err(|e| crate::Error::Config(e.to_string()))?;
        
        settings
            .try_deserialize()
            .map_err(|e| crate::Error::Config(e.to_string()))
    }
    
    /// Load from environment variables
    pub fn from_env() -> crate::Result<Self> {
        dotenv::dotenv().ok();
        
        let settings = config::Config::builder()
            .add_source(config::Config::try_from(&Config::default())
                .map_err(|e| crate::Error::Config(e.to_string()))?)
            .add_source(config::Environment::with_prefix("QWANYX"))
            .build()
            .map_err(|e| crate::Error::Config(e.to_string()))?;
        
        settings
            .try_deserialize()
            .map_err(|e| crate::Error::Config(e.to_string()))
    }
}