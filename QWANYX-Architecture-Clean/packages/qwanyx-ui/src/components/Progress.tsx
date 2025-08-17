import React from 'react';
import { Icon } from './Icon';

export interface ProgressProps {
  /**
   * Progress value (0-100)
   */
  value: number;
  /**
   * Size of the progress indicator
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Color of the progress indicator
   */
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  /**
   * Type of progress display
   */
  type?: 'circular' | 'bar' | 'dots';
  /**
   * Show percentage text
   */
  showPercent?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Accessibility label
   */
  label?: string;
}


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
 * Progress component for showing completion status
 */
export const Progress: React.FC<ProgressProps> = ({
  value,
  size = 'md',
  color = 'primary',
  type = 'circular',
  showPercent = false,
  className = '',
  label = 'Progress',
}) => {
  // Clamp value between 0 and 100
  const normalizedValue = Math.max(0, Math.min(100, value));
  
  // Map icon size
  const iconSizeMap = {
    xs: 'sm' as const,
    sm: 'md' as const,
    md: 'lg' as const,
    lg: 'xl' as const,
    xl: '2xl' as const,
  };

  if (type === 'circular') {
    // Determine which clock_loader icon to use based on value
    let iconName = 'clock_loader_10';
    if (normalizedValue === 0) {
      iconName = 'radio_button_unchecked'; // Empty circle for 0%
    } else if (normalizedValue === 100) {
      iconName = 'check_circle'; // Complete circle for 100%
    } else if (normalizedValue <= 10) {
      iconName = 'clock_loader_10';
    } else if (normalizedValue <= 20) {
      iconName = 'clock_loader_20';
    } else if (normalizedValue <= 30) {
      iconName = 'clock_loader_20'; // Using 20 for 30 as there's no 30
    } else if (normalizedValue <= 40) {
      iconName = 'clock_loader_40';
    } else if (normalizedValue <= 50) {
      iconName = 'clock_loader_40'; // Using 40 for 50
    } else if (normalizedValue <= 60) {
      iconName = 'clock_loader_60';
    } else if (normalizedValue <= 70) {
      iconName = 'clock_loader_60'; // Using 60 for 70
    } else if (normalizedValue <= 80) {
      iconName = 'clock_loader_80';
    } else if (normalizedValue <= 90) {
      iconName = 'clock_loader_90';
    } else {
      iconName = 'clock_loader_90'; // Using 90 for values > 90
    }

    return (
      <div className={`qwanyx-inline-flex qwanyx-items-center qwanyx-gap-2 ${className}`}>
        <div role="progressbar" aria-valuenow={normalizedValue} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
          <Icon 
            name={iconName}
            size={iconSizeMap[size]}
            color={color}
            variant="outlined"
          />
        </div>
        {showPercent && (
          <span className={`qwanyx-text-sm ${colorClasses[color]}`}>
            {normalizedValue}%
          </span>
        )}
      </div>
    );
  }

  if (type === 'dots') {
    const totalDots = 10;
    const filledDots = Math.round((normalizedValue / 100) * totalDots);
    
    return (
      <div 
        className={`qwanyx-inline-flex qwanyx-items-center qwanyx-gap-2 ${className}`}
        role="progressbar" 
        aria-valuenow={normalizedValue} 
        aria-valuemin={0} 
        aria-valuemax={100} 
        aria-label={label}
      >
        <div className="qwanyx-flex qwanyx-gap-1">
          {Array.from({ length: totalDots }).map((_, index) => (
            <div
              key={index}
              className={`qwanyx-w-2 qwanyx-h-2 qwanyx-rounded-full qwanyx-transition-colors ${
                index < filledDots 
                  ? `qwanyx-bg-current ${colorClasses[color]}` 
                  : 'qwanyx-bg-gray-300'
              }`}
            />
          ))}
        </div>
        {showPercent && (
          <span className={`qwanyx-text-sm ${colorClasses[color]}`}>
            {normalizedValue}%
          </span>
        )}
      </div>
    );
  }

  // Default bar progress
  return (
    <div className={`qwanyx-w-full ${className}`}>
      <div className="qwanyx-flex qwanyx-items-center qwanyx-gap-2">
        <div 
          className="qwanyx-flex-1 qwanyx-bg-gray-200 qwanyx-rounded-full qwanyx-h-2 qwanyx-overflow-hidden"
          role="progressbar" 
          aria-valuenow={normalizedValue} 
          aria-valuemin={0} 
          aria-valuemax={100} 
          aria-label={label}
        >
          <div 
            className={`qwanyx-h-full qwanyx-rounded-full qwanyx-transition-all qwanyx-duration-300 ${
              color === 'primary' ? 'qwanyx-bg-primary' :
              color === 'secondary' ? 'qwanyx-bg-secondary' :
              color === 'accent' ? 'qwanyx-bg-accent' :
              color === 'success' ? 'qwanyx-bg-success' :
              color === 'warning' ? 'qwanyx-bg-warning' :
              color === 'error' ? 'qwanyx-bg-error' :
              'qwanyx-bg-info'
            }`}
            style={{ width: `${normalizedValue}%` }}
          />
        </div>
        {showPercent && (
          <span className={`qwanyx-text-sm qwanyx-min-w-[3ch] ${colorClasses[color]}`}>
            {normalizedValue}%
          </span>
        )}
      </div>
    </div>
  );
};

// Compound component for progress with label
export interface ProgressWithLabelProps extends ProgressProps {
  label: string;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
}

export const ProgressWithLabel: React.FC<ProgressWithLabelProps> = ({
  label,
  labelPosition = 'top',
  ...progressProps
}) => {
  const labelClasses = 'qwanyx-text-sm qwanyx-text-gray-600';
  
  if (labelPosition === 'left' || labelPosition === 'right') {
    return (
      <div className="qwanyx-inline-flex qwanyx-items-center qwanyx-gap-3">
        {labelPosition === 'left' && <span className={labelClasses}>{label}</span>}
        <Progress {...progressProps} />
        {labelPosition === 'right' && <span className={labelClasses}>{label}</span>}
      </div>
    );
  }

  return (
    <div className="qwanyx-space-y-1">
      {labelPosition === 'top' && <div className={labelClasses}>{label}</div>}
      <Progress {...progressProps} />
      {labelPosition === 'bottom' && <div className={labelClasses}>{label}</div>}
    </div>
  );
};