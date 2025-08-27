//! QWANYX SPU - Main entry point

use actix_web::{web, App, HttpServer, middleware};
use actix_cors::Cors;
use tracing::{info, error};
use tracing_subscriber::EnvFilter;
use std::sync::Arc;

use qwanyx_spu::{Config, SemanticProcessor};
use mongodb::Client as MongoClient;

mod api;
use api::dh_memory::{push_memory, pull_memory};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialize tracing
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();
    
    info!("Starting QWANYX SPU v{}", qwanyx_spu::VERSION);
    
    // Load configuration
    let config = Config::from_env()
        .unwrap_or_else(|e| {
            error!("Failed to load config: {}", e);
            Config::default()
        });
    
    info!("Configuration loaded: {:?}", config.server);
    
    // Initialize SPU
    let spu = Arc::new(
        SemanticProcessor::new(config.spu.clone())
            .expect("Failed to create SPU")
    );
    
    info!("SPU initialized with ID: {}", spu.id);
    
    // Initialize database connections
    let mongo_uri = std::env::var("MONGO_URI")
        .unwrap_or_else(|_| "mongodb://localhost:27017".to_string());
    
    info!("Connecting to MongoDB at {}", mongo_uri);
    let mongo_client = MongoClient::with_uri_str(&mongo_uri)
        .await
        .expect("Failed to connect to MongoDB");
    
    // TODO: Connect to Redis
    
    // Clone config for server
    let server_config = config.server.clone();
    
    // Start HTTP server
    info!("Starting server on {}:{}", server_config.host, server_config.port);
    
    HttpServer::new(move || {
        // Configure CORS
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);
        
        App::new()
            .app_data(web::Data::new(spu.clone()))
            .app_data(web::Data::new(config.clone()))
            .app_data(web::Data::new(mongo_client.clone()))
            .wrap(cors)
            .wrap(middleware::Logger::default())
            .wrap(middleware::Compress::default())
            // Health check
            .route("/health", web::get().to(health_check))
            // SPU endpoints
            .route("/compress", web::post().to(compress_text))
            .route("/analyze", web::post().to(analyze_email))
            .route("/execute", web::post().to(execute_spu))
            // DH Memory API - Compatible with Python Flask API
            .route("/api/dh/push", web::post().to(push_memory))
            .route("/api/dh/pull", web::post().to(pull_memory))
    })
    .bind((server_config.host, server_config.port))?
    .workers(server_config.workers.unwrap_or_else(num_cpus::get))
    .run()
    .await
}

// Handler functions

async fn health_check() -> impl actix_web::Responder {
    actix_web::HttpResponse::Ok().json(serde_json::json!({
        "status": "healthy",
        "version": qwanyx_spu::VERSION,
        "timestamp": chrono::Utc::now().to_rfc3339(),
    }))
}

async fn compress_text(
    spu: web::Data<Arc<SemanticProcessor>>,
    body: web::Json<CompressRequest>,
) -> impl actix_web::Responder {
    match spu.compress(&body.text, body.precision, body.max_chars).await {
        Ok(compressed) => {
            actix_web::HttpResponse::Ok().json(serde_json::json!({
                "compressed": base64::encode(&compressed),
                "original_length": body.text.len(),
                "compressed_length": compressed.len(),
                "ratio": body.text.len() as f32 / compressed.len() as f32,
            }))
        }
        Err(e) => {
            actix_web::HttpResponse::InternalServerError().json(serde_json::json!({
                "error": e.to_string(),
            }))
        }
    }
}

async fn analyze_email(
    spu: web::Data<Arc<SemanticProcessor>>,
    body: web::Json<AnalyzeRequest>,
) -> impl actix_web::Responder {
    match spu.analyze_email(&body.email).await {
        Ok(analysis) => actix_web::HttpResponse::Ok().json(analysis),
        Err(e) => {
            actix_web::HttpResponse::InternalServerError().json(serde_json::json!({
                "error": e.to_string(),
            }))
        }
    }
}

async fn execute_spu(
    spu: web::Data<Arc<SemanticProcessor>>,
    body: web::Json<ExecuteRequest>,
) -> impl actix_web::Responder {
    match spu.execute(&body.code).await {
        Ok(result) => {
            actix_web::HttpResponse::Ok().json(serde_json::json!({
                "result": base64::encode(&result),
            }))
        }
        Err(e) => {
            actix_web::HttpResponse::InternalServerError().json(serde_json::json!({
                "error": e.to_string(),
            }))
        }
    }
}

// Request types

#[derive(serde::Deserialize)]
struct CompressRequest {
    text: String,
    precision: Option<f32>,
    max_chars: Option<usize>,
}

#[derive(serde::Deserialize)]
struct AnalyzeRequest {
    email: String,
}

#[derive(serde::Deserialize)]
struct ExecuteRequest {
    code: String,
}

// Add missing dependencies
use base64;
use num_cpus;
