import { INode, ExecutionContext, NodeResult, ValidationResult } from './types';
import { z } from 'zod';

export abstract class BaseNode implements INode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, any>;
  protected context?: ExecutionContext;
  
  constructor(params: {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: Record<string, any>;
  }) {
    this.id = params.id;
    this.type = params.type;
    this.position = params.position;
    this.data = params.data;
  }
  
  static nodeType: string = 'base';
  
  abstract execute(context: ExecutionContext): Promise<NodeResult>;
  
  validate(): ValidationResult {
    return { valid: true };
  }
  
  // Schema methods
  getInputSchema(): z.ZodSchema | undefined {
    return undefined;
  }
  
  getOutputSchema(): z.ZodSchema | undefined {
    return undefined;
  }
  
  getConfigSchema(): z.ZodSchema | undefined {
    return undefined;
  }
  
  // Helper methods for node implementations
  protected log(message: string, data?: any) {
    if (this.context?.services.logger) {
      this.context.services.logger.info(message, data);
    }
    console.log(`[${this.type}:${this.id}] ${message}`, data || '');
  }
  
  protected async getMemory(key: string): Promise<any> {
    if (this.context?.services.memory) {
      return this.context.services.memory.get(key);
    }
    return null;
  }
  
  protected async updateMemory(key: string, value: any): Promise<void> {
    if (this.context?.services.memory) {
      await this.context.services.memory.set(key, value);
    }
  }
  
  // Store context when execute is called
  async executeWithContext(context: ExecutionContext): Promise<NodeResult> {
    this.context = context;
    return this.execute(context);
  }
}