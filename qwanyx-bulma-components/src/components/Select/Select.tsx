import React from 'react';
import { cn } from '../../utils/classNames';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  color?: 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'normal' | 'medium' | 'large';
  rounded?: boolean;
  loading?: boolean;
  fullwidth?: boolean;
  isMultiple?: boolean;
  containerClassName?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  color,
  size,
  rounded = false,
  loading = false,
  fullwidth = false,
  isMultiple = false,
  containerClassName,
  className,
  children,
  ...rest
}, ref) => {
  const containerClasses = cn(
    'select',
    color && `is-${color}`,
    size && size !== 'normal' && `is-${size}`,
    rounded && 'is-rounded',
    loading && 'is-loading',
    fullwidth && 'is-fullwidth',
    isMultiple && 'is-multiple',
    containerClassName
  );

  return (
    <div className={containerClasses}>
      <select
        ref={ref}
        className={className}
        multiple={isMultiple}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
});

Select.displayName = 'Select';

export default Select;