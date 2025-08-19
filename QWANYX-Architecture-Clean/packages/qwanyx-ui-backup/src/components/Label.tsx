import React from 'react';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  disabled?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({
  children,
  required = false,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  const combinedClassName = [
    'qwanyx-label',
    disabled && 'qwanyx-label--disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <label
      ref={ref}
      className={combinedClassName}
      {...props}
    >
      {children}
      {required && <span className="qwanyx-label__required">*</span>}
    </label>
  );
});

Label.displayName = 'Label';