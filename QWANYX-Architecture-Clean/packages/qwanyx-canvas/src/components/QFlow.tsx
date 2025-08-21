import React, { useState, useRef, useCallback, useEffect, memo } from 'react'
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

// Edge Component
interface EdgeProps {
  edge: QEdge
  source: QNode
  target: QNode
  getIdString: (id: any) => string
}

const Edge = memo<EdgeProps>(({ edge, source, target, getIdString }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  // Calculate path
  const sourceX = source.x + 32
  const sourceY = source.y + 32
  const targetX = target.x + 32
  const targetY = target.y + 32
  
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
      
      {/* Visible edge */}
      <path
        d={path}
        stroke={edge.st?.c || '#666'}
        strokeWidth={isHovered ? 3 : (edge.st?.th || 2)}
        strokeOpacity={isHovered ? 0.8 : 0.5}
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
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [renderTrigger, setRenderTrigger] = useState(0)
  
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
  
  // Force initial render by simulating node movement
  useEffect(() => {
    // Wait for component to mount
    const timer = setTimeout(() => {
      // Move nodes by 0 pixels to trigger edge calculation
      setNodes(prev => prev.map(node => ({ ...node })))
    }, 50)
    
    return () => clearTimeout(timer)
  }, [])

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
                    'linear-gradient(135deg, rgba(96, 165, 250, 0.85) 0%, rgba(59, 130, 246, 0.85) 100%)' :
                    node.data.color === 'success' ?
                    'linear-gradient(135deg, rgba(74, 222, 128, 0.85) 0%, rgba(34, 197, 94, 0.85) 100%)' :
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
                  <Icon name={node.data.icon || 'Circle'} size="2xl" style={{ color: 'white', position: 'relative', zIndex: 1 }} />
                </div>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#2C3E50',
                  maxWidth: '80px',
                  textAlign: 'center',
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