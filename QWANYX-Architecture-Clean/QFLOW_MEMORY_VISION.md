# QFlow: The Brain Editor for Digital Humans
*Date: August 22, 2024*

## 🧠 Core Concept: QFlow IS the Brain Editor

**QFlow is THE brain editor for Digital Humans.**

It's a workflow tool, a memory editor, a visual programming language, and more. It's everything because it directly edits the DH's brain structure.

When a user creates a graph in QFlow, they are directly editing the DH's brain. The graph IS the brain. The nodes and edges ARE the neurons and synapses.

## 🎯 The Vision

### For Regular Users
- Use QFlow to create workflows, pages, automations
- Design any visual representation they need
- All stored in their personal DH's brain
- The DH executes these workflows and learns from them

### For Superusers
- Create dynamic graphs where components represent:
  - Data structures the DH will use
  - Functions the DH will execute
  - Thinking patterns the DH will follow
  - Decision trees the DH will navigate

## 📐 QFlow as a Universal Visual Language

QFlow is a **universal visual programming language** that:
- Can be a workflow editor
- Can be a memory structure
- Can be a thinking pattern
- Can be an automation builder
- Can model anything: thoughts, processes, data, relationships, workflows, pages
- Has minimal primitives: **nodes** and **edges**
- These primitives can represent ANYTHING

### What a Node Can Be
- A workflow step
- A thought
- A memory
- A function
- A data point
- A decision
- A question
- An action
- A concept
- A UI component
- An API call
- A trigger
- A camera feed (webcam, security camera)
- A sensor (temperature, motion, sound)
- A phone connection
- A voice generator
- A real-time data stream
- An IoT device
- Literally ANYTHING that can connect

### What an Edge Can Be
- A workflow transition
- A relationship
- A data flow
- A thought connection
- A causal link
- A temporal sequence
- A logical implication
- An emotional association
- A trigger condition
- Any type of connection

## 🚀 Development Philosophy

### Start Minimal, Build Gradually
1. **One node at a time**: Each node is a new capability
2. **Extreme caution**: Never break what works
3. **Gradual emergence**: The DH gains power as nodes accumulate
4. **No presumptions**: Don't assume what nodes should do
5. **Everything is possible**: The tool to do EVERYTHING is already here!

### The Path Forward
```
Today: Basic nodes (data, display)
Tomorrow: Connection nodes (APIs, databases)
Next Week: Smart nodes (AI analysis, decisions)
Next Month: Physical nodes (cameras, sensors)
Next Quarter: Real-time nodes (streams, live processing)
Next Year: Network of interconnected DH brains
Future: Complete digital-physical integration
```

**THE TOOL IS ALREADY HERE!** We just need to add nodes one by one, and the possibilities are INFINITE.

## 🏗️ Technical Architecture

### Workspace-Aware Flat Storage

**CRITICAL CONCEPT**: Everything is stored FLAT in the DH's memory collection.

```javascript
// QFlow receives workspace from JWT token
const { workspace, user, token } = useAuth();
// workspace determines which MongoDB database to use

// Storage location
const dhEmail = "jarvis@qwanyx.com";
const collectionName = dhEmail.replace('@', '-').replace('.', '-');
// Result: autodin/jarvis-qwanyx-com/
```

### Storage Structure (Current Implementation)
```
autodin/jarvis-qwanyx-com/      # DH's brain collection
├── flow_001                    # A flow (contains nodes and edges inside)
├── flow_002                    # Another flow 
├── flow_003                    # Flow that references another flow
└── ...                         # Each flow is a document
```

**Key Storage Principles**:
1. **Flows are stored, not individual nodes/edges**: Currently, we store complete flows as documents
2. **QFlow is just the component**: "QFlow" is the React component that renders flows
3. **Flows contain their nodes and edges**: Each flow document contains its nodes and edges arrays
4. **Flow nodes can reference other flows**: A node of type "flow" can link to another flow document
5. **Workspace isolation**: Each workspace has completely separate MongoDB database

### What Gets Stored
```javascript
// A flow document in memory
{
  _id: "flow_email_automation",
  type: "flow",
  name: "Email Automation",
  nodes: [
    { _id: "n1", x: 100, y: 100, type: "icon", data: {...} },
    { _id: "n2", x: 300, y: 100, type: "step", data: {...} },
    { _id: "n3", x: 500, y: 100, type: "icon", data: { 
      nodeType: "flow",
      flowRef: "flow_nested_process"  // References another flow
    }}
  ],
  edges: [
    { _id: "e1", s: "n1", t: "n2", ty: "data" },
    { _id: "e2", s: "n2", t: "n3", ty: "control" }
  ]
}
```

