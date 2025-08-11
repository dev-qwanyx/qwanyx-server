import React from 'react';
import { cn } from '../../utils/classNames';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  containerClassName?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  containerClassName,
  className,
  children,
  ...rest
}, ref) => {
  const content = (
    <>
      <input
        ref={ref}
        type="checkbox"
        className={className}
        {...rest}
      />
      {label && <> {label}</>}
      {children}
    </>
  );

  if (containerClassName || label || children) {
    return (
      <label className={cn('checkbox', containerClassName)}>
        {content}
      </label>
    );
  }

  return (
    <input
      ref={ref}
      type="checkbox"
      className={className}
      {...rest}
    />
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;