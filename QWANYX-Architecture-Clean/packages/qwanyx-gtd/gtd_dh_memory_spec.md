# GTD as Digital Human - Memory-Based Architecture Specification

## Core Concept
Each user's GTD system operates as a personal Digital Human (DH) with its own memory space, learning patterns, and intelligent task processing powered by SPU-Core.

## Memory Architecture

### User Memory Space Structure
```typescript
// Memory path structure for each user
// workspace/{workspace_id}/users/{user_email}/gtd/memory/

interface GTDUserMemory {
  workspace: string;           // e.g., "autodin", "belgicomics"
  userEmail: string;           // User's unique identifier
  memorySpace: {
    // Short-term memory (current processing)
    workingMemory: {
      currentInbox: GTDItem[];
      activeDecisions: ProcessingDecision[];
      recentPatterns: Pattern[];
    };
    
    // Long-term memory (learned patterns and history)
    longTermMemory: {
      learnedPatterns: Map<string, GTDPattern>;
      projectHistory: GTDProject[];
      contactRelationships: ContactMemory[];
      categoryPreferences: CategoryPattern[];
    };
    
    // Episodic memory (past interactions)
    episodicMemory: {
      pastDecisions: DecisionRecord[];
      completedTasks: GTDItem[];
      archivedProjects: GTDProject[];
    };
    
    // Semantic memory (knowledge base)
    semanticMemory: {
      categories: CategoryTree;
      contexts: ContextDefinition[];
      automationScripts: AutomationLibrary;
      documentTemplates: Template[];
    };
  };
}
```

## SPU-Core Integration with Document Processing

### Document Processor Module
```typescript
interface DocumentProcessor {
  // S3 integration for document storage
  s3Config: {
    bucket: string;  // workspace-specific bucket
    region: string;
    prefix: string;  // users/{email}/gtd/documents/
  };
  
  // Document analysis capabilities
  capabilities: {
    textExtraction: boolean;
    ocr: boolean;
    entityRecognition: boolean;
    summarization: boolean;
    classification: boolean;
  };
}

// Document processing pipeline
class SPUDocumentProcessor {
  private s3: S3Client;
  private spu: SPUCore;
  
  async processDocument(
    file: File,
    userMemory: GTDUserMemory
  ): Promise<ProcessedDocument> {
    // Step 1: Upload to S3
    const s3Key = await this.uploadToS3(file, userMemory);
    
    // Step 2: Extract content
    const content = await this.extractContent(s3Key);
    
    // Step 3: SPU analysis with user's memory context
    const analysis = await this.spu.analyzeWithMemory({
      content,
      memoryContext: userMemory.memorySpace,
      command: 'analyze_document_for_gtd'
    });
    
    // Step 4: Create GTD item with enriched metadata
    return {
      gtdItem: {
        id: generateId(),
        name: file.name,
        content: content.text,
        s3Location: s3Key,
        
        // SPU-extracted metadata
        category: analysis.suggestedCategory,
        contacts: analysis.extractedContacts,
        actionableItems: analysis.extractedTasks,
        deadlines: analysis.extractedDates,
        priority: analysis.inferredPriority,
        
        // Memory-based suggestions
        similarPastItems: analysis.similarFromMemory,
        suggestedProject: analysis.projectMatch,
        automationPossible: analysis.canAutomate
      },
      
      // Store in user's memory
      memoryUpdate: {
        type: 'document_processed',
        timestamp: new Date(),
        learning: analysis.patternToLearn
      }
    };
  }
  
  private async uploadToS3(file: File, memory: GTDUserMemory): Promise<string> {
    const key = `${memory.workspace}/users/${memory.userEmail}/gtd/documents/${Date.now()}-${file.name}`;
    
    await this.s3.putObject({
      Bucket: this.s3Config.bucket,
      Key: key,
      Body: file,
      Metadata: {
        'user-email': memory.userEmail,
        'workspace': memory.workspace,
        'upload-date': new Date().toISOString()
      }
    });
    
    return key;
  }
}
```

## AI-Powered Task Ordering

