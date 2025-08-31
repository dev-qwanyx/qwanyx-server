# SPU 1.0 - Complete Specification
**The Minimal, Complete, Elegant Instruction Set**

## Overview
SPU 1.0 contains exactly 25 instructions that provide a complete, Turing-complete assembly language for object-oriented distributed computing.

## Implementation Phases

### Phase 1: Core (15 instructions)
Essential instructions for basic operation.

### Phase 2: Completeness (7 instructions)
Instructions that complete the language capabilities.

### Phase 3: Advanced (3 instructions)
Advanced features for production use.

## Complete Instruction Set (25)

### Phase 1: Core Instructions (15)

#### Object Management (2)
1. **INSTANTIATE** class_name instance_id
2. **DESTROY** instance_id

#### Method Invocation (1)
3. **CALL** instance.method args → result

#### Data Operations (3)
4. **SET** var value
5. **GET** path → var
6. **EXPR** expression → result

#### Control Flow (3)
7. **IF** condition { } ELSE { }
8. **WHILE** condition { }
9. **FOREACH** item IN collection { }

#### Error Handling (3)
10. **TRY** { }
11. **CATCH** error_type { }
12. **THROW** type message

#### System (3)
13. **TRACE** message
14. **HALT**
15. **RETURN** value

### Phase 2: Completeness Instructions (7)

#### Async Operations (2)
16. **ASYNC** instance.method args → handle
17. **AWAIT** handle → result

#### Loop Control (2)
18. **BREAK**
19. **CONTINUE**

#### Functions (2)
20. **FUNCTION** name(params) { }
21. **CALL_FN** name args → result

#### Data Helper (1)
22. **LEN** collection → count

### Phase 3: Advanced Instructions (3)

#### Parallel Execution (2)
23. **PARALLEL** { task1 | task2 | task3 } → results
24. **RACE** { task1 | task2 } → first_result

#### Discovery (1)
25. **GET_METHODS** instance → methods

## Instruction Details

### EXPR - The Power Instruction
EXPR evaluates expressions including:
- Math: `"$a + $b"`, `"$x * 2"`, `"$count - 1"`
- Comparisons: `"$x > 5"`, `"$status == 'open'"`, `"$a != $b"`
- Logic: `"$a && $b"`, `"$x || $y"`, `"!$flag"`
- String: `"'Hello ' + $name"`, `"$str.length"`
- Field access: `"$user.email"`, `"$array[$index]"`

### GET - Smart Path Resolution
GET supports:
- Static paths: `user.email`
- Variable paths: `$obj.$field`
- Array indexing: `array[$index]`
- Nested: `$users[$i].address.city`

### FOREACH - Clean Iteration
```assembly
FOREACH request IN $requests {
    # $request is automatically set to current item
    TRACE $request.title
}
```

### PARALLEL - Modern Concurrency
```assembly
PARALLEL {
    CALL email.send $msg1 → r1 |
    CALL sms.send $msg2 → r2 |
    CALL db.store $data → r3
} → results
# results = [r1, r2, r3]
```

## Test Strategy

### Phase 1 Tests
- Basic object lifecycle
- Simple data operations
- Control flow
- Error handling

### Phase 2 Tests
- Async operations
- Function definitions
- Loop control

### Phase 3 Tests
- Parallel execution
- Race conditions
- Method introspection

## Why These 25?

This is the MINIMAL set that can express ANY computation:
- **Turing Complete**: IF + WHILE = any algorithm
- **Modern Async**: ASYNC/AWAIT for non-blocking
- **Error Robust**: Full try/catch/throw
- **Code Reuse**: Functions avoid duplication
- **Parallel Ready**: PARALLEL/RACE for concurrency
- **Data Complete**: GET/SET/EXPR handle all data
- **Debuggable**: TRACE for visibility

Nothing is missing. Nothing is redundant.