// THOT Execution Engine Types
// These define how nodes execute within a Digital Human's flow

import { z } from 'zod'

// Execution context that flows through nodes
export interface ExecutionContext {
  // DH Identity
  dhId: string
  dhEmail: string
  workspace: string
  
  // Current execution
  executionId: string
  triggeredBy: string // node ID that started execution
  startTime: Date
  
  // Data flowing through nodes
  variables: Record<string, any>
  input: any // From previous node
  
  // Services available to nodes
  services: {
    memory: MemoryService
    api: ApiService
    logger: LogService
  }
}

// Base interface all nodes must implement
export interface INode {
  id: string
  type: string
  position: { x: number; y: number }
  data: Record<string, any>
  
  // Execution
  execute(context: ExecutionContext): Promise<NodeResult>
  validate?(): ValidationResult
  
  // Metadata
  getInputSchema?(): z.ZodSchema
  getOutputSchema?(): z.ZodSchema
  getConfigSchema?(): z.ZodSchema
}

// Result from node execution
export interface NodeResult {
  success: boolean
  output?: any
  error?: string
  nextNodes?: string[] // IDs of nodes to execute next
  variables?: Record<string, any> // Updates to context variables
  logs?: LogEntry[]
}

// Validation result
export interface ValidationResult {
  valid: boolean
  errors?: string[]
  warnings?: string[]
}

// Memory service interface
export interface MemoryService {
  get(key: string): Promise<any>
  set(key: string, value: any): Promise<void>
  search(query: string, type?: string): Promise<any[]>
  addMemory(memory: {
    type: string
    data: any
    tags?: string[]
    metadata?: any
  }): Promise<string>
}

// API service interface
export interface ApiService {
  get(path: string): Promise<any>
  post(path: string, data: any): Promise<any>
  put(path: string, data: any): Promise<any>
  delete(path: string): Promise<any>
}

// Logging service
export interface LogService {
  info(message: string, data?: any): void
  warn(message: string, data?: any): void
  error(message: string, error?: any): void
  debug(message: string, data?: any): void
}

// Log entry
export interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  timestamp: Date
  nodeId?: string
  data?: any
}

// Node categories for organization
export enum NodeCategory {
  CONTROL = 'control',
  TRIGGER = 'trigger',
  ACTION = 'action',
  LOGIC = 'logic',
  MEMORY = 'memory',
  INTEGRATION = 'integration',
  AI = 'ai',
  DATA = 'data'
}

// Node definition for registry
export interface NodeDefinition {
  type: string
  category: NodeCategory
  name: string
  description: string
  icon?: string
  color?: string
  factory: (data: any) => INode
  defaultData?: Record<string, any>
  configSchema?: z.ZodSchema
}

// Flow definition (what gets saved)
export interface Flow {
  id: string
  dhId: string
  name: string
  description?: string
  nodes: INode[]
  edges: Edge[]
  created: Date
  updated: Date
  active: boolean
}

// Edge connecting nodes
export interface Edge {
  id: string
  source: string
  target: string
  condition?: string // Optional condition for edge
}