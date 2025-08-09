import apiClient from './client';
import { getWorkspace } from '../config/api';

export const authAPI = {
  // Request passwordless code
  requestCode: async (email) => {
    const response = await apiClient.post('/auth/request-code', {
      email,
      site: getWorkspace()
    });
    return response.data;
  },
  
  // Verify code and login
  verifyCode: async (email, code) => {
    const response = await apiClient.post('/auth/verify-code', {
      email,
      code,
      site: getWorkspace()
    });
    
    // Store token
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },
  
  // Get current user
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
  
  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};