import React from 'react'
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
  selected 
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        padding: '8px',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      {/* Connection handles positioned at icon center */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '8px',
          height: '8px',
          background: 'transparent',
          border: 'none',
          zIndex: 10
        }}
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '8px',
          height: '8px',
          background: 'transparent',
          border: 'none',
          zIndex: 10
        }}
      />

      {/* Icon with ghost button style */}
      <Tooltip content={data.description || data.label}>
        <div
          style={{
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            background: selected 
              ? 'rgba(var(--qwanyx-primary), 0.1)' 
              : 'rgba(var(--qwanyx-bg-secondary), 0.3)',
            border: selected 
              ? '2px solid rgba(var(--qwanyx-primary), 0.5)' 
              : '2px solid transparent',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            if (!selected) {
              e.currentTarget.style.background = 'rgba(var(--qwanyx-bg-secondary), 0.5)'
              e.currentTarget.style.border = '2px solid rgba(var(--qwanyx-border), 0.3)'
            }
          }}
          onMouseLeave={(e) => {
            if (!selected) {
              e.currentTarget.style.background = 'rgba(var(--qwanyx-bg-secondary), 0.3)'
              e.currentTarget.style.border = '2px solid transparent'
            }
          }}
        >
          <Icon 
            name={data.icon} 
            size="lg"
            color={data.color as any || 'primary'}
          />
        </div>
      </Tooltip>

      {/* Compact label */}
      <Text 
        size="sm" 
        style={{ 
          fontSize: '11px',
          maxWidth: '80px',
          textAlign: 'center',
          lineHeight: '1.2',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: selected 
            ? 'rgba(var(--qwanyx-primary), 1)' 
            : 'var(--qwanyx-text-secondary)'
        }}
      >
        {data.label}
      </Text>
    </div>
  )
}