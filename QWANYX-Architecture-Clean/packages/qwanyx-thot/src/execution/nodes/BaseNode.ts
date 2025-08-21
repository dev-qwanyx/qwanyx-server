// Base implementation for all nodes
import { INode, ExecutionContext, NodeResult, ValidationResult } from '../types'
import { z } from 'zod'

export abstract class BaseNode implements INode {
  id: string
  type: string
  position: { x: number; y: number }
  data: Record<string, any>
  
  constructor(config: {
    id: string
    type: string
    position: { x: number; y: number }
    data?: Record<string, any>
  }) {
    this.id = config.id
    this.type = config.type
    this.position = config.position
    this.data = config.data || {}
  }
  
  // Must be implemented by subclasses
  abstract execute(context: ExecutionContext): Promise<NodeResult>
  
  // Optional validation
  validate(): ValidationResult {
    const schema = this.getConfigSchema()
    if (!schema) {
      return { valid: true }
    }
    
    try {
      schema.parse(this.data)
      return { valid: true }
    } catch (error: any) {
      return {
        valid: false,
        errors: error.errors?.map((e: any) => e.message) || [error.message]
      }
    }
  }
  
  // Optional schema definitions
  getInputSchema(): z.ZodSchema | undefined {
    return undefined
  }
  
  getOutputSchema(): z.ZodSchema | undefined {
    return undefined
  }
  
  getConfigSchema(): z.ZodSchema | undefined {
    return undefined
  }
  
  // Helper methods for subclasses
  protected async log(context: ExecutionContext, level: 'info' | 'warn' | 'error' | 'debug', message: string, data?: any) {
    context.services.logger[level](message, { nodeId: this.id, ...data })
  }
  
  protected success(output?: any, nextNodes?: string[], variables?: Record<string, any>): NodeResult {
    return {
      success: true,
      output,
      nextNodes,
      variables
    }
  }
  
  protected failure(error: string): NodeResult {
    return {
      success: false,
      error
    }
  }
}