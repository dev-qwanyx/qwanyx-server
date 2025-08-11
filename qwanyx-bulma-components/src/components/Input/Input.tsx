import React from 'react';
import { cn } from '../../utils/classNames';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  color?: 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'normal' | 'medium' | 'large';
  rounded?: boolean;
  loading?: boolean;
  fullwidth?: boolean;
  inline?: boolean;
  isStatic?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  color,
  size,
  rounded = false,
  loading = false,
  fullwidth = false,
  inline = false,
  isStatic = false,
  className,
  ...rest
}, ref) => {
  const inputClasses = cn(
    'input',
    color && `is-${color}`,
    size && size !== 'normal' && `is-${size}`,
    rounded && 'is-rounded',
    loading && 'is-loading',
    fullwidth && 'is-fullwidth',
    inline && 'is-inline',
    isStatic && 'is-static',
    className
  );

  return (
    <input
      ref={ref}
      className={inputClasses}
      readOnly={isStatic}
      {...rest}
    />
  );
});

Input.displayName = 'Input';

export default Input;