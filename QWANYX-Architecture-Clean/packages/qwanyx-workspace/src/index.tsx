import React, { createContext, useContext, useEffect, ReactNode } from 'react'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Types and interfaces
export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  name?: string
  avatar?: string
  role?: string
  permissions?: string[]
  metadata?: Record<string, any>
}

export interface Workspace {
  id: string
  name: string
  slug: string
  description?: string
  logo?: string
  settings?: WorkspaceSettings
  createdAt: Date
  updatedAt: Date
}

export interface WorkspaceSettings {
  theme?: 'light' | 'dark' | 'auto'
  primaryColor?: string
  language?: string
  timezone?: string
  features?: Record<string, boolean>
  customSettings?: Record<string, any>
}

export interface WorkspaceMember {
  userId: string
  workspaceId: string
  role: WorkspaceRole
  permissions: string[]
  joinedAt: Date
  user?: User
}

export type WorkspaceRole = 'owner' | 'admin' | 'member' | 'viewer' | 'guest'

export interface WorkspaceState {
  // Current context
  currentWorkspace: Workspace | null
  currentUser: User | null
  currentMember: WorkspaceMember | null
  
  // Available data
  workspaces: Workspace[]
  
  // State
  isLoading: boolean
  isAuthenticated: boolean
  
  // Actions
  setCurrentWorkspace: (workspace: Workspace | null) => void
  setCurrentUser: (user: User | null) => void
  setCurrentMember: (member: WorkspaceMember | null) => void
  setWorkspaces: (workspaces: Workspace[]) => void
  switchWorkspace: (workspaceId: string) => Promise<void>
  login: (user: User, workspace?: Workspace) => void
  logout: () => void
  updateWorkspaceSettings: (settings: Partial<WorkspaceSettings>) => void
  hasPermission: (permission: string) => boolean
  hasRole: (role: WorkspaceRole | WorkspaceRole[]) => boolean
}

// Permission utilities
const ROLE_HIERARCHY: Record<WorkspaceRole, number> = {
  owner: 5,
  admin: 4,
  member: 3,
  viewer: 2,
  guest: 1
}

export const hasRolePermission = (
  userRole: WorkspaceRole,
  requiredRole: WorkspaceRole
): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

// Zustand store with persistence
export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentWorkspace: null,
      currentUser: null,
      currentMember: null,
      workspaces: [],
      isLoading: false,
      isAuthenticated: false,
      
      // Actions
      setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
      setCurrentUser: (user) => set({ 
        currentUser: user,
        isAuthenticated: !!user 
      }),
      setCurrentMember: (member) => set({ currentMember: member }),
      setWorkspaces: (workspaces) => set({ workspaces }),
      
      switchWorkspace: async (workspaceId) => {
        const workspace = get().workspaces.find(w => w.id === workspaceId)
        if (workspace) {
          set({ 
            currentWorkspace: workspace,
            isLoading: true 
          })
          
          // Here you would typically fetch workspace-specific data
          // For now, we'll just simulate an async operation
          await new Promise(resolve => setTimeout(resolve, 100))
          
          set({ isLoading: false })
        }
      },
      
      login: (user, workspace) => {
        set({
          currentUser: user,
          currentWorkspace: workspace || get().currentWorkspace,
          isAuthenticated: true
        })
      },
      
      logout: () => {
        set({
          currentUser: null,
          currentWorkspace: null,
          currentMember: null,
          isAuthenticated: false,
          workspaces: []
        })
      },
      
      updateWorkspaceSettings: (settings) => {
        const currentWorkspace = get().currentWorkspace
        if (currentWorkspace) {
          set({
            currentWorkspace: {
              ...currentWorkspace,
              settings: {
                ...currentWorkspace.settings,
                ...settings
              },
              updatedAt: new Date()
            }
          })
        }
      },
      
      hasPermission: (permission) => {
        const member = get().currentMember
        if (!member) return false
        
        // Owners have all permissions
        if (member.role === 'owner') return true
        
        // Check specific permissions
        return member.permissions.includes(permission)
      },
      
      hasRole: (role) => {
        const member = get().currentMember
        if (!member) return false
        
        if (Array.isArray(role)) {
          return role.some(r => hasRolePermission(member.role, r))
        }
        
        return hasRolePermission(member.role, role)
      }
    }),
    {
      name: 'qwanyx-workspace',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentWorkspace: state.currentWorkspace,
        currentUser: state.currentUser,
        currentMember: state.currentMember,
        workspaces: state.workspaces,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

// React Context for additional features
interface WorkspaceContextValue {
  workspace: Workspace | null
  user: User | null
  member: WorkspaceMember | null
  isLoading: boolean
  isAuthenticated: boolean
  switchWorkspace: (workspaceId: string) => Promise<void>
  hasPermission: (permission: string) => boolean
  hasRole: (role: WorkspaceRole | WorkspaceRole[]) => boolean
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined)

// Provider component
export interface WorkspaceProviderProps {
  children: ReactNode
  onWorkspaceChange?: (workspace: Workspace | null) => void
  onAuthChange?: (isAuthenticated: boolean) => void
}

export const WorkspaceProvider: React.FC<WorkspaceProviderProps> = ({
  children,
  onWorkspaceChange,
  onAuthChange
}) => {
  const {
    currentWorkspace,
    currentUser,
    currentMember,
    isLoading,
    isAuthenticated,
    switchWorkspace,
    hasPermission,
    hasRole
  } = useWorkspaceStore()
  
  // Notify about workspace changes
  useEffect(() => {
    if (onWorkspaceChange) {
      onWorkspaceChange(currentWorkspace)
    }
  }, [currentWorkspace, onWorkspaceChange])
  
  // Notify about auth changes
  useEffect(() => {
    if (onAuthChange) {
      onAuthChange(isAuthenticated)
    }
  }, [isAuthenticated, onAuthChange])
  
  const value: WorkspaceContextValue = {
    workspace: currentWorkspace,
    user: currentUser,
    member: currentMember,
    isLoading,
    isAuthenticated,
    switchWorkspace,
    hasPermission,
    hasRole
  }
  
  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  )
}

