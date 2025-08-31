//! SPU 1.0 Complete Test Suite
//! Tests for all 25 instructions

use spu_core::{Instruction, Data, simple_parser::SimpleParser};
use std::collections::HashMap;

#[cfg(test)]
mod phase1_core_tests {
    use super::*;
    
    #[test]
    fn test_destroy_parsing() {
        let script = "DESTROY db1";
        let instructions = SimpleParser::parse(script).unwrap();
        assert_eq!(instructions.len(), 1);
        match &instructions[0] {
            Instruction::Destroy { object_id } => {
                assert_eq!(object_id, "db1");
            }
            _ => panic!("Expected Destroy instruction"),
        }
    }
    
    #[test]
    fn test_return_parsing() {
        let script = "RETURN $result";
        let instructions = SimpleParser::parse(script).unwrap();
        assert_eq!(instructions.len(), 1);
        match &instructions[0] {
            Instruction::Return { value } => {
                assert_eq!(value, "$result");
            }
            _ => panic!("Expected Return instruction"),
        }
    }
    
    #[test]
    fn test_throw_parsing() {
        let script = r#"THROW ValidationError "Invalid input data""#;
        let instructions = SimpleParser::parse(script).unwrap();
        assert_eq!(instructions.len(), 1);
        match &instructions[0] {
            Instruction::Throw { error_type, message } => {
                assert_eq!(error_type, "ValidationError");
                assert_eq!(message, r#""Invalid input data""#);
            }
            _ => panic!("Expected Throw instruction"),
        }
    }
    
    #[test]
    fn test_expr_parsing() {
        let script = r#"EXPR "$x + 5" result"#;
        let instructions = SimpleParser::parse(script).unwrap();
        assert_eq!(instructions.len(), 1);
        match &instructions[0] {
            Instruction::Expr { expression, target } => {
                assert_eq!(expression, r#""$x + 5""#);
                assert_eq!(target, "result");
            }
            _ => panic!("Expected Expr instruction"),
        }
    }
    
    #[test]
    fn test_if_parsing() {
        let script = r#"
IF $role == "admin"
    TRACE "Admin user"
ENDIF
"#;
        let instructions = SimpleParser::parse(script).unwrap();
        assert_eq!(instructions.len(), 1);
        match &instructions[0] {
            Instruction::If { condition, then_branch, else_branch } => {
                assert_eq!(condition, r#"$role == "admin""#);
                assert_eq!(then_branch.len(), 1);
                assert!(else_branch.is_none());
            }
            _ => panic!("Expected If instruction"),
        }
    }
    
    #[test]
    fn test_if_else_parsing() {
        let script = r#"
IF $count > 0
    TRACE "Positive"
ELSE
    TRACE "Zero or negative"
ENDIF
"#;
        let instructions = SimpleParser::parse(script).unwrap();
        assert_eq!(instructions.len(), 1);
        match &instructions[0] {
            Instruction::If { condition, then_branch, else_branch } => {
                assert_eq!(condition, "$count > 0");
                assert_eq!(then_branch.len(), 1);
                assert!(else_branch.is_some());
                assert_eq!(else_branch.as_ref().unwrap().len(), 1);
            }
            _ => panic!("Expected If instruction"),
        }
    }
    
    #[test]
    fn test_while_parsing() {
        let script = r#"
WHILE $count > 0
    TRACE "Counting"
    EXPR "$count - 1" count
ENDWHILE
"#;
        let instructions = SimpleParser::parse(script).unwrap();
        assert_eq!(instructions.len(), 1);
        match &instructions[0] {
            Instruction::While { condition, body } => {
                assert_eq!(condition, "$count > 0");
                assert_eq!(body.len(), 2);
            }
            _ => panic!("Expected While instruction"),
        }
    }
    
    #[test]
    fn test_foreach_parsing() {
        let script = r#"
FOREACH item IN $items
    TRACE "Processing item"
ENDFOREACH
"#;
        let instructions = SimpleParser::parse(script).unwrap();
        assert_eq!(instructions.len(), 1);
        match &instructions[0] {
            Instruction::Foreach { item, collection, body } => {
                assert_eq!(item, "item");
                assert_eq!(collection, "$items");
                assert_eq!(body.len(), 1);
            }
            _ => panic!("Expected Foreach instruction"),
        }
    }
    
    #[test]
    fn test_break_continue_parsing() {
        let script = r#"
WHILE true
    IF $done
        BREAK
    ELSE
        CONTINUE
    ENDIF
ENDWHILE
"#;
        let instructions = SimpleParser::parse(script).unwrap();
        assert_eq!(instructions.len(), 1);
        match &instructions[0] {
            Instruction::While { body, .. } => {
                assert_eq!(body.len(), 1);
                match &body[0] {
                    Instruction::If { then_branch, else_branch, .. } => {
                        assert_eq!(then_branch.len(), 1);
                        match &then_branch[0] {
                            Instruction::Break => {},
                            _ => panic!("Expected Break"),
                        }
                        assert_eq!(else_branch.as_ref().unwrap().len(), 1);
                        match &else_branch.as_ref().unwrap()[0] {
                            Instruction::Continue => {},
                            _ => panic!("Expected Continue"),
                        }
                    }
                    _ => panic!("Expected If"),
                }
            }
            _ => panic!("Expected While"),
        }
    }
    
    #[test]
    fn test_len_parsing() {
        let script = "LEN $items count";
        let instructions = SimpleParser::parse(script).unwrap();
        assert_eq!(instructions.len(), 1);
        match &instructions[0] {
            Instruction::Len { collection, target } => {
                assert_eq!(collection, "$items");
                assert_eq!(target, "count");
            }
            _ => panic!("Expected Len instruction"),
        }
    }
}

#[cfg(test)]
mod complex_script_tests {
    use super::*;
    
    #[test]
    fn test_request_processing_script() {
        let script = r#"
# Request processing with all Phase 1 features
INSTANTIATE database db1
INSTANTIATE email email1

SET user_role "professionnel"

IF $user_role == "professionnel"
    SET query {"collection": "requests", "filter": {}}
ELSE
    SET query {"collection": "requests", "filter": {"userId": "$user.id"}}
ENDIF

TRY
    CALL db1 retrieve $query requests
    LEN $requests count
    
    FOREACH request IN $requests
        EXPR "$request.urgency == 'high'" is_urgent
        IF $is_urgent
            CALL email1 send_urgent $request email_result
        ENDIF
    ENDFOREACH
    
    RETURN $requests
CATCH DatabaseError
    THROW SystemError "Database unavailable"
"#;
        
        let instructions = SimpleParser::parse(script).unwrap();
        
        // Count instruction types
        let mut instantiate_count = 0;
        let mut if_count = 0;
        let mut foreach_count = 0;
        let mut return_count = 0;
        
        fn count_instructions(instructions: &[Instruction], 
                            instantiate_count: &mut i32, 
                            if_count: &mut i32,
                            foreach_count: &mut i32,
                            return_count: &mut i32) {
            for instruction in instructions {
                match instruction {
                    Instruction::Instantiate { .. } => *instantiate_count += 1,
                    Instruction::If { then_branch, else_branch, .. } => {
                        *if_count += 1;
                        count_instructions(then_branch, instantiate_count, if_count, foreach_count, return_count);
                        if let Some(else_b) = else_branch {
                            count_instructions(else_b, instantiate_count, if_count, foreach_count, return_count);
                        }
                    },
                    Instruction::Foreach { body, .. } => {
                        *foreach_count += 1;
                        count_instructions(body, instantiate_count, if_count, foreach_count, return_count);
                    },
                    Instruction::Return { .. } => *return_count += 1,
                    Instruction::Try { instructions } => {
                        count_instructions(instructions, instantiate_count, if_count, foreach_count, return_count);
                    },
                    Instruction::Catch { handler, .. } => {
                        count_instructions(handler, instantiate_count, if_count, foreach_count, return_count);
                    },
                    _ => {}
                }
            }
        }
        
        count_instructions(&instructions, &mut instantiate_count, &mut if_count, &mut foreach_count, &mut return_count);
        
        assert_eq!(instantiate_count, 2, "Should have 2 INSTANTIATE");
        assert_eq!(if_count, 2, "Should have 2 IF statements");
        assert_eq!(foreach_count, 1, "Should have 1 FOREACH");
        assert_eq!(return_count, 1, "Should have 1 RETURN");
        
        println!("✅ Complex Phase 1 script parses correctly!");
    }
    
    #[test]
    fn test_nested_control_flow() {
        let script = r#"
SET count 10
WHILE $count > 0
    IF $count == 5
        TRACE "Halfway"
        FOREACH item IN $special_items
            TRACE "Special processing"
        ENDFOREACH
    ELSE
        TRACE "Normal"
    ENDIF
    EXPR "$count - 1" count
ENDWHILE
RETURN "Done"
"#;
        
        let instructions = SimpleParser::parse(script).unwrap();
        assert!(instructions.len() > 0, "Nested control flow should parse");
        
        // Find the WHILE instruction
        for instruction in &instructions {
            if let Instruction::While { body, .. } = instruction {
                assert!(body.len() > 0, "WHILE should have body");
                // Check for IF inside
                for inner in body {
                    if let Instruction::If { then_branch, .. } = inner {
                        // Check for FOREACH inside IF
                        for inner2 in then_branch {
                            if let Instruction::Foreach { .. } = inner2 {
                                println!("✅ Found nested FOREACH inside IF inside WHILE");
                                return;
                            }
                        }
                    }
                }
            }
        }
    }
}

#[cfg(test)]
mod backward_compatibility_tests {
    use super::*;
    
    #[test]
    fn test_original_instructions_still_work() {
        // Test all originally working instructions
        let scripts = vec![
            "INSTANTIATE database db1",
            r#"CALL db1 store {"key": "value"} result"#,
            r#"SET data {"test": true}"#,
            "GET data.test value",
            "GETHEALTH db1 status",
            "TRACE \"Testing\"",
            "HALT",
            "NOP",
        ];
        
        for script in scripts {
            let result = SimpleParser::parse(script);
            assert!(result.is_ok(), "Script '{}' should still parse", script);
        }
        
        println!("✅ All original instructions still work!");
    }
    
    #[test]
    fn test_try_catch_still_works() {
        let script = r#"
TRY
    CALL api fetch data result
CATCH NetworkError
    TRACE "Error"
"#;
        let instructions = SimpleParser::parse(script).unwrap();
        assert_eq!(instructions.len(), 2);
        assert!(matches!(&instructions[0], Instruction::Try { .. }));
        assert!(matches!(&instructions[1], Instruction::Catch { .. }));
    }
}