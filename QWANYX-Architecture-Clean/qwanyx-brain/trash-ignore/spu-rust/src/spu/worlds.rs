//! Multi-world semantic architecture

use std::collections::HashMap;
use crate::{Result, Error};
use super::space::{SemanticSpace, Sphere, Position3D};
use super::compression::ChineseCompressor;

/// Type of semantic world
#[derive(Debug, Clone, Hash, Eq, PartialEq)]
pub enum WorldType {
    General,
    Medical,
    Legal,
    Financial,
    Scientific,
    Engineering,
    Literary,
    Musical,
    Culinary,
    Geographic,
}

/// Trait for semantic worlds
pub trait SemanticWorld: Send + Sync {
    /// Get world type
    fn world_type(&self) -> WorldType;
    
    /// Compress text using world-specific rules
    fn compress(&self, text: &str, precision: f32) -> Result<Vec<u8>>;
    
    /// Analyze text in world context
    fn analyze(&self, text: &str) -> Result<WorldAnalysis>;
    
    /// Get semantic space
    fn space(&self) -> &SemanticSpace;
    
    /// Check if text belongs to this world
    fn confidence_score(&self, text: &str) -> f32;
}

/// Analysis result from a world
#[derive(Debug, Clone)]
pub struct WorldAnalysis {
    pub world: WorldType,
    pub concepts: Vec<String>,
    pub confidence: f32,
    pub specialized_terms: HashMap<String, String>,
}

/// Medical world implementation
pub struct MedicalWorld {
    space: SemanticSpace,
    compressor: MedicalCompressor,
    medical_terms: HashMap<String, String>,
}

impl MedicalWorld {
    pub fn new() -> Self {
        let mut medical_terms = HashMap::new();
        
        // Medical terminology mappings
        medical_terms.insert("A23c".to_string(), "digital nerve of thumb".to_string());
        medical_terms.insert("ICD-10".to_string(), "diagnostic classification".to_string());
        medical_terms.insert("MI".to_string(), "myocardial infarction".to_string());
        medical_terms.insert("CBC".to_string(), "complete blood count".to_string());
        medical_terms.insert("MRI".to_string(), "magnetic resonance imaging".to_string());
        
        Self {
            space: SemanticSpace::new(),
            compressor: MedicalCompressor::new(),
            medical_terms,
        }
    }
    
    fn detect_medical_context(&self, text: &str) -> bool {
        let medical_keywords = vec![
            "patient", "diagnosis", "treatment", "symptom", "disease",
            "surgery", "medication", "doctor", "hospital", "clinical",
            "anatomical", "physiological", "pathology", "therapy",
        ];
        
        let text_lower = text.to_lowercase();
        medical_keywords.iter().any(|&keyword| text_lower.contains(keyword))
    }
}

impl SemanticWorld for MedicalWorld {
    fn world_type(&self) -> WorldType {
        WorldType::Medical
    }
    
    fn compress(&self, text: &str, precision: f32) -> Result<Vec<u8>> {
        self.compressor.compress(text, precision)
    }
    
    fn analyze(&self, text: &str) -> Result<WorldAnalysis> {
        let mut concepts = Vec::new();
        let mut specialized = HashMap::new();
        
        // Extract medical concepts
        for (term, meaning) in &self.medical_terms {
            if text.contains(term) {
                concepts.push(term.clone());
                specialized.insert(term.clone(), meaning.clone());
            }
        }
        
        Ok(WorldAnalysis {
            world: WorldType::Medical,
            concepts,
            confidence: self.confidence_score(text),
            specialized_terms: specialized,
        })
    }
    
    fn space(&self) -> &SemanticSpace {
        &self.space
    }
    
    fn confidence_score(&self, text: &str) -> f32 {
        if self.detect_medical_context(text) {
            0.9
        } else {
            0.1
        }
    }
}

/// Medical-specific compressor
struct MedicalCompressor {
    mappings: HashMap<String, char>,
}

