//! Client OpenAI pour les vrais appels API

use serde::{Deserialize, Serialize};
use std::error::Error;

// ================================================================================
// STRUCTURES API OPENAI
// ================================================================================

#[derive(Debug, Serialize)]
struct OpenAIRequest {
    model: String,
    messages: Vec<Message>,
    temperature: f32,
    max_tokens: u32,
}

#[derive(Debug, Serialize)]
struct Message {
    role: String,
    content: String,
}

#[derive(Debug, Deserialize)]
struct OpenAIResponse {
    choices: Vec<Choice>,
}

#[derive(Debug, Deserialize)]
struct Choice {
    message: MessageResponse,
}

#[derive(Debug, Deserialize)]
struct MessageResponse {
    content: String,
}

// ================================================================================
// CLIENT OPENAI
// ================================================================================

pub struct OpenAIClient {
    api_key: String,
    base_url: String,
    client: reqwest::blocking::Client,
}

impl OpenAIClient {
    pub fn new(api_key: String) -> Self {
        Self {
            api_key,
            base_url: "https://api.openai.com/v1".to_string(),
            client: reqwest::blocking::Client::new(),
        }
    }
    
    /// Appelle l'API OpenAI avec un prompt
    pub fn call_api(
        &self,
        model: &str,
        prompt: &str,
        temperature: f32,
        max_tokens: u32,
    ) -> Result<String, Box<dyn Error>> {
        let request = OpenAIRequest {
            model: model.to_string(),
            messages: vec![
                Message {
                    role: "system".to_string(),
                    content: "Tu es expert en compression sémantique utilisant la méthode ROZAN exprimée en caractères chinois.

MÉTHODE EN 2 ÉTAPES:
1. ROZAN: Extraire l'essence (idées clés, pas les mots)
2. CHINOIS: Chaque idée = 1 caractère chinois sémantiquement dense

RÈGLES:
- Un caractère chinois peut encoder un concept complexe complet
- Préserver: noms propres, nombres, dates, termes techniques
- Utiliser la richesse sémantique du chinois classique
- Les caractères composés peuvent exprimer des relations

IMPORTANT: Réponds TOUJOURS uniquement en caractères chinois.".to_string(),
                },
                Message {
                    role: "user".to_string(),
                    content: prompt.to_string(),
                },
            ],
            temperature,
            max_tokens,
        };
        
        let response = self.client
            .post(format!("{}/chat/completions", self.base_url))
            .header("Authorization", format!("Bearer {}", self.api_key))
            .header("Content-Type", "application/json")
            .json(&request)
            .send()?;
        
        if !response.status().is_success() {
            let error_text = response.text()?;
            return Err(format!("API Error: {}", error_text).into());
        }
        
        let api_response: OpenAIResponse = response.json()?;
        
        if let Some(choice) = api_response.choices.first() {
            Ok(choice.message.content.clone())
        } else {
            Err("No response from API".into())
        }
    }
    
    /// Compresse un texte en caractères chinois
    pub fn compress_text(&self, text: &str, model: &str, precision: f32) -> Result<String, Box<dyn Error>> {
        // Calcul du nombre de caractères cible selon la précision
        let text_len = text.len();
        let target_chars = if precision <= 0.0 {
            text_len  // Pas de compression
        } else if precision >= 1.0 {
            1  // Maximum 1 caractère
        } else {
            // Formule exponentielle pour une compression plus naturelle
            let ratio = 1.0 + (precision * 19.0); // ratio de 1x à 20x
            std::cmp::max(1, (text_len as f32 / ratio) as usize)
        };
        
        let prompt = format!(
            "Résume ce texte en maximum {} caractères chinois:\n\n{}",
            target_chars, text
        );
        
        // Température plus basse pour plus de cohérence
        let temperature = 0.2; // Très déterministe
        let max_tokens = target_chars * 3 + 10; // Marge pour les caractères UTF-8
        
        self.call_api(model, &prompt, temperature, max_tokens as u32)
    }
    
    /// Expand des caractères chinois en texte
    pub fn expand_text(&self, compressed: &str, model: &str) -> Result<String, Box<dyn Error>> {
        // Appel séparé avec un nouveau contexte pour l'expansion
        let expand_request = OpenAIRequest {
            model: model.to_string(),
            messages: vec![
                Message {
                    role: "system".to_string(),
                    content: "Tu es un traducteur expert chinois-français.".to_string(),
                },
                Message {
                    role: "user".to_string(),
                    content: format!("Traduis ce texte chinois en français de manière naturelle et complète:\n\n{}", compressed),
                },
            ],
            temperature: 0.5,
            max_tokens: 500,
        };
        
        let response = self.client
            .post(format!("{}/chat/completions", self.base_url))
            .header("Authorization", format!("Bearer {}", self.api_key))
            .header("Content-Type", "application/json")
            .json(&expand_request)
            .send()?;
        
        if !response.status().is_success() {
            let error_text = response.text()?;
            return Err(format!("API Error: {}", error_text).into());
        }
        
        let api_response: OpenAIResponse = response.json()?;
        
        if let Some(choice) = api_response.choices.first() {
            Ok(choice.message.content.clone())
        } else {
            Err("No response from API".into())
        }
    }
}

// ================================================================================
// INTÉGRATION AVEC AI_INTEGRATION
// ================================================================================

// Fonction helper pour créer un client depuis AIClient
pub fn create_openai_client(api_key: String) -> OpenAIClient {
    OpenAIClient::new(api_key)
}

// ================================================================================
// TESTS
// ================================================================================

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_openai_client_creation() {
        let client = OpenAIClient::new("test_key".to_string());
        assert_eq!(client.api_key, "test_key");
    }
}