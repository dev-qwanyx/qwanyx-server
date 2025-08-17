import React from 'react';
import { Icon } from './Icon';

export interface SpinnerProps {
  /**
   * Size of the spinner
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Color of the spinner (uses theme colors)
   */
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  /**
   * Type of spinner animation
   */
  type?: 'circle' | 'ring' | 'sync';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Accessibility label
   */
  label?: string;
}

const sizeClasses = {
  xs: 'qwanyx-w-3 qwanyx-h-3',
  sm: 'qwanyx-w-4 qwanyx-h-4',
  md: 'qwanyx-w-6 qwanyx-h-6',
  lg: 'qwanyx-w-8 qwanyx-h-8',
  xl: 'qwanyx-w-12 qwanyx-h-12',
};

const colorClasses = {
  primary: 'qwanyx-text-primary',
  secondary: 'qwanyx-text-secondary',
  accent: 'qwanyx-text-accent',
  success: 'qwanyx-text-success',
  warning: 'qwanyx-text-warning',
  error: 'qwanyx-text-error',
  info: 'qwanyx-text-info',
};

/**
 * Spinner component for loading states
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  type = 'circle',
  className = '',
  label = 'Loading...',
}) => {
  const baseClasses = `qwanyx-inline-block ${className}`;

  // Map spinner size to icon size
  const iconSizeMap = {
    xs: 'sm' as const,
    sm: 'md' as const,
    md: 'lg' as const,
    lg: 'xl' as const,
    xl: '2xl' as const,
  };

  if (type === 'ring') {
    // Use refresh icon for ring type (single clockwise arrow)
    return (
      <div className={baseClasses} role="status" aria-label={label}>
        <Icon 
          name="refresh" 
          size={iconSizeMap[size]} 
          color={color} 
          spin 
          variant="outlined"
        />
        <span className="qwanyx-sr-only">{label}</span>
      </div>
    );
  }

  if (type === 'sync') {
    // Use autorenew icon for sync type (double arrows, correctly oriented)
    return (
      <div className={baseClasses} role="status" aria-label={label}>
        <Icon 
          name="autorenew" 
          size={iconSizeMap[size]} 
          color={color} 
          spin 
          variant="outlined"
        />
        <span className="qwanyx-sr-only">{label}</span>
      </div>
    );
  }

  // Default circle spinner using progress_activity icon
  return (
    <div className={baseClasses} role="status" aria-label={label}>
      <Icon 
        name="progress_activity" 
        size={iconSizeMap[size]} 
        color={color} 
        spin 
        variant="outlined"
      />
      <span className="qwanyx-sr-only">{label}</span>
    </div>
  );
};

// Compound component for inline loading text
export interface SpinnerWithTextProps extends SpinnerProps {
  text?: string;
  textPosition?: 'left' | 'right';
}

export const SpinnerWithText: React.FC<SpinnerWithTextProps> = ({
  text = 'Loading...',
  textPosition = 'right',
  size = 'sm',
  ...spinnerProps
}) => {
  const textSizeClasses = {
    xs: 'qwanyx-text-xs',
    sm: 'qwanyx-text-sm',
    md: 'qwanyx-text-base',
    lg: 'qwanyx-text-lg',
    xl: 'qwanyx-text-xl',
  };

  return (
    <div className="qwanyx-inline-flex qwanyx-items-center qwanyx-gap-2">
      {textPosition === 'left' && <span className={textSizeClasses[size || 'sm']}>{text}</span>}
      <Spinner size={size} {...spinnerProps} />
      {textPosition === 'right' && <span className={textSizeClasses[size || 'sm']}>{text}</span>}
    </div>
  );
};