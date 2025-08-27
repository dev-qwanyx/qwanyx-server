//! Coprocesseurs du SPU - Architecture unifiée
//! Tout est fonction, pas de différence entre ADD et COMPRESS

use crate::{Concept, ConceptData};

// ================================================================================
// CONFIGURATION CENTRALISÉE
// ================================================================================

/// Configuration d'un modèle disponible
#[derive(Debug, Clone)]
pub struct ModelConfig {
    pub id: u8,
    pub name: &'static str,  // Nom réel pour l'API
    pub capacity: u32,        // Capacité de traitement
    pub cost: f32,           // Coût par appel
    pub latency_ms: u32,      // Latence moyenne
}

/// Modèles disponibles (hardcodés)
pub const COMPRESSION_MODELS: &[ModelConfig] = &[
    ModelConfig {
        id: 0,
        name: "gpt-4o-mini",
        capacity: 100,
        cost: 0.0001,
        latency_ms: 50,
    },
    ModelConfig {
        id: 1,
        name: "gpt-4o",
        capacity: 500,
        cost: 0.001,
        latency_ms: 100,
    },
    ModelConfig {
        id: 2,
        name: "gpt-5-nano",
        capacity: 1000,
        cost: 0.01,
        latency_ms: 200,
    },
    ModelConfig {
        id: 3,
        name: "gpt-5",
        capacity: 10000,
        cost: 0.1,
        latency_ms: 500,
    },
];

// ================================================================================
// COPROCESSEUR GÉNÉRIQUE
// ================================================================================

/// Coprocesseur unifié - tout passe par là
#[derive(Debug, Clone)]
pub struct Coprocessor {
    pub id: u8,
    pub name: String,
    pub capacity: u32,
    pub latency_ms: u32,
    pub cost: f32,
}

impl Coprocessor {
    /// Crée un coprocesseur de compression
    pub fn compressor(level: u8) -> Self {
        let model = &COMPRESSION_MODELS[level as usize];
        Self {
            id: model.id,
            name: format!("Compressor-{}", level),
            capacity: model.capacity,
            latency_ms: model.latency_ms,
            cost: model.cost,
        }
    }
    
    /// Crée un coprocesseur de stockage
    pub fn storage() -> Self {
        Self {
            id: 10,
            name: "Storage".to_string(),
            capacity: u32::MAX,
            latency_ms: 10,
            cost: 0.00001,
        }
    }
    
    /// Crée un coprocesseur humain
    pub fn human(expertise_level: u8) -> Self {
        Self {
            id: 20 + expertise_level,
            name: format!("Human-L{}", expertise_level),
            capacity: 100000,  // Très haute capacité
            latency_ms: 3600000, // 1 heure moyenne
            cost: 50.0 * expertise_level as f32,
        }
    }
}

// ================================================================================
// REGISTRE DES FONCTIONS
// ================================================================================

/// Toutes les fonctions disponibles dans le SPU
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
#[repr(u16)]
pub enum Function {
    // ============================================================================
    // FONCTIONS INTERNES (0x0000 - 0x00FF)
    // ============================================================================
    
    // Arithmétiques
    Add = 0x0000,
    Sub = 0x0001,
    Mul = 0x0002,
    Div = 0x0003,
    
    // Logiques
    And = 0x0010,
    Or = 0x0011,
    Not = 0x0012,
    Xor = 0x0013,
    
    // Comparaisons
    Equal = 0x0020,
    Greater = 0x0021,
    Less = 0x0022,
    Similar = 0x0023,
    
    // Manipulations
    Merge = 0x0030,
    Split = 0x0031,
    Copy = 0x0032,
    Clear = 0x0033,
    
    // ============================================================================
    // FONCTIONS EXTERNES - COMPRESSION (0x0100 - 0x01FF)
    // ============================================================================
    
    CompressNano = 0x0100,   // Utilise NLM
    CompressMini = 0x0101,   // Utilise MLM
    CompressSmall = 0x0102,  // Utilise SLM
    CompressLarge = 0x0103,  // Utilise LLM
    CompressXLarge = 0x0104, // Utilise XLM
    
