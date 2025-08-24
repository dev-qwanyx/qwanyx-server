import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Icon, Modal, Button, Card, Container, Flex, Text } from '@qwanyx/ui'
import { ObjectId } from 'bson'
import { DhMainSwitch } from './DhMainSwitch'
import { MailConfig, MailConfigData } from './MailConfig'
import { NoteNode } from './NoteNode'
import { MonitorNode } from './MonitorNode'
import { Edge, QEdge } from './Edge'
import './QFlow.css'

export type { QEdge } from './Edge'

export interface QNode {
  _id: string | ObjectId  // Accept both for flexibility - SAME ID as memory when it's a memory node
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
    isMemoryNode?: boolean  // Node that is saved in memory with a subflow (Shift+click creates this)
    [key: string]: any  // Allow additional properties
  }
}

interface QFlowProps {
  nodes: QNode[]
  edges: QEdge[]
  onNodesChange?: (nodes: QNode[]) => void
  onEdgesChange?: (edges: QEdge[]) => void
  onSave?: (nodes: QNode[], edges: QEdge[]) => Promise<void> | void
  onOpenSubFlow?: (node: QNode) => void
  onUnsavedChangesChange?: (hasUnsaved: boolean) => void
  width?: string | number
  height?: string | number
  nodeRenderer?: (node: QNode, context?: any) => React.ReactNode
  context?: any  // DH context (dhId, dhName, dhEmail, etc.)
}

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
  onOpenSubFlow,
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
  const [selectedEdgeIds, setSelectedEdgeIds] = useState<Set<string>>(new Set())
  const [copiedNode, setCopiedNode] = useState<QNode | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [renderTrigger, setRenderTrigger] = useState(0)
  
  // Selection rectangle state
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionRect, setSelectionRect] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 })
  
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
    console.log('handleSave called, onSave:', !!onSave)
    if (!onSave) {
      console.log('No onSave handler provided')
      return
    }
    
    setIsSaving(true)
    try {
      await onSave(nodes, edges)
      setHasUnsavedChanges(false)
      console.log('Save successful, unsaved changes cleared')
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
      
      // Don't handle if the event target is an input, textarea, or select element
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || 
          target.tagName === 'TEXTAREA' || 
          target.tagName === 'SELECT' ||
          target.contentEditable === 'true') {
        return
      }

      // Ctrl+S - Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        console.log('Ctrl+S pressed, calling handleSave')
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

      // Delete key - soft delete for nodes with sub-flows
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeIds.size > 0 || selectedEdgeIds.size > 0) {
          // Check if any selected nodes are memory nodes (have sub-flows)
          const nodesWithSubFlows = nodes.filter(n => 
            selectedNodeIds.has(getIdString(n._id)) && n.data?.isMemoryNode
          )
          
          if (nodesWithSubFlows.length > 0) {
            // Show warning about nodes with sub-flows
            const nodeNames = nodesWithSubFlows.map(n => n.data?.label || 'Unnamed').join(', ')
            const confirmDelete = window.confirm(
              `⚠️ Warning: The following nodes have sub-flows:\n${nodeNames}\n\n` +
              `They will be moved to trash (hidden) but their sub-flows will be preserved.\n\n` +
              `Continue?`
            )
            
            if (!confirmDelete) {
              return
            }
            
            // Soft delete - mark as deleted instead of removing
            const newNodes = nodes.map(n => {
              if (selectedNodeIds.has(getIdString(n._id))) {
                return {
                  ...n,
                  data: {
                    ...n.data,
                    deleted: true,
                    deletedAt: new Date().toISOString()
                  }
                }
              }
              return n
            })
            
            // Remove edges connected to soft-deleted nodes
            const deletedNodeIds = new Set(
              nodes.filter(n => selectedNodeIds.has(getIdString(n._id)))
                .map(n => getIdString(n._id))
            )
            
            const newEdges = edges.filter(e => {
              const edgeId = getIdString(e._id)
              const sourceId = getIdString(e.s)
              const targetId = getIdString(e.t)
              
              return !selectedEdgeIds.has(edgeId) && 
                     !deletedNodeIds.has(sourceId) && 
                     !deletedNodeIds.has(targetId)
            })
            
            saveToHistory(newNodes, newEdges)
            setNodes(newNodes)
            setEdges(newEdges)
            onNodesChange?.(newNodes)
            onEdgesChange?.(newEdges)
          } else {
            // No sub-flows, do normal delete
            const newNodes = nodes.filter(n => !selectedNodeIds.has(getIdString(n._id)))
            
            // Delete selected edges AND edges connected to deleted nodes
            const newEdges = edges.filter(e => {
              const edgeId = getIdString(e._id)
              const sourceId = getIdString(e.s)
              const targetId = getIdString(e.t)
              
              // Remove if edge is selected OR if its source/target is deleted
              return !selectedEdgeIds.has(edgeId) && 
                     !selectedNodeIds.has(sourceId) && 
                     !selectedNodeIds.has(targetId)
            })
            
            saveToHistory(newNodes, newEdges)
            setNodes(newNodes)
            setEdges(newEdges)
            onNodesChange?.(newNodes)
            onEdgesChange?.(newEdges)
          }
          
          setSelectedNodeIds(new Set())
          setSelectedEdgeIds(new Set())
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

      // Ctrl+C - Copy selected nodes and edges
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !e.shiftKey) {
        e.preventDefault()
        if (selectedNodeIds.size > 0 || selectedEdgeIds.size > 0) {
          // Get selected nodes
          const selectedNodes = nodes.filter(n => selectedNodeIds.has(getIdString(n._id)))
          
          // Get selected edges (only edges between selected nodes)
          const selectedEdges = edges.filter(edge => {
            const edgeIdStr = getIdString(edge._id)
            const sourceIdStr = getIdString(edge.s)
            const targetIdStr = getIdString(edge.t)
            
            // Include edge if it's selected OR if both its nodes are selected
            return selectedEdgeIds.has(edgeIdStr) || 
                   (selectedNodeIds.has(sourceIdStr) && selectedNodeIds.has(targetIdStr))
          })
          
          // Store in clipboard with old IDs for mapping
          const clipboardData = {
            nodes: selectedNodes,
            edges: selectedEdges,
            timestamp: Date.now()
          }
          
          // Store in localStorage (since we can't access system clipboard directly)
          localStorage.setItem('qflow-clipboard', JSON.stringify(clipboardData))
          console.log('Copied', selectedNodes.length, 'nodes and', selectedEdges.length, 'edges')
        }
      }

      // Ctrl+X - Cut selected nodes and edges
      if ((e.ctrlKey || e.metaKey) && e.key === 'x' && !e.shiftKey) {
        e.preventDefault()
        if (selectedNodeIds.size > 0 || selectedEdgeIds.size > 0) {
          // First copy to clipboard
          const selectedNodes = nodes.filter(n => selectedNodeIds.has(getIdString(n._id)))
          const selectedEdges = edges.filter(edge => {
            const edgeIdStr = getIdString(edge._id)
            const sourceIdStr = getIdString(edge.s)
            const targetIdStr = getIdString(edge.t)
            
            return selectedEdgeIds.has(edgeIdStr) || 
                   (selectedNodeIds.has(sourceIdStr) && selectedNodeIds.has(targetIdStr))
          })
          
          const clipboardData = {
            nodes: selectedNodes,
            edges: selectedEdges,
            timestamp: Date.now()
          }
          localStorage.setItem('qflow-clipboard', JSON.stringify(clipboardData))
          
          // Then delete the selected items
          const newNodes = nodes.filter(n => !selectedNodeIds.has(getIdString(n._id)))
          const newEdges = edges.filter(edge => {
            const edgeIdStr = getIdString(edge._id)
            const sourceIdStr = getIdString(edge.s)
            const targetIdStr = getIdString(edge.t)
            
            // Remove edge if it's selected or if any of its nodes are deleted
            return !selectedEdgeIds.has(edgeIdStr) && 
                   !selectedNodeIds.has(sourceIdStr) && 
                   !selectedNodeIds.has(targetIdStr)
          })
          
          saveToHistory(newNodes, newEdges)
          setNodes(newNodes)
          setEdges(newEdges)
          onNodesChange?.(newNodes)
          onEdgesChange?.(newEdges)
          setSelectedNodeIds(new Set())
          setSelectedEdgeIds(new Set())
          
          console.log('Cut', selectedNodes.length, 'nodes and', selectedEdges.length, 'edges')
        }
      }

      // Ctrl+V - Paste (centered in viewport)
      if ((e.ctrlKey || e.metaKey) && e.key === 'v' && !e.shiftKey) {
        e.preventDefault()
        const clipboardStr = localStorage.getItem('qflow-clipboard')
        if (clipboardStr) {
          try {
            const clipboardData = JSON.parse(clipboardStr)
            if (clipboardData.nodes && clipboardData.nodes.length > 0) {
              // Calculate center of copied nodes
              const copiedBounds = {
                minX: Math.min(...clipboardData.nodes.map((n: QNode) => n.x)),
                maxX: Math.max(...clipboardData.nodes.map((n: QNode) => n.x)),
                minY: Math.min(...clipboardData.nodes.map((n: QNode) => n.y)),
                maxY: Math.max(...clipboardData.nodes.map((n: QNode) => n.y))
              }
              const copiedCenter = {
                x: (copiedBounds.minX + copiedBounds.maxX) / 2,
                y: (copiedBounds.minY + copiedBounds.maxY) / 2
              }
              
              // Calculate viewport center
              const container = containerRef.current
              if (container) {
                const viewportCenter = {
                  x: (container.clientWidth / 2 - pan.x) / zoom,
                  y: (container.clientHeight / 2 - pan.y) / zoom
                }
                
                // Calculate offset to center pasted content in viewport
                const pasteOffset = {
                  x: viewportCenter.x - copiedCenter.x,
                  y: viewportCenter.y - copiedCenter.y
                }
                
                // Create ID mapping for nodes (old ID -> new ID)
                const idMap = new Map<string, string>()
                
                // Create new nodes with new IDs and offset positions
                const newNodes: QNode[] = clipboardData.nodes.map((node: QNode) => {
                  const oldId = getIdString(node._id)
                  const newId = new ObjectId()
                  idMap.set(oldId, getIdString(newId))
                  
                  return {
                    ...node,
                    _id: newId,
                    x: node.x + pasteOffset.x,
                    y: node.y + pasteOffset.y
                  }
                })
                
                // Create new edges with mapped IDs
                const newEdges: QEdge[] = []
                if (clipboardData.edges) {
                  clipboardData.edges.forEach((edge: QEdge) => {
                    const newSourceId = idMap.get(getIdString(edge.s))
                    const newTargetId = idMap.get(getIdString(edge.t))
                    
                    // Only create edge if both nodes exist in the paste
                    if (newSourceId && newTargetId) {
                      newEdges.push({
                        ...edge,
                        _id: new ObjectId(),
                        s: newSourceId,
                        t: newTargetId
                      })
                    }
                  })
                }
                
                // Add to existing nodes and edges
                const updatedNodes = [...nodes, ...newNodes]
                const updatedEdges = [...edges, ...newEdges]
                
                saveToHistory(updatedNodes, updatedEdges)
                setNodes(updatedNodes)
                setEdges(updatedEdges)
                onNodesChange?.(updatedNodes)
                onEdgesChange?.(updatedEdges)
                
                // Select the pasted nodes
                const pastedNodeIds = new Set(newNodes.map(n => getIdString(n._id)))
                setSelectedNodeIds(pastedNodeIds)
                setSelectedEdgeIds(new Set())
                
                console.log('Pasted', newNodes.length, 'nodes and', newEdges.length, 'edges at viewport center')
              }
            }
          } catch (error) {
            console.error('Failed to paste:', error)
          }
        }
      }
      
      // L - Smart align selected nodes (vertical if portrait, horizontal if landscape)
      if (e.key === 'l' && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
        e.preventDefault()
        if (selectedNodeIds.size >= 2) {
          // Get selected nodes only (ignore edges)
          const selectedNodes = nodes.filter(n => selectedNodeIds.has(getIdString(n._id)))
          
          if (selectedNodes.length >= 2) {
            // Calculate bounding box of selection
            const minX = Math.min(...selectedNodes.map(n => n.x))
            const maxX = Math.max(...selectedNodes.map(n => n.x))
            const minY = Math.min(...selectedNodes.map(n => n.y))
            const maxY = Math.max(...selectedNodes.map(n => n.y))
            
            const width = maxX - minX
            const height = maxY - minY
            
            // Determine aspect ratio (portrait vs landscape)
            const isPortrait = height > width
            
            const alignedNodes = nodes.map(node => {
              const nodeIdStr = getIdString(node._id)
              if (selectedNodeIds.has(nodeIdStr)) {
                if (isPortrait) {
                  // Align vertically - center all nodes horizontally
                  const centerX = (minX + maxX) / 2
                  return { ...node, x: centerX }
                } else {
                  // Align horizontally - center all nodes vertically
                  const centerY = (minY + maxY) / 2
                  return { ...node, y: centerY }
                }
              }
              return node
            })
            
            saveToHistory(alignedNodes, edges)
            setNodes(alignedNodes)
            onNodesChange?.(alignedNodes)
            
            console.log(`Aligned ${selectedNodes.length} nodes ${isPortrait ? 'vertically' : 'horizontally'}`)
          }
        }
      }
      
      // D - Smart distribute selected nodes (vertical if portrait, horizontal if landscape)
      if (e.key === 'd' && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
        e.preventDefault()
        if (selectedNodeIds.size >= 3) {  // Need at least 3 nodes to distribute
          // Get selected nodes only (ignore edges)
          const selectedNodes = nodes.filter(n => selectedNodeIds.has(getIdString(n._id)))
          
          if (selectedNodes.length >= 3) {
            // Calculate bounding box of selection
            const minX = Math.min(...selectedNodes.map(n => n.x))
            const maxX = Math.max(...selectedNodes.map(n => n.x))
            const minY = Math.min(...selectedNodes.map(n => n.y))
            const maxY = Math.max(...selectedNodes.map(n => n.y))
            
            const width = maxX - minX
            const height = maxY - minY
            
            // Determine aspect ratio (portrait vs landscape)
            const isPortrait = height > width
            
            let distributedNodes: QNode[]
            
            if (isPortrait) {
              // Distribute vertically - sort by Y position
              const sortedNodes = [...selectedNodes].sort((a, b) => a.y - b.y)
              const spacing = (maxY - minY) / (sortedNodes.length - 1)
              
              distributedNodes = nodes.map(node => {
                const nodeIdStr = getIdString(node._id)
                const index = sortedNodes.findIndex(n => getIdString(n._id) === nodeIdStr)
                
                if (index !== -1) {
                  // Distribute evenly along Y axis
                  return { ...node, y: minY + (spacing * index) }
                }
                return node
              })
            } else {
              // Distribute horizontally - sort by X position
              const sortedNodes = [...selectedNodes].sort((a, b) => a.x - b.x)
              const spacing = (maxX - minX) / (sortedNodes.length - 1)
              
              distributedNodes = nodes.map(node => {
                const nodeIdStr = getIdString(node._id)
                const index = sortedNodes.findIndex(n => getIdString(n._id) === nodeIdStr)
                
                if (index !== -1) {
                  // Distribute evenly along X axis
                  return { ...node, x: minX + (spacing * index) }
                }
                return node
              })
            }
            
            saveToHistory(distributedNodes, edges)
            setNodes(distributedNodes)
            onNodesChange?.(distributedNodes)
            
            console.log(`Distributed ${selectedNodes.length} nodes ${isPortrait ? 'vertically' : 'horizontally'}`)
          }
        }
      }
      
      // Escape - deselect
      if (e.key === 'Escape') {
        setSelectedNodeIds(new Set())
        setSelectedEdgeIds(new Set())
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedNodeIds, selectedEdgeIds, copiedNode, nodes, edges, onNodesChange, onEdgesChange, undo, redo, saveToHistory, handleSave, getIdString, zoom, pan, containerRef])

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
      if (e.shiftKey) {
        // Start selection rectangle with Shift+drag
        const rect = containerRef.current?.getBoundingClientRect()
        if (rect) {
          const startX = (e.clientX - rect.left - pan.x) / zoom
          const startY = (e.clientY - rect.top - pan.y) / zoom
          setIsSelecting(true)
          setSelectionStart({ x: startX, y: startY })
          setSelectionRect({ x: startX, y: startY, width: 0, height: 0 })
        }
      } else {
        // Regular drag - pan the canvas
        setIsPanning(true)
        setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
        
        // Clear selection if not holding shift
        setSelectedNodeIds(new Set())
        setSelectedEdgeIds(new Set())
      }
    }
  }, [pan])

  // Handle panning and selection
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      })
    } else if (isSelecting) {
      // Update selection rectangle
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) {
        const currentX = (e.clientX - rect.left - pan.x) / zoom
        const currentY = (e.clientY - rect.top - pan.y) / zoom
        
        const x = Math.min(selectionStart.x, currentX)
        const y = Math.min(selectionStart.y, currentY)
        const width = Math.abs(currentX - selectionStart.x)
        const height = Math.abs(currentY - selectionStart.y)
        
        setSelectionRect({ x, y, width, height })
      }
    } else if (draggedNode) {
      // Calculate the movement delta
      const currentNode = nodes.find(n => {
        const nId = n._id || (n as any).id
        return nId && getIdString(nId) === draggedNode
      })
      
      if (currentNode) {
        const newX = (e.clientX - pan.x - dragOffset.x) / zoom
        const newY = (e.clientY - pan.y - dragOffset.y) / zoom
        const deltaX = newX - currentNode.x
        const deltaY = newY - currentNode.y
        
        // Check if the dragged node is part of the selection
        const isDraggedNodeSelected = selectedNodeIds.has(draggedNode)
        
        // Move all selected nodes together if dragged node is selected
        // Otherwise just move the single node
        const newNodes = nodes.map(n => {
          const nId = n._id || (n as any).id
          const nodeIdStr = getIdString(nId)
          
          if (isDraggedNodeSelected && selectedNodeIds.has(nodeIdStr)) {
            // Move all selected nodes by the same delta
            return {
              ...n,
              x: n.x + deltaX,
              y: n.y + deltaY
            }
          } else if (nodeIdStr === draggedNode) {
            // Just move the single dragged node
            return {
              ...n,
              x: newX,
              y: newY
            }
          }
          return n
        })
        setNodes(newNodes)
        // Don't call onNodesChange during drag - we'll do it on mouse up
      }
    }
  }, [isPanning, panStart, isSelecting, selectionStart, draggedNode, nodes, pan, zoom, dragOffset, getIdString, selectedNodeIds])

  // Stop panning, dragging, or selecting
  const handleMouseUp = useCallback(() => {
    // If we were selecting, find items in rectangle
    if (isSelecting) {
      const rect = selectionRect
      
      // Find nodes in selection rectangle
      const selectedNodes = new Set<string>()
      nodes.forEach(node => {
        const nodeX = node.x
        const nodeY = node.y
        
        // Check if node center is within rectangle
        if (nodeX >= rect.x && nodeX <= rect.x + rect.width &&
            nodeY >= rect.y && nodeY <= rect.y + rect.height) {
          selectedNodes.add(getIdString(node._id))
        }
      })
      
      // Update selection
      setSelectedNodeIds(prev => {
        // If we found any nodes, add them to the existing selection
        if (selectedNodes.size > 0) {
          // Add to existing selection
          return new Set([...prev, ...selectedNodes])
        }
        return prev
      })
      
      setIsSelecting(false)
      setSelectionRect({ x: 0, y: 0, width: 0, height: 0 })
    }
    
    // If we were dragging a node, save to history and notify parent
    if (draggedNode) {
      isDragging.current = false
      onNodesChange?.(nodes) // Notify parent of the final position
      saveToHistory(nodes, edges)
    }
    setIsPanning(false)
    setDraggedNode(null)
  }, [isSelecting, selectionRect, selectionStart, draggedNode, nodes, edges, saveToHistory, onNodesChange, getIdString])

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
        // Regular click
        // If clicking on an already selected node, keep the selection for group dragging
        // Otherwise, select only this node
        if (!selectedNodeIds.has(nodeIdStr)) {
          setSelectedNodeIds(new Set([nodeIdStr]))
          setSelectedEdgeIds(new Set())  // Clear edges on regular click
        }
      }
      
      // Mixed selection allowed with modifiers
      
      // Handle Shift+Alt+drag for linked copy (duplicate + connect)
      if (e.altKey && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        // Duplicate selected nodes (or just this node if not selected) - ignore edges
        const nodesToDuplicate = selectedNodeIds.has(nodeIdStr) 
          ? nodes.filter(n => selectedNodeIds.has(getIdString(n._id)))
          : [node]
        
        // Create ID mapping for duplicates
        const idMap = new Map<string, string>()
        
        // Create duplicated nodes with new IDs at same position
        const duplicatedNodes: QNode[] = nodesToDuplicate.map(n => {
          const oldId = getIdString(n._id)
          const newId = new ObjectId()
          idMap.set(oldId, getIdString(newId))
          
          return {
            ...n,
            _id: newId,
            x: n.x,  // Keep same position initially
            y: n.y
          }
        })
        
        // Duplicate edges between duplicated nodes
        const duplicatedEdges: QEdge[] = []
        edges.forEach(edge => {
          const newSourceId = idMap.get(getIdString(edge.s))
          const newTargetId = idMap.get(getIdString(edge.t))
          
          // Only duplicate edge if both nodes were duplicated
          if (newSourceId && newTargetId) {
            duplicatedEdges.push({
              ...edge,
              _id: new ObjectId(),
              s: newSourceId,
              t: newTargetId
            })
          }
        })
        
        // Create linking edges from originals to copies
        const linkingEdges: QEdge[] = nodesToDuplicate.map(originalNode => {
          const originalId = getIdString(originalNode._id)
          const copyId = idMap.get(originalId)!
          
          return {
            _id: new ObjectId(),
            s: originalId,
            t: copyId,
            ty: 'data' as const,
            w: 1,
            m: {
              l: 'Connected'
            }
          }
        })
        
        // Add duplicates and linking edges to the canvas
        const newNodes = [...nodes, ...duplicatedNodes]
        const newEdges = [...edges, ...duplicatedEdges, ...linkingEdges]
        setNodes(newNodes)
        setEdges(newEdges)
        
        // Select the duplicated nodes
        const duplicatedNodeIds = new Set(duplicatedNodes.map(n => getIdString(n._id)))
        setSelectedNodeIds(duplicatedNodeIds)
        setSelectedEdgeIds(new Set())
        
        // Start dragging the duplicates
        const duplicatedDragNode = idMap.get(nodeIdStr) || nodeIdStr
        isDragging.current = true
        setDraggedNode(duplicatedDragNode)
        setDragOffset({
          x: e.clientX - pan.x - node.x * zoom,
          y: e.clientY - pan.y - node.y * zoom
        })
      }
      // Handle Alt+drag for regular duplication (no linking)
      else if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        // Duplicate selected nodes (or just this node if not selected)
        const nodesToDuplicate = selectedNodeIds.has(nodeIdStr) 
          ? nodes.filter(n => selectedNodeIds.has(getIdString(n._id)))
          : [node]
        
        // Create ID mapping for duplicates
        const idMap = new Map<string, string>()
        
        // Create duplicated nodes with new IDs at same position
        const duplicatedNodes: QNode[] = nodesToDuplicate.map(n => {
          const oldId = getIdString(n._id)
          const newId = new ObjectId()
          idMap.set(oldId, getIdString(newId))
          
          return {
            ...n,
            _id: newId,
            x: n.x,  // Keep same position initially
            y: n.y
          }
        })
        
        // Duplicate edges between duplicated nodes
        const duplicatedEdges: QEdge[] = []
        edges.forEach(edge => {
          const newSourceId = idMap.get(getIdString(edge.s))
          const newTargetId = idMap.get(getIdString(edge.t))
          
          // Only duplicate edge if both nodes were duplicated
          if (newSourceId && newTargetId) {
            duplicatedEdges.push({
              ...edge,
              _id: new ObjectId(),
              s: newSourceId,
              t: newTargetId
            })
          }
        })
        
        // Add duplicates to the canvas
        const newNodes = [...nodes, ...duplicatedNodes]
        const newEdges = [...edges, ...duplicatedEdges]
        setNodes(newNodes)
        setEdges(newEdges)
        
        // Select the duplicated nodes
        const duplicatedNodeIds = new Set(duplicatedNodes.map(n => getIdString(n._id)))
        setSelectedNodeIds(duplicatedNodeIds)
        setSelectedEdgeIds(new Set())
        
        // Start dragging the duplicates
        const duplicatedDragNode = idMap.get(nodeIdStr) || nodeIdStr
        isDragging.current = true
        setDraggedNode(duplicatedDragNode)
        setDragOffset({
          x: e.clientX - pan.x - node.x * zoom,
          y: e.clientY - pan.y - node.y * zoom
        })
      }
      // Start normal dragging only if not using modifiers
      else if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
        isDragging.current = true
        setDraggedNode(nodeIdStr)
        setDragOffset({
          x: e.clientX - pan.x - node.x * zoom,
          y: e.clientY - pan.y - node.y * zoom
        })
      }
    }
  }, [nodes, edges, pan, zoom, objectIdEquals, getIdString, selectedNodeIds])
  
  // Handle double-click on nodes - expand/collapse or open sub-flow
  const handleNodeDoubleClick = useCallback((e: React.MouseEvent, nodeId: string | ObjectId) => {
    e.stopPropagation()
    
    // Don't handle if double-clicking on an input element
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.tagName === 'SELECT' ||
        target.contentEditable === 'true') {
      return
    }
    
    const nodeIdStr = getIdString(nodeId)
    const node = nodes.find(n => getIdString(n._id) === nodeIdStr)
    
    // Shift+double-click: Convert to memory node and open sub-flow
    if (e.shiftKey && node) {
      console.log('Shift+double-click on node:', nodeIdStr, node.data?.label, '- Converting to memory node')
      
      // Mark this node as a memory node (it will be saved to memory)
      const updatedNode = {
        ...node,
        data: {
          ...node.data,
          isMemoryNode: true
        }
      }
      
      // Update the node to mark it as a memory node
      const updatedNodes = nodes.map(n => 
        getIdString(n._id) === nodeIdStr ? updatedNode : n
      )
      onNodesChange?.(updatedNodes)
      setHasUnsavedChanges(true)
      
      // Call the onOpenSubFlow callback to save to memory and open editor
      if (onOpenSubFlow) {
        onOpenSubFlow(updatedNode)
      }
      return
    }
    
    // Normal double-click: Toggle expanded state
    setExpandedNodes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(nodeIdStr)) {
        newSet.delete(nodeIdStr)
      } else {
        newSet.add(nodeIdStr)
      }
      return newSet
    })
  }, [getIdString, nodes, onOpenSubFlow, onNodesChange])

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
        {hasUnsavedChanges && (
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
            pointerEvents: 'auto',  // Enable pointer events for edge selection
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
            
            // Don't render if either node doesn't exist or is deleted
            if (!source || !target || source.data?.deleted || target.data?.deleted) return null
            
            return (
              <Edge
                key={`edge-${getIdString(edgeId)}`}
                edge={edge}
                source={source}
                target={target}
                getIdString={getIdString}
                isSelected={selectedEdgeIds.has(getIdString(edgeId))}
                onDataChange={(edgeId: string, data: any) => {
                  // Update edge metadata when edited
                  const updatedEdges = edges.map(e => {
                    if (getIdString(e._id) === edgeId) {
                      return {
                        ...e,
                        m: {
                          ...e.m,
                          l: data.label,
                          d: data.description
                        }
                      }
                    }
                    return e
                  })
                  setEdges(updatedEdges)
                  onEdgesChange?.(updatedEdges)
                }}
                onClick={(e: React.MouseEvent) => {
                  const edgeIdStr = getIdString(edgeId)
                  
                  if (e.shiftKey) {
                    // Shift+click: Add to selection
                    setSelectedEdgeIds(prev => {
                      const newSet = new Set(prev)
                      newSet.add(edgeIdStr)
                      return newSet
                    })
                  } else if (e.ctrlKey || e.metaKey) {
                    // Ctrl/Cmd+click: Toggle selection
                    setSelectedEdgeIds(prev => {
                      const newSet = new Set(prev)
                      if (newSet.has(edgeIdStr)) {
                        newSet.delete(edgeIdStr)
                      } else {
                        newSet.add(edgeIdStr)
                      }
                      return newSet
                    })
                  } else {
                    // Regular click: Select only this edge (clear nodes)
                    setSelectedEdgeIds(new Set([edgeIdStr]))
                    setSelectedNodeIds(new Set())  // Clear nodes on regular click
                  }
                  
                  // Mixed selection allowed with modifiers
                }}
              />
            )
          })}
        </svg>

        {/* Nodes - filter out deleted ones */}
        {nodes.filter(n => !n.data?.deleted).map((node, index) => {
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
                    {node.data.hasData && '*'}
                    {node.data.isMemoryNode && '>'}
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
                    ) : node.data.nodeType === 'monitor' ? (
                      // Monitor Node Component
                      <MonitorNode
                        nodeId={nodeIdStr || ''}
                        initialData={{
                          title: node.data.title || node.data.label || 'DH Monitor',
                          brainId: node.data.brainId || 'stephen-qwanyx-com',
                          isLocked: node.data.isLocked || false
                        }}
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

      {/* Selection rectangle */}
      {isSelecting && (
        <div style={{
          position: 'absolute',
          left: `${selectionRect.x * zoom + pan.x}px`,
          top: `${selectionRect.y * zoom + pan.y}px`,
          width: `${selectionRect.width * zoom}px`,
          height: `${selectionRect.height * zoom}px`,
          border: '1px dashed rgba(0, 0, 0, 0.5)',
          backgroundColor: 'rgba(100, 149, 237, 0.1)',
          pointerEvents: 'none',
          zIndex: 9999
        }} />
      )}

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