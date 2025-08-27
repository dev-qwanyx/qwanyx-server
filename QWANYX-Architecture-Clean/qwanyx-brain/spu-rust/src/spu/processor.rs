//! Main Semantic Processor implementation

use std::sync::Arc;
use tokio::sync::RwLock;
use dashmap::DashMap;
use uuid::Uuid;

use crate::{Result, Error};
use super::{
    compression::ChineseCompressor,
    space::SemanticSpace,
    instruction::InstructionExecutor,
    cache::SPUCache,
};

/// The main Semantic Processing Unit
pub struct SemanticProcessor {
    /// Unique ID of this processor
    pub id: Uuid,
    
    /// Chinese character compressor
    compressor: Arc<ChineseCompressor>,
    
    /// 3D semantic space
    space: Arc<RwLock<SemanticSpace>>,
    
    /// Instruction executor
    executor: Arc<InstructionExecutor>,
    
    /// Multi-level cache
    cache: Arc<SPUCache>,
    
    /// Active computations
    computations: DashMap<Uuid, ComputationState>,
    
    /// Configuration
    config: crate::config::SPUConfig,
}

#[derive(Debug, Clone)]
pub struct ComputationState {
    pub id: Uuid,
    pub status: ComputationStatus,
    pub started_at: chrono::DateTime<chrono::Utc>,
    pub result: Option<Vec<u8>>,
}

#[derive(Debug, Clone, PartialEq)]
pub enum ComputationStatus {
    Running,
    Completed,
    Failed(String),
}

impl SemanticProcessor {
    /// Create a new Semantic Processor
    pub fn new(config: crate::config::SPUConfig) -> Result<Self> {
        Ok(Self {
            id: Uuid::new_v4(),
            compressor: Arc::new(ChineseCompressor::new()),
            space: Arc::new(RwLock::new(SemanticSpace::new())),
            executor: Arc::new(InstructionExecutor::new()),
            cache: Arc::new(SPUCache::new(config.cache_size_mb)),
            computations: DashMap::new(),
            config,
        })
    }
    
    /// Compress text semantically
    pub async fn compress(
        &self,
        text: &str,
        precision: Option<f32>,
        max_chars: Option<usize>,
    ) -> Result<Vec<u8>> {
        // Check cache first
        let cache_key = format!("compress:{}:{}:{}", 
            text.len(), 
            precision.unwrap_or(self.config.default_compression_precision),
            max_chars.unwrap_or(0)
        );
        
        if let Some(cached) = self.cache.get(&cache_key).await {
            return Ok(cached);
        }
        
        // Perform compression (ChineseCompressor only takes text argument)
        let compressed = self.compressor.compress(text)?;
        
        // Serialize CompressedText to bytes
        let compressed_bytes = bincode::serialize(&compressed)?;
        
        // Cache result
        self.cache.put(&cache_key, compressed_bytes.clone()).await;
        
        Ok(compressed_bytes)
    }
    
    /// Decompress semantic representation
    pub async fn decompress(&self, compressed: &[u8]) -> Result<String> {
        // Deserialize bytes back to CompressedText
        let compressed_text: spu_compression::CompressedText = bincode::deserialize(compressed)?;
        
        // For now, return the characters as a string
        // Real decompression would need an AI model
        Ok(compressed_text.characters.iter().collect())
    }
    
    /// Execute SPU assembly instruction
    pub async fn execute(&self, instruction: &str) -> Result<Vec<u8>> {
        let computation_id = Uuid::new_v4();
        
        // Track computation
        self.computations.insert(
            computation_id,
            ComputationState {
                id: computation_id,
                status: ComputationStatus::Running,
                started_at: chrono::Utc::now(),
                result: None,
            },
        );
        
        // Execute instruction
        let result = self.executor.execute(instruction, &self.space).await;
        
        // Update computation state
        match &result {
            Ok(data) => {
                self.computations.alter(&computation_id, |_, mut state| {
                    state.status = ComputationStatus::Completed;
                    state.result = Some(data.clone());
                    state
                });
            }
            Err(e) => {
                self.computations.alter(&computation_id, |_, mut state| {
                    state.status = ComputationStatus::Failed(e.to_string());
                    state
                });
            }
        }
        
        result
    }
    
    /// Analyze email with parallel processing
    pub async fn analyze_email(&self, email: &str) -> Result<EmailAnalysis> {
        // Compress first
        let compressed = self.compress(email, Some(0.5), Some(500)).await?;
        
        // Parallel analysis using rayon
        let (urgency, sentiment, category) = rayon::join(
            || self.analyze_urgency(&compressed),
            || rayon::join(
                || self.analyze_sentiment(&compressed),
                || self.analyze_category(&compressed),
            ),
        );
        
        let (sentiment, category) = sentiment;
        
        Ok(EmailAnalysis {
            urgency: urgency?,
            sentiment: sentiment?,
            category: category?,
            compressed,
        })
    }
    
    // Private helper methods
    
    fn analyze_urgency(&self, compressed: &[u8]) -> Result<Urgency> {
        // TODO: Implement with nano-LLM or rules
        // For now, simple pattern matching
        let text = std::str::from_utf8(compressed)
            .map_err(|e| Error::Compression(e.to_string()))?;
        
        if text.contains("急") || text.contains("紧") {
            Ok(Urgency::Critical)
        } else if text.contains("重要") {
            Ok(Urgency::High)
        } else {
            Ok(Urgency::Normal)
        }
    }
    
    fn analyze_sentiment(&self, compressed: &[u8]) -> Result<Sentiment> {
        // TODO: Implement with nano-LLM
        Ok(Sentiment::Neutral)
    }
    
    fn analyze_category(&self, compressed: &[u8]) -> Result<Category> {
        // TODO: Implement with nano-LLM
        Ok(Category::General)
    }
}

// Analysis types

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct EmailAnalysis {
    pub urgency: Urgency,
    pub sentiment: Sentiment,
    pub category: Category,
    pub compressed: Vec<u8>,
}

#[derive(Debug, Clone, Copy, PartialEq, serde::Serialize, serde::Deserialize)]
pub enum Urgency {
    Low,
    Normal,
    High,
    Critical,
}

#[derive(Debug, Clone, Copy, PartialEq, serde::Serialize, serde::Deserialize)]
pub enum Sentiment {
    VeryNegative,
    Negative,
    Neutral,
    Positive,
    VeryPositive,
}

#[derive(Debug, Clone, Copy, PartialEq, serde::Serialize, serde::Deserialize)]
pub enum Category {
    Support,
    Sales,
    Complaint,
    Information,
    General,
}