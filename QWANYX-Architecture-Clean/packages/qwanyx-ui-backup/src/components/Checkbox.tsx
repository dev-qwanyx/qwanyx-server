import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  variant?: 'default' | 'filled' | 'outlined';
  animation?: 'none' | 'smooth' | 'bounce' | 'pop';
  
  label?: string;
  labelPosition?: 'left' | 'right';
  
  name?: string;
  value?: string;
  required?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  indeterminate = false,
  
  size = 'md',
  color = 'primary',
  variant = 'default',
  animation = 'smooth',
  
  label,
  labelPosition = 'right',
  
  name,
  value,
  required = false,
  className = '',
  style,
}) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : internalChecked;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const newChecked = e.target.checked;
    
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    
    onChange?.(newChecked);
  };
  
  // Size mappings
  const sizes = {
    xs: { box: 14, icon: 10, font: 12, gap: 6 },
    sm: { box: 16, icon: 12, font: 14, gap: 8 },
    md: { box: 20, icon: 14, font: 16, gap: 10 },
    lg: { box: 24, icon: 18, font: 18, gap: 12 },
    xl: { box: 28, icon: 22, font: 20, gap: 14 },
  };
  
  const currentSize = sizes[size];
  
  // Animation variants for the checkmark
  const checkmarkVariants = {
    hidden: { 
      opacity: 0,
      scale: animation === 'pop' ? 0 : 
             animation === 'bounce' ? 0.8 : 
             animation === 'smooth' ? 0.9 : 1,
      rotate: animation === 'pop' ? -180 : 0,
    },
    visible: { 
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: animation === 'smooth' ? 0.2 : 0.3,
        type: (animation === 'pop' ? 'spring' : 'tween') as any,
        ...(animation === 'pop' ? { stiffness: 500, damping: 25 } : {}),
        ease: (animation === 'bounce' ? [0.68, -0.55, 0.265, 1.55] : 'easeOut') as any,
      }
    }
  };
  
  // Color mappings
  const colors = {
    primary: 'var(--primary)',
    secondary: 'var(--secondary)',
    accent: 'var(--accent)',
    success: 'var(--success)',
    warning: 'var(--warning)',
    error: 'var(--error)',
    info: 'var(--info)',
  };
  
  const currentColor = colors[color];
  
  // Box styles based on variant
  const getBoxStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: `${currentSize.box}px`,
      height: `${currentSize.box}px`,
      borderRadius: 'calc(var(--radius) * 0.5)',
      position: 'relative',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      flexShrink: 0,
    };
    
    if (variant === 'filled') {
      return {
        ...base,
        backgroundColor: isChecked ? `rgb(${currentColor})` : 'rgb(var(--surface))',
        border: '2px solid transparent',
      };
    } else if (variant === 'outlined') {
      return {
        ...base,
        backgroundColor: 'transparent',
        border: `2px solid ${isChecked ? `rgb(${currentColor})` : 'rgb(var(--border))'}`,
      };
    } else {
      // default - always keep border space to prevent shifting
      return {
        ...base,
        backgroundColor: isChecked ? `rgb(${currentColor})` : 'rgb(var(--background))',
        border: isChecked ? `2px solid rgb(${currentColor})` : '2px solid rgb(var(--border))',
        // Remove boxShadow as it causes layout shift
      };
    }
  };
  
  
  const checkboxElement = (
    <label 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${currentSize.gap}px`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
        ...style,
      }}
      className={className}
    >
      {labelPosition === 'left' && label && (
        <span style={{ fontSize: `${currentSize.font}px` }}>
          {label}
          {required && <span style={{ color: 'rgb(var(--error))', marginLeft: '4px' }}>*</span>}
        </span>
      )}
      
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <input
          ref={inputRef}
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          name={name}
          value={value}
          required={required}
          style={{
            position: 'absolute',
            opacity: 0,
            width: '100%',
            height: '100%',
            cursor: disabled ? 'not-allowed' : 'pointer',
            zIndex: 1,
          }}
        />
        
        <div style={{
          ...getBoxStyles(),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Always render the container to prevent layout shift */}
          <motion.div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: `${currentSize.icon}px`,
              height: `${currentSize.icon}px`,
            }}
            initial="hidden"
            animate={(isChecked || indeterminate) ? "visible" : "hidden"}
            variants={animation !== 'none' ? checkmarkVariants : undefined}
          >
            {indeterminate ? (
              // Indeterminate state - horizontal line
              <div
                style={{
                  width: `${currentSize.icon}px`,
                  height: '2px',
                  backgroundColor: variant === 'outlined' ? `rgb(${currentColor})` : 'white',
                  borderRadius: '1px',
                }}
              />
            ) : (
              // Checked state - checkmark
              <svg
                width={currentSize.icon}
                height={currentSize.icon}
                viewBox="0 0 24 24"
                fill="none"
                stroke={variant === 'outlined' ? `rgb(${currentColor})` : 'white'}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ display: 'block' }}
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </motion.div>
        </div>
      </div>
      
      {labelPosition === 'right' && label && (
        <span style={{ fontSize: `${currentSize.font}px` }}>
          {label}
          {required && <span style={{ color: 'rgb(var(--error))', marginLeft: '4px' }}>*</span>}
        </span>
      )}
    </label>
  );
  
  return checkboxElement;
};

// Checkbox Group for multiple checkboxes
export interface CheckboxGroupProps {
  children: React.ReactNode;
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  style?: React.CSSProperties;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  children,
  label,
  orientation = 'vertical',
  gap = 'md',
  className = '',
  style,
}) => {
  const gaps = {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
  };
  
  return (
    <div className={className} style={style}>
      {label && (
        <div style={{ 
          fontSize: '14px', 
          fontWeight: '600', 
          marginBottom: '12px',
          color: 'rgb(var(--text-secondary))',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          {label}
        </div>
      )}
      <div 
        style={{
          display: 'flex',
          flexDirection: orientation === 'vertical' ? 'column' : 'row',
          gap: `${gaps[gap]}px`,
          flexWrap: orientation === 'horizontal' ? 'wrap' : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
};