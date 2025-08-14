import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  workspace: string;
  metadata?: Record<string, any>;
}

export const useAuth = (initialToken?: string, workspace?: string) => {
  const storageKey = workspace ? `${workspace}_token` : 'token';
  const userKey = workspace ? `${workspace}_user` : 'user';
  
  const [token, setToken] = useState<string | null>(
    initialToken || localStorage.getItem(storageKey)
  );
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (token) {
      // Decode JWT to get user info (simple base64 decode)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
        setIsAuthenticated(true);
        localStorage.setItem(storageKey, token);
        localStorage.setItem(userKey, JSON.stringify(payload));
      } catch (error) {
        console.error('Invalid token:', error);
        setIsAuthenticated(false);
      }
    } else {
      // Try to load from localStorage
      const storedUser = localStorage.getItem(userKey);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Invalid stored user:', error);
        }
      }
    }
  }, [token, storageKey, userKey]);

  const login = (newToken: string) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(storageKey);
    localStorage.removeItem(userKey);
  };

  const checkPermission = (requiredRole: string) => {
    return user?.metadata?.roles?.includes(requiredRole) || false;
  };

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    checkPermission
  };
};