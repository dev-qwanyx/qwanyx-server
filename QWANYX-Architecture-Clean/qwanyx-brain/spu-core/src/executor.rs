//! Exécuteur de programmes assembleur SPU
//! Version simple pour MVP

use std::collections::HashMap;
use crate::data_types::{SPUData, Register};
use mongodb::{Client as MongoClient, options::ClientOptions};
use bson::{doc, Document};
use tokio::runtime::Runtime;

/// Instructions SPU de base
#[derive(Debug, Clone)]
pub enum SPUInstruction {
    /// LOAD $REG, source - Charge des données dans un registre
    Load { register: String, source: String },
    
    /// MEMORIZE $REG, collection - Sauvegarde dans MongoDB
    Memorize { register: String, collection: String },
    
    /// RETRIEVE $REG, id, collection - Récupère depuis MongoDB
    Retrieve { register: String, id: String, collection: String },
    
    /// COMPRESS $OUT, $IN, precision - Compresse des données
    Compress { output: String, input: String, precision: f32 },
    
    /// RETURN $REG - Retourne le contenu d'un registre
    Return { register: String },
    
    /// MOVE $DEST, $SRC - Copie un registre
    Move { dest: String, source: String },
}

/// Exécuteur de programme SPU
pub struct SPUExecutor {
    /// Registres disponibles
    registers: HashMap<String, Register>,
    
    /// Client AI pour compression
    ai_client: crate::AIClient,
    
    /// MongoDB client
    mongo_client: Option<MongoClient>,
    
    /// Workspace actuel
    workspace: String,
    
    /// Runtime Tokio pour les opérations async
    runtime: Runtime,
}

impl SPUExecutor {
    pub fn new() -> Self {
        let runtime = Runtime::new().expect("Failed to create Tokio runtime");
        let mongo_uri = std::env::var("MONGO_URI")
            .unwrap_or_else(|_| "mongodb://localhost:27017".to_string());
        
        // Connexion MongoDB dans le runtime
        let mongo_client = runtime.block_on(async {
            match ClientOptions::parse(&mongo_uri).await {
                Ok(options) => {
                    match MongoClient::with_options(options) {
                        Ok(client) => {
                            println!("[SPU] Connected to MongoDB");
                            Some(client)
                        },
                        Err(e) => {
                            println!("[SPU] MongoDB connection failed: {:?}", e);
                            None
                        }
                    }
                },
                Err(e) => {
                    println!("[SPU] MongoDB URI parse failed: {:?}", e);
                    None
                }
            }
        });
        
        Self {
            registers: HashMap::new(),
            ai_client: crate::AIClient::new(),
            mongo_client,
            workspace: std::env::var("WORKSPACE").unwrap_or_else(|_| "autodin".to_string()),
            runtime,
        }
    }
    
    /// Parse une ligne d'assembleur SPU
    pub fn parse_instruction(line: &str) -> Option<SPUInstruction> {
        let parts: Vec<&str> = line.split_whitespace().collect();
        if parts.is_empty() {
            return None;
        }
        
        match parts[0] {
            "LOAD" => {
                if parts.len() >= 3 {
                    Some(SPUInstruction::Load {
                        register: parts[1].trim_end_matches(',').to_string(),
                        source: parts[2..].join(" "),
                    })
                } else {
                    None
                }
            },
            "MEMORIZE" => {
                if parts.len() >= 3 {
                    Some(SPUInstruction::Memorize {
                        register: parts[1].trim_end_matches(',').to_string(),
                        collection: parts[2].trim_end_matches(',').to_string(),
                    })
                } else {
                    None
                }
            },
            "RETRIEVE" => {
                if parts.len() >= 4 {
                    Some(SPUInstruction::Retrieve {
                        register: parts[1].trim_end_matches(',').to_string(),
                        id: parts[2].trim_end_matches(',').to_string(),
                        collection: parts[3].trim_end_matches(',').to_string(),
                    })
                } else {
                    None
                }
            },
            "COMPRESS" => {
                if parts.len() >= 3 {
                    let precision = if parts.len() >= 4 {
                        parts[3].trim_end_matches(',').parse().unwrap_or(0.5)
                    } else {
                        0.5
                    };
                    Some(SPUInstruction::Compress {
                        output: parts[1].trim_end_matches(',').to_string(),
                        input: parts[2].trim_end_matches(',').to_string(),
                        precision,
                    })
                } else {
                    None
                }
            },
            "RETURN" => {
                if parts.len() >= 2 {
                    Some(SPUInstruction::Return {
                        register: parts[1].trim_end_matches(',').to_string(),
                    })
                } else {
                    None
                }
            },
            "MOVE" => {
                if parts.len() >= 3 {
                    Some(SPUInstruction::Move {
                        dest: parts[1].trim_end_matches(',').to_string(),
                        source: parts[2].trim_end_matches(',').to_string(),
                    })
                } else {
                    None
                }
            },
            _ => None,
        }
    }
    
