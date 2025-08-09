# QWANYX Digital Human Database Structure

## Core Principle: Everything is a DH with Identical Structure

Every entity in the QWANYX ecosystem - whether a website, admin, or user - is a Digital Human with the exact same database structure.

## Database Naming Convention

```
[workspace].users.[username]@[domain]
```

Examples:
- `qwanyx.users.adam@qwanyx.com` - QWANYX master DH
- `autodin.users.adam@autodin.be` - Autodin website admin DH  
- `autodin.users.john@gmail.com` - John's personal DH on Autodin
- `belgicomics.users.marie@outlook.com` - Marie's DH on Belgicomics

## Universal DH Database Structure

Every DH database contains:

```
Database: [workspace].users.[username]@[domain]
├── memories/               # All memory nodes
├── edges/                  # Links between non-parent memories
└── qwanyx/                 # Standard QWANYX structure
    ├── profile            # Extensive user/DH profile
    ├── preferences        # UI settings, themes
    ├── firmware           # DH behavioral settings
    ├── connections        # Links to other DHs/websites
    ├── lineage           # Family tree position
    └── identity          # UUID and email history
```

## Identity Management

### UUID is Permanent Identity

```javascript
// qwanyx.identity document
{
  _id: ObjectId("..."),            // MongoDB auto-generated
  uuid: "john-uuid-67890",        // PERMANENT - never changes, OUR PRIMARY KEY
  current_email: "john@gmail.com", // Can change
  previous_emails: [
    "john.doe@company.com",
    "jdoe@university.edu"
  ],
  created: ISODate("2024-01-01"),
  last_modified: ISODate("2025-08-09")
}

// CRITICAL: Always index on uuid, not _id
db.memories.createIndex({ "uuid": 1 }, { unique: true })
db.edges.createIndex({ "uuid": 1 }, { unique: true })
```

### All Relationships Use UUID

```javascript
// Memory node
{
  _id: ObjectId("..."),           // MongoDB generated - WE IGNORE THIS
  uuid: "memory-uuid-123",        // OUR REAL ID - ALL QUERIES USE THIS
  p: "parent-uuid-456",          // Parent UUID, not _id, not email
  owner: "john-uuid-67890",      // Owner UUID, not _id, not email
  shared_with: [
    "marie-uuid-111",
    "paul-uuid-222"
  ],
  created_by: "john-uuid-67890"
}

// Edge (connection)
{
  _id: ObjectId("..."),           // MongoDB generated - WE IGNORE THIS
  uuid: "edge-uuid-789",         // OUR REAL ID
  from: "memory-uuid-123",       // UUID reference, not _id
  to: "memory-uuid-456",         // UUID reference, not _id
  type: "reference",
  created_by: "john-uuid-67890"  // UUID reference, not _id
}

// CRITICAL DATABASE RULES:
// 1. NEVER use _id in relationships
// 2. NEVER return _id to frontend
// 3. ALWAYS query by uuid
// 4. ALWAYS index uuid fields
```

## Special DHs

### 1. Master DH (QWANYX)
```
Database: qwanyx.users.adam@qwanyx.com
- The original DH that creates all others
- Manages the entire ecosystem
- Contains master firmware all DHs inherit
```

### 2. Website Admin DHs
```
Database: autodin.users.adam@autodin.be
- Manages the website operations
- NOT the parent of user DHs (they're peers)
- Can be reassigned to other websites (career mobility)
- Keeps memories of all user connections
```

### 3. User DHs
```
Database: autodin.users.john@gmail.com
- Personal DH for the user
- Same structure as admin DHs
- Connects to websites, not owned by them
```

## Key Design Decisions

### 1. Email Can Change, UUID Cannot
- Email is just a current label for convenience
- UUID is the permanent identity
- All references must use UUID, never email
- Database name may change when email changes

### 2. DHs Are Portable
- Can move entire database to another server
- Can change employer (website DHs)
- Can change email provider (user DHs)
- History and relationships preserved via UUID

### 3. No Parent-Child Between Website and Users
- Website admin DH and user DHs are peers
- Website records user connections as memories
- Users record website connections in qwanyx.connections
- Relationship is professional, not hierarchical

