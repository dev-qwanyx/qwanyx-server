//! Test de l'exécuteur SPU avec des programmes assembleur

use spu_core::{SPUExecutor, SPUData};
use serde_json::json;

fn main() {
    println!("🧠 Test Exécuteur SPU");
    println!("====================\n");
    
    // Créer l'exécuteur
    let mut executor = SPUExecutor::new();
    
    // Test 1 : Simple stockage
    println!("📝 Test 1: Simple stockage");
    let program1 = r#"
        LOAD $FLOW, input
        MEMORIZE $FLOW, dh_flows
        RETURN $FLOW
    "#;
    
    let flow_data = SPUData::Json(json!({
        "dh_email": "stephen@qwanyx.com",
        "nodes": [
            {"id": "1", "type": "input", "data": {"label": "Start"}},
            {"id": "2", "type": "process", "data": {"label": "Process"}},
        ],
        "edges": [
            {"source": "1", "target": "2"}
        ]
    }));
    
    match executor.execute_program(program1, flow_data) {
        Ok(SPUData::ObjectId(id)) => {
            println!("✅ Flow sauvegardé avec ID: {}", id);
        },
        Ok(other) => {
            println!("❌ Résultat inattendu: {:?}", other);
        },
        Err(e) => {
            println!("❌ Erreur: {}", e);
        }
    }
    
    // Test 2 : Compression puis stockage
    println!("\n📝 Test 2: Compression puis stockage");
    let program2 = r#"
        LOAD $EMAIL, input
        COMPRESS $COMPRESSED, $EMAIL, 0.7
        MEMORIZE $COMPRESSED, emails
        RETURN $COMPRESSED
    "#;
    
    let email_data = SPUData::Text(
        "Bonjour, ceci est un email de test avec beaucoup de contenu pour voir la compression. \
         Le système devrait compresser ce texte en caractères chinois avant de le stocker."
            .to_string()
    );
    
    match executor.execute_program(program2, email_data) {
        Ok(SPUData::ObjectId(id)) => {
            println!("✅ Email compressé et sauvegardé avec ID: {}", id);
        },
        Ok(other) => {
            println!("❓ Résultat: {:?}", other);
        },
        Err(e) => {
            println!("❌ Erreur: {}", e);
        }
    }
    
    // Test 3 : Récupération
    println!("\n📝 Test 3: Récupération");
    let program3 = r#"
        RETRIEVE $DOC, test_id_123, dh_flows
        RETURN $DOC
    "#;
    
    match executor.execute_program(program3, SPUData::Empty) {
        Ok(SPUData::Json(json)) => {
            println!("✅ Document récupéré:");
            println!("{}", serde_json::to_string_pretty(&json).unwrap());
        },
        Ok(other) => {
            println!("❓ Résultat: {:?}", other);
        },
        Err(e) => {
            println!("❌ Erreur: {}", e);
        }
    }
    
    // Test 4 : Programme complexe
    println!("\n📝 Test 4: Programme complexe (analyse avant stockage)");
    let program4 = r#"
        ; Charge le document
        LOAD $DOC, input
        
        ; Compresse pour analyse
        COMPRESS $COMPRESSED, $DOC, 0.5
        
        ; TODO: Ajouter analyse (THREAT_EVAL, MOOD_ANALYZE, etc.)
        
        ; Sauvegarde
        MEMORIZE $COMPRESSED, analyzed_docs
        
        ; Retourne l'ID
        RETURN $COMPRESSED
    "#;
    
    let complex_data = SPUData::Json(json!({
        "type": "customer_email",
        "from": "client@example.com",
        "subject": "Problème urgent avec ma commande",
        "body": "Je n'ai toujours pas reçu ma commande passée il y a 2 semaines...",
        "timestamp": "2024-01-20T10:30:00Z"
    }));
    
    match executor.execute_program(program4, complex_data) {
        Ok(result) => {
            println!("✅ Document analysé et stocké");
            match result {
                SPUData::ObjectId(id) => println!("   ID: {}", id),
                _ => println!("   Résultat: {:?}", result),
            }
        },
        Err(e) => {
            println!("❌ Erreur: {}", e);
        }
    }
    
    println!("\n✨ Tests terminés!");
}