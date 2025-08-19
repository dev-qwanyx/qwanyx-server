import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export interface RadioProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  variant?: 'default' | 'filled' | 'outlined';
  animation?: 'none' | 'smooth' | 'bounce' | 'pop' | 'pulse';
  
  label?: string;
  labelPosition?: 'left' | 'right';
  
  name?: string;
  value?: string;
  required?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Radio: React.FC<RadioProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  
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
  
  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    e.preventDefault();
    
    // Allow toggling: if already checked, uncheck it
    const newChecked = !isChecked;
    
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    
    onChange?.(newChecked);
  };
  
  // Size mappings
  const sizes = {
    xs: { box: 14, dot: 6, font: 12, gap: 6 },
    sm: { box: 16, dot: 8, font: 14, gap: 8 },
    md: { box: 20, dot: 10, font: 16, gap: 10 },
    lg: { box: 24, dot: 12, font: 18, gap: 12 },
    xl: { box: 28, dot: 14, font: 20, gap: 14 },
  };
  
  const currentSize = sizes[size];
  
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
  
  // Animation variants for the radio dot
  const dotVariants = {
    hidden: { 
      opacity: 0,
      scale: animation === 'pop' ? 0 : 
             animation === 'bounce' ? 0.8 : 
             animation === 'smooth' ? 0.9 : 
             animation === 'pulse' ? 0.95 : 1,
      rotate: animation === 'pop' ? -180 : 0,
    },
    visible: { 
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: animation === 'smooth' ? 0.2 : 
                  animation === 'pulse' ? 0.3 : 0.3,
        type: (animation === 'pop' ? 'spring' : 'tween') as any,
        ...(animation === 'pop' ? { stiffness: 500, damping: 25 } : {}),
        ease: (animation === 'bounce' ? [0.68, -0.55, 0.265, 1.55] : 
              animation === 'pulse' ? 'easeInOut' : 'easeOut') as any,
      }
    }
  };
  
  // Box styles based on variant
  const getBoxStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: `${currentSize.box}px`,
      height: `${currentSize.box}px`,
      borderRadius: '50%',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: animation === 'none' ? 'none' : 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
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
      // default
      return {
        ...base,
        backgroundColor: isChecked ? `rgb(${currentColor})` : 'rgb(var(--background))',
        border: isChecked ? `2px solid rgb(${currentColor})` : '2px solid rgb(var(--border))',
      };
    }
  };
  
  
  const radioElement = (
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
      
      <div style={{ 
        position: 'relative', 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <input
          ref={inputRef}
          type="checkbox"
          checked={isChecked}
          onClick={handleClick}
          onChange={() => {}} // Prevent React warning
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
        
        <div 
          style={getBoxStyles()}
        >
          {/* Always render the container to prevent layout shift */}
          <motion.div
            style={{
              width: `${currentSize.dot}px`,
              height: `${currentSize.dot}px`,
              borderRadius: '50%',
              backgroundColor: variant === 'outlined' ? 
                `rgb(${currentColor})` :
                variant === 'filled' ? 
                'white' :
                `rgb(${currentColor})`,
              position: 'absolute',
            }}
            initial="hidden"
            animate={isChecked ? "visible" : "hidden"}
            variants={animation !== 'none' ? dotVariants : undefined}
          />
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
  
  return radioElement;
};

// Radio Group for multiple radio buttons
export interface RadioGroupProps {
  children: React.ReactNode;
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  children,
  label,
  orientation = 'vertical',
  gap = 'md',
  name,
  value: controlledValue,
  defaultValue,
  onChange,
  className = '',
  style,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;
  
  const gaps = {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
  };
  
  // Generate a unique name for this radio group if not provided
  const groupName = name || `radio-group-${Math.random().toString(36).substr(2, 9)}`;
  
  // Clone children and inject name, checked state, and onChange
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === Radio) {
      const childValue = child.props.value || '';
      return React.cloneElement(child as React.ReactElement<RadioProps>, {
        name: groupName,
        checked: currentValue === childValue,
        onChange: (newChecked: boolean) => {
          if (newChecked) {
            // Selecting this radio
            if (!isControlled) {
              setInternalValue(childValue);
            }
            if (onChange) {
              onChange(childValue);
            }
          } else {
            // Deselecting this radio (allow unchecking)
            if (!isControlled) {
              setInternalValue('');
            }
            if (onChange) {
              onChange('');
            }
          }
        },
      });
    }
    return child;
  });
  
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
        {enhancedChildren}
      </div>
    </div>
  );
};