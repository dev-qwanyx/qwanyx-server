//! Database Coprocessor
//! 
//! Handles MongoDB operations
//! Pure data storage and retrieval, no business logic

use crate::{Coprocessor, CoprocessorError, Data, Health, MethodSignature};
use async_trait::async_trait;
use mongodb::{Client as MongoClient, Collection, bson::{doc, Document, Bson}};
use mongodb::bson::oid::ObjectId;
use std::collections::HashMap;
use std::sync::Arc;
use tracing::{error, info};

/// Database Coprocessor
pub struct DatabaseCoprocessor {
    client: Option<Arc<MongoClient>>,
    database_name: String,
}

impl DatabaseCoprocessor {
    pub fn new() -> Self {
        // Try to connect to MongoDB
        let mongo_uri = std::env::var("MONGO_URI")
            .unwrap_or_else(|_| "mongodb://localhost:27017/?serverSelectionTimeoutMS=5000".to_string());
        
        // Default database name - will be overridden by workspace when needed
        let database_name = std::env::var("DB_NAME")
            .unwrap_or_else(|_| "autodin".to_string());
        
        // We'll connect lazily or in an async init method
        Self {
            client: None,
            database_name,
        }
    }
    
    pub async fn connect(&mut self) -> Result<(), String> {
        let mongo_uri = std::env::var("MONGO_URI")
            .unwrap_or_else(|_| "mongodb://localhost:27017/?serverSelectionTimeoutMS=5000".to_string());
        
        match MongoClient::with_uri_str(&mongo_uri).await {
            Ok(client) => {
                info!("Connected to MongoDB");
                self.client = Some(Arc::new(client));
                Ok(())
            }
            Err(e) => {
                error!("Failed to connect to MongoDB: {}", e);
                Err(format!("MongoDB connection failed: {}", e))
            }
        }
    }
    
    fn get_collection(&self, collection_name: &str) -> Result<Collection<Document>, String> {
        match &self.client {
            Some(client) => {
                Ok(client.database(&self.database_name).collection(collection_name))
            }
            None => Err("Not connected to database".to_string())
        }
    }
}

impl Default for DatabaseCoprocessor {
    fn default() -> Self {
        Self::new()
    }
}

#[async_trait]
impl Coprocessor for DatabaseCoprocessor {
    fn class_name(&self) -> String {
        "database".to_string()
    }

    fn methods(&self) -> Vec<MethodSignature> {
        vec![
            MethodSignature {
                name: "store".to_string(),
                description: "Store data in MongoDB".to_string(),
                input_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "collection": { 
                            "type": "string",
                            "description": "Collection name"
                        },
                        "data": {
                            "type": "object",
                            "description": "Data to store"
                        }
                    },
                    "required": ["collection", "data"]
                })),
                output_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "id": { 
                            "type": "string",
                            "description": "ID of stored document"
                        },
                        "success": {
                            "type": "boolean"
                        }
                    }
                })),
            },
            MethodSignature {
                name: "retrieve".to_string(),
                description: "Retrieve data from MongoDB".to_string(),
                input_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "collection": { "type": "string" },
                        "filter": {
                            "type": "object",
                            "description": "MongoDB filter query"
                        }
                    },
                    "required": ["collection", "filter"]
                })),
                output_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "data": {
                            "type": ["object", "null"],
                            "description": "Retrieved document"
                        },
                        "found": {
                            "type": "boolean"
                        }
                    }
                })),
            },
            MethodSignature {
                name: "update".to_string(),
                description: "Update data in MongoDB".to_string(),
                input_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "collection": { "type": "string" },
                        "filter": { "type": "object" },
                        "update": { "type": "object" }
                    },
                    "required": ["collection", "filter", "update"]
                })),
                output_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "matched": { "type": "number" },
                        "modified": { "type": "number" }
                    }
                })),
            },
            MethodSignature {
                name: "delete".to_string(),
                description: "Delete data from MongoDB".to_string(),
                input_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "collection": { "type": "string" },
                        "filter": { "type": "object" }
                    },
                    "required": ["collection", "filter"]
                })),
                output_schema: Some(serde_json::json!({
                    "type": "object",
                    "properties": {
                        "deleted": { "type": "number" }
                    }
                })),
            },
        ]
    }

    async fn invoke(&self, method: &str, args: Data) -> Result<Data, CoprocessorError> {
        match method {
            "store" => self.store_data(args).await,
            "retrieve" => self.retrieve_data(args).await,
            "update" => self.update_data(args).await,
            "delete" => self.delete_data(args).await,
            _ => Err(CoprocessorError::MethodNotFound(method.to_string())),
        }
    }

    async fn health(&self) -> Health {
        match &self.client {
            Some(_) => Health::Healthy,
            None => Health::Unhealthy {
                error: "Not connected to MongoDB".to_string(),
            },
        }
    }
}