### Flow References (Flow Nodes)
```javascript
// A node that references another flow
{
  _id: "n_flow_ref",
  type: "icon",
  x: 100,
  y: 200,
  data: {
    label: "Email Subprocess",
    nodeType: "flow",
    flowRef: "flow_email_subprocess"  // Points to another flow document
  }
}

// When clicked, QFlow component loads the referenced flow
// This allows modular composition without nesting
```

### QFlow Node Schema (Exact Structure)
```typescript
interface QNode {
  _id: string | ObjectId      // Unique identifier
  x: number                    // X position on canvas
  y: number                    // Y position on canvas
  type: 'icon' | 'step' | 'decision'  // Node visual type
  brief?: string             // Brief description (optional)
  data: {
    label: string              // Display label
    icon?: string              // Icon name (optional)
    color?: string             // Node color (optional)
    nodeType?: string          // Special types like 'start-stop'
    isRunning?: boolean        // For start-stop nodes
    [key: string]: any         // Additional properties allowed
  }
}
```

### QFlow Edge Schema (Exact Structure)
```typescript
interface QEdge {
  _id: string | ObjectId      // Unique identifier
  s: string | ObjectId        // Source node ID
  t: string | ObjectId        // Target node ID
  ty?: 'data' | 'control' | 'temporal' | 'causal' | 'semantic'  // Edge type
  w?: number                  // Weight (0-1)
  d?: Date                    // Deadline when the edge needs to be deleted
  dc?: number                 // Decay rate
  l?: number                  // Lifespan (ms)
  st?: {                      // Style
    c?: string                // Color
    th?: number               // Thickness
    p?: 'solid' | 'dashed' | 'dotted'  // Pattern
    a?: boolean               // Animated
  }
}
```

### Key Schema Design Principles

1. **Compact Property Names**: 
   - `s` = source, `t` = target, `ty` = type, `w` = weight
   - `d` = deadline, `dc` = decay, `l` = lifespan
   - `st` = style
   - Optimized for MongoDB storage and network transfer

2. **Temporal Properties at Root Level** (CRITICAL):
   - `d` (deadline): When the edge expires and should be deleted
   - `dc` (decay): How the edge weakens over time
   - `l` (lifespan): How long the edge lives
   - **Why at root?** Easy MongoDB queries like: `{ d: { $lt: new Date() } }` to find expired edges
   - Enables automatic cleanup: Delete all edges past their deadline
   - Supports time-based thinking patterns and temporary connections

3. **Edge Types**: 
   - `data`: Information flow
   - `control`: Execution flow
   - `temporal`: Time-based relationships
   - `causal`: Cause-effect relationships
   - `semantic`: Meaning relationships

4. **Node Types**:
   - `icon`: Visual node with icon (can be complex components like UserProfile, DhMainSwitch, etc.)
   - `step`: Process or action step
   - `decision`: Conditional branching
   - **Note**: The `icon` type isn't limited to simple icons - it can render full React components

5. **Flexible Data**: The `data` object can contain ANY properties needed for specific node types
   - For UserProfile nodes: `{ avatar, name, email, role }`
   - For DhMainSwitch nodes: `{ dhId, dhName, dhEmail, isRunning }`
   - For Camera nodes: `{ source, resolution, fps }`
   - Literally ANY data structure needed by the component
   
**IMPORTANT**: The brain can AND WILL have sophisticated visual representations! QFlow nodes are not limited to simple icons - they ARE full React components with rich interactivity.

