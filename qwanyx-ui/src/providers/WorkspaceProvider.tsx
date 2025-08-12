import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { themes, getThemeByWorkspace, getAllThemes, Theme } from '../themes';

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
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
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

  // Theme management - themes are now static files
  const saveTheme = async (theme: Theme) => {
    console.warn('Themes are now static files. To add a new theme, create a JSON file in src/themes/');
    // Themes are read-only from files, no saving needed
  };

  const loadThemes = async () => {
    // Load themes from static files
    const allThemes = getAllThemes();
    setThemes(allThemes);
    
    // Set current theme based on workspace
    const workspaceTheme = getThemeByWorkspace(workspace);
    setCurrentTheme(workspaceTheme);
  };

  const deleteTheme = async (themeId: string) => {
    console.warn('Themes are now static files. To remove a theme, delete its JSON file from src/themes/');
    // Themes are read-only from files, no deletion needed
  };

  // Template management - templates are now static files
  const saveTemplate = async (template: any) => {
    console.warn('Templates are now static files. To add a new template, create a file in src/templates/');
    // Templates are read-only from files, no saving needed
  };

  const loadTemplates = async () => {
    // Templates will be loaded from static files when implemented
    setTemplates([]);
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