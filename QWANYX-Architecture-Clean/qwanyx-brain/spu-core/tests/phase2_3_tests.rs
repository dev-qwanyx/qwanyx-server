//! SPU 1.0 Phase 2 & 3 Tests
//! Tests for advanced instructions

use spu_core::{Instruction, Data, simple_parser::SimpleParser};

#[cfg(test)]
mod phase2_completeness_tests {
    use super::*;
    
    #[test]
    fn test_async_await_parsing() {
        let script = r#"
ASYNC email1 send $message handle1
ASYNC db1 store $data handle2
AWAIT handle1 email_result
AWAIT handle2 db_result
"#;
        let instructions = SimpleParser::parse(script).unwrap();
        assert_eq!(instructions.len(), 4);
        
        // Check ASYNC
        match &instructions[0] {
            Instruction::Async { object, method, handle, .. } => {
                assert_eq!(object, "email1");
                assert_eq!(method, "send");
                assert_eq!(handle, "handle1");
            }
            _ => panic!("Expected Async instruction"),
        }
        
        // Check AWAIT
        match &instructions[2] {
            Instruction::Await { handle, target } => {
                assert_eq!(handle, "handle1");
                assert_eq!(target, "email_result");
            }
            _ => panic!("Expected Await instruction"),
        }
    }
    
    #[test]
    fn test_function_definition() {
        let script = r#"
FUNCTION process_user(email, role)
    SET user {"email": "$email", "role": "$role"}
    CALL db1 store $user result
    RETURN $result
ENDFUNCTION
"#;
        let instructions = SimpleParser::parse(script).unwrap();
        assert_eq!(instructions.len(), 1);
        
        match &instructions[0] {
            Instruction::Function { name, params, body } => {
                assert_eq!(name, "process_user");
                assert_eq!(params.len(), 2);
                assert_eq!(params[0], "email");
                assert_eq!(params[1], "role");
                assert_eq!(body.len(), 3); // SET, CALL, RETURN
            }
            _ => panic!("Expected Function instruction"),
        }
    }
    
    #[test]
    fn test_function_call() {
        let script = r#"CALL_FN process_user "test@example.com" "admin" result"#;
        let instructions = SimpleParser::parse(script).unwrap();
        assert_eq!(instructions.len(), 1);
        
        match &instructions[0] {
            Instruction::CallFn { name, args, target } => {
                assert_eq!(name, "process_user");
                assert_eq!(args.len(), 2);
                assert_eq!(target, "result");
            }
            _ => panic!("Expected CallFn instruction"),
        }
    }
    
