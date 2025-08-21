import React, { useState } from 'react'
import { Handle, Position, NodeProps, Node, Edge, internalsSymbol } from 'reactflow'
import { Icon, Text, Tooltip } from '@qwanyx/ui'
import { FlowModal } from '../FlowModal'

export interface QwanyxIconNodeData {
  label: string
  icon: string
  description?: string
  color?: string
  // Internal flow data
  internalFlow?: {
    nodes: Node[]
    edges: Edge[]
  }
  // Reference to memory flow (if extracted)
  flowRef?: string
  isMemory?: boolean
}

export const QwanyxIconNode: React.FC<NodeProps<QwanyxIconNodeData>> = ({ 
  id,
  data, 
  selected,
  dragging
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsModalOpen(true)
  }
  
  const handleToggleMemory = () => {
    // TODO: Implement memory extraction/embedding logic
    console.log('Toggle memory status for node:', id)
  }
  
  const handleSaveFlow = (nodes: Node[], edges: Edge[]) => {
    // TODO: Save the internal flow
    console.log('Save flow for node:', id, { nodes, edges })
    setIsModalOpen(false)
  }
  
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          padding: '6px',
          cursor: 'pointer',
          position: 'relative'
        }}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onDoubleClick={handleDoubleClick}
      >
      {/* Handles at icon center - simple approach */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: 'transparent',
          border: 'none',
          width: '1px',
          height: '1px',
          top: '38px', // Center of icon
          left: '0'
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: 'transparent',
          border: 'none',
          width: '1px',
          height: '1px',
          top: '38px', // Center of icon
          right: '0'
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: 'transparent',
          border: 'none',
          width: '1px',
          height: '1px',
          top: '0',
          left: '50%'
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: 'transparent',
          border: 'none',
          width: '1px',
          height: '1px',
          bottom: '0',
          left: '50%'
        }}
      />

      {/* Icon container */}
      {!isDragging && !dragging ? (
        <Tooltip content={data.description || data.label}>
          <div
          style={{
            width: '64px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '16px',
            background: data.color === 'primary' ? 
                       'linear-gradient(135deg, rgba(96, 165, 250, 0.8) 0%, rgba(59, 130, 246, 0.7) 50%, rgba(37, 99, 235, 0.8) 100%)' :
                       data.color === 'accent' ? 
                       'linear-gradient(135deg, rgba(74, 222, 128, 0.8) 0%, rgba(34, 197, 94, 0.7) 50%, rgba(22, 163, 74, 0.8) 100%)' :
                       data.color === 'success' ? 
                       'linear-gradient(135deg, rgba(74, 222, 128, 0.8) 0%, rgba(34, 197, 94, 0.7) 50%, rgba(22, 163, 74, 0.8) 100%)' :
                       data.color === 'error' ? 
                       'linear-gradient(135deg, rgba(252, 165, 165, 0.8) 0%, rgba(239, 68, 68, 0.7) 50%, rgba(220, 38, 38, 0.8) 100%)' :
                       data.color === 'warning' ? 
                       'linear-gradient(135deg, rgba(251, 191, 36, 0.8) 0%, rgba(245, 158, 11, 0.7) 50%, rgba(217, 119, 6, 0.8) 100%)' :
                       'linear-gradient(135deg, rgba(96, 165, 250, 0.8) 0%, rgba(59, 130, 246, 0.7) 50%, rgba(37, 99, 235, 0.8) 100%)',
            backdropFilter: 'blur(1.5px)',
            WebkitBackdropFilter: 'blur(1.5px)',
            boxShadow: selected
              ? '0 4px 24px rgba(0, 0, 0, 0.2), 0 0 0 2px rgba(255, 255, 255, 0.6)'
              : '0 2px 12px rgba(0, 0, 0, 0.1)',
            border: data.color === 'primary' ?
              (selected ? '1px solid rgba(37, 99, 235, 0.6)' : '1px solid rgba(37, 99, 235, 0.3)') :
              data.color === 'accent' ?
              (selected ? '1px solid rgba(22, 163, 74, 0.6)' : '1px solid rgba(22, 163, 74, 0.3)') :
              data.color === 'success' ?
              (selected ? '1px solid rgba(22, 163, 74, 0.6)' : '1px solid rgba(22, 163, 74, 0.3)') :
              data.color === 'error' ?
              (selected ? '1px solid rgba(220, 38, 38, 0.6)' : '1px solid rgba(220, 38, 38, 0.3)') :
              data.color === 'warning' ?
              (selected ? '1px solid rgba(217, 119, 6, 0.6)' : '1px solid rgba(217, 119, 6, 0.3)') :
              (selected ? '1px solid rgba(37, 99, 235, 0.6)' : '1px solid rgba(37, 99, 235, 0.3)'),
            transition: 'all 0.2s ease',
            position: 'relative',
            zIndex: 1
          }}
          onMouseEnter={(e) => {
            if (!selected) {
              e.currentTarget.style.opacity = '0.85'
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)'
              e.currentTarget.style.transform = 'scale(1.05)'
            }
          }}
          onMouseLeave={(e) => {
            if (!selected) {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.15)'
              e.currentTarget.style.transform = 'scale(1)'
            }
          }}
        >
          <Icon 
            name={data.icon} 
            size="3xl"
            style={{ color: 'white' }}
          />
        </div>
      </Tooltip>
      ) : (
        <div
          style={{
            width: '64px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '16px',
            background: data.color === 'primary' ? 
                       'linear-gradient(135deg, rgba(96, 165, 250, 0.8) 0%, rgba(59, 130, 246, 0.7) 50%, rgba(37, 99, 235, 0.8) 100%)' :
                       data.color === 'accent' ? 
                       'linear-gradient(135deg, rgba(74, 222, 128, 0.8) 0%, rgba(34, 197, 94, 0.7) 50%, rgba(22, 163, 74, 0.8) 100%)' :
                       data.color === 'success' ? 
                       'linear-gradient(135deg, rgba(74, 222, 128, 0.8) 0%, rgba(34, 197, 94, 0.7) 50%, rgba(22, 163, 74, 0.8) 100%)' :
                       data.color === 'error' ? 
                       'linear-gradient(135deg, rgba(252, 165, 165, 0.8) 0%, rgba(239, 68, 68, 0.7) 50%, rgba(220, 38, 38, 0.8) 100%)' :
                       data.color === 'warning' ? 
                       'linear-gradient(135deg, rgba(251, 191, 36, 0.8) 0%, rgba(245, 158, 11, 0.7) 50%, rgba(217, 119, 6, 0.8) 100%)' :
                       'linear-gradient(135deg, rgba(96, 165, 250, 0.8) 0%, rgba(59, 130, 246, 0.7) 50%, rgba(37, 99, 235, 0.8) 100%)',
            backdropFilter: 'blur(1.5px)',
            WebkitBackdropFilter: 'blur(1.5px)',
            boxShadow: selected
              ? '0 4px 24px rgba(0, 0, 0, 0.2), 0 0 0 2px rgba(255, 255, 255, 0.6)'
              : '0 2px 12px rgba(0, 0, 0, 0.1)',
            border: data.color === 'primary' ?
              (selected ? '1px solid rgba(37, 99, 235, 0.6)' : '1px solid rgba(37, 99, 235, 0.3)') :
              data.color === 'accent' ?
              (selected ? '1px solid rgba(22, 163, 74, 0.6)' : '1px solid rgba(22, 163, 74, 0.3)') :
              data.color === 'success' ?
              (selected ? '1px solid rgba(22, 163, 74, 0.6)' : '1px solid rgba(22, 163, 74, 0.3)') :
              data.color === 'error' ?
              (selected ? '1px solid rgba(220, 38, 38, 0.6)' : '1px solid rgba(220, 38, 38, 0.3)') :
              data.color === 'warning' ?
              (selected ? '1px solid rgba(217, 119, 6, 0.6)' : '1px solid rgba(217, 119, 6, 0.3)') :
              (selected ? '1px solid rgba(37, 99, 235, 0.6)' : '1px solid rgba(37, 99, 235, 0.3)'),
            transition: 'all 0.2s ease',
            position: 'relative',
            zIndex: 1
          }}
        >
          <Icon 
            name={data.icon} 
            size="3xl"
            style={{ color: 'white' }}
          />
        </div>
      )}

      {/* Compact label */}
      <Text 
        size="base" 
        style={{ 
          fontSize: '14px',
          maxWidth: '120px',
          textAlign: 'center',
          lineHeight: '1',
          margin: 0,
          padding: 0,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: selected 
            ? 'rgba(var(--qwanyx-primary), 1)' 
            : 'var(--qwanyx-text-secondary)',
          fontWeight: 500,
          textShadow: '0 1px 2px rgba(255, 255, 255, 0.8), 0 0 8px rgba(255, 255, 255, 0.4)'
        }}
      >
        {data.label}
      </Text>
    </div>
    
    {/* Flow expansion modal */}
    <FlowModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      nodeId={id}
      nodeLabel={data.label}
      initialNodes={data.internalFlow?.nodes || []}
      initialEdges={data.internalFlow?.edges || []}
      isMemory={data.isMemory || false}
      onToggleMemory={handleToggleMemory}
      onSave={handleSaveFlow}
    />
    </>
  )
}