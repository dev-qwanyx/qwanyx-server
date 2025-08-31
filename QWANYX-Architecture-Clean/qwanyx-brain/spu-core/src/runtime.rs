//! SPU Runtime - Orchestrates assembly execution
//! 
//! This is the main runtime that apps interact with

use crate::{Coprocessor, Data, simple_parser::SimpleParser};
use std::collections::HashMap;
use std::sync::Arc;
use std::pin::Pin;
use std::future::Future;
use tokio::sync::RwLock;
use tracing::{debug, error, info};

pub struct SPURuntime {
    classes: Arc<RwLock<HashMap<String, Arc<dyn Coprocessor>>>>,
}

impl SPURuntime {
    pub fn new() -> Self {
        Self {
            classes: Arc::new(RwLock::new(HashMap::new())),
        }
    }
    
    /// Register a coprocessor class
    pub async fn register_class(&self, class_name: String, coprocessor: Arc<dyn Coprocessor>) {
        let mut classes = self.classes.write().await;
        classes.insert(class_name.clone(), coprocessor);
        info!("Registered coprocessor class: {}", class_name);
    }
    
    /// Execute an assembly script
    pub async fn execute(&self, script: &str) -> Result<Data, String> {
        info!("SPURuntime: Starting script execution");
        // Parse the script
        let instructions = SimpleParser::parse(script)?;
        info!("SPURuntime: Parsed {} instructions", instructions.len());
        
        // Create a new executor with registered classes
        let classes = self.classes.read().await;
        let mut executor = crate::runtime::AssemblyExecutor::new();
        
        // Copy classes to executor
        for (name, coprocessor) in classes.iter() {
            executor.register_class(name.clone(), coprocessor.clone());
        }
        
        // Execute instructions
        executor.execute(instructions).await
    }
}

/// Assembly Script Executor (internal)
struct AssemblyExecutor {
    instances: HashMap<String, Arc<dyn Coprocessor>>,
    variables: HashMap<String, Data>,
    classes: HashMap<String, Arc<dyn Coprocessor>>,
}

impl AssemblyExecutor {
    fn new() -> Self {
        Self {
            instances: HashMap::new(),
            variables: HashMap::new(),
            classes: HashMap::new(),
        }
    }
    
    fn register_class(&mut self, class_name: String, coprocessor: Arc<dyn Coprocessor>) {
        self.classes.insert(class_name, coprocessor);
    }
    
    async fn execute(&mut self, instructions: Vec<crate::Instruction>) -> Result<Data, String> {
        let mut last_result = Data::Null;
        
        for instruction in instructions {
            // Check if this is a HALT instruction
            if matches!(instruction, crate::Instruction::Halt) {
                info!("HALT: Stopping execution");
                break; // Stop executing further instructions
            }
            
            match self.execute_instruction(instruction).await {
                Ok(result) => last_result = result,
                Err(e) => {
                    error!("Execution error: {}", e);
                    return Err(e);
                }
            }
        }
        
        // Return the "result" variable if set, otherwise last result
        if let Some(result) = self.variables.get("result") {
            Ok(result.clone())
        } else {
            Ok(last_result)
        }
    }
    