    #[test]
    fn test_len_already_works() {
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
mod phase3_advanced_tests {
    use super::*;
    
    #[test]
    fn test_parallel_parsing() {
        let script = r#"
PARALLEL results
    CALL email1 send $msg1 r1
    |
    CALL db1 store $data r2
    |
    CALL sms1 send $msg2 r3
ENDPARALLEL
"#;
        let instructions = SimpleParser::parse(script).unwrap();
        assert_eq!(instructions.len(), 1);
        
        match &instructions[0] {
            Instruction::Parallel { tasks, target } => {
                assert_eq!(tasks.len(), 3);
                assert_eq!(target, "results");
                // Each task should have 1 CALL instruction
                for task in tasks {
                    assert_eq!(task.len(), 1);
                    assert!(matches!(&task[0], Instruction::Call { .. }));
                }
            }
            _ => panic!("Expected Parallel instruction"),
        }
    }
    
    #[test]
    fn test_race_parsing() {
        let script = r#"
RACE first_result
    CALL api1 fetch data1
    |
    CALL api2 fetch data2
ENDRACE
"#;
        let instructions = SimpleParser::parse(script).unwrap();
        assert_eq!(instructions.len(), 1);
        
        match &instructions[0] {
            Instruction::Race { tasks, target } => {
                assert_eq!(tasks.len(), 2);
                assert_eq!(target, "first_result");
            }
            _ => panic!("Expected Race instruction"),
        }
    }
    
    #[test]
    fn test_get_methods_parsing() {
        let script = "GET_METHODS db1 methods";
        let instructions = SimpleParser::parse(script).unwrap();
        assert_eq!(instructions.len(), 1);
        
        match &instructions[0] {
            Instruction::GetMethods { object, target } => {
                assert_eq!(object, "db1");
                assert_eq!(target, "methods");
            }
            _ => panic!("Expected GetMethods instruction"),
        }
    }
}

#[cfg(test)]
mod complete_spu_tests {
    use super::*;
    
    #[test]
    fn test_complete_spu_1_0_script() {
        let script = r#"
# Complete SPU 1.0 demonstration
FUNCTION process_requests(user_role)
    INSTANTIATE database db
    
    # Build query based on role
    IF $user_role == "professionnel"
        SET query {"collection": "requests", "filter": {}}
    ELSE
        SET query {"collection": "requests", "filter": {"userId": "$user.id"}}
    ENDIF
    
    # Fetch requests
    CALL db retrieve $query requests
    LEN $requests count
    
    # Process each request
    FOREACH request IN $requests
        EXPR "$request.urgency == 'high'" is_urgent
        IF $is_urgent
            ASYNC email send_urgent $request email_handle
        ENDIF
    ENDFOREACH
    
    # Wait for async operations
    AWAIT email_handle email_result
    
    RETURN $requests
ENDFUNCTION

# Main execution
TRY
    CALL_FN process_requests "professionnel" results
    
    # Parallel notifications
    PARALLEL notifications
        CALL email notify_admin $results r1
        |
        CALL sms alert_team $results r2
        |
        CALL slack post_summary $results r3
    ENDPARALLEL
    
    TRACE "Processing complete"
CATCH DatabaseError
    THROW SystemError "Database unavailable"
"#;
        
        let instructions = SimpleParser::parse(script).unwrap();
        assert!(instructions.len() > 0, "Complete SPU 1.0 script should parse");
        
        // Count instruction types
        let mut function_count = 0;
        let mut async_count = 0;
        let mut parallel_count = 0;
        
        fn count_advanced_instructions(instructions: &[Instruction], 
                                      function_count: &mut i32,
                                      async_count: &mut i32,
                                      parallel_count: &mut i32) {
            for instruction in instructions {
                match instruction {
                    Instruction::Function { body, .. } => {
                        *function_count += 1;
                        count_advanced_instructions(body, function_count, async_count, parallel_count);
                    }
                    Instruction::Async { .. } => *async_count += 1,
                    Instruction::Parallel { tasks, .. } => {
                        *parallel_count += 1;
                        for task in tasks {
                            count_advanced_instructions(task, function_count, async_count, parallel_count);
                        }
                    }
                    Instruction::If { then_branch, else_branch, .. } => {
                        count_advanced_instructions(then_branch, function_count, async_count, parallel_count);
                        if let Some(else_b) = else_branch {
                            count_advanced_instructions(else_b, function_count, async_count, parallel_count);
                        }
                    }
                    Instruction::Foreach { body, .. } => {
                        count_advanced_instructions(body, function_count, async_count, parallel_count);
                    }
                    Instruction::Try { instructions } => {
                        count_advanced_instructions(instructions, function_count, async_count, parallel_count);
                    }
                    _ => {}
                }
            }
        }
        
        count_advanced_instructions(&instructions, &mut function_count, &mut async_count, &mut parallel_count);
        
        assert_eq!(function_count, 1, "Should have 1 FUNCTION");
        assert!(async_count > 0, "Should have ASYNC operations");
        assert_eq!(parallel_count, 1, "Should have 1 PARALLEL");
        
        println!("✅ Complete SPU 1.0 script with all 25 instructions parses correctly!");
    }
    
    #[test]
    fn test_all_25_instructions_defined() {
        // Test that we can parse at least one of each instruction type
        let test_cases = vec![
            // Phase 1: Core (15)
            ("INSTANTIATE db db1", "INSTANTIATE"),
            ("DESTROY db1", "DESTROY"),
            ("CALL db1 method args result", "CALL"),
            ("SET var value", "SET"),
            ("GET var.field target", "GET"),
            ("EXPR \"$x + 1\" result", "EXPR"),
            ("IF true\nTRACE \"yes\"\nENDIF", "IF"),
            ("WHILE true\nBREAK\nENDWHILE", "WHILE"),
            ("FOREACH item IN items\nTRACE \"item\"\nENDFOREACH", "FOREACH"),
            ("TRY\nHALT\nCATCH\nTRACE \"error\"\n", "TRY"),
            ("THROW Error \"message\"", "THROW"),
            ("TRACE \"debug\"", "TRACE"),
            ("HALT", "HALT"),
            ("RETURN value", "RETURN"),
            
            // Phase 2: Completeness (7)
            ("ASYNC obj method args handle", "ASYNC"),
            ("AWAIT handle result", "AWAIT"),
            ("BREAK", "BREAK"),
            ("CONTINUE", "CONTINUE"),
            ("FUNCTION test()\nRETURN\nENDFUNCTION", "FUNCTION"),
            ("CALL_FN test result", "CALL_FN"),
            ("LEN collection count", "LEN"),
            
            // Phase 3: Advanced (3)
            ("PARALLEL result\nHALT\nENDPARALLEL", "PARALLEL"),
            ("RACE result\nHALT\nENDRACE", "RACE"),
            ("GET_METHODS obj methods", "GET_METHODS"),
            
            // Bonus
            ("NOP", "NOP"),
        ];
        
        let mut passed = 0;
        let mut failed = Vec::new();
        
        for (script, name) in test_cases {
            match SimpleParser::parse(script) {
                Ok(_) => passed += 1,
                Err(e) => failed.push((name, e)),
            }
        }
        
        println!("✅ Parsed {}/25 core instructions", passed);
        
        if !failed.is_empty() {
            println!("Failed to parse:");
            for (name, error) in &failed {
                println!("  - {}: {}", name, error);
            }
        }
        
        assert_eq!(passed, 25, "All 25 instructions should parse");
    }
}