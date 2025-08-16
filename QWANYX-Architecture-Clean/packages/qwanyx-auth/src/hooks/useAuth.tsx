import { useContext } from 'react'
import { AuthContext } from '../providers/AuthProvider'

export interface AuthContextType {
  user: any | null
  token: string | null
  loading: boolean
  login: (token: string, user: any, remember?: boolean) => void
  logout: () => void
  isAuthenticated: () => boolean
  workspace?: string
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}