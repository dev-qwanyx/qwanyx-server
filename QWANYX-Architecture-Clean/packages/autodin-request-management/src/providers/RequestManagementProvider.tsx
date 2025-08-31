import { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react'
import { PartRequest, RequestManagementConfig, RequestManagementState, RequestFilter, Proposal } from '../types'

interface RequestManagementContextValue extends RequestManagementState {
  config: RequestManagementConfig
  loadRequests: () => Promise<void>
  setFilter: (filter: RequestFilter) => void
  selectRequest: (requestId: string) => void
  unselectRequest: (requestId: string) => void
  selectAllRequests: () => void
  unselectAllRequests: () => void
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  addRequest: (request: Partial<PartRequest>) => Promise<void>
  editRequest: (request: PartRequest) => Promise<void>
  deleteRequest: (requestId: string) => Promise<void>
  deleteSelectedRequests: () => Promise<void>
  addProposal: (proposal: Partial<Proposal>) => Promise<void>
}

const RequestManagementContext = createContext<RequestManagementContextValue | undefined>(undefined)

type RequestManagementAction =
  | { type: 'SET_REQUESTS'; payload: PartRequest[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FILTER'; payload: RequestFilter }
  | { type: 'SELECT_REQUEST'; payload: string }
  | { type: 'UNSELECT_REQUEST'; payload: string }
  | { type: 'SELECT_ALL_REQUESTS' }
  | { type: 'UNSELECT_ALL_REQUESTS' }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_PAGE_SIZE'; payload: number }
  | { type: 'SET_SORTING'; payload: { sortBy: string; sortOrder: 'asc' | 'desc' } }
  | { type: 'ADD_REQUEST'; payload: PartRequest }
  | { type: 'UPDATE_REQUEST'; payload: PartRequest }
  | { type: 'DELETE_REQUEST'; payload: string }
  | { type: 'DELETE_REQUESTS'; payload: string[] }

const initialState: RequestManagementState = {
  requests: [],
  loading: false,
  error: null,
  filter: {},
  selectedRequests: [],
  currentPage: 1,
  pageSize: 10,
  totalRequests: 0,
  sortBy: 'createdAt',
  sortOrder: 'desc'
}

function requestManagementReducer(state: RequestManagementState, action: RequestManagementAction): RequestManagementState {
  switch (action.type) {
    case 'SET_REQUESTS':
      return { ...state, requests: action.payload, totalRequests: action.payload.length }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_FILTER':
      return { ...state, filter: action.payload, currentPage: 1 }
    case 'SELECT_REQUEST':
      return { ...state, selectedRequests: [...state.selectedRequests, action.payload] }
    case 'UNSELECT_REQUEST':
      return { ...state, selectedRequests: state.selectedRequests.filter(id => id !== action.payload) }
    case 'SELECT_ALL_REQUESTS':
      return { ...state, selectedRequests: state.requests.map(r => r._id || r.id || '') }
    case 'UNSELECT_ALL_REQUESTS':
      return { ...state, selectedRequests: [] }
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload }
    case 'SET_PAGE_SIZE':
      return { ...state, pageSize: action.payload, currentPage: 1 }
    case 'SET_SORTING':
      return { ...state, ...action.payload }
    case 'ADD_REQUEST':
      return { ...state, requests: [action.payload, ...state.requests], totalRequests: state.totalRequests + 1 }
    case 'UPDATE_REQUEST':
      return {
        ...state,
        requests: state.requests.map(r => 
          (r._id === action.payload._id || r.id === action.payload.id) ? action.payload : r
        )
      }
    case 'DELETE_REQUEST':
      return {
        ...state,
        requests: state.requests.filter(r => r._id !== action.payload && r.id !== action.payload),
        totalRequests: state.totalRequests - 1,
        selectedRequests: state.selectedRequests.filter(id => id !== action.payload)
      }
    case 'DELETE_REQUESTS':
      return {
        ...state,
        requests: state.requests.filter(r => !action.payload.includes(r._id || r.id || '')),
        totalRequests: state.totalRequests - action.payload.length,
        selectedRequests: []
      }
    default:
      return state
  }
}

interface RequestManagementProviderProps {
  children: ReactNode
  config?: RequestManagementConfig
}

export function RequestManagementProvider({ children, config = {} }: RequestManagementProviderProps) {
  const [state, dispatch] = useReducer(requestManagementReducer, initialState)

  const loadRequests = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })
    
    try {
      let requests: PartRequest[] = []
      
      if (config.fetchRequests) {
        requests = await config.fetchRequests()
      } else if (config.apiUrl) {
        // Fetch data from SPU endpoint
        const workspace = config.workspace || 'autodin'
        const response = await fetch(`${config.apiUrl}/data/requests?workspace=${workspace}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('autodin_token')}`
          }
        })
        
        if (!response.ok) {
          // JIDOKA: Fail visibly - no fallbacks!
          const errorText = await response.text()
          throw new Error(`SPU endpoint failed (${response.status}): ${errorText}`)
        }
        
        const data = await response.json()
        // SPU returns array directly now
        requests = Array.isArray(data) ? data : []
      }
      
      dispatch({ type: 'SET_REQUESTS', payload: requests })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load requests'
      console.error('🔴 CRITICAL FAILURE - RequestManagement:', errorMessage)
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      // JIDOKA: Error is now in state and will be displayed
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [config])

  const setFilter = useCallback((filter: RequestFilter) => {
    dispatch({ type: 'SET_FILTER', payload: filter })
  }, [])

  const selectRequest = useCallback((requestId: string) => {
    dispatch({ type: 'SELECT_REQUEST', payload: requestId })
  }, [])

  const unselectRequest = useCallback((requestId: string) => {
    dispatch({ type: 'UNSELECT_REQUEST', payload: requestId })
  }, [])

  const selectAllRequests = useCallback(() => {
    dispatch({ type: 'SELECT_ALL_REQUESTS' })
  }, [])

  const unselectAllRequests = useCallback(() => {
    dispatch({ type: 'UNSELECT_ALL_REQUESTS' })
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

  const addRequest = useCallback(async (request: Partial<PartRequest>) => {
    if (config.onRequestAdd) {
      await config.onRequestAdd(request)
      await loadRequests()
    } else if (config.apiUrl) {
      const workspace = config.workspace || 'autodin'
      const response = await fetch(`${config.apiUrl}/data/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('autodin_token')}`
        },
        body: JSON.stringify({ 
          workspace,
          data: {
            ...request,
            userId: config.currentUserId || 'anonymous',
            userEmail: config.currentUserEmail || 'anonymous@autodin.be',
            userName: config.currentUserName || 'Anonymous',
            status: request.status || 'open',
            createdAt: new Date().toISOString(),
            proposals: request.proposals || []
          }
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to add request')
      }
      
      const result = await response.json()
      // SPU returns { success: true, id: "..." } format
      if (result.success) {
        // Reload the full list to get the new request with all data
        await loadRequests()
      }
    }
  }, [config, loadRequests])

  const editRequest = useCallback(async (request: PartRequest) => {
    if (config.onRequestEdit) {
      await config.onRequestEdit(request)
      await loadRequests()
    } else if (config.apiUrl) {
      const requestId = request._id || request.id
      const workspace = config.workspace || 'autodin'
      const response = await fetch(`${config.apiUrl}/data/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('autodin_token')}`
        },
        body: JSON.stringify({
          workspace,
          data: request
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update request')
      }
      
      const result = await response.json()
      // SPU returns data in { success: true, data: {...} } format
      if (result.success) {
        // Reload the full list to ensure consistency with database
        await loadRequests()
      }
    }
  }, [config, loadRequests])

  const deleteRequest = useCallback(async (requestId: string) => {
    if (config.onRequestDelete) {
      await config.onRequestDelete(requestId)
      await loadRequests()
    } else if (config.apiUrl) {
      const workspace = config.workspace || 'autodin'
      const response = await fetch(`${config.apiUrl}/data/requests/${requestId}?workspace=${workspace}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('autodin_token')}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete request')
      }
      
      dispatch({ type: 'DELETE_REQUEST', payload: requestId })
    }
  }, [config, loadRequests])

  const deleteSelectedRequests = useCallback(async () => {
    const promises = state.selectedRequests.map(requestId => deleteRequest(requestId))
    await Promise.all(promises)
    dispatch({ type: 'DELETE_REQUESTS', payload: state.selectedRequests })
  }, [state.selectedRequests, deleteRequest])

  const addProposal = useCallback(async (proposal: Partial<Proposal>) => {
    if (config.onProposalAdd) {
      await config.onProposalAdd(proposal)
      await loadRequests()
    } else if (config.apiUrl) {
      const workspace = config.workspace || 'autodin'
      const response = await fetch(`${config.apiUrl}/data/proposals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('autodin_token')}`
        },
        body: JSON.stringify({ 
          workspace,
          data: {
            ...proposal,
            createdAt: new Date().toISOString(),
            status: proposal.status || 'pending'
          }
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to add proposal')
      }
      
      await loadRequests()
    }
  }, [config, loadRequests])

  useEffect(() => {
    loadRequests()
  }, [loadRequests])

  const value: RequestManagementContextValue = {
    ...state,
    config,
    loadRequests,
    setFilter,
    selectRequest,
    unselectRequest,
    selectAllRequests,
    unselectAllRequests,
    setPage,
    setPageSize,
    setSorting,
    addRequest,
    editRequest,
    deleteRequest,
    deleteSelectedRequests,
    addProposal
  }

  return (
    <RequestManagementContext.Provider value={value}>
      {children}
    </RequestManagementContext.Provider>
  )
}

export function useRequestManagement() {
  const context = useContext(RequestManagementContext)
  if (!context) {
    throw new Error('useRequestManagement must be used within RequestManagementProvider')
  }
  return context
}