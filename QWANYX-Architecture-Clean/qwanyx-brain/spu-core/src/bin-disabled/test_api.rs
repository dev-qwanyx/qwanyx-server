//! Test rapide de l'API OpenAI avec le SPU

use spu_core::{AIClient, AIConfig};

fn main() {
    println!("🧠 SPU Core - Test API OpenAI");
    println!("================================\n");
    
    // Charger la configuration
    let config = AIConfig::default();
    
    // Vérifier qu'on a une clé API
    match config.api_key {
        Some(ref key) => {
            let masked = format!("sk-...{}", &key[key.len()-4..]);
            println!("✅ Clé API trouvée: {}", masked);
        },
        None => {
            println!("❌ Pas de clé API trouvée!");
            println!("   Assurez-vous que OPENAI_API_KEY est définie dans ../.env");
            return;
        }
    }
    
    // Créer le client (plus de mode mock)
    let client = AIClient::new();
    
    // Test de compression
    println!("\n📝 Test de compression:");
    let text = "urgent meeting about important document";
    
    match client.compress(text, "nlm") {
        Ok(compressed) => {
            println!("   Original: {}", text);
            println!("   Compressé: {}", compressed);
        },
        Err(e) => {
            println!("   Erreur: {:?}", e);
        }
    }
    
    match client.compress(text, "mlm") {
        Ok(compressed) => {
            println!("   Compressé (MLM): {}", compressed);
        },
        Err(e) => {
            println!("   Erreur: {:?}", e);
        }
    }
    
    println!("\n✨ Status:");
    if config.api_key.is_some() {
        println!("   API configurée - compression réelle active");
    } else {
        println!("   Pas d'API - ajoutez OPENAI_API_KEY dans .env");
    }
}