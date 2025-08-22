# Digital Human & Workspace Architecture
*Date: August 22, 2024*

## 🏗️ Core Concept: DH = Special User

A Digital Human (DH) is fundamentally a **user** in the system, with special characteristics:
- Stored in the same `users` collection as human users
- Has an email address as unique identifier (e.g., `stephen@qwanyx.com`)
- Does NOT login - runs as a process within the API
- Has `type: "dh"` to differentiate from human users

## 📊 MongoDB Structure per Workspace

```
workspace_name/ (e.g., autodin/)
├── users/                          # Both humans AND Digital Humans
│   ├── Human User Example:
│   │   {
│   │     _id: "user123",
│   │     email: "phil@pixanima.com",
│   │     type: "human",
│   │     personal_dh_id: "dh456",  # Link to personal DH
│   │     ...
│   │   }
│   │
│   └── Digital Human Example:
│       {
│         _id: "dh456",
│         email: "jarvis@qwanyx.com",
│         type: "dh",
│         owner_id: "user123",        # Link to owner
│         active: true,
│         flow: {...},                # Workflow definition
│         ...
│       }
│
├── jarvis-qwanyx-com/              # DH's personal collection (memory)
│   └── All DH data, memories, learning, context...
│
├── phil-pixanima-com/              # Human's personal collection
│   └── User preferences, history, context...
│
├── auth_codes/                     # For human authentication only
├── sessions/                       # For human sessions only
└── ...
```

## 🔑 Key Principles

### 1. Email as Collection Name
- Email is transformed: `@` → `-` and `.` → `-`
- Example: `jarvis@qwanyx.com` → `jarvis-qwanyx-com`
- This becomes the collection name for all personal data

### 2. DH Personal Collections Store Everything
```javascript
// Collection: workspace/jarvis-qwanyx-com
{
  // Conversations & Interactions
  { type: "conversation", timestamp: ..., messages: [...] },
  
  // Learned Context & Patterns
  { type: "learned_context", data: {...} },
  { type: "pattern", description: "User prefers morning meetings" },
  
  // Service Management (future)
  { type: "service", name: "email", config: {...} },
  { type: "service", name: "calendar", sync_state: {...} },
  
  // Tasks & Reminders
  { type: "task", status: "pending", description: "..." },
  
  // State & Preferences
  { type: "state", current_mood: "productive", energy: 85 },
  { type: "preferences", learned: {...} },
  
  // Action History
  { type: "action_log", action: "sent_email", details: {...} }
}
```

### 3. Workspace Isolation
- Each workspace (autodin, belgicomics, etc.) is a completely separate MongoDB database
- DH and users exist within their workspace context
- No cross-workspace data access

### 4. JWT Token Contains Workspace
```javascript
// When user logs in, JWT includes:
{
  identity: "user123",           // User ID
  workspace: "autodin",          // Current workspace
  email: "phil@pixanima.com"    // User email
}
```

## 🚀 Personal DH Assistant Vision

### Every User Gets a Personal DH
1. **User Registration**: Human user created in `users` collection
2. **DH Creation**: User chooses a name for their assistant
3. **Email Generation**: `{chosen-name}@qwanyx.com`
4. **Automatic Setup**:
   - DH user created with `type: "dh"`
   - Personal collection created: `{chosen-name}-qwanyx-com`
   - Bidirectional link established (owner_id ↔ personal_dh_id)

### DH as Data Guardian
The personal DH becomes responsible for:
- **Data Management**: Storing and organizing user's data
- **Service Integration**: Managing connections to external services
- **Privacy Control**: Acting as gatekeeper for data access
- **Intelligent Processing**: Learning patterns and preferences
- **Task Automation**: Handling routine tasks for the user

## 🔧 Implementation Requirements

### API Endpoints Needed
```python
# DH Management
POST   /api/dh/create              # Create personal DH for user
GET    /api/dh/{dh_id}/status      # Check if DH is active
POST   /api/dh/{dh_id}/start       # Start DH process
POST   /api/dh/{dh_id}/stop        # Stop DH process

# Memory Management
POST   /api/dh/{dh_id}/memory      # Add to DH memory
GET    /api/dh/{dh_id}/memory      # Query DH memory
DELETE /api/dh/{dh_id}/memory/{id} # Remove specific memory

# Workspace-aware operations
# All endpoints automatically use workspace from JWT
```

### DhMainSwitch Component Fix
The component needs to:
1. Use the workspace from the JWT token
2. Query `/users` endpoint which filters by workspace
3. Check the `active` field to determine DH state
4. Handle the case where DH process might be running but not reflected in DB

## 📝 UI Considerations

### User List Page
- Filter: `type !== "dh"` (show only humans)
- Display human users with their roles

### Digital Team Page
- Filter: `type === "dh"` (show only DH)
- Display DH with their status and owner

### Personal Assistant Setup
- Wizard for choosing assistant name
- Check availability of `{name}@qwanyx.com`
- Create DH and link to user

## 🔐 Security Considerations

1. **DH Cannot Login**: No authentication for DH users
2. **Owner Access Only**: Only the owner can control their personal DH
3. **Workspace Isolation**: Complete separation between workspaces
4. **Data Ownership**: User owns their DH, DH owns the data

## 🎯 Next Steps

1. **Immediate**: Fix DhMainSwitch to properly use workspace context
2. **Short-term**: Implement memory management endpoints
3. **Medium-term**: Create personal DH creation wizard
4. **Long-term**: Implement service integration through DH

---

*This architecture ensures that Digital Humans are first-class citizens in the system while maintaining clear separation between human users and AI assistants.*