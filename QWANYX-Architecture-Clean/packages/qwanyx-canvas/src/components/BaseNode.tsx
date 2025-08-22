import React, { useState } from 'react'
import { Icon, Container, Flex, Text } from '@qwanyx/ui'
import { Bag } from './Bag'

interface BaseNodeProps {
  nodeId: string
  title: string
  icon?: string
  color?: string
  description?: string
  expanded?: boolean
  onExpand?: (expanded: boolean) => void
  children?: React.ReactNode
  // Optional brief/comment field
  brief?: string
  onBriefChange?: (brief: string) => void
  // Optional type field
  nodeType?: string
}

export const BaseNode: React.FC<BaseNodeProps> = ({
  nodeId,
  title,
  icon = 'Description',
  color = 'primary',
  description,
  expanded = false,
  onExpand,
  children,
  brief,
  onBriefChange,
  nodeType
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded)

  const handleDoubleClick = () => {
    const newExpanded = !isExpanded
    setIsExpanded(newExpanded)
    onExpand?.(newExpanded)
  }

  return (
    <div>
      {/* Icon/Collapsed View */}
      <div
        onDoubleClick={handleDoubleClick}
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: color === 'primary' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : color === 'success' ? 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)'
                    : color === 'error' ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                    : color === 'warning' ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                    : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
          cursor: 'move',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s',
          position: 'relative'
        }}
      >
        {icon && icon.length <= 2 ? (
          <Text size="xl" weight="bold" style={{ color: 'white', fontSize: '24px' }}>
            {icon.toUpperCase()}
          </Text>
        ) : (
          <Icon name={icon} size="lg" style={{ color: 'white' }} />
        )}
        <Text size="sm" style={{ color: 'white', marginTop: '4px', textAlign: 'center', fontSize: '12px' }}>
          {title}
        </Text>
      </div>

      {/* Expanded View */}
      {isExpanded && (
        <div
          style={{
            position: 'absolute',
            top: '90px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '320px',
            zIndex: 1000,
            animation: 'slideDown 0.2s ease-out',
            cursor: 'move'
          }}
        >
          <Bag color="#d1d5db" opacity={0.9} blur={false} padding="md">
              <Flex direction="col" gap="sm">
                {/* Node Info */}
                <Flex direction="col" gap="sm">
                  <Text size="sm" weight="semibold">{title}</Text>
                  {nodeType && (
                    <Text size="sm" style={{ color: '#9ca3af', fontSize: '12px' }}>
                      Type: {nodeType}
                    </Text>
                  )}
                  <Text size="sm" style={{ color: '#9ca3af', fontSize: '12px' }}>
                    ID: {nodeId}
                  </Text>
                  {description && (
                    <Text size="sm" style={{ color: '#9ca3af', fontSize: '12px' }}>
                      {description}
                    </Text>
                  )}
                  {brief && (
                    <Text size="sm" style={{ color: '#6b7280', fontSize: '12px' }}>
                      Brief: {brief}
                    </Text>
                  )}
                </Flex>

                {/* Custom Content */}
                {children}
              </Flex>
          </Bag>
        </div>
      )}
    </div>
  )
}