### SPU Task Intelligence
```typescript
interface TaskOrderingSystem {
  // Factors for intelligent ordering
  orderingFactors: {
    urgency: number;        // Deadline proximity
    importance: number;     // Impact level
    energy: number;         // Required energy vs available
    context: number;        // Current context match
    dependencies: number;   // Blocking other tasks
    momentum: number;       // Similar to recent completions
    learning: number;       // Opportunity to learn patterns
  };
}

class SPUTaskOrderer {
  private spu: SPUCore;
  private userMemory: GTDUserMemory;
  
  async getOptimalTaskOrder(
    tasks: GTDItem[],
    currentContext: UserContext
  ): Promise<OrderedTask[]> {
    // Send to SPU with user's memory and current context
    const response = await this.spu.process({
      command: 'optimize_task_order',
      payload: {
        tasks,
        userMemory: this.userMemory.memorySpace,
        context: {
          timeAvailable: currentContext.timeAvailable,
          energyLevel: currentContext.energyLevel,
          location: currentContext.location,
          devices: currentContext.availableDevices,
          mood: currentContext.mood
        }
      }
    });
    
    return response.orderedTasks.map(task => ({
      ...task,
      reasoning: response.reasoning[task.id],
      estimatedCompletionTime: response.timeEstimates[task.id],
      suggestedApproach: response.approaches[task.id]
    }));
  }
  
  async learnFromCompletion(
    task: GTDItem,
    completion: CompletionData
  ): Promise<void> {
    // Update user's memory with completion pattern
    await this.spu.updateMemory({
      userEmail: this.userMemory.userEmail,
      workspace: this.userMemory.workspace,
      memoryUpdate: {
        type: 'task_completion_pattern',
        data: {
          task,
          actualTime: completion.actualTime,
          energyUsed: completion.energyLevel,
          context: completion.context,
          satisfaction: completion.satisfaction
        }
      }
    });
  }
}
```

## Memory-Based Learning System

### Pattern Recognition and Learning
```typescript
interface MemoryLearning {
  // Learn from user decisions
  decisionPatterns: {
    trigger: string;           // What triggered the decision
    decision: string;          // What decision was made
    context: any;              // Context when decision was made
    outcome: 'positive' | 'negative' | 'neutral';
    confidence: number;
  }[];
  
  // Learn from document processing
  documentPatterns: {
    documentType: string;
    commonActions: string[];
    typicalCategory: string;
    averageProcessingTime: number;
  }[];
  
  // Learn from task completion
  completionPatterns: {
    taskType: string;
    bestTimeOfDay: string;
    averageDuration: number;
    preferredContext: string;
    successRate: number;
  }[];
}

class GTDMemoryLearner {
  private spu: SPUCore;
  
  async learnFromInteraction(
    interaction: UserInteraction,
    userMemory: GTDUserMemory
  ): Promise<MemoryUpdate> {
    // Analyze interaction with existing memory
    const learning = await this.spu.analyzePattern({
      newData: interaction,
      existingMemory: userMemory.memorySpace.longTermMemory,
      command: 'extract_gtd_pattern'
    });
    
    if (learning.confidence > 0.7) {
      // Update long-term memory
      return {
        type: 'pattern_learned',
        pattern: learning.pattern,
        updates: {
          longTermMemory: {
            learnedPatterns: new Map([
              ...userMemory.memorySpace.longTermMemory.learnedPatterns,
              [learning.pattern.id, learning.pattern]
            ])
          }
        }
      };
    }
    
    // Store in episodic memory for future learning
    return {
      type: 'episodic_storage',
      updates: {
        episodicMemory: {
          pastDecisions: [
            ...userMemory.memorySpace.episodicMemory.pastDecisions,
            interaction
          ]
        }
      }
    };
  }
}
```

## React Components with Memory Context

### GTD Component with User Memory
```typescript
// hooks/useGTDMemory.ts
export const useGTDMemory = () => {
  const { user, workspace } = useAuth();
  const [memory, setMemory] = useState<GTDUserMemory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (user?.email && workspace) {
      loadUserMemory(workspace, user.email).then(mem => {
        setMemory(mem);
        setIsLoading(false);
      });
    }
  }, [user, workspace]);
  
  const updateMemory = useCallback(async (update: MemoryUpdate) => {
    if (!memory) return;
    
    const updated = await applyMemoryUpdate(memory, update);
    setMemory(updated);
    
    // Persist to backend
    await saveUserMemory(updated);
  }, [memory]);
  
  return { memory, isLoading, updateMemory };
};

// components/GTDDashboard.tsx
export const GTDDashboard: React.FC = () => {
  const { memory, updateMemory } = useGTDMemory();
  const { analyzeWithMemory } = useSPU();
  
  const processItem = async (item: GTDItem) => {
    // Process with user's memory context
    const decision = await analyzeWithMemory(item, memory);
    
    // Learn from the decision
    await updateMemory({
      type: 'decision_made',
      data: { item, decision }
    });
    
    return decision;
  };
  
  if (!memory) return <Loading />;
  
  return (
    <Container>
      <MemoryStatus memory={memory} />
      <InboxProcessor 
        items={memory.memorySpace.workingMemory.currentInbox}
        onProcess={processItem}
        learnedPatterns={memory.memorySpace.longTermMemory.learnedPatterns}
      />
    </Container>
  );
};
```

## Data Storage Strategy

