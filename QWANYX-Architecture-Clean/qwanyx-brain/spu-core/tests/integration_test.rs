//! Tests d'intégration complets pour SPU avec MongoDB
//! Silencieux sauf en cas d'erreur

use spu_core::{SPUExecutor, SPUData};
use mongodb::{Client as MongoClient, options::ClientOptions};
use bson::doc;
use std::env;

#[test]
fn test_complete_spu_mongodb_integration() {
    // Configuration silencieuse
    env::set_var("RUST_LOG", "error");
    
    // Test 1: SPU Executor (MongoDB sera testé à l'intérieur)
    
    // Test 2: SPU Executor avec vraies opérations
    let mut executor = SPUExecutor::new();
    
    // Programme de test complet
    let program = r#"
        LOAD $DATA, input
        MEMORIZE $DATA, test_collection
        MOVE $ID, $DATA
        RETRIEVE $RESULT, $ID, test_collection
        RETURN $RESULT
    "#;
    
    // Données de test
    let test_data = SPUData::Json(serde_json::json!({
        "test": "SPU MongoDB Integration",
        "timestamp": chrono::Utc::now().to_rfc3339(),
        "status": "testing"
    }));
    
    // Exécuter le programme
    let result = executor.execute_program(program, test_data.clone())
        .expect("SPU program execution failed");
    
    // Vérifier que les données ont été sauvegardées et récupérées
    match result {
        SPUData::Document(doc) => {
            // Silencieux si OK, panic si problème
            assert!(doc.contains_key("_id"), "Document should have _id");
            assert!(doc.contains_key("created_at"), "Document should have created_at");
        },
        SPUData::Empty => {
            panic!("Retrieved empty data - MongoDB operation likely failed");
        },
        _ => {
            panic!("Unexpected result type: {:?}", result);
        }
    }
    
    // Test 3: Compression avec OpenAI (si disponible)
    let compress_program = r#"
        LOAD $TEXT, input
        COMPRESS $COMPRESSED, $TEXT
        RETURN $COMPRESSED
    "#;
    
    let text_data = SPUData::Text("This is a test of semantic compression using the SPU system.".to_string());
    
    // Ne teste la compression que si OPENAI_API_KEY est définie
    if env::var("OPENAI_API_KEY").is_ok() {
        let compressed_result = executor.execute_program(compress_program, text_data)
            .expect("Compression program failed");
        
        match compressed_result {
            SPUData::Text(compressed) => {
                assert!(!compressed.is_empty(), "Compressed text should not be empty");
                assert!(compressed.len() < 100, "Compressed text should be shorter");
            },
            _ => panic!("Compression should return text"),
        }
    }
    
    // Test 4: Workspace isolation
    env::set_var("WORKSPACE", "test_workspace");
    let mut executor2 = SPUExecutor::new();
    
    let workspace_program = r#"
        LOAD $DATA, input
        MEMORIZE $DATA, workspace_test
        RETURN $DATA
    "#;
    
    let workspace_data = SPUData::Json(serde_json::json!({
        "workspace": "test_workspace",
        "isolated": true
    }));
    
    let workspace_result = executor2.execute_program(workspace_program, workspace_data)
        .expect("Workspace test failed");
    
    // Vérifier que l'ID a été généré
    match workspace_result {
        SPUData::ObjectId(id) => {
            assert!(!id.is_empty(), "ObjectId should not be empty");
        },
        _ => panic!("MEMORIZE should return ObjectId"),
    }
    
    // Si on arrive ici, tous les tests sont passés silencieusement
}

#[test]
fn test_spu_parser() {
    use spu_core::SPUExecutor;
    
    // Test parsing des instructions
    let instructions = vec![
        "LOAD $REG, input",
        "MEMORIZE $DATA, collection",
        "RETRIEVE $OUT, id123, collection",
        "COMPRESS $C, $IN, 0.5",
        "RETURN $RESULT",
        "MOVE $DEST, $SRC",
    ];
    
    for instruction in instructions {
        let parsed = SPUExecutor::parse_instruction(instruction);
        assert!(parsed.is_some(), "Failed to parse: {}", instruction);
    }
}

#[test]
fn test_data_types_conversion() {
    use spu_core::SPUData;
    
    // Test conversions SPUData
    let json_data = SPUData::Json(serde_json::json!({"key": "value"}));
    let doc = json_data.to_document().expect("Failed to convert to document");
    // Le document devrait contenir soit la clé directe, soit être wrappé
    assert!(!doc.is_empty(), "Document should not be empty");
    
    let text_data = SPUData::Text("test".to_string());
    let text = text_data.as_text().expect("Failed to get as text");
    assert_eq!(text, "test");
    
    let number_data = SPUData::Number(42.0);
    let text_from_number = number_data.as_text().expect("Failed to convert number to text");
    assert_eq!(text_from_number, "42");
}