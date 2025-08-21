import { BaseNode } from '../BaseNode';
import { ExecutionContext, NodeResult } from '../types';

export class HTTPTriggerNode extends BaseNode {
  static nodeType = 'http-trigger';
  type = 'http-trigger';
  
  async execute(context: ExecutionContext): Promise<NodeResult> {
    this.log('HTTP Trigger activated');
    
    // Extract request data from context input
    const { method = 'GET', path = '/', query = {}, body = {} } = context.input || {};
    
    // Store request info in DH memory
    await this.updateMemory('last_http_trigger', {
      timestamp: new Date().toISOString(),
      method,
      path,
      query,
      body
    });
    
    // Pass the request data forward
    return {
      success: true,
      output: {
        triggered: true,
        request: {
          method,
          path,
          query,
          body,
          timestamp: new Date().toISOString()
        }
      }
    };
  }
  
  getDefaultConfig() {
    return {
      path: '/trigger',
      method: 'POST',
      description: 'HTTP endpoint to trigger this DH flow'
    };
  }
}