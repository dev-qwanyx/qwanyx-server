# Digital Human Memory Implementation Guide
*Date: August 22, 2024*

## 🧠 Overview: DH Memory System

The Digital Human memory system is already implemented in the `@qwanyx/thot` package. It provides:
- **Workspace-aware memory storage** (isolated by workspace)
- **Collection-based organization** (one collection per DH)
- **Rich memory types** (config, context, learning, patterns)
- **Memory linking system** (relationships between memories)
- **Consolidation process** (like sleep for AI)

## 📊 Complete Architecture Flow

```
User Login → JWT with workspace → Apps use workspace → DH operates in workspace → Memory in workspace DB
```

### Database Structure
```
autodin/ (workspace database)
├── users/                              # Humans AND Digital Humans
│   ├── human_user_123                 # type: "human"
│   └── dh_456                          # type: "dh"
│
├── jarvis-qwanyx-com/                  # DH memory collection
│   ├── config memories
│   ├── conversation memories
│   ├── learned patterns
│   └── context memories
│
└── phil-pixanima-com/                  # Human user collection
    └── preferences, history, etc.
```

## 🔧 Implementation: Using Existing Memory Service

### 1. Initialize DH with Memory
```typescript
import { ThotMemoryService } from '@qwanyx/thot/services/memoryService';
import { useAuth } from '@qwanyx/auth';

// In a component or service
const { workspace, token } = useAuth();
const dhEmail = 'jarvis@qwanyx.com';

// Create memory service instance
const memoryService = new ThotMemoryService(
  'http://localhost:5002/api',
  workspace,  // e.g., "autodin"
  dhEmail
);

// Set the auth token
memoryService.setToken(token);

// Initialize the DH user (creates if not exists)
const dhUser = await memoryService.initializeThotUser();
console.log('DH initialized:', dhUser);
```

### 2. Store Configuration Memory
```typescript
// Save SMTP/IMAP configuration
const config = {
  credentials: {
    smtp: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      user: 'support@autodin.com',
      password: 'encrypted_password',
      from: 'Support Autodin <support@autodin.com>'
    },
    imap: {
      host: 'imap.gmail.com',
      port: 993,
      secure: true,
      user: 'support@autodin.com',
      password: 'encrypted_password'
    }
  },
  settings: {
    autoReply: true,
    replyDelay: 300
  }
};

const configMemory = await memoryService.saveConfig(config);
console.log('Config saved:', configMemory);
```

### 3. Create Different Memory Types
```typescript
// Store a conversation memory
const conversationMemory = await memoryService.createMemory({
  type: 'context',
  subtype: 'conversation',
  timestamp: new Date(),
  data: {
    user: 'user@example.com',
    messages: [
      { role: 'user', content: 'I need help with my order' },
      { role: 'assistant', content: 'I can help you with that!' }
    ],
    sentiment: 'positive',
    resolved: true
  },
  tags: ['support', 'order', 'resolved'],
  metadata: {
    importance: 0.7,
    confidence: 0.9,
    accessed: 0
  }
});

// Store a learned pattern
const patternMemory = await memoryService.createMemory({
  type: 'pattern',
  subtype: 'user_preference',
  timestamp: new Date(),
  data: {
    pattern: 'User prefers email responses in the morning',
    evidence: ['email_time_1', 'email_time_2'],
    confidence: 0.85
  },
  tags: ['learning', 'preferences', 'email']
});

// Store a decision memory
const decisionMemory = await memoryService.createMemory({
  type: 'decision',
  subtype: 'email_response',
  timestamp: new Date(),
  data: {
    trigger: 'urgent support request',
    action: 'immediate response with escalation',
    outcome: 'issue resolved quickly',
    success: true
  },
  tags: ['decision', 'support', 'successful']
});
```

### 4. Link Related Memories
```typescript
// Link conversation to pattern
await memoryService.linkMemories(
  conversationMemory._id,
  patternMemory._id,
  'LEARNED_FROM',  // Link type
  0.8              // Strength (0-1)
);

// Link pattern to decision
await memoryService.linkMemories(
  patternMemory._id,
  decisionMemory._id,
  'CAUSES',
  0.9
);

// Strengthen link when used again
await memoryService.strengthenLink(
  conversationMemory._id,
  patternMemory._id,
  0.1  // Increment
);
```

### 5. Query and Search Memories
```typescript
// Find all support conversations
const supportConversations = await memoryService.findMemories({
  type: 'context',
  subtype: 'conversation',
  tags: { $in: ['support'] }
});

// Find recent decisions
const recentDecisions = await memoryService.findMemories({
  type: 'decision',
  timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
});

// Find high-importance memories
const importantMemories = await memoryService.findMemories({
  'metadata.importance': { $gte: 0.8 }
});
```

