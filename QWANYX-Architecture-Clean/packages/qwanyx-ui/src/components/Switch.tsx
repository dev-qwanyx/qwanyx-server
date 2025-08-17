import React from 'react';

export interface SwitchProps {
  /**
   * Whether the switch is checked
   */
  checked?: boolean;
  /**
   * Default checked state (for uncontrolled component)
   */
  defaultChecked?: boolean;
  /**
   * Callback when switch state changes
   */
  onChange?: (checked: boolean) => void;
  /**
   * Whether the switch is disabled
   */
  disabled?: boolean;
  /**
   * Size of the switch
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Color when checked
   */
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  /**
   * Label text for the switch
   */
  label?: string;
  /**
   * Position of the label
   */
  labelPosition?: 'left' | 'right';
  /**
   * Name attribute for form submission
   */
  name?: string;
  /**
   * Value attribute for form submission
   */
  value?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Required field
   */
  required?: boolean;
}

const sizeClasses = {
  xs: {
    track: 'qwanyx-w-6 qwanyx-h-3',
    thumb: 'qwanyx-w-2 qwanyx-h-2',
    translate: 'qwanyx-translate-x-3',
  },
  sm: {
    track: 'qwanyx-w-8 qwanyx-h-4',
    thumb: 'qwanyx-w-3 qwanyx-h-3',
    translate: 'qwanyx-translate-x-4',
  },
  md: {
    track: 'qwanyx-w-11 qwanyx-h-6',
    thumb: 'qwanyx-w-5 qwanyx-h-5',
    translate: 'qwanyx-translate-x-5',
  },
  lg: {
    track: 'qwanyx-w-14 qwanyx-h-7',
    thumb: 'qwanyx-w-6 qwanyx-h-6',
    translate: 'qwanyx-translate-x-7',
  },
  xl: {
    track: 'qwanyx-w-16 qwanyx-h-8',
    thumb: 'qwanyx-w-7 qwanyx-h-7',
    translate: 'qwanyx-translate-x-8',
  },
};

const colorClasses = {
  primary: 'qwanyx-bg-primary',
  secondary: 'qwanyx-bg-secondary',
  accent: 'qwanyx-bg-accent',
  success: 'qwanyx-bg-success',
  warning: 'qwanyx-bg-warning',
  error: 'qwanyx-bg-error',
  info: 'qwanyx-bg-info',
};

/**
 * Switch component for binary choices
 */
export const Switch: React.FC<SwitchProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = 'md',
  color = 'primary',
  label,
  labelPosition = 'right',
  name,
  value,
  className = '',
  required = false,
}) => {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  
  // Determine if component is controlled
  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : internalChecked;

  const handleToggle = () => {
    if (disabled) return;
    
    const newChecked = !isChecked;
    
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    
    onChange?.(newChecked);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  const switchElement = (
    <>
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        aria-label={label || 'Toggle switch'}
        aria-required={required}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`
          qwanyx-relative qwanyx-inline-flex qwanyx-shrink-0 qwanyx-cursor-pointer
          qwanyx-rounded-full qwanyx-border-2 qwanyx-border-transparent
          qwanyx-transition-colors qwanyx-duration-200 qwanyx-ease-in-out
          focus:qwanyx-outline-none focus:qwanyx-ring-2 focus:qwanyx-ring-offset-2 focus:qwanyx-ring-primary
          ${sizeClasses[size].track}
          ${isChecked ? colorClasses[color] : 'qwanyx-bg-gray-300'}
          ${disabled ? 'qwanyx-opacity-50 qwanyx-cursor-not-allowed' : ''}
        `}
      >
        <span
          aria-hidden="true"
          className={`
            qwanyx-pointer-events-none qwanyx-inline-block qwanyx-rounded-full
            qwanyx-bg-white qwanyx-shadow-lg qwanyx-transform qwanyx-ring-0
            qwanyx-transition-transform qwanyx-duration-200 qwanyx-ease-in-out
            ${sizeClasses[size].thumb}
            ${isChecked ? sizeClasses[size].translate : 'qwanyx-translate-x-0.5'}
          `}
        />
      </button>
      {/* Hidden input for form submission */}
      {name && (
        <input
          type="checkbox"
          name={name}
          value={value}
          checked={isChecked}
          onChange={() => {}} // Controlled by button
          disabled={disabled}
          required={required}
          className="qwanyx-sr-only"
          aria-hidden="true"
        />
      )}
    </>
  );

  if (!label) {
    return <div className={className}>{switchElement}</div>;
  }

  return (
    <label 
      className={`
        qwanyx-inline-flex qwanyx-items-center qwanyx-gap-3
        ${disabled ? 'qwanyx-cursor-not-allowed qwanyx-opacity-50' : 'qwanyx-cursor-pointer'}
        ${className}
      `}
    >
      {labelPosition === 'left' && (
        <span className="qwanyx-select-none">
          {label}
          {required && <span className="qwanyx-text-error qwanyx-ml-1">*</span>}
        </span>
      )}
      {switchElement}
      {labelPosition === 'right' && (
        <span className="qwanyx-select-none">
          {label}
          {required && <span className="qwanyx-text-error qwanyx-ml-1">*</span>}
        </span>
      )}
    </label>
  );
};

// Compound component for switch group
export interface SwitchGroupProps {
  children: React.ReactNode;
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const SwitchGroup: React.FC<SwitchGroupProps> = ({
  children,
  label,
  orientation = 'vertical',
  className = '',
}) => {
  return (
    <div className={className}>
      {label && (
        <div className="qwanyx-text-sm qwanyx-font-medium qwanyx-text-foreground qwanyx-mb-3">
          {label}
        </div>
      )}
      <div 
        className={`
          qwanyx-flex
          ${orientation === 'vertical' ? 'qwanyx-flex-col qwanyx-space-y-3' : 'qwanyx-flex-row qwanyx-flex-wrap qwanyx-gap-4'}
        `}
      >
        {children}
      </div>
    </div>
  );
};