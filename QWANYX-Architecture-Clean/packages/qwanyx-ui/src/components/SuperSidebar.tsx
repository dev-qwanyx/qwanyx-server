import React, { useState } from 'react'
import { Icon } from './Icon'
import { Text } from './Text'
import { Button } from './Button'
import { Badge } from './Badge'

export interface SidebarItem {
  id: string
  label: string
  icon?: string
  href?: string
  onClick?: () => void
  badge?: string | number
  active?: boolean
  children?: SidebarItem[]
  disabled?: boolean
}

export interface SuperSidebarProps {
  items: SidebarItem[]
  logo?: React.ReactNode | string
  title?: string
  user?: {
    name: string
    email?: string
    avatar?: string
    role?: string
  }
  footer?: React.ReactNode
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
  width?: number | string
  collapsedWidth?: number | string
  position?: 'left' | 'right'
  theme?: 'light' | 'dark' | 'auto'
  className?: string
  style?: React.CSSProperties
  onLogout?: () => void
}

export const SuperSidebar: React.FC<SuperSidebarProps> = ({
  items,
  logo,
  title,
  user,
  footer,
  collapsed = false,
  onCollapse,
  width = 280,
  collapsedWidth = 80,
  position = 'left',
  theme = 'light',
  className = '',
  style,
  onLogout
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isCollapsed, setIsCollapsed] = useState(collapsed)

  const toggleCollapse = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    onCollapse?.(newState)
  }

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const sidebarWidth = isCollapsed ? collapsedWidth : width

  const sidebarStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    [position]: 0,
    bottom: 0,
    width: typeof sidebarWidth === 'number' ? `${sidebarWidth}px` : sidebarWidth,
    backgroundColor: theme === 'dark' ? 'rgb(31, 41, 55)' : 'rgb(255, 255, 255)',
    borderRight: position === 'left' ? '1px solid rgb(var(--qwanyx-border))' : 'none',
    borderLeft: position === 'right' ? '1px solid rgb(var(--qwanyx-border))' : 'none',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 40,
    ...style
  }

  const headerStyles: React.CSSProperties = {
    padding: '1.5rem',
    borderBottom: '1px solid rgb(var(--qwanyx-border))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '80px'
  }

  const logoContainerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    overflow: 'hidden'
  }

  const contentStyles: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '1rem'
  }

  const footerStyles: React.CSSProperties = {
    padding: '1.5rem',
    borderTop: '1px solid rgb(var(--qwanyx-border))',
    marginTop: 'auto'
  }

  const userStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 200ms ease',
    backgroundColor: 'transparent'
  }

  const avatarStyles: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgb(var(--qwanyx-primary))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    flexShrink: 0
  }

  const renderMenuItem = (item: SidebarItem, depth = 0): React.ReactNode => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.id)

    const itemStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: `0.75rem ${isCollapsed ? '0.5rem' : '1rem'}`,
      marginLeft: depth * (isCollapsed ? 0 : 16),
      borderRadius: '8px',
      cursor: item.disabled ? 'not-allowed' : 'pointer',
      transition: 'all 200ms ease',
      backgroundColor: item.active 
        ? 'rgba(var(--qwanyx-primary-rgb), 0.1)' 
        : 'transparent',
      color: item.active 
        ? 'rgb(var(--qwanyx-primary))' 
        : theme === 'dark' 
          ? 'rgb(229, 231, 235)' 
          : 'rgb(var(--qwanyx-foreground))',
      opacity: item.disabled ? 0.5 : 1,
      position: 'relative' as const,
      overflow: 'hidden'
    }

    const handleClick = () => {
      if (item.disabled) return
      
      if (hasChildren) {
        toggleExpanded(item.id)
      } else if (item.onClick) {
        item.onClick()
      } else if (item.href) {
        window.location.href = item.href
      }
    }

    return (
      <div key={item.id}>
        <div
          style={itemStyles}
          onClick={handleClick}
          onMouseEnter={(e) => {
            if (!item.disabled && !item.active) {
              e.currentTarget.style.backgroundColor = 'rgba(var(--qwanyx-primary-rgb), 0.05)'
            }
          }}
          onMouseLeave={(e) => {
            if (!item.active) {
              e.currentTarget.style.backgroundColor = 'transparent'
            }
          }}
        >
          {item.icon && (
            <Icon 
              name={item.icon} 
              size="md"
              style={{ flexShrink: 0 }}
            />
          )}
          
          {!isCollapsed && (
            <>
              <Text 
                size="sm" 
                weight={item.active ? 'semibold' : 'normal'}
                style={{ flex: 1 }}
              >
                {item.label}
              </Text>
              
              {item.badge && (
                <Badge size="sm" color="primary">
                  {item.badge}
                </Badge>
              )}
              
              {hasChildren && (
                <Icon 
                  name={isExpanded ? 'ExpandLess' : 'ExpandMore'}
                  size="sm"
                />
              )}
            </>
          )}
          
          {isCollapsed && item.badge && (
            <div style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'rgb(var(--qwanyx-primary))'
            }} />
          )}
        </div>
        
        {hasChildren && isExpanded && !isCollapsed && item.children && (
          <div style={{ marginTop: '0.25rem' }}>
            {item.children.map(child => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <aside className={className} style={sidebarStyles}>
      {/* Header */}
      <div style={headerStyles}>
        <div style={logoContainerStyles}>
          {logo && (
            typeof logo === 'string' ? (
              <img 
                src={logo} 
                alt={title || 'Logo'} 
                style={{ height: '40px', width: 'auto' }}
              />
            ) : logo
          )}
          {!isCollapsed && title && (
            <Text size="lg" weight="bold">
              {title}
            </Text>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCollapse}
          style={{ padding: '0.5rem' }}
        >
          <Icon 
            name={isCollapsed ? 'MenuOpen' : 'Menu'}
            size="md"
          />
        </Button>
      </div>

      {/* User Section */}
      {user && (
        <div style={{ padding: '1rem', borderBottom: '1px solid rgb(var(--qwanyx-border))' }}>
          <div 
            style={userStyles}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(var(--qwanyx-primary-rgb), 0.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <div style={avatarStyles}>
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            
            {!isCollapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <Text size="sm" weight="semibold" style={{ 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {user.name}
                </Text>
                {user.role && (
                  <Text size="xs" color="secondary" style={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {user.role}
                  </Text>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <div style={contentStyles}>
        {items.map(item => renderMenuItem(item))}
      </div>

      {/* Footer */}
      {footer && !isCollapsed && (
        <div style={footerStyles}>
          {footer}
        </div>
      )}

      {/* Logout Button */}
      {onLogout && (
        <div style={{ padding: '1rem' }}>
          <Button
            variant="ghost"
            fullWidth={!isCollapsed}
            onClick={onLogout}
            style={{ 
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              color: 'rgb(var(--qwanyx-destructive))'
            }}
          >
            <Icon name="Logout" size="md" />
            {!isCollapsed && (
              <Text size="sm" style={{ marginLeft: '0.75rem' }}>
                Déconnexion
              </Text>
            )}
          </Button>
        </div>
      )}
    </aside>
  )
}