impl MedicalCompressor {
    fn new() -> Self {
        let mut mappings = HashMap::new();
        
        // Medical Chinese character mappings
        mappings.insert("heart".to_string(), '心');
        mappings.insert("blood".to_string(), '血');
        mappings.insert("nerve".to_string(), '神');
        mappings.insert("bone".to_string(), '骨');
        mappings.insert("lung".to_string(), '肺');
        mappings.insert("liver".to_string(), '肝');
        mappings.insert("kidney".to_string(), '肾');
        mappings.insert("brain".to_string(), '脑');
        mappings.insert("cancer".to_string(), '癌');
        mappings.insert("surgery".to_string(), '术');
        mappings.insert("medicine".to_string(), '药');
        mappings.insert("pain".to_string(), '痛');
        mappings.insert("inflammation".to_string(), '炎');
        mappings.insert("infection".to_string(), '染');
        mappings.insert("diagnosis".to_string(), '诊');
        mappings.insert("treatment".to_string(), '疗');
        
        Self { mappings }
    }
    
    fn compress(&self, text: &str, precision: f32) -> Result<Vec<u8>> {
        let mut result = Vec::new();
        let text_lower = text.to_lowercase();
        
        for (term, ch) in &self.mappings {
            if text_lower.contains(term) {
                let mut buf = [0; 4];
                let bytes = ch.encode_utf8(&mut buf);
                result.extend_from_slice(bytes.as_bytes());
                
                // Higher precision = fewer characters
                if precision > 0.8 && result.len() > 9 {
                    break;
                }
            }
        }
        
        Ok(result)
    }
}

/// Financial world implementation
pub struct FinancialWorld {
    space: SemanticSpace,
    ticker_symbols: HashMap<String, String>,
}

impl FinancialWorld {
    pub fn new() -> Self {
        let mut ticker_symbols = HashMap::new();
        
        ticker_symbols.insert("AAPL".to_string(), "Apple Inc.".to_string());
        ticker_symbols.insert("GOOGL".to_string(), "Alphabet Inc.".to_string());
        ticker_symbols.insert("MSFT".to_string(), "Microsoft Corp.".to_string());
        ticker_symbols.insert("BTC".to_string(), "Bitcoin".to_string());
        ticker_symbols.insert("ETH".to_string(), "Ethereum".to_string());
        
        Self {
            space: SemanticSpace::new(),
            ticker_symbols,
        }
    }
}

impl SemanticWorld for FinancialWorld {
    fn world_type(&self) -> WorldType {
        WorldType::Financial
    }
    
    fn compress(&self, text: &str, precision: f32) -> Result<Vec<u8>> {
        // Financial compression logic
        let financial_terms = vec!["buy", "sell", "profit", "loss", "market", "stock"];
        let mut compressed = Vec::new();
        
        for term in financial_terms {
            if text.to_lowercase().contains(term) {
                compressed.extend_from_slice(term.as_bytes());
                if precision > 0.7 && compressed.len() > 10 {
                    break;
                }
            }
        }
        
        Ok(compressed)
    }
    
    fn analyze(&self, text: &str) -> Result<WorldAnalysis> {
        let mut concepts = Vec::new();
        let mut specialized = HashMap::new();
        
        // Check for ticker symbols
        for (ticker, company) in &self.ticker_symbols {
            if text.contains(ticker) {
                concepts.push(ticker.clone());
                specialized.insert(ticker.clone(), company.clone());
            }
        }
        
        Ok(WorldAnalysis {
            world: WorldType::Financial,
            concepts,
            confidence: self.confidence_score(text),
            specialized_terms: specialized,
        })
    }
    
    fn space(&self) -> &SemanticSpace {
        &self.space
    }
    
