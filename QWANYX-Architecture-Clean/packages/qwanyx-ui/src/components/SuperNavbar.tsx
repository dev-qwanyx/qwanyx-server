import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Icon } from './Icon';
import { Text } from './Text';
import { Badge } from './Badge';
import { Avatar } from './Avatar';

// Types
export interface SuperNavbarMenuItem {
  label?: string;  // Made optional to support dividers
  href?: string;
  onClick?: () => void;
  icon?: string;
  badge?: string | number;
  children?: SuperNavbarMenuItem[];
  description?: string;
  divider?: boolean;
  active?: boolean;
}

export interface SuperNavbarProps {
  // Brand
  logo?: string | React.ReactNode;
  title?: string;
  subtitle?: string;
  onLogoClick?: () => void;
  
  // Navigation
  items?: SuperNavbarMenuItem[];
  
  // Search
  search?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  searchExpanded?: boolean;
  
  // User
  user?: {
    name: string;
    email?: string;
    avatar?: string;
    role?: string;
  };
  userMenuItems?: SuperNavbarMenuItem[];
  onLogout?: () => void;
  
  // Notifications
  notifications?: Array<{
    id: string;
    title: string;
    description?: string;
    time?: string;
    read?: boolean;
    icon?: string;
    type?: 'info' | 'success' | 'warning' | 'error';
  }>;
  notificationCount?: number;
  onNotificationClick?: (id: string) => void;
  onNotificationsClear?: () => void;
  