### Multi-Layer Storage
```typescript
interface StorageStrategy {
  // Layer 1: Working Memory (Redux/Zustand)
  workingMemory: {
    store: 'redux';
    persistence: false;
    ttl: 'session';
  };
  
  // Layer 2: Local Cache (IndexedDB)
  localCache: {
    store: 'indexeddb';
    persistence: true;
    ttl: '7days';
    size: '100MB';
  };
  
  // Layer 3: User Memory (MongoDB)
  userMemory: {
    store: 'mongodb';
    collection: 'user_memories';
    schema: {
      _id: 'workspace:email',
      memory: GTDUserMemory,
      lastModified: Date,
      version: number
    };
  };
  
  // Layer 4: Document Storage (S3)
  documentStorage: {
    store: 's3';
    bucket: 'qwanyx-gtd-documents';
    structure: 'workspace/users/email/documents/';
    lifecycle: {
      current: 'STANDARD',
      after30Days: 'STANDARD_IA',
      after90Days: 'GLACIER'
    };
  };
}
```

## API Endpoints

### GTD Memory API
```typescript
// API endpoints for GTD with memory
interface GTDMemoryAPI {
  // Memory management
  '/api/gtd/memory/:workspace/:email': {
    GET: () => GTDUserMemory;
    PUT: (memory: GTDUserMemory) => void;
    PATCH: (update: MemoryUpdate) => GTDUserMemory;
  };
  
  // Document processing
  '/api/gtd/documents/process': {
    POST: (file: FormData, workspace: string, email: string) => ProcessedDocument;
  };
  
  // Task ordering
  '/api/gtd/tasks/order': {
    POST: (tasks: GTDItem[], context: UserContext) => OrderedTask[];
  };
  
  // Pattern learning
  '/api/gtd/learn': {
    POST: (interaction: UserInteraction) => MemoryUpdate;
  };
  
  // SPU analysis with memory
  '/api/gtd/analyze': {
    POST: (item: GTDItem, memoryContext: GTDUserMemory) => SPUAnalysis;
  };
}
```

## Implementation Phases

### Phase 1: Memory Foundation
```typescript
// 1. Setup user memory structure
// 2. Create memory persistence layer
// 3. Implement basic CRUD operations

const initializeUserMemory = async (workspace: string, email: string) => {
  const memoryId = `${workspace}:${email}`;
  
  const existingMemory = await db.collection('user_memories').findOne({ _id: memoryId });
  
  if (!existingMemory) {
    const newMemory: GTDUserMemory = {
      workspace,
      userEmail: email,
      memorySpace: createEmptyMemorySpace()
    };
    
    await db.collection('user_memories').insertOne({
      _id: memoryId,
      ...newMemory,
      createdAt: new Date(),
      lastModified: new Date()
    });
    
    return newMemory;
  }
  
  return existingMemory;
};
```

### Phase 2: Document Processor
```typescript
// 1. Integrate S3 for document storage
// 2. Implement content extraction
// 3. Connect to SPU for analysis

const setupDocumentProcessor = () => {
  return new SPUDocumentProcessor({
    s3Config: {
      bucket: process.env.GTD_S3_BUCKET!,
      region: process.env.AWS_REGION!
    },
    spuEndpoint: process.env.SPU_CORE_ENDPOINT!
  });
};
```

### Phase 3: Intelligent Ordering
```typescript
// 1. Implement task scoring algorithm
// 2. Add context awareness
// 3. Learn from user preferences

const taskOrderer = new SPUTaskOrderer({
  spuEndpoint: process.env.SPU_CORE_ENDPOINT!,
  learningEnabled: true
});
```

### Phase 4: Pattern Learning
```typescript
// 1. Implement pattern detection
// 2. Store learned patterns
// 3. Apply patterns automatically

const learner = new GTDMemoryLearner({
  minConfidence: 0.7,
  minOccurrences: 3
});
```

## Security & Privacy

### Memory Isolation
```typescript
// Each user's memory is completely isolated
const memoryAccess = {
  // User can only access their own memory
  read: async (workspace: string, email: string, requestingUser: string) => {
    if (email !== requestingUser) {
      throw new ForbiddenError('Cannot access other user memories');
    }
    return loadUserMemory(workspace, email);
  },
  
  // Workspace admins can reset but not read
  reset: async (workspace: string, email: string, isAdmin: boolean) => {
    if (!isAdmin) {
      throw new ForbiddenError('Only admins can reset memories');
    }
    return resetUserMemory(workspace, email);
  }
};
```

### Document Encryption
```typescript
// Encrypt documents in S3
const documentSecurity = {
  encryption: 'AES-256',
  keyManagement: 'AWS-KMS',
  accessControl: 'workspace-based',
  audit: true
};
```

## Key Benefits of DH Approach

1. **Personal Learning**: Each user's GTD learns their specific patterns
2. **Memory Persistence**: Knowledge accumulates over time
3. **Context Awareness**: Decisions based on user's history
4. **Document Intelligence**: Automatic processing and categorization
5. **Adaptive Ordering**: Tasks ordered based on personal productivity patterns
6. **Privacy**: Complete isolation of user memories
7. **Scalability**: Each user is independent, can scale horizontally