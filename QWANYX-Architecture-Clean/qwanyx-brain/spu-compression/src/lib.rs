//! Module de compression sémantique - Avec lazy_static et error handling

use std::collections::HashMap;
use lazy_static::lazy_static;
use serde::{Serialize, Deserialize};
use thiserror::Error;

/// Erreurs possibles du module compression
#[derive(Error, Debug)]
pub enum CompressionError {
    #[error("Text too long: {0} chars, max is {1}")]
    TextTooLong(usize, usize),
    
    #[error("Invalid compression ratio: {0}")]
    InvalidRatio(f32),
    
    #[error("Serialization failed: {0}")]
    SerializationError(String),
}

lazy_static! {
    static ref CHINESE_MAPPINGS: HashMap<&'static str, char> = {
        let mut m = HashMap::new();
        m.insert("urgent", '急');
        m.insert("meeting", '会');
        m.insert("important", '重');
        m.insert("help", '助');
        m.insert("problem", '题');
        m.insert("deadline", '期');
        m.insert("critical", '危');
        m
    };
}

/// Résultat de compression sérialisable
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct CompressedText {
    pub characters: Vec<char>,
    pub original_length: usize,
}

/// Compresseur de texte en caractères chinois
pub struct ChineseCompressor {
    max_length: usize,
}

impl ChineseCompressor {
    pub fn new() -> Self {
        Self {
            max_length: 10000,  // Limite par défaut
        }
    }
    
    /// Compression simple utilisant lazy_static avec gestion d'erreur
    pub fn compress(&self, text: &str) -> Result<CompressedText, CompressionError> {
        // Vérifier la longueur du texte
        if text.len() > self.max_length {
            return Err(CompressionError::TextTooLong(text.len(), self.max_length));
        }
        
        let mut characters = Vec::new();
        let text_lower = text.to_lowercase();
        
        for (word, ch) in CHINESE_MAPPINGS.iter() {
            if text_lower.contains(word) {
                characters.push(*ch);
            }
        }
        
        Ok(CompressedText {
            characters,
            original_length: text.len(),
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_basic_compression() {
        let compressor = ChineseCompressor::new();
        let result = compressor.compress("urgent meeting").unwrap();
        assert_eq!(result.characters.len(), 2);
        assert!(result.characters.contains(&'急'));
        assert!(result.characters.contains(&'会'));
        assert_eq!(result.original_length, 14);
    }
    
    #[test]
    fn test_no_match() {
        let compressor = ChineseCompressor::new();
        let result = compressor.compress("hello world").unwrap();
        assert_eq!(result.characters.len(), 0);
        assert_eq!(result.original_length, 11);
    }
    
    #[test]
    fn test_serialization() {
        let compressor = ChineseCompressor::new();
        let result = compressor.compress("urgent").unwrap();
        
        // Test serde serialization
        let json = serde_json::to_string(&result).unwrap();
        let deserialized: CompressedText = serde_json::from_str(&json).unwrap();
        
        assert_eq!(result, deserialized);
    }
    
    #[test]
    fn test_text_too_long() {
        let compressor = ChineseCompressor::new();
        let long_text = "a".repeat(10001);
        let result = compressor.compress(&long_text);
        
        assert!(result.is_err());
        match result {
            Err(CompressionError::TextTooLong(len, max)) => {
                assert_eq!(len, 10001);
                assert_eq!(max, 10000);
            }
            _ => panic!("Expected TextTooLong error"),
        }
    }
}