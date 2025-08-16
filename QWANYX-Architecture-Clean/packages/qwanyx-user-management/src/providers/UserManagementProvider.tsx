import { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react'
import { User, UserManagementConfig, UserManagementState, UserFilter } from '../types'

interface UserManagementContextValue extends UserManagementState {
  config: UserManagementConfig
  loadUsers: () => Promise<void>
  setFilter: (filter: UserFilter) => void
  selectUser: (userId: string) => void
  unselectUser: (userId: string) => void
  selectAllUsers: () => void
  unselectAllUsers: () => void
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  addUser: (user: Partial<User>) => Promise<void>
  editUser: (user: User) => Promise<void>
  deleteUser: (userId: string) => Promise<void>
  deleteSelectedUsers: () => Promise<void>
}

const UserManagementContext = createContext<UserManagementContextValue | undefined>(undefined)

type UserManagementAction =
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FILTER'; payload: UserFilter }
  | { type: 'SELECT_USER'; payload: string }
  | { type: 'UNSELECT_USER'; payload: string }
  | { type: 'SELECT_ALL_USERS' }
  | { type: 'UNSELECT_ALL_USERS' }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_PAGE_SIZE'; payload: number }
  | { type: 'SET_SORTING'; payload: { sortBy: string; sortOrder: 'asc' | 'desc' } }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'DELETE_USERS'; payload: string[] }

const initialState: UserManagementState = {
  users: [],
  loading: false,
  error: null,
  filter: {},
  selectedUsers: [],
  currentPage: 1,
  pageSize: 10,
  totalUsers: 0,
  sortBy: 'createdAt',
  sortOrder: 'desc'
}

function userManagementReducer(state: UserManagementState, action: UserManagementAction): UserManagementState {
  switch (action.type) {
    case 'SET_USERS':
      return { ...state, users: action.payload, totalUsers: action.payload.length }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_FILTER':
      return { ...state, filter: action.payload, currentPage: 1 }
    case 'SELECT_USER':
      return { ...state, selectedUsers: [...state.selectedUsers, action.payload] }
    case 'UNSELECT_USER':
      return { ...state, selectedUsers: state.selectedUsers.filter(id => id !== action.payload) }
    case 'SELECT_ALL_USERS':
      return { ...state, selectedUsers: state.users.map(u => u._id || u.id || '') }
    case 'UNSELECT_ALL_USERS':
      return { ...state, selectedUsers: [] }
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload }
    case 'SET_PAGE_SIZE':
      return { ...state, pageSize: action.payload, currentPage: 1 }
    case 'SET_SORTING':
      return { ...state, ...action.payload }
    case 'ADD_USER':
      return { ...state, users: [action.payload, ...state.users], totalUsers: state.totalUsers + 1 }
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(u => 
          (u._id === action.payload._id || u.id === action.payload.id) ? action.payload : u
        )
      }
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(u => u._id !== action.payload && u.id !== action.payload),
        totalUsers: state.totalUsers - 1,
        selectedUsers: state.selectedUsers.filter(id => id !== action.payload)
      }
    case 'DELETE_USERS':
      return {
        ...state,
        users: state.users.filter(u => !action.payload.includes(u._id || u.id || '')),
        totalUsers: state.totalUsers - action.payload.length,
        selectedUsers: []
      }
    default:
      return state
  }
}

interface UserManagementProviderProps {
  children: ReactNode
  config?: UserManagementConfig
}

export function UserManagementProvider({ children, config = {} }: UserManagementProviderProps) {
  const [state, dispatch] = useReducer(userManagementReducer, initialState)

  const loadUsers = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })
    
    try {
      let users: User[] = []
      
      if (config.fetchUsers) {
        users = await config.fetchUsers()
      } else if (config.apiUrl) {
        const url = new URL(`${config.apiUrl}/users`)
        if (config.workspace) {
          url.searchParams.append('workspace', config.workspace)
        }
        
        const response = await fetch(url.toString(), {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.statusText}`)
        }
        
        const data = await response.json()
        users = data.users || data
      }
      
      dispatch({ type: 'SET_USERS', payload: users })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load users' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [config])

  const setFilter = useCallback((filter: UserFilter) => {
    dispatch({ type: 'SET_FILTER', payload: filter })
  }, [])

  const selectUser = useCallback((userId: string) => {
    dispatch({ type: 'SELECT_USER', payload: userId })
  }, [])

  const unselectUser = useCallback((userId: string) => {
    dispatch({ type: 'UNSELECT_USER', payload: userId })
  }, [])

  const selectAllUsers = useCallback(() => {
    dispatch({ type: 'SELECT_ALL_USERS' })
  }, [])

  const unselectAllUsers = useCallback(() => {
    dispatch({ type: 'UNSELECT_ALL_USERS' })
  }, [])

  const setPage = useCallback((page: number) => {
    dispatch({ type: 'SET_PAGE', payload: page })
  }, [])

  const setPageSize = useCallback((size: number) => {
    dispatch({ type: 'SET_PAGE_SIZE', payload: size })
  }, [])

  const setSorting = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    dispatch({ type: 'SET_SORTING', payload: { sortBy, sortOrder } })
  }, [])

  const addUser = useCallback(async (user: Partial<User>) => {
    if (config.onUserAdd) {
      await config.onUserAdd(user)
      await loadUsers()
    } else if (config.apiUrl) {
      const response = await fetch(`${config.apiUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...user, workspace: config.workspace })
      })
      
      if (!response.ok) {
        throw new Error('Failed to add user')
      }
      
      const newUser = await response.json()
      dispatch({ type: 'ADD_USER', payload: newUser })
    }
  }, [config, loadUsers])

  const editUser = useCallback(async (user: User) => {
    if (config.onUserEdit) {
      await config.onUserEdit(user)
      await loadUsers()
    } else if (config.apiUrl) {
      const userId = user._id || user.id
      const response = await fetch(`${config.apiUrl}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(user)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update user')
      }
      
      const updatedUser = await response.json()
      dispatch({ type: 'UPDATE_USER', payload: updatedUser })
    }
  }, [config, loadUsers])

  const deleteUser = useCallback(async (userId: string) => {
    if (config.onUserDelete) {
      await config.onUserDelete(userId)
      await loadUsers()
    } else if (config.apiUrl) {
      const response = await fetch(`${config.apiUrl}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete user')
      }
      
      dispatch({ type: 'DELETE_USER', payload: userId })
    }
  }, [config, loadUsers])

  const deleteSelectedUsers = useCallback(async () => {
    const promises = state.selectedUsers.map(userId => deleteUser(userId))
    await Promise.all(promises)
    dispatch({ type: 'DELETE_USERS', payload: state.selectedUsers })
  }, [state.selectedUsers, deleteUser])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const value: UserManagementContextValue = {
    ...state,
    config,
    loadUsers,
    setFilter,
    selectUser,
    unselectUser,
    selectAllUsers,
    unselectAllUsers,
    setPage,
    setPageSize,
    setSorting,
    addUser,
    editUser,
    deleteUser,
    deleteSelectedUsers
  }

  return (
    <UserManagementContext.Provider value={value}>
      {children}
    </UserManagementContext.Provider>
  )
}

export function useUserManagement() {
  const context = useContext(UserManagementContext)
  if (!context) {
    throw new Error('useUserManagement must be used within UserManagementProvider')
  }
  return context
}