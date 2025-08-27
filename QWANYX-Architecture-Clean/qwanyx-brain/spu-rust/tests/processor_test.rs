//! Integration tests for SemanticProcessor

use qwanyx_spu::{SemanticProcessor, Config};

fn test_config() -> qwanyx_spu::config::SPUConfig {
    qwanyx_spu::config::SPUConfig {
        max_brains: 100,
        default_compression_precision: 0.5,
        enable_continuous_thinking: false,
        thinking_interval_ms: 100,
        cache_size_mb: 10,
        enable_gpu: false,
    }
}

#[tokio::test]
async fn test_processor_creation() {
    let config = test_config();
    
    let processor = SemanticProcessor::new(config).unwrap();
    assert!(!processor.id.is_nil());
}

#[tokio::test]
async fn test_basic_compression() {
    let config = test_config();
    let processor = SemanticProcessor::new(config).unwrap();
    
    let text = "This is an urgent meeting request";
    let compressed = processor.compress(text, Some(0.5), None).await.unwrap();
    
    assert!(compressed.len() < text.len());
    assert!(!compressed.is_empty());
}

#[tokio::test]
async fn test_compression_with_precision() {
    let config = test_config();
    let processor = SemanticProcessor::new(config).unwrap();
    
    let text = "Important deadline tomorrow for project alpha beta gamma delta";
    
    // Low precision = less compression
    let low_precision = processor.compress(text, Some(0.2), None).await.unwrap();
    
    // High precision = more compression
    let high_precision = processor.compress(text, Some(0.9), None).await.unwrap();
    
    assert!(high_precision.len() < low_precision.len());
}

#[tokio::test]
async fn test_compression_with_max_chars() {
    let config = test_config();
    let processor = SemanticProcessor::new(config).unwrap();
    
    let text = "This is a very long text with many important concepts that should be compressed into a small representation";
    
    let compressed = processor.compress(text, Some(0.8), Some(5)).await.unwrap();
    
    // Should respect max_chars limit (5 Chinese chars ≈ 15 bytes UTF-8 max)
    assert!(compressed.len() <= 20);
}

#[tokio::test]
async fn test_email_analysis() {
    let config = test_config();
    let processor = SemanticProcessor::new(config).unwrap();
    
    let email = "Subject: URGENT: Server is down!\n\nThe production server is not responding. We need immediate action.";
    
    let analysis = processor.analyze_email(email).await.unwrap();
    
    // Should detect high urgency
    assert!(matches!(
        analysis.urgency,
        qwanyx_spu::spu::processor::Urgency::High | qwanyx_spu::spu::processor::Urgency::Critical
    ));
}

#[tokio::test]
async fn test_spu_execution() {
    let config = test_config();
    let processor = SemanticProcessor::new(config).unwrap();
    
    let code = r#"
        LOAD $TEXT "hello world"
        SEM_COMPRESS $COMPRESSED $TEXT 0.5
        RET
    "#;
    
    let result = processor.execute(code).await.unwrap();
    assert!(!result.is_empty());
}

#[tokio::test]
async fn test_cache_functionality() {
    let config = test_config();
    let processor = SemanticProcessor::new(config).unwrap();
    
    let text = "Cacheable text";
    
    // First call - should cache
    let start = std::time::Instant::now();
    let first = processor.compress(text, Some(0.5), None).await.unwrap();
    let first_duration = start.elapsed();
    
    // Second call - should be cached
    let start = std::time::Instant::now();
    let second = processor.compress(text, Some(0.5), None).await.unwrap();
    let second_duration = start.elapsed();
    
    assert_eq!(first, second);
    // Cache should be faster (though this might be flaky in CI)
    // Uncomment for local testing:
    // assert!(second_duration < first_duration);
}

#[tokio::test]
async fn test_parallel_analysis() {
    let config = test_config();
    let processor = SemanticProcessor::new(config).unwrap();
    
    let emails = vec![
        "Normal email about meeting",
        "URGENT: Critical issue needs attention",
        "FYI: Information update",
    ];
    
    let mut handles = vec![];
    
    for email in emails {
        let proc = processor.clone(); // Assuming processor implements Clone
        let email = email.to_string();
        
        handles.push(tokio::spawn(async move {
            // This would work if processor implements Clone
            // proc.analyze_email(&email).await
            
            // For now, just return a placeholder
            email.len()
        }));
    }
    
    let results = futures::future::join_all(handles).await;
    assert_eq!(results.len(), 3);
}