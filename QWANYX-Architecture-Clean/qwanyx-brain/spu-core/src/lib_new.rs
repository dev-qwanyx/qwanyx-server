// SPU Core - Object-Oriented Assembly Language Runtime
// 
// Universal runtime for intelligence, regardless of substrate.
// Objects can be Rust services, Python models, humans, or any computational entity.

use serde::{Deserialize, Serialize};
use serde_json::Value as JsonValue;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use thiserror::Error;
use uuid::Uuid;

// ================================================================================
// DATA TYPES - Universal JSON-based
// ================================================================================

/// Universal data type for all SPU operations
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(untagged)]
pub enum Data {
    Null,
    Bool(bool),
    Number(f64),
    String(String),
    Array(Vec<Data>),
    Object(HashMap<String, Data>),
    #[serde(skip)]
    ObjectRef(ObjectId),
}

impl Data {
    /// Convert from JSON
    pub fn from_json(value: JsonValue) -> Self {
        match value {
            JsonValue::Null => Data::Null,
            JsonValue::Bool(b) => Data::Bool(b),
            JsonValue::Number(n) => Data::Number(n.as_f64().unwrap_or(0.0)),
            JsonValue::String(s) => Data::String(s),
            JsonValue::Array(arr) => Data::Array(arr.into_iter().map(Data::from_json).collect()),
            JsonValue::Object(obj) => {
                Data::Object(obj.into_iter().map(|(k, v)| (k, Data::from_json(v))).collect())
            }
        }
    }

    /// Convert to JSON
    pub fn to_json(&self) -> JsonValue {
        match self {
            Data::Null => JsonValue::Null,
            Data::Bool(b) => JsonValue::Bool(*b),
            Data::Number(n) => JsonValue::Number(serde_json::Number::from_f64(*n).unwrap_or(serde_json::Number::from(0))),
            Data::String(s) => JsonValue::String(s.clone()),
            Data::Array(arr) => JsonValue::Array(arr.iter().map(|d| d.to_json()).collect()),
            Data::Object(obj) => {
                JsonValue::Object(obj.iter().map(|(k, v)| (k.clone(), v.to_json())).collect())
            }
            Data::ObjectRef(id) => JsonValue::String(format!("@{}", id.0)),
        }
    }
}

impl Default for Data {
    fn default() -> Self {
        Data::Null
    }
}

// ================================================================================
// OBJECT SYSTEM - Coprocessors
// ================================================================================

/// Object identifier
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct ObjectId(pub String);

impl ObjectId {
    pub fn new() -> Self {
        ObjectId(Uuid::new_v4().to_string())
    }
}

/// Method signature for introspection
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MethodSignature {
    pub name: String,
    pub description: String,
    pub input_schema: Option<JsonValue>,
    pub output_schema: Option<JsonValue>,
}

/// Object health status
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Health {
    Healthy,
    Degraded { reason: String },
    Unhealthy { error: String },
    Unknown,
}

/// Coprocessor trait - any object that can process methods
#[async_trait::async_trait]
pub trait Coprocessor: Send + Sync {
    /// Get the class name of this coprocessor
    fn class_name(&self) -> String;
    
    /// List available methods
    fn methods(&self) -> Vec<MethodSignature>;
    
    /// Invoke a method on this coprocessor
    async fn invoke(&self, method: &str, args: Data) -> Result<Data, CoprocessorError>;
    
    /// Check if this coprocessor can handle a method
    fn can_handle(&self, method: &str) -> bool {
        self.methods().iter().any(|m| m.name == method)
    }
    
    /// Get health status
    async fn health(&self) -> Health {
        Health::Healthy
    }
}

/// Error type for coprocessor operations
#[derive(Debug, Error)]
pub enum CoprocessorError {
    #[error("Method not found: {0}")]
    MethodNotFound(String),
    
    #[error("Invalid arguments: {0}")]
    InvalidArguments(String),
    
    #[error("Execution error: {0}")]
    ExecutionError(String),
    
    #[error("Timeout")]
    Timeout,
    
    #[error("Service unavailable")]
    ServiceUnavailable,
}

