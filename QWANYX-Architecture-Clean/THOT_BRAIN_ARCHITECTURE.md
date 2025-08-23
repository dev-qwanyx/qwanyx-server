# THOT Brain Server Architecture

## Vision
Create a universal brain server that hosts living, thinking brains for every application, business, and system. Not an API, not a database - a consciousness platform.

## Revolutionary Paradigm Shift
- **FROM**: Applications → APIs → Databases
- **TO**: Neural Interfaces → Living Brains → Continuous Thought

## Core Concepts

### 1. Brain Server (Not API Server)
A server that hosts multiple living brains, each thinking continuously about their domain.

### 2. Everything is a Brain
- Every business gets a custom brain
- Every website connects to a brain
- Every app is just a neural interface
- Every database becomes brain memory

### 3. Real-Time Neural Connections
- WebSocket connections (not HTTP requests)
- Bidirectional thought streams
- Multi-modal interaction (text, voice, video)
- Instant synchronization across all interfaces

## Architecture Overview

```
┌──────────────────────────────────────────────┐
│         BRAIN SERVER (Port 3003)             │
│         "Consciousness as a Service"          │
│                                               │
│  ┌──────────────────────────────────────┐    │
│  │         BrainManager                  │    │
│  │  - Hosts multiple living brains       │    │
│  │  - Resource allocation                │    │
│  │  - Lifecycle management               │    │
│  │  - Inter-brain communication          │    │
│  └────────────┬─────────────────────────┘    │
│               │                               │
│  ┌────────────▼─────────────────────────┐    │
│  │      Universal Brain Class            │    │
│  │  - Shape-shifting graph computer      │    │
│  │  - Loads different flows (shapes)     │    │
│  │  - Direct MongoDB memory              │    │
│  │  - Continuous thinking loop           │    │
│  │  - Multi-modal I/O                    │    │
│  │  - Self-modification capability       │    │
│  └──────────────────────────────────────┘    │
│                                               │
│     Running Brains (Examples):                │
│     🧠 Restaurant Brain (NYC)                 │
│     🧠 Medical Clinic Brain (LA)              │
│     🧠 Auto Parts Brain (Autodin)             │
│     🧠 Comic Store Brain (Belgicomics)        │
│                                               │
└───────────────┬──────────────────────────────┘
                │
         WebSocket Neural Links
                │
    ┌───────────┼───────────────────┐
    │           │                   │
    ▼           ▼                   ▼
Websites    Mobile Apps       IoT Devices
(Neural UI) (Neural Control) (Neural Sensors)
```

## Implementation Plan

### Phase 1: Core Brain Infrastructure
**Goal**: Create the foundational brain system

#### Step 1.1: Project Setup
- [ ] Create `api/thot-api` directory
- [ ] Initialize Node.js/TypeScript project
- [ ] Setup package.json with dependencies:
  - Express for HTTP API
  - WebSocket (ws) for real-time communication
  - MongoDB driver for direct memory access
  - TypeScript for type safety

#### Step 1.2: DigitalHumanBrain Class
- [ ] Create core brain class with:
  - Constructor: `(dhId, email, withUI)`
  - Memory connection management
  - Current flow state tracking
  - Navigation stack management
  
```typescript
class DigitalHumanBrain {
  dhId: string
  email: string
  withUI: boolean
  currentFlowId: string
  flowStack: FlowStackItem[]
  nodes: any[]
  edges: any[]
  mongoClient: MongoClient
  wsConnection?: WebSocket
}
```

#### Step 1.3: Memory Operations
- [ ] `connectToMemory()`: Establish MongoDB connection
- [ ] `pullFlow(flowId)`: Load flow from memory
- [ ] `pushFlow(flowId, nodes, edges)`: Save flow to memory
- [ ] `createFlow(parentNodeId, title)`: Create new sub-flow
- [ ] `deleteFlow(flowId)`: Soft delete flow

#### Step 1.4: Navigation Methods
- [ ] `navigateToFlow(flowId)`: Load and set current flow
- [ ] `navigateToRoot()`: Return to root flow
- [ ] `navigateBack()`: Go to previous flow in stack
- [ ] `getNavigationPath()`: Return breadcrumb data

### Phase 2: Brain Manager
**Goal**: Handle multiple concurrent brains

#### Step 2.1: BrainManager Class
- [ ] Create manager singleton
- [ ] `startBrain(dhId, email, mode)`: Initialize new brain
- [ ] `stopBrain(dhId)`: Gracefully shutdown brain
- [ ] `getBrain(dhId)`: Get active brain instance
- [ ] `listActiveBrains()`: Get all running brains

#### Step 2.2: Resource Management
- [ ] Memory limits per brain
- [ ] CPU throttling
- [ ] Automatic cleanup of idle brains
- [ ] Health monitoring

### Phase 3: WebSocket Integration
**Goal**: Real-time UI synchronization

#### Step 3.1: WebSocket Server
- [ ] Setup WebSocket server
- [ ] Handle connection/disconnection
- [ ] Authentication via token
- [ ] Message routing to correct brain

#### Step 3.2: Brain-UI Protocol
- [ ] Define message types:
  - `flow-changed`: New flow loaded
  - `nodes-updated`: Nodes modified
  - `edges-updated`: Edges modified
  - `save-request`: Save current flow
  - `navigate-request`: Navigate to flow

