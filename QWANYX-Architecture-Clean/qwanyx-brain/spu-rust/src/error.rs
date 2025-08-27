//! Error types for QWANYX SPU

use thiserror::Error;
use spu_compression::CompressionError;

#[derive(Error, Debug)]
pub enum Error {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    
    #[error("Database error: {0}")]
    Database(#[from] mongodb::error::Error),
    
    #[error("Redis error: {0}")]
    Redis(#[from] redis::RedisError),
    
    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),
    
    #[error("Bincode error: {0}")]
    Bincode(#[from] bincode::Error),
    
    #[error("Authentication error: {0}")]
    Auth(String),
    
    #[error("Invalid workspace: {0}")]
    InvalidWorkspace(String),
    
    #[error("Brain not found: {0}")]
    BrainNotFound(String),
    
    #[error("Compression error: {0}")]
    Compression(String),
    
    #[error("LLM error: {0}")]
    LLM(String),
    
    #[error("Email error: {0}")]
    Email(String),
    
    #[error("Configuration error: {0}")]
    Config(String),
    
    #[error("Internal error: {0}")]
    Internal(String),
}

impl From<CompressionError> for Error {
    fn from(err: CompressionError) -> Self {
        Error::Compression(err.to_string())
    }
}

pub type Result<T> = std::result::Result<T, Error>;