### 6. Memory Consolidation (Sleep Process)
```typescript
// Run consolidation (typically scheduled)
await memoryService.consolidateMemories();
// This will:
// - Weaken unused links
// - Strengthen frequently used links
// - Remove very weak links
// - Create maintenance log
```

## 🎯 Integration with DhMainSwitch

Update the DhMainSwitch to show memory status:

```typescript
// In DhMainSwitch.tsx
import { ThotMemoryService } from '@qwanyx/thot/services/memoryService';

// Inside component
const [memoryCount, setMemoryCount] = useState(0);
const [lastMemory, setLastMemory] = useState<Date | null>(null);

useEffect(() => {
  if (isRunning && dhEmail) {
    // Create memory service
    const memoryService = new ThotMemoryService(
      'http://localhost:5002/api',
      workspace,
      dhEmail
    );
    memoryService.setToken(token);
    
    // Check memory status
    const checkMemory = async () => {
      const memories = await memoryService.findMemories({});
      setMemoryCount(memories.length);
      
      if (memories.length > 0) {
        const latest = memories.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0];
        setLastMemory(new Date(latest.timestamp));
      }
    };
    
    checkMemory();
    // Refresh every 10 seconds
    const interval = setInterval(checkMemory, 10000);
    return () => clearInterval(interval);
  }
}, [isRunning, dhEmail, workspace, token]);

// In render
{isRunning && memoryCount > 0 && (
  <div style={{ fontSize: '10px', color: '#9ca3af' }}>
    Memories: {memoryCount} | Last: {lastMemory?.toLocaleTimeString()}
  </div>
)}
```

## 📋 Memory Types Reference

| Type | Purpose | Example Data |
|------|---------|--------------|
| `config` | System configuration | SMTP, IMAP, API keys |
| `email` | Email interactions | Sent/received emails |
| `analysis` | Content analysis | Email sentiment, topics |
| `context` | Conversation context | User interactions |
| `decision` | Decision records | Actions taken and outcomes |
| `learning` | Learned information | Patterns, preferences |
| `feedback` | User feedback | Ratings, corrections |
| `thought` | Internal reasoning | Processing steps |
| `pattern` | Recognized patterns | Behavioral patterns |
| `maintenance` | System maintenance | Consolidation logs |

## 📋 Link Types Reference

| Category | Types | Purpose |
|----------|-------|---------|
| **Causal** | `CAUSES`, `CAUSED_BY` | Cause-effect relationships |
| **Temporal** | `BEFORE`, `AFTER`, `DURING` | Time relationships |
| **Semantic** | `SIMILAR_TO`, `OPPOSITE_OF`, `PART_OF`, `CONTAINS` | Meaning relationships |
| **Emotional** | `TRIGGERS_JOY`, `TRIGGERS_FRUSTRATION` | Emotional associations |
| **Learning** | `LEARNED_FROM`, `CONTRADICTS`, `CONFIRMS` | Knowledge relationships |

## 🚀 Next Steps

### Immediate (This Week)
1. ✅ Memory service already exists in thot package
2. ✅ Types and schemas already defined
3. 🔄 Update DhMainSwitch to show memory status
4. 🔄 Create SMTP configuration node using memory service

### Short-term (Next Week)
1. Create memory visualization component
2. Add memory search interface
3. Implement auto-learning from interactions
4. Add memory export/import functionality

### Medium-term (Next Month)
1. Implement advanced consolidation algorithms
2. Add memory clustering for insights
3. Create memory-based decision engine
4. Build memory analytics dashboard

## 🔐 Security Considerations

1. **Memory Isolation**: Each DH's memories are in their own collection
2. **Workspace Boundary**: Memories never cross workspace boundaries
3. **Access Control**: Only DH owner can access DH memories
4. **Encryption**: Sensitive data (passwords) must be encrypted
5. **Audit Trail**: All memory operations should be logged

## 💡 Key Insights

1. **Memory Service Ready**: The `ThotMemoryService` is fully implemented and workspace-aware
2. **Collection Naming**: Uses email-based naming (jarvis@qwanyx.com → jarvis-qwanyx-com)
3. **Rich Type System**: Supports various memory types with Zod validation
4. **Link System**: Memories can be interconnected with typed relationships
5. **Consolidation**: Built-in process for memory optimization (like sleep)

---

*The memory system is production-ready. We just need to connect it properly with the DH processes and create UI components for configuration and monitoring.*