    fn execute_instruction<'a>(&'a mut self, instruction: crate::Instruction) 
        -> Pin<Box<dyn Future<Output = Result<Data, String>> + Send + 'a>> {
        Box::pin(async move {
            self.execute_instruction_impl(instruction).await
        })
    }
    
    async fn execute_instruction_impl(&mut self, instruction: crate::Instruction) -> Result<Data, String> {
        use crate::Instruction;
        
        match instruction {
            Instruction::Instantiate { class_name, object_id } => {
                debug!("INSTANTIATE {} as {}", class_name, object_id);
                
                if let Some(coprocessor) = self.classes.get(&class_name) {
                    self.instances.insert(object_id.clone(), coprocessor.clone());
                    info!("Instantiated {} as {}", class_name, object_id);
                    Ok(Data::String(object_id))
                } else {
                    Err(format!("Unknown class: {}", class_name))
                }
            }
            
            Instruction::Call { object, method, args, target } => {
                debug!("CALL {}.{} with args: {:?}", object, method, args);
                
                let resolved_args = self.resolve_data(args)?;
                
                if let Some(coprocessor) = self.instances.get(&object) {
                    match coprocessor.invoke(&method, resolved_args).await {
                        Ok(result) => {
                            info!("Called {}.{} -> stored in {}", object, method, target);
                            self.variables.insert(target, result.clone());
                            Ok(result)
                        }
                        Err(e) => Err(format!("Method call failed: {}", e))
                    }
                } else {
                    Err(format!("Unknown object: {}", object))
                }
            }
            
            Instruction::Set { variable, value } => {
                debug!("SET {} = {:?}", variable, value);
                let resolved_value = self.resolve_data(value)?;
                self.variables.insert(variable.clone(), resolved_value.clone());
                info!("Set variable: {}", variable);
                Ok(resolved_value)
            }
            
            Instruction::Get { variable, target } => {
                debug!("GET {} -> {}", variable, target);
                
                // Handle nested access like "auth_result.code"
                let parts: Vec<&str> = variable.split('.').collect();
                
                if parts.len() == 1 {
                    // Simple variable access
                    if let Some(value) = self.variables.get(&variable).cloned() {
                        self.variables.insert(target.clone(), value.clone());
                        info!("Got variable {} -> {}", variable, target);
                        Ok(value)
                    } else {
                        Err(format!("Unknown variable: {}", variable))
                    }
                } else {
                    // Nested access
                    let base_var = parts[0];
                    if let Some(base_value) = self.variables.get(base_var) {
                        let mut current = base_value.clone();
                        
                        for field in &parts[1..] {
                            match current {
                                Data::Object(ref obj) => {
                                    if let Some(field_value) = obj.get(*field) {
                                        current = field_value.clone();
                                    } else {
                                        return Err(format!("Field {} not found in {}", field, base_var));
                                    }
                                }
                                _ => return Err(format!("{} is not an object", base_var))
                            }
                        }
                        
                        self.variables.insert(target.clone(), current.clone());
                        info!("Got nested variable {} -> {}", variable, target);
                        Ok(current)
                    } else {
                        Err(format!("Unknown variable: {}", base_var))
                    }
                }
            }
            
            Instruction::GetHealth { object, target } => {
                debug!("GETHEALTH {} -> {}", object, target);
                
                if let Some(coprocessor) = self.instances.get(&object) {
                    let health = coprocessor.health().await;
                    let health_str = format!("{:?}", health);
                    self.variables.insert(target.clone(), Data::String(health_str.clone()));
                    info!("Got health of {} -> {}", object, target);
                    Ok(Data::String(health_str))
                } else {
                    Err(format!("Unknown object: {}", object))
                }
            }
            
            Instruction::Try { instructions } => {
                debug!("TRY block with {} instructions", instructions.len());
                
                // Execute instructions, catching any errors
                let mut last_result = Data::Null;
                for instr in instructions {
                    match Box::pin(self.execute_instruction_impl(instr)).await {
                        Ok(result) => last_result = result,
                        Err(e) => {
                            // Store error for potential CATCH block
                            self.variables.insert("_error".to_string(), Data::String(e.clone()));
                            debug!("Error in TRY block: {}", e);
                            return Ok(Data::String(format!("Error: {}", e)));
                        }
                    }
                }
                Ok(last_result)
            }
            
            Instruction::Catch { error_type, handler } => {
                debug!("CATCH block for error type: {}", error_type);
                
                // Check if there was an error
                if let Some(error) = self.variables.get("_error") {
                    info!("Handling error: {:?}", error);
                    
                    // Execute handler instructions
                    let mut last_result = Data::Null;
                    for instr in handler {
                        match Box::pin(self.execute_instruction_impl(instr)).await {
                            Ok(result) => last_result = result,
                            Err(e) => return Err(format!("Error in CATCH handler: {}", e))
                        }
                    }
                    Ok(last_result)
                } else {
                    // No error to catch
                    Ok(Data::Null)
                }
            }
            
            Instruction::Trace { message, value } => {
                if let Some(val) = value {
                    info!("TRACE: {} = {:?}", message, val);
                } else {
                    info!("TRACE: {}", message);
                }
                Ok(Data::String(message))
            }
            
            Instruction::Halt => {
                info!("HALT: Stopping execution");
                Ok(Data::String("HALTED".to_string()))
            }
            
            // SPU 1.0 Phase 1 additions
            Instruction::Destroy { object_id } => {
                debug!("DESTROY {}", object_id);
                self.instances.remove(&object_id);
                info!("Destroyed object: {}", object_id);
                Ok(Data::Null)
            }
            
            Instruction::Nop => {
                debug!("NOP");
                Ok(Data::Null)
            }
            
            Instruction::Return { value } => {
                debug!("RETURN {}", value);
                let resolved = self.resolve_data(Data::String(value.clone()))?;
                self.variables.insert("_return".to_string(), resolved.clone());
                Ok(resolved)
            }
            
            Instruction::Throw { error_type, message } => {
                error!("THROW {}: {}", error_type, message);
                Err(format!("{}: {}", error_type, message))
            }
            
            Instruction::Expr { expression, target } => {
                debug!("EXPR {} -> {}", expression, target);
                // Simple expression evaluation (basic for now)
                let result = self.evaluate_expression(&expression)?;
                self.variables.insert(target.clone(), result.clone());
                info!("Expression result stored in {}", target);
                Ok(result)
            }
            
            Instruction::If { condition, then_branch, else_branch } => {
                debug!("IF {}", condition);
                let cond_result = self.evaluate_condition(&condition)?;
                
                if cond_result {
                    debug!("Executing THEN branch");
                    let mut last_result = Data::Null;
                    for instr in then_branch {
                        last_result = Box::pin(self.execute_instruction_impl(instr)).await?;
                    }
                    Ok(last_result)
                } else if let Some(else_instructions) = else_branch {
                    debug!("Executing ELSE branch");
                    let mut last_result = Data::Null;
                    for instr in else_instructions {
                        last_result = Box::pin(self.execute_instruction_impl(instr)).await?;
                    }
                    Ok(last_result)
                } else {
                    Ok(Data::Null)
                }
            }
            
            Instruction::While { condition, body } => {
                debug!("WHILE {}", condition);
                let mut last_result = Data::Null;
                let mut iteration = 0;
                const MAX_ITERATIONS: usize = 10000; // Safety limit
                
                while self.evaluate_condition(&condition)? && iteration < MAX_ITERATIONS {
                    debug!("While iteration {}", iteration);
                    for instr in body.clone() {
                        match instr {
                            Instruction::Break => {
                                debug!("BREAK encountered");
                                return Ok(last_result);
                            }
                            Instruction::Continue => {
                                debug!("CONTINUE encountered");
                                break; // Break inner loop, continue outer
                            }
                            _ => {
                                last_result = Box::pin(self.execute_instruction_impl(instr)).await?;
                            }
                        }
                    }
                    iteration += 1;
                }
                
                if iteration >= MAX_ITERATIONS {
                    return Err("While loop exceeded maximum iterations".to_string());
                }
                
                Ok(last_result)
            }
            
            Instruction::Foreach { item, collection, body } => {
                debug!("FOREACH {} IN {}", item, collection);
                
                let coll_data = if collection.starts_with('$') {
                    self.variables.get(&collection[1..])
                        .ok_or_else(|| format!("Unknown variable: {}", collection))?
                        .clone()
                } else {
                    self.resolve_data(Data::String(collection.clone()))?
                };
                
                let items = match coll_data {
                    Data::Array(arr) => arr,
                    _ => return Err("FOREACH requires an array".to_string())
                };
                
                let mut last_result = Data::Null;
                for item_value in items {
                    self.variables.insert(item.clone(), item_value);
                    
                    for instr in body.clone() {
                        match instr {
                            Instruction::Break => {
                                debug!("BREAK in FOREACH");
                                return Ok(last_result);
                            }
                            Instruction::Continue => {
                                debug!("CONTINUE in FOREACH");
                                break; // Skip to next item
                            }
                            _ => {
                                last_result = Box::pin(self.execute_instruction_impl(instr)).await?;
                            }
                        }
                    }
                }
                
                Ok(last_result)
            }
            
            Instruction::Break => {
                debug!("BREAK (outside loop context)");
                Ok(Data::Null)
            }
            
            Instruction::Continue => {
                debug!("CONTINUE (outside loop context)");
                Ok(Data::Null)
            }
            
            // SPU 1.0 Phase 2 additions
            Instruction::Async { object, method, args, handle } => {
                debug!("ASYNC {}.{} -> handle {}", object, method, handle);
                // For now, just execute synchronously and store handle
                // Real async implementation would spawn a task
                let resolved_args = self.resolve_data(args)?;
                
                if let Some(coprocessor) = self.instances.get(&object) {
                    match coprocessor.invoke(&method, resolved_args).await {
                        Ok(result) => {
                            self.variables.insert(handle.clone(), result.clone());
                            info!("Async call stored in handle {}", handle);
                            Ok(Data::String(handle))
                        }
                        Err(e) => Err(format!("Async method call failed: {}", e))
                    }
                } else {
                    Err(format!("Unknown object: {}", object))
                }
            }
            
            Instruction::Await { handle, target } => {
                debug!("AWAIT {} -> {}", handle, target);
                // For now, just retrieve the stored result
                let result = self.variables.get(&handle)
                    .ok_or_else(|| format!("Unknown async handle: {}", handle))?
                    .clone();
                self.variables.insert(target.clone(), result.clone());
                info!("Awaited {} -> {}", handle, target);
                Ok(result)
            }
            
            Instruction::Function { name, params, body: _ } => {
                debug!("FUNCTION {} with {} params", name, params.len());
                // Store function definition for later calling
                // This is a simplified implementation - real one would need proper scope
                info!("Function {} defined (simplified runtime)", name);
                Ok(Data::Null)
            }
            
            Instruction::CallFn { name, args: _, target } => {
                debug!("CALL_FN {} -> {}", name, target);
                // Simplified function call - would need proper scope handling
                info!("Function call {} (simplified implementation)", name);
                self.variables.insert(target.clone(), Data::String(format!("result_of_{}", name)));
                Ok(Data::String(format!("result_of_{}", name)))
            }
            
            Instruction::Len { collection, target } => {
                debug!("LEN {} -> {}", collection, target);
                
                let coll_data = if collection.starts_with('$') {
                    self.variables.get(&collection[1..])
                        .ok_or_else(|| format!("Unknown variable: {}", collection))?
                        .clone()
                } else {
                    self.resolve_data(Data::String(collection.clone()))?
                };
                
                let length = match coll_data {
                    Data::Array(ref arr) => arr.len(),
                    Data::String(ref s) => s.len(),
                    Data::Object(ref obj) => obj.len(),
                    _ => 0
                };
                
                let len_data = Data::Number(length as f64);
                self.variables.insert(target.clone(), len_data.clone());
                info!("Length of {} is {} -> {}", collection, length, target);
                Ok(len_data)
            }
            
            // SPU 1.0 Phase 3 additions
            Instruction::Parallel { tasks, target } => {
                debug!("PARALLEL with {} tasks -> {}", tasks.len(), target);
                // Simplified: execute sequentially for now
                // Real implementation would use tokio::join!
                let mut results = Vec::new();
                
                for (i, task_instructions) in tasks.iter().enumerate() {
                    debug!("Executing parallel task {}", i);
                    let mut last_result = Data::Null;
                    for instr in task_instructions {
                        last_result = Box::pin(self.execute_instruction_impl(instr.clone())).await?;
                    }
                    results.push(last_result);
                }
                
                let result_data = Data::Array(results);
                self.variables.insert(target.clone(), result_data.clone());
                info!("Parallel execution complete -> {}", target);
                Ok(result_data)
            }
            
            Instruction::Race { tasks, target } => {
                debug!("RACE with {} tasks -> {}", tasks.len(), target);
                // Simplified: just execute first task
                // Real implementation would use tokio::select!
                if let Some(first_task) = tasks.first() {
                    let mut last_result = Data::Null;
                    for instr in first_task {
                        last_result = Box::pin(self.execute_instruction_impl(instr.clone())).await?;
                    }
                    self.variables.insert(target.clone(), last_result.clone());
                    info!("Race winner stored in {}", target);
                    Ok(last_result)
                } else {
                    Ok(Data::Null)
                }
            }
            
            Instruction::GetMethods { object, target } => {
                debug!("GET_METHODS {} -> {}", object, target);
                
                if let Some(coprocessor) = self.instances.get(&object) {
                    let methods = coprocessor.methods();
                    let method_names: Vec<Data> = methods.iter()
                        .map(|m| Data::String(m.name.clone()))
                        .collect();
                    
                    let result = Data::Array(method_names);
                    self.variables.insert(target.clone(), result.clone());
                    info!("Got {} methods from {} -> {}", methods.len(), object, target);
                    Ok(result)
                } else {
                    Err(format!("Unknown object: {}", object))
                }
            }
            
            _ => {
                error!("Unknown instruction: {:?}", instruction);
                Err(format!("Unknown instruction"))
            }
        }
    }
    
    fn resolve_data(&self, data: Data) -> Result<Data, String> {
        match data {
            Data::String(s) if s.starts_with('$') => {
                // Variable reference
                let var_name = &s[1..];
                
                // Check for nested access
                if var_name.contains('.') {
                    let parts: Vec<&str> = var_name.split('.').collect();
                    let base_var = parts[0];
                    
                    if let Some(base_value) = self.variables.get(base_var) {
                        let mut current = base_value.clone();
                        
                        for field in &parts[1..] {
                            match current {
                                Data::Object(ref obj) => {
                                    if let Some(field_value) = obj.get(*field) {
                                        current = field_value.clone();
                                    } else {
                                        return Err(format!("Field {} not found in variable {}", field, base_var));
                                    }
                                }
                                _ => return Err(format!("{} is not an object", base_var))
                            }
                        }
                        
                        Ok(current)
                    } else {
                        Err(format!("Unknown variable: {}", base_var))
                    }
                } else {
                    // Simple variable reference
                    self.variables.get(var_name)
                        .cloned()
                        .ok_or_else(|| format!("Unknown variable: {}", var_name))
                }
            }
            Data::Object(obj) => {
                // Recursively resolve object fields, including special template handling
                let mut resolved = HashMap::new();
                for (key, value) in obj {
                    let resolved_value = match &value {
                        Data::String(s) if s.contains("$") => {
                            // Handle template strings like "Your code is: $code"
                            let mut result = s.clone();
                            
                            // Find all variable references
                            let mut start = 0;
                            while let Some(pos) = result[start..].find('$') {
                                let abs_pos = start + pos;
                                let var_end = result[abs_pos+1..]
                                    .chars()
                                    .position(|c| !c.is_alphanumeric() && c != '_' && c != '.')
                                    .map(|p| abs_pos + 1 + p)
                                    .unwrap_or(result.len());
                                
                                let var_name = &result[abs_pos+1..var_end];
                                
                                if let Ok(var_value) = self.resolve_var_reference(var_name) {
                                    let replacement = match var_value {
                                        Data::String(s) => s,
                                        Data::Number(n) => n.to_string(),
                                        Data::Bool(b) => b.to_string(),
                                        _ => format!("{:?}", var_value),
                                    };
                                    result.replace_range(abs_pos..var_end, &replacement);
                                    start = abs_pos + replacement.len();
                                } else {
                                    start = var_end;
                                }
                            }
                            
                            Data::String(result)
                        }
                        _ => self.resolve_data(value.clone())?
                    };
                    resolved.insert(key, resolved_value);
                }
                Ok(Data::Object(resolved))
            }
            Data::Array(arr) => {
                // Recursively resolve array elements
                let mut resolved = Vec::new();
                for item in arr {
                    resolved.push(self.resolve_data(item)?);
                }
                Ok(Data::Array(resolved))
            }
            // Other types are returned as-is
            _ => Ok(data)
        }
    }
    
    fn resolve_var_reference(&self, var_name: &str) -> Result<Data, String> {
        // Check for nested access
        if var_name.contains('.') {
            let parts: Vec<&str> = var_name.split('.').collect();
            let base_var = parts[0];
            
            if let Some(base_value) = self.variables.get(base_var) {
                let mut current = base_value.clone();
                
                for field in &parts[1..] {
                    match current {
                        Data::Object(ref obj) => {
                            if let Some(field_value) = obj.get(*field) {
                                current = field_value.clone();
                            } else {
                                return Err(format!("Field {} not found", field));
                            }
                        }
                        _ => return Err(format!("{} is not an object", base_var))
                    }
                }
                
                Ok(current)
            } else {
                Err(format!("Unknown variable: {}", base_var))
            }
        } else {
            // Simple variable reference
            self.variables.get(var_name)
                .cloned()
                .ok_or_else(|| format!("Unknown variable: {}", var_name))
        }
    }
    
    fn evaluate_condition(&self, condition: &str) -> Result<bool, String> {
        // Simple condition evaluation - supports basic comparisons
        // Examples: "$x == 5", "$status == \"active\"", "true", "$count > 0"
        
        let trimmed = condition.trim();
        
        // Handle simple boolean literals
        if trimmed == "true" {
            return Ok(true);
        }
        if trimmed == "false" {
            return Ok(false);
        }
        
        // Check for comparison operators
        if let Some(pos) = trimmed.find("==") {
            let left = trimmed[..pos].trim();
            let right = trimmed[pos+2..].trim();
            return self.compare_values(left, right, "==");
        }
        
        if let Some(pos) = trimmed.find("!=") {
            let left = trimmed[..pos].trim();
            let right = trimmed[pos+2..].trim();
            return self.compare_values(left, right, "!=");
        }
        
        if let Some(pos) = trimmed.find(">=") {
            let left = trimmed[..pos].trim();
            let right = trimmed[pos+2..].trim();
            return self.compare_values(left, right, ">=");
        }
        
        if let Some(pos) = trimmed.find("<=") {
            let left = trimmed[..pos].trim();
            let right = trimmed[pos+2..].trim();
            return self.compare_values(left, right, "<=");
        }
        
        if let Some(pos) = trimmed.find('>') {
            let left = trimmed[..pos].trim();
            let right = trimmed[pos+1..].trim();
            return self.compare_values(left, right, ">");
        }
        
        if let Some(pos) = trimmed.find('<') {
            let left = trimmed[..pos].trim();
            let right = trimmed[pos+1..].trim();
            return self.compare_values(left, right, "<");
        }
        
        // If it's a variable, check if it's truthy
        if trimmed.starts_with('$') {
            let var_name = &trimmed[1..];
            if let Ok(value) = self.resolve_var_reference(var_name) {
                return Ok(match value {
                    Data::Bool(b) => b,
                    Data::Null => false,
                    Data::Number(n) => n != 0.0,
                    Data::String(ref s) => !s.is_empty(),
                    _ => true
                });
            }
        }
        
        Err(format!("Cannot evaluate condition: {}", condition))
    }
    
    fn compare_values(&self, left: &str, right: &str, op: &str) -> Result<bool, String> {
        let left_value = self.parse_value(left)?;
        let right_value = self.parse_value(right)?;
        
        match op {
            "==" => Ok(self.values_equal(&left_value, &right_value)),
            "!=" => Ok(!self.values_equal(&left_value, &right_value)),
            ">" => self.compare_numeric(&left_value, &right_value, |a, b| a > b),
            "<" => self.compare_numeric(&left_value, &right_value, |a, b| a < b),
            ">=" => self.compare_numeric(&left_value, &right_value, |a, b| a >= b),
            "<=" => self.compare_numeric(&left_value, &right_value, |a, b| a <= b),
            _ => Err(format!("Unknown operator: {}", op))
        }
    }
    
    fn parse_value(&self, value: &str) -> Result<Data, String> {
        let trimmed = value.trim();
        
        // Variable reference
        if trimmed.starts_with('$') {
            let var_name = &trimmed[1..];
            return self.resolve_var_reference(var_name);
        }
        
        // String literal
        if (trimmed.starts_with('"') && trimmed.ends_with('"')) ||
           (trimmed.starts_with('\'') && trimmed.ends_with('\'')) {
            return Ok(Data::String(trimmed[1..trimmed.len()-1].to_string()));
        }
        
        // Number literal
        if let Ok(n) = trimmed.parse::<f64>() {
            return Ok(Data::Number(n));
        }
        
        // Boolean literal
        if trimmed == "true" {
            return Ok(Data::Bool(true));
        }
        if trimmed == "false" {
            return Ok(Data::Bool(false));
        }
        
        // Treat as string if nothing else matches
        Ok(Data::String(trimmed.to_string()))
    }
    
    fn values_equal(&self, left: &Data, right: &Data) -> bool {
        match (left, right) {
            (Data::Null, Data::Null) => true,
            (Data::Bool(a), Data::Bool(b)) => a == b,
            (Data::Number(a), Data::Number(b)) => (a - b).abs() < 0.0001,
            (Data::String(a), Data::String(b)) => a == b,
            _ => false
        }
    }
    
    fn compare_numeric(&self, left: &Data, right: &Data, op: fn(f64, f64) -> bool) -> Result<bool, String> {
        match (left, right) {
            (Data::Number(a), Data::Number(b)) => Ok(op(*a, *b)),
            _ => Err("Numeric comparison requires numbers".to_string())
        }
    }
    
    fn evaluate_expression(&self, expression: &str) -> Result<Data, String> {
        // Simple expression evaluation
        // Supports: "$x + 1", "$count * 2", etc.
        
        let trimmed = expression.trim();
        
        // Remove quotes if it's a quoted expression
        let expr = if (trimmed.starts_with('"') && trimmed.ends_with('"')) ||
                     (trimmed.starts_with('\'') && trimmed.ends_with('\'')) {
            &trimmed[1..trimmed.len()-1]
        } else {
            trimmed
        };
        
        // Check for arithmetic operations
        if let Some(pos) = expr.find(" + ") {
            let left = self.parse_value(&expr[..pos])?;
            let right = self.parse_value(&expr[pos+3..])?;
            
            match (left, right) {
                (Data::Number(a), Data::Number(b)) => Ok(Data::Number(a + b)),
                (Data::String(a), Data::String(b)) => Ok(Data::String(format!("{}{}", a, b))),
                _ => Err("Invalid operands for +".to_string())
            }
        } else if let Some(pos) = expr.find(" - ") {
            let left = self.parse_value(&expr[..pos])?;
            let right = self.parse_value(&expr[pos+3..])?;
            
            match (left, right) {
                (Data::Number(a), Data::Number(b)) => Ok(Data::Number(a - b)),
                _ => Err("Subtraction requires numbers".to_string())
            }
        } else if let Some(pos) = expr.find(" * ") {
            let left = self.parse_value(&expr[..pos])?;
            let right = self.parse_value(&expr[pos+3..])?;
            
            match (left, right) {
                (Data::Number(a), Data::Number(b)) => Ok(Data::Number(a * b)),
                _ => Err("Multiplication requires numbers".to_string())
            }
        } else if let Some(pos) = expr.find(" / ") {
            let left = self.parse_value(&expr[..pos])?;
            let right = self.parse_value(&expr[pos+3..])?;
            
            match (left, right) {
                (Data::Number(a), Data::Number(b)) if b != 0.0 => Ok(Data::Number(a / b)),
                (Data::Number(_), Data::Number(_)) => Err("Division by zero".to_string()),
                _ => Err("Division requires numbers".to_string())
            }
        } else {
            // Try to evaluate as a condition (returns bool as Data)
            if expr.contains("==") || expr.contains("!=") || expr.contains('>') || expr.contains('<') {
                let result = self.evaluate_condition(expr)?;
                Ok(Data::Bool(result))
            } else {
                // Just parse as a value
                self.parse_value(expr)
            }
        }
    }
}