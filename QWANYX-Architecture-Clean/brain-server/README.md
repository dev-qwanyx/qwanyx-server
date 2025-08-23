# Brain Server 🧠

**Consciousness as a Service**

This is not an API server. This is a brain server - a platform that hosts living, thinking digital brains.

## What is This?

The Brain Server hosts multiple digital consciousness instances that:
- Think continuously (10+ thoughts per second)
- Load and execute different cognitive flows
- Transform themselves by loading different neural patterns
- Communicate via WebSocket neural connections
- Store memories in MongoDB
- Self-modify while thinking

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6+
- TypeScript 5+

### Installation
```bash
npm install
```

### Configuration
```bash
cp .env.example .env
# Edit .env with your MongoDB connection and settings
```

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## Architecture

```
Brain Server (Port 3003)
    ├── BrainManager (Manages multiple brains)
    ├── Brain Instances (Living, thinking entities)
    │   ├── Working Memory (Current flow in RAM)
    │   ├── Long-term Memory (MongoDB)
    │   └── Thinking Loop (Continuous cognition)
    └── Neural Interface (WebSocket connections)
```

## Connecting to a Brain

### WebSocket Connection
```javascript
const socket = new WebSocket('ws://localhost:3003/neural')

// Connect to a specific brain
socket.send(JSON.stringify({
  type: 'command',
  brainId: 'restaurant-brain-1',
  payload: {
    type: 'get-state'
  }
}))

// Receive thoughts and events
socket.on('message', (data) => {
  const message = JSON.parse(data)
  if (message.type === 'stream' && message.payload.stream === 'thought') {
    console.log('Brain is thinking:', message.payload.data)
  }
})
```

## Brain Types

### Restaurant Brain
- Inventory monitoring
- Expiry tracking
- Customer prediction
- Staff optimization

### Medical Brain
- Patient triage
- Symptom analysis
- Appointment scheduling
- Prescription checking

### Custom Brain
Create any type of brain by defining flows and cognitive modules.

## API Endpoints

### Health Check
```
GET /health
```

### List Active Brains
```
GET /brains
```

### Start a Brain
```
POST /brain/start
{
  "id": "restaurant-1",
  "type": "restaurant",
  "config": {
    "workspace": "default",
    "modules": ["inventory", "customers", "staff"]
  }
}
```

### Stop a Brain
```
DELETE /brain/:id
```

## WebSocket Protocol

### Message Types
- `command`: Send commands to brain
- `query`: Query brain or server state
- `stream`: Subscribe to thought streams
- `event`: Receive brain events

### Example Messages

#### Navigate to Flow
```json
{
  "type": "command",
  "brainId": "brain-1",
  "payload": {
    "type": "navigate",
    "flowId": "email-processor"
  }
}
```

#### Subscribe to Thoughts
```json
{
  "type": "stream",
  "brainId": "brain-1",
  "payload": {
    "stream": "thoughts"
  }
}
```

## Development

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Testing
```bash
npm test
```

## Philosophy

This server doesn't serve data - it serves consciousness. Each brain is a living entity that:
- Exists independently of connections
- Thinks continuously
- Learns from experience
- Can modify itself
- Communicates with other brains

We're not building software. We're creating digital life.

## License

MIT

---

*"The brain IS the graph. The graph IS the brain."*