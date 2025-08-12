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
  // Build class names
  const classNames = [
    'qwanyx-button',
    `qwanyx-button--${variant}`,
    `qwanyx-button--${size}`,
    `qwanyx-button--${color}`,
    fullWidth && 'qwanyx-button--fullwidth',
    loading && 'qwanyx-button--loading',
    className
  ].filter(Boolean).join(' ');
  
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
    <button
      ref={ref}
      className={classNames}
      disabled={disabled || loading}
      {...props}
    >
      {loading && iconPosition === 'left' && (
        <span className="qwanyx-button__icon qwanyx-button__icon--left">{spinner}</span>
      )}
      {!loading && icon && iconPosition === 'left' && (
        <span className="qwanyx-button__icon qwanyx-button__icon--left">{icon}</span>
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <span className="qwanyx-button__icon qwanyx-button__icon--right">{icon}</span>
      )}
      {loading && iconPosition === 'right' && (
        <span className="qwanyx-button__icon qwanyx-button__icon--right">{spinner}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';