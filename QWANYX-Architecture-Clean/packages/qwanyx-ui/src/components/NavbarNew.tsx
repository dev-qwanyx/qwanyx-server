/**
 * 🎯 Navbar Component - Modern navigation bar
 * Combines Logo, Navigation, Search, and User actions
 */

import React, { useState, useEffect } from 'react';
import { Container } from './Container';
import { Logo } from './Logo';
import { SearchBar } from './SearchBar';
import { Button } from './Button';

export interface NavbarMenuItem {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  badge?: string | number;
}

export interface NavbarUser {
  name: string;
  email?: string;
  avatar?: string;
  initials?: string;
}

export interface NavbarProps {
  // Logo
  logo?: {
    src?: string;
    text?: string;
    href?: string;
  };
  
  // Navigation
  menuItems?: NavbarMenuItem[];
  
  // Search
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  
  // User
  user?: NavbarUser | null;
  onLogin?: () => void;
  onRegister?: () => void;
  onLogout?: () => void;
  onProfileClick?: () => void;
  
  // Behavior
  sticky?: boolean;
  transparent?: boolean;
  blur?: boolean;
  hideOnScroll?: boolean;
  
  // Style
  variant?: 'default' | 'dark' | 'light' | 'transparent';
  height?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export const NavbarNew: React.FC<NavbarProps> = ({
  logo = { text: 'QWANYX' },
  menuItems = [],
  showSearch = false,
  searchPlaceholder = 'Search...',
  onSearch,
  user = null,
  onLogin,
  onRegister,
  onLogout,
  onProfileClick,
  sticky = true,
  transparent = false,
  blur = true,
  hideOnScroll = false,
  variant = 'default',
  height = 'md',
  className = '',
  style = {}
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsScrolled(currentScrollY > 10);
      
      if (hideOnScroll) {
        setIsHidden(currentScrollY > lastScrollY && currentScrollY > 100);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, hideOnScroll]);

  const heightMap = {
    sm: '56px',
    md: '64px',
    lg: '72px'
  };

  const variantStyles = {
    default: {
      backgroundColor: transparent && !isScrolled 
        ? 'transparent' 
        : 'rgb(var(--background))',
      borderBottom: '1px solid rgb(var(--border))',
      color: 'rgb(var(--foreground))'
    },
    dark: {
      backgroundColor: transparent && !isScrolled 
        ? 'transparent' 
        : 'rgb(var(--foreground))',
      borderBottom: '1px solid rgb(var(--foreground) / 0.1)',
      color: 'rgb(var(--background))'
    },
    light: {
      backgroundColor: transparent && !isScrolled 
        ? 'transparent' 
        : 'white',
      borderBottom: '1px solid rgb(var(--border))',
      color: 'rgb(var(--foreground))'
    },
    transparent: {
      backgroundColor: 'transparent',
      borderBottom: 'none',
      color: 'rgb(var(--foreground))'
    }
  };

  const navbarStyle: React.CSSProperties = {
    position: sticky ? 'sticky' : 'relative',
    top: 0,
    left: 0,
    right: 0,
    height: heightMap[height],
    zIndex: 40,
    transition: 'all 300ms ease',
    transform: isHidden ? 'translateY(-100%)' : 'translateY(0)',
    ...variantStyles[variant],
    ...(blur && isScrolled && {
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)'
    }),
    ...style
  };

  const containerStyle: React.CSSProperties = {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '2rem'
  };

