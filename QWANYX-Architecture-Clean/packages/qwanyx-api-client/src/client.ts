/**
 * Base API Client
 * Handles authentication, headers, and common request logic
 */

import { API_CONFIG, getApiUrl } from './config'
import type { ApiResponse, RequestOptions } from './types'

export class ApiClient {
  private static instance: ApiClient
  
  private constructor() {}
  
  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient()
    }
    return ApiClient.instance
  }
  
  /**
   * Get auth token from localStorage
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('autodin_token')
  }
  
  /**
   * Get workspace from localStorage
   */
  private getWorkspace(): string {
    if (typeof window === 'undefined') return 'autodin'
    return localStorage.getItem('autodin_workspace') || 'autodin'
  }
  
  /**
   * Build headers for request
   */
  private buildHeaders(options?: RequestOptions): HeadersInit {
    const headers: Record<string, string> = {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...(options?.headers || {})
    }
    
    const token = this.getAuthToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const workspace = options?.workspace || this.getWorkspace()
    if (workspace) {
      headers['X-Workspace'] = workspace
    }
    
    return headers
  }
  
  /**
   * Make a GET request
   */
  async get<T = any>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(getApiUrl(path), {
        method: 'GET',
        headers: this.buildHeaders(options),
        signal: AbortSignal.timeout(options?.timeout || API_CONFIG.TIMEOUT)
      })
      
      return this.handleResponse<T>(response)
    } catch (error) {
      return this.handleError(error)
    }
  }
  
  /**
   * Make a POST request
   */
  async post<T = any>(path: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(getApiUrl(path), {
        method: 'POST',
        headers: this.buildHeaders(options),
        body: data ? JSON.stringify(data) : undefined,
        signal: AbortSignal.timeout(options?.timeout || API_CONFIG.TIMEOUT)
      })
      
      return this.handleResponse<T>(response)
    } catch (error) {
      return this.handleError(error)
    }
  }
  
  /**
   * Make a PUT request
   */
  async put<T = any>(path: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(getApiUrl(path), {
        method: 'PUT',
        headers: this.buildHeaders(options),
        body: data ? JSON.stringify(data) : undefined,
        signal: AbortSignal.timeout(options?.timeout || API_CONFIG.TIMEOUT)
      })
      
      return this.handleResponse<T>(response)
    } catch (error) {
      return this.handleError(error)
    }
  }
  
  /**
   * Make a DELETE request
   */
  async delete<T = any>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(getApiUrl(path), {
        method: 'DELETE',
        headers: this.buildHeaders(options),
        signal: AbortSignal.timeout(options?.timeout || API_CONFIG.TIMEOUT)
      })
      
      return this.handleResponse<T>(response)
    } catch (error) {
      return this.handleError(error)
    }
  }
  
  /**
   * Handle response
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const text = await response.text()
      const data = text ? JSON.parse(text) : {}
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
          data: null
        }
      }
      
      return {
        success: true,
        data
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to parse response',
        data: null
      }
    }
  }
  
  /**
   * Handle errors
   */
  private handleError(error: any): ApiResponse {
    if (API_CONFIG.DEBUG) {
      console.error('API Error:', error)
    }
    
    return {
      success: false,
      error: error.message || 'Network error'
    }
  }
}