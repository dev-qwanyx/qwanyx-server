import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface FlowStackItem {
  id: string
  title: string
}

interface DigitalHumanEditorContextType {
  // DH Info
  dhId: string
  dhEmail: string
  dhName: string
  dhFirstName: string
  
  // Current Flow State
  currentFlowId: string
  currentFlowTitle: string
  nodes: any[]
  edges: any[]
  
  // Navigation Stack
  flowStack: FlowStackItem[]
  
  // Actions
  setNodes: (nodes: any[]) => void
  setEdges: (edges: any[]) => void
  setCurrentFlow: (id: string, title: string) => void
  pushToStack: (id: string, title: string) => void
  popFromStack: () => void
  clearStack: () => void
  navigateToFlow: (flowId: string, flowTitle: string) => Promise<void>
  navigateToRoot: () => Promise<void>
  saveCurrentFlow: () => Promise<void>
}

const DigitalHumanEditorContext = createContext<DigitalHumanEditorContextType | undefined>(undefined)

export const useDigitalHumanEditor = () => {
  const context = useContext(DigitalHumanEditorContext)
  if (!context) {
    throw new Error('useDigitalHumanEditor must be used within DigitalHumanEditorProvider')
  }
  return context
}

interface DigitalHumanEditorProviderProps {
  dhId: string
  dhEmail: string
  dhName: string
  dhFirstName: string
  children: ReactNode
}

export const DigitalHumanEditorProvider: React.FC<DigitalHumanEditorProviderProps> = ({
  dhId,
  dhEmail,
  dhName,
  dhFirstName,
  children
}) => {
  const [currentFlowId, setCurrentFlowId] = useState<string>(dhId)
  const [currentFlowTitle, setCurrentFlowTitle] = useState<string>('root')
  const [nodes, setNodes] = useState<any[]>([])
  const [edges, setEdges] = useState<any[]>([])
  const [flowStack, setFlowStack] = useState<FlowStackItem[]>([])
  
  const setCurrentFlow = useCallback((id: string, title: string) => {
    setCurrentFlowId(id)
    setCurrentFlowTitle(title)
  }, [])
  
  const pushToStack = useCallback((id: string, title: string) => {
    setFlowStack(prev => [...prev, { id, title }])
  }, [])
  
  const popFromStack = useCallback(() => {
    setFlowStack(prev => prev.slice(0, -1))
  }, [])
  
  const clearStack = useCallback(() => {
    setFlowStack([])
  }, [])
  
  const saveCurrentFlow = useCallback(async () => {
    if (!dhId || !dhEmail) {
      console.error('Missing DH info for save')
      return
    }
    
    try {
      const token = localStorage.getItem('autodin_token')
      const workspace = localStorage.getItem('autodin_workspace') || 'autodin'
      
      const pushData = {
        dh_email: dhEmail,
        dh_id: currentFlowId || dhId,
        flow_title: currentFlowTitle,
        nodes: nodes,
        edges: edges
      }
      
      const response = await fetch('http://localhost:5002/api/dh/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Workspace': workspace
        },
        body: JSON.stringify(pushData)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to save: ${response.status}`)
      }
      
      console.log('Flow saved successfully')
    } catch (error) {
      console.error('Error saving flow:', error)
      throw error
    }
  }, [dhId, dhEmail, currentFlowId, currentFlowTitle, nodes, edges])
  
  const navigateToFlow = useCallback(async (flowId: string, flowTitle: string) => {
    console.log(`Navigating to flow: ${flowTitle} (${flowId})`)
    
    // Save current flow first
    await saveCurrentFlow()
    
    const token = localStorage.getItem('autodin_token')
    const workspace = localStorage.getItem('autodin_workspace') || 'autodin'
    
    try {
      const response = await fetch('http://localhost:5002/api/dh/pull', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Workspace': workspace
        },
        body: JSON.stringify({
          dh_email: dhEmail,
          dh_id: flowId
        })
      })
      
      if (response.ok) {
        const flowData = await response.json()
        setNodes(flowData.nodes || [])
        setEdges(flowData.edges || [])
        setCurrentFlow(flowId, flowTitle)
      } else {
        console.error('Failed to load flow:', response.status)
      }
    } catch (error) {
      console.error('Error navigating to flow:', error)
    }
  }, [dhEmail, saveCurrentFlow])
  
  const navigateToRoot = useCallback(async () => {
    console.log('Navigating to root flow')
    
    // Only save if we're not already at root
    if (currentFlowId !== dhId) {
      await saveCurrentFlow()
    }
    
    const token = localStorage.getItem('autodin_token')
    const workspace = localStorage.getItem('autodin_workspace') || 'autodin'
    
    try {
      const response = await fetch('http://localhost:5002/api/dh/pull', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Workspace': workspace
        },
        body: JSON.stringify({
          dh_email: dhEmail,
          dh_id: dhId
        })
      })
      
      if (response.ok) {
        const flowData = await response.json()
        setNodes(flowData.nodes || [])
        setEdges(flowData.edges || [])
        setCurrentFlow(dhId, 'root')
        clearStack()
      } else {
        console.error('Failed to load root flow:', response.status)
      }
    } catch (error) {
      console.error('Error navigating to root:', error)
    }
  }, [dhId, dhEmail, currentFlowId, saveCurrentFlow, clearStack])
  
  const value = {
    dhId,
    dhEmail,
    dhName,
    dhFirstName,
    currentFlowId,
    currentFlowTitle,
    nodes,
    edges,
    flowStack,
    setNodes,
    setEdges,
    setCurrentFlow,
    pushToStack,
    popFromStack,
    clearStack,
    navigateToFlow,
    navigateToRoot,
    saveCurrentFlow
  }
  
  return (
    <DigitalHumanEditorContext.Provider value={value}>
      {children}
    </DigitalHumanEditorContext.Provider>
  )
}