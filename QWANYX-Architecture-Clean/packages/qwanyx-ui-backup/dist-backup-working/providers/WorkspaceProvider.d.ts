import { default as React, ReactNode } from 'react';
import { Theme } from '../themes';
interface User {
    id: string;
    email: string;
}
interface WorkspaceContextType {
    workspace: string;
    setWorkspace: (workspace: string) => void;
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    themes: Theme[];
    currentTheme: Theme | null;
    saveTheme: () => Promise<void>;
    loadThemes: () => Promise<void>;
    deleteTheme: () => Promise<void>;
    templates: any[];
    saveTemplate: () => Promise<void>;
    loadTemplates: () => Promise<void>;
    apiUrl: string;
    apiCall: (endpoint: string, options?: RequestInit) => Promise<any>;
}
export interface WorkspaceProviderProps {
    children: ReactNode;
    defaultWorkspace?: string;
    apiUrl?: string;
}
export declare const WorkspaceProvider: React.FC<WorkspaceProviderProps>;
export declare const useWorkspace: () => WorkspaceContextType;
export {};
//# sourceMappingURL=WorkspaceProvider.d.ts.map