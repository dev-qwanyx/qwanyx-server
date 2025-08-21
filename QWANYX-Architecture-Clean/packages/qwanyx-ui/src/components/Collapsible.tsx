import React, { useState, ReactNode } from 'react'
import { Flex } from './Container'
import { Icon } from './Icon'
import { Text } from './Text'
import { Badge } from './Badge'

export interface CollapsibleProps {
  title: string
  icon?: string | ReactNode
  count?: number
  defaultExpanded?: boolean
  children: ReactNode
  onToggle?: (expanded: boolean) => void
  className?: string
  style?: React.CSSProperties
}

export const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  icon,
  count,
  defaultExpanded = false,
  children,
  onToggle,
  className = '',
  style
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded)

  const handleToggle = () => {
    const newExpanded = !expanded
    setExpanded(newExpanded)
    onToggle?.(newExpanded)
  }

  return (
    <div className={className} style={style}>
      <div
        onClick={handleToggle}
        style={{
          padding: '8px 12px',
          cursor: 'pointer',
          borderRadius: '6px',
          transition: 'background-color 0.2s',
          backgroundColor: expanded ? 'var(--qwanyx-bg-secondary)' : 'transparent'
        }}
        onMouseEnter={(e) => {
          if (!expanded) {
            e.currentTarget.style.backgroundColor = 'var(--qwanyx-bg-secondary)'
          }
        }}
        onMouseLeave={(e) => {
          if (!expanded) {
            e.currentTarget.style.backgroundColor = 'transparent'
          }
        }}
      >
        <Flex align="center" justify="between">
          <Flex align="center" gap="sm">
            <Icon 
              name={expanded ? 'ExpandMore' : 'ChevronRight'} 
              size="sm"
              style={{
                transition: 'transform 0.2s',
                transform: expanded ? 'rotate(0deg)' : 'rotate(0deg)'
              }}
            />
            {icon && (
              typeof icon === 'string' ? (
                <Text size="sm">{icon}</Text>
              ) : (
                icon
              )
            )}
            <Text weight="semibold" size="sm">{title}</Text>
          </Flex>
          {count !== undefined && (
            <Badge variant="subtle" size="sm">{count}</Badge>
          )}
        </Flex>
      </div>
      
      {expanded && (
        <div 
          style={{
            paddingLeft: '32px',
            paddingTop: '4px',
            paddingBottom: '8px',
            animation: 'slideDown 0.2s ease-out'
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

// CSS animation for smooth expand
const styles = `
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
`

// Add styles to document if not already present
if (typeof document !== 'undefined' && !document.getElementById('collapsible-styles')) {
  const styleSheet = document.createElement('style')
  styleSheet.id = 'collapsible-styles'
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}