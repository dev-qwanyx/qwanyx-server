//! Test silencieux simple - n'affiche rien sauf erreurs

use spu_core::{SPUExecutor, SPUData};

#[test]
fn silent_spu_test() {
    // Test 1: Parser fonctionne
    let instructions = [
        "LOAD $REG, input",
        "MEMORIZE $DATA, collection",
        "RETRIEVE $OUT, id123, collection",
        "RETURN $RESULT",
    ];
    
    for inst in &instructions {
        assert!(SPUExecutor::parse_instruction(inst).is_some());
    }
    
    // Test 2: Executor de base fonctionne
    let mut executor = SPUExecutor::new();
    
    let simple_program = r#"
        LOAD $DATA, input
        RETURN $DATA
    "#;
    
    let input = SPUData::Text("test".to_string());
    let result = executor.execute_program(simple_program, input.clone()).unwrap();
    
    match result {
        SPUData::Text(t) => assert_eq!(t, "test"),
        _ => panic!("Wrong result type"),
    }
    
    // Test 3: MOVE instruction
    let move_program = r#"
        LOAD $A, input
        MOVE $B, $A
        RETURN $B
    "#;
    
    let result2 = executor.execute_program(move_program, SPUData::Number(42.0)).unwrap();
    match result2 {
        SPUData::Number(n) => assert_eq!(n, 42.0),
        _ => panic!("MOVE failed"),
    }
}

#[test] 
fn silent_data_types_test() {
    use spu_core::SPUData;
    
    // Test silencieux des types
    let _ = SPUData::Text("test".to_string()).as_text().unwrap();
    let _ = SPUData::Number(42.0).as_text().unwrap();
    let _ = SPUData::Json(serde_json::json!({"a": 1})).as_json().unwrap();
    
    // Pas de test de Register car c'est une structure interne
}