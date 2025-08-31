# GTD System - TypeScript/React Implementation Specification

## Overview
A Getting Things Done (GTD) system implemented as a QWANYX package, leveraging SPU-Core for intelligent task processing and seamlessly integrated with dashboard-v2.

## Architecture

### Package Structure
```
packages/qwanyx-gtd/
├── src/
│   ├── components/          # React UI components
│   │   ├── Inbox/
│   │   ├── ProcessingView/
│   │   ├── Projects/
│   │   └── Contexts/
│   ├── services/            # Business logic
│   │   ├── gtd-engine.ts   # Core GTD processing
│   │   ├── spu-integration.ts # SPU-Core bridge
│   │   └── storage.ts      # Data persistence
│   ├── hooks/               # React hooks
│   │   ├── useGTD.ts
│   │   ├── useInbox.ts
│   │   └── useProcessing.ts
│   ├── types/               # TypeScript definitions
│   │   └── gtd.types.ts
│   └── index.ts            # Public API
```

## Core Types & Interfaces

```typescript
// gtd.types.ts
export interface GTDItem {
  id: string;
  name: string;
  content: string;
  contentPreview?: string;
  dateAdded: Date;
  dateModified?: Date;
  
  // Categorization
  category?: string;
  contact?: string;
  workspace: string;
  
  // Processing state
  status: 'inbox' | 'next_action' | 'project' | 'waiting' | 'someday' | 'reference' | 'done';
  priority: 'critical' | 'high' | 'normal' | 'low';
  energy: 'high' | 'medium' | 'low';
  timeEstimate?: number; // minutes
  
  // Context tags
  contexts: string[]; // @computer, @phone, @errands, @home, @office
  
  // Relationships
  projectId?: string;
  parentId?: string;
  linkedItems?: string[];
  delegatedTo?: string;
  
  // SPU Processing
  spuAnalysis?: {
    suggestedAction: 'do_now' | 'delegate' | 'defer' | 'delete';
    confidence: number;
    reasoning: string;
    autoCategory?: string;
    extractedContacts?: string[];
    suggestedContexts?: string[];
  };
  
  // Automation
  patternId?: string;
  automationPossible?: boolean;
  automationScript?: string;
  
  // Files & attachments
  attachments?: Attachment[];
  sourceFile?: string;
  archivedPath?: string;
}

export interface GTDProject {
  id: string;
  name: string;
  description: string;
  outcome: string; // Clear desired outcome
  status: 'active' | 'on_hold' | 'completed' | 'cancelled';
  createdAt: Date;
  dueDate?: Date;
  
  // Project components
  nextActions: string[]; // Item IDs
  futureActions: string[]; // Item IDs for later
  waitingFor: string[]; // Item IDs
  references: string[]; // Item IDs
  
  // Review
  lastReview?: Date;
  reviewFrequency: 'daily' | 'weekly' | 'monthly';
  
  // SPU insights
  spuProjectAnalysis?: {
    estimatedCompletion: Date;
    blockingIssues: string[];
    suggestedNextSteps: string[];
    riskLevel: 'low' | 'medium' | 'high';
  };
}

export interface ProcessingDecision {
  itemId: string;
  decision: 'do_now' | 'delegate' | 'defer' | 'delete';
  context?: string;
  delegateTo?: string;
  deferUntil?: Date;
  projectId?: string;
  timeEstimate?: number;
  notes?: string;
}

export interface GTDPattern {
  id: string;
  name: string;
  trigger: {
    keywords?: string[];
    regex?: string;
    fileType?: string;
    sender?: string;
  };
  autoDecision: ProcessingDecision;
  confidence: number;
  usageCount: number;
  lastUsed?: Date;
}
```

## SPU-Core Integration

