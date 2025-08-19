import React from 'react'
import { Avatar } from '../components/Avatar'

export interface UserProfileProps {
  user: {
    name: string
    email?: string
    avatar?: string
    role?: string
  }
  size?: 'sm' | 'md' | 'lg'
  showEmail?: boolean
  showRole?: boolean
  showName?: boolean
  orientation?: 'horizontal' | 'vertical'
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  size = 'md',
  showEmail = true,
  showRole = false,
  showName = true,
  orientation = 'horizontal',
  className = '',
  style,
  onClick
}) => {
  const sizes = {
    sm: {
      avatar: 'sm',
      nameSize: '0.875rem',
      detailSize: '0.75rem',
      gap: '0.5rem',
      padding: '0.25rem'
    },
    md: {
      avatar: 'md',
      nameSize: '1rem',
      detailSize: '0.875rem',
      gap: '0.75rem',
      padding: '0.375rem'
    },
    lg: {
      avatar: 'lg',
      nameSize: '1.125rem',
      detailSize: '1rem',
      gap: '1rem',
      padding: '0.5rem'
    }
  }

  const currentSize = sizes[size]
  const secondaryText = showRole && user.role ? user.role : (showEmail && user.email ? user.email : null)

  const containerStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: currentSize.padding,
    borderRadius: '0.25rem',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'background-color 0.2s ease',
    flexDirection: orientation === 'vertical' ? 'column' : 'row',
    ...style
  }

  const textContainerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.125rem',
    minWidth: 0,
    textAlign: orientation === 'vertical' ? 'center' : 'left'
  }

  const nameStyles: React.CSSProperties = {
    fontSize: currentSize.nameSize,
    fontWeight: 'bold',
    color: 'rgb(var(--qwanyx-foreground))',
    lineHeight: 1.2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }

  const emailStyles: React.CSSProperties = {
    fontSize: currentSize.detailSize,
    color: 'rgb(var(--qwanyx-muted-foreground))',
    lineHeight: 1.2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }

  return (
    <div 
      className={className}
      style={containerStyles}
      onClick={onClick}
      onMouseEnter={onClick ? (e) => {
        e.currentTarget.style.backgroundColor = 'rgba(var(--qwanyx-primary-rgb), 0.05)'
      } : undefined}
      onMouseLeave={onClick ? (e) => {
        e.currentTarget.style.backgroundColor = 'transparent'
      } : undefined}
    >
      <Avatar
        src={user.avatar}
        alt={user.name}
        name={user.name}
        size={currentSize.avatar as any}
        fallback={user.name.charAt(0).toUpperCase()}
      />
      
      {showName && (
        <div style={textContainerStyles}>
          <div style={nameStyles}>
            {user.name}
          </div>
          
          {secondaryText && (
            <div style={emailStyles}>
              {secondaryText}
            </div>
          )}
        </div>
      )}
    </div>
  )
}