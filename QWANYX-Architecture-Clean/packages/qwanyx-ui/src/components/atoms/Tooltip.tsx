import React, { useState } from 'react'
import { Icon } from '../Icon'

export interface TooltipProps {
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  icon?: string
  delay?: number
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top',
  icon,
  delay = 200 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    setTimeoutId(id)
  }

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    setIsVisible(false)
  }

  const positionStyles = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%) translateY(-8px)',
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%) translateY(8px)',
    },
    left: {
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%) translateX(-8px)',
    },
    right: {
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%) translateX(8px)',
    },
  }

  const arrowStyles = {
    top: {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      borderColor: 'rgba(0, 0, 0, 0.9) transparent transparent transparent',
    },
    bottom: {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      borderColor: 'transparent transparent rgba(0, 0, 0, 0.9) transparent',
    },
    left: {
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      borderColor: 'transparent transparent transparent rgba(0, 0, 0, 0.9)',
    },
    right: {
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      borderColor: 'transparent rgba(0, 0, 0, 0.9) transparent transparent',
    },
  }

  return (
    <div 
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          style={{
            position: 'absolute',
            ...positionStyles[position],
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            opacity: 1,
            transition: 'opacity 0.2s ease-in-out',
          }}
        >
          {icon && <Icon name={icon} size="sm" style={{ fontSize: '16px' }} />}
          {content}
          <div
            style={{
              position: 'absolute',
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: '4px',
              ...arrowStyles[position],
            }}
          />
        </div>
      )}
    </div>
  )
}