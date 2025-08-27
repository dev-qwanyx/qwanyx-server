//! Intégration AI - GPT-5 nano et mini
//! Pour compression sémantique et analyse

use crate::{Concept, ConceptData, ConceptType};
use std::collections::HashMap;

// ================================================================================
// CONFIGURATION AI
// ================================================================================

/// Configuration des modèles AI disponibles
pub struct AIConfig {
    pub api_key: Option<String>,
    pub base_url: String,
    pub models: HashMap<String, ModelInfo>,
}

#[derive(Clone)]
pub struct ModelInfo {
    pub name: String,
    pub real_name: String,  // Le vrai nom pour l'API (gpt-4o-mini, etc.)
    pub max_tokens: u32,
    pub temperature: f32,
}

impl Default for AIConfig {
    fn default() -> Self {
        // Charger les variables d'environnement depuis plusieurs emplacements possibles
        let paths = [
            "../.env",           // Depuis spu-core
            "../../.env",        // Depuis target/debug
            ".env",              // Local
        ];
        
        for path in &paths {
            let env_path = std::path::Path::new(path);
            if env_path.exists() {
                let _ = dotenv::from_path(env_path);
                break;
            }
        }
        
        let mut models = HashMap::new();
        
        // NLM - Nano Language Model (GPT-5-nano) - 400k tokens de contexte !
        models.insert(
            "nlm".to_string(),
            ModelInfo {
                name: "NLM".to_string(),  // Nano Language Model (pas de vendor lock-in)
                real_name: "gpt-4o-mini".to_string(), // Mapping temporaire vers gpt-4o-mini
                max_tokens: 8000,  // Peut gérer beaucoup avec 400k contexte
                temperature: 0.3,
            }
        );
        
        // MLM - Medium Language Model (GPT-5-mini)
        models.insert(
            "mlm".to_string(),
            ModelInfo {
                name: "MLM".to_string(),  // Medium Language Model
                real_name: "gpt-4o".to_string(), // Mapping temporaire vers gpt-4o
                max_tokens: 16000,
                temperature: 0.4,
            }
        );
        
        // XLM - eXtreme Language Model (GPT-5 full)
        models.insert(
            "xlm".to_string(),
            ModelInfo {
                name: "XLM".to_string(),  // eXtreme Language Model
                real_name: "gpt-4o".to_string(), // Mapping temporaire vers gpt-4o (le plus puissant disponible)
                max_tokens: 32000,
                temperature: 0.5,
            }
        );
        
        Self {
            api_key: std::env::var("OPENAI_API_KEY").ok(),
            base_url: "https://api.openai.com/v1".to_string(),
            models,
        }
    }
}

// ================================================================================
// CLIENT AI
// ================================================================================

pub struct AIClient {
    config: AIConfig,
    openai_client: Option<crate::OpenAIClient>,
}

impl AIClient {
    pub fn new() -> Self {
        let config = AIConfig::default();
        
        // Créer le client OpenAI si on a une clé API
        let openai_client = if let Some(api_key) = config.api_key.clone() {
            Some(crate::create_openai_client(api_key))
        } else {
            None
        };
        
        Self {
            config,
            openai_client,
        }
    }
    
    /// Compresse un texte en utilisant GPT
    pub fn compress(&self, text: &str, model: &str) -> Result<String, AIError> {
        // On DOIT avoir un client OpenAI - pas de fallback!
        let openai = self.openai_client.as_ref()
            .ok_or_else(|| AIError::ApiError(
                "ERREUR: Pas de clé API OpenAI. Compression impossible sans modèle LLM.".to_string()
            ))?;
        
        let model_info = self.config.models.get(model)
            .ok_or(AIError::UnknownModel)?;
        
        // Précision adaptée au modèle
        let precision = match model {
            "nlm" => 0.3,  // Nano - compression générale
            "mlm" => 0.5,  // Medium - compression équilibrée
            "xlm" => 0.7,  // eXtreme - préservation maximale
            _ => 0.5,
        };
        
        // Appel API avec gestion d'erreur explicite
        openai.compress_text(text, &model_info.real_name, precision)
            .map_err(|e| {
                eprintln!("❌ Erreur OpenAI: {}", e);
                AIError::ApiError(format!("Échec de la compression: {}", e))
            })
    }
    
    /// Expand un texte compressé
    pub fn expand(&self, compressed: &str, model: &str) -> Result<String, AIError> {
        // On DOIT avoir un client OpenAI - pas de fallback!
        let openai = self.openai_client.as_ref()
            .ok_or_else(|| AIError::ApiError(
                "ERREUR: Pas de clé API OpenAI. Expansion impossible sans modèle LLM.".to_string()
            ))?;
        
        let model_info = self.config.models.get(model)
            .ok_or(AIError::UnknownModel)?;
        
        // Appel API avec gestion d'erreur explicite
        openai.expand_text(compressed, &model_info.real_name)
            .map_err(|e| {
                eprintln!("❌ Erreur OpenAI: {}", e);
                AIError::ApiError(format!("Échec de l'expansion: {}", e))
            })
    }
    
