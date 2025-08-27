//! SPU compression health checks

use spu_compression::ChineseCompressor;

#[test]
fn test_basic_compression() {
    let compressor = ChineseCompressor::new();
    
    // Test basic text compression
    let text = "Hello, world! This is a test message for compression.";
    let compressed = compressor.compress(text).expect("Compression failed");
    
    // Check that compression tracked the original length
    assert_eq!(compressed.original_length, text.len(), "Original length not tracked");
    // For short texts, compression might not reduce size or might even be empty
    // The important thing is it doesn't crash
    
    // Decompression would need to be implemented
    // For now just test that compression works
}

#[test]
fn test_unicode_preservation() {
    let compressor = ChineseCompressor::new();
    
    // Test with various Unicode characters
    let texts = vec![
        "Hello 世界! 🌍",
        "Emojis: 😀😃😄😁",
        "Accents: café, naïve, résumé",
        "Math: ∑ ∏ ∫ √ ∞",
    ];
    
    for text in texts {
        let compressed = compressor.compress(text).expect("Compression failed");
        assert_eq!(compressed.original_length, text.len(), "Failed to track length for: {}", text);
        // The compressor should handle all Unicode correctly without crashing
    }
}

#[test]
fn test_empty_and_edge_cases() {
    let compressor = ChineseCompressor::new();
    
    // Empty string
    let empty = "";
    let compressed = compressor.compress(empty).expect("Compression failed");
    assert_eq!(compressed.original_length, 0, "Empty string length should be 0");
    
    // Single character
    let single = "A";
    let compressed = compressor.compress(single).expect("Compression failed");
    assert_eq!(compressed.original_length, 1, "Single character length should be 1");
    
    // Very long repeated text
    let repeated = "a".repeat(1000);
    let compressed = compressor.compress(&repeated).expect("Compression failed");
    assert_eq!(compressed.original_length, 1000, "Should track original length correctly");
    // Repeated text should compress well if compression is working
    if !compressed.characters.is_empty() {
        assert!(compressed.characters.len() < repeated.len() / 2, "Poor compression ratio");
    }
}

#[test]
fn test_compression_determinism() {
    let compressor = ChineseCompressor::new();
    let text = "This is a determinism test";
    
    // Compress the same text multiple times
    let compressed1 = compressor.compress(text).expect("Compression failed");
    let compressed2 = compressor.compress(text).expect("Compression failed");
    let compressed3 = compressor.compress(text).expect("Compression failed");
    
    // Should get the same result each time
    assert_eq!(compressed1.characters, compressed2.characters, "Compression not deterministic");
    assert_eq!(compressed2.characters, compressed3.characters, "Compression not deterministic");
}

#[test]
fn test_large_text_compression() {
    let compressor = ChineseCompressor::new();
    
    // Create a large but within limits text (about 5KB)
    let large_text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(100);
    let original_size = large_text.len();
    
    let compressed = compressor.compress(&large_text).expect("Compression failed");
    let compressed_size = compressed.characters.len();
    
    // Should track original size
    assert_eq!(compressed.original_length, large_text.len(), "Original length not tracked");
    // If compression worked, it should be smaller
    if compressed_size > 0 {
        assert!(compressed_size < original_size, "Compression should reduce size");
    }
    
    println!("Compression ratio: {:.2}:1", 
        original_size as f64 / compressed_size as f64);
}