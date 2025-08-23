/**
 * Core type definitions for the Brain Server
 */

// Brain types
export type BrainState = 
  | 'initializing' 
  | 'starting' 
  | 'active' 
  | 'idle' 
  | 'thinking'
  | 'error' 
  | 'stopped'

export interface BrainConfig {
  workspace?: string
  type: string
  email?: string
  name?: string
  modules?: string[]
  limits?: {
    maxMemory?: number
    maxCPU?: number
    maxThoughtsPerSecond?: number
  }
}

// Flow and graph types
export interface Node {
  id: string
  type: string
  x?: number
  y?: number
  data: {
    label?: string
    title?: string
    [key: string]: any
  }
}

export interface Edge {
  id: string
  source: string
  target: string
  type?: string
  data?: any
}

export interface Flow {
  id: string
  title: string
  nodes: Node[]
  edges: Edge[]
  createdAt?: Date
  updatedAt?: Date
}

// Navigation types
export interface FlowStackItem {
  id: string
  title: string
}

// Command types
export interface BrainCommand {
  type: 'navigate' | 'save' | 'add-node' | 'add-edge' | 'get-state' | 'execute'
  flowId?: string
  node?: Node
  edge?: Edge
  data?: any
}

// WebSocket message types
export interface NeuralMessage {
  id: string
  type: 'command' | 'query' | 'stream' | 'event'
  brainId?: string
  payload: any
  timestamp: number
}

// Brain stats
export interface BrainStats {
  activeBrains: number
  totalThoughts: number
  memoryUsage: number
  cpuUsage: number
  connections: number
}