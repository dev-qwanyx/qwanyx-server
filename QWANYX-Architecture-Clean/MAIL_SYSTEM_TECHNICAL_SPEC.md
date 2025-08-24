# 📧 Digital Human Mail System - Technical Specification

## 🧠 Core Architecture: Graph-Based Memory Formation

### Philosophy
Unlike traditional email clients that use relational databases, the DH Mail System treats **everything as nodes in a living memory graph**. Emails aren't records in a table - they're memories that form relationships and patterns over time.

## 🔄 Email Processing Pipeline

### 1. Email Reception (IMAP)
```typescript
// MailService.ts - Polling mechanism
private async checkNewEmails() {
  // Connect to IMAP server (Gmail, Outlook, etc.)
  // Poll folders: ['INBOX', 'Sent', 'Important']
  // Fetch UNSEEN messages
  // Parse with mailparser
}
```

**Technical Flow:**
1. IMAP connection established on port 993 (TLS)
2. Polls every `config.polling.interval` ms (default: 60000)
3. Searches for UNSEEN flags in specified folders
4. Streams email content through `simpleParser`
5. Marks as SEEN after processing

### 2. Node Creation & Graph Formation

#### Email → Memory Node
```typescript
// When email arrives, it becomes a memory node
const emailNode = {
  _id: ObjectId("65abc123..."),  // MongoDB ID with built-in timestamp
  type: 'email',
  data: {
    messageId: "CAA+Bbk8w...",
    subject: "Project Update",
    from: { email: "john@example.com", name: "John Doe" },
    to: [{ email: "me@brain.ai" }],
    body: { text: "...", html: "..." },
    folder: "INBOX",
    flags: ["\\Seen"]
  }
}
```

#### Contact Discovery & Creation
```typescript
// Automatic contact extraction
private async findOrCreateContact(address) {
  // 1. Check local cache (Map in memory)
  if (this.contacts.has(address.email)) return cached
  
  // 2. Search brain memory
  const existing = await brain.searchMemories({
    type: 'contact',
    'content.email': address.email
  })
  
  // 3. Create if new
  const contact = {
    _id: ObjectId("65abc456..."),
    type: 'contact',
    data: {
      email: "john@example.com",
      firstName: "John",    // Parsed from name
      lastName: "Doe",       // Intelligent splitting
      firstContact: Date,
      messageCount: 1
    }
  }
}
```

#### Edge Creation (Relationships)
```typescript
// Minimal edge structure
const edge: Edge = {
  id: `${contactId}-${emailId}-${timestamp}`,
  source: "65abc456...",  // Contact node ID
  target: "65abc123...",  // Email node ID  
  type: "mail"            // Relationship type
}

// This creates the graph:
[Contact: John] ---mail---> [Email: "Project Update"]
```

### 3. Semantic Compression with GPT-5 Nano

#### Batch Processing Architecture
```typescript
// SemanticCompression.ts
async processBatch(emails: EmailData[]): Promise<ProcessedEmail[]> {
  // GPT-5 Nano: 400,000 token context window
  // Can process ~100 typical emails in one call
  
  const response = await client.responses.create({
    model: "gpt-5-nano",
    reasoning: { effort: "low" },  // Fast processing
    instructions: `Extract semantic compressions...`,
    input: batchPrompt  // All emails concatenated
  })
}
```

#### Compression Levels

**Level 1: Raw Email** (Original)
```json
{
  "subject": "Re: Q4 Budget Review - Action Required",
  "body": "Hi team, Following our discussion yesterday about the Q4 budget allocations, I need everyone to review the attached spreadsheet and confirm your department's numbers by Friday EOD. We found some discrepancies in the marketing budget that need immediate attention. The total variance is $45,000 which we need to account for before the board meeting next Tuesday. Please pay special attention to rows 23-47 in the spreadsheet. Also, John from accounting will be sending a separate email about the new expense reporting system. Thanks, Sarah"
}
```

**Level 2: Entity Extraction** (Structured Data)
```json
{
  "entities": {
    "people": ["Sarah", "John"],
    "dates": ["Friday EOD", "next Tuesday"],
    "amounts": [45000],
    "companies": [],
    "departments": ["marketing", "accounting"]
  }
}
```