impl DatabaseCoprocessor {
    async fn store_data(&self, args: Data) -> Result<Data, CoprocessorError> {
        let (collection_name, data, workspace) = match args {
            Data::Object(ref obj) => {
                let collection = match obj.get("collection") {
                    Some(Data::String(s)) => s.clone(),
                    _ => {
                        return Err(CoprocessorError::InvalidArguments(
                            "Missing or invalid 'collection' field".to_string(),
                        ))
                    }
                };
                
                let data = match obj.get("data") {
                    Some(Data::Object(d)) => d.clone(),
                    _ => {
                        return Err(CoprocessorError::InvalidArguments(
                            "Missing or invalid 'data' field".to_string(),
                        ))
                    }
                };
                
                // Get workspace from arguments, default to database name if not provided
                let workspace = match obj.get("workspace") {
                    Some(Data::String(s)) => s.clone(),
                    _ => self.database_name.clone()
                };
                
                (collection, data, workspace)
            }
            _ => {
                return Err(CoprocessorError::InvalidArguments(
                    "Expected object with 'collection' and 'data' fields".to_string(),
                ))
            }
        };
        
        info!("Storing to workspace '{}', collection '{}': {:?}", workspace, collection_name, data);
        
        // Get the MongoDB client
        let client = match &self.client {
            Some(c) => c,
            None => {
                return Err(CoprocessorError::ServiceUnavailable)
            }
        };
        
        // Use the workspace as the database name
        let db = client.database(&workspace);
        let collection: Collection<Document> = db.collection(&collection_name);
        
        // Convert Data to BSON Document
        let document = match self.data_to_document(&data) {
            Ok(doc) => doc,
            Err(e) => {
                return Err(CoprocessorError::InvalidArguments(
                    format!("Failed to convert data to BSON: {}", e)
                ))
            }
        };
        
        // Insert the document
        match collection.insert_one(document, None).await {
            Ok(result) => {
                let id = match result.inserted_id {
                    Bson::ObjectId(oid) => oid.to_hex(),
                    _ => "unknown".to_string(),
                };
                
                info!("Successfully stored document with ID: {}", id);
                
                let mut response = HashMap::new();
                response.insert("id".to_string(), Data::String(id));
                response.insert("success".to_string(), Data::Bool(true));
                
                Ok(Data::Object(response))
            }
            Err(e) => {
                error!("Failed to store document: {}", e);
                Err(CoprocessorError::ExecutionError(
                    format!("Failed to store document: {}", e)
                ))
            }
        }
    }
    
    async fn retrieve_data(&self, args: Data) -> Result<Data, CoprocessorError> {
        let (collection_name, filter, workspace) = match args {
            Data::Object(ref obj) => {
                let collection = match obj.get("collection") {
                    Some(Data::String(s)) => s.clone(),
                    _ => {
                        return Err(CoprocessorError::InvalidArguments(
                            "Missing or invalid 'collection' field".to_string(),
                        ))
                    }
                };
                
                let filter = match obj.get("filter") {
                    Some(Data::Object(f)) => f.clone(),
                    _ => {
                        return Err(CoprocessorError::InvalidArguments(
                            "Missing or invalid 'filter' field".to_string(),
                        ))
                    }
                };
                
                // Get workspace from arguments, default to database name if not provided
                let workspace = match obj.get("workspace") {
                    Some(Data::String(s)) => s.clone(),
                    _ => self.database_name.clone()
                };
                
                (collection, filter, workspace)
            }
            _ => {
                return Err(CoprocessorError::InvalidArguments(
                    "Expected object with 'collection' and 'filter' fields".to_string(),
                ))
            }
        };
        
        info!("Retrieving from workspace '{}', collection '{}' with filter: {:?}", workspace, collection_name, filter);
        
        // Get the MongoDB client
        let client = match &self.client {
            Some(c) => c.clone(),
            None => {
                return Err(CoprocessorError::ExecutionError(
                    "Database not connected".to_string()
                ))
            }
        };
        
        // Use the workspace as the database name - this is how the workspace system works!
        let db = client.database(&workspace);
        let collection: Collection<Document> = db.collection(&collection_name);
        
        // Convert filter to BSON
        use mongodb::bson::doc;
        let bson_filter = doc! {}; // For now, empty filter to get all documents
        
        // Query the collection
        use futures::stream::TryStreamExt;
        let cursor = match collection.find(bson_filter, None).await {
            Ok(c) => c,
            Err(e) => {
                error!("Failed to query collection: {}", e);
                return Err(CoprocessorError::ExecutionError(format!("Query failed: {}", e)))
            }
        };
        
        // Collect results
        let results: Vec<Document> = match cursor.try_collect().await {
            Ok(docs) => docs,
            Err(e) => {
                error!("Failed to collect results: {}", e);
                return Err(CoprocessorError::ExecutionError(format!("Failed to collect results: {}", e)))
            }
        };
        
        // Convert documents to Data::Array
        let data_array: Vec<Data> = results.iter().map(|doc| {
            // Convert BSON Document to Data::Object
            let mut obj = HashMap::new();
            for (key, value) in doc.iter() {
                // Convert BSON value to Data
                let data_value = match value {
                    mongodb::bson::Bson::String(s) => Data::String(s.clone()),
                    mongodb::bson::Bson::Int32(i) => Data::Number(*i as f64),
                    mongodb::bson::Bson::Int64(i) => Data::Number(*i as f64),
                    mongodb::bson::Bson::Double(d) => Data::Number(*d),
                    mongodb::bson::Bson::Boolean(b) => Data::Bool(*b),
                    mongodb::bson::Bson::ObjectId(oid) => Data::String(oid.to_hex()),
                    mongodb::bson::Bson::DateTime(dt) => Data::String(dt.to_string()),
                    mongodb::bson::Bson::Null => Data::Null,
                    mongodb::bson::Bson::Array(arr) => {
                        // Skip complex arrays for now, just count them
                        Data::Number(arr.len() as f64)
                    },
                    mongodb::bson::Bson::Document(_) => {
                        // Skip nested documents for now
                        Data::Null
                    },
                    _ => Data::Null,
                };
                obj.insert(key.clone(), data_value);
            }
            Data::Object(obj)
        }).collect();
        
        info!("Retrieved {} documents from collection '{}'", data_array.len(), collection_name);
        
        // Return the results
        let mut response = HashMap::new();
        response.insert("data".to_string(), Data::Array(data_array.clone()));
        response.insert("found".to_string(), Data::Bool(!data_array.is_empty()));
        response.insert("count".to_string(), Data::Number(data_array.len() as f64));
        
        Ok(Data::Object(response))
    }
    
