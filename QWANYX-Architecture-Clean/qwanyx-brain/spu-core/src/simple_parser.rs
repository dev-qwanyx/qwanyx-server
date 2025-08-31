//! SIMPLE Parser - Just parse instructions, nothing fancy
//! 
//! Core 9 instructions:
//! 1. INSTANTIATE class_name instance_name
//! 2. CALL instance method args result_var
//! 3. SET var value
//! 4. GET var.field target_var
//! 5. GETHEALTH instance result
//! 6. TRY (starts try block)
//! 7. CATCH error_type (catches errors)
//! 8. TRACE message
//! 9. HALT

use crate::{Instruction, Data, JoinMode, BackoffStrategy};
use serde_json::Value;

pub struct SimpleParser;

impl SimpleParser {
    pub fn parse(script: &str) -> Result<Vec<Instruction>, String> {
        let mut instructions = Vec::new();
        let lines: Vec<&str> = script.lines().collect();
        let mut i = 0;
        
        while i < lines.len() {
            let line = lines[i].trim();
            
            // Skip empty lines and comments
            if line.is_empty() || line.starts_with('#') {
                i += 1;
                continue;
            }
            
            // Split into parts
            let parts: Vec<&str> = line.split_whitespace().collect();
            if parts.is_empty() {
                i += 1;
                continue;
            }
            
            let instruction = match parts[0].to_uppercase().as_str() {
                "INSTANTIATE" => {
                    if parts.len() != 3 {
                        return Err(format!("Line {}: INSTANTIATE needs class_name and instance_name", i + 1));
                    }
                    Instruction::Instantiate {
                        class_name: parts[1].to_string(),
                        object_id: parts[2].to_string(),
                    }
                }
                
                "CALL" => {
                    if parts.len() < 5 {
                        return Err(format!("Line {}: CALL needs instance method args result", i + 1));
                    }
                    
                    // Everything from args position to before result is the args
                    let args_str = parts[3..parts.len()-1].join(" ");
                    let args = Self::parse_value(&args_str);
                    
                    Instruction::Call {
                        object: parts[1].to_string(),
                        method: parts[2].to_string(),
                        args,
                        target: parts[parts.len() - 1].to_string(),
                    }
                }
                
                "SET" => {
                    if parts.len() < 3 {
                        return Err(format!("Line {}: SET needs variable and value", i + 1));
                    }
                    
                    let variable = parts[1].to_string();
                    let value_str = parts[2..].join(" ");
                    
                    // Check if this is the start of a multi-line JSON object
                    let value = if value_str.trim() == "{" {
                        // Collect lines until we find the closing }
                        let mut json_lines = vec!["{".to_string()];
                        let mut brace_count = 1;
                        i += 1;
                        
                        while i < lines.len() && brace_count > 0 {
                            let json_line = lines[i].trim();
                            
                            // Skip empty lines and comments
                            if json_line.is_empty() || json_line.starts_with('#') {
                                i += 1;
                                continue;
                            }
                            
                            json_lines.push(json_line.to_string());
                            
                            // Count braces to find the end
                            for ch in json_line.chars() {
                                if ch == '{' {
                                    brace_count += 1;
                                } else if ch == '}' {
                                    brace_count -= 1;
                                }
                            }
                            
                            if brace_count == 0 {
                                break;
                            }
                            i += 1;
                        }
                        
                        let json_str = json_lines.join("\n");
                        Self::parse_value(&json_str)
                    } else if value_str.trim() == "[" {
                        // Handle multi-line arrays similarly
                        let mut array_lines = vec!["[".to_string()];
                        let mut bracket_count = 1;
                        i += 1;
                        
                        while i < lines.len() && bracket_count > 0 {
                            let array_line = lines[i].trim();
                            
                            // Skip empty lines and comments
                            if array_line.is_empty() || array_line.starts_with('#') {
                                i += 1;
                                continue;
                            }
                            
                            array_lines.push(array_line.to_string());
                            
                            // Count brackets to find the end
                            for ch in array_line.chars() {
                                if ch == '[' {
                                    bracket_count += 1;
                                } else if ch == ']' {
                                    bracket_count -= 1;
                                }
                            }
                            
                            if bracket_count == 0 {
                                break;
                            }
                            i += 1;
                        }
                        
                        let array_str = array_lines.join(" ");
                        Self::parse_value(&array_str)
                    } else {
                        // Single line value
                        Self::parse_value(&value_str)
                    };
                    
                    Instruction::Set { variable, value }
                }
                
                "GET" => {
                    if parts.len() != 3 {
                        return Err(format!("Line {}: GET needs source and target", i + 1));
                    }
                    Instruction::Get {
                        variable: parts[1].to_string(),
                        target: parts[2].to_string(),
                    }
                }
                
                "GETHEALTH" => {
                    if parts.len() != 3 {
                        return Err(format!("Line {}: GETHEALTH needs instance and result", i + 1));
                    }
                    Instruction::GetHealth {
                        object: parts[1].to_string(),
                        target: parts[2].to_string(),
                    }
                }
                
                "TRY" => {
                    // Collect all instructions until CATCH
                    let mut try_instructions = Vec::new();
                    i += 1;
                    while i < lines.len() {
                        let next_line = lines[i].trim();
                        if next_line.starts_with("CATCH") {
                            break;
                        }
                        // Parse the instruction inside TRY block
                        if !next_line.is_empty() && !next_line.starts_with('#') {
                            // Recursively parse the line
                            if let Ok(mut inner) = Self::parse(next_line) {
                                try_instructions.append(&mut inner);
                            }
                        }
                        i += 1;
                    }
                    Instruction::Try { instructions: try_instructions }
                }
                
                "CATCH" => {
                    let error_type = if parts.len() > 1 {
                        parts[1].to_string()
                    } else {
                        "*".to_string() // Catch all
                    };
                    
                    // Collect handler instructions until next main instruction
                    let mut handler = Vec::new();
                    i += 1;
                    while i < lines.len() {
                        let next_line = lines[i].trim();
                        // Stop at next main instruction
                        if !next_line.is_empty() && !next_line.starts_with('#') && !next_line.starts_with("  ") {
                            i -= 1; // Back up one line
                            break;
                        }
                        // Parse indented handler instructions
                        if !next_line.is_empty() && !next_line.starts_with('#') {
                            if let Ok(mut inner) = Self::parse(next_line) {
                                handler.append(&mut inner);
                            }
                        }
                        i += 1;
                    }
                    
                    Instruction::Catch { error_type, handler }
                }
                
                "TRACE" => {
                    if parts.len() < 2 {
                        return Err(format!("Line {}: TRACE needs a message", i + 1));
                    }
                    let message = parts[1..].join(" ");
                    Instruction::Trace { 
                        message, 
                        value: None 
                    }
                }
                
                "HALT" => {
                    Instruction::Halt
                }
                
                "NOP" => {
                    Instruction::Nop
                }
                
                "DESTROY" => {
                    if parts.len() != 2 {
                        return Err(format!("Line {}: DESTROY needs instance_name", i + 1));
                    }
                    Instruction::Destroy {
                        object_id: parts[1].to_string(),
                    }
                }
                
                "RETURN" => {
                    if parts.len() < 2 {
                        return Err(format!("Line {}: RETURN needs a value", i + 1));
                    }
                    let value = parts[1..].join(" ");
                    Instruction::Return { value }
                }
                
                "THROW" => {
                    if parts.len() < 3 {
                        return Err(format!("Line {}: THROW needs error_type and message", i + 1));
                    }
                    let error_type = parts[1].to_string();
                    let message = parts[2..].join(" ");
                    Instruction::Throw { error_type, message }
                }
                
                "BREAK" => {
                    Instruction::Break
                }
                
                "CONTINUE" => {
                    Instruction::Continue
                }
                
                "EXPR" => {
                    if parts.len() < 3 {
                        return Err(format!("Line {}: EXPR needs expression and target", i + 1));
                    }
                    // Expression is everything except the last word (which is the target)
                    let expression = parts[1..parts.len()-1].join(" ");
                    let target = parts[parts.len()-1].to_string();
                    Instruction::Expr { expression, target }
                }
                
                "LEN" => {
                    if parts.len() != 3 {
                        return Err(format!("Line {}: LEN needs collection and target", i + 1));
                    }
                    Instruction::Len {
                        collection: parts[1].to_string(),
                        target: parts[2].to_string(),
                    }
                }
                
                "IF" => {
                    if parts.len() < 2 {
                        return Err(format!("Line {}: IF needs a condition", i + 1));
                    }
                    let condition = parts[1..].join(" ");
                    
                    // Collect THEN branch
                    let mut then_branch = Vec::new();
                    let mut else_branch = None;
                    i += 1;
                    
                    while i < lines.len() {
                        let next_line = lines[i].trim();
                        
                        if next_line.starts_with("ELSE") {
                            // Start collecting ELSE branch
                            let mut else_instructions = Vec::new();
                            i += 1;
                            while i < lines.len() {
                                let else_line = lines[i].trim();
                                if else_line.starts_with("ENDIF") {
                                    break;
                                }
                                if !else_line.is_empty() && !else_line.starts_with('#') {
                                    if let Ok(mut inner) = Self::parse(else_line) {
                                        else_instructions.append(&mut inner);
                                    }
                                }
                                i += 1;
                            }
                            else_branch = Some(else_instructions);
                            break;
                        } else if next_line.starts_with("ENDIF") {
                            break;
                        }
                        
                        // Parse instructions in THEN branch
                        if !next_line.is_empty() && !next_line.starts_with('#') {
                            if let Ok(mut inner) = Self::parse(next_line) {
                                then_branch.append(&mut inner);
                            }
                        }
                        i += 1;
                    }
                    
                    Instruction::If { condition, then_branch, else_branch }
                }
                
                "WHILE" => {
                    if parts.len() < 2 {
                        return Err(format!("Line {}: WHILE needs a condition", i + 1));
                    }
                    let condition = parts[1..].join(" ");
                    
                    // Collect loop body
                    let mut body = Vec::new();
                    i += 1;
                    
                    while i < lines.len() {
                        let next_line = lines[i].trim();
                        
                        if next_line.starts_with("ENDWHILE") {
                            break;
                        }
                        
                        // Parse instructions in loop body
                        if !next_line.is_empty() && !next_line.starts_with('#') {
                            if let Ok(mut inner) = Self::parse(next_line) {
                                body.append(&mut inner);
                            }
                        }
                        i += 1;
                    }
                    
                    Instruction::While { condition, body }
                }
                
                "ASYNC" => {
                    if parts.len() < 5 {
                        return Err(format!("Line {}: ASYNC needs instance method args handle", i + 1));
                    }
                    
                    // Everything from args position to before handle is the args
                    let args_str = parts[3..parts.len()-1].join(" ");
                    let args = Self::parse_value(&args_str);
                    
                    Instruction::Async {
                        object: parts[1].to_string(),
                        method: parts[2].to_string(),
                        args,
                        handle: parts[parts.len() - 1].to_string(),
                    }
                }
                
                "AWAIT" => {
                    if parts.len() != 3 {
                        return Err(format!("Line {}: AWAIT needs handle and target", i + 1));
                    }
                    Instruction::Await {
                        handle: parts[1].to_string(),
                        target: parts[2].to_string(),
                    }
                }
                
                "FUNCTION" => {
                    // FUNCTION name(param1, param2)
                    if parts.len() < 2 {
                        return Err(format!("Line {}: FUNCTION needs name and parameters", i + 1));
                    }
                    
                    let func_signature = parts[1..].join(" ");
                    // Parse function name and params from "name(param1, param2)"
                    let (name, params) = if let Some(paren_idx) = func_signature.find('(') {
                        let name = func_signature[..paren_idx].to_string();
                        let params_str = func_signature[paren_idx+1..].trim_end_matches(')');
                        let params: Vec<String> = if params_str.is_empty() {
                            Vec::new()
                        } else {
                            params_str.split(',').map(|s| s.trim().to_string()).collect()
                        };
                        (name, params)
                    } else {
                        (func_signature, Vec::new())
                    };
                    
                    // Collect function body
                    let mut body = Vec::new();
                    i += 1;
                    
                    while i < lines.len() {
                        let next_line = lines[i].trim();
                        
                        if next_line.starts_with("ENDFUNCTION") {
                            break;
                        }
                        
                        if !next_line.is_empty() && !next_line.starts_with('#') {
                            if let Ok(mut inner) = Self::parse(next_line) {
                                body.append(&mut inner);
                            }
                        }
                        i += 1;
                    }
                    
                    Instruction::Function { name, params, body }
                }
                
                "CALL_FN" => {
                    if parts.len() < 3 {
                        return Err(format!("Line {}: CALL_FN needs name args target", i + 1));
                    }
                    
                    let name = parts[1].to_string();
                    let target = parts[parts.len() - 1].to_string();
                    
                    // Parse args between name and target
                    let args = if parts.len() > 3 {
                        parts[2..parts.len()-1].iter().map(|arg| {
                            Self::parse_value(arg)
                        }).collect()
                    } else {
                        Vec::new()
                    };
                    
                    Instruction::CallFn { name, args, target }
                }
                
                "PARALLEL" => {
                    // Collect parallel tasks separated by |
                    let mut tasks = Vec::new();
                    let mut current_task = Vec::new();
                    i += 1;
                    
                    while i < lines.len() {
                        let next_line = lines[i].trim();
                        
                        if next_line.starts_with("ENDPARALLEL") {
                            if !current_task.is_empty() {
                                tasks.push(current_task);
                            }
                            break;
                        } else if next_line == "|" {
                            if !current_task.is_empty() {
                                tasks.push(current_task);
                                current_task = Vec::new();
                            }
                        } else if !next_line.is_empty() && !next_line.starts_with('#') {
                            if let Ok(mut inner) = Self::parse(next_line) {
                                current_task.append(&mut inner);
                            }
                        }
                        i += 1;
                    }
                    
                    // Get target variable (last word on PARALLEL line)
                    let target = if parts.len() > 1 {
                        parts[parts.len() - 1].to_string()
                    } else {
                        "parallel_result".to_string()
                    };
                    
                    Instruction::Parallel { tasks, target }
                }
                
                "RACE" => {
                    // Similar to PARALLEL but returns first result
                    let mut tasks = Vec::new();
                    let mut current_task = Vec::new();
                    i += 1;
                    
                    while i < lines.len() {
                        let next_line = lines[i].trim();
                        
                        if next_line.starts_with("ENDRACE") {
                            if !current_task.is_empty() {
                                tasks.push(current_task);
                            }
                            break;
                        } else if next_line == "|" {
                            if !current_task.is_empty() {
                                tasks.push(current_task);
                                current_task = Vec::new();
                            }
                        } else if !next_line.is_empty() && !next_line.starts_with('#') {
                            if let Ok(mut inner) = Self::parse(next_line) {
                                current_task.append(&mut inner);
                            }
                        }
                        i += 1;
                    }
                    
                    let target = if parts.len() > 1 {
                        parts[parts.len() - 1].to_string()
                    } else {
                        "race_result".to_string()
                    };
                    
                    Instruction::Race { tasks, target }
                }
                
                "GET_METHODS" => {
                    if parts.len() != 3 {
                        return Err(format!("Line {}: GET_METHODS needs instance and target", i + 1));
                    }
                    Instruction::GetMethods {
                        object: parts[1].to_string(),
                        target: parts[2].to_string(),
                    }
                }
                
                "FOREACH" => {
                    // FOREACH item IN collection
                    if parts.len() < 4 || parts[2].to_uppercase() != "IN" {
                        return Err(format!("Line {}: FOREACH needs 'item IN collection' syntax", i + 1));
                    }
                    let item = parts[1].to_string();
                    let collection = parts[3..].join(" ");
                    
                    // Collect loop body
                    let mut body = Vec::new();
                    i += 1;
                    
                    while i < lines.len() {
                        let next_line = lines[i].trim();
                        
                        if next_line.starts_with("ENDFOREACH") {
                            break;
                        }
                        
                        // Parse instructions in loop body
                        if !next_line.is_empty() && !next_line.starts_with('#') {
                            if let Ok(mut inner) = Self::parse(next_line) {
                                body.append(&mut inner);
                            }
                        }
                        i += 1;
                    }
                    
                    Instruction::Foreach { item, collection, body }
                }
                
                _ => {
                    return Err(format!("Line {}: Unknown instruction '{}'", i + 1, parts[0]));
                }
            };
            
            instructions.push(instruction);
            i += 1;
        }
        
        Ok(instructions)
    }
    
