# SPU Core - Complete Instruction Set Reference
**Version 2.0 - Object-Oriented Assembly Language**

## Executive Summary

SPU (Semantic Processing Unit) is an object-oriented assembly language where:
- **Objects = Coprocessors** (implemented in any language: Rust, Python, AI models, humans)
- **Method Calls = Assembly Instructions**
- **Universal Runtime** for intelligence, regardless of substrate

## Instruction Categories

### 📊 Implementation Status Summary

| Category | Implemented | Defined | Missing | Total |
|----------|------------|---------|---------|-------|
| Object Management | 2/6 | 6 | 4 | 6 |
| Method Invocation | 1/4 | 4 | 3 | 4 |
| Data Operations | 2/2 | 2 | 0 | 2 |
| Control Flow | 0/2 | 2 | 2 | 2 |
| Error Handling | 2/3 | 3 | 1 | 3 |
| Parallel Processing | 0/3 | 3 | 3 | 3 |
| Discovery | 1/3 | 3 | 2 | 3 |
| OOP Advanced | 0/3 | 3 | 3 | 3 |
| Debug/System | 2/3 | 3 | 1 | 3 |
| **TOTAL** | **10/29** | **29** | **19** | **29** |

---

## 🟢 Currently Implemented Instructions (10)

### Object Management
1. **INSTANTIATE** class_name instance_name
   - Creates an instance of a coprocessor class
   - Example: `INSTANTIATE database db1`
   - Status: ✅ Implemented in simple_parser.rs

### Method Invocation
2. **CALL** instance method args result_var
   - Synchronous method call (PUSH + WAIT + POP)
   - Example: `CALL db1 store $data result`
   - Status: ✅ Implemented

### Data Operations
3. **SET** variable value
   - Store value in variable
   - Example: `SET user_data {"name": "John", "age": 30}`
   - Status: ✅ Implemented

4. **GET** variable.field target_var
   - Extract field from variable
   - Example: `GET user_data.name user_name`
   - Status: ✅ Implemented

### Error Handling
5. **TRY** { instructions }
   - Start error handling block
   - Example: `TRY { CALL risky_op ... }`
   - Status: ✅ Implemented

6. **CATCH** error_type { handler }
   - Handle specific errors
   - Example: `CATCH NetworkError { CALL retry ... }`
   - Status: ✅ Implemented

### Discovery
7. **GETHEALTH** instance result
   - Check coprocessor health
   - Example: `GETHEALTH db1 status`
   - Status: ✅ Implemented (as GETHEALTH)

### Debug/System
8. **TRACE** message
   - Debug output
   - Example: `TRACE "Processing user data"`
   - Status: ✅ Implemented

9. **HALT**
   - Stop execution
   - Example: `HALT`
   - Status: ✅ Implemented

10. **NOP**
    - No operation
    - Example: `NOP`
    - Status: ✅ Implemented (defined in lib.rs)

---

## 🔵 Defined But Not Implemented (19)

### Object Management (4)
11. **REGISTER** class_name implementation
    - Register new coprocessor class
    - Example: `REGISTER "email" EmailService`
    - Status: ❌ Not implemented in parser

12. **DESTROY** object_id
    - Destroy object instance
    - Example: `DESTROY db1`
    - Status: ❌ Not implemented

13. **EXTEND** parent_class → child_class
    - Inheritance
    - Example: `EXTEND processor → email_processor`
    - Status: ❌ Not implemented

14. **COMPOSE** [objects] → composite
    - Composition
    - Example: `COMPOSE [auth, db, email] → user_service`
    - Status: ❌ Not implemented

15. **DELEGATE** object.method → other.method
    - Method delegation
    - Example: `DELEGATE user.save → db.store`
    - Status: ❌ Not implemented

### Method Invocation (3)
16. **PUSH** object.method args
    - Asynchronous method call
    - Example: `PUSH email.send $message`
    - Status: ❌ Not implemented

17. **POP** object → result
    - Get async result
    - Example: `POP email → send_result`
    - Status: ❌ Not implemented