    /// Exécute une instruction
    pub fn execute_instruction(&mut self, instruction: &SPUInstruction) -> Result<Option<SPUData>, Box<dyn std::error::Error>> {
        match instruction {
            SPUInstruction::Load { register, source } => {
                // Pour l'instant, on charge depuis "input"
                if source == "input" {
                    // L'input doit avoir été mis dans $INPUT avant
                    if let Some(input_reg) = self.registers.get("$INPUT") {
                        self.registers.insert(register.clone(), input_reg.clone());
                    }
                } else {
                    // Sinon c'est du texte littéral
                    self.registers.insert(
                        register.clone(),
                        Register::with_data(register, SPUData::Text(source.clone()))
                    );
                }
                Ok(None)
            },
            
            SPUInstruction::Memorize { register, collection } => {
                let data = self.registers.get(register)
                    .ok_or(format!("Register {} not found", register))?;
                
                // Vraie sauvegarde MongoDB
                if let Some(client) = &self.mongo_client {
                    let db = client.database(&self.workspace);
                    let coll = db.collection::<Document>(collection);
                    
                    // Convertir les données en document BSON
                    let mut document = data.data.to_document()?;
                    document.insert("created_at", chrono::Utc::now().to_rfc3339());
                    document.insert("updated_at", chrono::Utc::now().to_rfc3339());
                    
                    // Sauvegarder dans MongoDB
                    let result = self.runtime.block_on(async {
                        coll.insert_one(document, None).await
                    });
                    
                    match result {
                        Ok(insert_result) => {
                            let id = insert_result.inserted_id.to_string();
                            
                            // Mettre l'ID dans le registre
                            self.registers.insert(
                                register.clone(),
                                Register::with_data(register, SPUData::ObjectId(id.clone()))
                            );
                            
                            println!("[SPU] MEMORIZE: Saved to {}/{} with ID {}", 
                                self.workspace, collection, id);
                        },
                        Err(e) => {
                            return Err(format!("MongoDB save failed: {:?}", e).into());
                        }
                    }
                } else {
                    // Fallback si pas de MongoDB
                    let id = format!("{}_{}", collection, chrono::Utc::now().timestamp());
                    self.registers.insert(
                        register.clone(),
                        Register::with_data(register, SPUData::ObjectId(id.clone()))
                    );
                    println!("[SPU] MEMORIZE: Simulated save (no MongoDB) with ID {}", id);
                }
                
                Ok(None)
            },
            
            SPUInstruction::Retrieve { register, id, collection } => {
                // Vraie récupération MongoDB
                if let Some(client) = &self.mongo_client {
                    let db = client.database(&self.workspace);
                    let coll = db.collection::<Document>(collection);
                    
                    // Convertir l'ID en ObjectId si possible
                    let filter = if id.len() == 24 && id.chars().all(|c| c.is_ascii_hexdigit()) {
                        doc! { "_id": bson::oid::ObjectId::parse_str(id).unwrap() }
                    } else {
                        doc! { "_id": id }
                    };
                    
                    // Récupérer depuis MongoDB
                    let result = self.runtime.block_on(async {
                        coll.find_one(filter, None).await
                    });
                    
                    match result {
                        Ok(Some(document)) => {
                            let data = SPUData::Document(document);
                            self.registers.insert(
                                register.clone(),
                                Register::with_data(register, data)
                            );
                            println!("[SPU] RETRIEVE: Loaded {} from {}/{}", 
                                id, self.workspace, collection);
                        },
                        Ok(None) => {
                            // Document non trouvé
                            self.registers.insert(
                                register.clone(),
                                Register::with_data(register, SPUData::Empty)
                            );
                            println!("[SPU] RETRIEVE: Document {} not found in {}/{}", 
                                id, self.workspace, collection);
                        },
                        Err(e) => {
                            return Err(format!("MongoDB retrieve failed: {:?}", e).into());
                        }
                    }
                } else {
                    // Fallback si pas de MongoDB
                    println!("[SPU] RETRIEVE: Simulated load (no MongoDB) {} from {}", id, collection);
                    
                    let data = SPUData::Json(serde_json::json!({
                        "_id": id,
                        "collection": collection,
                        "data": "Simulated document",
                        "timestamp": chrono::Utc::now().to_rfc3339()
                    }));
                    
                    self.registers.insert(
                        register.clone(),
                        Register::with_data(register, data)
                    );
                }
                
                Ok(None)
            },
            
            SPUInstruction::Compress { output, input, precision } => {
                let input_reg = self.registers.get(input)
                    .ok_or(format!("Register {} not found", input))?;
                
                // Obtenir le texte à compresser
                let text = input_reg.data.as_text()
                    .ok_or("Cannot compress non-text data")?;
                
                // Compresser avec l'API
                let compressed = self.ai_client.compress(&text, "mlm")
                    .unwrap_or_else(|e| format!("Compression error: {:?}", e));
                
                self.registers.insert(
                    output.clone(),
                    Register::with_data(output, SPUData::Text(compressed))
                );
                
                println!("[SPU] COMPRESS: {} chars -> {} chars", text.len(), 
                    self.registers.get(output).unwrap().data.as_text().unwrap().len());
                Ok(None)
            },
            
            SPUInstruction::Return { register } => {
                let reg = self.registers.get(register)
                    .ok_or(format!("Register {} not found", register))?;
                Ok(Some(reg.data.clone()))
            },
            
            SPUInstruction::Move { dest, source } => {
                let src_reg = self.registers.get(source)
                    .ok_or(format!("Register {} not found", source))?
                    .clone();
                
                self.registers.insert(
                    dest.clone(),
                    Register::with_data(dest, src_reg.data)
                );
                Ok(None)
            },
        }
    }
    
