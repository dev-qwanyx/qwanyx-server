/**
 * Brain WebSocket Connection Hook
 * Connects QFlow to a living brain via neural link
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { Node, Edge } from 'reactflow'

export interface BrainState {
  id: string
  state: 'initializing' | 'active' | 'thinking' | 'stopped' | 'error'
  currentFlow: string | null
  thoughtCount: number
  lastThought: Date | null
  nodes: Node[]
  edges: Edge[]
}

export interface NeuralMessage {
  id: string
  type: 'command' | 'query' | 'stream' | 'event'
  brainId?: string
  payload: any
  timestamp: number
}

export const useBrainConnection = (brainServerUrl: string = 'ws://localhost:3003/neural') => {
  const [connected, setConnected] = useState(false)
  const [brainState, setBrainState] = useState<BrainState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const messageIdRef = useRef(0)

  // Generate unique message ID
  const generateMessageId = () => {
    return `msg_${Date.now()}_${++messageIdRef.current}`
  }

  // Send message to brain
  const sendMessage = useCallback((message: Partial<NeuralMessage>) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected')
      return
    }

    const fullMessage: NeuralMessage = {
      id: generateMessageId(),
      type: message.type || 'command',
      brainId: message.brainId || brainState?.id,
      payload: message.payload,
      timestamp: Date.now()
    }

    wsRef.current.send(JSON.stringify(fullMessage))
  }, [brainState])

  // Connect to brain
  const connectToBrain = useCallback((brainId: string) => {
    sendMessage({
      type: 'command',
      brainId,
      payload: {
        type: 'get-state'
      }
    })
  }, [sendMessage])

  // Update brain flow (save current state)
  const saveBrainFlow = useCallback((nodes: Node[], edges: Edge[]) => {
    if (!brainState?.id) return

    sendMessage({
      type: 'command',
      payload: {
        type: 'save',
        nodes,
        edges
      }
    })
  }, [brainState, sendMessage])

  // Navigate to sub-flow
  const navigateToFlow = useCallback((flowId: string) => {
    if (!brainState?.id) return

    sendMessage({
      type: 'command',
      payload: {
        type: 'navigate',
        flowId
      }
    })
  }, [brainState, sendMessage])

  // Add node to brain
  const addNode = useCallback((node: Node) => {
    if (!brainState?.id) return

    sendMessage({
      type: 'command',
      payload: {
        type: 'add-node',
        node
      }
    })
  }, [brainState, sendMessage])

  // Add edge to brain
  const addEdge = useCallback((edge: Edge) => {
    if (!brainState?.id) return

    sendMessage({
      type: 'command',
      payload: {
        type: 'add-edge',
        edge
      }
    })
  }, [brainState, sendMessage])

  // Subscribe to brain thoughts
  const subscribeToThoughts = useCallback(() => {
    if (!brainState?.id) return

    sendMessage({
      type: 'stream',
      payload: {
        stream: 'thoughts'
      }
    })
  }, [brainState, sendMessage])

  // List available brains
  const listBrains = useCallback(() => {
    sendMessage({
      type: 'query',
      payload: {
        query: 'list-brains'
      }
    })
  }, [sendMessage])

  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket(brainServerUrl)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('Neural link established')
      setConnected(true)
      setError(null)
      
      // List available brains on connection
      setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          listBrains()
        }
      }, 100)
    }

    ws.onmessage = (event) => {
      try {
        const message: NeuralMessage = JSON.parse(event.data)
        
        switch (message.type) {
          case 'event':
            handleEvent(message)
            break
          case 'command':
            handleCommandResponse(message)
            break
          case 'query':
            handleQueryResponse(message)
            break
          case 'stream':
            handleStream(message)
            break
        }
      } catch (err) {
        console.error('Failed to parse message:', err)
      }
    }

    ws.onerror = (event) => {
      console.error('WebSocket error:', event)
      setError('Connection error')
    }

    ws.onclose = () => {
      console.log('Neural link disconnected')
      setConnected(false)
    }

    // Cleanup on unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [brainServerUrl])

  // Handle event messages
  const handleEvent = (message: NeuralMessage) => {
    const { event, data } = message.payload

    switch (event) {
      case 'connected':
        console.log('Connected to brain server:', data)
        break
      case 'flow-changed':
        console.log('Brain flow changed:', data)
        // Update local state when brain changes flows
        if (brainState) {
          setBrainState({
            ...brainState,
            currentFlow: data.flowId,
            nodes: data.nodes || [],
            edges: data.edges || []
          })
        }
        break
      case 'node-executed':
        console.log('Node executed:', data)
        break
      case 'error':
        setError(message.payload.error)
        break
    }
  }

  // Handle command responses
  const handleCommandResponse = (message: NeuralMessage) => {
    const { success, result } = message.payload

    if (success && result) {
      // Update brain state from command response
      if (result.currentFlow !== undefined) {
        setBrainState({
          id: message.brainId || '',
          state: 'active',
          currentFlow: result.currentFlow,
          thoughtCount: 0,
          lastThought: null,
          nodes: result.nodes || [],
          edges: result.edges || []
        })
      }
    }
  }

  // Handle query responses
  const handleQueryResponse = (message: NeuralMessage) => {
    const { brains, stats } = message.payload

    if (brains) {
      console.log('Available brains:', brains)
      // Could emit event or update state with brain list
    }

    if (stats) {
      console.log('Brain stats:', stats)
    }
  }

  // Handle stream messages
  const handleStream = (message: NeuralMessage) => {
    const { stream, data } = message.payload

    switch (stream) {
      case 'thought':
        // Update thought count
        if (brainState) {
          setBrainState({
            ...brainState,
            thoughtCount: data.count,
            lastThought: new Date(data.timestamp)
          })
        }
        break
    }
  }

  return {
    // Connection state
    connected,
    error,
    
    // Brain state
    brainState,
    
    // Actions
    connectToBrain,
    saveBrainFlow,
    navigateToFlow,
    addNode,
    addEdge,
    subscribeToThoughts,
    listBrains,
    
    // Low-level
    sendMessage
  }
}