### Graph Example: Real Email Workflow
```javascript
{
  nodes: [
    { 
      _id: "507f1f77bcf86cd799439011",
      x: 100, 
      y: 100, 
      type: "icon",
      data: { 
        label: "Email Trigger", 
        icon: "email",
        nodeType: "email-trigger",
        emailAccount: "support@autodin.com"
      }
    },
    { 
      _id: "507f1f77bcf86cd799439012",
      x: 300, 
      y: 100, 
      type: "step",
      data: { 
        label: "AI Analysis",
        brief: "Analyze urgency and sentiment",
        model: "gpt-4",
        prompts: ["Check urgency", "Detect sentiment"]
      }
    },
    { 
      _id: "507f1f77bcf86cd799439013",
      x: 500, 
      y: 100, 
      type: "decision",
      data: { 
        label: "Urgent?",
        condition: "urgency > 0.7"
      }
    },
    {
      _id: "507f1f77bcf86cd799439014",
      x: 700,
      y: 50,
      type: "step",
      data: {
        label: "Immediate Reply",
        nodeType: "action",
        action: "send_email",
        template: "urgent_response"
      }
    },
    {
      _id: "507f1f77bcf86cd799439015",
      x: 700,
      y: 150,
      type: "step",
      data: {
        label: "Schedule Reply",
        nodeType: "action",
        action: "schedule_email",
        delay: 3600000  // 1 hour in ms
      }
    }
  ],
  edges: [
    {
      _id: "607f1f77bcf86cd799439001",
      s: "507f1f77bcf86cd799439011",
      t: "507f1f77bcf86cd799439012",
      ty: "data",
      m: { 
        l: "email content",
        tr: "extractEmailData"  // Transform function
      }
    },
    {
      _id: "607f1f77bcf86cd799439002",
      s: "507f1f77bcf86cd799439012",
      t: "507f1f77bcf86cd799439013",
      ty: "control",
      w: 1.0,  // High priority edge
      m: { 
        l: "analysis results",
        d: "Carries urgency and sentiment scores"
      }
    },
    {
      _id: "607f1f77bcf86cd799439003",
      s: "507f1f77bcf86cd799439013",
      t: "507f1f77bcf86cd799439014",
      ty: "control",
      m: { 
        l: "YES",
        c: "urgency > 0.7"  // Condition
      },
      st: {
        c: "#ff0000",  // Red for urgent path
        th: 3,
        a: true  // Animated
      }
    },
    {
      _id: "607f1f77bcf86cd799439004",
      s: "507f1f77bcf86cd799439013",
      t: "507f1f77bcf86cd799439015",
      ty: "control",
      m: { 
        l: "NO",
        c: "urgency <= 0.7"
      },
      tm: {
        dl: 1000  // 1 second delay before execution
      }
    }
  ]
}

## ⚠️ Critical Principles

### 1. No Assumptions
- Don't presume what QFlow should do
- Don't limit node types artificially
- Don't constrain edge meanings
- Let usage patterns emerge naturally

### 2. Extreme Stability
- Every new node must not break existing ones
- Test each addition thoroughly
- Rollback capability for every change
- Version control for graph structures

### 3. Gradual Complexity
- Start with the simplest possible nodes
- Add complexity only when proven stable
- Each node adds one small capability
- Complex behaviors emerge from simple interactions

## 🎯 Immediate Next Steps

### Phase 1: Foundation Nodes (This Week)
1. **Data Node**: Store a piece of information
2. **Link Node**: Connect two data points
3. **Display Node**: Show data visually

### Phase 2: Interactive Nodes (Next Week)
4. **Input Node**: Accept user input
5. **Transform Node**: Modify data
6. **Condition Node**: Make simple decisions

### Phase 3: Memory Nodes (Following Week)
7. **Memory Store Node**: Save to DH memory
8. **Memory Recall Node**: Retrieve from memory
9. **Pattern Node**: Recognize patterns

## 🔮 The Unlimited Potential

QFlow has NO LIMITS. It can connect:
- **Physical World**: Cameras, sensors, IoT devices, smart homes
- **Digital World**: APIs, databases, cloud services, AI models
- **Communication**: Phones, SMS, voice calls, video calls
- **Real-time Processing**: Live video, audio streams, data feeds
- **Automation**: Business processes, home automation, security systems
- **Learning**: Pattern recognition, behavior adaptation, decision improvement

Eventually, QFlow graphs will:
- BE the DH's entire brain
- Control physical devices and digital services
- Process real-time data from any source
- Enable non-programmers to build complex systems visually
- Create interconnected networks of DH brains
- Execute any conceivable automation
- Learn and evolve from every interaction

### Real-World Examples
- **Home Security**: Camera → Motion Detection → Phone Alert → Voice Message
- **Business Automation**: Email → Analysis → CRM Update → Task Creation → Team Notification
- **Health Monitoring**: Wearable → Vital Signs → Anomaly Detection → Doctor Alert → Emergency Call
- **Smart Agriculture**: Weather API → Soil Sensors → Irrigation Control → Crop Analysis → Market Pricing

## ⚡ The Power of the Visual Brain

Traditional AI: Hidden neural networks, black box thinking
QFlow DH: Visual, inspectable, modifiable brain

The user can literally SEE how their DH thinks, what workflows it runs, and directly modify its brain by editing the graph. It's simultaneously:
- A workflow automation tool
- A visual programming language
- A cognitive structure editor
- A memory management system
- All in one unified interface

## 🛡️ Safety First

Before adding ANY new node:
1. Document its exact purpose
2. Test in isolation
3. Test with existing nodes
4. Verify memory storage works
5. Ensure rollback is possible
6. Get user approval

Never rush. Never assume. Always test.

---

*QFlow is the brain editor with UNLIMITED potential. Connect cameras, phones, sensors, APIs, AI, databases - ANYTHING. The tool to do EVERYTHING is already here. We just start modest and build gradually, but the sky is NOT the limit - there are NO limits!*