    async fn update_data(&self, args: Data) -> Result<Data, CoprocessorError> {
        let (_collection_name, _filter, _update) = match args {
            Data::Object(ref obj) => {
                let collection = match obj.get("collection") {
                    Some(Data::String(s)) => s.clone(),
                    _ => {
                        return Err(CoprocessorError::InvalidArguments(
                            "Missing or invalid 'collection' field".to_string(),
                        ))
                    }
                };
                
                let filter = match obj.get("filter") {
                    Some(Data::Object(f)) => f.clone(),
                    _ => {
                        return Err(CoprocessorError::InvalidArguments(
                            "Missing or invalid 'filter' field".to_string(),
                        ))
                    }
                };
                
                let update = match obj.get("update") {
                    Some(Data::Object(u)) => u.clone(),
                    _ => {
                        return Err(CoprocessorError::InvalidArguments(
                            "Missing or invalid 'update' field".to_string(),
                        ))
                    }
                };
                
                (collection, filter, update)
            }
            _ => {
                return Err(CoprocessorError::InvalidArguments(
                    "Expected object with 'collection', 'filter', and 'update' fields".to_string(),
                ))
            }
        };
        
        // Mock response
        let mut response = HashMap::new();
        response.insert("matched".to_string(), Data::Number(0.0));
        response.insert("modified".to_string(), Data::Number(0.0));
        
        Ok(Data::Object(response))
    }
    
    async fn delete_data(&self, args: Data) -> Result<Data, CoprocessorError> {
        let (_collection_name, _filter) = match args {
            Data::Object(ref obj) => {
                let collection = match obj.get("collection") {
                    Some(Data::String(s)) => s.clone(),
                    _ => {
                        return Err(CoprocessorError::InvalidArguments(
                            "Missing or invalid 'collection' field".to_string(),
                        ))
                    }
                };
                
                let filter = match obj.get("filter") {
                    Some(Data::Object(f)) => f.clone(),
                    _ => {
                        return Err(CoprocessorError::InvalidArguments(
                            "Missing or invalid 'filter' field".to_string(),
                        ))
                    }
                };
                
                (collection, filter)
            }
            _ => {
                return Err(CoprocessorError::InvalidArguments(
                    "Expected object with 'collection' and 'filter' fields".to_string(),
                ))
            }
        };
        
        // Mock response
        let mut response = HashMap::new();
        response.insert("deleted".to_string(), Data::Number(0.0));
        
        Ok(Data::Object(response))
    }
    
    fn data_to_document(&self, data: &HashMap<String, Data>) -> Result<Document, String> {
        let mut doc = Document::new();
        
        for (key, value) in data.iter() {
            match value {
                Data::String(s) => {
                    doc.insert(key.clone(), s.clone());
                }
                Data::Number(n) => {
                    doc.insert(key.clone(), *n);
                }
                Data::Bool(b) => {
                    doc.insert(key.clone(), *b);
                }
                Data::Array(arr) => {
                    let bson_array: Vec<Bson> = arr.iter().map(|item| {
                        match item {
                            Data::String(s) => Bson::String(s.clone()),
                            Data::Number(n) => Bson::Double(*n),
                            Data::Bool(b) => Bson::Boolean(*b),
                            _ => Bson::Null,
                        }
                    }).collect();
                    doc.insert(key.clone(), bson_array);
                }
                Data::Object(obj) => {
                    if let Ok(nested_doc) = self.data_to_document(obj) {
                        doc.insert(key.clone(), nested_doc);
                    }
                }
                Data::Null => {
                    doc.insert(key.clone(), Bson::Null);
                }
                Data::ObjectRef(obj_id) => {
                    doc.insert(key.clone(), Bson::String(obj_id.0.clone()));
                }
            }
        }
        
        Ok(doc)
    }
}