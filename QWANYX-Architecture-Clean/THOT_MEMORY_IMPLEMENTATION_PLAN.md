# THOT Memory System Implementation Plan

## Overview
THOT (Digital Human) uses QFlow as a visual representation of memory and brain structure. Each flow is stored as nodes and edges in the DH's MongoDB collection, creating a memory graph (not hierarchical - a true graph with multiple connection types).

## Core Concepts

### 1. Memory Structure
- **Flows are memories**: Each flow represents a memory or thought structure
- **Nodes and edges**: Stored with exact same schema as QFlow visual elements
- **Graph organization**: Non-hierarchical graph where any flow can connect to any other flow
- **Multiple edge types**: Various relationships between flows (contains, references, triggers, precedes, etc.)
- **Collection-based**: Each DH has their own MongoDB collection for memories

### 2. Schema Alignment
```javascript
// Node in QFlow (visual) === Node in Memory (database)
{
  _id: ObjectId,
  x: number,
  y: number,
  type: string,
  data: {
    label: string,
    title: string,  // REQUIRED for memory nodes
    // ... other properties
  }
}

// Edge in QFlow (visual) === Edge in Memory (database)
{
  _id: ObjectId,
  s: ObjectId,  // source
  t: ObjectId,  // target
  ty: string,   // type
  // ... other properties
}
```

## Implementation Steps

### Phase 1: API Endpoints (Python - qwanyx-api)

#### 1.1 Collection Management
```python
# GET /api/dh/{workspace}/{dh_id}/memory/init
# Initialize DH memory collection if doesn't exist
# Creates collection: {workspace}_{dh_id}_memory

# GET /api/dh/{workspace}/{dh_id}/memory/exists
# Check if DH has a memory collection
```

#### 1.2 Root Flow Management
```python
# POST /api/dh/{workspace}/{dh_id}/memory/root
# Create or update the root flow
# Body: { nodes: [...], edges: [...] }
# Auto-creates node with data.title = "root" if not exists

# GET /api/dh/{workspace}/{dh_id}/memory/root
# Retrieve the root flow nodes and edges
```

#### 1.3 Flow Management
```python
# POST /api/dh/{workspace}/{dh_id}/memory/flow
# Create a new flow (memory node)
# Body: { 
#   title: string,       # Required title for the flow
#   nodes: [...],        # Initial nodes
#   edges: [...]         # Initial edges
# }
# Returns: new flow node ID

# GET /api/dh/{workspace}/{dh_id}/memory/flow/{flow_id}
# Retrieve a specific flow's nodes and edges

# PUT /api/dh/{workspace}/{dh_id}/memory/flow/{flow_id}
# Update an existing flow
# Body: { nodes: [...], edges: [...] }

# POST /api/dh/{workspace}/{dh_id}/memory/edge
# Create edge between any two flows
# Body: {
#   source: ObjectId,    # Source flow node
#   target: ObjectId,    # Target flow node
#   type: string,        # Edge type (contains, references, triggers, etc.)
#   metadata: {...}      # Additional edge properties
# }
```

#### 1.4 Memory Graph Navigation
```python
# GET /api/dh/{workspace}/{dh_id}/memory/graph
# Get the entire memory graph structure (all nodes and edges)

# GET /api/dh/{workspace}/{dh_id}/memory/connected/{node_id}
# Get all flows connected to a specific node (incoming and outgoing edges)

# GET /api/dh/{workspace}/{dh_id}/memory/paths/{source_id}/{target_id}
# Find paths between two flow nodes in the graph
```

### Phase 2: QFlow Integration (TypeScript - packages/qwanyx-canvas)

#### 2.1 Save Flow Command
- **Trigger**: Ctrl+S (existing) or save button
- **Action**: 
  1. Check if root exists via API
  2. If not, create root flow with title "root"
  3. Save current flow nodes/edges to memory

#### 2.2 Create Connected Flow (Shift+Double-Click)
- **Trigger**: Shift+Double-click on any node
- **Action**:
  1. Get clicked node ID (source)
  2. Create new memory node with required title (prompt user)
  3. Create edge: source → new memory node (default type: "contains")
  4. Open new blank flow for editing
  5. Auto-save the connection

#### 2.3 Create Multiple Connections
- **Ctrl+L with flows selected**: Create edges between selected flow nodes
- **Different edge types**: User can specify relationship type (references, triggers, precedes, etc.)
- **Bidirectional edges**: Option to create edges in both directions

#### 2.4 Navigate Memory Graph
- **Visual indicators**: Nodes with connections show special icon/badge
- **Navigation**: Double-click to load any connected flow
- **Graph view**: Show the entire memory graph structure
- **Path highlighting**: Show connection paths between flows

### Phase 3: Data Flow

#### 3.1 Initial Save (Root Creation)
```
User opens DH editor → QFlow loads empty
User creates nodes/edges → Presses save
API checks: No root exists
API creates: 
  - Collection {workspace}_{dh_id}_memory
  - Root node with title="root"
  - Saves all current nodes/edges
```