    fn parse_value(value_str: &str) -> Data {
        let trimmed = value_str.trim();
        
        if trimmed.starts_with('{') && trimmed.ends_with('}') {
            // Try to parse as JSON
            match serde_json::from_str::<Value>(trimmed) {
                Ok(json) => Data::from_json(json),
                Err(_) => Data::String(trimmed.to_string()),
            }
        } else if trimmed.starts_with('$') {
            // Variable reference
            Data::String(trimmed.to_string())
        } else if trimmed == "null" {
            Data::Null
        } else if trimmed == "true" {
            Data::Bool(true)
        } else if trimmed == "false" {
            Data::Bool(false)
        } else if let Ok(num) = trimmed.parse::<f64>() {
            Data::Number(num)
        } else {
            Data::String(trimmed.to_string())
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_parse_instantiate() {
        let script = "INSTANTIATE auth auth1";
        let instructions = SimpleParser::parse(script).unwrap();
        assert_eq!(instructions.len(), 1);
        match &instructions[0] {
            Instruction::Instantiate { class_name, object_id } => {
                assert_eq!(class_name, "auth");
                assert_eq!(object_id, "auth1");
            }
            _ => panic!("Expected Instantiate")
        }
    }
    
    #[test]
    fn test_parse_call() {
        let script = r#"CALL auth1 register {"email": "test@example.com"} result"#;
        let instructions = SimpleParser::parse(script).unwrap();
        assert_eq!(instructions.len(), 1);
        match &instructions[0] {
            Instruction::Call { object, method, args, target } => {
                assert_eq!(object, "auth1");
                assert_eq!(method, "register");
                assert_eq!(target, "result");
            }
            _ => panic!("Expected Call")
        }
    }
    
    #[test]
    fn test_parse_set_get() {
        let script = r#"
SET user_data {"email": "test@example.com"}
GET user_data.email email_var
"#;
        let instructions = SimpleParser::parse(script).unwrap();
        assert_eq!(instructions.len(), 2);
    }
    
    #[test]
    fn test_parse_gethealth() {
        let script = "GETHEALTH auth1 health_status";
        let instructions = SimpleParser::parse(script).unwrap();
        assert_eq!(instructions.len(), 1);
        match &instructions[0] {
            Instruction::GetHealth { object, target } => {
                assert_eq!(object, "auth1");
                assert_eq!(target, "health_status");
            }
            _ => panic!("Expected GetHealth")
        }
    }
    
    #[test]
    fn test_parse_trace() {
        let script = "TRACE Starting authentication process";
        let instructions = SimpleParser::parse(script).unwrap();
        assert_eq!(instructions.len(), 1);
        match &instructions[0] {
            Instruction::Trace { message, value } => {
                assert_eq!(message, "Starting authentication process");
                assert_eq!(value, &None);
            }
            _ => panic!("Expected Trace")
        }
    }
    
    #[test]
    fn test_parse_try_catch() {
        let script = r#"
TRY
  CALL auth1 register $data result
CATCH AuthError
  TRACE Authentication failed
HALT
"#;
        let instructions = SimpleParser::parse(script).unwrap();
        assert_eq!(instructions.len(), 3); // TRY, CATCH, HALT
    }
}