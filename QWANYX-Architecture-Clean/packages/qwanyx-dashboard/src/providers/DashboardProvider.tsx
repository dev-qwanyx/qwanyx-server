import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { DashboardConfig, DashboardMenuItem } from '../types'

export interface DashboardModule {
  id: string
  name: string
  component: React.ComponentType<any>
  loaded: boolean
}

interface DashboardContextValue {
  config: DashboardConfig
  modules: Map<string, DashboardModule>
  loadModule: (moduleId: string) => Promise<void>
  currentModule?: string
  setCurrentModule: (moduleId: string) => void
  expandedMenuItems: string[]
  toggleMenuItem: (itemId: string) => void
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export interface DashboardProviderProps {
  config: DashboardConfig
  children: ReactNode
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ config, children }) => {
  const [modules, setModules] = useState<Map<string, DashboardModule>>(new Map())
  const [currentModule, setCurrentModule] = useState<string>()
  const [expandedMenuItems, setExpandedMenuItems] = useState<string[]>([])

  const loadModule = useCallback(async (moduleId: string) => {
    if (modules.has(moduleId)) {
      return
    }

    if (config.modules && config.modules[moduleId]) {
      try {
        const moduleLoader = config.modules[moduleId]
        const loadedModule = await moduleLoader()
        
        const newModule: DashboardModule = {
          id: moduleId,
          name: moduleId,
          component: loadedModule.default || loadedModule,
          loaded: true
        }

        setModules(prev => new Map(prev).set(moduleId, newModule))
      } catch (error) {
        console.error(`Failed to load module ${moduleId}:`, error)
      }
    }
  }, [config.modules, modules])

  const toggleMenuItem = useCallback((itemId: string) => {
    setExpandedMenuItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }, [])

  const value: DashboardContextValue = {
    config,
    modules,
    loadModule,
    currentModule,
    setCurrentModule,
    expandedMenuItems,
    toggleMenuItem
  }

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider')
  }
  return context
}