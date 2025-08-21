# THOT System Memorandum
## The Complete Architecture of Digital Humans in QWANYX

---

## 🧠 What is THOT?

THOT is the **Digital Human system** that powers all autonomous agents in the QWANYX ecosystem. Every Digital Human (DH) is based on THOT.

---

## 📋 How Digital Humans Are Already Structured

### 1. Identity & Creation
Digital Humans are created through the dashboard with:
```typescript
{
  _id: "unique-mongodb-id",
  email: "support@autodin.com",  // Unique identifier
  name: "Support Agent",
  firstName: "John",
  type: "DH",
  system: "THOT",
  workspace: "autodin",  // Multi-tenant isolation
  active: true,
  created: Date
}
```

**KEY POINT:** DH identity already exists when we reach the flow editor. We don't create DHs in the flow - we configure their behavior.

### 2. Memory System
Each DH has its own dedicated MongoDB memory collection:
- Collection name: `thot-support-autodin-com-memory` (derived from email)
- This collection stores ALL the DH's knowledge, experiences, and configuration

Memory types already defined:
- **CONFIG**: Settings, credentials, templates
- **CONVERSATION**: Past interactions
- **TASK**: Things to do
- **KNOWLEDGE**: Learned information
- **EXPERIENCE**: Past events and outcomes

**KEY POINT:** Memory already exists and is persistent. The flow doesn't create memory - it uses and updates it.

### 3. The Flow's Role
The QFlow visual editor is for:
- **Configuring** how the DH processes information
- **Defining** triggers and actions
- **Visualizing** the DH's decision logic

**The flow IS the configuration** - when we add nodes, we're defining the DH's capabilities.

---

## 🔄 How THOT Actually Works

### Current Implementation
1. **DH Lives in the API** (`api/qwanyx-api/services/dh_service.py`)
   - Manages memory collections
   - Handles conversations
   - Updates context
   - Processes tasks

2. **Frontend Shows DH Status** (`packages/qwanyx-thot/`)
   - Lists Digital Humans
   - Shows statistics
   - Provides configuration UI
   - Visual flow editor (QFlow)

3. **Memory is Persistent**
   - Each DH has dedicated MongoDB collections
   - Memory survives across sessions
   - Can be queried and updated by the DH

### What We're Building Now
We're adding **executable nodes** to make DHs autonomous:

```
Current State:              →    Future State:
DH exists with identity          DH exists with identity
DH has memory                    DH has memory
DH configured manually      →    DH configured via flow nodes
Manual email processing     →    Automatic IMAP listening
Manual responses           →    Autonomous decision-making
```

---

## 🎯 The Path Forward

### 1. Nodes Define Capabilities
When we create nodes in the flow, we're defining WHAT the DH can do:
- **Email Trigger Node** → DH can listen to emails
- **Analyze Node** → DH can understand content
- **Response Node** → DH can generate replies

### 2. Nodes Use Existing Context
Every node has access to:
- DH identity (`dhId`, `email`, `workspace`)
- DH memory (read/write to memory collection)
- Execution context (current trigger, variables)

### 3. Configuration Emerges from Flow
We don't need a separate configuration schema. The flow IS the configuration:
- Nodes = Capabilities
- Edges = Decision paths
- Node settings = Configuration

---

## ⚠️ Important Reminders

### DO:
- ✅ Use the existing DH identity from the dashboard
- ✅ Store node data in the DH's existing memory collection
- ✅ Make nodes that execute real actions
- ✅ Keep nodes context-aware (workspace, user, DH)

### DON'T:
- ❌ Create new DH schemas (already exists)
- ❌ Create new identity systems (use existing)
- ❌ Duplicate memory storage (use existing collections)
- ❌ Over-engineer before testing simple cases

---

## 🏗️ Architecture Summary

```
┌─────────────────────────────────────────────┐
│           THOT System (API)                 │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │     Digital Human Instance          │    │
│  │  - Identity (from dashboard)        │    │
│  │  - Memory (MongoDB collection)      │    │
│  │  - Configuration (from flow)        │    │
│  └─────────────────────────────────────┘    │
│                    ↕                         │
│  ┌─────────────────────────────────────┐    │
│  │     Execution Engine                │    │
│  │  - Runs nodes from flow             │    │
│  │  - Updates memory                   │    │
│  │  - Handles triggers                 │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
                     ↕
┌─────────────────────────────────────────────┐
│         Frontend (Optional)                 │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │     DH Dashboard                    │    │
│  │  - Create/List DHs                  │    │
│  │  - View statistics                  │    │
│  └─────────────────────────────────────┘    │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │     Flow Editor (QFlow)             │    │
│  │  - Visual configuration             │    │
│  │  - Node creation                    │    │
│  │  - Testing interface                │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

---

## 📝 Next Steps

1. **Create executable nodes** that use existing DH identity/memory
2. **Build simple IMAP listener** as first process
3. **Test with answering machine** use case
4. **Let configuration emerge** from actual usage

---

**Remember:** THOT is already built. We're just making it autonomous by adding executable nodes to the flow.