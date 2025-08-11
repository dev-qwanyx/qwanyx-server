import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost' | 'link';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
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
  className = '',
  disabled,
  ...props
}, ref) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-base focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Size classes
  const sizeClasses = {
    xs: 'text-xs px-2 py-1 rounded',
    sm: 'text-sm px-3 py-1.5 rounded',
    md: 'text-base px-4 py-2 rounded-md',
    lg: 'text-lg px-6 py-3 rounded-md',
    xl: 'text-xl px-8 py-4 rounded-lg'
  };
  
  // Variant classes
  const variantClasses = {
    solid: {
      primary: 'bg-primary text-white hover:bg-primary/90 active:bg-primary/80',
      secondary: 'bg-secondary text-white hover:bg-secondary/90 active:bg-secondary/80',
      accent: 'bg-accent text-white hover:bg-accent/90 active:bg-accent/80',
      success: 'bg-success text-white hover:bg-success/90 active:bg-success/80',
      warning: 'bg-warning text-white hover:bg-warning/90 active:bg-warning/80',
      error: 'bg-error text-white hover:bg-error/90 active:bg-error/80',
      info: 'bg-info text-white hover:bg-info/90 active:bg-info/80'
    },
    outline: {
      primary: 'border-2 border-primary text-primary hover:bg-primary/10 active:bg-primary/20',
      secondary: 'border-2 border-secondary text-secondary hover:bg-secondary/10 active:bg-secondary/20',
      accent: 'border-2 border-accent text-accent hover:bg-accent/10 active:bg-accent/20',
      success: 'border-2 border-success text-success hover:bg-success/10 active:bg-success/20',
      warning: 'border-2 border-warning text-warning hover:bg-warning/10 active:bg-warning/20',
      error: 'border-2 border-error text-error hover:bg-error/10 active:bg-error/20',
      info: 'border-2 border-info text-info hover:bg-info/10 active:bg-info/20'
    },
    ghost: {
      primary: 'text-primary hover:bg-primary/10 active:bg-primary/20',
      secondary: 'text-secondary hover:bg-secondary/10 active:bg-secondary/20',
      accent: 'text-accent hover:bg-accent/10 active:bg-accent/20',
      success: 'text-success hover:bg-success/10 active:bg-success/20',
      warning: 'text-warning hover:bg-warning/10 active:bg-warning/20',
      error: 'text-error hover:bg-error/10 active:bg-error/20',
      info: 'text-info hover:bg-info/10 active:bg-info/20'
    },
    link: {
      primary: 'text-primary hover:underline active:text-primary/80',
      secondary: 'text-secondary hover:underline active:text-secondary/80',
      accent: 'text-accent hover:underline active:text-accent/80',
      success: 'text-success hover:underline active:text-success/80',
      warning: 'text-warning hover:underline active:text-warning/80',
      error: 'text-error hover:underline active:text-error/80',
      info: 'text-info hover:underline active:text-info/80'
    }
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const combinedClassName = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant][color],
    widthClass,
    className
  ].filter(Boolean).join(' ');
  
  // Loading spinner
  const spinner = (
    <svg 
      className="animate-spin h-4 w-4" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
  
  return (
    <button
      ref={ref}
      className={combinedClassName}
      disabled={disabled || loading}
      {...props}
    >
      {loading && iconPosition === 'left' && (
        <span className="mr-2">{spinner}</span>
      )}
      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
      {loading && iconPosition === 'right' && (
        <span className="ml-2">{spinner}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';