18. **WAIT** object
    - Wait for async completion
    - Example: `WAIT email`
    - Status: ❌ Not implemented

### Control Flow (2)
19. **IF** condition { then } ELSE { else }
    - Conditional execution
    - Example: `IF $role == "admin" { ... }`
    - Status: ❌ Not implemented

20. **WHILE** condition { body }
    - Loop while condition true
    - Example: `WHILE $count > 0 { ... }`
    - Status: ❌ Not implemented

### Error Handling (1)
21. **RETRY** count { instructions } WITH_BACKOFF strategy
    - Retry with backoff
    - Example: `RETRY 3 { CALL api.fetch } WITH_BACKOFF exponential`
    - Status: ❌ Not implemented

### Parallel Processing (3)
22. **FORK** data → [targets]
    - Parallel execution
    - Example: `FORK $data → [email.send, db.store, log.write]`
    - Status: ❌ Not implemented

23. **JOIN** mode → results
    - Wait for parallel results
    - Modes: ALL, ANY, FIRST
    - Example: `JOIN ALL → results`
    - Status: ❌ Not implemented

### Discovery (2)
24. **LIST_OBJECTS** → result
    - List available coprocessor classes
    - Example: `LIST_OBJECTS → classes`
    - Status: ❌ Not implemented

25. **GET_METHODS** object → result
    - Get object's methods
    - Example: `GET_METHODS db1 → methods`
    - Status: ❌ Not implemented

---

## 📝 Complete Instruction Details

### Object Method Invocation

#### PUSH (Async Call)
```assembly
PUSH object.method, arguments
```
- **Purpose**: Initiate asynchronous method call
- **Parameters**:
  - `object`: Target coprocessor instance
  - `method`: Method name
  - `arguments`: Method arguments (Data type)
- **Example**:
```assembly
PUSH email1.send, {"to": "user@example.com", "subject": "Hello"}
PUSH db1.store, $user_data
PUSH ai1.analyze, $document
```

#### POP (Get Result)
```assembly
POP object → result
```
- **Purpose**: Retrieve result from async call
- **Parameters**:
  - `object`: Coprocessor that was called
  - `result`: Variable to store result
- **Example**:
```assembly
POP email1 → send_status
POP db1 → record_id
```

#### CALL (Sync Call)
```assembly
CALL object.method, args → result
```
- **Purpose**: Synchronous method call (equivalent to PUSH + WAIT + POP)
- **Parameters**:
  - `object`: Target coprocessor
  - `method`: Method name
  - `args`: Arguments
  - `result`: Result variable
- **Example**:
```assembly
CALL auth1.validate, $credentials → is_valid
CALL db1.retrieve, {"id": "123"} → user_record
```

### Object Management

#### REGISTER
```assembly
REGISTER class_name, implementation
```
- **Purpose**: Register a new coprocessor class
- **Parameters**:
  - `class_name`: Name for the class
  - `implementation`: Actual implementation
- **Example**:
```assembly
REGISTER "email", EmailCoprocessor::new()
REGISTER "ai_model", PythonModel::load("model.pkl")
```

#### INSTANTIATE
```assembly
INSTANTIATE class_name → instance_id
```
- **Purpose**: Create an instance of a coprocessor
- **Parameters**:
  - `class_name`: Registered class name
  - `instance_id`: Name for the instance
- **Example**:
```assembly
INSTANTIATE email → email1
INSTANTIATE database → db1
INSTANTIATE ai_model → classifier1
```

#### DESTROY
```assembly
DESTROY instance_id
```
- **Purpose**: Destroy a coprocessor instance
- **Parameters**:
  - `instance_id`: Instance to destroy
- **Example**:
```assembly
DESTROY temp_processor
DESTROY old_connection
```

### Data Operations

#### SET
```assembly
SET variable value
```
- **Purpose**: Store value in variable
- **Parameters**:
  - `variable`: Variable name
  - `value`: Value to store (any Data type)
- **Example**:
```assembly
SET user_data {"email": "user@example.com", "role": "admin"}
SET counter 0
SET message "Hello World"
```