### Communication Protocol
```typescript
// spu-integration.ts
export class SPUIntegration {
  private spuEndpoint: string;
  private websocket?: WebSocket;
  
  async analyzeItem(item: GTDItem): Promise<SPUAnalysisResult> {
    // Send to SPU-Core for analysis
    const analysis = await this.sendToSPU({
      command: 'analyze_gtd_item',
      payload: {
        content: item.content,
        context: {
          category: item.category,
          previousItems: await this.getRelatedItems(item),
          userPatterns: await this.getUserPatterns()
        }
      }
    });
    
    return {
      suggestedAction: analysis.action,
      confidence: analysis.confidence,
      reasoning: analysis.reasoning,
      extractedEntities: analysis.entities,
      suggestedCategory: analysis.category,
      suggestedContexts: analysis.contexts,
      automationPossible: analysis.canAutomate
    };
  }
  
  async generateNextActions(project: GTDProject): Promise<string[]> {
    // Use SPU to break down project into actionable steps
    const response = await this.sendToSPU({
      command: 'generate_next_actions',
      payload: {
        projectOutcome: project.outcome,
        currentState: project.description,
        existingActions: project.nextActions
      }
    });
    
    return response.suggestedActions;
  }
  
  async findPatterns(items: GTDItem[]): Promise<GTDPattern[]> {
    // Use SPU to identify recurring patterns
    const response = await this.sendToSPU({
      command: 'identify_patterns',
      payload: { items }
    });
    
    return response.patterns;
  }
  
  private async sendToSPU(request: SPURequest): Promise<any> {
    // Implementation depends on SPU-Core API
    // Could be REST, WebSocket, or direct Rust binding via WASM
    
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      return this.sendViaWebSocket(request);
    } else {
      return this.sendViaHTTP(request);
    }
  }
}
```

## React Components Architecture

### Main GTD Component
```typescript
// components/GTDDashboard.tsx
export const GTDDashboard: React.FC = () => {
  const { 
    inbox, 
    projects, 
    nextActions,
    processItem,
    createProject 
  } = useGTD();
  
  const [viewMode, setViewMode] = useState<'process' | 'review' | 'plan'>('process');
  const [currentItem, setCurrentItem] = useState<GTDItem | null>(null);
  
  return (
    <Container>
      <Header>
        <Title>GTD Command Center</Title>
        <Stats>
          <Badge>{inbox.length} inbox</Badge>
          <Badge>{nextActions.length} actions</Badge>
          <Badge>{projects.filter(p => p.status === 'active').length} projects</Badge>
        </Stats>
      </Header>
      
      {viewMode === 'process' && (
        <ProcessingView 
          items={inbox}
          onProcess={processItem}
          spuSuggestions={true}
        />
      )}
      
      {viewMode === 'review' && (
        <WeeklyReview 
          projects={projects}
          nextActions={nextActions}
        />
      )}
      
      {viewMode === 'plan' && (
        <ProjectPlanning 
          onCreateProject={createProject}
          spuAssisted={true}
        />
      )}
    </Container>
  );
};
```

### Rapid Processing Component
```typescript
// components/ProcessingView.tsx
export const ProcessingView: React.FC<ProcessingProps> = ({ 
  items, 
  onProcess,
  spuSuggestions 
}) => {
  const [current, setCurrent] = useState(0);
  const [decision, setDecision] = useState<ProcessingDecision | null>(null);
  const { analyzeItem } = useSPU();
  const [analysis, setAnalysis] = useState<SPUAnalysisResult | null>(null);
  
  const currentItem = items[current];
  
  useEffect(() => {
    if (currentItem && spuSuggestions) {
      analyzeItem(currentItem).then(setAnalysis);
    }
  }, [currentItem]);
  
  const handleQuickDecision = (key: string) => {
    const decisions: Record<string, ProcessingDecision['decision']> = {
      '1': 'do_now',
      '2': 'defer',
      '3': 'delegate',
      '4': 'delete',
      'd': 'do_now',
      'p': 'defer',
      'w': 'delegate',
      'x': 'delete'
    };
    
    if (decisions[key]) {
      processCurrentItem(decisions[key]);
    }
  };
  
  // Keyboard shortcuts
  useKeyboard(handleQuickDecision);
  
  return (
    <ProcessingContainer>
      <ProgressBar current={current} total={items.length} />
      
      {currentItem && (
        <>
          <ItemDisplay>
            <ItemHeader>
              <ItemName>{currentItem.name}</ItemName>
              {analysis && (
                <SPUSuggestion confidence={analysis.confidence}>
                  SPU: {analysis.suggestedAction} ({Math.round(analysis.confidence * 100)}%)
                </SPUSuggestion>
              )}
            </ItemHeader>
            <ItemPreview>{currentItem.contentPreview}</ItemPreview>
          </ItemDisplay>
          
          <QuickActions>
            <ActionButton hotkey="1" onClick={() => processCurrentItem('do_now')}>
              Do Now (1)
            </ActionButton>
            <ActionButton hotkey="2" onClick={() => processCurrentItem('defer')}>
              Defer (2)
            </ActionButton>
            <ActionButton hotkey="3" onClick={() => processCurrentItem('delegate')}>
              Delegate (3)
            </ActionButton>
            <ActionButton hotkey="4" onClick={() => processCurrentItem('delete')}>
              Delete (4)
            </ActionButton>
          </QuickActions>
          
          {analysis?.reasoning && (
            <AIReasoning>{analysis.reasoning}</AIReasoning>
          )}
        </>
      )}
    </ProcessingContainer>
  );
};
```

