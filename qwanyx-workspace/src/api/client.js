import axios from 'axios';
import { API_BASE_URL, getHeaders, getWorkspace } from '../config/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    config.headers = { ...config.headers, ...getHeaders() };
    
    // Add workspace to all requests
    if (config.method === 'post' || config.method === 'put') {
      config.data = {
        ...config.data,
        workspace: getWorkspace()
      };
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;