    ExpandNano = 0x0110,
    ExpandMini = 0x0111,
    ExpandSmall = 0x0112,
    ExpandLarge = 0x0113,
    ExpandXLarge = 0x0114,
    
    // ============================================================================
    // FONCTIONS EXTERNES - STOCKAGE (0x0200 - 0x02FF)
    // ============================================================================
    
    Memorize = 0x0200,       // Sauvegarde en MongoDB
    Retrieve = 0x0201,       // Récupère de MongoDB
    Search = 0x0202,         // Recherche dans MongoDB
    Delete = 0x0203,         // Supprime de MongoDB
    Update = 0x0204,         // Met à jour MongoDB
    
    // ============================================================================
    // FONCTIONS EXTERNES - ANALYSE (0x0300 - 0x03FF)
    // ============================================================================
    
    Analyze = 0x0300,        // Analyse sémantique
    Classify = 0x0301,       // Classification
    Extract = 0x0302,        // Extraction d'info
    Summarize = 0x0303,      // Résumé
    Translate = 0x0304,      // Traduction
    
    // ============================================================================
    // FONCTIONS EXTERNES - HUMAIN (0x0400 - 0x04FF)
    // ============================================================================
    
    AskHuman = 0x0400,       // Demande à un humain
    ValidateHuman = 0x0401,  // Validation humaine
    ReviewHuman = 0x0402,    // Revue humaine
}

// ================================================================================
// EXÉCUTEUR DE FONCTIONS
// ================================================================================

/// Type de fonction (interne ou externe)
#[derive(Clone, Debug)]
enum FunctionType {
    Internal,
    External(String), // Nom du modèle pour les fonctions AI
}

/// Exécute n'importe quelle fonction
pub struct FunctionExecutor {
    /// Registre des fonctions disponibles
    registry: std::collections::HashMap<Function, FunctionType>,
    
    /// Client AI pour les opérations d'intelligence artificielle
    ai_client: crate::AIClient,
}

impl FunctionExecutor {
    pub fn new() -> Self {
        Self {
            registry: Self::create_registry(),
            ai_client: crate::AIClient::new(),
        }
    }
    
    fn create_registry() -> std::collections::HashMap<Function, FunctionType> {
        use std::collections::HashMap;
        let mut registry = HashMap::new();
        
        // Fonctions internes
        registry.insert(Function::Add, FunctionType::Internal);
        registry.insert(Function::Sub, FunctionType::Internal);
        registry.insert(Function::Mul, FunctionType::Internal);
        registry.insert(Function::Div, FunctionType::Internal);
        
        // Fonctions externes via AI
        registry.insert(Function::CompressNano, FunctionType::External("nlm".to_string()));
        registry.insert(Function::CompressMini, FunctionType::External("mlm".to_string()));
        registry.insert(Function::CompressLarge, FunctionType::External("xlm".to_string()));
        
        registry
    }
    
    /// Exécute une fonction avec les arguments
    pub fn execute(
        &self,
        function: Function,
        args: &[Concept],
    ) -> Result<Concept, ExecutionError> {
        match function {
            // ========================================================================
            // FONCTIONS INTERNES (pures, rapides)
            // ========================================================================
            
            Function::Add => self.add(&args[0], &args[1]),
            Function::Sub => self.subtract(&args[0], &args[1]),
            Function::Mul => self.multiply(&args[0], &args[1]),
            Function::Div => self.divide(&args[0], &args[1]),
            
            Function::And => self.and(&args[0], &args[1]),
            Function::Or => self.or(&args[0], &args[1]),
            Function::Not => self.not(&args[0]),
            
            Function::Merge => self.merge(&args[0], &args[1]),
            Function::Split => self.split(&args[0]),
            
            // ========================================================================
            // FONCTIONS EXTERNES (via coprocesseurs)
            // ========================================================================
            
            Function::CompressNano => self.compress(&args[0], 0),
            Function::CompressMini => self.compress(&args[0], 1),
            Function::CompressSmall => self.compress(&args[0], 2),
            Function::CompressLarge => self.compress(&args[0], 3),
            
            Function::Memorize => self.memorize(&args[0]),
            Function::Retrieve => self.retrieve(&args[0]),
            
            _ => Err(ExecutionError::NotImplemented),
        }
    }
    