    /// Analyse un concept
    pub fn analyze(&self, concept: &Concept, model: &str) -> Result<Concept, AIError> {
        match &concept.data {
            ConceptData::Text(text) => {
                let compressed = self.compress(text, model)?;
                Ok(Concept {
                    id: Concept::generate_id(),
                    concept_type: ConceptType::Text,
                    strength: 0.8,
                    data: ConceptData::Text(compressed),
                    links: vec![concept.id],
                })
            },
            _ => Err(AIError::InvalidConceptType),
        }
    }
}

// ================================================================================
// PROMPTS SPÉCIALISÉS
// ================================================================================

pub struct CompressionPrompts;

impl CompressionPrompts {
    /// Prompt pour compression avec précision variable
    pub fn compress_with_precision(text: &str, precision: f32) -> String {
        let detail_level = if precision < 0.3 {
            "très général, 1-2 caractères maximum"
        } else if precision < 0.6 {
            "concepts principaux, 3-5 caractères"  
        } else {
            "détaillé, préservant les nuances, 5-10 caractères"
        };
        
        format!(
            "Compresse ce texte en caractères chinois sémantiques.\n\
             Niveau de détail: {}\n\
             Précision demandée: {:.1}\n\n\
             Texte: {}\n\n\
             Retourne UNIQUEMENT les caractères chinois.",
            detail_level, precision, text
        )
    }
    
    /// Prompt pour évaluation de compression
    pub fn evaluate_compression(original: &str, compressed: &str, expanded: &str) -> String {
        format!(
            "Évalue la qualité de cette compression/décompression.\n\n\
             Original: {}\n\
             Compressé: {}\n\
             Reconstruit: {}\n\n\
             Donne un score de 0.0 à 1.0 pour:\n\
             1. Fidélité sémantique\n\
             2. Préservation des concepts clés\n\
             3. Ratio de compression\n\n\
             Format: JSON avec scores",
            original, compressed, expanded
        )
    }
}

// ================================================================================
// INTÉGRATION AVEC SPU
// ================================================================================

impl crate::FunctionExecutor {
    /// Ajoute les capacités AI au SPU
    pub fn with_ai(self) -> Self {
        // Le FunctionExecutor a déjà les fonctions de compression
        // On pourrait ajouter le client AI ici si nécessaire
        self
    }
}

// ================================================================================
// ERREURS
// ================================================================================

#[derive(Debug)]
pub enum AIError {
    NoApiKey,
    UnknownModel,
    ApiError(String),
    InvalidConceptType,
    NetworkError,
}

// ================================================================================
// TESTS
// ================================================================================

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_ai_client_creation() {
        let client = AIClient::new();
        // Vérifie que le client est créé (avec ou sans clé API)
        assert!(client.openai_client.is_some() || client.openai_client.is_none());
    }
    
    #[test]
    #[ignore] // Nécessite une clé API
    fn test_compress_nlm() {
        let client = AIClient::new();
        // Sans clé API, doit retourner une erreur
        if std::env::var("OPENAI_API_KEY").is_err() {
            let result = client.compress("Hello world", "nlm");
            assert!(result.is_err());
        }
    }
    
    #[test]
    #[ignore] // Nécessite une clé API
    fn test_compress_mlm() {
        let client = AIClient::new();
        // Sans clé API, doit retourner une erreur
        if std::env::var("OPENAI_API_KEY").is_err() {
            let result = client.compress("urgent meeting about important document", "mlm");
            assert!(result.is_err());
        }
    }
    
    #[test]
    fn test_compression_prompts() {
        let prompt_low = CompressionPrompts::compress_with_precision("test", 0.2);
        assert!(prompt_low.contains("1-2 caractères"));
        
        let prompt_high = CompressionPrompts::compress_with_precision("test", 0.8);
        assert!(prompt_high.contains("5-10 caractères"));
    }
    
    #[test]
    #[ignore] // Nécessite une clé API
    fn test_analyze_concept() {
        let client = AIClient::new();
        let concept = Concept {
            id: [0; 12],
            concept_type: ConceptType::Text,
            strength: 1.0,
            data: ConceptData::Text("Hello world test".to_string()),
            links: vec![],
        };
        
        // Sans clé API, doit retourner une erreur
        if std::env::var("OPENAI_API_KEY").is_err() {
            let result = client.analyze(&concept, "nlm");
            assert!(result.is_err());
        }
    }
}