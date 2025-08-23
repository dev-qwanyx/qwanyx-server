# Digital Human Mail Client Specification

## Overview
The DH Mail Client is a headless email management service integrated into the Digital Human brain system. It operates autonomously to manage emails, contacts, and conversations, storing everything as memory nodes in the brain's graph structure.

## Core Concepts

### 1. Mail Client Node
A special node type in QFlow that represents the mail client interface:
- **Type**: `mail-client`
- **Icon**: Envelope or Mail icon
- **Purpose**: Entry point for email management in the flow
- **Behavior**: When activated, connects to email service and processes messages

### 2. Headless Mail Service
A background service in the brain-server that:
- Connects to email providers (IMAP/SMTP)
- Polls for new messages
- Sends composed messages
- Manages email state (read/unread, folders, etc.)

## Architecture

```
┌─────────────────────────────────────────────┐
│            Digital Human Brain              │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │     Headless Mail Service          │    │
│  │  - IMAP/SMTP Connection            │    │
│  │  - Message Polling                 │    │
│  │  - Contact Management              │    │
│  │  - Memory Node Creation            │    │
│  └────────────┬───────────────────────┘    │
│               │                             │
│  ┌────────────▼───────────────────────┐    │
│  │       Memory Graph                  │    │
│  │                                     │    │
│  │  [Contact Node] ←→ [Email Node]    │    │
│  │       ↓               ↓             │    │
│  │  [Contact Node] ←→ [Email Node]    │    │
│  │                                     │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

## Data Structure

### Contact Node
```javascript
{
  _id: ObjectId,
  type: "contact",
  data: {
    email: "john@example.com",
    name: "John Doe",
    firstName: "John",
    lastName: "Doe",
    company: "Example Corp",
    tags: ["client", "important"],
    firstContact: Date,
    lastContact: Date,
    messageCount: 42,
    metadata: {
      source: "email",
      autoCreated: true
    }
  }
}
```

### Email Node
```javascript
{
  _id: ObjectId,
  type: "email",
  data: {
    messageId: "<unique-message-id@mail.com>",
    threadId: "<thread-id>",  // For conversation threading
    from: {
      email: "sender@example.com",
      name: "Sender Name"
    },
    to: [{
      email: "recipient@example.com",
      name: "Recipient Name"
    }],
    cc: [],
    bcc: [],
    subject: "Email Subject",
    body: {
      text: "Plain text content",
      html: "<p>HTML content</p>"
    },
    timestamp: Date,
    isRead: true,
    isAnswered: false,
    isDraft: false,
    folder: "inbox",  // inbox, sent, drafts, trash, etc.
    labels: ["important", "work"],
    attachments: [
      // Phase 2 - S3 integration
      {
        filename: "document.pdf",
        size: 1024000,
        mimeType: "application/pdf",
        s3Key: "attachments/uuid/document.pdf"
      }
    ],
    contactId: ObjectId  // Reference to Contact Node
  }
}
```

### Edge Relationships
```javascript
// Contact → Email edge
{
  _id: ObjectId,
  s: contactNodeId,  // source: contact
  t: emailNodeId,    // target: email
  ty: "sent" | "received",
  m: {
    l: "Email Communication",
    d: "Sent on 2024-08-23"
  }
}
```

## Features

### Phase 1: Core Functionality
1. **Automatic Contact Creation**
   - Extract sender information from incoming emails
   - Create Contact Node if doesn't exist
   - Update existing Contact Node with latest interaction

2. **Email Memory Storage**
   - Each email becomes an Email Node
   - Automatic threading based on subject/references
   - Preserve full email content and metadata

3. **Relationship Mapping**
   - Create edges between Contacts and Emails
   - Track conversation flow
   - Build communication history graph

4. **Basic Operations**
   - Fetch new emails (polling interval configurable)
   - Mark as read/unread
   - Move between folders
   - Delete emails

### Phase 2: Advanced Features
1. **Smart Compose**
   - AI-powered email drafting
   - Context-aware responses based on conversation history
   - Template system for common responses

2. **Attachment Handling**
   - S3 storage integration
   - Automatic virus scanning
   - Preview generation for images/documents

3. **Search & Analytics**
   - Full-text search across emails
   - Contact interaction analytics
   - Communication patterns visualization

4. **Rules & Automation**
   - Auto-categorization
   - Smart filtering
   - Automated responses for specific patterns

## Implementation Steps

### Step 1: Brain Service Enhancement
```javascript
// brain-server/src/services/MailService.ts
class MailService {
  constructor(brainId, config) {
    this.imap = new ImapClient(config)
    this.smtp = new SmtpClient(config)
    this.brain = BrainConnection(brainId)
  }
  