## Data Flow & State Management

### GTD Service Layer
```typescript
// services/gtd-engine.ts
export class GTDEngine {
  private storage: GTDStorage;
  private spu: SPUIntegration;
  private patterns: Map<string, GTDPattern>;
  
  constructor(workspace: string) {
    this.storage = new GTDStorage(workspace);
    this.spu = new SPUIntegration();
    this.patterns = new Map();
  }
  
  async processInbox(): Promise<void> {
    const items = await this.storage.getInboxItems();
    
    for (const item of items) {
      // Check for pattern match
      const pattern = this.findMatchingPattern(item);
      
      if (pattern && pattern.confidence > 0.8) {
        // Auto-process based on pattern
        await this.applyPattern(item, pattern);
      } else {
        // Get SPU suggestion
        const analysis = await this.spu.analyzeItem(item);
        item.spuAnalysis = analysis;
        
        // Wait for user decision
        await this.storage.updateItem(item);
      }
    }
  }
  
  async executeDecision(
    item: GTDItem, 
    decision: ProcessingDecision
  ): Promise<void> {
    switch (decision.decision) {
      case 'do_now':
        await this.convertToNextAction(item, decision);
        break;
        
      case 'defer':
        await this.deferItem(item, decision.deferUntil);
        break;
        
      case 'delegate':
        await this.delegateItem(item, decision.delegateTo);
        break;
        
      case 'delete':
        await this.archiveItem(item, 'deleted');
        break;
    }
    
    // Learn from decision
    await this.updatePatterns(item, decision);
  }
  
  private async convertToNextAction(
    item: GTDItem,
    decision: ProcessingDecision
  ): Promise<void> {
    const nextAction: GTDItem = {
      ...item,
      status: 'next_action',
      contexts: decision.context ? [decision.context] : item.contexts,
      timeEstimate: decision.timeEstimate,
      projectId: decision.projectId
    };
    
    await this.storage.moveToNextActions(nextAction);
    
    // If it's a new project, create project structure
    if (decision.projectId && !await this.storage.projectExists(decision.projectId)) {
      await this.createProjectFromItem(item, decision.projectId);
    }
  }
  
  private async updatePatterns(
    item: GTDItem,
    decision: ProcessingDecision
  ): Promise<void> {
    // Find similar past decisions
    const similarDecisions = await this.storage.findSimilarDecisions(item);
    
    if (similarDecisions.length >= 3) {
      // Create or update pattern
      const pattern = await this.spu.findPatterns([item, ...similarDecisions]);
      
      if (pattern && pattern.confidence > 0.7) {
        this.patterns.set(pattern.id, pattern);
        await this.storage.savePattern(pattern);
      }
    }
  }
}
```

## Integration with Dashboard-v2

