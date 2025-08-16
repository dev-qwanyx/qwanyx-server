import React from 'react';
import { Container } from './Container';

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  transparent?: boolean;
  bordered?: boolean;
}

export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(({
  children,
  fixed = false,
  transparent = false,
  bordered = true,
  className = '',
  ...props
}, ref) => {
  const combinedClassName = [
    'qwanyx-navbar',
    fixed && 'qwanyx-navbar--fixed',
    transparent && 'qwanyx-navbar--transparent',
    !bordered && 'qwanyx-navbar--borderless',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <nav ref={ref} className={combinedClassName} {...props}>
      {children}
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export interface NavbarBrandProps extends React.HTMLAttributes<HTMLDivElement> {}

export const NavbarBrand = React.forwardRef<HTMLDivElement, NavbarBrandProps>(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div ref={ref} className={`qwanyx-navbar__brand ${className}`} {...props}>
      {children}
    </div>
  );
});

NavbarBrand.displayName = 'NavbarBrand';

export interface NavbarLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: 'sm' | 'md' | 'lg';
}

export const NavbarLogo = React.forwardRef<HTMLImageElement, NavbarLogoProps>(({
  size = 'md',
  className = '',
  alt = 'Logo',
  ...props
}, ref) => {
  const combinedClassName = [
    'qwanyx-navbar__logo',
    `qwanyx-navbar__logo--${size}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <img 
      ref={ref} 
      className={combinedClassName}
      alt={alt}
      {...props}
    />
  );
});

NavbarLogo.displayName = 'NavbarLogo';

export interface NavbarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right';
}

export const NavbarContent = React.forwardRef<HTMLDivElement, NavbarContentProps>(({
  children,
  align = 'left',
  className = '',
  ...props
}, ref) => {
  const combinedClassName = [
    'qwanyx-navbar__content',
    `qwanyx-navbar__content--${align}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div 
      ref={ref}
      className={combinedClassName}
      {...props}
    >
      {children}
    </div>
  );
});

NavbarContent.displayName = 'NavbarContent';

export interface NavbarItemProps {
  children?: React.ReactNode;
  active?: boolean;
  as?: 'div' | 'a' | 'button';
  href?: string;
  className?: string;
  onClick?: () => void;
}

export const NavbarItem = React.forwardRef<HTMLDivElement, NavbarItemProps>(({
  children,
  active = false,
  as: Component = 'div',
  className = '',
  href,
  onClick
}, ref) => {
  const combinedClassName = [
    'qwanyx-navbar__item',
    active && 'qwanyx-navbar__item--active',
    className
  ].filter(Boolean).join(' ');
  
  if (Component === 'a' || href) {
    return (
      <a 
        ref={ref as any}
        className={combinedClassName}
        href={href}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
  
  if (Component === 'button') {
    return (
      <button
        ref={ref as any}
        className={combinedClassName}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
  
  return (
    <div
      ref={ref}
      className={combinedClassName}
      onClick={onClick}
    >
      {children}
    </div>
  );
});

NavbarItem.displayName = 'NavbarItem';

export interface NavbarMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  mobile?: boolean;
  open?: boolean;
}

export const NavbarMenu = React.forwardRef<HTMLDivElement, NavbarMenuProps>(({
  children,
  mobile = false,
  open = false,
  className = '',
  ...props
}, ref) => {
  const combinedClassName = [
    'qwanyx-navbar__menu',
    mobile ? 'qwanyx-navbar__menu--mobile' : 'qwanyx-navbar__menu--desktop',
    mobile && open && 'qwanyx-navbar__menu--open',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div
      ref={ref}
      className={combinedClassName}
      {...props}
    >
      {children}
    </div>
  );
});

NavbarMenu.displayName = 'NavbarMenu';

// Example usage component - shows how to compose a full navbar
export interface SimpleNavbarProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  title?: string;
  subtitle?: string;
  items?: Array<{
    label: string;
    href?: string;
    active?: boolean;
    onClick?: () => void;
  }>;
  actions?: React.ReactNode;
  fixed?: boolean;
  sticky?: boolean;
}

export const SimpleNavbar: React.FC<SimpleNavbarProps> = ({
  logo,
  title,
  subtitle,
  items = [],
  actions,
  fixed = false,
  sticky = true,
  className,
  style,
  ...props
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  const navbarClasses = [
    'qwanyx-navbar--simple',
    sticky && !fixed && 'qwanyx-navbar--sticky',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <Navbar fixed={fixed} className={navbarClasses} style={style} {...props}>
      <Container>
        <div className="qwanyx-navbar__container">
          {/* Left side: Brand and Menu */}
          <div className="qwanyx-navbar__left">
            {/* Brand Section */}
            <NavbarBrand>
              {logo}
              {(title || subtitle) && (
                <div>
                  {title && <div className="qwanyx-navbar__title">{title}</div>}
                  {subtitle && <div className="qwanyx-navbar__subtitle">{subtitle}</div>}
                </div>
              )}
            </NavbarBrand>
            
            {/* Desktop Menu */}
            <NavbarMenu>
              {items.map((item, index) => (
                <NavbarItem
                  key={index}
                  as="a"
                  href={item.href}
                  active={item.active}
                  onClick={item.onClick}
                >
                  {item.label}
                </NavbarItem>
              ))}
            </NavbarMenu>
          </div>
          
          {/* Right side: Actions */}
          {actions && (
            <div className="qwanyx-navbar__actions">
              {actions}
            </div>
          )}
          
          {/* Mobile Menu Button */}
          <button
            className="qwanyx-navbar__mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        <NavbarMenu mobile open={mobileMenuOpen}>
          {items.map((item, index) => (
            <NavbarItem
              key={index}
              as="a"
              href={item.href}
              active={item.active}
              onClick={() => {
                item.onClick?.()
                setMobileMenuOpen(false)
              }}
            >
              {item.label}
            </NavbarItem>
          ))}
          {actions && (
            <div className="qwanyx-navbar__mobile-actions">
              {actions}
            </div>
          )}
        </NavbarMenu>
      </Container>
    </Navbar>
  );
};