  async pollEmails() {
    const newEmails = await this.imap.fetchUnread()
    for (const email of newEmails) {
      await this.processEmail(email)
    }
  }
  
  async processEmail(email) {
    // 1. Find or create contact
    const contact = await this.findOrCreateContact(email.from)
    
    // 2. Create email node
    const emailNode = await this.brain.createNode({
      type: 'email',
      data: this.parseEmail(email)
    })
    
    // 3. Create relationship
    await this.brain.createEdge({
      s: contact._id,
      t: emailNode._id,
      ty: 'received'
    })
  }
}
```

### Step 2: QFlow Mail Client Node
```javascript
// New node type in QFlow
const MailClientNode = {
  type: 'mail-client',
  icon: 'Mail',
  color: 'primary',
  config: {
    provider: 'gmail' | 'outlook' | 'imap',
    credentials: {
      // Encrypted storage
    },
    pollInterval: 60000,  // 1 minute
    autoReply: false
  }
}
```

### Step 3: Configuration UI
- Mail server settings (IMAP/SMTP)
- Authentication (OAuth2 preferred)
- Folder mapping
- Sync preferences

## Security Considerations

1. **Credential Storage**
   - Encrypted at rest
   - OAuth2 tokens when possible
   - Never store plain passwords

2. **Data Privacy**
   - Email content encrypted in database
   - PII handling compliance
   - Audit logging for all operations

3. **Rate Limiting**
   - Respect provider limits
   - Exponential backoff on errors
   - Connection pooling

## API Endpoints

### Mail Service API
```
POST /api/dh/mail/configure
  - Configure mail settings for DH

GET /api/dh/mail/sync
  - Trigger manual sync

GET /api/dh/mail/contacts
  - List all contacts

GET /api/dh/mail/emails/:contactId
  - Get emails for specific contact

POST /api/dh/mail/send
  - Send email through DH

GET /api/dh/mail/search
  - Search emails and contacts
```

## Configuration Example

```javascript
{
  "mailConfig": {
    "provider": "gmail",
    "auth": {
      "type": "oauth2",
      "clientId": "...",
      "clientSecret": "...",
      "refreshToken": "..."
    },
    "imap": {
      "host": "imap.gmail.com",
      "port": 993,
      "secure": true
    },
    "smtp": {
      "host": "smtp.gmail.com",
      "port": 465,
      "secure": true
    },
    "sync": {
      "enabled": true,
      "interval": 60000,
      "folders": ["INBOX", "Sent"],
      "maxMessages": 100
    }
  }
}
```

## Benefits

1. **Unified Memory System**
   - All communications stored as brain memories
   - Searchable, linkable, analyzable

2. **Intelligent Responses**
   - DH learns from email patterns
   - Suggests responses based on history
   - Maintains consistent communication style

3. **Relationship Intelligence**
   - Track all interactions with contacts
   - Understand communication patterns
   - Identify important relationships

4. **Automation Potential**
   - Auto-categorization
   - Smart replies
   - Follow-up reminders
   - Meeting scheduling

## Future Enhancements

1. **Calendar Integration**
   - Meeting invites processing
   - Availability management
   - Automated scheduling

2. **Multi-Channel Communication**
   - SMS integration
   - WhatsApp Business API
   - Slack/Teams integration

3. **Advanced AI Features**
   - Sentiment analysis
   - Priority detection
   - Summary generation
   - Action item extraction

4. **Team Collaboration**
   - Shared inboxes
   - Assignment and delegation
   - Collision detection

## Conclusion

The DH Mail Client transforms email from a simple messaging tool into an intelligent memory system. By storing emails as nodes in the brain's graph, we enable:
- Complete communication history
- Relationship mapping
- Pattern recognition
- Intelligent automation

This creates a foundation for truly intelligent digital humans that can manage communications autonomously while maintaining context and relationships over time.