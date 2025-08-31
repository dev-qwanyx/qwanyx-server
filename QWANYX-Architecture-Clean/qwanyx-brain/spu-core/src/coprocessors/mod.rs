//! Coprocessors for SPU Core
//! 
//! This module contains all coprocessor implementations that integrate with the SPU runtime.

pub mod semantic_compressor;
pub mod email;
pub mod real_email;
pub mod auth;
pub mod database;

// Re-export for convenience
pub use semantic_compressor::SemanticCompressorCoprocessor;
pub use email::EmailCoprocessor;
pub use real_email::RealEmailCoprocessor;
pub use auth::AuthCoprocessor;
pub use database::DatabaseCoprocessor;