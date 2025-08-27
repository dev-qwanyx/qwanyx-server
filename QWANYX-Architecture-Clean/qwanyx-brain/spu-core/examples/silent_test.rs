//! Test silencieux complet - cargo run --example silent_test

use spu_core::{SPUExecutor, SPUData};
use std::process;

fn main() {
    let mut errors = Vec::new();
    
    // Test 1: Parsing d'instructions
    let test_instructions = vec![
        "LOAD $DATA, input",
        "MEMORIZE $DATA, users",
        "RETRIEVE $USER, 12345, users",
        "COMPRESS $SMALL, $DATA",
        "RETURN $DATA"
    ];
    
    for inst in &test_instructions {
        if SPUExecutor::parse_instruction(inst).is_none() {
            errors.push(format!("Failed to parse: {}", inst));
        }
    }
    
    // Test 2: Exécution simple
    let mut executor = SPUExecutor::new();
    
    let program = r#"
        LOAD $DATA, input
        RETURN $DATA
    "#;
    
    let input = SPUData::Json(serde_json::json!({
        "test": "data",
        "number": 42
    }));
    
    match executor.execute_program(program, input) {
        Ok(SPUData::Json(j)) => {
            if j.get("test").and_then(|v| v.as_str()) != Some("data") {
                errors.push("JSON data mismatch".to_string());
            }
        },
        Ok(_) => errors.push("Wrong return type".to_string()),
        Err(e) => errors.push(format!("Execution failed: {}", e)),
    }
    
    // Test 3: MOVE instruction
    let move_program = r#"
        LOAD $A, input
        MOVE $B, $A
        RETURN $B
    "#;
    
    match executor.execute_program(move_program, SPUData::Text("test".to_string())) {
        Ok(SPUData::Text(t)) if t == "test" => {},
        Ok(_) => errors.push("MOVE instruction failed".to_string()),
        Err(e) => errors.push(format!("MOVE failed: {}", e)),
    }
    
    // Test 4: MongoDB simulation (sans vraie connexion)
    let mongo_program = r#"
        LOAD $DOC, input
        MEMORIZE $DOC, test_collection
        RETURN $DOC
    "#;
    
    match executor.execute_program(mongo_program, SPUData::Json(serde_json::json!({"a": 1}))) {
        Ok(SPUData::ObjectId(_)) => {}, // OK, ID généré
        Ok(_) => errors.push("MEMORIZE should return ObjectId".to_string()),
        Err(e) => errors.push(format!("MEMORIZE failed: {}", e)),
    }
    
    // Résultat final
    if errors.is_empty() {
        // Succès silencieux - ne rien afficher
        process::exit(0);
    } else {
        // Afficher seulement les erreurs
        eprintln!("Tests failed:");
        for error in errors {
            eprintln!("  ✗ {}", error);
        }
        process::exit(1);
    }
}