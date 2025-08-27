import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'color'> {
  variant?: 'solid' | 'outline' | 'ghost' | 'link' | 'validate' | 'primary' | 'secondary' | 'tab' | 'pill' | 'segment' | 'nav';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  animationType?: 'default' | 'spring' | 'pop' | 'pulse' | 'shake' | 'none';
  isActive?: boolean; // For tab-like behaviors
  showRipple?: boolean; // Control ripple effect
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'solid',
  color = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  animationType = 'default',
  isActive = false,
  showRipple = true, // Ripple is ON by default
  style,
  disabled,
  ...props
}, ref) => {
  // Handle legacy variant values
  let actualVariant = variant;
  let actualColor = color;
  
  if (variant === 'primary') {
    actualVariant = 'solid';
    actualColor = 'primary';
  } else if (variant === 'secondary') {
    actualVariant = 'solid';
    actualColor = 'secondary';
  }
  
  // Size definitions
  const sizes = {
    xs: {
      padding: '6px 12px',
      fontSize: '12px',
      height: '28px',
      spinnerSize: '12px'
    },
    sm: {
      padding: '8px 16px',
      fontSize: '14px',
      height: '36px',
      spinnerSize: '14px'
    },
    md: {
      padding: '10px 20px',
      fontSize: '16px',
      height: '44px',
      spinnerSize: '16px'
    },
    lg: {
      padding: '12px 24px',
      fontSize: '18px',
      height: '52px',
      spinnerSize: '20px'
    },
    xl: {
      padding: '14px 28px',
      fontSize: '20px',
      height: '60px',
      spinnerSize: '24px'
    }
  };
  
  // Get variant styles using CSS variables
  const getVariantStyles = () => {
    const baseColor = `var(--${actualColor})`;
    
    switch (actualVariant) {
      case 'solid':
        return {
          backgroundColor: `rgb(${baseColor})`,
          color: 'white',
          border: 'none',
          boxShadow: 'var(--shadow)',
          ...(disabled && {
            backgroundColor: 'rgb(var(--border))',
            color: 'rgb(var(--text-muted))',
            cursor: 'not-allowed',
            boxShadow: 'none'
          })
        };
      
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: `rgb(${baseColor})`,
          border: `2px solid rgb(${baseColor})`,
          boxShadow: 'none',
          ...(disabled && {
            borderColor: 'rgb(var(--border))',
            color: 'rgb(var(--text-muted))',
            cursor: 'not-allowed'
          })
        };
      
      case 'ghost':
        return {
          backgroundColor: `rgb(${baseColor} / 0.1)`,
          color: `rgb(${baseColor})`,
          border: 'none',
          boxShadow: 'none',
          ...(disabled && {
            backgroundColor: 'rgb(var(--border) / 0.3)',
            color: 'rgb(var(--text-muted))',
            cursor: 'not-allowed'
          })
        };
      
      case 'link':
        return {
          backgroundColor: 'transparent',
          color: `rgb(${baseColor})`,
          border: 'none',
          textDecoration: 'underline',
          textUnderlineOffset: '4px',
          padding: '0',
          height: 'auto',
          boxShadow: 'none',
          ...(disabled && {
            color: 'rgb(var(--text-muted))',
            cursor: 'not-allowed'
          })
        };
      
      case 'validate':
        return {
          backgroundColor: 'rgb(var(--success))',
          color: 'white',
          border: 'none',
          boxShadow: 'var(--shadow-md)',
          ...(disabled && {
            backgroundColor: 'rgb(var(--border))',
            color: 'rgb(var(--text-muted))',
            cursor: 'not-allowed',
            boxShadow: 'none'
          })
        };
      
      case 'tab':
        return {
          backgroundColor: 'transparent',
          color: isActive ? `rgb(${baseColor})` : 'rgb(var(--text-secondary))',
          border: 'none',
          fontWeight: isActive ? 600 : 500,
          borderBottom: isActive ? `2px solid rgb(${baseColor})` : '2px solid transparent',
          marginBottom: '-2px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          ...(disabled && {
            color: 'rgb(var(--text-muted))',
            cursor: 'not-allowed'
          })
        };
      
      case 'pill':
        return {
          backgroundColor: isActive ? `rgb(${baseColor})` : 'rgb(var(--surface))',
          color: isActive ? 'white' : 'rgb(var(--text-secondary))',
          border: 'none',
          borderRadius: 'var(--radius-full)',
          boxShadow: isActive ? 'var(--shadow)' : 'none',
          transform: isActive ? 'scale(1.05)' : 'scale(1)',
          ...(disabled && {
            backgroundColor: 'rgb(var(--border))',
            color: 'rgb(var(--text-muted))',
            cursor: 'not-allowed'
          })
        };
      
      case 'segment':
        return {
          backgroundColor: isActive ? 'rgb(var(--background))' : 'transparent',
          color: isActive ? 'rgb(var(--text))' : 'rgb(var(--text-secondary))',
          border: 'none',
          boxShadow: isActive ? 'var(--shadow)' : 'none',
          ...(disabled && {
            color: 'rgb(var(--text-muted))',
            cursor: 'not-allowed'
          })
        };
      
      case 'nav':
        return {
          backgroundColor: isActive ? `rgb(${baseColor})` : 'transparent',
          color: isActive ? 'white' : 'rgb(var(--text-secondary))',
          border: 'none',
          boxShadow: isActive ? 'var(--shadow-md)' : 'none',
          transform: isActive && !disabled ? 'translateY(-2px)' : 'translateY(0)',
          ...(disabled && {
            color: 'rgb(var(--text-muted))',
            cursor: 'not-allowed'
          })
        };
      
      default:
        return {
          backgroundColor: `rgb(${baseColor})`,
          color: 'white',
          border: 'none',
          boxShadow: 'var(--shadow)'
        };
    }
  };
  
  // Build button styles - IMPORTANT: position and overflow must be set for ripple to work
  const buttonStyles = {
    ...(sizes[size as keyof typeof sizes] || sizes.md),
    ...getVariantStyles(),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: 'var(--radius)',
    fontWeight: 600,
    fontFamily: 'var(--font-sans)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.8 : 1,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative' as const,  // Required for ripple
    overflow: 'hidden' as const,     // Required for ripple
    outline: 'none',
    width: fullWidth ? '100%' : 'auto',
    letterSpacing: '0.025em',
    textTransform: 'none' as const,
    ...style
  };
  
  // Add hover styles via CSS
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      const styleId = 'qwanyx-button-hover-styles';
      if (!document.getElementById(styleId)) {
        const styleTag = document.createElement('style');
        styleTag.id = styleId;
        styleTag.textContent = `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes buttonRipple {
            from {
              transform: scale(0);
              opacity: 1;
            }
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
          
          /* Default hover - move the whole button */
          .qwanyx-button-hover:hover:not(:disabled) {
            transform: translateY(-1px);
            filter: brightness(1.1);
          }
          
          .qwanyx-button-hover:active:not(:disabled) {
            transform: translateY(0);
          }
          
          /* For tab and ghost variants - only move the inner content, not the button */
          .qwanyx-button-tab:hover:not(:disabled),
          .qwanyx-button-ghost:hover:not(:disabled) {
            background-color: rgba(var(--primary), 0.05);
            transform: none; /* Button stays still */
            filter: none;
          }
          
          /* Move only the inner span content on hover for tab/ghost variants */
          .qwanyx-button-tab:hover:not(:disabled) > span,
          .qwanyx-button-ghost:hover:not(:disabled) > span {
            transform: translateY(-1px);
          }
          
          .qwanyx-button-tab:active:not(:disabled) > span,
          .qwanyx-button-ghost:active:not(:disabled) > span {
            transform: translateY(0);
          }
          
          .qwanyx-button-pill:hover:not(:disabled) {
            transform: scale(1.05);
            filter: brightness(1.05);
          }
          
          .qwanyx-button-segment:hover:not(:disabled) {
            background-color: rgba(var(--primary), 0.08);
            transform: none;
          }
        `;
        document.head.appendChild(styleTag);
      }
    }
  }, []);
  
  // Animation variants
  const animationVariants = {
    default: {
      whileHover: { scale: 1.02, transition: { duration: 0.2 } },
      whileTap: { scale: 0.98 },
      transition: { type: "spring", stiffness: 400, damping: 17 }
    },
    spring: {
      whileHover: { 
        scale: 1.05,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      },
      whileTap: { scale: 0.95 }
    },
    pop: {
      whileHover: { 
        scale: [1, 1.2, 1.1],
        transition: { duration: 0.3 }
      },
      whileTap: { 
        scale: 0.9,
        rotate: [0, -5, 5, 0],
        transition: { duration: 0.2 }
      }
    },
    pulse: {
      whileHover: {
        scale: [1, 1.05, 1],
        transition: {
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse" as const
        }
      },
      whileTap: { scale: 0.95 }
    },
    shake: {
      whileHover: {
        rotate: [0, -2, 2, -2, 2, 0],
        transition: { duration: 0.4 }
      },
      whileTap: { scale: 0.95 }
    },
    none: {}
  };

  const currentAnimation = animationVariants[animationType as keyof typeof animationVariants] || animationVariants.default;
  
  // Loading spinner with inline styles
  const currentSize = sizes[size as keyof typeof sizes] || sizes.md;
  const spinner = (
    <span style={{
      display: 'inline-block',
      width: currentSize.spinnerSize,
      height: currentSize.spinnerSize,
      animation: 'spin 1s linear infinite'
    }}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
        style={{ width: '100%', height: '100%' }}
      >
        <circle 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="3"
          opacity="0.25"
        />
        <path 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </span>
  );
  
  // Add ripple effect on click
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Create ripple effect
    if (!disabled && !loading && showRipple) {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      
      // Create ripple element
      const ripple = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;
      
      // Calculate position
      const x = e.clientX - rect.left - radius;
      const y = e.clientY - rect.top - radius;
      
      // Determine ripple color based on variant
      let rippleColor = 'rgba(255, 255, 255, 0.6)'; // Default for solid buttons
      
      // For transparent/light background variants, use colored ripple
      if (actualVariant === 'tab') {
        rippleColor = isActive ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.4)';
      } else if (actualVariant === 'ghost') {
        rippleColor = 'rgba(59, 130, 246, 0.3)';
      } else if (actualVariant === 'link') {
        rippleColor = 'rgba(59, 130, 246, 0.3)';
      } else if (actualVariant === 'outline') {
        rippleColor = 'rgba(59, 130, 246, 0.3)';
      } else if (actualVariant === 'segment') {
        rippleColor = isActive ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.4)';
      } else if (actualVariant === 'pill') {
        rippleColor = isActive ? 'rgba(255, 255, 255, 0.6)' : 'rgba(59, 130, 246, 0.4)';
      } else if (actualVariant === 'nav') {
        rippleColor = isActive ? 'rgba(255, 255, 255, 0.6)' : 'rgba(59, 130, 246, 0.4)';
      }
      
      // Apply styles - use cssText for better browser compatibility
      ripple.style.cssText = `
        position: absolute;
        width: ${diameter}px;
        height: ${diameter}px;
        left: ${x}px;
        top: ${y}px;
        border-radius: 50%;
        background-color: ${rippleColor};
        transform: scale(0);
        pointer-events: none;
        z-index: 0;
      `;
      
      // Apply animation - try CSS first, fallback to Web Animations API
      ripple.style.animation = 'buttonRipple 600ms ease-out forwards';
      
      // If CSS animation doesn't work, use Web Animations API
      if (!ripple.style.animation) {
        ripple.animate([
          { transform: 'scale(0)', opacity: 1 },
          { transform: 'scale(4)', opacity: 0 }
        ], {
          duration: 600,
          easing: 'ease-out',
          fill: 'forwards'
        });
      }
      
      // Ensure button has proper positioning
      if (!button.style.position || button.style.position === 'static') {
        button.style.position = 'relative';
      }
      button.style.overflow = 'hidden';
      
      // Insert ripple as first child so it appears behind content
      button.insertBefore(ripple, button.firstChild);
      
      // Remove ripple after animation
      setTimeout(() => {
        if (ripple && ripple.parentNode) {
          ripple.remove();
        }
      }, 600);
    }
    
    // Call original onClick if provided
    if (props.onClick) {
      props.onClick(e as any);
    }
  };
  
  // Get button class name based on variant
  const getButtonClassName = () => {
    const classes = ['qwanyx-button-hover'];
    if (actualVariant === 'tab') classes.push('qwanyx-button-tab');
    if (actualVariant === 'ghost') classes.push('qwanyx-button-ghost');
    if (actualVariant === 'pill') classes.push('qwanyx-button-pill');
    if (actualVariant === 'segment') classes.push('qwanyx-button-segment');
    if (actualVariant === 'nav') classes.push('qwanyx-button-nav');
    return classes.join(' ');
  };
  
  return (
    <motion.button
      ref={ref}
      className={getButtonClassName()}
      style={buttonStyles}
      disabled={disabled || loading}
      {...currentAnimation}
      {...props}
      onClick={handleClick}  // IMPORTANT: onClick must come AFTER props spread
    >
      {/* Wrap content in a span with higher z-index to ensure it appears above ripple */}
      <span style={{ 
        position: 'relative', 
        zIndex: 1, 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '8px',
        transition: 'transform 0.2s ease' // Smooth animation for text movement
      }}>
        {loading && iconPosition === 'left' && spinner}
        {!loading && icon && iconPosition === 'left' && icon}
        {children as React.ReactNode}
        {!loading && icon && iconPosition === 'right' && icon}
        {loading && iconPosition === 'right' && spinner}
      </span>
    </motion.button>
  );
});

Button.displayName = 'Button';