// Hook to use workspace context
export const useWorkspace = () => {
  const context = useContext(WorkspaceContext)
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider')
  }
  return context
}

// Convenience hooks
export const useCurrentUser = () => {
  const { user } = useWorkspace()
  return user
}

export const useCurrentWorkspace = () => {
  const { workspace } = useWorkspace()
  return workspace
}

export const usePermissions = () => {
  const { hasPermission, hasRole } = useWorkspace()
  return { hasPermission, hasRole }
}

// HOC for protecting components with permissions
export interface WithPermissionOptions {
  permission?: string
  role?: WorkspaceRole | WorkspaceRole[]
  fallback?: ReactNode
  redirectTo?: string
}

export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  options: WithPermissionOptions
) {
  return (props: P) => {
    const { hasPermission, hasRole } = useWorkspace()
    
    const hasAccess = (() => {
      if (options.permission && !hasPermission(options.permission)) {
        return false
      }
      if (options.role && !hasRole(options.role)) {
        return false
      }
      return true
    })()
    
    if (!hasAccess) {
      if (options.fallback) {
        return <>{options.fallback}</>
      }
      
      if (options.redirectTo && typeof window !== 'undefined') {
        window.location.href = options.redirectTo
      }
      
      return null
    }
    
    return <Component {...props} />
  }
}

// Utility to create workspace-aware API client
export interface WorkspaceAPIConfig {
  baseURL: string
  getAuthToken?: () => string | null
}

export const createWorkspaceAPI = (config: WorkspaceAPIConfig) => {
  const makeRequest = async (
    endpoint: string,
    options: RequestInit = {}
  ) => {
    const store = useWorkspaceStore.getState()
    const workspace = store.currentWorkspace
    const user = store.currentUser
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    }
    
    // Add workspace header if available
    if (workspace) {
      headers['X-Workspace-Id'] = workspace.id
    }
    
    // Add auth token if available
    const token = config.getAuthToken?.()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    // Add user context if available
    if (user) {
      headers['X-User-Id'] = user.id
    }
    
    const response = await fetch(`${config.baseURL}${endpoint}`, {
      ...options,
      headers
    })
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }
    
    return response.json()
  }
  
  return {
    get: (endpoint: string) => makeRequest(endpoint, { method: 'GET' }),
    post: (endpoint: string, data: any) => 
      makeRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    put: (endpoint: string, data: any) =>
      makeRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    delete: (endpoint: string) => makeRequest(endpoint, { method: 'DELETE' })
  }
}

// Export everything
export default {
  WorkspaceProvider,
  useWorkspace,
  useCurrentUser,
  useCurrentWorkspace,
  usePermissions,
  useWorkspaceStore,
  withPermission,
  createWorkspaceAPI,
  hasRolePermission
}