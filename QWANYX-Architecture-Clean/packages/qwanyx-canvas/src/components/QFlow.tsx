import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Icon } from '@qwanyx/ui'
import { ObjectId } from 'bson'

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
  width?: string | number
  height?: string | number
}

export const QFlow: React.FC<QFlowProps> = ({
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange,
  onEdgesChange,
  width = '100%',
  height = '100%'
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState(initialEdges)
  
  // Debug: Check what we're receiving
  console.log('Initial nodes:', initialNodes)
  console.log('Initial edges:', initialEdges)
  console.log('First node _id:', initialNodes[0]?._id)
  console.log('First node id:', (initialNodes[0] as any)?.id)
  console.log('First edge _id:', initialEdges[0]?._id)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  
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
  
  // Update local state when props change
  useEffect(() => {
    setNodes(initialNodes)
  }, [initialNodes])
  
  useEffect(() => {
    setEdges(initialEdges)
  }, [initialEdges])

  // Handle zoom with mouse wheel
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom(prev => Math.min(Math.max(0.1, prev * delta), 3))
  }, [])

  // Start panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === containerRef.current || e.target === containerRef.current?.firstChild) {
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
        onNodesChange?.(newNodes)
      }
    }
  }, [isPanning, panStart, draggedNode, nodes, pan, zoom, dragOffset, onNodesChange, getIdString])

  // Stop panning or dragging
  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
    setDraggedNode(null)
  }, [])

  // Start dragging a node
  const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string | ObjectId) => {
    e.stopPropagation()
    const node = nodes.find(n => {
      const nId = n._id || (n as any).id
      return nId && nodeId && objectIdEquals(nId, nodeId)
    })
    if (node) {
      setDraggedNode(getIdString(nodeId))
      setDragOffset({
        x: e.clientX - pan.x - node.x * zoom,
        y: e.clientY - pan.y - node.y * zoom
      })
    }
  }, [nodes, pan, zoom, objectIdEquals, getIdString])
  
  // Calculate edge path
  const getEdgePath = useCallback((edge: QEdge | any) => {
    const source = nodes.find(n => {
      const nodeId = n._id || (n as any).id
      const edgeSource = edge.s || edge.source
      return nodeId && edgeSource && objectIdEquals(nodeId, edgeSource)
    })
    const target = nodes.find(n => {
      const nodeId = n._id || (n as any).id
      const edgeTarget = edge.t || edge.target
      return nodeId && edgeTarget && objectIdEquals(nodeId, edgeTarget)
    })
    
    if (!source || !target) return ''
    
    // Icon is 64px, centered
    const sourceX = source.x + 32
    const sourceY = source.y + 32
    const targetX = target.x + 32
    const targetY = target.y + 32
    
    // Simple bezier curve
    const dx = targetX - sourceX
    const dy = targetY - sourceY
    const offset = Math.min(Math.abs(dx) * 0.5, 100)
    
    let path: string
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal connection
      path = `M ${sourceX} ${sourceY} C ${sourceX + offset} ${sourceY}, ${targetX - offset} ${targetY}, ${targetX} ${targetY}`
    } else {
      // Vertical connection
      path = `M ${sourceX} ${sourceY} C ${sourceX} ${sourceY + offset}, ${targetX} ${targetY - offset}, ${targetX} ${targetY}`
    }
    
    return path
  }, [nodes, objectIdEquals])

  return (
    <div 
      ref={containerRef}
      style={{
        width,
        height,
        overflow: 'hidden',
        position: 'relative',
        cursor: isPanning ? 'grabbing' : 'grab',
        background: 'linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
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
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#666"
                opacity="0.6"
              />
            </marker>
          </defs>
          {edges.map((edge, index) => {
            const edgeId = edge._id || (edge as any).id
            return edgeId ? (
              <path
                key={getIdString(edgeId)}
                d={getEdgePath(edge)}
                stroke={edge.st?.c || '#666'}
                strokeWidth={edge.st?.th || 2}
                strokeDasharray={edge.st?.p === 'dashed' ? '5,5' : edge.st?.p === 'dotted' ? '2,2' : undefined}
                fill="none"
                opacity={edge.w || 0.6}
                markerEnd="url(#arrowhead)"
              />
            ) : null
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node, index) => {
          const nodeId = node._id || (node as any).id
          console.log(`Node ${index}:`, node, 'has _id?', !!node._id, 'has id?', !!(node as any).id, 'nodeId:', nodeId)
          return nodeId ? (
            <div
              key={getIdString(nodeId)}
              style={{
                position: 'absolute',
                left: `${node.x}px`,
                top: `${node.y}px`,
                cursor: 'move',
                userSelect: 'none'
              }}
              onMouseDown={(e) => handleNodeMouseDown(e, nodeId)}
          >
            {node.type === 'icon' && (
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
                    'linear-gradient(135deg, rgba(96, 165, 250, 0.9) 0%, rgba(59, 130, 246, 0.9) 100%)' :
                    node.data.color === 'success' ?
                    'linear-gradient(135deg, rgba(74, 222, 128, 0.9) 0%, rgba(34, 197, 94, 0.9) 100%)' :
                    'linear-gradient(135deg, rgba(156, 163, 175, 0.9) 0%, rgba(107, 114, 128, 0.9) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <Icon name={node.data.icon || 'Circle'} size="2xl" style={{ color: 'white' }} />
                </div>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#333',
                  maxWidth: '80px',
                  textAlign: 'center'
                }}>
                  {node.data.label}
                </span>
              </div>
            )}
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
    </div>
  )
}