#### GET
```assembly
GET source.field → target
```
- **Purpose**: Extract field from object
- **Parameters**:
  - `source`: Source variable
  - `field`: Field path (supports nested: `user.address.city`)
  - `target`: Target variable
- **Example**:
```assembly
GET user_data.email → user_email
GET response.status.code → status_code
```

### Control Flow

#### IF
```assembly
IF condition {
    # then branch
} ELSE {
    # else branch (optional)
}
```
- **Purpose**: Conditional execution
- **Parameters**:
  - `condition`: Boolean expression
- **Example**:
```assembly
IF $role == "admin" {
    CALL admin_service.grant_access
} ELSE {
    CALL auth_service.deny
}
```

#### WHILE
```assembly
WHILE condition {
    # loop body
}
```
- **Purpose**: Loop while condition is true
- **Example**:
```assembly
WHILE $retry_count < 3 {
    CALL api.fetch → result
    IF $result.success {
        BREAK
    }
    SET retry_count $retry_count + 1
}
```

### Parallel Processing

#### FORK
```assembly
FORK data → [
    object1.method1,
    object2.method2,
    object3.method3
]
```
- **Purpose**: Execute multiple operations in parallel
- **Parameters**:
  - `data`: Input data for all operations
  - `targets`: List of object.method pairs
- **Example**:
```assembly
FORK $user_data → [
    email1.send_welcome,
    db1.store_user,
    analytics1.track_signup
]
```

#### JOIN
```assembly
JOIN mode → results
```
- **Purpose**: Wait for parallel operations
- **Parameters**:
  - `mode`: ALL (wait for all), ANY (first to complete), FIRST (specific one)
  - `results`: Array of results
- **Example**:
```assembly
JOIN ALL → [email_sent, user_stored, tracked]
JOIN ANY → first_result
```

### Error Handling

#### TRY/CATCH
```assembly
TRY {
    # risky operations
} CATCH error_type {
    # error handler
}
```
- **Purpose**: Handle errors gracefully
- **Example**:
```assembly
TRY {
    CALL external_api.fetch → data
} CATCH NetworkError {
    CALL cache.get_fallback → data
} CATCH * {
    TRACE "Unknown error occurred"
    HALT
}
```

#### RETRY
```assembly
RETRY count {
    # operations to retry
} WITH_BACKOFF strategy
```
- **Purpose**: Retry operations with backoff
- **Parameters**:
  - `count`: Number of retries
  - `strategy`: exponential, linear, constant
- **Example**:
```assembly
RETRY 3 {
    CALL unstable_api.request → response
} WITH_BACKOFF exponential
```

### Discovery & Introspection

#### LIST_OBJECTS
```assembly
LIST_OBJECTS → result
```
- **Purpose**: List all registered coprocessor classes
- **Example**:
```assembly
LIST_OBJECTS → available_classes
# Result: ["email", "database", "ai_model", "auth"]
```

#### GET_METHODS
```assembly
GET_METHODS object → result
```
- **Purpose**: Get available methods of an object
- **Example**:
```assembly
GET_METHODS db1 → db_methods
# Result: ["store", "retrieve", "update", "delete"]
```

#### GET_HEALTH
```assembly
GET_HEALTH object → result
```
- **Purpose**: Check coprocessor health status
- **Example**:
```assembly
GET_HEALTH email1 → status
# Result: {"status": "healthy", "queue": 0}
```

---

## 🚀 Usage Examples

### Example 1: User Registration with Full SPU
```assembly
# User registration with all features
INSTANTIATE auth auth1
INSTANTIATE database db1
INSTANTIATE email email1

# Validate user data
CALL auth1.validate $user_data → is_valid

IF $is_valid {
    # Parallel operations
    FORK $user_data → [
        db1.store_user,
        email1.send_welcome,
        analytics.track_signup
    ]
    
    JOIN ALL → [stored, sent, tracked]
    
    SET response {"success": true, "user_id": $stored.id}
} ELSE {
    SET response {"success": false, "error": "Invalid data"}
}
```

