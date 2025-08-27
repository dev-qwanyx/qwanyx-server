//! Types de données que le SPU peut manipuler
//! Ce sont les données réelles, pas des concepts abstraits

use serde::{Serialize, Deserialize};
use serde_json::Value as JsonValue;
use bson::{Document, doc as bson_doc};

/// Données que le SPU peut traiter
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SPUData {
    /// Données JSON (utilisateurs, flows, etc.)
    Json(JsonValue),
    
    /// Texte brut (emails, documents)
    Text(String),
    
    /// Nombre
    Number(f64),
    
    /// Données binaires (images, fichiers)
    Binary(Vec<u8>),
    
    /// Document MongoDB
    Document(Document),
    
    /// ID de référence
    ObjectId(String),
    
    /// Vide
    Empty,
}

impl SPUData {
    /// Créer depuis JSON
    pub fn from_json<T: Serialize>(data: T) -> Result<Self, serde_json::Error> {
        let json = serde_json::to_value(data)?;
        Ok(SPUData::Json(json))
    }
    
    /// Convertir en Document MongoDB
    pub fn to_document(&self) -> Result<Document, Box<dyn std::error::Error>> {
        match self {
            SPUData::Json(json) => {
                // Convertir JSON en BSON Document
                let bson = bson::to_bson(json)?;
                match bson {
                    bson::Bson::Document(doc) => Ok(doc),
                    _ => Ok(bson_doc! { "data": bson }),
                }
            },
            SPUData::Text(text) => Ok(bson_doc! {
                "type": "text",
                "data": text,
            }),
            SPUData::Number(num) => Ok(bson_doc! {
                "type": "number",
                "data": num,
            }),
            SPUData::Document(doc) => Ok(doc.clone()),
            _ => Err("Cannot convert to document".into()),
        }
    }
    
    /// Obtenir comme JSON
    pub fn as_json(&self) -> Option<&JsonValue> {
        match self {
            SPUData::Json(json) => Some(json),
            _ => None,
        }
    }
    
    /// Obtenir comme texte
    pub fn as_text(&self) -> Option<String> {
        match self {
            SPUData::Text(text) => Some(text.clone()),
            SPUData::Json(json) => Some(json.to_string()),
            SPUData::Number(n) => Some(n.to_string()),
            _ => None,
        }
    }
}

/// Registre SPU contenant des données
#[derive(Debug, Clone)]
pub struct Register {
    pub name: String,
    pub data: SPUData,
}

impl Register {
    pub fn new(name: &str) -> Self {
        Register {
            name: name.to_string(),
            data: SPUData::Empty,
        }
    }
    
    pub fn with_data(name: &str, data: SPUData) -> Self {
        Register {
            name: name.to_string(),
            data,
        }
    }
}