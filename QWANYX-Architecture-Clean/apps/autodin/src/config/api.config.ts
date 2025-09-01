// API Configuration - Controlled by environment variable
// Set NEXT_PUBLIC_API_URL in .env.local for development
// Set NEXT_PUBLIC_API_URL in .env.production for production

// Detect if we're running locally or in production
const isLocalHost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || 
   window.location.hostname === '127.0.0.1')

// Use production URL unless explicitly on localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (isLocalHost ? 'http://localhost:5002' : 'http://135.181.72.183:5002')

const IS_LOCAL = API_URL.includes('localhost')

export const API_CONFIG = {
  // API URLs
  API_URL: API_URL,
    
  // Display which environment we're using
  ENVIRONMENT: IS_LOCAL ? 'LOCAL' : 'REMOTE',
  
  // You can add more environment-specific settings here
  DEBUG: IS_LOCAL,
  
  // Timeouts
  TIMEOUT: IS_LOCAL ? 30000 : 10000,
}

// Helper function to get API URL
export const getApiUrl = (path: string = '') => {
  const baseUrl = API_CONFIG.API_URL
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}

// Log current environment on load
if (typeof window !== 'undefined') {
  console.log(`🔌 API Environment: ${API_CONFIG.ENVIRONMENT} - ${API_CONFIG.API_URL}`)
}