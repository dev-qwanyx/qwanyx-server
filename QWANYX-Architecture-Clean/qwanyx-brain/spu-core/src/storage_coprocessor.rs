//! Coprocesseur de stockage MongoDB
//! Implémente MEMORIZE et RETRIEVE

use mongodb::{Client, Database, Collection};
use mongodb::bson::{doc, Document, Bson};
use serde::{Serialize, Deserialize};
use crate::{Concept, ConceptData};

pub struct StorageCoprocessor {
    client: Client,
    database: String,
}

impl StorageCoprocessor {
    pub async fn new(uri: &str, database: &str) -> Result<Self, Box<dyn std::error::Error>> {
        let client = Client::with_uri_str(uri).await?;
        Ok(Self {
            client,
            database: database.to_string(),
        })
    }
    
    /// MEMORIZE - Sauvegarde un concept en MongoDB
    pub async fn memorize(&self, concept: &Concept, collection: &str) -> Result<String, Box<dyn std::error::Error>> {
        let db = self.client.database(&self.database);
        let coll = db.collection::<Document>(collection);
        
        // Convertir le concept en document MongoDB
        let doc = match &concept.data {
            ConceptData::Text(text) => doc! {
                "type": "text",
                "data": text,
                "strength": concept.strength,
                "timestamp": chrono::Utc::now().to_rfc3339(),
            },
            ConceptData::Number(num) => doc! {
                "type": "number",
                "data": num,
                "strength": concept.strength,
                "timestamp": chrono::Utc::now().to_rfc3339(),
            },
            _ => doc! {
                "type": "unknown",
                "strength": concept.strength,
                "timestamp": chrono::Utc::now().to_rfc3339(),
            }
        };
        
        let result = coll.insert_one(doc, None).await?;
        Ok(result.inserted_id.to_string())
    }
    
    /// RETRIEVE - Récupère un concept depuis MongoDB
    pub async fn retrieve(&self, id: &str, collection: &str) -> Result<Concept, Box<dyn std::error::Error>> {
        let db = self.client.database(&self.database);
        let coll = db.collection::<Document>(collection);
        
        // Pour simplifier, on récupère le dernier document
        // Dans le futur, on pourra utiliser l'ID ou des critères
        let doc = coll.find_one(None, None).await?
            .ok_or("No document found")?;
        
        // Convertir le document en concept
        let concept_type = doc.get_str("type").unwrap_or("text");
        let data = match concept_type {
            "text" => ConceptData::Text(doc.get_str("data").unwrap_or("").to_string()),
            "number" => ConceptData::Number(doc.get_f64("data").unwrap_or(0.0)),
            _ => ConceptData::Empty,
        };
        
        Ok(Concept {
            id: [0; 12], // TODO: utiliser l'ObjectId MongoDB
            concept_type: crate::ConceptType::Text,
            strength: doc.get_f64("strength").unwrap_or(1.0) as f32,
            data,
            links: Vec::new(),
        })
    }
}