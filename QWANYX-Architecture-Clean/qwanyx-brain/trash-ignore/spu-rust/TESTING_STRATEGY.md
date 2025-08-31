# SPU Testing Strategy

## 📋 Overview

The QWANYX SPU (Semantic Processing Unit) testing strategy ensures reliability, performance, and correctness across all components. We use a multi-layered approach combining unit tests, integration tests, benchmarks, and property-based testing.

## 🎯 Testing Goals

1. **Correctness**: Ensure all algorithms work as specified
2. **Performance**: Validate sub-millisecond response times
3. **Reliability**: Handle edge cases and error conditions
4. **Scalability**: Test with varying data sizes
5. **Security**: Validate input sanitization and bounds checking

## 🧪 Testing Layers

### 1. Unit Tests (Per Module)
Located in `src/{module}.rs` under `#[cfg(test)]` blocks

#### Compression Module (`src/spu/compression.rs`)
- **Basic Operations**
  - Text compression with various precision levels
  - Decompression and roundtrip integrity
  - Chinese character mapping correctness
  
- **Edge Cases**
  - Empty input handling
  - Invalid precision values (< 0.0 or > 1.0)
  - Unknown concepts gracefully handled
  - UTF-8 safety with mixed character sets
  
- **Adaptive Behavior**
  - Low precision = less compression
  - High precision = more compression
  - Max chars limit enforcement
  - Case-insensitive concept matching

#### Space Module (`src/spu/space.rs`)
- **3D Operations**
  - Distance calculations (Euclidean)
  - Barycenter computation (weighted and unweighted)
  - Position clamping within bounds
  
- **Spatial Queries**
  - Find spheres within radius
  - Find nearest sphere
  - Raytracing through space
  
- **Activation Propagation**
  - Fuzzy activation with distance decay
  - Activation spread to neighbors
  - Activation value bounds (0.0 - 1.0)

#### Instruction Module (`src/spu/instruction.rs`)
- **Parsing**
  - Valid SPU assembly syntax
  - Invalid instruction handling
  - Register name validation
  
- **Execution**
  - Basic instructions (LOAD, MOV, RET)
  - Control flow (JMP, JE, JNE)
  - Parallel execution blocks
  - LLM execution simulation

#### Cache Module (`src/spu/cache.rs`)
- **Multi-level Caching**
  - L1 cache (in-memory, fast)
  - L2 cache (persistent, larger)
  - Cache hit/miss tracking
  
- **Eviction Policies**
  - LRU (Least Recently Used)
  - Size-based eviction
  - TTL expiration

### 2. Integration Tests
Located in `tests/` directory

#### `tests/processor_test.rs`
- End-to-end processor creation
- Email analysis pipeline
- Compression with real text
- SPU code execution
- Cache functionality across operations
- Parallel processing simulation

### 3. Benchmarks
Located in `benches/` directory

#### `benches/compression.rs`
```rust
// Measures:
- Short text compression: < 1ms target
- Long text compression: < 5ms target
- Different precision levels impact
- Decompression speed
- Roundtrip performance
```

#### `benches/space.rs`
```rust
// Measures:
- Sphere insertion: < 0.1ms
- Find in radius (100 spheres): < 1ms
- Find nearest (50 spheres): < 0.5ms
- Fuzzy activation propagation: < 2ms
- Raytracing performance: < 5ms
```

### 4. Property-Based Tests (Future)
Using `proptest` for generative testing

```rust
proptest! {
    #[test]
    fn compression_never_crashes(text in ".*", precision in 0.0..=1.0) {
        let compressor = ChineseCompressor::new();
        let _ = compressor.compress(&text, precision, None);
    }
    
    #[test]
    fn roundtrip_preserves_concepts(text in "[a-z ]{1,100}") {
        // Compress and decompress should preserve key concepts
    }
}
```

## 🏃 Running Tests

### Quick Test Suite
```bash
# Run all unit tests
cargo test --lib

# Run specific module tests
cargo test compression::tests
cargo test space::tests

# Run with output
cargo test -- --nocapture

# Run in release mode (faster)
cargo test --release
```

### Integration Tests
```bash
# Run all integration tests
cargo test --test '*'

# Run specific integration test
cargo test --test processor_test
```

### Benchmarks
```bash
# Run all benchmarks
cargo bench

# Run specific benchmark
cargo bench compression

# Generate HTML report
cargo bench -- --save-baseline baseline
```

### Coverage Report
```bash
# Install tarpaulin
cargo install cargo-tarpaulin

# Generate coverage
cargo tarpaulin --out Html --output-dir coverage
```

## 📊 Test Coverage Requirements

