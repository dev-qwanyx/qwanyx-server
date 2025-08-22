import React, { useState, useRef, useCallback, useEffect, memo } from 'react'
import { Icon, Modal, Button, Card, Container, Flex, Text } from '@qwanyx/ui'
import { ObjectId } from 'bson'
import { DhMainSwitch } from './DhMainSwitch'
import { MailConfig, MailConfigData } from './MailConfig'
import { NoteNode } from './NoteNode'
import './QFlow.css'

export interface QNode {
  _id: string | ObjectId  // Accept both for flexibility
  x: number
  y: number
  type: 'icon' | 'step' | 'decision'
  data: {
    label: string
    icon?: string
    color?: string
    description?: string
    nodeType?: string  // For special node types like 'start-stop'
    isRunning?: boolean  // For start-stop nodes
    [key: string]: any  // Allow additional properties
  }
}

export interface QEdge {
  _id: string | ObjectId  // Accept both for flexibility
  s: string | ObjectId  // source
  t: string | ObjectId  // target
  ty?: 'data' | 'control' | 'temporal' | 'causal' | 'semantic'  // type
  w?: number  // weight
  m?: {  // metadata
    l?: string  // label
    d?: string  // description
    c?: string  // condition
    tr?: string  // transform
  }
  tm?: {  // temporal
    dl?: number  // delay
    dd?: number  // deadline
    dc?: number  // decay
    ls?: number  // lifespan
  }
  st?: {  // style
    c?: string  // color
    th?: number  // thickness
    p?: 'solid' | 'dashed' | 'dotted'  // pattern
    a?: boolean  // animated
  }
}

interface QFlowProps {
  nodes: QNode[]
  edges: QEdge[]
  onNodesChange?: (nodes: QNode[]) => void
  onEdgesChange?: (edges: QEdge[]) => void
  onSave?: (nodes: QNode[], edges: QEdge[]) => Promise<void> | void
  onUnsavedChangesChange?: (hasUnsaved: boolean) => void
  width?: string | number
  height?: string | number
  nodeRenderer?: (node: QNode, context?: any) => React.ReactNode
  context?: any  // DH context (dhId, dhName, dhEmail, etc.)
}

// Edge Component
interface EdgeProps {
  edge: QEdge
  source: QNode
  target: QNode
  getIdString: (id: any) => string
}

