import React from 'react';
import { cn } from '../../utils/classNames';

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  containerClassName?: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(({
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
        type="radio"
        className={className}
        {...rest}
      />
      {label && <> {label}</>}
      {children}
    </>
  );

  if (containerClassName || label || children) {
    return (
      <label className={cn('radio', containerClassName)}>
        {content}
      </label>
    );
  }

  return (
    <input
      ref={ref}
      type="radio"
      className={className}
      {...rest}
    />
  );
});

Radio.displayName = 'Radio';

export default Radio;