**Level 3: Summary** (One Sentence)
```json
{
  "summary": "Sarah requests team review Q4 budget spreadsheet by Friday, addressing $45k marketing variance before Tuesday's board meeting"
}
```

**Level 4: Semantic Tags** (Fixed Vocabulary)
```json
{
  "tags": [3, 15, 27, 45, 67, 89],  // Indices into semantic array
  // Translates to: ["urgent", "budget", "action-required", "deadline", "review-needed", "financial"]
}
```

**Level 5: Importance & Actions**
```json
{
  "importance": 8,  // 1-10 scale
  "actions": [
    "Review budget spreadsheet rows 23-47",
    "Confirm department numbers by Friday EOD",
    "Account for $45,000 variance"
  ]
}
```

### 4. Graph Enrichment

#### Tag Edges for Semantic Clustering
```typescript
// Create edges from email to semantic tags
for (const tagIndex of compression.tags) {
  const tagEdge = {
    id: `tag-${emailId}-${tagIndex}`,
    source: emailId,        // Email node
    target: `tag-${tagIndex}`,  // Tag pseudo-node
    type: "tagged"
  }
  await brain.addEdge(tagEdge)
}
```

This creates a semantic web:
```
[Email] ---tagged---> [Tag: "urgent"]
        ---tagged---> [Tag: "budget"]
        ---tagged---> [Tag: "deadline"]

// Now can query: "Show all urgent budget emails"
```

### 5. Temporal Awareness via ObjectId

```typescript
// MongoDB ObjectIds contain timestamps
const objectId = new ObjectId("65abc123def456789012")
const timestamp = objectId.getTimestamp()  // 2024-01-15T10:30:00Z

// Query last week's emails without date fields:
const oneWeekAgo = new ObjectId(
  Math.floor((Date.now() - 7*24*60*60*1000) / 1000).toString(16) + "0000000000000000"
)

const recentEmails = await brain.searchMemories({
  _id: { $gte: oneWeekAgo },
  type: 'email'
})
```

## 🎯 Semantic Tag System

### Fixed Vocabulary (100+ tags)
```typescript
const semanticTags = [
  // Communication types (0-9)
  'urgent', 'meeting', 'followup', 'question', 'answer',
  'request', 'confirmation', 'invitation', 'reminder', 'announcement',
  
  // Business categories (10-29)
  'invoice', 'payment', 'contract', 'proposal', 'quote',
  'project', 'deadline', 'milestone', 'deliverable', 'budget',
  'report', 'presentation', 'documentation', 'specification', 'requirements',
  
  // Relationships (30-49)
  'client', 'vendor', 'partner', 'colleague', 'manager',
  'team', 'customer', 'lead', 'prospect', 'referral',
  'introduction', 'recommendation', 'feedback', 'complaint', 'testimonial',
  
  // Actions (50-69)
  'action-required', 'review-needed', 'approval-needed', 'signature-required',
  'response-expected', 'fyi-only', 'delegated', 'completed', 'pending',
  'blocked', 'waiting', 'scheduled', 'cancelled', 'postponed', 'escalated',
  
  // Topics (70-89)
  'technical', 'financial', 'legal', 'marketing', 'sales',
  'hr', 'operations', 'strategy', 'product', 'support',
  'training', 'security', 'compliance', 'quality', 'research',
  
  // Sentiment (90-99)
  'positive', 'negative', 'neutral', 'critical', 'appreciative',
  'concerned', 'frustrated', 'satisfied', 'confused', 'confident'
]
```

### Tag Benefits
- **Fixed vocabulary** = Consistent categorization
- **Indices not strings** = Minimal storage (just `[3,7,45]`)
- **Combinations** = Infinite expressiveness from finite tags
- **Graph traversal** = Find emails by tag clusters

## 📊 Query Patterns

### 1. Time-based (via ObjectId)
```typescript
// "Emails from last 24 hours"
const yesterday = new ObjectId(
  Math.floor((Date.now() - 24*60*60*1000) / 1000).toString(16) + "0000000000000000"
)
emails.find({ _id: { $gte: yesterday } })
```

### 2. Relationship-based (via Edges)
```typescript
// "All emails from John"
const johnContact = await findContact("john@example.com")
const edges = await brain.getEdges({ source: johnContact._id, type: "mail" })
const emailIds = edges.map(e => e.target)
```