  // Actions
  actions?: React.ReactNode;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: string;
  };
  
  // Behavior
  variant?: 'default' | 'minimal' | 'centered' | 'dashboard' | 'landing';
  position?: 'static' | 'fixed' | 'sticky' | 'absolute';
  transparent?: boolean;
  blur?: boolean;
  bordered?: boolean;
  elevated?: boolean;
  hideOnScroll?: boolean;
  
  // Mobile
  mobileBreakpoint?: number;
  mobileMenuType?: 'drawer' | 'fullscreen' | 'dropdown';
  
  // Theming
  dark?: boolean;
  color?: 'primary' | 'secondary' | 'accent' | string;
  height?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const SuperNavbar: React.FC<SuperNavbarProps> = ({
  // Brand
  logo,
  title,
  subtitle,
  onLogoClick,
  
  // Navigation
  items = [],
  
  // Search
  search = false,
  searchPlaceholder = "Search...",
  onSearch,
  searchExpanded = false,
  
  // User
  user,
  userMenuItems = [],
  onLogout,
  
  // Notifications
  notifications = [],
  notificationCount = 0,
  onNotificationClick,
  onNotificationsClear,
  
  // Actions
  actions,
  primaryAction,
  
  // Behavior
  variant = 'default',
  position = 'sticky',
  transparent = false,
  blur = false,
  bordered = false,
  elevated = false,
  hideOnScroll = false,
  
  // Mobile
  mobileBreakpoint = 768,
  mobileMenuType = 'drawer',
  
  // Theming
  // dark = false,
  // color = undefined,
  height = '64px',
  className = '',
  style = {},
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(searchExpanded);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  
  const navRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const lastScrollY = useRef(0);
  
  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [mobileBreakpoint]);
  
  // Handle scroll behavior
  useEffect(() => {
    if (position !== 'fixed' && position !== 'sticky') return;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Handle transparency on scroll
      setScrolled(currentScrollY > 10);
      
      // Handle hide on scroll
      if (hideOnScroll) {
        if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
          setHidden(true);
        } else {
          setHidden(false);
        }
        lastScrollY.current = currentScrollY;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [position, hideOnScroll]);
  
  // Handle search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };
  
  // Handle dropdowns
  const handleDropdownToggle = (menuId: string) => {
    setActiveDropdown(activeDropdown === menuId ? null : menuId);
  };
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
        setIsUserMenuOpen(false);
        setIsNotificationsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Render dropdown menu
  const renderDropdownMenu = (items: SuperNavbarMenuItem[], parentId: string) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div 
        className="super-navbar__dropdown"
        style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          backgroundColor: 'rgb(var(--background))',
          border: '1px solid rgb(var(--border))',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-lg)',
          minWidth: '200px',
          padding: '0.5rem 0',
          zIndex: 1000,
          opacity: activeDropdown === parentId ? 1 : 0,
          visibility: activeDropdown === parentId ? 'visible' : 'hidden',
          transform: activeDropdown === parentId ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'all 0.2s ease',
        }}
      >
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {item.divider ? (
              <div style={{
                height: '1px',
                backgroundColor: 'rgb(var(--border))',
                margin: '0.5rem 0',
              }} />
            ) : (
              <button
                onClick={() => {
                  if (item.onClick) item.onClick();
                  if (item.href) window.location.href = item.href;
                  setActiveDropdown(null);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '0.5rem 1rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.2s',
                  color: 'rgb(var(--text))',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgb(var(--accent) / 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {item.icon && <Icon name={item.icon} size="sm" />}
                <div style={{ flex: 1 }}>
                  <Text size="sm" weight="medium">{item.label}</Text>
                  {item.description && (
                    <Text size="xs" color="muted">{item.description}</Text>
                  )}
                </div>
                {item.badge && (
                  <Badge variant="subtle" size="sm">{item.badge}</Badge>
                )}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };
  
  // Render notifications dropdown
  const renderNotifications = () => {
    if (!isNotificationsOpen) return null;
    
    return (
      <div
        className="super-navbar__notifications"
        style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          backgroundColor: 'rgb(var(--background))',
          border: '1px solid rgb(var(--border))',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-lg)',
          width: '360px',
          maxHeight: '400px',
          zIndex: 1000,
          opacity: isNotificationsOpen ? 1 : 0,
          visibility: isNotificationsOpen ? 'visible' : 'hidden',
          transform: isNotificationsOpen ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{
          padding: '1rem',
          borderBottom: '1px solid rgb(var(--border))',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Text weight="semibold">Notifications</Text>
          {notifications.length > 0 && (
            <Button
              size="xs"
              variant="ghost"
              onClick={onNotificationsClear}
            >
              Clear all
            </Button>
          )}
        </div>
        
        <div style={{
          maxHeight: '320px',
          overflowY: 'auto',
        }}>
          {notifications.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <Icon name="notifications_none" size="xl" color="muted" />
              <Text size="sm" color="muted" style={{ marginTop: '0.5rem' }}>
                No new notifications
              </Text>
            </div>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => {
                  if (onNotificationClick) onNotificationClick(notification.id);
                  setIsNotificationsOpen(false);
                }}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: notification.read ? 'transparent' : 'rgb(var(--primary) / 0.05)',
                  border: 'none',
                  borderBottom: '1px solid rgb(var(--border))',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgb(var(--accent) / 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = notification.read ? 'transparent' : 'rgb(var(--primary) / 0.05)';
                }}
              >
                {notification.icon && (
                  <Icon 
                    name={notification.icon} 
                    size="sm"
                    color={notification.type || 'primary'}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <Text size="sm" weight="medium">{notification.title}</Text>
                  {notification.description && (
                    <Text size="xs" color="muted">{notification.description}</Text>
                  )}
                  {notification.time && (
                    <Text size="xs" color="muted" style={{ marginTop: '0.25rem' }}>
                      {notification.time}
                    </Text>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    );
  };
  
  // Calculate navbar styles
  const navbarStyles: React.CSSProperties = {
    position,
    top: hidden ? `-${height}` : 0,
    left: 0,
    right: 0,
    height,
    backgroundColor: transparent && !scrolled 
      ? `rgba(${getComputedStyle(document.documentElement).getPropertyValue('--background').trim()}, 0.85)` 
      : blur 
        ? `rgba(${getComputedStyle(document.documentElement).getPropertyValue('--background').trim()}, 0.98)`
        : 'rgb(var(--background))',
    backdropFilter: blur ? 'blur(10px)' : 'none',
    borderBottom: bordered ? '1px solid rgb(var(--border))' : 'none',
    boxShadow: elevated || scrolled ? 'var(--shadow)' : 'none',
    transition: 'all 0.3s ease',
    zIndex: 999,
    ...style,
  };
  
  return (
    <nav 
      ref={navRef}
      className={`super-navbar super-navbar--${variant} ${className}`}
      style={navbarStyles}
    >
      <div style={{ 
        height: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          gap: '2rem',
        }}>
          {/* Logo/Brand */}
          <div 
            className="super-navbar__brand"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              cursor: onLogoClick ? 'pointer' : 'default',
            }}
            onClick={onLogoClick}
          >
            {logo && (
              typeof logo === 'string' ? (
                <img 
                  src={logo} 
                  alt={title || 'Logo'} 
                  style={{ height: '40px' }}
                />
              ) : logo
            )}
            {(title || subtitle) && (
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}>
                {title && (
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'rgb(var(--text))',
                    lineHeight: '1.2'
                  }}>{title}</span>
                )}
                {subtitle && (
                  <span style={{
                    fontSize: '11px',
                    color: 'rgb(var(--muted))',
                    lineHeight: '1.2'
                  }}>{subtitle}</span>
                )}
              </div>
            )}
          </div>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <div 
              className="super-navbar__nav"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flex: 1,
                justifyContent: 'center',
                minHeight: '40px',
              }}
            >
              {items && items.length > 0 ? items.map((item, index) => (
                <div 
                  key={index}
                  style={{ position: 'relative' }}
                >
                  <button
                    className="super-navbar__item"
                    onClick={() => {
                      if (item.children) {
                        handleDropdownToggle(`nav-${index}`);
                      } else {
                        setActiveItemIndex(index);
                        if (item.onClick) {
                          item.onClick();
                        } else if (item.href) {
                          window.location.href = item.href;
                        }
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: activeItemIndex === index ? 'rgb(var(--primary) / 0.1)' : 'transparent',
                      border: 'none',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                      color: activeItemIndex === index ? 'rgb(var(--primary))' : 'rgb(var(--text))',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = activeItemIndex === index ? 'rgb(var(--primary) / 0.15)' : 'rgb(var(--accent) / 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = activeItemIndex === index ? 'rgb(var(--primary) / 0.1)' : 'transparent';
                    }}
                  >
                    {item.icon && <Icon name={item.icon} size="sm" />}
                    {item.label && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
                    {item.badge && (
                      <Badge size="xs" variant="solid" color="primary">
                        {item.badge}
                      </Badge>
                    )}
                    {item.children && (
                      <Icon name="expand_more" size="sm" />
                    )}
                  </button>
                  
                  {item.children && renderDropdownMenu(item.children, `nav-${index}`)}
                </div>
              )) : (
                <span style={{ color: 'rgb(var(--muted))' }}>No navigation items</span>
              )}
            </div>
          )}
          
          {/* Actions */}
          <div 
            className="super-navbar__actions"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
            }}
          >
            {/* Search */}
            {search && (
              <div style={{ position: 'relative' }}>
                {isSearchOpen ? (
                  <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                    <Input
                      ref={searchInputRef}
                      type="search"
                      placeholder={searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ width: isMobile ? '150px' : '250px', height: '32px', fontSize: '14px' }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                    >
                      <Icon name="close" size="sm" />
                    </Button>
                  </form>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsSearchOpen(true);
                      setTimeout(() => searchInputRef.current?.focus(), 100);
                    }}
                  >
                    <Icon name="search" size="sm" />
                  </Button>
                )}
              </div>
            )}
            
            {/* Notifications */}
            {notifications && (
              <div style={{ position: 'relative' }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  style={{ position: 'relative' }}
                >
                  <Icon name="notifications" size="sm" />
                  {notificationCount > 0 && (
                    <Badge
                      size="xs"
                      variant="solid"
                      color="error"
                      style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                      }}
                    >
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </Badge>
                  )}
                </Button>
                {renderNotifications()}
              </div>
            )}
            
            {/* Custom Actions */}
            {actions}
            
            {/* Primary Action */}
            {primaryAction && !isMobile && (
              <Button
                variant="primary"
                size="sm"
                onClick={primaryAction.onClick}
              >
                {primaryAction.icon && <Icon name={primaryAction.icon} size="sm" />}
                {primaryAction.label}
              </Button>
            )}
            
            {/* User Menu */}
            {user && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.5rem 0.75rem',
                    minWidth: '180px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgb(var(--accent) / 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Avatar
                    src={user.avatar}
                    name={user.name}
                    size="sm"
                  />
                  {!isMobile && (
                    <div style={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      textAlign: 'left',
                      minWidth: '0',
                      flex: '1 1 auto'
                    }}>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: 'rgb(var(--text))',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: 'block',
                        width: '100%'
                      }}>{user.name}</span>
                      {user.role && (
                        <span style={{
                          fontSize: '12px',
                          color: 'rgb(var(--muted))',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'block',
                          width: '100%'
                        }}>{user.role}</span>
                      )}
                    </div>
                  )}
                  <Icon name="expand_more" size="sm" />
                </button>
                
                {isUserMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      backgroundColor: 'rgb(var(--background))',
                      border: '1px solid rgb(var(--border))',
                      borderRadius: 'var(--radius)',
                      boxShadow: 'var(--shadow-lg)',
                      minWidth: '200px',
                      padding: '0.5rem 0',
                      zIndex: 1000,
                      marginTop: '0.5rem',
                    }}
                  >
                    {user.email && (
                      <>
                        <div style={{ padding: '0.5rem 1rem' }}>
                          <Text size="sm" weight="medium">{user.name}</Text>
                          <Text size="xs" color="muted">{user.email}</Text>
                        </div>
                        <div style={{
                          height: '1px',
                          backgroundColor: 'rgb(var(--border))',
                          margin: '0.5rem 0',
                        }} />
                      </>
                    )}
                    
                    {userMenuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (item.onClick) item.onClick();
                          if (item.href) window.location.href = item.href;
                          setIsUserMenuOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          width: '100%',
                          padding: '0.5rem 1rem',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background-color 0.2s',
                          color: 'rgb(var(--text))',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgb(var(--accent) / 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        {item.icon && <Icon name={item.icon} size="sm" />}
                        <Text size="sm">{item.label}</Text>
                      </button>
                    ))}
                    
                    {onLogout && (
                      <>
                        <div style={{
                          height: '1px',
                          backgroundColor: 'rgb(var(--border))',
                          margin: '0.5rem 0',
                        }} />
                        <button
                          onClick={() => {
                            onLogout();
                            setIsUserMenuOpen(false);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            width: '100%',
                            padding: '0.5rem 1rem',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'background-color 0.2s',
                            color: 'rgb(var(--error))',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgb(var(--error) / 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <Icon name="logout" size="sm" color="error" />
                          <Text size="sm" color="error">Logout</Text>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Mobile Menu Toggle */}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Icon name={isMobileMenuOpen ? 'close' : 'menu'} size="sm" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="super-navbar__mobile-menu"
          style={{
            position: mobileMenuType === 'fullscreen' ? 'fixed' : 'absolute',
            top: mobileMenuType === 'fullscreen' ? 0 : '100%',
            left: 0,
            right: 0,
            bottom: mobileMenuType === 'fullscreen' ? 0 : 'auto',
            backgroundColor: 'rgb(var(--background))',
            borderTop: '1px solid rgb(var(--border))',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 998,
            maxHeight: mobileMenuType === 'dropdown' ? '70vh' : 'auto',
            overflowY: 'auto',
            padding: '1rem',
          }}
        >
          {mobileMenuType === 'fullscreen' && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid rgb(var(--border))',
            }}>
              <Text size="lg" weight="bold">{title}</Text>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon name="close" size="sm" />
              </Button>
            </div>
          )}
          
          {/* Mobile Navigation Items */}
          <div style={{ marginBottom: '1rem' }}>
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveItemIndex(index);
                  if (item.onClick) item.onClick();
                  if (item.href) window.location.href = item.href;
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: activeItemIndex === index ? 'rgb(var(--primary) / 0.1)' : 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.2s',
                  color: activeItemIndex === index ? 'rgb(var(--primary))' : 'rgb(var(--text))',
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgb(var(--accent) / 0.1)';
                }}
                onTouchEnd={(e) => {
                  setTimeout(() => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }, 100);
                }}
              >
                {item.icon && <Icon name={item.icon} size="sm" />}
                <Text size="sm" weight="medium">{item.label}</Text>
                {item.badge && (
                  <Badge size="xs" variant="solid" color="primary" style={{ marginLeft: 'auto' }}>
                    {item.badge}
                  </Badge>
                )}
              </button>
            ))}
          </div>
          
          {/* Mobile Primary Action */}
          {primaryAction && (
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                primaryAction.onClick();
                setIsMobileMenuOpen(false);
              }}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {primaryAction.icon && <Icon name={primaryAction.icon} size="sm" />}
              {primaryAction.label}
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

SuperNavbar.displayName = 'SuperNavbar';