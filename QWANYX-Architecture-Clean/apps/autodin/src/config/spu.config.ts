/**
 * SPU Backend Configuration
 * - Development: localhost:5002
 * - Production: Server IP:5002 (for browser access)
 */

// Detect if we're in production based on the URL
const isProduction = typeof window !== 'undefined' && 
  (window.location.hostname === '135.181.72.183' || 
   window.location.hostname.includes('autodin'));

export const SPU_CONFIG = {
  // Use server IP in production, localhost in dev
  baseUrl: isProduction ? 'http://135.181.72.183:5002' : 'http://localhost:5002',
  
  // Generic CRUD endpoints pattern
  endpoints: {
    // Data operations
    list: (collection: string) => `/data/${collection}`,
    get: (collection: string, id: string) => `/data/${collection}/${id}`,
    create: (collection: string) => `/data/${collection}`,
    update: (collection: string, id: string) => `/data/${collection}/${id}`,
    delete: (collection: string, id: string) => `/data/${collection}/${id}`,
    
    // Auth endpoints (special cases)
    auth: {
      register: '/auth/register',
      requestCode: '/auth/request-code',
      verifyCode: '/auth/verify-code',
      login: '/auth/login'
    },
    
    // Health check
    health: '/health'
  }
}

/**
 * Helper function to build SPU URL
 */
export function getSpuUrl(path: string): string {
  return `${SPU_CONFIG.baseUrl}${path}`
}

/**
 * Helper to get CRUD URL for a collection
 */
export function getCollectionUrl(collection: string, id?: string, workspace: string = 'autodin'): string {
  const baseUrl = id 
    ? getSpuUrl(SPU_CONFIG.endpoints.update(collection, id))
    : getSpuUrl(SPU_CONFIG.endpoints.list(collection))
  
  // Add workspace as query param for GET/DELETE
  if (!id || ['GET', 'DELETE'].includes('GET')) {
    return `${baseUrl}?workspace=${workspace}`
  }
  
  return baseUrl
}