// ================================================================================
// INSTRUCTIONS - Object-Oriented Assembly
// ================================================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Instruction {
    // Object method invocation
    Push { object: String, method: String, args: Data },
    Pop { object: String, target: String },
    Call { object: String, method: String, args: Data, target: String },
    
    // Object management
    Register { class_name: String, object_id: String },
    Instantiate { class_name: String, object_id: String },
    Destroy { object_id: String },
    
    // Inheritance & Composition
    Extend { parent_class: String, child_class: String },
    Compose { objects: Vec<String>, composite_id: String },
    Delegate { from_object: String, from_method: String, to_object: String, to_method: String },
    
    // Control flow
    Wait { object: String },
    Fork { args: Data, targets: Vec<(String, String)> }, // [(object, method)]
    Join { mode: JoinMode, target: String },
    
    // Error handling
    Try { instructions: Vec<Instruction> },
    Catch { error_type: String, handler: Vec<Instruction> },
    Retry { count: u32, backoff: BackoffStrategy, instructions: Vec<Instruction> },
    
    // Discovery & Introspection
    ListObjects { target: String },
    GetMethods { object: String, target: String },
    GetHealth { object: String, target: String },
    
    // Flow control
    If { condition: String, then_branch: Vec<Instruction>, else_branch: Option<Vec<Instruction>> },
    While { condition: String, body: Vec<Instruction> },
    
    // Data manipulation
    Set { variable: String, value: Data },
    Get { variable: String, target: String },
    
    // Debug
    Trace { message: String, value: Option<String> },
    
    // System
    Nop,
    Halt,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum JoinMode {
    All,
    Any,
    Race,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum BackoffStrategy {
    Constant { delay_ms: u64 },
    Linear { initial_ms: u64, increment_ms: u64 },
    Exponential { initial_ms: u64, factor: f64 },
}

// ================================================================================
// SPU RUNTIME - The Orchestrator
// ================================================================================

pub struct SPURuntime {
    /// Registry of coprocessor classes
    classes: Arc<RwLock<HashMap<String, Arc<dyn Coprocessor>>>>,
    
    /// Active object instances
    instances: Arc<RwLock<HashMap<String, Arc<dyn Coprocessor>>>>,
    
    /// Variables/memory
    memory: Arc<RwLock<HashMap<String, Data>>>,
    
    /// Execution stack
    stack: Arc<RwLock<Vec<Data>>>,
    
    /// Async task handles
    tasks: Arc<RwLock<HashMap<String, tokio::task::JoinHandle<Result<Data, CoprocessorError>>>>>,
    
    /// Program counter
    pc: Arc<RwLock<usize>>,
    
    /// Instructions
    program: Vec<Instruction>,
}

impl SPURuntime {
    pub fn new() -> Self {
        Self {
            classes: Arc::new(RwLock::new(HashMap::new())),
            instances: Arc::new(RwLock::new(HashMap::new())),
            memory: Arc::new(RwLock::new(HashMap::new())),
            stack: Arc::new(RwLock::new(Vec::new())),
            tasks: Arc::new(RwLock::new(HashMap::new())),
            pc: Arc::new(RwLock::new(0)),
            program: Vec::new(),
        }
    }

    /// Register a coprocessor class
    pub async fn register_class(&self, name: String, coprocessor: Arc<dyn Coprocessor>) {
        let mut classes = self.classes.write().await;
        classes.insert(name, coprocessor);
    }

    /// Execute a single instruction
    pub async fn execute_instruction(&self, instruction: &Instruction) -> Result<(), SPUError> {
        match instruction {
            Instruction::Call { object, method, args, target } => {
                let instances = self.instances.read().await;
                let coprocessor = instances.get(object)
                    .ok_or_else(|| SPUError::ObjectNotFound(object.clone()))?;
                
                let result = coprocessor.invoke(method, args.clone()).await
                    .map_err(|e| SPUError::CoprocessorError(e))?;
                
                let mut memory = self.memory.write().await;
                memory.insert(target.clone(), result);
            }
            
            Instruction::Push { object, method, args } => {
                let instances = self.instances.read().await;
                let coprocessor = instances.get(object)
                    .ok_or_else(|| SPUError::ObjectNotFound(object.clone()))?;
                
                let coprocessor = Arc::clone(coprocessor);
                let args = args.clone();
                let method_clone = method.clone();
                let task_key = format!("{}.{}", object, method);
                
                // Launch async task
                let handle = tokio::spawn(async move {
                    coprocessor.invoke(&method_clone, args).await
                });
                
                let mut tasks = self.tasks.write().await;
                tasks.insert(task_key, handle);
            }
            
            Instruction::Pop { object, target } => {
                let mut tasks = self.tasks.write().await;
                let task_key = object.clone(); // Assuming object is the task key
                
                if let Some(handle) = tasks.remove(&task_key) {
                    let result = handle.await
                        .map_err(|_| SPUError::TaskJoinError)?
                        .map_err(|e| SPUError::CoprocessorError(e))?;
                    
                    let mut memory = self.memory.write().await;
                    memory.insert(target.clone(), result);
                } else {
                    return Err(SPUError::TaskNotFound(task_key));
                }
            }
            
            Instruction::Register { class_name, object_id } => {
                let classes = self.classes.read().await;
                if let Some(coprocessor) = classes.get(class_name) {
                    let mut instances = self.instances.write().await;
                    instances.insert(object_id.clone(), Arc::clone(coprocessor));
                } else {
                    return Err(SPUError::ClassNotFound(class_name.clone()));
                }
            }
            
            Instruction::Instantiate { class_name, object_id } => {
                // For now, same as Register (in future, could create new instance)
                let classes = self.classes.read().await;
                if let Some(coprocessor) = classes.get(class_name) {
                    let mut instances = self.instances.write().await;
                    instances.insert(object_id.clone(), Arc::clone(coprocessor));
                } else {
                    return Err(SPUError::ClassNotFound(class_name.clone()));
                }
            }
            
            Instruction::Destroy { object_id } => {
                let mut instances = self.instances.write().await;
                instances.remove(object_id);
            }
            
            Instruction::Wait { object } => {
                let mut tasks = self.tasks.write().await;
                if let Some(handle) = tasks.remove(object) {
                    let result = handle.await
                        .map_err(|_| SPUError::TaskJoinError)?
                        .map_err(|e| SPUError::CoprocessorError(e))?;
                    
                    let mut stack = self.stack.write().await;
                    stack.push(result);
                }
            }
            
            Instruction::Set { variable, value } => {
                let mut memory = self.memory.write().await;
                memory.insert(variable.clone(), value.clone());
            }
            
            Instruction::Get { variable, target } => {
                let memory = self.memory.read().await;
                if let Some(value) = memory.get(variable) {
                    let mut memory = self.memory.write().await;
                    memory.insert(target.clone(), value.clone());
                } else {
                    return Err(SPUError::VariableNotFound(variable.clone()));
                }
            }
            
            Instruction::ListObjects { target } => {
                let instances = self.instances.read().await;
                let object_list: Vec<String> = instances.keys().cloned().collect();
                let data = Data::Array(object_list.into_iter().map(Data::String).collect());
                
                let mut memory = self.memory.write().await;
                memory.insert(target.clone(), data);
            }
            
            Instruction::GetMethods { object, target } => {
                let instances = self.instances.read().await;
                if let Some(coprocessor) = instances.get(object) {
                    let methods = coprocessor.methods();
                    let json_methods = serde_json::to_value(methods)
                        .map_err(|e| SPUError::SerializationError(e.to_string()))?;
                    
                    let mut memory = self.memory.write().await;
                    memory.insert(target.clone(), Data::from_json(json_methods));
                } else {
                    return Err(SPUError::ObjectNotFound(object.clone()));
                }
            }
            
            Instruction::GetHealth { object, target } => {
                let instances = self.instances.read().await;
                if let Some(coprocessor) = instances.get(object) {
                    let health = coprocessor.health().await;
                    
                    // Convert Health to a proper object structure
                    let health_obj = match health {
                        Health::Healthy => serde_json::json!({
                            "status": "healthy",
                            "message": "Operating normally"
                        }),
                        Health::Degraded { reason } => serde_json::json!({
                            "status": "degraded",
                            "message": reason
                        }),
                        Health::Unhealthy { error } => serde_json::json!({
                            "status": "unhealthy",
                            "message": error
                        }),
                        Health::Unknown => serde_json::json!({
                            "status": "unknown",
                            "message": "Health status unknown"
                        }),
                    };
                    
                    let mut memory = self.memory.write().await;
                    memory.insert(target.clone(), Data::from_json(health_obj));
                } else {
                    return Err(SPUError::ObjectNotFound(object.clone()));
                }
            }
            
            Instruction::Trace { message, value } => {
                if let Some(var) = value {
                    let memory = self.memory.read().await;
                    if let Some(val) = memory.get(var) {
                        println!("[TRACE] {}: {:?}", message, val);
                    } else {
                        println!("[TRACE] {} (variable '{}' not found)", message, var);
                    }
                } else {
                    println!("[TRACE] {}", message);
                }
            }
            
            Instruction::Nop => {
                // No operation
            }
            
            Instruction::Halt => {
                return Err(SPUError::Halted);
            }
            
            _ => {
                // TODO: Implement remaining instructions
                return Err(SPUError::NotImplemented(format!("{:?}", instruction)));
            }
        }
        
        Ok(())
    }

    /// Execute a program
    pub async fn execute_program(&mut self, program: Vec<Instruction>) -> Result<(), SPUError> {
        self.program = program;
        let mut pc = 0;
        
        while pc < self.program.len() {
            let instruction = self.program[pc].clone();
            self.execute_instruction(&instruction).await?;
            
            // Handle control flow (normally would modify pc based on instruction)
            pc += 1;
            
            // Update shared pc
            *self.pc.write().await = pc;
        }
        
        Ok(())
    }

    /// Get a variable value
    pub async fn get_variable(&self, name: &str) -> Option<Data> {
        let memory = self.memory.read().await;
        memory.get(name).cloned()
    }

    /// Set a variable value
    pub async fn set_variable(&self, name: String, value: Data) {
        let mut memory = self.memory.write().await;
        memory.insert(name, value);
    }
}

// ================================================================================
// ERRORS
// ================================================================================

#[derive(Debug, Error)]
pub enum SPUError {
    #[error("Object not found: {0}")]
    ObjectNotFound(String),
    
    #[error("Class not found: {0}")]
    ClassNotFound(String),
    
    #[error("Variable not found: {0}")]
    VariableNotFound(String),
    
    #[error("Task not found: {0}")]
    TaskNotFound(String),
    
    #[error("Coprocessor error: {0}")]
    CoprocessorError(#[from] CoprocessorError),
    
    #[error("Task join error")]
    TaskJoinError,
    
    #[error("Serialization error: {0}")]
    SerializationError(String),
    
    #[error("Not implemented: {0}")]
    NotImplemented(String),
    
    #[error("Halted")]
    Halted,
}

// ================================================================================
// MOCK COPROCESSORS FOR TESTING
// ================================================================================

pub mod mock {
    use super::*;

    /// Mock compression coprocessor
    pub struct CompressionCoprocessor;
    
    #[async_trait::async_trait]
    impl Coprocessor for CompressionCoprocessor {
        fn class_name(&self) -> String {
            "compression".to_string()
        }
        
        fn methods(&self) -> Vec<MethodSignature> {
            vec![
                MethodSignature {
                    name: "compress".to_string(),
                    description: "Compress text to Chinese characters".to_string(),
                    input_schema: Some(serde_json::json!({
                        "type": "object",
                        "properties": {
                            "text": { "type": "string" },
                            "precision": { "type": "number" }
                        }
                    })),
                    output_schema: Some(serde_json::json!({
                        "type": "object",
                        "properties": {
                            "compressed": { "type": "string" },
                            "original_length": { "type": "number" }
                        }
                    })),
                },
            ]
        }
        
        async fn invoke(&self, method: &str, args: Data) -> Result<Data, CoprocessorError> {
            match method {
                "compress" => {
                    // Mock compression
                    if let Data::Object(mut obj) = args {
                        if let Some(Data::String(text)) = obj.get("text") {
                            let compressed = format!("压{}缩", text.len());
                            let mut result = HashMap::new();
                            result.insert("compressed".to_string(), Data::String(compressed));
                            result.insert("original_length".to_string(), Data::Number(text.len() as f64));
                            return Ok(Data::Object(result));
                        }
                    }
                    Err(CoprocessorError::InvalidArguments("Expected {text: string}".to_string()))
                }
                _ => Err(CoprocessorError::MethodNotFound(method.to_string()))
            }
        }
    }

    /// Mock email coprocessor
    pub struct EmailCoprocessor;
    
    #[async_trait::async_trait]
    impl Coprocessor for EmailCoprocessor {
        fn class_name(&self) -> String {
            "email".to_string()
        }
        
        fn methods(&self) -> Vec<MethodSignature> {
            vec![
                MethodSignature {
                    name: "parse".to_string(),
                    description: "Parse raw email".to_string(),
                    input_schema: Some(serde_json::json!({ "raw": "string" })),
                    output_schema: Some(serde_json::json!({
                        "from": "string",
                        "to": "string",
                        "subject": "string",
                        "body": "string"
                    })),
                },
                MethodSignature {
                    name: "send".to_string(),
                    description: "Send email".to_string(),
                    input_schema: Some(serde_json::json!({
                        "to": "string",
                        "subject": "string",
                        "body": "string"
                    })),
                    output_schema: Some(serde_json::json!({ "sent": "boolean" })),
                },
            ]
        }
        
        async fn invoke(&self, method: &str, args: Data) -> Result<Data, CoprocessorError> {
            match method {
                "parse" => {
                    // Mock email parsing
                    let mut result = HashMap::new();
                    result.insert("from".to_string(), Data::String("test@example.com".to_string()));
                    result.insert("to".to_string(), Data::String("user@example.com".to_string()));
                    result.insert("subject".to_string(), Data::String("Test Email".to_string()));
                    result.insert("body".to_string(), Data::String("This is a test".to_string()));
                    Ok(Data::Object(result))
                }
                "send" => {
                    // Mock sending
                    let mut result = HashMap::new();
                    result.insert("sent".to_string(), Data::Bool(true));
                    result.insert("id".to_string(), Data::String(Uuid::new_v4().to_string()));
                    Ok(Data::Object(result))
                }
                _ => Err(CoprocessorError::MethodNotFound(method.to_string()))
            }
        }
    }

    /// Mock database coprocessor
    pub struct DatabaseCoprocessor {
        storage: Arc<RwLock<HashMap<String, Data>>>,
    }
    
    impl DatabaseCoprocessor {
        pub fn new() -> Self {
            Self {
                storage: Arc::new(RwLock::new(HashMap::new())),
            }
        }
    }
    
    #[async_trait::async_trait]
    impl Coprocessor for DatabaseCoprocessor {
        fn class_name(&self) -> String {
            "database".to_string()
        }
        
        fn methods(&self) -> Vec<MethodSignature> {
            vec![
                MethodSignature {
                    name: "store".to_string(),
                    description: "Store data".to_string(),
                    input_schema: Some(serde_json::json!({ "data": "any" })),
                    output_schema: Some(serde_json::json!({ "id": "string" })),
                },
                MethodSignature {
                    name: "retrieve".to_string(),
                    description: "Retrieve data".to_string(),
                    input_schema: Some(serde_json::json!({ "id": "string" })),
                    output_schema: Some(serde_json::json!({ "data": "any" })),
                },
            ]
        }
        
        async fn invoke(&self, method: &str, args: Data) -> Result<Data, CoprocessorError> {
            match method {
                "store" => {
                    let id = Uuid::new_v4().to_string();
                    let mut storage = self.storage.write().await;
                    storage.insert(id.clone(), args);
                    
                    let mut result = HashMap::new();
                    result.insert("id".to_string(), Data::String(id));
                    Ok(Data::Object(result))
                }
                "retrieve" => {
                    if let Data::Object(obj) = args {
                        if let Some(Data::String(id)) = obj.get("id") {
                            let storage = self.storage.read().await;
                            if let Some(data) = storage.get(id) {
                                let mut result = HashMap::new();
                                result.insert("data".to_string(), data.clone());
                                return Ok(Data::Object(result));
                            }
                        }
                    }
                    Err(CoprocessorError::InvalidArguments("Expected {id: string}".to_string()))
                }
                _ => Err(CoprocessorError::MethodNotFound(method.to_string()))
            }
        }
    }

    /// Mock AI coprocessor
    pub struct AICoprocessor;
    
    #[async_trait::async_trait]
    impl Coprocessor for AICoprocessor {
        fn class_name(&self) -> String {
            "ai".to_string()
        }
        
        fn methods(&self) -> Vec<MethodSignature> {
            vec![
                MethodSignature {
                    name: "classify".to_string(),
                    description: "Classify text urgency".to_string(),
                    input_schema: Some(serde_json::json!({ "text": "string" })),
                    output_schema: Some(serde_json::json!({ 
                        "urgency": "string",
                        "confidence": "number"
                    })),
                },
                MethodSignature {
                    name: "summarize".to_string(),
                    description: "Summarize text".to_string(),
                    input_schema: Some(serde_json::json!({ "text": "string" })),
                    output_schema: Some(serde_json::json!({ "summary": "string" })),
                },
            ]
        }
        
        async fn invoke(&self, method: &str, args: Data) -> Result<Data, CoprocessorError> {
            match method {
                "classify" => {
                    // Mock classification
                    let mut result = HashMap::new();
                    result.insert("urgency".to_string(), Data::String("medium".to_string()));
                    result.insert("confidence".to_string(), Data::Number(0.85));
                    Ok(Data::Object(result))
                }
                "summarize" => {
                    // Mock summarization
                    let mut result = HashMap::new();
                    result.insert("summary".to_string(), Data::String("This is a summary".to_string()));
                    Ok(Data::Object(result))
                }
                _ => Err(CoprocessorError::MethodNotFound(method.to_string()))
            }
        }
    }
}

// ================================================================================
// TESTS
// ================================================================================

#[cfg(test)]
mod tests {
    use super::*;
    use super::mock::*;
    use std::sync::Arc;

    #[tokio::test]
    async fn test_spu_creation() {
        let spu = SPURuntime::new();
        assert!(spu.get_variable("test").await.is_none());
    }

    #[tokio::test]
    async fn test_register_and_call() {
        let spu = SPURuntime::new();
        
        // Register compression coprocessor
        spu.register_class("compression".to_string(), Arc::new(CompressionCoprocessor)).await;
        
        // Instantiate it
        spu.execute_instruction(&Instruction::Instantiate {
            class_name: "compression".to_string(),
            object_id: "comp1".to_string(),
        }).await.unwrap();
        
        // Call compress method
        let mut args = HashMap::new();
        args.insert("text".to_string(), Data::String("Hello World".to_string()));
        args.insert("precision".to_string(), Data::Number(0.5));
        
        spu.execute_instruction(&Instruction::Call {
            object: "comp1".to_string(),
            method: "compress".to_string(),
            args: Data::Object(args),
            target: "result".to_string(),
        }).await.unwrap();
        
        // Check result
        let result = spu.get_variable("result").await.unwrap();
        if let Data::Object(obj) = result {
            assert!(obj.contains_key("compressed"));
            assert!(obj.contains_key("original_length"));
        } else {
            panic!("Expected object result");
        }
    }

    #[tokio::test]
    async fn test_email_processing_pipeline() {
        let mut spu = SPURuntime::new();
        
        // Register all coprocessors
        spu.register_class("email".to_string(), Arc::new(EmailCoprocessor)).await;
        spu.register_class("compression".to_string(), Arc::new(CompressionCoprocessor)).await;
        spu.register_class("ai".to_string(), Arc::new(AICoprocessor)).await;
        spu.register_class("database".to_string(), Arc::new(DatabaseCoprocessor::new())).await;
        
        // Build a program that processes email
        let program = vec![
            // Instantiate objects
            Instruction::Instantiate { class_name: "email".to_string(), object_id: "email".to_string() },
            Instruction::Instantiate { class_name: "compression".to_string(), object_id: "compressor".to_string() },
            Instruction::Instantiate { class_name: "ai".to_string(), object_id: "ai".to_string() },
            Instruction::Instantiate { class_name: "database".to_string(), object_id: "db".to_string() },
            
            // Parse email
            Instruction::Call {
                object: "email".to_string(),
                method: "parse".to_string(),
                args: Data::Object(HashMap::from([
                    ("raw".to_string(), Data::String("From: test@example.com...".to_string()))
                ])),
                target: "parsed_email".to_string(),
            },
            
            // Classify urgency
            Instruction::Call {
                object: "ai".to_string(),
                method: "classify".to_string(),
                args: Data::Object(HashMap::from([
                    ("text".to_string(), Data::String("Test email body".to_string()))
                ])),
                target: "urgency".to_string(),
            },
            
            // Compress
            Instruction::Call {
                object: "compressor".to_string(),
                method: "compress".to_string(),
                args: Data::Object(HashMap::from([
                    ("text".to_string(), Data::String("Test email body".to_string())),
                    ("precision".to_string(), Data::Number(0.8)),
                ])),
                target: "compressed".to_string(),
            },
            
            // Store in database
            Instruction::Call {
                object: "db".to_string(),
                method: "store".to_string(),
                args: Data::Object(HashMap::from([
                    ("data".to_string(), Data::String("email_data".to_string()))
                ])),
                target: "stored_id".to_string(),
            },
            
            // Trace results
            Instruction::Trace { message: "Email processed".to_string(), value: Some("stored_id".to_string()) },
        ];
        
        // Execute the program
        spu.execute_program(program).await.unwrap();
        
        // Verify results
        assert!(spu.get_variable("parsed_email").await.is_some());
        assert!(spu.get_variable("urgency").await.is_some());
        assert!(spu.get_variable("compressed").await.is_some());
        assert!(spu.get_variable("stored_id").await.is_some());
    }

    #[tokio::test]
    async fn test_introspection() {
        let spu = SPURuntime::new();
        
        // Register and instantiate
        spu.register_class("ai".to_string(), Arc::new(AICoprocessor)).await;
        spu.execute_instruction(&Instruction::Instantiate {
            class_name: "ai".to_string(),
            object_id: "ai1".to_string(),
        }).await.unwrap();
        
        // Get methods
        spu.execute_instruction(&Instruction::GetMethods {
            object: "ai1".to_string(),
            target: "methods".to_string(),
        }).await.unwrap();
        
        // Check methods
        let methods = spu.get_variable("methods").await.unwrap();
        if let Data::Array(arr) = Data::from_json(methods.to_json()) {
            assert!(arr.len() > 0);
        }
        
        // Get health
        spu.execute_instruction(&Instruction::GetHealth {
            object: "ai1".to_string(),
            target: "health".to_string(),
        }).await.unwrap();
        
        assert!(spu.get_variable("health").await.is_some());
    }

    #[tokio::test]
    async fn test_async_operations() {
        let spu = SPURuntime::new();
        
        // Register email service
        spu.register_class("email".to_string(), Arc::new(EmailCoprocessor)).await;
        spu.execute_instruction(&Instruction::Instantiate {
            class_name: "email".to_string(),
            object_id: "email".to_string(),
        }).await.unwrap();
        
        // Push async operation
        spu.execute_instruction(&Instruction::Push {
            object: "email".to_string(),
            method: "send".to_string(),
            args: Data::Object(HashMap::from([
                ("to".to_string(), Data::String("test@example.com".to_string())),
                ("subject".to_string(), Data::String("Test".to_string())),
                ("body".to_string(), Data::String("Hello".to_string())),
            ])),
        }).await.unwrap();
        
        // Wait and pop result
        spu.execute_instruction(&Instruction::Wait {
            object: "email.send".to_string(),
        }).await.unwrap();
        
        // Stack should have result
        let stack = spu.stack.read().await;
        assert!(!stack.is_empty());
    }
}