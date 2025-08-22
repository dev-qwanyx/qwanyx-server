/**
 * Users API Module
 * User management operations
 */

import { ApiClient } from '../client'
import type { ApiResponse, User, RequestOptions } from '../types'

export class UsersApi {
  private client: ApiClient
  
  constructor() {
    this.client = ApiClient.getInstance()
  }
  
  /**
   * Get all users
   */
  async list(options?: RequestOptions): Promise<ApiResponse<User[]>> {
    return this.client.get('/users', options)
  }
  
  /**
   * Get a specific user
   */
  async get(userId: string, options?: RequestOptions): Promise<ApiResponse<User>> {
    return this.client.get(`/users/${userId}`, options)
  }
  
  /**
   * Create a new user
   */
  async create(user: Partial<User>, options?: RequestOptions): Promise<ApiResponse<User>> {
    return this.client.post('/users', user, options)
  }
  
  /**
   * Update a user
   */
  async update(userId: string, updates: Partial<User>, options?: RequestOptions): Promise<ApiResponse<User>> {
    return this.client.put(`/users/${userId}`, updates, options)
  }
  
  /**
   * Delete a user
   */
  async delete(userId: string, options?: RequestOptions): Promise<ApiResponse> {
    return this.client.delete(`/users/${userId}`, options)
  }
  
  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null
    
    const storedUser = localStorage.getItem('autodin_user')
    if (!storedUser) return null
    
    try {
      return JSON.parse(storedUser)
    } catch {
      return null
    }
  }
}