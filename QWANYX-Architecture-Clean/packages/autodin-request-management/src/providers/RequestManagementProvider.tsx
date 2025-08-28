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
        // MOCK DATA pour le moment - à remplacer par l'API SPU plus tard
        requests = [
          {
            _id: '1',
            userId: 'user1',
            userEmail: 'jean.dupont@gmail.com',
            userName: 'Jean Dupont',
            title: 'Phare avant Golf 5',
            description: 'Recherche phare avant droit pour Golf 5 année 2008',
            partName: 'Phare avant droit',
            carBrand: 'Volkswagen',
            carModel: 'Golf 5',
            year: '2008',
            status: 'open',
            createdAt: new Date('2024-03-15').toISOString(),
            urgency: 'high',
            proposals: [
              {
                _id: 'p1',
                requestId: '1',
                professionalId: 'pro1',
                professionalName: 'Auto Parts Pro',
                professionalEmail: 'contact@autopartspro.be',
                price: 120,
                description: 'Phare neuf, garantie 2 ans',
                availability: 'En stock',
                condition: 'new',
                warranty: '2 ans',
                createdAt: new Date('2024-03-16').toISOString(),
                status: 'pending'
              }
            ]
          },
          {
            _id: '2',
            userId: 'user2',
            userEmail: 'marie.martin@hotmail.com',
            userName: 'Marie Martin',
            title: 'Rétroviseur Clio 3',
            description: 'Cherche rétroviseur gauche électrique pour Renault Clio 3',
            partName: 'Rétroviseur gauche',
            carBrand: 'Renault',
            carModel: 'Clio 3',
            year: '2010',
            status: 'open',
            createdAt: new Date('2024-03-14').toISOString(),
            urgency: 'medium',
            proposals: []
          },
          {
            _id: '3',
            userId: 'user1',
            userEmail: 'jean.dupont@gmail.com',
            userName: 'Jean Dupont',
            title: 'Pare-choc arrière 206',
            description: 'Recherche pare-choc arrière pour Peugeot 206, couleur gris métallisé si possible',
            partName: 'Pare-choc arrière',
            carBrand: 'Peugeot',
            carModel: '206',
            year: '2005',
            status: 'fulfilled',
            createdAt: new Date('2024-03-10').toISOString(),
            urgency: 'low',
            proposals: [
              {
                _id: 'p2',
                requestId: '3',
                professionalId: 'pro2',
                professionalName: 'Casse Auto Bruxelles',
                professionalEmail: 'info@casseauto.be',
                price: 85,
                description: 'Pare-choc d\'occasion en bon état',
                availability: 'Disponible',
                condition: 'used',
                warranty: '3 mois',
                createdAt: new Date('2024-03-11').toISOString(),
                status: 'accepted'
              }
            ]
          },
          {
            _id: '4',
            userId: 'user3',
            userEmail: 'pierre.bernard@yahoo.fr',
            userName: 'Pierre Bernard',
            title: 'Jantes alu 17 pouces',
            description: 'Recherche jantes aluminium 17 pouces 5 trous pour Audi A4',
            partName: 'Jantes aluminium',
            carBrand: 'Audi',
            carModel: 'A4',
            year: '2015',
            status: 'open',
            createdAt: new Date('2024-03-16').toISOString(),
            urgency: 'low',
            proposals: [
              {
                _id: 'p3',
                requestId: '4',
                professionalId: 'pro1',
                professionalName: 'Auto Parts Pro',
                professionalEmail: 'contact@autopartspro.be',
                price: 450,
                description: 'Set de 4 jantes neuves',
                availability: 'Sur commande (5 jours)',
                condition: 'new',
                warranty: '3 ans',
                createdAt: new Date('2024-03-17').toISOString(),
                status: 'pending'
              },
              {
                _id: 'p4',
                requestId: '4',
                professionalId: 'pro3',
                professionalName: 'Garage Central',
                professionalEmail: 'garage.central@gmail.com',
                price: 280,
                description: 'Jantes d\'occasion révisées',
                availability: 'En stock',
                condition: 'refurbished',
                warranty: '6 mois',
                createdAt: new Date('2024-03-17').toISOString(),
                status: 'pending'
              }
            ]
          }
        ]
        
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 300))
      }
      
      dispatch({ type: 'SET_REQUESTS', payload: requests })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load requests' })
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
      const response = await fetch(`${config.apiUrl}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('autodin_token')}`
        },
        body: JSON.stringify({ ...request, workspace: config.workspace })
      })
      
      if (!response.ok) {
        throw new Error('Failed to add request')
      }
      
      const newRequest = await response.json()
      dispatch({ type: 'ADD_REQUEST', payload: newRequest })
    }
  }, [config, loadRequests])

  const editRequest = useCallback(async (request: PartRequest) => {
    if (config.onRequestEdit) {
      await config.onRequestEdit(request)
      await loadRequests()
    } else if (config.apiUrl) {
      const requestId = request._id || request.id
      const response = await fetch(`${config.apiUrl}/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('autodin_token')}`
        },
        body: JSON.stringify(request)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update request')
      }
      
      const updatedRequest = await response.json()
      dispatch({ type: 'UPDATE_REQUEST', payload: updatedRequest })
    }
  }, [config, loadRequests])

  const deleteRequest = useCallback(async (requestId: string) => {
    if (config.onRequestDelete) {
      await config.onRequestDelete(requestId)
      await loadRequests()
    } else if (config.apiUrl) {
      const response = await fetch(`${config.apiUrl}/requests/${requestId}`, {
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
      const response = await fetch(`${config.apiUrl}/proposals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('autodin_token')}`
        },
        body: JSON.stringify({ ...proposal, workspace: config.workspace })
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