const Edge = memo<EdgeProps>(({ edge, source, target, getIdString }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  // Calculate path - nodes are already centered due to transform
  const sourceX = source.x
  const sourceY = source.y
  const targetX = target.x
  const targetY = target.y
  
  const dx = targetX - sourceX
  const dy = targetY - sourceY
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  // Control points at 33% and 66% of the path
  // Offset scales with distance (more curve for longer edges)
  const curveStrength = Math.min(distance * 0.3, 150)
  
  let path: string
  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal dominant - control points offset vertically
    const cp1x = sourceX + dx * 0.33
    const cp1y = sourceY
    const cp2x = sourceX + dx * 0.66
    const cp2y = targetY
    path = `M ${sourceX} ${sourceY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${targetX} ${targetY}`
  } else {
    // Vertical dominant - control points offset horizontally
    const cp1x = sourceX
    const cp1y = sourceY + dy * 0.33
    const cp2x = targetX
    const cp2y = sourceY + dy * 0.66
    path = `M ${sourceX} ${sourceY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${targetX} ${targetY}`
  }
  
  const edgeId = getIdString(edge._id || (edge as any).id)
  
  return (
    <g>
      {/* Invisible wider path for better hover detection */}
      <path
        d={path}
        stroke="transparent"
        strokeWidth={10}
        fill="none"
        style={{ cursor: 'pointer' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      
      {/* Visible edge - simple with opacity */}
      <path
        d={path}
        stroke={edge.st?.c || '#666'}
        strokeWidth={isHovered ? 3 : (edge.st?.th || 2)}
        strokeOpacity={isHovered ? 0.7 : 0.4}
        strokeDasharray={edge.st?.p === 'dashed' ? '5,5' : edge.st?.p === 'dotted' ? '2,2' : undefined}
        fill="none"
        style={{
          filter: isHovered ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : undefined
        }}
      />
      
      {/* Optional label */}
      {edge.m?.l && (
        <text
          x={(sourceX + targetX) / 2}
          y={(sourceY + targetY) / 2}
          textAnchor="middle"
          fill="#666"
          fontSize="12"
          opacity={isHovered ? 1 : 0.7}
        >
          {edge.m.l}
        </text>
      )}
    </g>
  )
})

interface HistoryState {
  nodes: QNode[]
  edges: QEdge[]
}

export const QFlow: React.FC<QFlowProps> = ({
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange,
  onEdgesChange,
  onSave,
  onUnsavedChangesChange,
  width = '100%',
  height = '100%',
  nodeRenderer,
  context
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState(initialEdges)
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set())
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)
  const [copiedNode, setCopiedNode] = useState<QNode | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [renderTrigger, setRenderTrigger] = useState(0)
  
  // Save state
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Expanded node state - tracks which nodes are showing their config
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  
  // History management for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([{ nodes: initialNodes, edges: initialEdges }])
  const [historyIndex, setHistoryIndex] = useState(0)
  const maxHistorySize = 50 // Limit history to prevent memory issues
  const isInitialMount = useRef(true)
  const isDragging = useRef(false) // Track if we're currently dragging
  
  // Helper to get string representation of ID
  const getIdString = (id: string | ObjectId | any): string => {
    if (typeof id === 'string') return id
    if (id && typeof id.toHexString === 'function') return id.toHexString()
    if (id && typeof id.toString === 'function') return id.toString()
    return String(id)
  }
  
  // Helper to compare ObjectIds (handles both ObjectId instances and serialized objects)
  const objectIdEquals = (id1: any, id2: any): boolean => {
    if (!id1 || !id2) return false
    
    // If both have equals method, use it
    if (typeof id1.equals === 'function' && typeof id2.equals === 'function') {
      return id1.equals(id2)
    }
    
    // Get string representation
    let str1: string
    let str2: string
    
    if (typeof id1.toHexString === 'function') {
      str1 = id1.toHexString()
    } else if (typeof id1.toString === 'function') {
      str1 = id1.toString()
    } else if (id1.id) {
      // Serialized ObjectId might have an 'id' property
      str1 = id1.id
    } else {
      str1 = String(id1)
    }
    
    if (typeof id2.toHexString === 'function') {
      str2 = id2.toHexString()
    } else if (typeof id2.toString === 'function') {
      str2 = id2.toString()
    } else if (id2.id) {
      str2 = id2.id
    } else {
      str2 = String(id2)
    }
    
    return str1 === str2
  }
  
  // Track previous prop values to detect external changes
  const prevNodesRef = useRef<QNode[]>(initialNodes)
  const prevEdgesRef = useRef<QEdge[]>(initialEdges)
  
  // Function to save current state to history
  const saveToHistory = useCallback((newNodes: QNode[], newEdges: QEdge[]) => {
    // Check if state actually changed from the current history state
    const currentState = history[historyIndex]
    const stateChanged = 
      JSON.stringify(newNodes) !== JSON.stringify(currentState.nodes) ||
      JSON.stringify(newEdges) !== JSON.stringify(currentState.edges)
    
    if (!stateChanged) {
      return // Don't save duplicate states
    }
    
    // Remove any future history if we're not at the end
    const newHistory = history.slice(0, historyIndex + 1)
    
    // Add new state
    newHistory.push({ nodes: newNodes, edges: newEdges })
    
    // Limit history size
    if (newHistory.length > maxHistorySize) {
      newHistory.shift()
    }
    
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    setHasUnsavedChanges(true) // Mark as having unsaved changes
  }, [history, historyIndex, maxHistorySize])
  
  // Update local state when props change
  useEffect(() => {
    const nodesChanged = JSON.stringify(initialNodes) !== JSON.stringify(prevNodesRef.current)
    const nodeCountChanged = initialNodes.length !== prevNodesRef.current.length
    
    if (nodesChanged) {
      setNodes(initialNodes)
      
      // When nodes change from outside (like dropping a new node), save to history
      // But NOT if we're currently dragging
      // Force immediate save if node count changed (node added or removed)
      if (!isInitialMount.current && !isDragging.current) {
        if (nodeCountChanged) {
          // Node was added or removed - save immediately
          saveToHistory(initialNodes, edges)
        } else {
          // Node was just moved/updated - can save normally
          saveToHistory(initialNodes, edges)
        }
      }
      
      prevNodesRef.current = initialNodes
    }
  }, [initialNodes, edges, saveToHistory])
  
  useEffect(() => {
    const edgesChanged = JSON.stringify(initialEdges) !== JSON.stringify(prevEdgesRef.current)
    
    if (edgesChanged) {
      setEdges(initialEdges)
      
      // When edges change from outside, save to history
      if (!isInitialMount.current && !isDragging.current) {
        // Save the new edges with current nodes
        saveToHistory(nodes, initialEdges)
      }
      
      prevEdgesRef.current = initialEdges
    }
  }, [initialEdges, nodes, saveToHistory])
  
  // Mark that initial mount is complete immediately
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      isInitialMount.current = false
    })
  }, [])
  
  // Watch for node count changes specifically (for dropped nodes)
  useEffect(() => {
    if (!isInitialMount.current && !isDragging.current) {
      // If we have nodes and they're different from what's in history, save
      const currentHistoryState = history[historyIndex]
      if (nodes.length !== currentHistoryState.nodes.length) {
        saveToHistory(nodes, edges)
      }
    }
  }, [nodes.length]) // Only trigger when node count changes
  
  // Save function
  const handleSave = useCallback(async () => {
    if (!onSave) return
    
    setIsSaving(true)
    try {
      await onSave(nodes, edges)
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Failed to save flow:', error)
    } finally {
      setIsSaving(false)
    }
  }, [nodes, edges, onSave])
  
  // Undo function
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      const state = history[newIndex]
      setNodes(state.nodes)
      setEdges(state.edges)
      setHistoryIndex(newIndex)
      onNodesChange?.(state.nodes)
      onEdgesChange?.(state.edges)
    }
  }, [history, historyIndex, onNodesChange, onEdgesChange])
  
  // Redo function
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      const state = history[newIndex]
      setNodes(state.nodes)
      setEdges(state.edges)
      setHistoryIndex(newIndex)
      onNodesChange?.(state.nodes)
      onEdgesChange?.(state.edges)
    }
  }, [history, historyIndex, onNodesChange, onEdgesChange])
  
  // Force initial render by simulating node movement
  useEffect(() => {
    // Wait for component to mount
    const timer = setTimeout(() => {
      // Move nodes by 0 pixels to trigger edge calculation
      setNodes(prev => prev.map(node => ({ ...node })))
    }, 50)
    
    return () => clearTimeout(timer)
  }, [])

  // Notify parent of unsaved changes
  useEffect(() => {
    onUnsavedChangesChange?.(hasUnsavedChanges)
  }, [hasUnsavedChanges, onUnsavedChangesChange])

  // Warn before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if QFlow container is focused
      if (!containerRef.current?.contains(document.activeElement)) return

      // Ctrl+S - Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
        return
      }

      // Ctrl+Z - Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
        return
      }

      // Ctrl+Shift+Z or Ctrl+Y - Redo
      if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') || 
          ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
        e.preventDefault()
        redo()
        return
      }

      // Delete key - delete selected nodes or edge
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeIds.size > 0) {
          // Save state before deletion
          const newNodes = nodes.filter(n => !selectedNodeIds.has(getIdString(n._id)))
          const newEdges = edges.filter(e => 
            !selectedNodeIds.has(getIdString(e.s)) && 
            !selectedNodeIds.has(getIdString(e.t))
          )
          
          saveToHistory(newNodes, newEdges)
          setNodes(newNodes)
          setEdges(newEdges)
          onNodesChange?.(newNodes)
          onEdgesChange?.(newEdges)
          setSelectedNodeIds(new Set())
        } else if (selectedEdgeId) {
          const newEdges = edges.filter(e => getIdString(e._id) !== selectedEdgeId)
          saveToHistory(nodes, newEdges)
          setEdges(newEdges)
          onEdgesChange?.(newEdges)
          setSelectedEdgeId(null)
        }
      }

      // Ctrl+C - copy first selected node
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        if (selectedNodeIds.size > 0) {
          const firstSelectedId = Array.from(selectedNodeIds)[0]
          const node = nodes.find(n => getIdString(n._id) === firstSelectedId)
          if (node) {
            setCopiedNode(node)
          }
        }
      }

      // Ctrl+V - paste copied node
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        if (copiedNode) {
          const newNode: QNode = {
            ...copiedNode,
            _id: new ObjectId().toHexString(),
            x: copiedNode.x + 50,
            y: copiedNode.y + 50
          }
          const newNodes = [...nodes, newNode]
          saveToHistory(newNodes, edges)
          setNodes(newNodes)
          onNodesChange?.(newNodes)
          setSelectedNodeIds(new Set([getIdString(newNode._id)]))
        }
      }

      // Ctrl+L - link selected nodes (first is source, rest are targets)
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault()
        if (selectedNodeIds.size >= 2) {
          const nodeIdsArray = Array.from(selectedNodeIds)
          const sourceId = nodeIdsArray[0] // First selected is source
          const targetIds = nodeIdsArray.slice(1) // Rest are targets
          
          // Create edges from source to each target
          const newEdges: QEdge[] = targetIds.map(targetId => ({
            _id: new ObjectId(),
            s: sourceId,
            t: targetId,
            ty: 'data' as const,
            w: 1,
            m: {
              l: 'Connected'
            }
          }))
          
          // Add new edges to existing ones
          const updatedEdges = [...edges, ...newEdges]
          saveToHistory(nodes, updatedEdges)
          setEdges(updatedEdges)
          onEdgesChange?.(updatedEdges)
          
          // Clear selection after linking
          setSelectedNodeIds(new Set())
        }
      }
      
      // Escape - deselect
      if (e.key === 'Escape') {
        setSelectedNodeIds(new Set())
        setSelectedEdgeId(null)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedNodeIds, selectedEdgeId, copiedNode, nodes, edges, onNodesChange, onEdgesChange, undo, redo, saveToHistory, handleSave])

  // Handle zoom with mouse wheel
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom(prev => Math.min(Math.max(0.1, prev * delta), 3))
  }, [])

  // Start panning and deselect nodes
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Check if we clicked on the canvas (not on a node)
    const target = e.target as HTMLElement
    const isCanvas = target === containerRef.current || 
                     target.parentElement === containerRef.current ||
                     (target.parentElement?.parentElement === containerRef.current && target.tagName === 'svg')
    
    if (isCanvas) {
      // Deselect all nodes when clicking on canvas
      setSelectedNodeIds(new Set())
      
      // Start panning
      setIsPanning(true)
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }, [pan])

  // Handle panning
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      })
    } else if (draggedNode) {
      const node = nodes.find(n => {
        const nId = n._id || (n as any).id
        return nId && getIdString(nId) === draggedNode
      })
      if (node) {
        const newNodes = nodes.map(n => {
          const nId = n._id || (n as any).id
          return (nId && getIdString(nId) === draggedNode)
            ? {
                ...n,
                x: (e.clientX - pan.x - dragOffset.x) / zoom,
                y: (e.clientY - pan.y - dragOffset.y) / zoom
              }
            : n
        })
        setNodes(newNodes)
        // Don't call onNodesChange during drag - we'll do it on mouse up
      }
    }
  }, [isPanning, panStart, draggedNode, nodes, pan, zoom, dragOffset, getIdString])

  // Stop panning or dragging
  const handleMouseUp = useCallback(() => {
    // If we were dragging a node, save to history and notify parent
    if (draggedNode) {
      isDragging.current = false
      onNodesChange?.(nodes) // Notify parent of the final position
      saveToHistory(nodes, edges)
    }
    setIsPanning(false)
    setDraggedNode(null)
  }, [draggedNode, nodes, edges, saveToHistory, onNodesChange])

  // Start dragging a node
  const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string | ObjectId) => {
    e.stopPropagation()
    const node = nodes.find(n => {
      const nId = n._id || (n as any).id
      return nId && nodeId && objectIdEquals(nId, nodeId)
    })
    if (node) {
      const nodeIdStr = getIdString(nodeId)
      
      // Handle selection based on modifiers
      if (e.shiftKey) {
        // Shift+click: Add to selection
        setSelectedNodeIds(prev => {
          const newSet = new Set(prev)
          newSet.add(nodeIdStr)
          return newSet
        })
      } else if (e.ctrlKey || e.metaKey) {
        // Ctrl/Cmd+click: Toggle selection
        setSelectedNodeIds(prev => {
          const newSet = new Set(prev)
          if (newSet.has(nodeIdStr)) {
            newSet.delete(nodeIdStr)
          } else {
            newSet.add(nodeIdStr)
          }
          return newSet
        })
      } else {
        // Regular click: Select only this node
        setSelectedNodeIds(new Set([nodeIdStr]))
      }
      
      setSelectedEdgeId(null)
      
      // Start dragging only if not using modifiers
      if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
        isDragging.current = true
        setDraggedNode(nodeIdStr)
        setDragOffset({
          x: e.clientX - pan.x - node.x * zoom,
          y: e.clientY - pan.y - node.y * zoom
        })
      }
    }
  }, [nodes, pan, zoom, objectIdEquals, getIdString])
  
  // Handle double-click on nodes - universal expand/collapse
  const handleNodeDoubleClick = useCallback((e: React.MouseEvent, nodeId: string | ObjectId) => {
    e.stopPropagation()
    const nodeIdStr = getIdString(nodeId)
    
    // Toggle expanded state
    setExpandedNodes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(nodeIdStr)) {
        newSet.delete(nodeIdStr)
      } else {
        newSet.add(nodeIdStr)
      }
      return newSet
    })
  }, [getIdString])

  return (
    <>
      <div 
        ref={containerRef}
        className="qflow-container"
        tabIndex={0}  // Make focusable to capture keyboard events
        style={{
          width,
          height,
          overflow: 'hidden',
          position: 'relative',
          cursor: isPanning ? 'grabbing' : 'grab',
          background: 'linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          outline: 'none',  // Remove focus outline
          boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.1), inset 0 0 40px rgba(0, 0, 0, 0.05)'
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Unsaved changes indicator - subtle asterisk */}
        {hasUnsavedChanges && !isSaving && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            fontSize: '24px',
            color: 'rgba(239, 68, 68, 0.8)',
            fontWeight: 'bold',
            zIndex: 1000,
            cursor: 'default',
            userSelect: 'none'
          }} title="Unsaved changes (Ctrl+S to save)">
            *
          </div>
        )}
        
        {/* Saving indicator */}
        {isSaving && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            padding: '8px 16px',
            backgroundColor: 'rgba(59, 130, 246, 0.9)',
            color: 'white',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 'bold',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}>
            <Icon name="loader" size="sm" />
            Saving...
          </div>
        )}
      <div 
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          position: 'absolute',
          width: '100%',
          height: '100%'
        }}
      >
        {/* Edges */}
        <svg 
          key={renderTrigger}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            overflow: 'visible'
          }}
        >
          {/* Render edges */}
          {edges.map((edge, index) => {
            const edgeId = edge._id || (edge as any).id
            if (!edgeId) return null
            
            const source = nodes.find(n => {
              const nodeId = n._id || (n as any).id
              const edgeSource = edge.s || (edge as any).source
              return nodeId && edgeSource && objectIdEquals(nodeId, edgeSource)
            })
            const target = nodes.find(n => {
              const nodeId = n._id || (n as any).id
              const edgeTarget = edge.t || (edge as any).target
              return nodeId && edgeTarget && objectIdEquals(nodeId, edgeTarget)
            })
            
            if (!source || !target) return null
            
            return (
              <Edge
                key={`edge-${getIdString(edgeId)}`}
                edge={edge}
                source={source}
                target={target}
                getIdString={getIdString}
              />
            )
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node, index) => {
          const nodeId = node._id || (node as any).id
          const nodeIdStr = nodeId ? getIdString(nodeId) : null
          const isExpanded = nodeIdStr ? expandedNodes.has(nodeIdStr) : false
          
          return nodeId ? (
            <div
              key={getIdString(nodeId)}
              style={{
                position: 'absolute',
                left: `${node.x - 32}px`,  // Offset by half icon width
                top: `${node.y - 32}px`,   // Offset by half icon height
                cursor: 'move',
                userSelect: 'none',
                border: selectedNodeIds.has(getIdString(nodeId)) ? '1px dashed rgba(0, 0, 0, 0.7)' : 'none',
                borderRadius: '4px',
                padding: selectedNodeIds.has(getIdString(nodeId)) ? '3px' : '4px',
                margin: selectedNodeIds.has(getIdString(nodeId)) ? '-1px' : '0'
              }}
              onMouseDown={(e) => handleNodeMouseDown(e, nodeId)}
              onDoubleClick={(e) => handleNodeDoubleClick(e, nodeId)}
          >
            {nodeRenderer ? (
              nodeRenderer(node, context)
            ) : node.data?.nodeType === 'start-stop' ? (
              // Render DhMainSwitch for start-stop nodes
              <DhMainSwitch
                dhId={context?.dhFullData?._id || ''}
                dhName={context?.dhFullData?.name || ''}
                dhFirstName={context?.dhFullData?.firstName || ''}
                dhEmail={context?.dhFullData?.email || ''}
                initialState={node.data.isRunning || false}
                onStateChange={(isRunning) => {
                  // Update node data
                  const currentNodeId = node._id || (node as any).id
                  const newNodes = nodes.map(n => {
                    const nId = n._id || (n as any).id
                    return (nId && getIdString(nId) === getIdString(currentNodeId))
                      ? { ...n, data: { ...n.data, isRunning } }
                      : n
                  })
                  setNodes(newNodes)
                  onNodesChange?.(newNodes)
                }}
                showProfile={true}
                size="md"
              />
            ) : node.type === 'icon' ? (
              <div style={{
                position: 'relative',
                width: 'fit-content'
              }}>
                {/* Icon and title - fixed position */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: node.data.color === 'primary' ? 
                      'linear-gradient(135deg, rgba(96, 165, 250, 0.85) 0%, rgba(59, 130, 246, 0.85) 100%)' :
                      node.data.color === 'success' ?
                      'linear-gradient(135deg, rgba(74, 222, 128, 0.85) 0%, rgba(34, 197, 94, 0.85) 100%)' :
                      node.data.color === 'error' ?
                      'linear-gradient(135deg, rgba(248, 113, 113, 0.85) 0%, rgba(239, 68, 68, 0.85) 100%)' :
                      'linear-gradient(135deg, rgba(156, 163, 175, 0.85) 0%, rgba(107, 114, 128, 0.85) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(1px)',
                    WebkitBackdropFilter: 'blur(1px)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Glass reflection overlay */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '50%',
                      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
                      borderRadius: '16px 16px 0 0',
                      pointerEvents: 'none'
                    }} />
                    {node.data.icon && node.data.icon.length <= 2 ? (
                      <Text size="xl" weight="bold" style={{ color: 'white', position: 'relative', zIndex: 1, fontSize: '24px' }}>
                        {node.data.icon.toUpperCase()}
                      </Text>
                    ) : (
                      <Icon name={node.data.icon || 'Circle'} size="2xl" style={{ color: 'white', position: 'relative', zIndex: 1 }} />
                    )}
                  </div>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#2C3E50',
                    maxWidth: '80px',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 10,
                    textShadow: `
                      0 0 3px rgba(255, 255, 255, 1),
                      0 0 6px rgba(255, 255, 255, 1),
                      0 0 9px rgba(255, 255, 255, 1),
                      0 0 12px rgba(255, 255, 255, 0.95),
                      0 0 15px rgba(255, 255, 255, 0.9),
                      0 0 20px rgba(255, 255, 255, 0.85),
                      0 0 25px rgba(255, 255, 255, 0.8),
                      0 0 30px rgba(255, 255, 255, 0.7),
                      2px 2px 3px rgba(255, 255, 255, 1),
                      -2px -2px 3px rgba(255, 255, 255, 1),
                      2px -2px 3px rgba(255, 255, 255, 1),
                      -2px 2px 3px rgba(255, 255, 255, 1)
                    `
                  }}>
                    {node.data.label}
                  </span>
                </div>
                
                {/* Expandable card - positioned absolutely below icon */}
                {isExpanded && (
                  <div style={{
                    position: 'absolute',
                    top: '100px',  // Below icon and label
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1000
                  }}
                  onMouseDown={(e) => {
                    // Allow dragging from the card, but not from interactive elements
                    const target = e.target as HTMLElement
                    const isInteractive = target.tagName === 'INPUT' || 
                                         target.tagName === 'BUTTON' || 
                                         target.tagName === 'TEXTAREA' ||
                                         target.tagName === 'SELECT'
                    
                    if (!isInteractive) {
                      handleNodeMouseDown(e, nodeId)
                    }
                  }}
                  >
                    <Card
                      variant="outlined"
                      padding="none"
                      style={{
                        minWidth: '250px',
                        animation: 'slideDown 0.2s ease-out',
                        cursor: 'move'
                      }}
                    >
                    {/* Render appropriate component based on node type */}
                    {node.data.nodeType === 'mail-config' ? (
                      // Mail Configuration Component (SMTP & IMAP)
                      <MailConfig
                        compact={true}
                        dhEmail={context?.dhFullData?.email || ''}
                        initialConfig={node.data.mailConfig}
                        onSave={(config) => {
                          // Update node data with new config
                          const currentNodeId = node._id || (node as any).id
                          const newNodes = nodes.map(n => {
                            const nId = n._id || (n as any).id
                            return (nId && getIdString(nId) === getIdString(currentNodeId))
                              ? { ...n, data: { ...n.data, mailConfig: config } }
                              : n
                          })
                          setNodes(newNodes)
                          onNodesChange?.(newNodes)
                          console.log('Mail config saved for node:', nodeIdStr)
                        }}
                      />
                    ) : node.data.nodeType === 'note' ? (
                      // Note Node Component
                      <NoteNode
                        nodeId={nodeIdStr || ''}
                        initialData={node.data}
                        onChange={(data) => {
                          const currentNodeId = node._id || (node as any).id
                          const newNodes = nodes.map(n => {
                            const nId = n._id || (n as any).id
                            return (nId && getIdString(nId) === getIdString(currentNodeId))
                              ? { ...n, data: { ...n.data, ...data } }
                              : n
                          })
                          setNodes(newNodes)
                          onNodesChange?.(newNodes)
                        }}
                      />
                    ) : (
                      // Default content for other node types
                      <Container padding="md">
                        <Flex direction="col" gap="sm">
                          <Text size="xs">
                            <Text weight="semibold">Type:</Text> {node.data.nodeType || node.type}
                          </Text>
                          <Text size="xs">
                            <Text weight="semibold">ID:</Text> {nodeIdStr}
                          </Text>
                          {node.data.description && (
                            <Text size="xs">
                              <Text weight="semibold">Description:</Text> {node.data.description}
                            </Text>
                          )}
                        </Flex>
                      </Container>
                    )}
                    </Card>
                  </div>
                )}
              </div>
            ) : null}
          </div>
          ) : null
        })}
      </div>

      {/* Zoom controls */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        background: 'white',
        borderRadius: '8px',
        padding: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <button
          onClick={() => setZoom(prev => Math.min(3, prev * 1.2))}
          style={{
            width: '32px',
            height: '32px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon name="Add" size="sm" />
        </button>
        <button
          onClick={() => setZoom(prev => Math.max(0.1, prev * 0.8))}
          style={{
            width: '32px',
            height: '32px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon name="Remove" size="sm" />
        </button>
        <button
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }) }}
          style={{
            width: '32px',
            height: '32px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon name="Home" size="sm" />
        </button>
      </div>
      
      {/* CSS for expand/collapse animation */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
    </>
  )
}