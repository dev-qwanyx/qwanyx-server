import React, { useState, useEffect, useRef } from 'react';
import { Container } from './Container';

// Types
export interface NavItem {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
  children?: NavItem[];
}

export interface NavigationBarProps {
  // Brand
  logo?: React.ReactNode;
  title?: string;
  subtitle?: string;
  onBrandClick?: () => void;

  // Navigation
  items?: NavItem[];
  
  // Actions
  actions?: React.ReactNode;
  search?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  
  // Behavior
  variant?: 'default' | 'minimal' | 'centered' | 'full';
  position?: 'static' | 'fixed' | 'sticky';
  transparent?: boolean;
  bordered?: boolean;
  elevated?: boolean;
  
  // Mobile
  mobileBreakpoint?: number;
  mobileMenuType?: 'drawer' | 'fullscreen' | 'dropdown';
  
  // Styling
  height?: string;
  backgroundColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  logo,
  title,
  subtitle,
  onBrandClick,
  items = [],
  actions,
  search = false,
  searchPlaceholder = 'Search...',
  onSearch,
  variant = 'default',
  position = 'sticky',
  transparent = false,
  bordered = true,
  elevated = false,
  mobileBreakpoint = 768,
  mobileMenuType = 'drawer',
  height = '64px',
  backgroundColor,
  className = '',
  style,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= mobileBreakpoint);
      if (window.innerWidth > mobileBreakpoint) {
        setMobileMenuOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [mobileBreakpoint]);

  // Handle scroll for transparent navbar
  useEffect(() => {
    if (transparent && position !== 'static') {
      const handleScroll = () => {
        setScrolled(window.scrollY > 10);
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [transparent, position]);

  // Focus search when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen && mobileMenuType === 'fullscreen') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, mobileMenuType]);

  // Navbar styles
  const navbarStyles: React.CSSProperties = {
    position: position as any,
    top: position === 'fixed' || position === 'sticky' ? 0 : undefined,
    left: 0,
    right: 0,
    height: height,
    backgroundColor: transparent && !scrolled 
      ? 'transparent' 
      : backgroundColor || 'rgb(var(--background))',
    borderBottom: bordered ? '1px solid rgb(var(--border))' : 'none',
    boxShadow: elevated || scrolled 
      ? '0 2px 8px rgba(0, 0, 0, 0.08)' 
      : 'none',
    transition: 'all 0.3s ease',
    zIndex: 1000,
    ...style,
  };

  // Container styles based on variant
  const getContainerStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'minimal':
        return {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          padding: '0 20px',
        };
      case 'centered':
        return {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '0 20px',
          position: 'relative' as const,
        };
      case 'full':
        return {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          padding: '0',
        };
      default:
        return {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          padding: '0 20px',
        };
    }
  };

  // Render brand section
  const renderBrand = () => (
    <div 
      onClick={onBrandClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: onBrandClick ? 'pointer' : 'default',
      }}
    >
      {logo}
      {(title || subtitle) && (
        <div>
          {title && (
            <div style={{
              fontSize: '18px',
              fontWeight: 600,
              color: transparent && !scrolled ? 'white' : 'rgb(var(--text))',
            }}>
              {title}
            </div>
          )}
          {subtitle && (
            <div style={{
              fontSize: '12px',
              color: transparent && !scrolled 
                ? 'rgba(255, 255, 255, 0.8)' 
                : 'rgb(var(--text-muted))',
            }}>
              {subtitle}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Render desktop navigation
  const renderDesktopNav = () => (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      height: '100%',
    }}>
      {items.map((item, index) => (
        <NavItemDesktop 
          key={index} 
          item={item} 
          transparent={transparent && !scrolled}
        />
      ))}
    </nav>
  );

  // Render search
  const renderSearch = () => {
    if (!search) return null;
    
    return searchOpen ? (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '0 12px',
        backgroundColor: 'rgba(var(--surface), 0.5)',
        backdropFilter: 'blur(10px)',
        borderRadius: 'var(--radius)',
        height: '40px',
      }}>
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onSearch) {
              onSearch(searchQuery);
            }
            if (e.key === 'Escape') {
              setSearchOpen(false);
              setSearchQuery('');
            }
          }}
          placeholder={searchPlaceholder}
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            width: '200px',
            color: 'rgb(var(--text))',
          }}
        />
        <button
          onClick={() => {
            setSearchOpen(false);
            setSearchQuery('');
          }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'rgb(var(--text-muted))',
            padding: '4px',
          }}
        >
          ✕
        </button>
      </div>
    ) : (
      <button
        onClick={() => setSearchOpen(true)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          color: transparent && !scrolled ? 'white' : 'rgb(var(--text))',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </button>
    );
  };

  // Render mobile menu button
  const renderMobileMenuButton = () => (
    <button
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        color: transparent && !scrolled ? 'white' : 'rgb(var(--text))',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {mobileMenuOpen ? (
          <path d="M6 18L18 6M6 6l12 12" />
        ) : (
          <>
            <path d="M3 12h18" />
            <path d="M3 6h18" />
            <path d="M3 18h18" />
          </>
        )}
      </svg>
      <span style={{ fontSize: '14px', fontWeight: 500 }}>
        {mobileMenuOpen ? 'Close' : 'Menu'}
      </span>
    </button>
  );

  return (
    <>
      <header style={navbarStyles} className={className}>
        <Container size={variant === 'full' ? 'full' : '2xl'}>
          <div style={getContainerStyles()}>
            {/* Left section */}
            {variant === 'centered' ? (
              <>
                <div style={{ position: 'absolute', left: 20 }}>
                  {renderBrand()}
                </div>
                {!isMobile && renderDesktopNav()}
                <div style={{ position: 'absolute', right: 20, display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {!isMobile && renderSearch()}
                  {!isMobile && actions}
                  {isMobile && renderMobileMenuButton()}
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                  {renderBrand()}
                  {!isMobile && variant !== 'minimal' && renderDesktopNav()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {!isMobile && renderSearch()}
                  {!isMobile && actions}
                  {isMobile && renderMobileMenuButton()}
                </div>
              </>
            )}
          </div>
        </Container>
      </header>

      {/* Mobile Menu */}
      {isMobile && (
        <MobileMenu
          isOpen={mobileMenuOpen}
          type={mobileMenuType}
          items={items}
          actions={actions}
          onClose={() => setMobileMenuOpen(false)}
          search={search}
          searchPlaceholder={searchPlaceholder}
          onSearch={onSearch}
        />
      )}
    </>
  );
};

// Desktop Navigation Item Component
const NavItemDesktop: React.FC<{ 
  item: NavItem; 
  transparent?: boolean;
}> = ({ item, transparent }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  const itemStyles: React.CSSProperties = {
    position: 'relative',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  };

  const linkStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    borderRadius: 'var(--radius)',
    color: item.active 
      ? 'rgb(var(--primary))' 
      : transparent 
        ? 'white' 
        : 'rgb(var(--text))',
    backgroundColor: item.active 
      ? 'rgba(var(--primary), 0.1)' 
      : 'transparent',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: item.active ? 600 : 500,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
  };

  const handleClick = () => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      window.location.href = item.href;
    }
  };

  return (
    <div 
      style={itemStyles}
      onMouseEnter={item.children ? handleMouseEnter : undefined}
      onMouseLeave={item.children ? handleMouseLeave : undefined}
    >
      <button
        onClick={handleClick}
        style={linkStyles}
        onMouseEnter={(e) => {
          if (!item.active) {
            e.currentTarget.style.backgroundColor = 'rgba(var(--accent), 0.08)';
          }
        }}
        onMouseLeave={(e) => {
          if (!item.active) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        {item.icon}
        {item.label}
        {item.badge && (
          <span style={{
            padding: '2px 6px',
            borderRadius: '12px',
            backgroundColor: 'rgb(var(--primary))',
            color: 'white',
            fontSize: '10px',
            fontWeight: 600,
          }}>
            {item.badge}
          </span>
        )}
        {item.children && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </button>

      {/* Dropdown Menu */}
      {item.children && showDropdown && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          minWidth: '200px',
          backgroundColor: 'rgb(var(--background))',
          border: '1px solid rgb(var(--border))',
          borderRadius: 'var(--radius)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '8px',
          marginTop: '4px',
          zIndex: 1001,
        }}>
          {item.children.map((child, index) => (
            <button
              key={index}
              onClick={() => {
                if (child.onClick) child.onClick();
                else if (child.href) window.location.href = child.href;
                setShowDropdown(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '8px 12px',
                border: 'none',
                background: 'none',
                borderRadius: 'var(--radius-sm)',
                color: 'rgb(var(--text))',
                fontSize: '14px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(var(--accent), 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {child.icon}
              {child.label}
              {child.badge && (
                <span style={{
                  marginLeft: 'auto',
                  padding: '2px 6px',
                  borderRadius: '12px',
                  backgroundColor: 'rgb(var(--primary))',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 600,
                }}>
                  {child.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Mobile Menu Component
const MobileMenu: React.FC<{
  isOpen: boolean;
  type: 'drawer' | 'fullscreen' | 'dropdown';
  items: NavItem[];
  actions?: React.ReactNode;
  onClose: () => void;
  search?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
}> = ({ isOpen, type, items, actions, onClose, search, searchPlaceholder, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  if (!isOpen) return null;

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const menuStyles: React.CSSProperties = {
    position: 'fixed',
    top: type === 'dropdown' ? '64px' : 0,
    left: type === 'drawer' ? 0 : 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgb(var(--background))',
    zIndex: 999,
    overflowY: 'auto',
    transform: type === 'drawer' ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : undefined,
    transition: 'transform 0.3s ease',
    width: type === 'drawer' ? '280px' : '100%',
    boxShadow: type === 'drawer' ? '2px 0 8px rgba(0, 0, 0, 0.1)' : undefined,
  };

  return (
    <>
      {/* Overlay for drawer */}
      {type === 'drawer' && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? 'auto' : 'none',
            transition: 'opacity 0.3s ease',
          }}
        />
      )}

      <div style={menuStyles}>
        <div style={{ padding: '20px' }}>
          {/* Search in mobile */}
          {search && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              backgroundColor: 'rgb(var(--surface))',
              borderRadius: 'var(--radius)',
              marginBottom: '20px',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && onSearch) {
                    onSearch(searchQuery);
                    onClose();
                  }
                }}
                placeholder={searchPlaceholder}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  flex: 1,
                  color: 'rgb(var(--text))',
                }}
              />
            </div>
          )}

          {/* Navigation items */}
          <nav style={{ marginBottom: '20px' }}>
            {items.map((item, index) => (
              <div key={index} style={{ marginBottom: '4px' }}>
                <button
                  onClick={() => {
                    if (item.children) {
                      toggleExpanded(index);
                    } else {
                      if (item.onClick) item.onClick();
                      else if (item.href) window.location.href = item.href;
                      onClose();
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    background: item.active ? 'rgba(var(--primary), 0.1)' : 'none',
                    borderRadius: 'var(--radius)',
                    color: item.active ? 'rgb(var(--primary))' : 'rgb(var(--text))',
                    fontSize: '15px',
                    fontWeight: item.active ? 600 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {item.icon}
                    {item.label}
                    {item.badge && (
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: '12px',
                        backgroundColor: 'rgb(var(--primary))',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: 600,
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </span>
                  {item.children && (
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      style={{
                        transform: expandedItems.includes(index) ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.2s ease',
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  )}
                </button>

                {/* Submenu */}
                {item.children && expandedItems.includes(index) && (
                  <div style={{ paddingLeft: '20px', marginTop: '4px' }}>
                    {item.children.map((child, childIndex) => (
                      <button
                        key={childIndex}
                        onClick={() => {
                          if (child.onClick) child.onClick();
                          else if (child.href) window.location.href = child.href;
                          onClose();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          width: '100%',
                          padding: '10px 16px',
                          border: 'none',
                          background: 'none',
                          borderRadius: 'var(--radius)',
                          color: 'rgb(var(--text-muted))',
                          fontSize: '14px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {child.icon}
                        {child.label}
                        {child.badge && (
                          <span style={{
                            marginLeft: 'auto',
                            padding: '2px 6px',
                            borderRadius: '12px',
                            backgroundColor: 'rgb(var(--accent))',
                            color: 'white',
                            fontSize: '10px',
                            fontWeight: 600,
                          }}>
                            {child.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          {actions && (
            <div style={{
              paddingTop: '20px',
              borderTop: '1px solid rgb(var(--border))',
            }}>
              {actions}
            </div>
          )}
        </div>
      </div>
    </>
  );
};