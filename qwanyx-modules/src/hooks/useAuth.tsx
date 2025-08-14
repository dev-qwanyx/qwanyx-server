import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Types
export interface User {
  id: string;
  email: string;
  workspace: string;
  metadata?: Record<string, any>;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  workspace: string | null;
  loading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (token: string, user: User, rememberMe?: boolean) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  checkAuth: () => Promise<boolean>;
  getAuthHeaders: () => Record<string, string>;
}

// Token expiry duration (5 days in milliseconds)
const TOKEN_EXPIRY_MS = 5 * 24 * 60 * 60 * 1000;

// Context
const AuthContext = createContext<AuthContextType | null>(null);

// Provider component
export const AuthProvider: React.FC<{ 
  children: React.ReactNode;
  workspace?: string;
  apiUrl?: string;
}> = ({ children, workspace = 'default', apiUrl = 'http://localhost:5002' }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    workspace: workspace,
    loading: true
  });

  // Storage keys based on workspace
  const getStorageKey = (key: string) => `${workspace}_${key}`;

  // Load auth from localStorage on mount
  useEffect(() => {
    const loadStoredAuth = () => {
      try {
        const storedToken = localStorage.getItem(getStorageKey('token'));
        const storedUser = localStorage.getItem(getStorageKey('user'));
        const storedExpiry = localStorage.getItem(getStorageKey('token_expiry'));
        
        if (storedToken && storedUser && storedExpiry) {
          const expiryTime = parseInt(storedExpiry, 10);
          const now = Date.now();
          
          // Check if token is still valid
          if (now < expiryTime) {
            const user = JSON.parse(storedUser);
            setState({
              isAuthenticated: true,
              user,
              token: storedToken,
              workspace: user.workspace || workspace,
              loading: false
            });
            return;
          } else {
            // Token expired, clear storage
            clearStorage();
          }
        }
      } catch (error) {
        console.error('Error loading auth from storage:', error);
        clearStorage();
      }
      
      setState(prev => ({ ...prev, loading: false }));
    };

    loadStoredAuth();
  }, [workspace]);

  // Clear storage helper
  const clearStorage = useCallback(() => {
    localStorage.removeItem(getStorageKey('token'));
    localStorage.removeItem(getStorageKey('user'));
    localStorage.removeItem(getStorageKey('token_expiry'));
    
    // Also clear session storage if used
    sessionStorage.removeItem(getStorageKey('token'));
    sessionStorage.removeItem(getStorageKey('user'));
  }, [workspace]);

  // Login function
  const login = useCallback((token: string, user: User, rememberMe: boolean = true) => {
    // Update state
    setState({
      isAuthenticated: true,
      user,
      token,
      workspace: user.workspace || workspace,
      loading: false
    });
    
    // Store in localStorage if rememberMe is true
    if (rememberMe) {
      const expiryTime = Date.now() + TOKEN_EXPIRY_MS;
      localStorage.setItem(getStorageKey('token'), token);
      localStorage.setItem(getStorageKey('user'), JSON.stringify(user));
      localStorage.setItem(getStorageKey('token_expiry'), expiryTime.toString());
    } else {
      // Store in sessionStorage for current session only
      sessionStorage.setItem(getStorageKey('token'), token);
      sessionStorage.setItem(getStorageKey('user'), JSON.stringify(user));
    }
    
    // Emit custom event for other modules to react
    window.dispatchEvent(new CustomEvent('auth:login', { 
      detail: { user, token, workspace: user.workspace || workspace }
    }));
  }, [workspace]);

  // Logout function
  const logout = useCallback(() => {
    // Clear state
    setState({
      isAuthenticated: false,
      user: null,
      token: null,
      workspace: workspace,
      loading: false
    });
    
    // Clear storage
    clearStorage();
    
    // Emit custom event
    window.dispatchEvent(new CustomEvent('auth:logout'));
  }, [workspace, clearStorage]);

  // Update user function
  const updateUser = useCallback((user: User) => {
    setState(prev => ({
      ...prev,
      user
    }));
    
    // Update in storage if exists
    const storedToken = localStorage.getItem(getStorageKey('token'));
    if (storedToken) {
      localStorage.setItem(getStorageKey('user'), JSON.stringify(user));
    } else {
      const sessionToken = sessionStorage.getItem(getStorageKey('token'));
      if (sessionToken) {
        sessionStorage.setItem(getStorageKey('user'), JSON.stringify(user));
      }
    }
  }, [workspace]);

  // Check auth status with API
  const checkAuth = useCallback(async (): Promise<boolean> => {
    if (!state.token) return false;
    
    try {
      const response = await fetch(`${apiUrl}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${state.token}`,
          'X-Workspace': state.workspace || workspace
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          updateUser(data.user);
        }
        return true;
      } else {
        // Token invalid, logout
        logout();
        return false;
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      return false;
    }
  }, [state.token, state.workspace, workspace, apiUrl, updateUser, logout]);

  // Get auth headers for API calls
  const getAuthHeaders = useCallback((): Record<string, string> => {
    const headers: Record<string, string> = {
      'X-Workspace': state.workspace || workspace
    };
    
    if (state.token) {
      headers['Authorization'] = `Bearer ${state.token}`;
    }
    
    return headers;
  }, [state.token, state.workspace, workspace]);

  // Listen for auth events from other windows/tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === getStorageKey('token')) {
        if (e.newValue) {
          // Token added in another tab
          try {
            const user = localStorage.getItem(getStorageKey('user'));
            if (user) {
              setState({
                isAuthenticated: true,
                user: JSON.parse(user),
                token: e.newValue,
                workspace: workspace,
                loading: false
              });
            }
          } catch (error) {
            console.error('Error syncing auth from storage:', error);
          }
        } else {
          // Token removed in another tab
          logout();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [workspace, logout]);

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    updateUser,
    checkAuth,
    getAuthHeaders
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// HOC for protecting components
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType
) => {
  return (props: P) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
      return <div>Loading...</div>;
    }
    
    if (!isAuthenticated) {
      return fallback ? <fallback /> : null;
    }
    
    return <Component {...props} />;
  };
};