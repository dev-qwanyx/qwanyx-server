/**
 * API Configuration
 * Single source of truth for API endpoints
 */

// This should be synchronized with the main app configuration
// TODO: In production, this should come from environment variables
const USE_LOCAL = true  // <-- CHANGE THIS TO SWITCH BETWEEN LOCAL AND REMOTE

export const API_CONFIG = {
  // API URLs
  API_URL: USE_LOCAL 
    ? 'http://localhost:5002' 
    : 'http://135.181.72.183:5002',
    
  // Environment indicator
  ENVIRONMENT: USE_LOCAL ? 'LOCAL' : 'REMOTE',
  
  // Debug mode
  DEBUG: USE_LOCAL,
  
  // Default timeout
  TIMEOUT: USE_LOCAL ? 30000 : 10000,
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  }
}

/**
 * Helper function to construct API URLs
 * @param path - The API path (e.g., '/users' or 'users')
 * @returns The full API URL
 */
export const getApiUrl = (path: string = ''): string => {
  const baseUrl = API_CONFIG.API_URL
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}

// Log current environment on load (only in browser)
if (typeof window !== 'undefined') {
  console.log(`🔌 API Client: ${API_CONFIG.ENVIRONMENT} - ${API_CONFIG.API_URL}`)
}