import { BaseNode } from '../BaseNode';
import { ExecutionContext, NodeResult } from '../types';

export class StatusNode extends BaseNode {
  static nodeType = 'status';
  type = 'status';
  
  async execute(_context: ExecutionContext): Promise<NodeResult> {
    // context is used via parent class methods (this.log, this.getMemory)
    this.log('Checking DH status');
    
    // Simple alive check
    const isRunning = await this.getMemory('dh_running') || false;
    const startedAt = await this.getMemory('dh_started_at');
    
    const status = {
      alive: isRunning,
      message: isRunning ? 'DH is running' : 'DH is stopped',
      since: startedAt,
      timestamp: new Date().toISOString()
    };
    
    this.log('Status check', status);
    return {
      success: true,
      output: status
    };
  }
  
  getDefaultConfig() {
    return {
      includeMemory: true,
      includeTriggers: true,
      includeFlows: true
    };
  }
}