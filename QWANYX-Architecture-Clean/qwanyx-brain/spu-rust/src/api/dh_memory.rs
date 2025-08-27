//! Digital Human Memory API - Exactement comme l'API Python
//! /api/dh/push et /api/dh/pull

use actix_web::{web, HttpRequest, HttpResponse, Result};
use mongodb::{Client, bson::{doc, Document, Bson}};
use serde::{Deserialize, Serialize};
use serde_json::Value as JsonValue;
use chrono::Utc;

/// Structure de requête pour push/pull
#[derive(Debug, Deserialize)]
pub struct DHMemoryRequest {
    pub dh_email: String,
    pub dh_id: String,
    pub flow_title: Option<String>,
    pub nodes: Option<Vec<JsonValue>>,
    pub edges: Option<Vec<JsonValue>>,
}

/// Structure de réponse
#[derive(Debug, Serialize)]
pub struct DHMemoryResponse {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub success: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub dh_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub nodes: Option<Vec<JsonValue>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub edges: Option<Vec<JsonValue>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub exists: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

/// Convertir email DH en nom de collection MongoDB
fn get_collection_name(dh_email: &str) -> String {
    // stephen@qwanyx.com -> stephen-qwanyx-com
    dh_email.replace('@', "-").replace('.', "-")
}

/// Obtenir le workspace depuis headers ou JWT
fn get_workspace(req: &HttpRequest) -> String {
    // Priority: header > jwt > 'autodin' (default)
    req.headers()
        .get("X-Workspace")
        .and_then(|v| v.to_str().ok())
        .map(|s| s.to_string())
        .unwrap_or_else(|| {
            // TODO: Extraire du JWT si disponible
            "autodin".to_string()
        })
}

/// API /api/dh/push - Sauvegarde flow en mémoire
pub async fn push_memory(
    req: HttpRequest,
    data: web::Json<DHMemoryRequest>,
    mongo_client: web::Data<Client>,
) -> Result<HttpResponse> {
    println!("[DH PUSH] Request received");
    
    // Obtenir le workspace
    let workspace = get_workspace(&req);
    println!("[DH PUSH] Workspace: {}", workspace);
    
    // Valider les champs requis
    if data.dh_email.is_empty() {
        return Ok(HttpResponse::BadRequest().json(DHMemoryResponse {
            error: Some("DH email is required".to_string()),
            ..Default::default()
        }));
    }
    
    if data.dh_id.is_empty() {
        return Ok(HttpResponse::BadRequest().json(DHMemoryResponse {
            error: Some("DH ID is required".to_string()),
            ..Default::default()
        }));
    }
    
    // Obtenir la base de données et collection
    let db = mongo_client.database(&workspace);
    let collection_name = get_collection_name(&data.dh_email);
    let collection = db.collection::<Document>(&collection_name);
    
    println!("[DH PUSH] Database: {}, Collection: {}", workspace, collection_name);
    
    // Convertir l'ID en ObjectId si possible
    let flow_id = if data.dh_id.len() == 24 && data.dh_id.chars().all(|c| c.is_ascii_hexdigit()) {
        Bson::ObjectId(mongodb::bson::oid::ObjectId::parse_str(&data.dh_id).unwrap())
    } else {
        Bson::String(data.dh_id.clone())
    };
    
    // Préparer le document flow
    let flow_doc = doc! {
        "_id": flow_id.clone(),
        "data": {
            "label": data.flow_title.as_ref().unwrap_or(&"root".to_string()),
            "type": "flow"
        },
        "nodes": bson::to_bson(&data.nodes).unwrap(),
        "edges": bson::to_bson(&data.edges).unwrap(),
        "updated_at": Utc::now().to_rfc3339(),
    };
    
    // Vérifier si le document existe pour préserver created_at
    let existing = collection
        .find_one(doc! {"_id": &flow_id}, None)
        .await
        .unwrap_or(None);
    
    let mut final_doc = flow_doc;
    if let Some(existing_doc) = existing {
        // Préserver created_at
        if let Some(created) = existing_doc.get("created_at") {
            final_doc.insert("created_at", created.clone());
        }
    } else {
        final_doc.insert("created_at", Utc::now().to_rfc3339());
    }
    
    // Sauvegarder
    match collection.replace_one(
        doc! {"_id": &flow_id},
        final_doc,
        mongodb::options::ReplaceOptions::builder().upsert(true).build()
    ).await {
        Ok(result) => {
            Ok(HttpResponse::Ok().json(DHMemoryResponse {
                success: Some(true),
                message: Some(format!("Flow saved successfully for DH {}", data.dh_id)),
                ..Default::default()
            }))
        },
        Err(e) => {
            println!("[DH PUSH] Error: {}", e);
            Ok(HttpResponse::InternalServerError().json(DHMemoryResponse {
                error: Some(e.to_string()),
                ..Default::default()
            }))
        }
    }
}

/// API /api/dh/pull - Récupère flow depuis la mémoire
pub async fn pull_memory(
    req: HttpRequest,
    data: web::Json<DHMemoryRequest>,
    mongo_client: web::Data<Client>,
) -> Result<HttpResponse> {
    println!("[DH PULL] Request received");
    
    // Obtenir le workspace
    let workspace = get_workspace(&req);
    println!("[DH PULL] Workspace: {}", workspace);
    
    // Valider les champs requis
    if data.dh_email.is_empty() {
        return Ok(HttpResponse::BadRequest().json(DHMemoryResponse {
            error: Some("DH email is required".to_string()),
            ..Default::default()
        }));
    }
    
    if data.dh_id.is_empty() {
        return Ok(HttpResponse::BadRequest().json(DHMemoryResponse {
            error: Some("DH ID is required".to_string()),
            ..Default::default()
        }));
    }
    
    // Obtenir la base de données et collection
    let db = mongo_client.database(&workspace);
    let collection_name = get_collection_name(&data.dh_email);
    let collection = db.collection::<Document>(&collection_name);
    
    // Convertir l'ID
    let flow_id = if data.dh_id.len() == 24 && data.dh_id.chars().all(|c| c.is_ascii_hexdigit()) {
        Bson::ObjectId(mongodb::bson::oid::ObjectId::parse_str(&data.dh_id).unwrap())
    } else {
        Bson::String(data.dh_id.clone())
    };
    
    // Chercher le document
    match collection.find_one(doc! {"_id": &flow_id}, None).await {
        Ok(Some(flow_doc)) => {
            // Extraire les données
            let title = flow_doc
                .get_document("data").ok()
                .and_then(|d| d.get_str("label").ok())
                .unwrap_or("root")
                .to_string();
            
            let nodes = flow_doc
                .get("nodes")
                .and_then(|n| bson::from_bson::<Vec<JsonValue>>(n.clone()).ok())
                .unwrap_or_default();
            
            let edges = flow_doc
                .get("edges")
                .and_then(|e| bson::from_bson::<Vec<JsonValue>>(e.clone()).ok())
                .unwrap_or_default();
            
            Ok(HttpResponse::Ok().json(DHMemoryResponse {
                dh_id: Some(data.dh_id.clone()),
                title: Some(title),
                nodes: Some(nodes),
                edges: Some(edges),
                exists: Some(true),
                ..Default::default()
            }))
        },
        Ok(None) => {
            // Document n'existe pas
            Ok(HttpResponse::Ok().json(DHMemoryResponse {
                dh_id: Some(data.dh_id.clone()),
                title: Some("root".to_string()),
                nodes: Some(vec![]),
                edges: Some(vec![]),
                exists: Some(false),
                ..Default::default()
            }))
        },
        Err(e) => {
            println!("[DH PULL] Error: {}", e);
            Ok(HttpResponse::InternalServerError().json(DHMemoryResponse {
                error: Some(e.to_string()),
                ..Default::default()
            }))
        }
    }
}

// Implémentation Default pour la réponse
impl Default for DHMemoryResponse {
    fn default() -> Self {
        Self {
            success: None,
            message: None,
            dh_id: None,
            title: None,
            nodes: None,
            edges: None,
            exists: None,
            error: None,
        }
    }
}