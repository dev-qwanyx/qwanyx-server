import React from 'react';
import { motion } from 'framer-motion';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  smoothScroll?: boolean | 'smooth' | 'auto';
  scrollOffset?: number;
  animated?: boolean;
  hoverScale?: number;
  hoverColor?: string;
  activeColor?: string;
  underline?: boolean | 'hover' | 'always' | 'never';
  variant?: 'default' | 'nav' | 'footer';
  children: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({
  href,
  smoothScroll = true,
  scrollOffset = 0,
  animated = true,
  hoverScale = 1.02,
  hoverColor,
  activeColor,
  underline = 'hover',
  variant = 'default',
  onClick,
  className = '',
  style = {},
  children,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Handle smooth scrolling for hash links
    if (href?.startsWith('#') && smoothScroll) {
      e.preventDefault();
      const targetId = href.slice(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const y = targetElement.getBoundingClientRect().top + window.pageYOffset + scrollOffset;
        window.scrollTo({
          top: y,
          behavior: smoothScroll === true || smoothScroll === 'smooth' ? 'smooth' : 'auto'
        });
      }
    }
    
    // Call original onClick if provided
    onClick?.(e);
  };

  const getUnderlineStyle = () => {
    switch (underline) {
      case 'always':
        return 'underline';
      case 'never':
        return 'no-underline';
      case 'hover':
        return 'no-underline hover:underline';
      default:
        return underline ? 'underline' : 'no-underline';
    }
  };

  const variantClasses = {
    default: 'text-current transition-colors duration-300',
    nav: 'font-medium transition-all duration-300',
    footer: 'text-sm opacity-80 hover:opacity-100 transition-opacity duration-300'
  };

  const baseClasses = `
    ${variantClasses[variant]}
    ${getUnderlineStyle()}
    ${className}
  `.trim();

  if (animated) {
    // Remove conflicting event handlers that have different signatures in framer-motion
    const { 
      onDrag, 
      onDragEnd, 
      onDragStart,
      onAnimationStart,
      onAnimationEnd,
      onAnimationIteration,
      ...safeProps 
    } = props;
    
    return (
      <motion.a
        href={href}
        onClick={handleClick}
        className={baseClasses}
        whileHover={{
          scale: hoverScale,
          color: hoverColor
        }}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 20
        }}
        style={{
          ...style,
          display: 'inline-block',
          cursor: 'pointer'
        }}
        {...safeProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={baseClasses}
      style={{
        ...style,
        ...(hoverColor && { '--hover-color': hoverColor } as any)
      }}
      {...props}
    >
      {children}
    </a>
  );
};

// NavLink specifically for navigation menus
export interface NavLinkProps extends LinkProps {
  active?: boolean;
}

export const NavLink: React.FC<NavLinkProps> = ({
  active = false,
  className = '',
  activeColor = 'var(--qwanyx-primary)',
  ...props
}) => {
  const navClasses = `
    ${className}
    ${active ? 'font-semibold' : ''}
  `.trim();

  return (
    <Link
      variant="nav"
      className={navClasses}
      style={{
        ...(active && { color: activeColor }),
        ...props.style
      }}
      {...props}
    />
  );
};

// Export for convenience
export default Link;