    fn confidence_score(&self, text: &str) -> f32 {
        let financial_keywords = vec![
            "stock", "share", "market", "trading", "investment",
            "portfolio", "dividend", "equity", "bond", "option",
        ];
        
        let text_lower = text.to_lowercase();
        let matches = financial_keywords.iter()
            .filter(|&&k| text_lower.contains(k))
            .count();
        
        (matches as f32 / 3.0).min(1.0)
    }
}

/// Router to determine appropriate world
pub struct WorldRouter {
    worlds: HashMap<WorldType, Box<dyn SemanticWorld>>,
}

impl WorldRouter {
    pub fn new() -> Self {
        let mut worlds: HashMap<WorldType, Box<dyn SemanticWorld>> = HashMap::new();
        
        // Register worlds
        worlds.insert(WorldType::Medical, Box::new(MedicalWorld::new()));
        worlds.insert(WorldType::Financial, Box::new(FinancialWorld::new()));
        
        Self { worlds }
    }
    
    /// Route text to most appropriate world
    pub fn route(&self, text: &str) -> WorldType {
        let mut best_world = WorldType::General;
        let mut best_score = 0.0;
        
        for (world_type, world) in &self.worlds {
            let score = world.confidence_score(text);
            if score > best_score {
                best_score = score;
                best_world = world_type.clone();
            }
        }
        
        best_world
    }
    
    /// Get a specific world
    pub fn get_world(&self, world_type: &WorldType) -> Option<&Box<dyn SemanticWorld>> {
        self.worlds.get(world_type)
    }
    
    /// Analyze in all worlds and return best match
    pub fn analyze_multi_world(&self, text: &str) -> Vec<WorldAnalysis> {
        let mut analyses = Vec::new();
        
        for world in self.worlds.values() {
            if let Ok(analysis) = world.analyze(text) {
                if analysis.confidence > 0.3 {
                    analyses.push(analysis);
                }
            }
        }
        
        // Sort by confidence
        analyses.sort_by(|a, b| b.confidence.partial_cmp(&a.confidence).unwrap());
        analyses
    }
}

/// Bridge between worlds for shared concepts
pub struct WorldBridge {
    pub concept: String,
    pub meanings: HashMap<WorldType, String>,
    pub transfer_weights: HashMap<(WorldType, WorldType), f32>,
}

impl WorldBridge {
    pub fn new(concept: String) -> Self {
        Self {
            concept,
            meanings: HashMap::new(),
            transfer_weights: HashMap::new(),
        }
    }
    
    pub fn add_meaning(&mut self, world: WorldType, meaning: String) {
        self.meanings.insert(world, meaning);
    }
    
    pub fn translate(&self, from: &WorldType, to: &WorldType) -> Option<String> {
        if from == to {
            return self.meanings.get(from).cloned();
        }
        
        // Get meaning in target world
        self.meanings.get(to).cloned()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_medical_world_detection() {
        let medical = MedicalWorld::new();
        
        assert!(medical.confidence_score("Patient presents with symptoms") > 0.5);
        assert!(medical.confidence_score("The stock market crashed") < 0.5);
    }
    
    #[test]
    fn test_financial_world_detection() {
        let financial = FinancialWorld::new();
        
        assert!(financial.confidence_score("Buy 100 shares of AAPL") > 0.5);
        assert!(financial.confidence_score("Patient needs surgery") < 0.5);
    }
    
    #[test]
    fn test_world_router() {
        let router = WorldRouter::new();
        
        assert_eq!(router.route("Patient has heart disease"), WorldType::Medical);
        assert_eq!(router.route("Buy stocks and bonds"), WorldType::Financial);
    }
    
    #[test]
    fn test_world_bridge() {
        let mut bridge = WorldBridge::new("operation".to_string());
        bridge.add_meaning(WorldType::Medical, "surgical procedure".to_string());
        bridge.add_meaning(WorldType::Financial, "business transaction".to_string());
        
        assert_eq!(
            bridge.translate(&WorldType::Medical, &WorldType::Financial),
            Some("business transaction".to_string())
        );
    }
}