    /// Exécute un programme complet
    pub fn execute_program(&mut self, program: &str, input: SPUData) -> Result<SPUData, Box<dyn std::error::Error>> {
        // Mettre l'input dans le registre $INPUT
        self.registers.insert(
            "$INPUT".to_string(),
            Register::with_data("$INPUT", input)
        );
        
        // Parser et exécuter chaque ligne
        for line in program.lines() {
            let line = line.trim();
            
            // Ignorer les lignes vides et commentaires
            if line.is_empty() || line.starts_with(';') {
                continue;
            }
            
            // Parser l'instruction
            if let Some(instruction) = Self::parse_instruction(line) {
                println!("[SPU] Executing: {:?}", instruction);
                
                // Exécuter
                if let Some(result) = self.execute_instruction(&instruction)? {
                    // Si l'instruction retourne quelque chose (RETURN), on arrête
                    return Ok(result);
                }
            }
        }
        
        // Si aucun RETURN, retourner Empty
        Ok(SPUData::Empty)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_simple_program() {
        let mut executor = SPUExecutor::new();
        
        let program = r#"
            LOAD $DATA, input
            MEMORIZE $DATA, test_collection
            RETURN $DATA
        "#;
        
        let input = SPUData::Json(serde_json::json!({
            "user": "test@example.com",
            "data": "test data"
        }));
        
        let result = executor.execute_program(program, input).unwrap();
        
        match result {
            SPUData::ObjectId(id) => {
                // L'ID peut être un ObjectId MongoDB ou un ID simulé
                assert!(!id.is_empty());
            },
            _ => panic!("Expected ObjectId"),
        }
    }
}