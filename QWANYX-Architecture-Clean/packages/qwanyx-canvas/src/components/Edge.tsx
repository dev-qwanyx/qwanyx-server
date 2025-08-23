import React, { useState, memo, useCallback, useEffect } from 'react'
import { ObjectId } from 'bson'
import { Bag } from './Bag'
import { Input, Field, Flex, Icon } from '@qwanyx/ui'

// Edge data structure
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
    showLabel?: boolean  // whether to show label on edge
  }
  tm?: {  // temporal
    dl?: number  // delay
    dd?: number  // deadline
    dc?: number  // decay
    ls?: number  // lifespan
  }
  st?: {  // style
    c?: string  // color (hex)
    th?: number  // thickness
    p?: 'solid' | 'dashed' | 'dotted'  // pattern
    a?: boolean  // animated
  }
}

// Node structure needed for edge rendering
export interface QNode {
  _id: string | ObjectId
  x: number
  y: number
  [key: string]: any  // Allow other properties
}

// Edge Component Props
export interface EdgeProps {
  edge: QEdge
  source: QNode
  target: QNode
  getIdString: (id: any) => string
  isSelected: boolean
  onClick: (e: React.MouseEvent) => void
  onDataChange?: (edgeId: string, data: any) => void
}

// Available colors for edges
const edgeColors = [
  { name: 'Grey', value: '#6b7280', hex: '#6b7280' },
  { name: 'Blue', value: '#3b82f6', hex: '#3b82f6' },
  { name: 'Green', value: '#10b981', hex: '#10b981' },
  { name: 'Red', value: '#ef4444', hex: '#ef4444' },
  { name: 'Purple', value: '#8b5cf6', hex: '#8b5cf6' },
  { name: 'Orange', value: '#f97316', hex: '#f97316' },
  { name: 'Yellow', value: '#eab308', hex: '#eab308' },
  { name: 'Pink', value: '#ec4899', hex: '#ec4899' }
]

// Line styles
const lineStyles = [
  { name: 'Solid', value: 'solid' },
  { name: 'Dashed', value: 'dashed' },
  { name: 'Dotted', value: 'dotted' }
]