### Example 2: Request Processing with Retry
```assembly
# Process request with retry logic
INSTANTIATE database db1

SET request_data {
    "collection": "requests",
    "data": {
        "title": "Phare avant Golf 5",
        "partName": "Phare avant",
        "carBrand": "Volkswagen"
    }
}

RETRY 3 {
    TRY {
        CALL db1.store $request_data → result
    } CATCH DatabaseError {
        TRACE "Database error, retrying..."
        WAIT 1000  # Wait 1 second
    }
} WITH_BACKOFF exponential

IF $result.success {
    TRACE "Request stored successfully"
} ELSE {
    THROW PersistenceError "Failed to store request after retries"
}
```

### Example 3: Complex Workflow
```assembly
# Complex multi-step workflow
INSTANTIATE auth auth1
INSTANTIATE database db1
INSTANTIATE email email1
INSTANTIATE ai classifier1

# Step 1: Authenticate
CALL auth1.verify_token $token → user

IF $user.authenticated {
    # Step 2: Classify request
    CALL classifier1.analyze $request → classification
    
    # Step 3: Route based on classification
    IF $classification.priority == "urgent" {
        # Parallel urgent processing
        FORK $request → [
            email1.notify_admin,
            db1.store_urgent,
            sms1.send_alert
        ]
        JOIN ALL → results
    } ELSE {
        # Normal processing
        CALL db1.store $request → stored
        PUSH email1.send_confirmation $user.email
    }
    
    SET response {"success": true, "processed": true}
} ELSE {
    SET response {"success": false, "error": "Unauthorized"}
}
```

---

## 🔧 Implementation Roadmap

### Phase 1: Core Control Flow (Priority High)
1. **IF** - Essential for business logic
2. **WHILE** - Needed for loops

### Phase 2: Async Operations (Priority High)
3. **PUSH** - Start async operations
4. **POP** - Get results
5. **WAIT** - Synchronization

### Phase 3: Parallel Processing (Priority Medium)
6. **FORK** - Parallel execution
7. **JOIN** - Collect results

### Phase 4: Reliability (Priority Medium)
8. **RETRY** - Fault tolerance

### Phase 5: Object Management (Priority Low)
9. **REGISTER** - Dynamic registration
10. **DESTROY** - Cleanup
11. **LIST_OBJECTS** - Discovery
12. **GET_METHODS** - Introspection

### Phase 6: Advanced OOP (Priority Low)
13. **EXTEND** - Inheritance
14. **COMPOSE** - Composition
15. **DELEGATE** - Delegation

---

## 📊 Performance Characteristics

| Instruction | Typical Time | Parallelizable | Cached |
|------------|--------------|----------------|--------|
| INSTANTIATE | 1-5ms | No | Yes |
| CALL | Varies | No | Depends |
| PUSH | 1ms | Yes | No |
| POP | 1ms | No | No |
| SET/GET | <1ms | No | No |
| IF/WHILE | <1ms | No | No |
| FORK | 1ms | Yes | No |
| JOIN | Varies | No | No |
| TRY/CATCH | <1ms | No | No |
| RETRY | Varies | No | No |

---

## 🎯 Key Design Principles

1. **Universal Object Model**: Any computational entity can be a coprocessor
2. **Language Agnostic**: Coprocessors in Rust, Python, Go, or even human interfaces
3. **Async First**: Built for distributed, parallel operations
4. **Fault Tolerant**: Comprehensive error handling and retry mechanisms
5. **Observable**: Full introspection and health monitoring
6. **Simple Yet Powerful**: ~25 instructions can express any computation

---

## 📚 Related Documentation

- [SPU Assembly Specification](./spu_assembly_spec.md) - Full language specification
- [Coprocessor Development](./docs-001/02-architecture/07-coprocessor-architecture.md) - How to build coprocessors
- [Parser Implementation](./src/simple_parser.rs) - Current parser code

---

*Last Updated: 2024-12-20*
*Status: Active Development*
*Version: 2.0.0*