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

// Size and color mappings are now handled with inline styles

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

  const trackSizes = {
    xs: { width: '24px', height: '12px' },
    sm: { width: '32px', height: '16px' },
    md: { width: '44px', height: '24px' },
    lg: { width: '56px', height: '28px' },
    xl: { width: '64px', height: '32px' },
  };

  const thumbSizes = {
    xs: { width: '8px', height: '8px' },
    sm: { width: '12px', height: '12px' },
    md: { width: '20px', height: '20px' },
    lg: { width: '24px', height: '24px' },
    xl: { width: '28px', height: '28px' },
  };

  // Formula: track_width - thumb_width - 10px (constant compensation)
  // For unchecked: -6px to allow thumb to extend beyond left edge
  const thumbTranslate = {
    xs: isChecked ? '6px' : '-6px',    // 24 - 8 - 10 = 6px ✓
    sm: isChecked ? '10px' : '-6px',   // 32 - 12 - 10 = 10px
    md: isChecked ? '14px' : '-6px',   // 44 - 20 - 10 = 14px ✓
    lg: isChecked ? '22px' : '-6px',   // 56 - 24 - 10 = 22px
    xl: isChecked ? '26px' : '-6px',   // 64 - 28 - 10 = 26px
  };

  // Use CSS variables from theme like Tabs does
  const getBackgroundColor = (color: string) => {
    return `rgb(var(--qwanyx-${color}, var(--${color})))`;
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
        style={{
          position: 'relative',
          display: 'inline-flex',
          ...trackSizes[size],
          backgroundColor: isChecked ? getBackgroundColor(color) : 'rgb(var(--qwanyx-border, 209 213 219))',
          borderRadius: '9999px',
          border: '2px solid transparent',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'background-color 200ms ease-in-out',
          outline: 'none',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            ...thumbSizes[size],
            backgroundColor: 'white',
            borderRadius: '9999px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transform: `translateX(${thumbTranslate[size]})`,
            transition: 'transform 200ms ease-in-out',
            top: '50%',
            marginTop: `-${parseInt(thumbSizes[size].height) / 2}px`,
          }}
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
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
      className={className}
    >
      {labelPosition === 'left' && (
        <span style={{ userSelect: 'none' }}>
          {label}
          {required && <span style={{ color: 'rgb(239 68 68)', marginLeft: '4px' }}>*</span>}
        </span>
      )}
      {switchElement}
      {labelPosition === 'right' && (
        <span style={{ userSelect: 'none' }}>
          {label}
          {required && <span style={{ color: 'rgb(239 68 68)', marginLeft: '4px' }}>*</span>}
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
        <div style={{ 
          fontSize: '14px', 
          fontWeight: '500', 
          marginBottom: '12px' 
        }}>
          {label}
        </div>
      )}
      <div 
        style={{
          display: 'flex',
          flexDirection: orientation === 'vertical' ? 'column' : 'row',
          gap: orientation === 'vertical' ? '12px' : '16px',
          flexWrap: orientation === 'horizontal' ? 'wrap' : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
};