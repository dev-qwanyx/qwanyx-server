# QWANYX Memory Structure - Universal Memory Nodes

## Core Principle
**EVERYTHING is a memory node** - columns, cards, DHs, users, websites - all are memories in the same structure.

## Base Memory Node Structure

```javascript
{
  _id: ObjectId(),           // MongoDB auto-generated
  uuid: "unique-identifier",  // Our UUID for cross-platform
  p: "parent-uuid",           // Parent node UUID (null for root)
  
  // Core Memory Properties
  title: "Memory title",
  brief: "Short description",
  created: ISODate(),         // Creation timestamp
  lastAccess: ISODate(),      // Last accessed (critical for memory search)
  
  // Memory Type & Content
  type: "column|card|dh|user|website|...",
  icon: "fa-pen",             // Visual representation
  content: {},                // Flexible content based on type
  
  // DH Family Tree
  lineage: "adam-uuid",       // The Adam (website) of this lineage
  generation: 0,              // Generation number from Adam
  
  // Metadata
  owner: "user-uuid",         // Who owns this memory
  workspace: "workspace-id",   // Which workspace/context
  permissions: {},            // Access control
  tags: [],                   // Searchable tags
}
```

## Memory Hierarchy Examples

### Website (Adam) Node
```javascript
{
  uuid: "autodin-uuid",
  p: "qwanyx-uuid",          // QWANYX is parent
  title: "Autodin",
  brief: "Automotive marketplace Digital Human",
  type: "website-dh",
  lineage: "autodin-uuid",   // Self - is the Adam
  generation: 0,             // First generation
}
```

### User's Personal DH Node
```javascript
{
  uuid: "john-dh-uuid",
  p: "qwanyx-uuid",          // Child of QWANYX
  title: "John's Personal DH",
  brief: "Personal assistant for John",
  type: "user-dh",
  lineage: "qwanyx-uuid",    // QWANYX lineage
  generation: 1,
  owner: "john-user-uuid",
}
```

### Column Node (in dashboard)
```javascript
{
  uuid: "column-1-uuid",
  p: "dashboard-uuid",       // Parent is the dashboard
  title: "Voice Notes",
  brief: "Audio memories collection",
  type: "column",
  icon: "fa-microphone",
  lastAccess: ISODate(),     // Updated when viewed/modified
}
```

### Card Node (memory item)
```javascript
{
  uuid: "card-1-uuid",
  p: "column-1-uuid",        // Parent is the column
  title: "Meeting recording",
  brief: "Team standup 2025-08-09",
  type: "card",
  icon: "fa-microphone",
  content: {
    audio_url: "...",
    transcript: "...",
    duration: 180
  },
  lastAccess: ISODate(),     // Updated when played/read
}
```

### Nested Column (grouped memories)
```javascript
{
  uuid: "nested-column-uuid",
  p: "column-1-uuid",        // Parent is another column
  title: "Project Alpha",
  brief: "Grouped project memories",
  type: "column",
  icon: "fa-users",
  // Contains child cards
}
```

## Key Insights

### 1. Unified Structure
- No separate schemas for different entities
- Everything follows the same memory pattern
- Enables infinite nesting and relationships

### 2. Parent-Child Simplicity
- Single `p:` field creates entire tree
- Easy traversal up/down the hierarchy
- Natural representation of DH families

### 3. Memory-Centric Design
- `lastAccess` enables intelligent retrieval
- DHs can prioritize recent/relevant memories
- Natural forgetting (old, unaccessed memories fade)

### 4. Lineage Tracking
- Every node knows its Adam (original ancestor)
- Generation tracking for family tree visualization
- Inheritance of traits through lineage

## MongoDB Queries

### Find all children of a node
```javascript
db.memories.find({ p: "parent-uuid" })
```

### Get entire lineage tree
```javascript
db.memories.find({ lineage: "adam-uuid" })
```

### Find recently accessed memories
```javascript
db.memories.find({ owner: "user-uuid" })
  .sort({ lastAccess: -1 })
  .limit(10)
```

### Get memory with ancestors
```javascript
// Recursive lookup to build full path
db.memories.aggregate([
  { $match: { uuid: "target-uuid" } },
  { $graphLookup: {
      from: "memories",
      startWith: "$p",
      connectFromField: "p",
      connectToField: "uuid",
      as: "ancestors"
  }}
])
```

## Advantages

1. **Infinite Scalability**: Tree structure scales naturally
2. **Simple Queries**: Parent-child makes traversal easy
3. **Memory Intelligence**: lastAccess enables smart retrieval
4. **Unified Model**: One structure for everything
5. **Natural Organization**: Mimics how human memory works

## Future Extensions

- `decay`: Memory strength over time
- `associations`: Links between non-parent memories
- `embeddings`: Vector representations for semantic search
- `emotions`: Emotional context of memories
- `confidence`: How certain the DH is about this memory

---

*"Everything is a memory, and memories form families."*