#### 3.2 Connected Flow Creation
```
User Shift+double-clicks node (ID: abc123)
Prompt: "Enter flow title"
User enters: "Decision Logic"
API creates:
  - New node with title="Decision Logic"
  - Edge from abc123 → new node (type: "contains")
  - Empty flow ready for content
Editor switches to new flow view
```

#### 3.3 Multiple Edge Creation
```
User selects multiple flow nodes
User presses Ctrl+L
Prompt: "Select edge type" (contains, references, triggers, etc.)
API creates edges between selected nodes
Graph updates to show new connections
```

#### 3.4 Memory Graph Traversal
```
User double-clicks any connected flow node
API fetches target flow content
Editor loads flow nodes/edges
Navigation history maintained (can go back/forward)
Graph view shows current position
```

## Database Structure

### Collections
```
{workspace}_{dh_id}_memory
├── nodes collection
│   ├── root node (title: "root")
│   ├── flow nodes (title: required)
│   └── regular nodes within flows
└── edges collection
    ├── inter-flow connections (between flow nodes)
    └── intra-flow connections (within a single flow)
```

### Node Document (Memory)
```json
{
  "_id": ObjectId,
  "x": 100,
  "y": 200,
  "type": "flow",
  "data": {
    "title": "Decision Logic",  // REQUIRED for memory nodes
    "label": "Decision Logic",
    "description": "Handles decision tree",
    "created": ISODate,
    "modified": ISODate,
    "flowContent": {
      "nodes": [...],  // Nested flow's nodes
      "edges": [...]   // Nested flow's edges
    }
  }
}
```

### Edge Document (Memory Relationship)
```json
{
  "_id": ObjectId,
  "s": ObjectId("source_flow_id"),
  "t": ObjectId("target_flow_id"),
  "ty": "contains | references | triggers | precedes | relates",
  "m": {
    "l": "Connection label",
    "d": "Relationship description",
    "strength": 0.8,  // Connection strength (0-1)
    "bidirectional": false
  }
}
```

### Edge Types in Memory Graph
- **contains**: Flow contains sub-flow (default for Shift+double-click)
- **references**: Flow references another for information
- **triggers**: Flow triggers execution of another
- **precedes**: Flow comes before another in sequence
- **relates**: General relationship between flows
- **contradicts**: Flows have conflicting information
- **supports**: Flow provides evidence for another

## UI/UX Considerations

### Visual Feedback
- **Flow nodes**: Special styling/icon to indicate they are flows (memories)
- **Edge types**: Different colors/styles for different relationship types
- **Connection count**: Badge showing number of connections
- **Active flow**: Highlight current flow in graph view
- **Unsaved changes**: Visual indicator when flow differs from saved version

### User Interactions
1. **Save**: Ctrl+S saves to current flow location
2. **Create connected flow**: Shift+double-click prompts for title
3. **Navigate**: Double-click to enter any connected flow
4. **Create edges**: Select flows + Ctrl+L to connect
5. **Graph view**: Toggle between flow edit and graph view
6. **Back/Forward**: Navigate through flow history

### Error Handling
- Collection doesn't exist → Auto-create
- Root doesn't exist → Auto-create with title="root"
- Network errors → Retry with exponential backoff
- Validation errors → Clear user feedback

## Technical Requirements

### API (Python)
- Endpoint structure: `/api/dh/{workspace}/{dh_id}/memory/*`
- Authentication: Workspace-aware JWT
- Database: MongoDB with proper indexing
- Response format: Consistent JSON structure

### Frontend (TypeScript)
- State management: Track current flow path
- Caching: Local storage for offline capability
- Validation: Title required for memory nodes
- Performance: Lazy load large memory graphs

## Success Metrics
- ✅ Root flow creation works
- ✅ Connected flow creation via Shift+double-click
- ✅ Multiple edge types between flows
- ✅ Memory graph navigation (non-hierarchical)
- ✅ Save/load maintains node positions
- ✅ Complex graph relationships preserved
- ✅ Multiple DH isolation (workspace-aware)
- ✅ Bidirectional and circular connections supported

## Next Steps
1. Implement Python API endpoints for graph operations
2. Add flow node type indicator in QFlow
3. Implement Shift+double-click handler
4. Add graph visualization view
5. Implement edge type selection UI
6. Test with complex graph structures
7. Add graph query capabilities (shortest path, related flows, etc.)

## Key Differences from Hierarchical Model
- **No parent-child limitation**: Any flow can connect to any other
- **Multiple connection types**: Rich relationships between memories
- **Circular references allowed**: Memories can reference each other
- **Graph traversal**: Navigate via any edge, not just parent-child
- **No depth limitation**: Graph can have any structure

## Questions to Resolve
1. Should flow content be embedded in node.data.flowContent or stored separately?
2. What are all the edge types we want to support?
3. Should we implement memory versioning/history?
4. How to visualize complex graph structures effectively?
5. Should deleted flows be soft-deleted or permanently removed?
6. How to handle conflicting or contradicting memories?