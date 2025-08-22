// API Configuration for THOT package
// This should match the main app configuration

const USE_LOCAL = true  // <-- CHANGE THIS TO MATCH apps/autodin/src/config/api.config.ts

export const API_CONFIG = {
  API_URL: USE_LOCAL 
    ? 'http://localhost:5002' 
    : 'http://135.181.72.183:5002',
    
  ENVIRONMENT: USE_LOCAL ? 'LOCAL' : 'REMOTE',
}

export const getApiUrl = (path: string = '') => {
  const baseUrl = API_CONFIG.API_URL
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}