/**
 * Digital Human Brain
 * 
 * This is a living, thinking entity that:
 * - Is a shape-shifting graph computer
 * - Loads different flows to become different things
 * - Thinks continuously
 * - Can modify itself while thinking
 */

import { EventEmitter } from 'events'
import { Logger } from '../utils/Logger'
import { FlowManager } from '../memory/FlowManager'
import { BrainState, BrainConfig, Node, Edge } from '../types'

export class Brain extends EventEmitter {
  // Identity
  public readonly id: string
  public readonly type: string
  public readonly config: BrainConfig
  
  // State
  private state: BrainState = 'initializing'
  private alive: boolean = false
  
  // Current thought (Working Memory)
  private currentFlowId: string | null = null
  private currentFlowTitle: string = 'root'
  private nodes: Node[] = []
  private edges: Edge[] = []
  
  // Navigation
  private flowStack: Array<{ id: string; title: string }> = []
  
  // Memory management
  private memory: FlowManager
  private logger: Logger
  
  // Thinking loop
  private thinkingInterval?: NodeJS.Timeout
  private lastThought: Date = new Date()
  
  // Metrics
  private thoughtCount: number = 0
  private errorCount: number = 0
  
  constructor(id: string, type: string, config: BrainConfig) {
    super()
    this.id = id
    this.type = type
    this.config = config
    this.logger = Logger.getInstance()
    this.memory = new FlowManager(id, config.workspace || 'default')
    
    this.logger.info(`Brain ${id} created (type: ${type})`)
  }
  
  /**
   * Start the brain - it begins thinking
   */
  async start(): Promise<void> {
    try {
      this.state = 'starting'
      this.emit('state-change', this.state)
      
      // Initialize memory connection
      await this.memory.initialize()
      
      // Load root flow (the brain's base configuration)
      await this.loadRootFlow()
      
      // Start the thinking loop
      this.alive = true
      this.startThinking()
      
      this.state = 'active'
      this.emit('state-change', this.state)
      this.logger.info(`Brain ${this.id} is now thinking`)
      
    } catch (error) {
      this.state = 'error'
      this.errorCount++
      this.emit('error', error)
      throw error
    }
  }
  
  /**
   * Stop the brain - it stops thinking
   */
  async stop(): Promise<void> {
    this.logger.info(`Stopping brain ${this.id}`)
    this.alive = false
    
    if (this.thinkingInterval) {
      clearInterval(this.thinkingInterval)
    }
    
    // Save current state before stopping
    if (this.currentFlowId) {
      await this.saveCurrentFlow()
    }
    
    this.state = 'stopped'
    this.emit('state-change', this.state)
  }
  
  /**
   * The brain becomes a different thing by loading a flow
   */
  async becomeFlow(flowId: string): Promise<void> {
    this.logger.debug(`Brain ${this.id} becoming flow ${flowId}`)
    
    // Save current flow if exists
    if (this.currentFlowId) {
      await this.saveCurrentFlow()
    }
    
    // Load new flow into working memory
    const flow = await this.memory.loadFlow(flowId)
    
    if (flow) {
      this.currentFlowId = flowId
      this.currentFlowTitle = flow.title || flowId
      this.nodes = flow.nodes || []
      this.edges = flow.edges || []
      
      // The brain has transformed!
      this.emit('flow-changed', {
        flowId,
        title: this.currentFlowTitle,
        nodeCount: this.nodes.length,
        edgeCount: this.edges.length
      })
      
      this.logger.info(`Brain ${this.id} is now thinking as ${this.currentFlowTitle}`)
    } else {
      // Create new flow if doesn't exist
      await this.createFlow(flowId)
    }
  }
  
  /**
   * Navigate to a sub-flow
   */
  async navigateToFlow(flowId: string, _title?: string): Promise<void> {
    // Push current to stack
    if (this.currentFlowId) {
      this.flowStack.push({
        id: this.currentFlowId,
        title: this.currentFlowTitle
      })
    }
    
    // Become the new flow
    await this.becomeFlow(flowId)
    
    // Update navigation
    this.emit('navigation', {
      current: flowId,
      stack: this.flowStack
    })
  }
  
  /**
   * Navigate back in the flow stack
   */
  async navigateBack(): Promise<void> {
    if (this.flowStack.length === 0) {
      return
    }
    
    const previous = this.flowStack.pop()
    if (previous) {
      await this.becomeFlow(previous.id)
    }
  }
  
  /**
   * Navigate to root flow
   */
  async navigateToRoot(): Promise<void> {
    this.flowStack = []
    await this.becomeFlow(this.id) // Root flow has same ID as brain
  }
  
