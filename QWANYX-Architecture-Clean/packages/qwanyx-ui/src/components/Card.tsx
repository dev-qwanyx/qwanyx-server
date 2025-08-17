import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'outlined' | 'filled' | 'glass' | 'gradient' | 'neon';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hoverable?: boolean;
  clickable?: boolean;
  glowColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  blur?: boolean;
  animation?: 'none' | 'lift' | 'glow' | 'tilt' | 'morph';
}

// Add spin animation for neon cards
if (typeof document !== 'undefined' && !document.getElementById('card-spin-animation')) {
  const style = document.createElement('style');
  style.id = 'card-spin-animation';
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  children,
  variant = 'elevated',
  padding = 'md',
  hoverable = false,
  clickable = false,
  glowColor,
  gradientFrom,
  gradientTo,
  blur = false,
  animation = hoverable ? 'lift' : 'none',
  style,
  onMouseEnter,
  onMouseLeave,
  ...props
}, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({});
  
  // Padding sizes
  const paddings = {
    none: '0',
    sm: '12px',
    md: '20px',
    lg: '28px',
    xl: '36px'
  };
  
  // Base styles for all cards
  const baseStyles: React.CSSProperties = {
    borderRadius: 'var(--radius-lg)',
    position: 'relative',
    overflow: 'hidden',
    padding: paddings[padding],
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: clickable ? 'pointer' : 'default',
    transformStyle: 'preserve-3d',
    willChange: 'transform',
    ...style
  };
  
  // Variant-specific styles
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'glass':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: blur ? 'blur(10px)' : 'none',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: isHovered 
            ? '0 8px 32px rgba(31, 38, 135, 0.37)'
            : '0 4px 16px rgba(31, 38, 135, 0.2)',
        };
        
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${gradientFrom || 'rgb(var(--primary))'}, ${gradientTo || 'rgb(var(--accent))'})`,
          border: 'none',
          boxShadow: isHovered
            ? '0 20px 40px rgba(0, 0, 0, 0.3)'
            : '0 10px 20px rgba(0, 0, 0, 0.2)',
        };
        
      case 'neon':
        return {
          backgroundColor: 'rgb(var(--background))',
          border: `2px solid ${glowColor || 'rgb(var(--primary))'}`,
          boxShadow: isHovered
            ? `0 0 30px ${glowColor || 'rgb(var(--primary))'}, inset 0 0 20px ${glowColor || 'rgba(var(--primary), 0.1)'}`
            : `0 0 15px ${glowColor || 'rgba(var(--primary), 0.5)'}`,
        };
        
      case 'outlined':
        return {
          backgroundColor: 'rgb(var(--background))',
          border: '1px solid rgb(var(--border))',
          boxShadow: isHovered ? 'var(--shadow-md)' : 'none',
        };
        
      case 'filled':
        return {
          backgroundColor: 'rgb(var(--surface))',
          border: 'none',
          boxShadow: isHovered ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        };
        
      default: // elevated
        return {
          backgroundColor: 'rgb(var(--background))',
          border: 'none',
          boxShadow: isHovered
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        };
    }
  };
  
  // Animation transforms
  const getAnimationTransform = () => {
    if (!hoverable || animation === 'none') return {};
    
    switch (animation) {
      case 'lift':
        return isHovered ? { transform: 'translateY(-8px) scale(1.02)' } : {};
      case 'glow':
        return isHovered ? { transform: 'scale(1.03)' } : {};
      case 'tilt':
        return tiltStyle;
      case 'morph':
        return isHovered ? { 
          transform: 'scale(1.05) rotateX(5deg)',
          borderRadius: 'var(--radius-xl)'
        } : {};
      default:
        return {};
    }
  };
  
  // Handle mouse move for tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (animation !== 'tilt' || !hoverable) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
    });
  };
  
  const handleMouseEnterInternal = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    onMouseEnter?.(e);
  };
  
  const handleMouseLeaveInternal = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(false);
    if (animation === 'tilt') {
      setTiltStyle({});
    }
    onMouseLeave?.(e);
  };
  
  const cardContent = (
    <div
      ref={ref}
      style={{
        ...baseStyles,
        ...getVariantStyles(),
        ...getAnimationTransform(),
      }}
      onMouseEnter={handleMouseEnterInternal}
      onMouseLeave={handleMouseLeaveInternal}
      onMouseMove={handleMouseMove}
      {...props}
    >
      {/* Gradient overlay for glass effect */}
      {variant === 'glass' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)',
          pointerEvents: 'none',
        }} />
      )}
      
      {/* Animated border gradient for neon */}
      {variant === 'neon' && isHovered && (
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          background: `linear-gradient(45deg, ${glowColor || 'rgb(var(--primary))'}, transparent, ${glowColor || 'rgb(var(--primary))'})`,
          borderRadius: 'var(--radius-lg)',
          opacity: 0.8,
          animation: 'spin 3s linear infinite',
          pointerEvents: 'none',
          zIndex: -1,
        }} />
      )}
      
      {children}
    </div>
  );
  
  // Use framer-motion for smooth animations
  if (hoverable && animation !== 'none') {
    return (
      <motion.div
        whileHover={animation === 'lift' ? { y: -8, scale: 1.02 } : 
                   animation === 'glow' ? { scale: 1.03 } :
                   animation === 'morph' ? { scale: 1.05, rotateX: 5 } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {cardContent}
      </motion.div>
    );
  }
  
  return cardContent;
});

Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(({
  children,
  bordered = false,
  style,
  ...props
}, ref) => {
  return (
    <div 
      ref={ref}
      style={{
        padding: '20px 24px',
        borderBottom: bordered ? '1px solid rgb(var(--border))' : 'none',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(({
  children,
  as: Component = 'h3',
  size = 'lg',
  style,
  ...props
}, ref) => {
  const sizes = {
    sm: { fontSize: '14px', fontWeight: '600' },
    md: { fontSize: '16px', fontWeight: '600' },
    lg: { fontSize: '20px', fontWeight: '700' },
    xl: { fontSize: '24px', fontWeight: '700' }
  };
  
  return (
    <Component 
      ref={ref as any}
      style={{
        ...sizes[size],
        margin: 0,
        color: 'rgb(var(--text))',
        lineHeight: '1.4',
        ...style
      }}
      {...props}
    >
      {children}
    </Component>
  );
});

CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  color?: 'default' | 'muted' | 'secondary';
}

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(({
  children,
  color = 'muted',
  style,
  ...props
}, ref) => {
  const colors = {
    default: 'rgb(var(--text))',
    muted: 'rgb(var(--text-muted))',
    secondary: 'rgb(var(--text-secondary))'
  };
  
  return (
    <p 
      ref={ref}
      style={{
        fontSize: '14px',
        lineHeight: '1.6',
        color: colors[color],
        marginTop: '8px',
        margin: 0,
        ...style
      }}
      {...props}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = 'CardDescription';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(({
  children,
  noPadding = false,
  style,
  ...props
}, ref) => {
  return (
    <div 
      ref={ref}
      style={{
        padding: noPadding ? 0 : '20px 24px',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
});

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
  justify?: 'start' | 'center' | 'end' | 'between';
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(({
  children,
  bordered = false,
  justify = 'end',
  style,
  ...props
}, ref) => {
  const justifyContent = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between'
  };
  
  return (
    <div 
      ref={ref}
      style={{
        padding: '16px 24px',
        borderTop: bordered ? '1px solid rgb(var(--border))' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: justifyContent[justify],
        gap: '12px',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';

export interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: 'square' | '16/9' | '4/3' | '21/9';
  overlay?: boolean;
  overlayGradient?: string;
}

export const CardImage = React.forwardRef<HTMLImageElement, CardImageProps>(({
  aspectRatio = '16/9',
  overlay = false,
  overlayGradient,
  alt = '',
  style,
  ...props
}, ref) => {
  const aspectRatios = {
    'square': '100%',
    '16/9': '56.25%',
    '4/3': '75%',
    '21/9': '42.86%'
  };
  
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      paddingBottom: aspectRatios[aspectRatio],
      overflow: 'hidden',
      backgroundColor: 'rgb(var(--surface))'
    }}>
      <img 
        ref={ref}
        alt={alt}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          ...style
        }}
        {...props}
      />
      
      {overlay && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: overlayGradient || 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.5) 100%)',
          pointerEvents: 'none'
        }} />
      )}
    </div>
  );
});

CardImage.displayName = 'CardImage';