// API Configuration - Easy switch between local and remote
// Change USE_LOCAL to false to use production server

const USE_LOCAL = false  // <-- CHANGE THIS TO SWITCH BETWEEN LOCAL AND REMOTE

export const API_CONFIG = {
  // API URLs
  API_URL: USE_LOCAL 
    ? 'http://localhost:5002' 
    : 'http://135.181.72.183:5002',
    
  // Display which environment we're using
  ENVIRONMENT: USE_LOCAL ? 'LOCAL' : 'REMOTE',
  
  // You can add more environment-specific settings here
  DEBUG: USE_LOCAL,
  
  // Timeouts
  TIMEOUT: USE_LOCAL ? 30000 : 10000,
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