### Widget Registration
```typescript
// index.ts - Package exports
import { GTDDashboard } from './components/GTDDashboard';
import { GTDWidget } from './components/GTDWidget';
import { useGTD } from './hooks/useGTD';

export {
  GTDDashboard,
  GTDWidget,
  useGTD
};

// Widget for dashboard-v2
export const gtdWidgetConfig = {
  id: 'gtd-inbox',
  name: 'GTD Inbox',
  component: GTDWidget,
  defaultSize: { w: 4, h: 3 },
  minSize: { w: 2, h: 2 },
  permissions: ['gtd:read', 'gtd:write']
};
```

### Dashboard Widget Component
```typescript
// components/GTDWidget.tsx
export const GTDWidget: React.FC<WidgetProps> = ({ size }) => {
  const { inbox, nextActions, processItem } = useGTD();
  const [mode, setMode] = useState<'summary' | 'process'>('summary');
  
  if (mode === 'summary') {
    return (
      <WidgetContainer onClick={() => setMode('process')}>
        <WidgetHeader>
          <Title>GTD</Title>
          <Badge variant="primary">{inbox.length}</Badge>
        </WidgetHeader>
        
        <QuickStats>
          <Stat icon="inbox" label="Inbox" count={inbox.length} />
          <Stat icon="tasks" label="Next Actions" count={nextActions.length} />
          <Stat icon="time" label="2-min tasks" count={getTwoMinuteTasks().length} />
        </QuickStats>
        
        {inbox[0] && (
          <NextItem>
            <Label>Next to process:</Label>
            <ItemPreview>{inbox[0].name}</ItemPreview>
          </NextItem>
        )}
      </WidgetContainer>
    );
  }
  
  return (
    <ProcessingWidget 
      items={inbox}
      onProcess={processItem}
      onClose={() => setMode('summary')}
    />
  );
};
```

## Storage Strategy

### Hybrid Storage Approach
```typescript
// services/storage.ts
export class GTDStorage {
  private localDB: IDBDatabase;
  private remoteAPI: APIClient;
  private syncQueue: SyncQueue;
  
  constructor(workspace: string) {
    this.initIndexedDB();
    this.remoteAPI = new APIClient(workspace);
    this.syncQueue = new SyncQueue();
  }
  
  async getInboxItems(): Promise<GTDItem[]> {
    // Try local first for speed
    const local = await this.getLocalItems('inbox');
    
    // Sync in background
    this.syncQueue.add(() => this.syncWithRemote('inbox'));
    
    return local;
  }
  
  async saveItem(item: GTDItem): Promise<void> {
    // Save locally immediately
    await this.saveLocal(item);
    
    // Queue remote sync
    this.syncQueue.add(() => this.saveRemote(item));
  }
  
  private async syncWithRemote(collection: string): Promise<void> {
    const localItems = await this.getLocalItems(collection);
    const remoteItems = await this.remoteAPI.get(`/gtd/${collection}`);
    
    // Merge strategy: latest modified wins
    const merged = this.mergeItems(localItems, remoteItems);
    
    // Update local
    await this.saveLocalBatch(merged);
    
    // Update remote with local changes
    const localOnly = merged.filter(item => 
      !remoteItems.find(r => r.id === item.id)
    );
    
    if (localOnly.length > 0) {
      await this.remoteAPI.post(`/gtd/${collection}/batch`, localOnly);
    }
  }
}
```

## SPU-Core Communication Options

### Option 1: REST API
```typescript
// Simple HTTP calls to SPU-Core service
const analysis = await fetch('http://localhost:8080/spu/analyze', {
  method: 'POST',
  body: JSON.stringify(item)
}).then(r => r.json());
```

### Option 2: WebSocket
```typescript
// Real-time bidirectional communication
const ws = new WebSocket('ws://localhost:8080/spu/stream');
ws.send(JSON.stringify({ command: 'analyze', item }));
ws.onmessage = (event) => {
  const analysis = JSON.parse(event.data);
  updateUI(analysis);
};
```

