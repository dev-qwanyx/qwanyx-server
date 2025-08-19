import React, { useState, useEffect } from 'react';
import { Radio } from './Form';

export interface RadioGroupProps {
  name: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string | number) => void;
  orientation?: 'horizontal' | 'vertical';
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value: controlledValue,
  defaultValue,
  onChange,
  orientation = 'vertical',
  gap = 'md',
  children,
  className = '',
  style
}) => {
  const [internalValue, setInternalValue] = useState<string | number | undefined>(
    controlledValue ?? defaultValue
  );

  // Update internal value when controlled value changes
  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  // Handle radio change
  const handleRadioChange = (newValue: string | number) => {
    if (controlledValue === undefined) {
      // Uncontrolled mode
      setInternalValue(newValue);
    }
    if (onChange) {
      onChange(newValue);
    }
  };

  const gapMap = {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem'
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: orientation === 'horizontal' ? 'row' : 'column',
    gap: gapMap[gap],
    ...style
  };

  // Clone children and pass props
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === Radio) {
      return React.cloneElement(child as React.ReactElement<any>, {
        name,
        checked: (controlledValue ?? internalValue) === child.props.value,
        onChange: handleRadioChange,
        ...child.props // Allow child props to override
      });
    }
    return child;
  });

  return (
    <div className={className} style={containerStyle}>
      {enhancedChildren}
    </div>
  );
};