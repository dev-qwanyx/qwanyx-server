import React, { createContext, useState, useEffect, ReactNode } from 'react'
import { AuthContextType } from '../hooks/useAuth'

export const AuthContext = createContext<AuthContextType | null>(null)

export interface AuthProviderProps {
  children: ReactNode
  workspace: string
  onAuthChange?: (isAuthenticated: boolean, user: any | null) => void
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ 
  children, 
  workspace,
  onAuthChange 
}) => {
  const [user, setUser] = useState<any | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Load auth from storage on mount
  useEffect(() => {
    const loadAuth = () => {
      // Check localStorage first (for remember me)
      let storedToken = localStorage.getItem(`${workspace}_token`)
      let storedUser = localStorage.getItem(`${workspace}_user`)
      const tokenExpiry = localStorage.getItem(`${workspace}_token_expiry`)
      
      // Check if token is expired
      if (storedToken && tokenExpiry) {
        const expiryTime = parseInt(tokenExpiry, 10)
        if (Date.now() > expiryTime) {
          // Token expired, clear it
          localStorage.removeItem(`${workspace}_token`)
          localStorage.removeItem(`${workspace}_user`)
          localStorage.removeItem(`${workspace}_token_expiry`)
          storedToken = null
          storedUser = null
        }
      }
      
      // If not in localStorage, check sessionStorage
      if (!storedToken) {
        storedToken = sessionStorage.getItem(`${workspace}_token`)
        storedUser = sessionStorage.getItem(`${workspace}_user`)
      }
      
      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setToken(storedToken)
          setUser(parsedUser)
          if (onAuthChange) {
            onAuthChange(true, parsedUser)
          }
        } catch (err) {
          console.error('Failed to parse stored user:', err)
        }
      }
      
      setLoading(false)
    }
    
    loadAuth()
  }, [workspace, onAuthChange])

  const login = (newToken: string, newUser: any, remember: boolean = false) => {
    setToken(newToken)
    setUser(newUser)
    
    if (remember) {
      const expiryTime = Date.now() + (5 * 24 * 60 * 60 * 1000) // 5 days
      localStorage.setItem(`${workspace}_token`, newToken)
      localStorage.setItem(`${workspace}_user`, JSON.stringify(newUser))
      localStorage.setItem(`${workspace}_token_expiry`, expiryTime.toString())
    } else {
      sessionStorage.setItem(`${workspace}_token`, newToken)
      sessionStorage.setItem(`${workspace}_user`, JSON.stringify(newUser))
    }
    
    if (onAuthChange) {
      onAuthChange(true, newUser)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    
    // Clear from both storages
    localStorage.removeItem(`${workspace}_token`)
    localStorage.removeItem(`${workspace}_user`)
    localStorage.removeItem(`${workspace}_token_expiry`)
    sessionStorage.removeItem(`${workspace}_token`)
    sessionStorage.removeItem(`${workspace}_user`)
    
    if (onAuthChange) {
      onAuthChange(false, null)
    }
  }

  const isAuthenticated = () => {
    return !!token && !!user
  }

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
    workspace
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}