### 4. Identical Structure for All
- Every DH has the same database structure
- No special fields for admins vs users
- Role determined by context and permissions
- Enables DH career mobility

## Connection Patterns

### User Connects to Website

**Website Admin DH records:**
```javascript
// In autodin.users.adam@autodin.be/memories
{
  type: "user_connection",
  title: "John connected",
  content: {
    user_uuid: "john-uuid-67890",
    user_email: "john@gmail.com",  // Current email at connection time
    connected_at: ISODate(),
    status: "active"
  }
}
```

**User DH records:**
```javascript
// In autodin.users.john@gmail.com/qwanyx.connections
{
  type: "website",
  title: "Autodin",
  admin_dh_uuid: "autodin-adam-uuid-12345",
  workspace: "autodin",
  connected_at: ISODate()
}
```

## Migration Scenarios

### 1. User Changes Email
```
Before: autodin.users.john@gmail.com
After:  autodin.users.john@company.com

- Database renamed
- UUID unchanged
- All relationships intact
- Update qwanyx.identity.current_email
- Add old email to previous_emails
```

### 2. Website DH Changes Employer
```
Before: autodin.users.adam@autodin.be
After:  carparts.users.adam@carparts.com

- Entire database moved/copied
- UUID unchanged  
- Memories preserved (valuable experience)
- Update qwanyx.identity
- Professional history maintained
```

### 3. Website Acquired
```
Before: autodin.users.adam@autodin.be
After:  carparts.divisions.autodin.adam@carparts.com

- Can maintain namespace under new owner
- Or merge into parent company structure
- DH continues managing same domain
- UUID ensures continuity
```

## CRITICAL: UUID vs MongoDB _id

### Why We Don't Use _id

1. **_id is MongoDB-specific** - Locks us to MongoDB forever
2. **_id is not portable** - Can't move to another database
3. **_id changes on export/import** - Breaks all relationships
4. **_id is not human-friendly** - ObjectId("507f1f77bcf86cd799439011")
5. **_id couples storage to identity** - Bad architecture

### Our UUID Strategy

```javascript
// WRONG - Using _id
memories.find({ _id: ObjectId("507f1f77bcf86cd799439011") })
memories.find({ p: ObjectId("507f1f77bcf86cd799439012") })  // NEVER DO THIS

// RIGHT - Using uuid
memories.find({ uuid: "john-uuid-67890" })
memories.find({ p: "parent-uuid-456" })  // ALWAYS DO THIS

// Database indexes (CRITICAL for performance)
db.memories.createIndex({ "uuid": 1 }, { unique: true })
db.memories.createIndex({ "p": 1 })
db.memories.createIndex({ "owner": 1 })
db.edges.createIndex({ "uuid": 1 }, { unique: true })
db.edges.createIndex({ "from": 1 })
db.edges.createIndex({ "to": 1 })
```

### API Must Strip _id

```javascript
// Backend query
const memory = await db.memories.findOne({ uuid: "memory-uuid-123" })

// WRONG - Sending to frontend
return memory  // Contains _id

// RIGHT - Strip _id before sending
const { _id, ...memoryData } = memory
return memoryData  // Clean, no _id
```

## Implementation Requirements

### 1. API Must Always:
- Accept UUID for all relationships
- Never use email as identifier in relationships
- Store both UUID and current email for display
- Validate UUID exists before creating relationships

### 2. Database Operations Must:
- Use UUID for all queries involving relationships
- Update qwanyx.identity when email changes
- Maintain previous_emails history
- Handle database renames on email change

### 3. Frontend Must:
- Display current email for UI
- Use UUID for all API calls
- Cache UUID locally
- Handle email changes gracefully

## Security Considerations

1. **UUID is public** - Can be shared safely
2. **Email is private** - Only shown with permission
3. **Database name** - Includes email but access controlled
4. **Relationships** - UUID prevents email harvesting

## Future Extensions

1. **Multi-workspace DHs** - Same DH across multiple sites
2. **DH Reputation System** - Based on UUID history
3. **DH Marketplace** - Hire experienced DHs
4. **DH Inheritance** - Child DHs inherit from parent UUID
5. **DH Certification** - Skills tied to UUID

---

*"The email is just a business card. The UUID is the soul."*