//! Test d'évaluation de la compression
//! Compare ratio et fidélité

use spu_core::{AIClient, AIConfig};

fn main() {
    println!("🧠 SPU - Test d'Évaluation de Compression");
    println!("==========================================\n");
    
    // Vérifier la clé API
    let config = AIConfig::default();
    if config.api_key.is_none() {
        println!("❌ Pas de clé API trouvée!");
        return;
    }
    
    let client = AIClient::new();
    
    // Email de test avec substance
    let original_email = r#"
Bonjour Pierre,

Suite à notre réunion de ce matin concernant le projet de refonte du site web, 
je souhaite récapituler les points importants que nous avons discutés.

Premièrement, nous avons convenu que le budget alloué sera de 50,000 euros 
avec une deadline fixée au 15 mars 2025. L'équipe sera composée de 3 développeurs 
frontend, 2 développeurs backend et 1 designer UX.

Les principales fonctionnalités à implémenter incluent:
- Un système de paiement intégré avec Stripe
- Une interface responsive compatible mobile et tablette
- Un dashboard analytique pour suivre les KPIs
- Une API RESTful pour l'intégration avec nos systèmes existants

Concernant les technologies, nous utiliserons React pour le frontend, 
Node.js avec Express pour le backend, et PostgreSQL pour la base de données.

Les prochaines étapes sont:
1. Finaliser les maquettes d'ici vendredi
2. Commencer le développement du MVP la semaine prochaine
3. Prévoir une démo client pour fin janvier

Pouvez-vous me confirmer que ces éléments correspondent bien à votre compréhension?
N'hésitez pas si vous avez des questions ou des modifications à suggérer.

Cordialement,
Marie Dupont
Chef de Projet Digital
"#;

    println!("📧 EMAIL ORIGINAL ({} caractères):", original_email.len());
    println!("{}", "=".repeat(50));
    println!("{}", original_email);
    println!("{}", "=".repeat(50));
    
    // 1. COMPRESSION avec MLM (plus de détail)
    println!("\n🗜️ COMPRESSION avec MLM (Medium Language Model)...");
    let compressed = match client.compress(original_email, "mlm") {
        Ok(c) => {
            println!("✅ Succès!");
            println!("📊 Compressé ({} caractères):", c.len());
            println!("{}", "-".repeat(50));
            println!("{}", c);
            println!("{}", "-".repeat(50));
            c
        },
        Err(e) => {
            println!("❌ Erreur compression: {:?}", e);
            return;
        }
    };
    
    // Calculer le ratio de compression
    let ratio = original_email.len() as f32 / compressed.len() as f32;
    println!("\n📈 RATIO DE COMPRESSION: {:.1}x", ratio);
    println!("   Original: {} caractères", original_email.len());
    println!("   Compressé: {} caractères", compressed.len());
    println!("   Économie: {}%", ((1.0 - 1.0/ratio) * 100.0) as i32);
    
    // 2. DÉCOMPRESSION avec MLM
    println!("\n📖 EXPANSION avec MLM...");
    let expanded = match client.expand(&compressed, "mlm") {
        Ok(e) => {
            println!("✅ Succès!");
            println!("📄 Texte reconstruit ({} caractères):", e.len());
            println!("{}", "-".repeat(50));
            println!("{}", e);
            println!("{}", "-".repeat(50));
            e
        },
        Err(e) => {
            println!("❌ Erreur expansion: {:?}", e);
            return;
        }
    };
    
    // 3. ÉVALUATION DE FIDÉLITÉ avec XLM
    println!("\n🎯 ÉVALUATION DE FIDÉLITÉ avec XLM...");
    
    let evaluation_prompt = format!(
        r#"Évalue la fidélité de cette compression/décompression.
        
ORIGINAL:
{}

COMPRESSÉ:
{}

RECONSTRUIT:
{}

Donne un score de 0 à 100 pour:
1. Fidélité sémantique (sens préservé)
2. Information critique (dates, nombres, noms)
3. Structure logique (ordre, relations)

Format: Score global/100 avec explication courte."#,
        original_email, compressed, expanded
    );
    
    match client.compress(&evaluation_prompt, "xlm") {
        Ok(score) => {
            println!("✅ Évaluation:");
            println!("{}", "=".repeat(50));
            println!("{}", score);
            println!("{}", "=".repeat(50));
        },
        Err(e) => {
            println!("❌ Erreur évaluation: {:?}", e);
        }
    }
    
    // Résumé final
    println!("\n📊 RÉSUMÉ FINAL:");
    println!("   • Ratio de compression: {:.1}x", ratio);
    println!("   • Taille originale: {} caractères", original_email.len());
    println!("   • Taille compressée: {} caractères", compressed.len());
    println!("   • Économie d'espace: {}%", ((1.0 - 1.0/ratio) * 100.0) as i32);
}