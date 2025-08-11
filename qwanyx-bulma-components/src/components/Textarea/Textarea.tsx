import React from 'react';
import { cn } from '../../utils/classNames';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  color?: 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'normal' | 'medium' | 'large';
  loading?: boolean;
  fixedSize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  color,
  size,
  loading = false,
  fixedSize = false,
  className,
  ...rest
}, ref) => {
  const textareaClasses = cn(
    'textarea',
    color && `is-${color}`,
    size && size !== 'normal' && `is-${size}`,
    loading && 'is-loading',
    fixedSize && 'has-fixed-size',
    className
  );

  return (
    <textarea
      ref={ref}
      className={textareaClasses}
      {...rest}
    />
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;