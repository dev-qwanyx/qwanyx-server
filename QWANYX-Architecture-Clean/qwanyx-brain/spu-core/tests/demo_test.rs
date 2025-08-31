//! Test that the demo script parses correctly

use spu_core::simple_parser::SimpleParser;
use std::fs;

#[test]
fn test_demo_script_parses() {
    let script = fs::read_to_string("examples/spu_1_0_demo.spu")
        .expect("Demo script should exist");
    
    let result = SimpleParser::parse(&script);
    
    match result {
        Ok(instructions) => {
            println!("✅ Demo script parsed successfully!");
            println!("Total instructions: {}", instructions.len());
            
            // Count instruction types
            let mut counts = std::collections::HashMap::new();
            
            fn count_instruction_types(
                instructions: &[spu_core::Instruction],
                counts: &mut std::collections::HashMap<String, usize>
            ) {
                for instruction in instructions {
                    let name = match instruction {
                        spu_core::Instruction::Instantiate { .. } => "INSTANTIATE",
                        spu_core::Instruction::Destroy { .. } => "DESTROY",
                        spu_core::Instruction::Call { .. } => "CALL",
                        spu_core::Instruction::Set { .. } => "SET",
                        spu_core::Instruction::Get { .. } => "GET",
                        spu_core::Instruction::Expr { .. } => "EXPR",
                        spu_core::Instruction::If { .. } => "IF",
                        spu_core::Instruction::While { .. } => "WHILE",
                        spu_core::Instruction::Foreach { .. } => "FOREACH",
                        spu_core::Instruction::Try { .. } => "TRY",
                        spu_core::Instruction::Catch { .. } => "CATCH",
                        spu_core::Instruction::Throw { .. } => "THROW",
                        spu_core::Instruction::Return { .. } => "RETURN",
                        spu_core::Instruction::Trace { .. } => "TRACE",
                        spu_core::Instruction::Halt => "HALT",
                        spu_core::Instruction::Nop => "NOP",
                        spu_core::Instruction::Break => "BREAK",
                        spu_core::Instruction::Continue => "CONTINUE",
                        spu_core::Instruction::Async { .. } => "ASYNC",
                        spu_core::Instruction::Await { .. } => "AWAIT",
                        spu_core::Instruction::Function { .. } => "FUNCTION",
                        spu_core::Instruction::CallFn { .. } => "CALL_FN",
                        spu_core::Instruction::Len { .. } => "LEN",
                        spu_core::Instruction::Parallel { .. } => "PARALLEL",
                        spu_core::Instruction::Race { .. } => "RACE",
                        spu_core::Instruction::GetMethods { .. } => "GET_METHODS",
                        _ => "OTHER",
                    };
                    
                    *counts.entry(name.to_string()).or_insert(0) += 1;
                    
                    // Recursively count in nested structures
                    match instruction {
                        spu_core::Instruction::If { then_branch, else_branch, .. } => {
                            count_instruction_types(then_branch, counts);
                            if let Some(else_b) = else_branch {
                                count_instruction_types(else_b, counts);
                            }
                        }
                        spu_core::Instruction::While { body, .. } |
                        spu_core::Instruction::Foreach { body, .. } |
                        spu_core::Instruction::Function { body, .. } => {
                            count_instruction_types(body, counts);
                        }
                        spu_core::Instruction::Try { instructions } |
                        spu_core::Instruction::Catch { handler: instructions, .. } => {
                            count_instruction_types(instructions, counts);
                        }
                        spu_core::Instruction::Parallel { tasks, .. } |
                        spu_core::Instruction::Race { tasks, .. } => {
                            for task in tasks {
                                count_instruction_types(task, counts);
                            }
                        }
                        _ => {}
                    }
                }
            }
            
            count_instruction_types(&instructions, &mut counts);
            
            println!("\nInstruction usage in demo:");
            let mut items: Vec<_> = counts.iter().collect();
            items.sort_by_key(|&(k, _)| k);
            for (name, count) in items {
                println!("  {}: {}", name, count);
            }
            
            // Verify we use most instructions
            assert!(counts.len() >= 20, "Demo should use at least 20 different instruction types");
        }
        Err(e) => {
            panic!("Failed to parse demo script: {}", e);
        }
    }
}