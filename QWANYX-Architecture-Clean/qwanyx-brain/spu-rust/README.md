# QWANYX SPU - Semantic Processing Unit (Rust Implementation)

## 🚀 Overview

High-performance Semantic Processing Unit implementation in Rust, replacing the Python API and Node.js Brain with a single unified binary.

## 📁 Project Structure

```
spu-rust/
├── src/
│   ├── main.rs           # Entry point - Actix-Web server
│   ├── lib.rs            # Library root
│   ├── config.rs         # Configuration management
│   ├── error.rs          # Error types
│   ├── spu/              # Core SPU engine
│   │   ├── processor.rs  # Main semantic processor
│   │   ├── compression.rs # Chinese character compression
│   │   ├── space.rs      # 3D semantic space
│   │   ├── instruction.rs # SPU assembly interpreter
│   │   └── cache.rs      # Multi-level cache
│   ├── api/              # API endpoints
│   ├── brain/            # Brain consciousness
│   ├── memory/           # MongoDB integration
│   ├── email/            # Email processing
│   ├── auth/             # JWT authentication
│   └── workspace/        # Multi-tenancy
└── Cargo.toml            # Dependencies
```

## 🎯 Features Implemented

### ✅ Core SPU Engine
- **SemanticProcessor**: Main processing unit with UUID tracking
- **Chinese Compression**: Text → Chinese characters with adaptive precision
- **3D Semantic Space**: Spheres, raytracing, fuzzy activation
- **SPU Assembly**: Instruction parser and executor
- **Multi-level Cache**: L1/L2 cache with LRU eviction

### ✅ API Server
- **Actix-Web**: High-performance async HTTP server
- **CORS**: Configured for cross-origin requests
- **Compression**: Automatic response compression
- **Logging**: Structured logging with tracing

### ✅ Endpoints
- `GET /health` - Health check
- `POST /compress` - Semantic compression
- `POST /analyze` - Email analysis
- `POST /execute` - Execute SPU assembly code

## 🔧 Configuration

### Environment Variables
```bash
# Server
QWANYX_SERVER_HOST=0.0.0.0
QWANYX_SERVER_PORT=5002

# Database
QWANYX_DATABASE_MONGODB_URI=mongodb://localhost:27017
QWANYX_DATABASE_MONGODB_DATABASE=qwanyx_spu

# SPU Settings
QWANYX_SPU_DEFAULT_COMPRESSION_PRECISION=0.5
QWANYX_SPU_ENABLE_CONTINUOUS_THINKING=true
QWANYX_SPU_CACHE_SIZE_MB=1024

# Email
QWANYX_EMAIL_IMAP_HOST=mail.example.com
QWANYX_EMAIL_SMTP_HOST=mail.example.com

# Auth
QWANYX_AUTH_JWT_SECRET=your_secret_here
```

## 🚦 Building and Running

### Development
```bash
# Build
cargo build

# Run
cargo run

# With environment
RUST_LOG=debug cargo run
```

### Release Build
```bash
# Optimized build
cargo build --release

# Run release
./target/release/qwanyx-spu
```

### Testing
```bash
# Run tests
cargo test

# With output
cargo test -- --nocapture
```

## 📊 Performance

Expected performance vs current system:
- **Compression**: < 1ms (vs 50-200ms)
- **Email analysis**: < 5ms (vs 100ms)
- **Memory usage**: 50-200MB (vs 2-3GB)
- **Startup time**: < 100ms (vs 5-10s)

## 🔌 API Examples

### Compress Text
```bash
curl -X POST http://localhost:5002/compress \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This is an urgent meeting request",
    "precision": 0.5,
    "max_chars": 10
  }'
```

### Analyze Email
```bash
curl -X POST http://localhost:5002/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "email": "Subject: URGENT: Server down\n\nThe production server is not responding."
  }'
```

### Execute SPU Assembly
```bash
curl -X POST http://localhost:5002/execute \
  -H "Content-Type: application/json" \
  -d '{
    "code": "LOAD $EMAIL \"urgent message\"\nSEM_COMPRESS $COMPRESSED $EMAIL 0.8\nRET"
  }'
```

## 🎯 SPU Assembly Language

### Basic Example
```assembly
; Email urgency detection
email_urgency:
    LOAD        $EMAIL, input_email
    SEM_COMPRESS $COMPRESSED, $EMAIL, 0.5
    
    PARALLEL_START
        LLM_EXEC $URGENCY, 'urgency-nano', $COMPRESSED
        LLM_EXEC $SENTIMENT, 'sentiment-nano', $COMPRESSED
    PARALLEL_END
    
    CMP         $URGENCY, 'CRITICAL'
    JE          critical_handler
    JMP         normal_handler
    
critical_handler:
    ; Handle critical email
    RET
    
normal_handler:
    ; Handle normal email
    RET
```

## 🔄 Next Steps

### High Priority
- [ ] Complete MongoDB integration
- [ ] Implement JWT authentication
- [ ] Add WebSocket support
- [ ] Email IMAP/SMTP processing

### Medium Priority
- [ ] Redis cache layer
- [ ] Brain consciousness loop
- [ ] LLM integration (OpenAI/Claude)
- [ ] Nano-LLM models

### Low Priority
- [ ] GPU acceleration
- [ ] ONNX model support
- [ ] Distributed processing
- [ ] Prometheus metrics

## 🐛 Known Issues

1. **Build time**: First build downloads all dependencies (~5-10 minutes)
2. **MongoDB**: Connection not yet implemented
3. **LLM**: Currently returns mock data
4. **Continuous thinking**: Not yet enabled

## 📚 Documentation

See `/docs-rust-implementation/` for detailed architecture and design decisions.

## 📄 License

Proprietary - QWANYX

---

**Status**: 🟡 Alpha - Core engine working, integration pending