  const navStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    flex: 1
  };

  const menuStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    listStyle: 'none',
    margin: 0,
    padding: 0
  };

  const menuItemStyle = (active?: boolean): React.CSSProperties => ({
    padding: '0.5rem 1rem',
    borderRadius: 'var(--radius)',
    color: active ? 'rgb(var(--primary))' : 'inherit',
    textDecoration: 'none',
    fontWeight: active ? 500 : 400,
    transition: 'all var(--transition)',
    cursor: 'pointer',
    position: 'relative' as const
  });

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  };

  const userMenuStyle: React.CSSProperties = {
    position: 'relative'
  };

  const userButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.25rem 0.75rem',
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'rgb(var(--muted) / 0.1)',
    border: 'none',
    color: 'inherit',
    cursor: 'pointer',
    transition: 'all var(--transition)'
  };

  const avatarStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgb(var(--primary))',
    color: 'rgb(var(--primary-foreground))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    fontWeight: 600
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 0.5rem)',
    right: 0,
    minWidth: '200px',
    backgroundColor: 'rgb(var(--background))',
    border: '1px solid rgb(var(--border))',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow-lg)',
    padding: '0.5rem',
    zIndex: 50
  };

  const mobileMenuButtonStyle: React.CSSProperties = {
    display: 'none',
    padding: '0.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'inherit',
    cursor: 'pointer'
  };

  // Mobile menu styles
  const mobileMenuStyle: React.CSSProperties = {
    display: mobileMenuOpen ? 'block' : 'none',
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'rgb(var(--background))',
    borderBottom: '1px solid rgb(var(--border))',
    padding: '1rem'
  };

  return (
    <>
      <nav className={`qwanyx-navbar ${className}`.trim()} style={navbarStyle}>
        <Container style={containerStyle}>
          {/* Logo */}
          {logo && (
            <Logo 
              src={logo.src}
              text={logo.text}
              href={logo.href}
              size={height === 'sm' ? 'sm' : height === 'lg' ? 'lg' : 'md'}
            />
          )}

          {/* Desktop Navigation */}
          <nav style={navStyle} className="qwanyx-navbar__nav desktop-only">
            {/* Menu Items */}
            {menuItems.length > 0 && (
              <ul style={menuStyle}>
                {menuItems.map((item, index) => (
                  <li key={index}>
                    {item.href ? (
                      <a 
                        href={item.href}
                        style={menuItemStyle(item.active)}
                        className="qwanyx-navbar__menu-item"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgb(var(--muted) / 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        {item.label}
                        {item.badge && (
                          <span style={{
                            position: 'absolute',
                            top: '0',
                            right: '0',
                            backgroundColor: 'rgb(var(--primary))',
                            color: 'rgb(var(--primary-foreground))',
                            fontSize: '0.625rem',
                            padding: '0.125rem 0.375rem',
                            borderRadius: 'var(--radius-full)',
                            transform: 'translate(25%, -25%)'
                          }}>
                            {item.badge}
                          </span>
                        )}
                      </a>
                    ) : (
                      <button 
                        onClick={item.onClick}
                        style={menuItemStyle(item.active)}
                        className="qwanyx-navbar__menu-item"
                      >
                        {item.label}
                        {item.badge && (
                          <span style={{
                            position: 'absolute',
                            top: '0',
                            right: '0',
                            backgroundColor: 'rgb(var(--primary))',
                            color: 'rgb(var(--primary-foreground))',
                            fontSize: '0.625rem',
                            padding: '0.125rem 0.375rem',
                            borderRadius: 'var(--radius-full)',
                            transform: 'translate(25%, -25%)'
                          }}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* Search */}
            {showSearch && (
              <div style={{ flex: 1, maxWidth: '400px' }}>
                <SearchBar
                  placeholder={searchPlaceholder}
                  onSubmit={onSearch}
                  size={height === 'sm' ? 'sm' : height === 'lg' ? 'lg' : 'md'}
                  variant="filled"
                />
              </div>
            )}
          </nav>

          {/* Actions */}
          <div style={actionsStyle}>
            {/* User Menu or Auth Buttons */}
            {user ? (
              <div style={userMenuStyle}>
                <button
                  style={userButtonStyle}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="qwanyx-navbar__user-button"
                >
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      style={{ ...avatarStyle, padding: 0 }}
                    />
                  ) : (
                    <div style={avatarStyle}>
                      {user.initials || user.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span style={{ display: 'none' }} className="desktop-only">
                    {user.name}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div style={dropdownStyle} className="qwanyx-navbar__dropdown">
                    <button
                      onClick={() => {
                        onProfileClick?.();
                        setShowUserMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.5rem 1rem',
                        textAlign: 'left',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        transition: 'background-color var(--transition)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgb(var(--muted) / 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      Profile
                    </button>
                    <hr style={{ 
                      margin: '0.5rem 0', 
                      border: 'none', 
                      borderTop: '1px solid rgb(var(--border))' 
                    }} />
                    <button
                      onClick={() => {
                        onLogout?.();
                        setShowUserMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.5rem 1rem',
                        textAlign: 'left',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        color: 'rgb(var(--error))',
                        cursor: 'pointer',
                        transition: 'background-color var(--transition)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgb(var(--error) / 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {onLogin && (
                  <Button 
                    onClick={onLogin}
                    variant="ghost"
                    size={height === 'sm' ? 'sm' : height === 'lg' ? 'lg' : 'md'}
                  >
                    Login
                  </Button>
                )}
                {onRegister && (
                  <Button 
                    onClick={onRegister}
                    variant="primary"
                    size={height === 'sm' ? 'sm' : height === 'lg' ? 'lg' : 'md'}
                  >
                    Register
                  </Button>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              style={mobileMenuButtonStyle}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="qwanyx-navbar__mobile-menu mobile-only"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" strokeWidth="2" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </Container>
      </nav>

      {/* Mobile Menu */}
      <div style={mobileMenuStyle} className="qwanyx-navbar__mobile-menu">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            onClick={item.onClick}
            style={{
              display: 'block',
              padding: '0.75rem',
              color: item.active ? 'rgb(var(--primary))' : 'inherit',
              textDecoration: 'none'
            }}
          >
            {item.label}
          </a>
        ))}
        {showSearch && (
          <div style={{ marginTop: '1rem' }}>
            <SearchBar
              placeholder={searchPlaceholder}
              onSubmit={onSearch}
              size="md"
              variant="filled"
            />
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
        }
      ` }} />
    </>
  );
};