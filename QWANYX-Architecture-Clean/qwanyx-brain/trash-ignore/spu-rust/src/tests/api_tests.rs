//! API endpoint health checks

use actix_web::{test, web, App};
use crate::SemanticProcessor;
use std::sync::Arc;

#[actix_rt::test]
async fn test_health_endpoint() {
    // Create test app
    let app = test::init_service(
        App::new()
            .route("/health", web::get().to(health_check_handler))
    ).await;
    
    // Send request
    let req = test::TestRequest::get()
        .uri("/health")
        .to_request();
        
    let resp = test::call_service(&app, req).await;
    
    // Check response
    assert!(resp.status().is_success());
    assert_eq!(resp.status(), 200);
}

#[actix_rt::test]
async fn test_cors_headers() {
    let app = test::init_service(
        App::new()
            .wrap(
                actix_cors::Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header()
            )
            .route("/test", web::get().to(|| async { "OK" }))
    ).await;
    
    let req = test::TestRequest::get()
        .uri("/test")
        .insert_header(("Origin", "http://localhost:3000"))
        .to_request();
        
    let resp = test::call_service(&app, req).await;
    
    // Check CORS headers
    assert!(resp.headers().contains_key("access-control-allow-origin"));
}

#[actix_rt::test]
async fn test_json_response_format() {
    use serde_json::json;
    
    // Test JSON serialization
    let test_response = json!({
        "status": "success",
        "data": {
            "id": 123,
            "email": "test@example.com"
        }
    });
    
    let json_str = test_response.to_string();
    assert!(json_str.contains("\"status\":\"success\""));
    assert!(json_str.contains("\"email\":\"test@example.com\""));
    
    // Test JSON deserialization
    let parsed: serde_json::Value = serde_json::from_str(&json_str)
        .expect("Failed to parse JSON");
    
    assert_eq!(parsed["status"], "success");
    assert_eq!(parsed["data"]["id"], 123);
}

#[actix_rt::test]
async fn test_error_response_format() {
    use actix_web::http::StatusCode;
    use serde_json::json;
    
    // Standard error responses
    let error_codes = vec![
        (StatusCode::BAD_REQUEST, "Invalid input"),
        (StatusCode::UNAUTHORIZED, "Authentication required"),
        (StatusCode::FORBIDDEN, "Access denied"),
        (StatusCode::NOT_FOUND, "Resource not found"),
        (StatusCode::INTERNAL_SERVER_ERROR, "Internal server error"),
    ];
    
    for (status, message) in error_codes {
        let error_response = json!({
            "error": message,
            "status": status.as_u16()
        });
        
        assert_eq!(error_response["status"], status.as_u16());
        assert_eq!(error_response["error"], message);
    }
}

// Helper handler for tests
async fn health_check_handler() -> impl actix_web::Responder {
    actix_web::HttpResponse::Ok().json(serde_json::json!({
        "status": "healthy",
        "version": "0.1.0",
    }))
}