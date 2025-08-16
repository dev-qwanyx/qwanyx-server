import React from 'react';
import { useFormContext } from 'react-hook-form';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'filled' | 'ghost';
  inputSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  error?: boolean;
  success?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  name?: string;
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
  name,
  ...props
}, ref) => {
  // Try to get form context if available
  let formContext: any;
  try {
    formContext = useFormContext();
  } catch {
    // Not in a form context, that's okay
  }

  // If we have a name and are in a form context, register the input
  const registration = name && formContext ? formContext.register(name) : {};
  
  const inputClasses = [
    'qwanyx-input',
    `qwanyx-input--${inputSize}`,
    `qwanyx-input--${variant}`,
    error && 'qwanyx-input--error',
    success && 'qwanyx-input--success',
    fullWidth && 'qwanyx-input--fullwidth',
    icon && iconPosition === 'left' && 'qwanyx-input--icon-left',
    icon && iconPosition === 'right' && 'qwanyx-input--icon-right',
    className
  ].filter(Boolean).join(' ');
  
  if (icon) {
    const wrapperClasses = [
      'qwanyx-input-wrapper',
      fullWidth && 'qwanyx-input-wrapper--fullwidth'
    ].filter(Boolean).join(' ');
    
    const iconClasses = [
      'qwanyx-input-wrapper__icon',
      `qwanyx-input-wrapper__icon--${iconPosition}`
    ].join(' ');
    
    return (
      <div className={wrapperClasses}>
        {icon && (
          <div className={iconClasses}>
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={inputClasses}
          {...registration}
          {...props}
        />
      </div>
    );
  }
  
  return (
    <input
      ref={ref}
      className={inputClasses}
      {...registration}
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
  name?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  variant = 'default',
  textareaSize = 'md',
  error = false,
  success = false,
  fullWidth = false,
  resize = 'vertical',
  className = '',
  name,
  ...props
}, ref) => {
  // Try to get form context if available
  let formContext: any;
  try {
    formContext = useFormContext();
  } catch {
    // Not in a form context, that's okay
  }

  // If we have a name and are in a form context, register the textarea
  const registration = name && formContext ? formContext.register(name) : {};
  
  const textareaClasses = [
    'qwanyx-input',
    'qwanyx-textarea',
    `qwanyx-input--${textareaSize}`,
    `qwanyx-input--${variant}`,
    error && 'qwanyx-input--error',
    success && 'qwanyx-input--success',
    fullWidth && 'qwanyx-input--fullwidth',
    `qwanyx-textarea--resize-${resize}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <textarea
      ref={ref}
      className={textareaClasses}
      {...registration}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';