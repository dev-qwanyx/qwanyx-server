import { BaseNode } from '../BaseNode';
import { ExecutionContext, NodeResult } from '../types';

export class HTTPResponseNode extends BaseNode {
  static nodeType = 'http-response';
  type = 'http-response';
  
  async execute(context: ExecutionContext): Promise<NodeResult> {
    this.log('Preparing HTTP response');
    
    // Extract status data from context input
    const { status, data, error } = context.input || {};
    
    // Build response object
    const response = {
      success: !error,
      timestamp: new Date().toISOString(),
      data: status || data || {},
      error: error || null
    };
    
    // Store response in memory for debugging
    await this.updateMemory('last_http_response', response);
    
    // In a real implementation, this would send an actual HTTP response
    // For now, we'll just return the response data
    this.log('Response prepared', response);
    
    return {
      success: true,
      output: {
        response,
        sent: true
      }
    };
  }
  
  getDefaultConfig() {
    return {
      statusCode: 200,
      contentType: 'application/json',
      headers: {}
    };
  }
}