  /**
   * The thinking loop - the brain's consciousness
   */
  private startThinking(): void {
    // Think every 100ms (10 thoughts per second)
    this.thinkingInterval = setInterval(() => {
      this.think()
    }, 100)
  }
  
  /**
   * A single thought cycle
   */
  private async think(): Promise<void> {
    try {
      this.thoughtCount++
      this.lastThought = new Date()
      
      // Process current flow nodes if any
      if (this.nodes.length > 0) {
        // In future: parallel processing on GPU
        // For now: sequential processing
        for (const node of this.nodes) {
          if (this.shouldExecuteNode(node)) {
            await this.executeNode(node)
          }
        }
      }
      
      // Emit thought for monitoring
      if (this.thoughtCount % 10 === 0) { // Every 10 thoughts
        this.emit('thought', {
          count: this.thoughtCount,
          flowId: this.currentFlowId,
          timestamp: this.lastThought
        })
      }
      
    } catch (error) {
      this.errorCount++
      this.logger.error(`Brain ${this.id} thought error`, error)
      this.emit('thought-error', error)
    }
  }
  
  /**
   * Execute a single node
   */
  private async executeNode(_node: Node): Promise<void> {
    // This is where node-specific logic would go
    // For now, just track execution
    this.emit('node-executed', {
      nodeId: _node.id,
      type: _node.type,
      timestamp: new Date()
    })
  }
  
  /**
   * Determine if a node should execute
   */
  private shouldExecuteNode(_node: Node): boolean {
    // Future: Complex execution logic based on node type, triggers, etc.
    // For now: always execute
    return true
  }
  
  /**
   * Save current flow to memory
   */
  private async saveCurrentFlow(): Promise<void> {
    if (!this.currentFlowId) return
    
    await this.memory.saveFlow(this.currentFlowId, {
      id: this.currentFlowId,
      title: this.currentFlowTitle,
      nodes: this.nodes,
      edges: this.edges,
      updatedAt: new Date()
    })
  }
  
  /**
   * Create a new flow
   */
  private async createFlow(flowId: string, title?: string): Promise<void> {
    this.currentFlowId = flowId
    this.currentFlowTitle = title || flowId
    this.nodes = []
    this.edges = []
    
    await this.saveCurrentFlow()
  }
  
  /**
   * Load the root flow for this brain
   */
  private async loadRootFlow(): Promise<void> {
    await this.becomeFlow(this.id) // Root flow ID = Brain ID
  }
  
  /**
   * Add a node to current flow (self-modification)
   */
  async addNode(node: Node): Promise<void> {
    this.nodes.push(node)
    this.emit('node-added', node)
    await this.saveCurrentFlow()
  }
  
  /**
   * Add an edge to current flow
   */
  async addEdge(edge: Edge): Promise<void> {
    this.edges.push(edge)
    this.emit('edge-added', edge)
    await this.saveCurrentFlow()
  }
  
  /**
   * Get brain vitals for monitoring
   */
  getVitals(): any {
    return {
      id: this.id,
      type: this.type,
      state: this.state,
      alive: this.alive,
      currentFlow: this.currentFlowId,
      thoughtCount: this.thoughtCount,
      errorCount: this.errorCount,
      lastThought: this.lastThought,
      memoryUsage: process.memoryUsage().heapUsed,
      uptime: Date.now() - this.lastThought.getTime()
    }
  }
  
  /**
   * Handle external commands (from UI or other brains)
   */
  async handleCommand(command: any): Promise<any> {
    switch (command.type) {
      case 'navigate':
        await this.navigateToFlow(command.flowId)
        break
        
      case 'save':
        await this.saveCurrentFlow()
        break
        
      case 'add-node':
        await this.addNode(command.node)
        break
        
      case 'add-edge':
        await this.addEdge(command.edge)
        break
        
      case 'get-state':
        return {
          currentFlow: this.currentFlowId,
          nodes: this.nodes,
          edges: this.edges,
          stack: this.flowStack
        }
        
      case 'reset-memory':
        // Safely reset brain to empty state
        this.logger.info(`Brain ${this.id} resetting memory`)
        this.nodes = []
        this.edges = []
        this.flowStack = []
        this.currentFlowTitle = 'root'
        await this.saveCurrentFlow()
        this.emit('memory-reset', {
          brainId: this.id,
          timestamp: new Date()
        })
        return {
          success: true,
          message: 'Brain memory reset to clean state'
        }
        
      default:
        throw new Error(`Unknown command: ${command.type}`)
    }
  }
}