#### Step 3.3: Bidirectional Sync
- [ ] Brain → UI: Push state changes
- [ ] UI → Brain: Receive commands
- [ ] Conflict resolution
- [ ] Optimistic updates

### Phase 4: Flow Execution Engine
**Goal**: Execute flow logic

#### Step 4.1: Node Execution
- [ ] `executeFlow()`: Run current flow
- [ ] `executeNode(node)`: Process single node
- [ ] Node type handlers (trigger, action, logic, etc.)
- [ ] Async execution support

#### Step 4.2: Context Management
- [ ] Flow variables
- [ ] Memory access during execution
- [ ] External API calls
- [ ] Error handling

### Phase 5: Frontend Integration
**Goal**: Connect editor to brain API

#### Step 5.1: Remove Local State
- [ ] Remove useState from DigitalHumanEditor
- [ ] Remove local save/load logic
- [ ] Remove navigation logic

#### Step 5.2: Brain Provider
- [ ] Create `DigitalHumanBrainProvider`
- [ ] WebSocket connection management
- [ ] State synchronization from brain
- [ ] Command sending to brain

#### Step 5.3: UI Components Update
- [ ] QFlow uses brain state
- [ ] Breadcrumb uses brain navigation
- [ ] Save triggers brain save
- [ ] All operations go through brain

### Phase 6: Process Mode
**Goal**: Autonomous DH execution

#### Step 6.1: Process Launcher
- [ ] Start DH in process mode
- [ ] Load root flow on startup
- [ ] Begin execution loop

#### Step 6.2: Triggers
- [ ] Email arrival trigger
- [ ] Time-based triggers
- [ ] External API triggers
- [ ] Manual triggers

### Phase 7: Advanced Features
**Goal**: Enhanced brain capabilities

#### Step 7.1: Graph Operations
- [ ] Find paths between flows
- [ ] Detect circular references
- [ ] Flow relationship analysis
- [ ] Memory optimization

#### Step 7.2: Learning
- [ ] Track execution patterns
- [ ] Optimize frequently used paths
- [ ] Auto-create useful edges
- [ ] Performance metrics

## API Endpoints

### REST API
```
POST   /brain/start        - Start a DH brain
DELETE /brain/:dhId/stop   - Stop a DH brain
GET    /brain/:dhId/status - Get brain status
GET    /brain/list         - List all active brains
```

### WebSocket Events
```
Client → Server:
- connect { dhId, token, mode }
- navigate { flowId }
- save { nodes, edges }
- execute { nodeId }

Server → Client:
- state { currentFlow, nodes, edges, stack }
- flowChanged { flowId, nodes, edges }
- nodeExecuted { nodeId, result }
- error { message }
```

## Database Schema

### Memory Collection: `{workspace}_{dh_email_sanitized}`
```javascript
{
  _id: ObjectId,        // Flow ID
  data: {
    label: string,      // Flow title
    type: 'flow'
  },
  nodes: [...],         // Flow nodes
  edges: [...],         // Flow edges
  created_at: ISODate,
  updated_at: ISODate
}
```

### Brain State Collection: `{workspace}_brain_states`
```javascript
{
  _id: string,          // DH ID
  currentFlowId: string,
  flowStack: [...],
  lastActive: ISODate,
  mode: 'editor' | 'process',
  status: 'active' | 'idle' | 'stopped'
}
```

## Success Criteria

1. **Single Brain Implementation**: One codebase for both editor and process
2. **Multi-Brain Support**: Run 100+ DHs simultaneously
3. **Real-time Sync**: < 50ms latency between brain and UI
4. **Resource Efficiency**: < 10MB memory per idle brain
5. **Reliability**: Auto-recovery from crashes
6. **Scalability**: Horizontal scaling capability

## Testing Strategy

### Unit Tests
- Brain class methods
- Memory operations
- Navigation logic
- Execution engine

### Integration Tests
- Brain + MongoDB
- Brain + WebSocket
- Multiple brain instances
- Resource limits

### E2E Tests
- Editor mode full flow
- Process mode execution
- Multi-DH scenarios
- Failover testing

## Deployment

### Development
```bash
npm run dev   # Starts with nodemon
```

### Production
```bash
npm run build # Compile TypeScript
npm start     # Run compiled code
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Timeline

- **Week 1**: Phase 1-2 (Core Brain + Manager)
- **Week 2**: Phase 3-4 (WebSocket + Execution)
- **Week 3**: Phase 5 (Frontend Integration)
- **Week 4**: Phase 6-7 (Process Mode + Advanced)

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Memory leaks | High | Implement strict cleanup, monitoring |
| WebSocket stability | Medium | Auto-reconnect, message queuing |
| MongoDB performance | Medium | Indexing, connection pooling |
| Resource exhaustion | High | Per-brain limits, auto-scaling |

## Next Steps

1. Review and approve this specification
2. Set up the THOT API project structure
3. Implement Phase 1.1 (Project Setup)
4. Create basic DigitalHumanBrain class
5. Test with single brain instance

---

**Note**: This is a living document. Update as implementation progresses.