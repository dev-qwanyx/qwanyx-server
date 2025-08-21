// Execution Engine - runs flows for Digital Humans
import { 
  ExecutionContext, 
  INode, 
  Flow, 
  Edge, 
  NodeResult,
  MemoryService,
  ApiService,
  LogService,
  LogEntry
} from './types'
import { NodeRegistry } from './NodeRegistry'

export class ExecutionEngine {
  private registry: NodeRegistry
  private activeExecutions: Map<string, ExecutionState> = new Map()
  
  constructor() {
    this.registry = NodeRegistry.getInstance()
  }
  
  // Execute a flow from a trigger
  async executeFlow(
    flow: Flow,
    triggerId: string,
    dhId: string,
    dhEmail: string,
    workspace: string,
    services: {
      memory: MemoryService
      api: ApiService
    }
  ): Promise<ExecutionResult> {
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const logs: LogEntry[] = []
    
    // Create logger
    const logger: LogService = {
      info: (message, data) => logs.push({ level: 'info', message, timestamp: new Date(), data }),
      warn: (message, data) => logs.push({ level: 'warn', message, timestamp: new Date(), data }),
      error: (message, error) => logs.push({ level: 'error', message, timestamp: new Date(), data: error }),
      debug: (message, data) => logs.push({ level: 'debug', message, timestamp: new Date(), data })
    }
    
    // Create execution context
    const context: ExecutionContext = {
      dhId,
      dhEmail,
      workspace,
      executionId,
      triggeredBy: triggerId,
      startTime: new Date(),
      variables: {},
      input: null,
      services: {
        memory: services.memory,
        api: services.api,
        logger
      }
    }
    
    // Store execution state
    const state: ExecutionState = {
      executionId,
      flow,
      context,
      status: 'running',
      currentNodes: [triggerId],
      visitedNodes: new Set(),
      results: new Map(),
      logs
    }
    
    this.activeExecutions.set(executionId, state)
    
    try {
      // Execute the flow starting from trigger
      await this.executeNodes(state)
      
      // Mark as complete
      state.status = 'completed'
      
      return {
        executionId,
        status: 'completed',
        results: Array.from(state.results.entries()),
        logs,
        duration: Date.now() - context.startTime.getTime()
      }
      
    } catch (error: any) {
      state.status = 'failed'
      logger.error('Flow execution failed', error)
      
      return {
        executionId,
        status: 'failed',
        error: error.message,
        results: Array.from(state.results.entries()),
        logs,
        duration: Date.now() - context.startTime.getTime()
      }
      
    } finally {
      // Clean up after a delay
      setTimeout(() => {
        this.activeExecutions.delete(executionId)
      }, 60000) // Keep for 1 minute for debugging
    }
  }
  
  // Execute nodes in the flow
  private async executeNodes(state: ExecutionState) {
    while (state.currentNodes.length > 0 && state.status === 'running') {
      const nodeId = state.currentNodes.shift()!
      
      // Skip if already visited (prevent loops)
      if (state.visitedNodes.has(nodeId)) {
        continue
      }
      state.visitedNodes.add(nodeId)
      
      // Find the node
      const node = state.flow.nodes.find(n => n.id === nodeId)
      if (!node) {
        state.context.services.logger.warn(`Node ${nodeId} not found in flow`)
        continue
      }
      
      // Get input from previous node results
      const incomingEdges = state.flow.edges.filter(e => e.target === nodeId)
      if (incomingEdges.length > 0) {
        // Use the output from the first incoming edge's source
        const sourceId = incomingEdges[0].source
        const sourceResult = state.results.get(sourceId)
        if (sourceResult?.output) {
          state.context.input = sourceResult.output
        }
      }
      
      // Execute the node
      state.context.services.logger.info(`Executing node ${nodeId} (${node.type})`)
      
      try {
        const result = await node.execute(state.context)
        state.results.set(nodeId, result)
        
        // Update context variables
        if (result.variables) {
          Object.assign(state.context.variables, result.variables)
        }
        
        // Determine next nodes
        if (result.success) {
          const nextNodes = result.nextNodes || this.getNextNodes(state.flow, nodeId)
          state.currentNodes.push(...nextNodes)
        }
        
      } catch (error: any) {
        state.context.services.logger.error(`Node ${nodeId} execution failed`, error)
        state.results.set(nodeId, {
          success: false,
          error: error.message
        })
      }
    }
  }
  
  // Get next nodes based on edges
  private getNextNodes(flow: Flow, nodeId: string): string[] {
    return flow.edges
      .filter(edge => edge.source === nodeId)
      .map(edge => edge.target)
  }
  
  // Get execution status
  getExecutionStatus(executionId: string): ExecutionStatus | null {
    const state = this.activeExecutions.get(executionId)
    if (!state) return null
    
    return {
      executionId,
      status: state.status,
      currentNodes: state.currentNodes,
      visitedNodes: Array.from(state.visitedNodes),
      results: Array.from(state.results.entries()).map(([nodeId, result]) => ({
        nodeId,
        success: result.success,
        error: result.error
      }))
    }
  }
  
  // Stop an execution
  stopExecution(executionId: string): boolean {
    const state = this.activeExecutions.get(executionId)
    if (!state) return false
    
    state.status = 'stopped'
    state.currentNodes = []
    return true
  }
}

// Internal execution state
interface ExecutionState {
  executionId: string
  flow: Flow
  context: ExecutionContext
  status: 'running' | 'completed' | 'failed' | 'stopped'
  currentNodes: string[]
  visitedNodes: Set<string>
  results: Map<string, NodeResult>
  logs: LogEntry[]
}

// Execution result
export interface ExecutionResult {
  executionId: string
  status: 'completed' | 'failed'
  error?: string
  results: [string, NodeResult][]
  logs: LogEntry[]
  duration: number
}

// Execution status for monitoring
export interface ExecutionStatus {
  executionId: string
  status: string
  currentNodes: string[]
  visitedNodes: string[]
  results: { nodeId: string; success: boolean; error?: string }[]
}