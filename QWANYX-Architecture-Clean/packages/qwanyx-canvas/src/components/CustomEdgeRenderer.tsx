import React, { useMemo } from 'react'
import { useNodes, useEdges, useViewport } from 'reactflow'

interface EdgePoint {
  x: number
  y: number
}

const getNodeCenter = (node: any): EdgePoint => {
  // The node container is centered with max label width of 120px
  // The container has 6px padding on all sides
  // Total node width: 6 + 120 + 6 = 132px
  // Icon is 64px centered within, so icon center is at 132/2 = 66px
  // Icon vertical center: 6px padding + 32px (half of 64px icon) = 38px
  return {
    x: node.position.x + 66, // Center of total node width
    y: node.position.y + 38  // 6px padding + 32px (half of 64px icon)
  }
}

const getConnectionPoint = (source: EdgePoint, target: EdgePoint, nodeSize: number = 64): { 
  source: EdgePoint, 
  target: EdgePoint,
  sourcePosition: 'left' | 'right' | 'top' | 'bottom',
  targetPosition: 'left' | 'right' | 'top' | 'bottom'
} => {
  const dx = target.x - source.x
  const dy = target.y - source.y
  const angle = Math.atan2(dy, dx)
  
  // Calculate points on the edge of the icon (radius = 32px)
  const radius = nodeSize / 2
  
  // Determine which side of each node to connect from/to
  let sourcePosition: 'left' | 'right' | 'top' | 'bottom'
  let targetPosition: 'left' | 'right' | 'top' | 'bottom'
  
  // Use angle to determine best connection sides
  const angleDeg = (angle * 180) / Math.PI
  
  // Source side (where edge leaves)
  if (angleDeg >= -45 && angleDeg < 45) {
    sourcePosition = 'right'
  } else if (angleDeg >= 45 && angleDeg < 135) {
    sourcePosition = 'bottom'
  } else if (angleDeg >= -135 && angleDeg < -45) {
    sourcePosition = 'top'
  } else {
    sourcePosition = 'left'
  }
  
  // Target side (where edge enters) - opposite angle
  const oppositeAngle = angleDeg > 0 ? angleDeg - 180 : angleDeg + 180
  if (oppositeAngle >= -45 && oppositeAngle < 45) {
    targetPosition = 'right'
  } else if (oppositeAngle >= 45 && oppositeAngle < 135) {
    targetPosition = 'bottom'
  } else if (oppositeAngle >= -135 && oppositeAngle < -45) {
    targetPosition = 'top'
  } else {
    targetPosition = 'left'
  }
  
  // Calculate actual connection points based on sides
  const sourcePoint = { ...source }
  const targetPoint = { ...target }
  
  // Adjust source point
  switch (sourcePosition) {
    case 'right':
      sourcePoint.x += radius
      break
    case 'left':
      sourcePoint.x -= radius
      break
    case 'bottom':
      sourcePoint.y += radius
      break
    case 'top':
      sourcePoint.y -= radius
      break
  }
  
  // Adjust target point
  switch (targetPosition) {
    case 'right':
      targetPoint.x += radius
      break
    case 'left':
      targetPoint.x -= radius
      break
    case 'bottom':
      targetPoint.y += radius
      break
    case 'top':
      targetPoint.y -= radius
      break
  }
  
  return {
    source: sourcePoint,
    target: targetPoint,
    sourcePosition,
    targetPosition
  }
}

const getCurvedPath = (
  source: EdgePoint, 
  target: EdgePoint, 
  sourcePosition: 'left' | 'right' | 'top' | 'bottom',
  targetPosition: 'left' | 'right' | 'top' | 'bottom'
): string => {
  const dx = target.x - source.x
  const dy = target.y - source.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  // Control point offset (how far from the node the control point extends)
  const offset = Math.min(distance * 0.5, 100)
  
  // Control points based on which side we're connecting from/to
  let cp1x = source.x
  let cp1y = source.y
  let cp2x = target.x
  let cp2y = target.y
  
  // First control point extends from source in the direction of sourcePosition
  switch (sourcePosition) {
    case 'right':
      cp1x = source.x + offset
      break
    case 'left':
      cp1x = source.x - offset
      break
    case 'bottom':
      cp1y = source.y + offset
      break
    case 'top':
      cp1y = source.y - offset
      break
  }
  
  // Second control point extends from target in the direction of targetPosition
  switch (targetPosition) {
    case 'right':
      cp2x = target.x + offset
      break
    case 'left':
      cp2x = target.x - offset
      break
    case 'bottom':
      cp2y = target.y + offset
      break
    case 'top':
      cp2y = target.y - offset
      break
  }
  
  return `M ${source.x} ${source.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${target.x} ${target.y}`
}

export const CustomEdgeRenderer: React.FC = () => {
  const nodes = useNodes()
  const edges = useEdges()
  const { x: viewportX, y: viewportY, zoom } = useViewport()
  
  const paths = useMemo(() => {
    return edges.map(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source)
      const targetNode = nodes.find(n => n.id === edge.target)
      
      if (!sourceNode || !targetNode) return null
      
      const sourceCenter = getNodeCenter(sourceNode)
      const targetCenter = getNodeCenter(targetNode)
      const { source, target, sourcePosition, targetPosition } = getConnectionPoint(sourceCenter, targetCenter)
      const path = getCurvedPath(source, target, sourcePosition, targetPosition)
      
      return {
        id: edge.id,
        path,
        source,
        target
      }
    }).filter(Boolean)
  }, [nodes, edges, viewportX, viewportY, zoom])
  
  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    >
      <g transform={`translate(${viewportX}, ${viewportY}) scale(${zoom})`}>
      <defs>
        {paths.map(edge => (
          <linearGradient key={`gradient-${edge.id}`} id={`edge-gradient-${edge.id}`}>
            <stop offset="0%" stopColor="#475569" stopOpacity="0" />
            <stop offset="10%" stopColor="#475569" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#475569" stopOpacity="0.5" />
            <stop offset="90%" stopColor="#475569" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#475569" stopOpacity="0" />
          </linearGradient>
        ))}
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
            fill="#475569"
            fillOpacity="0.5"
          />
        </marker>
      </defs>
      
      {paths.map(edge => (
        <g key={edge.id}>
          <path
            d={edge.path}
            stroke={`url(#edge-gradient-${edge.id})`}
            strokeWidth="2"
            fill="none"
            markerEnd="url(#arrowhead)"
          />
          {/* Optional: Add a wider invisible path for better hover detection */}
          <path
            d={edge.path}
            stroke="transparent"
            strokeWidth="10"
            fill="none"
            style={{ cursor: 'pointer' }}
          />
        </g>
      ))}
      </g>
    </svg>
  )
}