    // ========================================================================
    // IMPLÉMENTATIONS DES FONCTIONS INTERNES
    // ========================================================================
    
    fn add(&self, a: &Concept, b: &Concept) -> Result<Concept, ExecutionError> {
        match (&a.data, &b.data) {
            (ConceptData::Number(x), ConceptData::Number(y)) => {
                Ok(Concept::from_number(x + y))
            }
            _ => Err(ExecutionError::TypeMismatch),
        }
    }
    
    fn subtract(&self, a: &Concept, b: &Concept) -> Result<Concept, ExecutionError> {
        match (&a.data, &b.data) {
            (ConceptData::Number(x), ConceptData::Number(y)) => {
                Ok(Concept::from_number(x - y))
            }
            _ => Err(ExecutionError::TypeMismatch),
        }
    }
    
    fn multiply(&self, a: &Concept, b: &Concept) -> Result<Concept, ExecutionError> {
        match (&a.data, &b.data) {
            (ConceptData::Number(x), ConceptData::Number(y)) => {
                Ok(Concept::from_number(x * y))
            }
            _ => Err(ExecutionError::TypeMismatch),
        }
    }
    
    fn divide(&self, a: &Concept, b: &Concept) -> Result<Concept, ExecutionError> {
        match (&a.data, &b.data) {
            (ConceptData::Number(x), ConceptData::Number(y)) => {
                if *y == 0.0 {
                    return Err(ExecutionError::DivisionByZero);
                }
                Ok(Concept::from_number(x / y))
            }
            _ => Err(ExecutionError::TypeMismatch),
        }
    }
    
    fn and(&self, a: &Concept, b: &Concept) -> Result<Concept, ExecutionError> {
        // Intersection sémantique
        let mut result = a.clone();
        result.strength = a.strength.min(b.strength);
        result.links.retain(|link| b.links.contains(link));
        Ok(result)
    }
    
    fn or(&self, a: &Concept, b: &Concept) -> Result<Concept, ExecutionError> {
        // Union sémantique
        let mut result = a.clone();
        result.strength = a.strength.max(b.strength);
        for link in &b.links {
            if !result.links.contains(link) {
                result.links.push(*link);
            }
        }
        Ok(result)
    }
    
    fn not(&self, a: &Concept) -> Result<Concept, ExecutionError> {
        let mut result = a.clone();
        result.strength = 1.0 - a.strength;
        Ok(result)
    }
    
    fn merge(&self, a: &Concept, b: &Concept) -> Result<Concept, ExecutionError> {
        let mut result = Concept::empty();
        result.strength = (a.strength + b.strength) / 2.0;
        result.links = a.links.clone();
        result.links.extend(b.links.iter());
        result.links.push(a.id);
        result.links.push(b.id);
        Ok(result)
    }
    
    fn split(&self, a: &Concept) -> Result<Concept, ExecutionError> {
        let mut result = a.clone();
        result.strength = a.strength / 2.0;
        result.links = vec![a.id];
        Ok(result)
    }
    
    // ========================================================================
    // IMPLÉMENTATIONS DES FONCTIONS EXTERNES (mockées pour l'instant)
    // ========================================================================
    
    fn compress(&self, concept: &Concept, model_level: usize) -> Result<Concept, ExecutionError> {
        match &concept.data {
            ConceptData::Text(text) => {
                // Détermine le modèle selon le niveau
                let model = match model_level {
                    0 => "nlm",  // Nano Language Model
                    1 => "mlm",  // Medium Language Model
                    _ => "xlm",  // eXtreme Language Model
                };
                
                // PAS DE FALLBACK - Si pas d'API, on échoue proprement
                let compressed = self.ai_client.compress(text, model)
                    .map_err(|e| ExecutionError::CoprocessorError(
                        format!("Compression impossible: {:?}", e)
                    ))?;
                
                Ok(Concept::from_text(compressed))
            }
            _ => Err(ExecutionError::TypeMismatch),
        }
    }
    