### 3. Semantic-based (via Tags)
```typescript
// "Urgent financial emails"
const urgentTag = semanticTags.indexOf('urgent')  // 0
const financialTag = semanticTags.indexOf('financial')  // 71

const urgentEmails = await brain.getEdges({ target: `tag-${urgentTag}` })
const financialEmails = await brain.getEdges({ target: `tag-${financialTag}` })
const intersection = findCommonSources(urgentEmails, financialEmails)
```

### 4. Pattern Discovery
```typescript
// "Who sends the most urgent emails?"
const urgentEdges = await brain.getEdges({ 
  target: `tag-${urgentTag}`,
  type: "tagged" 
})
const emailIds = urgentEdges.map(e => e.source)
const emails = await brain.getMemories(emailIds)
const senderFrequency = countBySender(emails)
// Result: { "boss@company.com": 47, "client@important.com": 23, ... }
```

## 🔧 Configuration

### Environment Variables (.env)
```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-5-nano              # 400k context window
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_MAX_BATCH_SIZE=100            # Emails per batch
OPENAI_REASONING_EFFORT=low          # Fast processing

# Mail Configuration (passed to MailService)
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=dh@example.com
IMAP_PASSWORD=app-specific-password
SMTP_HOST=email-smtp.us-east-1.amazonaws.com  # AWS SES
SMTP_PORT=587
SMTP_USER=AKIA...
SMTP_PASSWORD=...
```

### MailConfig Structure
```typescript
interface MailConfig {
  imap: {
    user: string
    password: string
    host: string
    port: number
    tls: boolean
    authTimeout?: number
  }
  smtp: {
    host: string
    port: number
    secure: boolean
    auth: { user: string; pass: string }
    from: string  // Default sender
  }
  polling: {
    enabled: boolean
    interval: number  // milliseconds
    folders: string[]  // ['INBOX', 'Sent']
  }
}
```

## 🚀 Performance Optimizations

### 1. Batch Processing
- Collect emails throughout the day
- Process in batches of 50-100
- Single GPT-5 Nano call per batch
- 400k tokens can handle ~100 emails

### 2. Caching Strategy
- Local contact cache (Map in memory)
- Reduces MongoDB queries
- Instant contact lookups

### 3. Edge Efficiency
- Minimal edge data (just s, t, type)
- ID generation: `${source}-${target}-${timestamp}`
- No redundant metadata

### 4. Compression Benefits
- Raw email: ~5KB average
- Compressed node: ~500 bytes
- 10x storage reduction
- Faster graph traversal

## 🎨 Future Enhancements

### 1. Vector Embeddings
```typescript
// Add semantic search via embeddings
const embedding = await compression.generateEmbedding(email.body)
// Store as Float32Array in MongoDB
// Enable similarity search: "Find emails like this one"
```

### 2. Thread Reconstruction
```typescript
// Build conversation threads from References header
if (email.references) {
  const threadEdge = {
    source: previousEmailId,
    target: currentEmailId,
    type: "reply"
  }
}
```

### 3. Smart Responses
```typescript
// Use compression data to generate responses
const context = {
  summary: compression.summary,
  entities: compression.entities,
  importance: compression.importance
}
const response = await generateResponse(context)
```

### 4. Predictive Tags
```typescript
// Learn from user corrections
// Refine tag predictions over time
// Personalized semantic vocabulary
```

## 📈 Metrics & Monitoring

### Processing Stats
- Emails received per hour
- Average compression time
- Batch processing efficiency
- Tag distribution analysis
- Contact growth rate

### Graph Health
- Total nodes (emails + contacts)
- Total edges (relationships)
- Average edges per node
- Cluster detection
- Orphaned nodes

## 🔐 Security Considerations

1. **Email credentials** - Store in environment variables
2. **OAuth2** - Prefer OAuth over passwords for Gmail
3. **Rate limiting** - Respect IMAP server limits
4. **Data encryption** - Encrypt sensitive email content
5. **Access control** - Brain-specific email isolation

## 🎯 Summary

The DH Mail System transforms emails from static messages into a **living, growing knowledge graph** where:
- Every email becomes a memory node
- Every sender becomes a contact node
- Every relationship becomes an edge
- Every topic becomes a semantic tag
- Time is embedded in the structure itself

The result is a mail system that doesn't just store emails - it **understands** them, **remembers** patterns, and **grows smarter** with every message received.