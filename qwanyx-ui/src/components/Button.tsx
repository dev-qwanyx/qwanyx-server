import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'color'> {
  variant?: 'solid' | 'outline' | 'ghost' | 'link' | 'validate' | 'primary' | 'secondary';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  animationType?: 'default' | 'spring' | 'pop' | 'pulse' | 'shake' | 'none';
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
  className = '',
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
  
  // Build class names
  const classNames = [
    'qwanyx-button',
    `qwanyx-button--${actualVariant}`,
    `qwanyx-button--${size}`,
    `qwanyx-button--${actualColor}`,
    fullWidth && 'qwanyx-button--fullwidth',
    loading && 'qwanyx-button--loading',
    className
  ].filter(Boolean).join(' ');
  
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

  const currentAnimation = animationVariants[animationType] || animationVariants.default;
  
  // Loading spinner
  const spinner = (
    <span className={`qwanyx-spinner qwanyx-spinner--${size}`}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="qwanyx-spinner__track" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="qwanyx-spinner__path" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </span>
  );
  
  return (
    <motion.button
      ref={ref}
      className={classNames}
      disabled={disabled || loading}
      {...currentAnimation}
      {...props}
    >
      {loading && iconPosition === 'left' && (
        <span className="qwanyx-button__icon qwanyx-button__icon--left">{spinner}</span>
      )}
      {!loading && icon && iconPosition === 'left' && (
        <span className="qwanyx-button__icon qwanyx-button__icon--left">{icon}</span>
      )}
      {children as React.ReactNode}
      {!loading && icon && iconPosition === 'right' && (
        <span className="qwanyx-button__icon qwanyx-button__icon--right">{icon}</span>
      )}
      {loading && iconPosition === 'right' && (
        <span className="qwanyx-button__icon qwanyx-button__icon--right">{spinner}</span>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';