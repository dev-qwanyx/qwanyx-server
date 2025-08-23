import React from 'react'
import { Flex, Text, Button } from '@qwanyx/ui'

export interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
  active?: boolean
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: string | React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  style?: React.CSSProperties
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = '/',
  size = 'sm',
  style
}) => {
  const fontSize = size === 'sm' ? '13px' : size === 'md' ? '14px' : '16px'
  const padding = size === 'sm' ? '4px 8px' : size === 'md' ? '6px 10px' : '8px 12px'
  const textSize = size === 'md' ? 'base' : size // 'sm' and 'lg' are valid, but 'md' needs to be 'base'
  
  return (
    <Flex align="center" gap="sm" style={style}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <Text 
              size={textSize as any} 
              style={{ 
                color: 'var(--qwanyx-text-tertiary)',
                margin: '0 4px'
              }}
            >
              {separator}
            </Text>
          )}
          
          {item.active ? (
            <Text 
              size={textSize as any} 
              weight="semibold" 
              style={{ 
                color: 'var(--qwanyx-primary)',
                fontSize
              }}
            >
              {item.label}
            </Text>
          ) : (item.href || item.onClick) ? (
            <Button
              variant="ghost"
              size={size}
              onClick={() => {
                if (item.onClick) {
                  item.onClick()
                } else if (item.href) {
                  window.location.href = item.href
                }
              }}
              style={{ 
                padding,
                fontSize,
                color: 'var(--qwanyx-text-secondary)',
                minWidth: 'auto',
                height: 'auto'
              }}
            >
              {item.label}
            </Button>
          ) : (
            <Text 
              size={textSize as any} 
              style={{ 
                color: 'var(--qwanyx-text-secondary)',
                fontSize
              }}
            >
              {item.label}
            </Text>
          )}
        </React.Fragment>
      ))}
    </Flex>
  )
}