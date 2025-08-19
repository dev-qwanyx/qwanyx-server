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

// Size and color mappings are now handled in the Icon component

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