| Component | Unit Tests | Integration | Benchmark | Min Coverage |
|-----------|------------|-------------|-----------|--------------|
| Compression | ✅ 13 tests | ✅ 4 tests | ✅ 6 benches | 85% |
| Space | ✅ 15 tests | ✅ 2 tests | ✅ 10 benches | 80% |
| Instruction | ✅ 8 tests | ✅ 1 test | ❌ TODO | 75% |
| Cache | ✅ 6 tests | ✅ 1 test | ❌ TODO | 70% |
| Processor | ✅ 5 tests | ✅ 8 tests | ❌ TODO | 90% |

## 🔍 Key Testing Patterns

### 1. Arrange-Act-Assert
```rust
#[test]
fn test_compression() {
    // Arrange
    let compressor = ChineseCompressor::new();
    let text = "urgent meeting";
    
    // Act
    let result = compressor.compress(text, 0.5, None);
    
    // Assert
    assert!(result.is_ok());
    assert!(!result.unwrap().is_empty());
}
```

### 2. Table-Driven Tests
```rust
#[test]
fn test_urgency_levels() {
    let test_cases = vec![
        ("normal email", Urgency::Low),
        ("urgent: help", Urgency::High),
        ("CRITICAL ERROR", Urgency::Critical),
    ];
    
    for (input, expected) in test_cases {
        assert_eq!(analyze_urgency(input), expected);
    }
}
```

### 3. Fuzzing Boundaries
```rust
#[test]
fn test_bounds() {
    // Test minimum values
    test_with_precision(0.0);
    
    // Test maximum values
    test_with_precision(1.0);
    
    // Test beyond bounds (should error)
    assert!(test_with_precision(-0.1).is_err());
    assert!(test_with_precision(1.1).is_err());
}
```

## 🐛 Debugging Failed Tests

### Verbose Output
```bash
RUST_LOG=debug cargo test failing_test -- --nocapture
```

### Single Test
```bash
cargo test test_name -- --exact
```

### With Backtrace
```bash
RUST_BACKTRACE=1 cargo test
```

## 📈 Performance Testing

### Baseline Establishment
1. Run benchmarks on clean build
2. Save baseline: `cargo bench -- --save-baseline main`
3. Make changes
4. Compare: `cargo bench -- --baseline main`

### Performance Regression Detection
```rust
#[test]
fn test_performance_regression() {
    let start = Instant::now();
    expensive_operation();
    let duration = start.elapsed();
    
    assert!(duration < Duration::from_millis(10),
            "Operation took {:?}, max allowed: 10ms", duration);
}
```

## 🔒 Security Testing

### Input Validation
```rust
#[test]
fn test_sql_injection_prevention() {
    let malicious = "'; DROP TABLE users; --";
    let result = process_input(malicious);
    assert!(result.is_err());
}
```

### Bounds Checking
```rust
#[test]
fn test_buffer_overflow_prevention() {
    let huge_input = "x".repeat(1_000_000);
    let result = compress(&huge_input, 0.5, Some(100));
    assert!(result.unwrap().len() <= 300); // 100 chars * 3 bytes
}
```

## 📝 Test Documentation

Each test should have:
1. Clear descriptive name
2. Comment explaining what's being tested
3. Assertion messages for failures

```rust
#[test]
/// Ensures that high precision compression produces smaller output than low precision
fn test_adaptive_compression_sizes() {
    let text = "urgent critical important";
    
    let low = compress(text, 0.2, None).unwrap();
    let high = compress(text, 0.9, None).unwrap();
    
    assert!(
        high.len() < low.len(),
        "High precision ({} bytes) should compress more than low precision ({} bytes)",
        high.len(), low.len()
    );
}
```

## 🚀 Continuous Integration

### GitHub Actions Workflow
```yaml
name: SPU Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions-rs/toolchain@v1
      - run: cargo test --all-features
      - run: cargo bench --no-run
      - run: cargo tarpaulin --out Xml
      - uses: codecov/codecov-action@v2
```

## 📅 Testing Checklist

Before each commit:
- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] No performance regressions
- [ ] Coverage > 80%
- [ ] No new clippy warnings

Before release:
- [ ] Full benchmark suite
- [ ] Memory leak check (valgrind)
- [ ] Stress testing (high load)
- [ ] Security audit
- [ ] Documentation updated

## 🎯 Next Steps

1. **Add Property-Based Tests**: Use proptest for exhaustive testing
2. **Implement Fuzzing**: Use cargo-fuzz for finding edge cases
3. **Add Stress Tests**: Test with 10,000+ spheres
4. **Memory Profiling**: Ensure no leaks with valgrind
5. **Concurrency Tests**: Test parallel operations thoroughly
6. **Mock LLM Integration**: Create mock LLM for testing
7. **Database Integration Tests**: Test MongoDB operations
8. **Network Tests**: Test API endpoints under load

---

This comprehensive testing strategy ensures the SPU is production-ready with enterprise-grade reliability.