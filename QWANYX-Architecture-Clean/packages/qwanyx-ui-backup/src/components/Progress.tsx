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


// Color mappings are now handled in the Icon component and inline styles

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

    const circularColors = {
      primary: 'rgb(59 130 246)',
      secondary: 'rgb(168 85 247)',
      accent: 'rgb(34 197 94)',
      success: 'rgb(34 197 94)',
      warning: 'rgb(250 204 21)',
      error: 'rgb(239 68 68)',
      info: 'rgb(59 130 246)',
    };

    return (
      <div className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <div role="progressbar" aria-valuenow={normalizedValue} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
          <Icon 
            name={iconName}
            size={iconSizeMap[size]}
            color={color}
            variant="outlined"
          />
        </div>
        {showPercent && (
          <span style={{ fontSize: '14px', color: circularColors[color] }}>
            {normalizedValue}%
          </span>
        )}
      </div>
    );
  }

  if (type === 'dots') {
    const totalDots = 10;
    const filledDots = Math.round((normalizedValue / 100) * totalDots);
    
    const dotColors = {
      primary: 'rgb(59 130 246)',
      secondary: 'rgb(168 85 247)',
      accent: 'rgb(34 197 94)',
      success: 'rgb(34 197 94)',
      warning: 'rgb(250 204 21)',
      error: 'rgb(239 68 68)',
      info: 'rgb(59 130 246)',
    };

    return (
      <div 
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
        }}
        role="progressbar" 
        aria-valuenow={normalizedValue} 
        aria-valuemin={0} 
        aria-valuemax={100} 
        aria-label={label}
      >
        <div style={{ display: 'flex', gap: '4px' }}>
          {Array.from({ length: totalDots }).map((_, index) => (
            <div
              key={index}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: index < filledDots ? dotColors[color] : 'rgb(209 213 219)',
                transition: 'background-color 300ms',
              }}
            />
          ))}
        </div>
        {showPercent && (
          <span style={{ fontSize: '14px', color: dotColors[color] }}>
            {normalizedValue}%
          </span>
        )}
      </div>
    );
  }

  // Default bar progress
  const barColors = {
    primary: 'rgb(59 130 246)',
    secondary: 'rgb(168 85 247)',
    accent: 'rgb(34 197 94)',
    success: 'rgb(34 197 94)',
    warning: 'rgb(250 204 21)',
    error: 'rgb(239 68 68)',
    info: 'rgb(59 130 246)',
  };

  return (
    <div className={className} style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div 
          style={{
            flex: 1,
            backgroundColor: 'rgb(229 231 235)',
            borderRadius: '9999px',
            height: '8px',
            overflow: 'hidden',
          }}
          role="progressbar" 
          aria-valuenow={normalizedValue} 
          aria-valuemin={0} 
          aria-valuemax={100} 
          aria-label={label}
        >
          <div 
            style={{
              height: '100%',
              borderRadius: '9999px',
              backgroundColor: barColors[color],
              width: `${normalizedValue}%`,
              transition: 'width 300ms ease',
            }}
          />
        </div>
        {showPercent && (
          <span style={{ 
            fontSize: '14px', 
            minWidth: '3ch',
            color: barColors[color]
          }}>
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