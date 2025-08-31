//! Semantic Compressor Coprocessor
//! 
//! Wraps the existing ChineseCompressor to work as an SPU coprocessor
//! following the universal JSON interface contract.

use crate::{Coprocessor, CoprocessorError, Data, Health, MethodSignature};
use async_trait::async_trait;
use spu_compression::ChineseCompressor;
use std::collections::HashMap;

/// Semantic Compressor Coprocessor
/// 
/// Provides text compression functionality using Chinese character mapping.
/// Follows the SPU coprocessor contract with JSON in/out interface.
pub struct SemanticCompressorCoprocessor {
    compressor: ChineseCompressor,
}

impl SemanticCompressorCoprocessor {
    /// Create a new semantic compressor coprocessor
    pub fn new() -> Self {
        Self {
            compressor: ChineseCompressor::new(),
        }
    }
}

impl Default for SemanticCompressorCoprocessor {
    fn default() -> Self {
        Self::new()
    }
}

#[async_trait]
impl Coprocessor for SemanticCompressorCoprocessor {
    fn class_name(&self) -> String {
        "semantic_compressor".to_string()
    }

    fn methods(&self) -> Vec<MethodSignature> {
        vec![
            MethodSignature {
                name: "compress".to_string(),
                description: "Compress text using semantic Chinese character mapping".to_string(),
                input_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "text": { 
                            "type": "string",
                            "description": "Text to compress",
                            "maxLength": 10000
                        },
                        "return_format": {
                            "type": "string",
                            "enum": ["string", "array", "full"],
                            "default": "string",
                            "description": "Output format: 'string' for concatenated characters, 'array' for character array, 'full' for complete data"
                        }
                    },
                    "required": ["text"]
                })),
                output_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "compressed": { 
                            "type": ["string", "array"],
                            "description": "Compressed representation"
                        },
                        "original_length": { 
                            "type": "number",
                            "description": "Original text length in bytes"
                        },
                        "compressed_length": {
                            "type": "number",
                            "description": "Number of Chinese characters used"
                        },
                        "compression_ratio": {
                            "type": "number",
                            "description": "Compression ratio (compressed/original)"
                        }
                    }
                })),
            },
            MethodSignature {
                name: "analyze".to_string(),
                description: "Analyze text for compressible keywords without compressing".to_string(),
                input_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "text": { 
                            "type": "string",
                            "description": "Text to analyze"
                        }
                    },
                    "required": ["text"]
                })),
                output_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "keywords_found": {
                            "type": "array",
                            "items": { "type": "string" },
                            "description": "Keywords that would be compressed"
                        },
                        "potential_compression": {
                            "type": "number",
                            "description": "Number of characters that would be generated"
                        }
                    }
                })),
            },
            MethodSignature {
                name: "get_mappings".to_string(),
                description: "Get the current keyword to Chinese character mappings".to_string(),
                input_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {}
                })),
                output_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "mappings": {
                            "type": "object",
                            "description": "Keyword to character mappings"
                        }
                    }
                })),
            },
        ]
    }

    async fn invoke(&self, method: &str, args: Data) -> Result<Data, CoprocessorError> {
        match method {
            "compress" => self.compress(args).await,
            "analyze" => self.analyze(args).await,
            "get_mappings" => self.get_mappings(args).await,
            _ => Err(CoprocessorError::MethodNotFound(method.to_string())),
        }
    }

    async fn health(&self) -> Health {
        // Test the compressor with a simple input
        match self.compressor.compress("test") {
            Ok(_) => Health::Healthy,
            Err(e) => Health::Unhealthy {
                error: format!("Compressor failed health check: {}", e),
            },
        }
    }
}

impl SemanticCompressorCoprocessor {
    /// Compress text using the semantic compressor
    async fn compress(&self, args: Data) -> Result<Data, CoprocessorError> {
        // Extract arguments
        let (text, return_format) = match args {
            Data::Object(ref obj) => {
                let text = match obj.get("text") {
                    Some(Data::String(s)) => s.clone(),
                    _ => {
                        return Err(CoprocessorError::InvalidArguments(
                            "Missing or invalid 'text' field (expected string)".to_string(),
                        ))
                    }
                };
                
                let return_format = match obj.get("return_format") {
                    Some(Data::String(s)) => s.clone(),
                    _ => "string".to_string(),
                };
                
                (text, return_format)
            }
            _ => {
                return Err(CoprocessorError::InvalidArguments(
                    "Expected object with 'text' field".to_string(),
                ))
            }
        };

        // Perform compression
        let compressed_result = self
            .compressor
            .compress(&text)
            .map_err(|e| CoprocessorError::ExecutionError(format!("Compression failed: {}", e)))?;

        // Build response based on requested format
        let mut response = HashMap::new();
        
        match return_format.as_str() {
            "string" => {
                // Return concatenated string of characters
                let compressed_string: String = compressed_result.characters.iter().collect();
                response.insert("compressed".to_string(), Data::String(compressed_string));
            }
            "array" => {
                // Return array of characters
                let char_array: Vec<Data> = compressed_result
                    .characters
                    .iter()
                    .map(|c| Data::String(c.to_string()))
                    .collect();
                response.insert("compressed".to_string(), Data::Array(char_array));
            }
            "full" => {
                // Return full compressed data structure
                let compressed_string: String = compressed_result.characters.iter().collect();
                response.insert("compressed".to_string(), Data::String(compressed_string));
                
                // Also include the character array for completeness
                let char_array: Vec<Data> = compressed_result
                    .characters
                    .iter()
                    .map(|c| Data::String(c.to_string()))
                    .collect();
                response.insert("characters".to_string(), Data::Array(char_array));
            }
            _ => {
                return Err(CoprocessorError::InvalidArguments(
                    format!("Invalid return_format: '{}'. Must be 'string', 'array', or 'full'", return_format),
                ))
            }
        }
        
        // Add metadata
        response.insert(
            "original_length".to_string(),
            Data::Number(compressed_result.original_length as f64),
        );
        response.insert(
            "compressed_length".to_string(),
            Data::Number(compressed_result.characters.len() as f64),
        );
        
        // Calculate compression ratio
        let ratio = if compressed_result.original_length > 0 {
            compressed_result.characters.len() as f64 / compressed_result.original_length as f64
        } else {
            0.0
        };
        response.insert("compression_ratio".to_string(), Data::Number(ratio));

        Ok(Data::Object(response))
    }

