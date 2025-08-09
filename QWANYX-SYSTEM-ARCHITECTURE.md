# QWANYX System Architecture - Complete Reference

## Table of Contents
1. [Core Philosophy](#core-philosophy)
2. [Data Architecture](#data-architecture)
3. [Database Rules](#database-rules)
4. [DH System Design](#dh-system-design)
5. [User Experience](#user-experience)
6. [Technical Implementation](#technical-implementation)
7. [Privacy & Ownership](#privacy--ownership)
8. [Development Rules](#development-rules)

---

## Core Philosophy

### The Zero-Hour Work Week
```
Traditional: Work 40-80 hours → Live with what's left
QWANYX: DH works → Human creates and explores → 168 hours of life
```

**Humans focus on:**
- Creation (art, building, designing)
- Exploration (travel, learning, discovering)
- Connection (meaningful relationships)

**DHs handle:**
- Administration (bills, taxes, scheduling)
- Communication filtering (spam, routine emails)
- Data organization (filing, sorting, searching)
- Routine decisions (based on learned patterns)

### Anti-Platform Principles
| Traditional Platform | QWANYX |
|---------------------|---------|
| Apps own data | Documents own themselves |
| Platform owns identity | Users own identity via ObjectId |
| Vendor lock-in | Complete portability |
| Surveillance capitalism | Privacy by design |
| App store taxes (30%) | PWA - no middleman |
| Fake social connections | Purpose-driven connections |

---

## Data Architecture

### Universal Structure
**EVERY entity (website, user, DH) has identical database structure:**

```
Database Name: [workspace].users.[username]@[domain]
Examples:
- qwanyx.users.adam@qwanyx.com      (QWANYX master DH)
- autodin.users.adam@autodin.be     (Autodin admin DH)
- autodin.users.john@gmail.com      (John's personal DH)
```

### Database Collections
```javascript
Database: [workspace].users.[username]@[domain]
├── memories/               // All memory nodes (THE core collection)
├── edges/                  // Non-parent relationships
└── qwanyx/                // Standard QWANYX structure
    ├── identity           // ObjectId + email history
    ├── profile            // Extensive user/DH profile
    ├── preferences        // UI settings, themes
    ├── firmware           // DH behavioral patterns
    ├── connections        // Links to other DHs/websites
    └── lineage           // Family tree position
```

### Memory Node Structure (UNIVERSAL)
```javascript
{
  _id: ObjectId("..."),      // 12 bytes: THE identity + free timestamp
  p: ObjectId("..."),        // Parent's _id (null for root)
  
  // Required fields
  type: "column|card|chat|dh|user|website",
  
  // Content
  title: "...",              // Optional for some types (like chat)
  brief: "...",              // Optional
  content: {},               // Flexible based on type
  
  // Tracking
  lastAccess: ISODate(),     // Only if ms precision needed
  
  // Soft delete
  deleted: false,
  deletedAt: null,
  
  // Relationships (ALL use ObjectId)
  from: ObjectId("..."),     // For messages/edges
  to: ObjectId("..."),       // For messages/edges
  owner: ObjectId("..."),    // Who owns this
  
  // NO created field - use _id.getTimestamp()
  // NO uuid field - _id IS our UUID
}
```

---

## Database Rules

### CRITICAL: ObjectId is Everything

**What ObjectId gives us for FREE:**
- **Unique identity** (across universe)
- **Creation timestamp** (second precision)
- **Natural sorting** (chronological)
- **Efficient storage** (12 bytes only)
- **Sharding ready** (distributed systems)

### Absolute Rules

```javascript
// RULE 1: ObjectId for ALL relationships
{
  p: ObjectId("..."),        // NEVER use strings
  from: ObjectId("..."),     // NEVER use emails
  owner: ObjectId("..."),    // NEVER use usernames
}

// RULE 2: Query by _id or indexed fields
db.memories.find({ _id: ObjectId("...") })      // Perfect
db.memories.find({ p: ObjectId("...") })        // Perfect
db.memories.find({ type: "chat" })              // Indexed

// RULE 3: Indexes (CRITICAL for performance)
db.memories.createIndex({ p: 1 })
db.memories.createIndex({ type: 1 })
db.memories.createIndex({ deleted: 1 })
db.memories.createIndex({ from: 1, to: 1 })    // Compound for messages

// RULE 4: Get timestamp from _id
const created = ObjectId("...").getTimestamp()  // Don't store separately

// RULE 5: Soft delete with tree
When deleting: Mark parent + ALL descendants as deleted
When restoring: Only restore the specific item (not children)
```

### Data Consistency Rules

1. **Parent MUST exist** (except root nodes where p: null)
2. **Deleted items filtered by default** (deleted: false in queries)
3. **Edges follow deletions** (delete node = delete its edges)
4. **No orphans** (if parent permanent deleted, children go too)
5. **Workspace isolation** (never query across databases)

---

## DH System Design

### DH Identity
```javascript
// In qwanyx.identity collection
{
  _id: ObjectId("..."),           // The DH's identity
  current_email: "john@gmail.com", // Can change
  previous_emails: [],            // History
  type: "user|admin|system",      // DH role
  workspace: "autodin",            // Current assignment
}
```

### DH as Gatekeeper
```javascript
// DH processes ALL incoming communications
{
  _id: ObjectId("..."),
  type: "gatekeeper_rule",
  p: ObjectId("dh-config"),
  pattern: "cold_contact",
  action: {
    evaluate_purpose: true,
    check_reputation: true,
    require_context: true,
    auto_response: "Please state your business purpose"
  }
}
```

### DH Memory Types
```javascript
// Process memories (learned behaviors)
{
  type: "process",
  title: "evaluate_inventor_claim",
  steps: [...],
  success_rate: 0.73
}

// Connection memories
{
  type: "connection",
  from: ObjectId("user"),
  to: ObjectId("website"),
  established: _id.getTimestamp()
}

// Decision memories
{
  type: "decision",
  context: "user_wanted_mechanic",
  action_taken: "connected_to_paul",
  outcome: "successful"
}
```

---

## User Experience

### Dashboard Interface
- **Columns**: Represent contexts/projects/DHs
- **Cards**: Individual memories/tasks/notes
- **Drag & Drop**: One finger operation only
- **Nested Columns**: Represent hierarchies/groupings
- **11 Input Types**: pen, microphone, camera, comment, envelope, graduation-cap, address-book, users, project-diagram, robot, search

### PWA Implementation
```javascript
// Manifest.json critical settings
{
  "display": "standalone",      // No browser UI
  "orientation": "portrait",     // Mobile first
  "start_url": "/dashboard",     // Direct to workspace
}

// Service Worker caching
- Cache dashboard shell
- Sync memories when online
- Work fully offline
```

### User Journey
1. **Login once** → Get ObjectId identity
2. **Access all workspaces** → Same ObjectId everywhere
3. **Create memories** → Drag, drop, organize
4. **DH processes** → Automatic organization
5. **Zero work** → DH handles administration

---

## Technical Implementation

### API Design
```javascript
// ALL endpoints use ObjectId
POST /api/memory
{
  p: "507f1f77bcf86cd799439011",    // Parent ObjectId as string
  type: "card",
  content: {...}
}

// NEVER expose emails in URLs
WRONG: /api/user/john@gmail.com
RIGHT: /api/user/507f1f77bcf86cd799439011

// Workspace from session
req.workspace = "autodin"  // From domain or auth
req.userId = ObjectId("...") // From session
```

### Frontend Rules
```javascript
// Store ObjectId locally
localStorage.setItem('user_id', objectIdString)

// Never store sensitive data
WRONG: localStorage.setItem('email', 'john@gmail.com')
RIGHT: // Email only from secure API call when needed

// Memory references
memory.p = parentObjectId  // Always ObjectId
memory.from = userObjectId // Always ObjectId
```

### Session Management
```javascript
// Session contains
{
  userId: ObjectId("..."),        // User's _id
  workspace: "autodin",           // Current workspace
  dhId: ObjectId("..."),         // User's DH _id
  // NO email in session - fetch when needed
}
```

---

## Privacy & Ownership

### Data Ownership Rules
1. **User owns their database** - Full export rights
2. **Workspace isolation** - No cross-workspace access
3. **Relationships are mutual** - Both parties must consent
4. **Messages are owned by sender** - Can't export others' messages
5. **DHs respect boundaries** - Can't access without permission

### Privacy Implementation
```javascript
// User can export THEIR content
exportable = {
  my_memories: true,
  my_messages_sent: true,
  others_messages_to_me: false,  // Privacy protected
  shared_content: "requires_all_parties_consent"
}

// Workspace boundaries
if (memory.workspace !== req.workspace) {
  throw "Cross-workspace access denied"
}
```

### Moderation Without Banning
```javascript
{
  _id: ObjectId("..."),
  status: {
    account: "active",           // Never banned
    messaging: "restricted",     // Temporary
    reason: "spam_detected",
    expires: ISODate("...")
  }
}
// Users ALWAYS keep access to their own data
```

---

## Development Rules

### Code Consistency

1. **ObjectId Everywhere**
```javascript
// Every relationship uses ObjectId
p: ObjectId("...")
from: ObjectId("...")
to: ObjectId("...")
owner: ObjectId("...")
```

2. **Minimal Data**
```javascript
// Don't store what ObjectId gives you
NO: created: ISODate()  // Use _id.getTimestamp()
NO: uuid: "..."         // Use _id
YES: lastAccess: ISODate() // Only if ms precision needed
```

3. **Soft Delete Always**
```javascript
// Never hard delete immediately
memory.deleted = true
memory.deletedAt = new Date()
// Hard delete only from trash after X days
```

4. **Tree Operations**
```javascript
// Always recursive for parent-child
function deleteTree(parentId) {
  const children = find({ p: parentId })
  children.forEach(child => deleteTree(child._id))
  softDelete(parentId)
}
```

5. **Workspace Context**
```javascript
// Every query scoped to workspace
const db = client[`${workspace}.users.${username}@${domain}`]
// Never query across workspaces
```

### API Patterns
```javascript
// Standard response
{
  success: true,
  data: { ... },  // No _id exposed unless needed
  error: null
}

// Standard error
{
  success: false,
  data: null,
  error: "Descriptive message"
}

// Pagination with ObjectId (not skip/limit)
{
  next_cursor: ObjectId("..."),  // Last item's _id
  items: [...]
}
```

### Testing Requirements
- Every relationship must use ObjectId
- Soft delete must delete entire tree
- Workspace isolation must be enforced
- No email in relationships
- Timestamp from _id must work

---

## Migration & Portability

### Database Portability
```javascript
// Export user's entire database
mongodump --db "autodin.users.john@gmail.com"

// Import to new location
mongorestore --db "newsite.users.john@company.com"

// Update identity
db.qwanyx.identity.update(
  { _id: ObjectId("...") },
  { $set: { current_email: "john@company.com" } }
)
// All relationships still work (ObjectId unchanged)
```

### DH Career Mobility
```
Before: autodin.users.adam@autodin.be (manages Autodin)
After: carparts.users.adam@carparts.com (manages CarParts)

- Same ObjectId
- Memories preserved (valuable experience)
- Skills transfer
```

---

## Summary: The 10 Commandments of QWANYX

1. **ObjectId is identity** - Not email, not UUID, just _id
2. **Everything is a memory** - Columns, cards, chats, all memories
3. **Parent-child via p:** - Simple tree structure
4. **Workspace isolation** - Never cross boundaries
5. **Soft delete trees** - Preserve data, delete branches
6. **User owns database** - Full control, full portability
7. **DH as gatekeeper** - Smart filtering, not spam
8. **One finger interface** - Simplicity forces elegance
9. **PWA not app store** - Freedom from platform taxes
10. **Zero-hour work week** - DHs work, humans live

---

*"The email is just a business card. The ObjectId is the soul."*

*"Work zero hours. Create infinitely."*