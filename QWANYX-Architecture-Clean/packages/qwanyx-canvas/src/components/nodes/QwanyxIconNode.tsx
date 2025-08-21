import React, { useState } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Icon, Text, Tooltip } from '@qwanyx/ui'

export interface QwanyxIconNodeData {
  label: string
  icon: string
  description?: string
  color?: string
}

export const QwanyxIconNode: React.FC<NodeProps<QwanyxIconNodeData>> = ({ 
  data, 
  selected,
  dragging
}) => {
  const [isDragging, setIsDragging] = useState(false)
  
  return (
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
    >
      {/* All handles at center of icon (32px from top of icon + 6px padding = 38px) */}
      {/* Top handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{
          position: 'absolute',
          top: '38px', // Center of 64px icon
          left: '50%',
          transform: 'translateX(-50%)',
          width: '10px',
          height: '10px',
          background: 'transparent',
          border: 'none',
          zIndex: 10
        }}
      />
      
      {/* Bottom handles */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{
          position: 'absolute',
          top: '38px', // Center of 64px icon
          left: '50%',
          transform: 'translateX(-50%)',
          width: '10px',
          height: '10px',
          background: 'transparent',
          border: 'none',
          zIndex: 10
        }}
      />
      
      {/* Left handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{
          position: 'absolute',
          top: '38px', // Center of 64px icon
          left: '50%',
          transform: 'translateY(-50%)',
          width: '10px',
          height: '10px',
          background: 'transparent',
          border: 'none',
          zIndex: 10
        }}
      />
      
      {/* Right handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{
          position: 'absolute',
          top: '38px', // Center of 64px icon
          left: '50%',
          transform: 'translateY(-50%)',
          width: '10px',
          height: '10px',
          background: 'transparent',
          border: 'none',
          zIndex: 10
        }}
      />

      {/* Icon with frost effect background */}
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
  )
}