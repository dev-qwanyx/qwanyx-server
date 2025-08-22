/**
 * Common types for API client
 */

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ApiError {
  code: string
  message: string
  details?: any
}

export interface RequestOptions {
  headers?: Record<string, string>
  timeout?: number
  workspace?: string
}

export interface DigitalHuman {
  _id: string
  email: string
  name: string
  firstName: string
  type: 'DH'
  system: 'THOT'
  workspace: string
  active: boolean
  created: Date
  stats?: {
    emailsProcessed: number
    avgResponseTime: number
    satisfactionRate: number
  }
}

export interface User {
  _id?: string
  email: string
  name?: string
  firstName?: string
  role?: string
  workspace?: string
  type?: 'DH' | 'USER'
  active?: boolean
}