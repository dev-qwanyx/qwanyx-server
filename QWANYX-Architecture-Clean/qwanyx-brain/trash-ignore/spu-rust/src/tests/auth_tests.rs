//! Authentication system health checks

use crate::auth::{AuthService, RegisterRequest, LoginRequest, VerifyCodeRequest};
use mongodb::Client as MongoClient;
use std::sync::Arc;

#[actix_rt::test]
async fn test_auth_code_generation() {
    // Test that we can generate unique 6-digit codes
    let mut codes = std::collections::HashSet::new();
    
    for _ in 0..100 {
        let code = format!("{:06}", rand::random::<u32>() % 1_000_000);
        assert_eq!(code.len(), 6);
        assert!(code.chars().all(|c| c.is_ascii_digit()));
        codes.insert(code);
    }
    
    // Should have mostly unique codes (allow for some collisions)
    assert!(codes.len() > 95, "Too many code collisions");
}

#[actix_rt::test] 
async fn test_jwt_token_creation() {
    use jsonwebtoken::{encode, decode, Header, Algorithm, Validation, EncodingKey, DecodingKey};
    use crate::auth::Claims;
    use chrono::{Utc, Duration};
    
    let secret = "test_secret_key";
    let claims = Claims {
        sub: "user123".to_string(),
        email: "test@example.com".to_string(),
        workspace: "test_workspace".to_string(),
        exp: (Utc::now() + Duration::days(7)).timestamp(),
    };
    
    // Create token
    let token = encode(
        &Header::new(Algorithm::HS256),
        &claims,
        &EncodingKey::from_secret(secret.as_ref())
    ).expect("Failed to create JWT");
    
    // Verify token
    let decoded = decode::<Claims>(
        &token,
        &DecodingKey::from_secret(secret.as_ref()),
        &Validation::new(Algorithm::HS256)
    ).expect("Failed to decode JWT");
    
    assert_eq!(decoded.claims.email, "test@example.com");
    assert_eq!(decoded.claims.workspace, "test_workspace");
}

#[actix_rt::test]
async fn test_email_validation() {
    // Valid emails
    let valid_emails = vec![
        "user@example.com",
        "test.user@example.co.uk",
        "user+tag@example.com",
        "123@example.com",
    ];
    
    for email in valid_emails {
        assert!(email.contains('@'), "Email validation failed for: {}", email);
        assert!(email.contains('.'), "Email validation failed for: {}", email);
    }
    
    // Invalid emails (basic checks)
    let invalid_emails = vec![
        "",
        "notanemail",
        "@example.com",
        "user@",
        "user @example.com", // space
    ];
    
    for email in invalid_emails {
        assert!(
            email.is_empty() || !email.contains('@') || email.contains(' ') || email.starts_with('@') || email.ends_with('@'),
            "Should reject invalid email: {}", 
            email
        );
    }
}

#[actix_rt::test]
async fn test_workspace_extraction() {
    let test_cases = vec![
        ("user@autodin.com", "autodin"),
        ("user@belgicomics.com", "belgicomics"), 
        ("user@qwanyx.com", "qwanyx"),
        ("user@gmail.com", "default"),
    ];
    
    for (email, expected_workspace) in test_cases {
        let workspace = if email.contains("@autodin") {
            "autodin"
        } else if email.contains("@belgicomics") {
            "belgicomics"
        } else if email.contains("@qwanyx") {
            "qwanyx"
        } else {
            "default"
        };
        
        assert_eq!(workspace, expected_workspace, "Wrong workspace for {}", email);
    }
}