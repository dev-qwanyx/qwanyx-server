/**
 * Digital Human API Module
 * All DH-related API operations
 */

import { ApiClient } from '../client'
import type { ApiResponse, DigitalHuman, RequestOptions } from '../types'

export class DhApi {
  private client: ApiClient
  
  constructor() {
    this.client = ApiClient.getInstance()
  }
  
  /**
   * Start a Digital Human
   */
  async start(dhId: string, options?: RequestOptions): Promise<ApiResponse> {
    return this.client.post(`/api/dh/${dhId}/start`, null, options)
  }
  
  /**
   * Stop a Digital Human
   */
  async stop(dhId: string, options?: RequestOptions): Promise<ApiResponse> {
    return this.client.post(`/api/dh/${dhId}/stop`, null, options)
  }
  
  /**
   * Toggle DH active status (start/stop)
   */
  async toggle(dhId: string, active: boolean, options?: RequestOptions): Promise<ApiResponse> {
    // First update the active status in the database
    const updateResult = await this.client.put(`/users/${dhId}`, { active }, options)
    
    if (!updateResult.success) {
      return updateResult
    }
    
    // Then start or stop the actual process
    const action = active ? 'start' : 'stop'
    const processResult = await this.client.post(`/api/dh/${dhId}/${action}`, null, options)
    
    // Return combined result
    return {
      success: updateResult.success && processResult.success,
      data: {
        active,
        updateResult: updateResult.data,
        processResult: processResult.data
      },
      error: processResult.error
    }
  }
  
  /**
   * Get DH flow configuration
   */
  async getFlow(dhId: string, options?: RequestOptions): Promise<ApiResponse> {
    return this.client.get(`/api/dh/${dhId}/flow`, options)
  }
  
  /**
   * Save DH flow configuration
   */
  async saveFlow(dhId: string, flow: any, options?: RequestOptions): Promise<ApiResponse> {
    return this.client.post(`/api/dh/${dhId}/flow`, flow, options)
  }
  
  /**
   * Get DH memory/state
   */
  async getMemory(dhId: string, key?: string, options?: RequestOptions): Promise<ApiResponse> {
    const path = key ? `/api/dh/${dhId}/memory/${key}` : `/api/dh/${dhId}/memory`
    return this.client.get(path, options)
  }
  
  /**
   * Update DH memory/state
   */
  async updateMemory(dhId: string, key: string, value: any, options?: RequestOptions): Promise<ApiResponse> {
    return this.client.put(`/api/dh/${dhId}/memory/${key}`, { value }, options)
  }
  
  /**
   * Get DH logs
   */
  async getLogs(dhId: string, options?: RequestOptions): Promise<ApiResponse> {
    return this.client.get(`/api/dh/${dhId}/logs`, options)
  }
  
  /**
   * Get all Digital Humans (filters for type: 'DH')
   */
  async list(options?: RequestOptions): Promise<ApiResponse<DigitalHuman[]>> {
    const result = await this.client.get('/users', options)
    
    if (result.success && result.data) {
      // Filter for DH users only
      const users = Array.isArray(result.data) ? result.data : (result.data.users || [])
      const digitalHumans = users.filter((u: any) => u.type === 'DH')
      return {
        success: true,
        data: digitalHumans
      }
    }
    
    return result
  }
}