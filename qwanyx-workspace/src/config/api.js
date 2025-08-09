// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

// Get workspace from URL or default
export const getWorkspace = () => {
  const hostname = window.location.hostname;
  const workspaceMap = {
    'autodin.be': 'autodin-be',
    'belgicomics.be': 'belgicomics-be',
    'qwanyx.com': 'qwanyx',
    'localhost': 'qwanyx' // Default for development
  };
  
  return workspaceMap[hostname] || 'qwanyx';
};

// API Headers
export const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};