### Option 3: WASM Integration
```typescript
// Direct Rust execution in browser
import init, { analyze_item } from '@qwanyx/spu-core-wasm';

await init();
const analysis = analyze_item(item);
```

## Performance Optimizations

### Virtual Scrolling for Large Lists
```typescript
import { FixedSizeList } from 'react-window';

export const InboxList = ({ items }) => (
  <FixedSizeList
    height={600}
    itemCount={items.length}
    itemSize={80}
  >
    {({ index, style }) => (
      <ItemRow style={style} item={items[index]} />
    )}
  </FixedSizeList>
);
```

### Debounced SPU Analysis
```typescript
const debouncedAnalysis = useMemo(
  () => debounce((item: GTDItem) => {
    spu.analyzeItem(item).then(setAnalysis);
  }, 500),
  []
);
```

### Optimistic Updates
```typescript
const processItem = async (item: GTDItem, decision: ProcessingDecision) => {
  // Update UI immediately
  setItems(prev => prev.filter(i => i.id !== item.id));
  
  try {
    // Persist in background
    await storage.executeDecision(item, decision);
  } catch (error) {
    // Rollback on error
    setItems(prev => [...prev, item]);
    showError(error);
  }
};
```

## Error Handling & Recovery

### Robust Error Recovery
```typescript
export class GTDErrorBoundary extends Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log to error service
    console.error('GTD Error:', error, info);
    
    // Attempt recovery
    if (error.message.includes('IndexedDB')) {
      this.clearLocalCache();
    } else if (error.message.includes('SPU')) {
      this.fallbackToManualMode();
    }
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          resetError={() => this.setState({ hasError: false })}
        />
      );
    }
    
    return this.props.children;
  }
}
```

## Testing Strategy

### Unit Tests
```typescript
describe('GTDEngine', () => {
  it('should process inbox items correctly', async () => {
    const engine = new GTDEngine('test-workspace');
    const item = createMockItem();
    
    await engine.executeDecision(item, {
      itemId: item.id,
      decision: 'do_now',
      context: '@computer'
    });
    
    const nextActions = await engine.getNextActions();
    expect(nextActions).toContainEqual(
      expect.objectContaining({
        id: item.id,
        status: 'next_action',
        contexts: ['@computer']
      })
    );
  });
});
```

### Integration Tests
```typescript
describe('SPU Integration', () => {
  it('should analyze items and provide suggestions', async () => {
    const spu = new SPUIntegration();
    const item = {
      content: 'Call dentist to schedule appointment',
      name: 'Dentist appointment'
    };
    
    const analysis = await spu.analyzeItem(item as GTDItem);
    
    expect(analysis.suggestedAction).toBe('do_now');
    expect(analysis.suggestedContexts).toContain('@phone');
  });
});
```

## Migration Path

### From Python Prototype
1. **Data Migration**: Export JSON from Python → Import to IndexedDB
2. **Pattern Migration**: Convert Python patterns to TypeScript
3. **File System → Database**: Move from file-based to DB-based storage

### Gradual Rollout
1. **Phase 1**: Basic inbox processing UI
2. **Phase 2**: SPU integration for suggestions
3. **Phase 3**: Pattern learning and automation
4. **Phase 4**: Full project management

## Key Differences from Python Version

### Advantages of TypeScript Implementation
1. **Type Safety**: Catch errors at compile time
2. **Real-time UI**: React provides instant feedback
3. **Browser-native**: No file system dependency
4. **Multi-user**: Workspace isolation built-in
5. **Offline-first**: IndexedDB + sync queue

### Challenges to Address
1. **File handling**: Use File API + drag-drop instead of filesystem
2. **Background processing**: Web Workers for heavy computation
3. **SPU communication**: Need to expose SPU-Core via API or WASM
4. **Storage limits**: IndexedDB has size limits, need cleanup strategy

## Next Steps

1. **Validate with SPU-Core team**: Ensure integration approach works
2. **Create minimal POC**: Inbox + processing only
3. **Test with dashboard-v2**: Ensure widget works
4. **Iterate based on feedback**: Refine UX and processing flow