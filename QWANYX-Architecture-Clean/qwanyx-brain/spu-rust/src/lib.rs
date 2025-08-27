//! QWANYX SPU - Semantic Processing Unit
//! 
//! High-performance brain engine with semantic compression,
//! 3D spatial navigation, and LLM orchestration.

pub mod config;
pub mod error;
pub mod spu;
pub mod api;
pub mod brain;
pub mod memory;
pub mod email;
pub mod auth;
pub mod workspace;

// Re-exports
pub use config::Config;
pub use error::{Error, Result};
pub use spu::SemanticProcessor;

/// Version of the SPU
pub const VERSION: &str = env!("CARGO_PKG_VERSION");