    fn memorize(&self, concept: &Concept) -> Result<Concept, ExecutionError> {
        // Pour l'instant, on retourne le concept avec un ID généré
        // TODO: Intégrer le vrai StorageCoprocessor async
        let mut result = concept.clone();
        result.id = Concept::generate_id();
        Ok(result)
    }
    
    fn retrieve(&self, concept: &Concept) -> Result<Concept, ExecutionError> {
        // Pour l'instant, on retourne un concept exemple
        // TODO: Intégrer le vrai StorageCoprocessor async
        Ok(Concept::from_text("Document récupéré depuis MongoDB".to_string()))
    }
}

// ================================================================================
// ERREURS
// ================================================================================

#[derive(Debug, Clone, PartialEq)]
pub enum ExecutionError {
    NotImplemented,
    TypeMismatch,
    DivisionByZero,
    CoprocessorTimeout,
    CoprocessorError(String),
}

// ================================================================================
// HELPERS POUR CONCEPT
// ================================================================================

impl Concept {
    pub fn from_number(n: f64) -> Self {
        Self {
            id: Self::generate_id(),
            concept_type: crate::ConceptType::Number,
            strength: 1.0,
            data: ConceptData::Number(n),
            links: Vec::new(),
        }
    }
    
    pub fn from_text(text: String) -> Self {
        Self {
            id: Self::generate_id(),
            concept_type: crate::ConceptType::Text,
            strength: 1.0,
            data: ConceptData::Text(text),
            links: Vec::new(),
        }
    }
}

// ================================================================================
// TESTS
// ================================================================================

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_arithmetic_functions() {
        let executor = FunctionExecutor::new();
        
        let a = Concept::from_number(10.0);
        let b = Concept::from_number(5.0);
        
        // Test addition
        let result = executor.execute(Function::Add, &[a.clone(), b.clone()]).unwrap();
        match result.data {
            ConceptData::Number(n) => assert_eq!(n, 15.0),
            _ => panic!("Expected number"),
        }
        
        // Test subtraction
        let result = executor.execute(Function::Sub, &[a.clone(), b.clone()]).unwrap();
        match result.data {
            ConceptData::Number(n) => assert_eq!(n, 5.0),
            _ => panic!("Expected number"),
        }
        
        // Test multiplication
        let result = executor.execute(Function::Mul, &[a.clone(), b.clone()]).unwrap();
        match result.data {
            ConceptData::Number(n) => assert_eq!(n, 50.0),
            _ => panic!("Expected number"),
        }
        
        // Test division
        let result = executor.execute(Function::Div, &[a.clone(), b.clone()]).unwrap();
        match result.data {
            ConceptData::Number(n) => assert_eq!(n, 2.0),
            _ => panic!("Expected number"),
        }
    }
    
    #[test]
    #[ignore] // Nécessite une clé API
    fn test_compression_levels() {
        let executor = FunctionExecutor::new();
        let text = Concept::from_text("Hello, world!".to_string());
        
        // Test different compression levels
        let functions = [
            Function::CompressNano,
            Function::CompressMini,
            Function::CompressLarge,
        ];
        
        // Sans clé API, tous devraient échouer
        if std::env::var("OPENAI_API_KEY").is_err() {
            for func in functions.iter() {
                let result = executor.execute(*func, &[text.clone()]);
                assert!(result.is_err());
            }
        }
    }
    
    #[test]
    fn test_model_configs() {
        assert_eq!(COMPRESSION_MODELS.len(), 4);
        assert_eq!(COMPRESSION_MODELS[0].name, "gpt-4o-mini");
        assert_eq!(COMPRESSION_MODELS[3].name, "gpt-5");
        
        // Vérifier que les capacités augmentent
        for i in 1..COMPRESSION_MODELS.len() {
            assert!(COMPRESSION_MODELS[i].capacity > COMPRESSION_MODELS[i-1].capacity);
        }
    }
}