// Edge Component - renders a single edge between two nodes
export const Edge = memo<EdgeProps>(({ edge, source, target, getIdString, isSelected, onClick, onDataChange }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showBag, setShowBag] = useState(false)
  const [title, setTitle] = useState(edge.m?.l || '')
  const [brief, setBrief] = useState(edge.m?.d || '')
  const [isLocked, setIsLocked] = useState(false)
  const [showStyle, setShowStyle] = useState(false)
  const [selectedColor, setSelectedColor] = useState(edge.st?.c || '#6b7280')
  const [thickness, setThickness] = useState(edge.st?.th || 2)
  const [lineStyle, setLineStyle] = useState(edge.st?.p || 'solid')
  
  // Auto-save when data changes
  useEffect(() => {
    if (onDataChange && showBag) {
      onDataChange(getIdString(edge._id), {
        label: title,
        description: brief,
        style: {
          color: selectedColor,
          thickness: thickness,
          pattern: lineStyle
        },
        hasContent: brief.length > 0
      })
    }
  }, [title, brief, selectedColor, thickness, lineStyle, showBag])
  
  // Handle double-click to show/hide Bag
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setShowBag(!showBag)
  }, [showBag])
  
  // Stop propagation for interactive elements
  const stopPropagation = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
  }
  
  // Stop keyboard events from triggering editor shortcuts
  const stopKeyPropagation = (e: React.KeyboardEvent) => {
    e.stopPropagation()
  }
  
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
    <g style={{ userSelect: 'none' }}>
      {/* Invisible wider path for better hover detection */}
      <path
        d={path}
        stroke="transparent"
        strokeWidth={20}
        fill="none"
        style={{ cursor: 'pointer' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={(e) => {
          e.stopPropagation()
          onClick(e)
        }}
        onDoubleClick={handleDoubleClick}
      />
      
      {/* Visible edge - use selected color and thickness */}
      <path
        d={path}
        stroke={isSelected ? '#000000' : selectedColor}
        strokeWidth={isSelected ? thickness + 2 : (isHovered ? thickness + 1 : thickness)}
        strokeOpacity={isSelected ? 1 : (isHovered ? 0.9 : 0.7)}
        strokeDasharray={lineStyle === 'dashed' ? '8,4' : lineStyle === 'dotted' ? '2,2' : undefined}
        fill="none"
        style={{
          filter: isHovered ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : undefined,
          pointerEvents: 'none'  // Let the invisible path handle clicks
        }}
      />
      
      {/* Bag or text label */}
      {showBag ? (
        <foreignObject
          x={(sourceX + targetX) / 2 - 150}  // Center the 300px wide Bag
          y={(sourceY + targetY) / 2 - 100}  // Offset vertically
          width={300}
          height={280}  // Increased height for style options
          style={{ overflow: 'visible' }}
        >
          <Bag color="#d1d5db" opacity={0.95} blur={false} padding="sm">
            {/* Header with icons */}
            <Flex direction="row" justify="end" align="center" style={{ marginBottom: '8px' }}>
              <Flex direction="row" gap="sm" align="center">
                {/* Style toggle icon */}
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowStyle(!showStyle)
                  }}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6b7280'
                  }}
                  title="Toggle style options"
                >
                  <Icon name="Autorenew" size="sm" />
                </div>
                
                {/* Lock icon */}
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsLocked(!isLocked)
                  }}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6b7280'
                  }}
                  title={isLocked ? "Unlock editing" : "Lock editing"}
                >
                  <Icon name={isLocked ? "Lock" : "LockOpen"} size="sm" />
                </div>
              </Flex>
            </Flex>
            
            {!showStyle ? (
              // Content editing
              <Flex direction="col" gap="sm" style={{ width: '100%' }}>
                {!isLocked ? (
                  <>
                    <Field name="title" label="Edge Label">
                      <Input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onMouseDown={stopPropagation}
                        onKeyDown={stopKeyPropagation}
                        onKeyUp={stopKeyPropagation}
                        placeholder="Edge label..."
                        inputSize="sm"
                        style={{ width: '100%' }}
                      />
                    </Field>

                    <textarea
                      value={brief}
                      onChange={(e) => setBrief(e.target.value)}
                      onMouseDown={stopPropagation}
                      onKeyDown={stopKeyPropagation}
                      onKeyUp={stopKeyPropagation}
                      placeholder="Edge description or conditions..."
                      style={{
                        width: '100%',
                        minHeight: '120px',
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid rgba(55, 65, 81, 0.3)',
                        backgroundColor: 'white',
                        color: '#1f2937',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        resize: 'vertical'
                      }}
                    />
                  </>
                ) : (
                  // Locked view - display only the content
                  <div style={{ 
                    padding: '8px',
                    minHeight: '120px',
                    whiteSpace: 'pre-wrap',
                    color: '#4b5563',
                    fontSize: '14px'
                  }}>
                    <strong>{title || 'Untitled Edge'}</strong>
                    {brief && <div style={{ marginTop: '8px' }}>{brief}</div>}
                  </div>
                )}
              </Flex>
            ) : (
              // Style options
              <Flex direction="col" gap="sm" style={{ width: '100%' }}>
                {/* Color Selection */}
                <Field name="color" label="Edge Color">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '8px' }}>
                    {edgeColors.map(color => (
                      <div
                        key={color.value}
                        onClick={() => setSelectedColor(color.hex)}
                        style={{
                          width: '28px',
                          height: '28px',
                          backgroundColor: color.hex,
                          borderRadius: '4px',
                          cursor: 'pointer',
                          border: selectedColor === color.hex ? '3px solid #1f2937' : '1px solid rgba(0,0,0,0.2)',
                          boxShadow: selectedColor === color.hex ? '0 0 0 2px white, 0 0 0 3px #1f2937' : 'none'
                        }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </Field>
                
                {/* Thickness Slider */}
                <Field name="thickness" label={`Thickness: ${thickness}px`}>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={thickness}
                    onChange={(e) => setThickness(Number(e.target.value))}
                    style={{
                      width: '100%',
                      cursor: 'pointer'
                    }}
                  />
                </Field>
                
                {/* Line Style Selection */}
                <Field name="lineStyle" label="Line Style">
                  <Flex direction="row" gap="sm" style={{ width: '100%' }}>
                    {lineStyles.map(style => (
                      <button
                        key={style.value}
                        onClick={() => setLineStyle(style.value as any)}
                        style={{
                          flex: 1,
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: lineStyle === style.value ? '2px solid #1f2937' : '1px solid rgba(55, 65, 81, 0.3)',
                          backgroundColor: lineStyle === style.value ? '#e5e7eb' : 'white',
                          color: '#1f2937',
                          fontSize: '14px',
                          cursor: 'pointer',
                          fontWeight: lineStyle === style.value ? 'bold' : 'normal'
                        }}
                      >
                        {style.name}
                      </button>
                    ))}
                  </Flex>
                </Field>
              </Flex>
            )}
          </Bag>
        </foreignObject>
      ) : (
        // Simple text label when Bag is not shown (only show if title is not empty)
        title && (
          <text
            x={(sourceX + targetX) / 2}
            y={(sourceY + targetY) / 2}
            textAnchor="middle"
            fill="#666"
            fontSize="12"
            opacity={isHovered ? 1 : 0.7}
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            {title}
            {brief && '*'}  {/* Add asterisk if there's description content */}
          </text>
        )
      )}
    </g>
  )
})

// Enhanced Edge with Bag support - Double-click to edit
Edge.displayName = 'Edge'