import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme } from './ThemeProvider';

interface User {
  id: string;
  email: string;
}

interface WorkspaceContextType {
  // Workspace info
  workspace: string;
  setWorkspace: (workspace: string) => void;
  
  // Auth
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  
  // Theme management
  themes: Theme[];
  currentTheme: Theme | null;
  saveTheme: (theme: Theme) => Promise<void>;
  loadThemes: () => Promise<void>;
  deleteTheme: (themeId: string) => Promise<void>;
  
  // Template management
  templates: any[];
  saveTemplate: (template: any) => Promise<void>;
  loadTemplates: () => Promise<void>;
  
  // API
  apiUrl: string;
  apiCall: (endpoint: string, options?: RequestInit) => Promise<any>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export interface WorkspaceProviderProps {
  children: ReactNode;
  defaultWorkspace?: string;
  apiUrl?: string;
}

export const WorkspaceProvider: React.FC<WorkspaceProviderProps> = ({
  children,
  defaultWorkspace = 'qwanyx-ui',
  apiUrl = 'http://localhost:5002'
}) => {
  const [workspace, setWorkspaceState] = useState(defaultWorkspace);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [currentTheme] = useState<Theme | null>(null);
  const [templates, setTemplates] = useState<any[]>([]);

  // Load auth from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(`${workspace}_token`);
    const storedUser = localStorage.getItem(`${workspace}_user`);
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, [workspace]);

  // API call helper with auth
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const headers: any = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${apiUrl}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API call failed');
    }

    return response.json();
  };

  // Auth functions
  const login = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem(`${workspace}_token`, newToken);
    localStorage.setItem(`${workspace}_user`, JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(`${workspace}_token`);
    localStorage.removeItem(`${workspace}_user`);
  };

  // Theme management with workspace persistence
  const saveTheme = async (theme: Theme) => {
    if (!user) {
      // Save locally if not authenticated
      const localThemes = JSON.parse(localStorage.getItem(`${workspace}_themes`) || '[]');
      const existingIndex = localThemes.findIndex((t: Theme) => t.name === theme.name);
      
      if (existingIndex >= 0) {
        localThemes[existingIndex] = theme;
      } else {
        localThemes.push(theme);
      }
      
      localStorage.setItem(`${workspace}_themes`, JSON.stringify(localThemes));
      setThemes(localThemes);
      return;
    }

    // Save to server if authenticated
    try {
      await apiCall('/themes', {
        method: 'POST',
        body: JSON.stringify({
          workspace,
          theme
        })
      });
      await loadThemes();
    } catch (error) {
      console.error('Failed to save theme:', error);
      throw error;
    }
  };

  const loadThemes = async () => {
    if (!user) {
      // Load from localStorage if not authenticated
      const localThemes = JSON.parse(localStorage.getItem(`${workspace}_themes`) || '[]');
      setThemes(localThemes);
      return;
    }

    // Load from server if authenticated
    try {
      const data = await apiCall(`/themes?workspace=${workspace}`);
      setThemes(data.themes || []);
    } catch (error) {
      console.error('Failed to load themes:', error);
    }
  };

  const deleteTheme = async (themeId: string) => {
    if (!user) {
      // Delete locally
      const localThemes = JSON.parse(localStorage.getItem(`${workspace}_themes`) || '[]');
      const filtered = localThemes.filter((t: Theme) => t.name !== themeId);
      localStorage.setItem(`${workspace}_themes`, JSON.stringify(filtered));
      setThemes(filtered);
      return;
    }

    // Delete from server
    try {
      await apiCall(`/themes/${themeId}`, {
        method: 'DELETE',
        body: JSON.stringify({ workspace })
      });
      await loadThemes();
    } catch (error) {
      console.error('Failed to delete theme:', error);
      throw error;
    }
  };

  // Template management
  const saveTemplate = async (template: any) => {
    if (!user) {
      // Save locally
      const localTemplates = JSON.parse(localStorage.getItem(`${workspace}_templates`) || '[]');
      localTemplates.push(template);
      localStorage.setItem(`${workspace}_templates`, JSON.stringify(localTemplates));
      setTemplates(localTemplates);
      return;
    }

    // Save to server
    try {
      await apiCall('/templates', {
        method: 'POST',
        body: JSON.stringify({
          workspace,
          template
        })
      });
      await loadTemplates();
    } catch (error) {
      console.error('Failed to save template:', error);
      throw error;
    }
  };

  const loadTemplates = async () => {
    if (!user) {
      // Load locally
      const localTemplates = JSON.parse(localStorage.getItem(`${workspace}_templates`) || '[]');
      setTemplates(localTemplates);
      return;
    }

    // Load from server
    try {
      const data = await apiCall(`/templates?workspace=${workspace}`);
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  // Switch workspace
  const setWorkspace = (newWorkspace: string) => {
    setWorkspaceState(newWorkspace);
    // Clear current auth if switching workspace
    setUser(null);
    setToken(null);
    // Load new workspace data
    const storedToken = localStorage.getItem(`${newWorkspace}_token`);
    const storedUser = localStorage.getItem(`${newWorkspace}_user`);
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  };

  // Load themes and templates on mount or workspace change
  useEffect(() => {
    loadThemes();
    loadTemplates();
  }, [workspace, user]);

  const value: WorkspaceContextType = {
    workspace,
    setWorkspace,
    user,
    token,
    isAuthenticated: !!user,
    login,
    logout,
    themes,
    currentTheme,
    saveTheme,
    loadThemes,
    deleteTheme,
    templates,
    saveTemplate,
    loadTemplates,
    apiUrl,
    apiCall
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};