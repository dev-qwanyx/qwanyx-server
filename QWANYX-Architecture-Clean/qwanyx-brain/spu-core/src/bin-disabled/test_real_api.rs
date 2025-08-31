//! Test des vrais appels API OpenAI

use spu_core::{AIClient, AIConfig};
use std::io::{self, Write};

fn main() {
    println!("🧠 SPU Core - Test RÉEL API OpenAI");
    println!("====================================\n");
    
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
    
    // Demander confirmation avant d'utiliser l'API
    print!("\n⚠️  Ceci va faire de VRAIS appels API (coût ~$0.0002).\nContinuer? (o/n): ");
    io::stdout().flush().unwrap();
    
    let mut input = String::new();
    io::stdin().read_line(&mut input).unwrap();
    
    if !input.trim().eq_ignore_ascii_case("o") {
        println!("Annulé.");
        return;
    }
    
    // Créer le client (toujours en mode réel maintenant)
    println!("\n🚀 Création du client...");
    let client = AIClient::new();
    
    // Test de compression avec NLM (Nano Language Model)
    println!("\n📝 Test de compression avec NLM (GPT-5-nano → GPT-4o-mini):");
    println!("   ℹ️  NLM = 400k tokens de contexte!");
    
    let text = "urgent meeting about the new product launch strategy";
    
    match client.compress(text, "nlm") {
        Ok(compressed) => {
            println!("   ✅ Succès!");
            println!("   Original: {}", text);
            println!("   Compressé: {}", compressed);
            
            // Test d'expansion
            println!("\n📖 Test d'expansion avec le même modèle:");
            match client.expand(&compressed, "nlm") {
                Ok(expanded) => {
                    println!("   ✅ Succès!");
                    println!("   Expanded: {}", expanded);
                },
                Err(e) => {
                    println!("   ❌ Erreur expansion: {:?}", e);
                }
            }
        },
        Err(e) => {
            println!("   ❌ Erreur compression: {:?}", e);
            println!("\n💡 Vérifiez:");
            println!("   - Votre clé API est valide");
            println!("   - Vous avez des crédits OpenAI");
            println!("   - Votre connexion internet fonctionne");
        }
    }
    
    // Test avec différents modèles
    println!("\n🎯 Test avec les 3 modèles:");
    
    let long_text = "The quarterly financial report shows significant growth in revenue, with a 25% increase compared to last year. The marketing department's new campaign has been particularly successful.";
    
    // Test NLM (Nano Language Model)
    println!("\n   NLM (compression maximale):");
    match client.compress(long_text, "nlm") {
        Ok(compressed) => {
            println!("   Compressé: {}", compressed);
        },
        Err(e) => {
            println!("   ❌ Erreur: {:?}", e);
        }
    }
    
    // Test MLM (Medium Language Model)
    println!("\n   MLM (compression moyenne):");
    match client.compress(long_text, "mlm") {
        Ok(compressed) => {
            println!("   Compressé: {}", compressed);
        },
        Err(e) => {
            println!("   ❌ Erreur: {:?}", e);
        }
    }
    
    // Test XLM (eXtreme Language Model)
    println!("\n   XLM (compression minimale, plus de détail):");
    match client.compress(long_text, "xlm") {
        Ok(compressed) => {
            println!("   Compressé: {}", compressed);
        },
        Err(e) => {
            println!("   ❌ Erreur: {:?}", e);
        }
    }
}