    /// Analyze text for compressible keywords
    async fn analyze(&self, args: Data) -> Result<Data, CoprocessorError> {
        let text = match args {
            Data::Object(ref obj) => match obj.get("text") {
                Some(Data::String(s)) => s.clone(),
                _ => {
                    return Err(CoprocessorError::InvalidArguments(
                        "Missing or invalid 'text' field".to_string(),
                    ))
                }
            },
            _ => {
                return Err(CoprocessorError::InvalidArguments(
                    "Expected object with 'text' field".to_string(),
                ))
            }
        };

        // Known keywords from the compressor
        // In a real implementation, we'd expose this from ChineseCompressor
        let keywords = vec![
            "urgent", "meeting", "important", "help", 
            "problem", "deadline", "critical"
        ];

        let text_lower = text.to_lowercase();
        let mut found_keywords = Vec::new();
        
        for keyword in &keywords {
            if text_lower.contains(keyword) {
                found_keywords.push(Data::String(keyword.to_string()));
            }
        }

        let mut response = HashMap::new();
        response.insert("keywords_found".to_string(), Data::Array(found_keywords.clone()));
        response.insert(
            "potential_compression".to_string(),
            Data::Number(found_keywords.len() as f64),
        );

        Ok(Data::Object(response))
    }

    /// Get the current mappings
    async fn get_mappings(&self, _args: Data) -> Result<Data, CoprocessorError> {
        // Return the known mappings
        // In a real implementation, we'd expose this from ChineseCompressor
        let mut mappings = HashMap::new();
        mappings.insert("urgent".to_string(), Data::String("急".to_string()));
        mappings.insert("meeting".to_string(), Data::String("会".to_string()));
        mappings.insert("important".to_string(), Data::String("重".to_string()));
        mappings.insert("help".to_string(), Data::String("助".to_string()));
        mappings.insert("problem".to_string(), Data::String("题".to_string()));
        mappings.insert("deadline".to_string(), Data::String("期".to_string()));
        mappings.insert("critical".to_string(), Data::String("危".to_string()));

        let mut response = HashMap::new();
        response.insert("mappings".to_string(), Data::Object(mappings));

        Ok(Data::Object(response))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_class_name() {
        let coprocessor = SemanticCompressorCoprocessor::new();
        assert_eq!(coprocessor.class_name(), "semantic_compressor");
    }

    #[tokio::test]
    async fn test_methods_list() {
        let coprocessor = SemanticCompressorCoprocessor::new();
        let methods = coprocessor.methods();
        assert_eq!(methods.len(), 3);
        assert_eq!(methods[0].name, "compress");
        assert_eq!(methods[1].name, "analyze");
        assert_eq!(methods[2].name, "get_mappings");
    }

    #[tokio::test]
    async fn test_can_handle() {
        let coprocessor = SemanticCompressorCoprocessor::new();
        assert!(coprocessor.can_handle("compress"));
        assert!(coprocessor.can_handle("analyze"));
        assert!(coprocessor.can_handle("get_mappings"));
        assert!(!coprocessor.can_handle("unknown_method"));
    }

    #[tokio::test]
    async fn test_health_check() {
        let coprocessor = SemanticCompressorCoprocessor::new();
        let health = coprocessor.health().await;
        matches!(health, Health::Healthy);
    }

    #[tokio::test]
    async fn test_compress_basic() {
        let coprocessor = SemanticCompressorCoprocessor::new();
        
        let mut args = HashMap::new();
        args.insert("text".to_string(), Data::String("urgent meeting".to_string()));
        
        let result = coprocessor.invoke("compress", Data::Object(args)).await;
        assert!(result.is_ok());
        
        if let Ok(Data::Object(response)) = result {
            assert!(response.contains_key("compressed"));
            assert!(response.contains_key("original_length"));
            assert!(response.contains_key("compressed_length"));
            assert!(response.contains_key("compression_ratio"));
            
            // Check the compressed contains Chinese characters
            if let Some(Data::String(compressed)) = response.get("compressed") {
                assert!(compressed.contains('急')); // urgent
                assert!(compressed.contains('会')); // meeting
            }
        } else {
            panic!("Expected Object response");
        }
    }
}