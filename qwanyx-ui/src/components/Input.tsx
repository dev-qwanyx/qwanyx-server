import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'filled' | 'ghost';
  inputSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  error?: boolean;
  success?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  variant = 'default',
  inputSize = 'md',
  error = false,
  success = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'transition-all duration-base focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    xs: 'text-xs px-2 py-1 rounded',
    sm: 'text-sm px-3 py-1.5 rounded',
    md: 'text-base px-4 py-2 rounded-md',
    lg: 'text-lg px-5 py-2.5 rounded-md',
    xl: 'text-xl px-6 py-3 rounded-lg'
  };
  
  const variantClasses = {
    default: 'border border-border bg-input text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20',
    filled: 'bg-input/50 text-foreground border-b-2 border-border focus:border-ring focus:bg-input',
    ghost: 'bg-transparent text-foreground border-b border-border focus:border-ring'
  };
  
  const stateClasses = error 
    ? 'border-error focus:border-error focus:ring-error/20' 
    : success 
      ? 'border-success focus:border-success focus:ring-success/20'
      : '';
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const inputClasses = [
    baseClasses,
    sizeClasses[inputSize],
    variantClasses[variant],
    stateClasses,
    widthClass,
    icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : '',
    className
  ].filter(Boolean).join(' ');
  
  if (icon) {
    return (
      <div className={`relative ${fullWidth ? 'w-full' : 'inline-block'}`}>
        {icon && (
          <div className={`absolute top-1/2 -translate-y-1/2 text-text-muted ${
            iconPosition === 'left' ? 'left-3' : 'right-3'
          }`}>
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
      </div>
    );
  }
  
  return (
    <input
      ref={ref}
      className={inputClasses}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'filled' | 'ghost';
  textareaSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  error?: boolean;
  success?: boolean;
  fullWidth?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  variant = 'default',
  textareaSize = 'md',
  error = false,
  success = false,
  fullWidth = false,
  resize = 'vertical',
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'transition-all duration-base focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    xs: 'text-xs px-2 py-1 rounded',
    sm: 'text-sm px-3 py-1.5 rounded',
    md: 'text-base px-4 py-2 rounded-md',
    lg: 'text-lg px-5 py-2.5 rounded-md',
    xl: 'text-xl px-6 py-3 rounded-lg'
  };
  
  const variantClasses = {
    default: 'border border-border bg-input text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20',
    filled: 'bg-input/50 text-foreground border-b-2 border-border focus:border-ring focus:bg-input',
    ghost: 'bg-transparent text-foreground border-b border-border focus:border-ring'
  };
  
  const stateClasses = error 
    ? 'border-error focus:border-error focus:ring-error/20' 
    : success 
      ? 'border-success focus:border-success focus:ring-success/20'
      : '';
  
  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const textareaClasses = [
    baseClasses,
    sizeClasses[textareaSize],
    variantClasses[variant],
    stateClasses,
    resizeClasses[resize],
    widthClass,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <textarea
      ref={ref}
      className={textareaClasses}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';