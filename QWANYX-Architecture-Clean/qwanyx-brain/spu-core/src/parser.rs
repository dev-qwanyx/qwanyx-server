//! Assembly Script Parser
//! 
//! Parses assembly scripts into executable instructions

use crate::{Instruction, Data};
use std::collections::HashMap;

pub struct AssemblyParser;

impl AssemblyParser {
    pub fn parse(script: &str) -> Result<Vec<Instruction>, String> {
        println!("DEBUG: Starting to parse script with {} chars", script.len());
        let mut instructions = Vec::new();
        let lines: Vec<&str> = script.lines().collect();
        println!("DEBUG: Script has {} lines", lines.len());
        let mut i = 0;
        
        while i < lines.len() {
            let line = lines[i].trim();
            
            // Skip empty lines and comments
            if line.is_empty() || line.starts_with('#') {
                i += 1;
                continue;
            }
            
            println!("DEBUG: Processing line {}: {}", i + 1, if line.len() > 50 { &line[..50] } else { line });
            
            // Parse instruction
            let parts: Vec<&str> = line.split_whitespace().collect();
            if parts.is_empty() {
                i += 1;
                continue;
            }
            
            let instruction = match parts[0].to_uppercase().as_str() {
                "INSTANTIATE" => {
                    if parts.len() < 3 {
                        return Err(format!("Invalid INSTANTIATE at line {}: expected class_name and object_id", i + 1));
                    }
                    Instruction::Instantiate {
                        class_name: parts[1].to_string(),
                        object_id: parts[2].to_string(),
                    }
                }
                
                "CALL" => {
                    if parts.len() < 5 {
                        return Err(format!("Invalid CALL at line {}: expected object method args target", i + 1));
                    }
                    let args = Self::parse_data_reference(&parts[3..parts.len()-1].join(" "))?;
                    Instruction::Call {
                        object: parts[1].to_string(),
                        method: parts[2].to_string(),
                        args,
                        target: parts[parts.len() - 1].to_string(),
                    }
                }
                
                "SET" => {
                    if parts.len() < 3 {
                        return Err(format!("Invalid SET at line {}: expected variable and value", i + 1));
                    }
                    
                    let variable = parts[1].to_string();
                    
                    // The value is everything after the variable name
                    // Build the full value string, including any remaining parts
                    let value_str = parts[2..].join(" ");
                    
                    // Check for JSON object
                    if value_str.trim_start().starts_with('{') {
                        println!("DEBUG: Found JSON object, collecting lines...");
                        // Find the closing brace, handling multi-line JSON
                        let mut json_lines = vec![value_str.clone()];
                        let mut brace_count = value_str.chars().filter(|&c| c == '{').count() as i32
                            - value_str.chars().filter(|&c| c == '}').count() as i32;
                        
                        println!("DEBUG: Initial brace count: {}", brace_count);
                        
                        while brace_count > 0 && i + 1 < lines.len() {
                            i += 1;
                            let next_line = lines[i];
                            println!("DEBUG: Adding JSON line {}: {}", i + 1, if next_line.len() > 50 { &next_line[..50] } else { next_line });
                            json_lines.push(next_line.to_string());
                            brace_count += next_line.chars().filter(|&c| c == '{').count() as i32;
                            brace_count -= next_line.chars().filter(|&c| c == '}').count() as i32;
                            println!("DEBUG: Updated brace count: {}", brace_count);
                        }
                        
                        println!("DEBUG: Collected {} lines for JSON", json_lines.len());
                        let json_str = json_lines.join("\n");
                        println!("DEBUG: Parsing JSON: {}", if json_str.len() > 100 { &json_str[..100] } else { &json_str });
                        let value = Self::parse_json_data(&json_str)?;
                        println!("DEBUG: Successfully parsed JSON");
                        Instruction::Set { variable, value }
                    } else {
                        let value = Self::parse_data(&value_str)?;
                        Instruction::Set { variable, value }
                    }
                }
                
                "GET" => {
                    if parts.len() < 3 {
                        return Err(format!("Invalid GET at line {}: expected source and target", i + 1));
                    }
                    Instruction::Get {
                        variable: parts[1].to_string(),
                        target: parts[2].to_string(),
                    }
                }
                
                _ => {
                    return Err(format!("Unknown instruction at line {}: {}", i + 1, parts[0]));
                }
            };
            
            instructions.push(instruction);
            i += 1;
        }
        
        Ok(instructions)
    }
    
    fn parse_data(value_str: &str) -> Result<Data, String> {
        let trimmed = value_str.trim();
        
        if trimmed == "null" {
            Ok(Data::Null)
        } else if trimmed == "true" {
            Ok(Data::Bool(true))
        } else if trimmed == "false" {
            Ok(Data::Bool(false))
        } else if let Ok(num) = trimmed.parse::<f64>() {
            Ok(Data::Number(num))
        } else if trimmed.starts_with('"') && trimmed.ends_with('"') {
            Ok(Data::String(trimmed[1..trimmed.len()-1].to_string()))
        } else if trimmed.starts_with('{') {
            Self::parse_json_data(trimmed)
        } else {
            // Treat as string
            Ok(Data::String(trimmed.to_string()))
        }
    }
    
    fn parse_json_data(json_str: &str) -> Result<Data, String> {
        // Parse JSON, substituting variables marked with $
        let processed = Self::preprocess_json_template(json_str);
        
        match serde_json::from_str::<serde_json::Value>(&processed) {
            Ok(json) => Ok(Data::from_json(json)),
            Err(e) => Err(format!("Invalid JSON: {}", e))
        }
    }
    
    fn parse_data_reference(value_str: &str) -> Result<Data, String> {
        let trimmed = value_str.trim();
        
        if trimmed.starts_with('$') {
            // Variable reference
            Ok(Data::String(trimmed.to_string()))
        } else {
            Self::parse_data(trimmed)
        }
    }
    
    fn preprocess_json_template(json_str: &str) -> String {
        // For now, don't process template variables - leave them as is
        // They will be handled during execution
        json_str.to_string()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_parse_instantiate() {
        let script = "INSTANTIATE auth auth1";
        let instructions = AssemblyParser::parse(script).unwrap();
        assert_eq!(instructions.len(), 1);
        match &instructions[0] {
            Instruction::Instantiate { class_name, object_id } => {
                assert_eq!(class_name, "auth");
                assert_eq!(object_id, "auth1");
            }
            _ => panic!("Expected Instantiate instruction")
        }
    }
    
    #[test]
    fn test_parse_set_with_json() {
        let script = r#"SET user_data {
            "email": "test@example.com",
            "name": "Test User"
        }"#;
        let instructions = AssemblyParser::parse(script).unwrap();
        assert_eq!(instructions.len(), 1);
        match &instructions[0] {
            Instruction::Set { variable, value } => {
                assert_eq!(variable, "user_data");
                match value {
                    Data::Object(obj) => {
                        assert_eq!(obj.get("email"), Some(&Data::String("test@example.com".to_string())));
                    }
                    _ => panic!("Expected Object data")
                }
            }
            _ => panic!("Expected Set instruction")
        }
    }
}