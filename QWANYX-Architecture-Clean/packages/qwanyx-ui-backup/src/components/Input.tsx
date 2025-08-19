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
  style,
  name,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [focused, setFocused] = React.useState(false);
  
  // Try to get form context if available
  let formContext: any;
  try {
    formContext = useFormContext();
  } catch {
    // Not in a form context, that's okay
  }

  // If we have a name and are in a form context, register the input
  const registration = name && formContext ? formContext.register(name) : {};
  
  // Size definitions
  const sizes = {
    xs: {
      padding: '6px 10px',
      fontSize: '12px',
      height: '32px',
      iconPadding: '32px'
    },
    sm: {
      padding: '8px 12px',
      fontSize: '14px',
      height: '36px',
      iconPadding: '36px'
    },
    md: {
      padding: '10px 14px',
      fontSize: '16px',
      height: '44px',
      iconPadding: '40px'
    },
    lg: {
      padding: '12px 16px',
      fontSize: '18px',
      height: '52px',
      iconPadding: '44px'
    },
    xl: {
      padding: '14px 18px',
      fontSize: '20px',
      height: '60px',
      iconPadding: '48px'
    }
  };
  
  // Get variant styles using CSS variables
  const getVariantStyles = () => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: 'rgb(var(--surface))',
          border: '2px solid transparent',
          boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)'
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          border: 'none',
          borderBottom: '2px solid rgb(var(--border))',
          borderRadius: '0',
          paddingLeft: '0',
          paddingRight: '0'
        };
      default: // 'default'
        return {
          backgroundColor: 'rgb(var(--background))',
          border: '2px solid rgb(var(--border))',
          boxShadow: 'var(--shadow-sm)'
        };
    }
  };
  
  // Get state styles using CSS variables
  const getStateStyles = () => {
    if (error) {
      return {
        borderColor: 'rgb(var(--error))',
        backgroundColor: 'rgb(var(--error) / 0.05)'
      };
    }
    if (success) {
      return {
        borderColor: 'rgb(var(--success))',
        backgroundColor: 'rgb(var(--success) / 0.05)'
      };
    }
    if (focused && !error && !success) {
      return {
        borderColor: 'rgb(var(--primary))',
        boxShadow: variant !== 'ghost' ? '0 0 0 3px rgb(var(--primary) / 0.1)' : undefined
      };
    }
    return {};
  };
  
  // Build input styles
  const inputStyles: React.CSSProperties = {
    ...sizes[inputSize],
    ...getVariantStyles(),
    ...getStateStyles(),
    width: fullWidth ? '100%' : 'auto',
    borderRadius: variant === 'ghost' ? '0' : 'var(--radius)',
    fontFamily: 'var(--font-sans)',
    color: 'rgb(var(--text))',
    outline: 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    paddingLeft: icon && iconPosition === 'left' ? sizes[inputSize].iconPadding : undefined,
    paddingRight: icon && iconPosition === 'right' ? sizes[inputSize].iconPadding : undefined,
    ...style
  };
  
  // Handle placeholder color
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      const styleId = 'qwanyx-input-placeholder-styles';
      if (!document.getElementById(styleId)) {
        const styleTag = document.createElement('style');
        styleTag.id = styleId;
        styleTag.textContent = `
          .qwanyx-input::placeholder {
            color: rgb(var(--text-muted));
            opacity: 0.7;
          }
          
          .qwanyx-input:hover:not(:focus):not(:disabled) {
            border-color: rgb(var(--text-secondary) / 0.5);
          }
          
          .qwanyx-input:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background-color: rgb(var(--surface));
          }
        `;
        document.head.appendChild(styleTag);
      }
    }
  }, []);
  
  // Icon wrapper styles
  const iconWrapperStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    color: error ? 'rgb(var(--error))' : success ? 'rgb(var(--success))' : 'rgb(var(--text-muted))',
    transition: 'color 0.2s ease',
    ...(iconPosition === 'left' ? { left: '12px' } : { right: '12px' })
  };
  
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    if (onFocus) onFocus(e);
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    if (onBlur) onBlur(e);
  };
  
  if (icon) {
    const wrapperStyle: React.CSSProperties = {
      position: 'relative',
      display: 'inline-block',
      width: fullWidth ? '100%' : 'auto'
    };
    
    return (
      <div style={wrapperStyle}>
        <div style={iconWrapperStyle}>
          {icon}
        </div>
        <input
          ref={ref}
          className="qwanyx-input"
          style={inputStyles}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...registration}
          {...props}
        />
      </div>
    );
  }
  
  return (
    <input
      ref={ref}
      className="qwanyx-input"
      style={inputStyles}
      onFocus={handleFocus}
      onBlur={handleBlur}
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
  style,
  name,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [focused, setFocused] = React.useState(false);
  
  // Try to get form context if available
  let formContext: any;
  try {
    formContext = useFormContext();
  } catch {
    // Not in a form context, that's okay
  }

  // If we have a name and are in a form context, register the textarea
  const registration = name && formContext ? formContext.register(name) : {};
  
  // Size definitions
  const sizes = {
    xs: {
      padding: '6px 10px',
      fontSize: '12px',
      minHeight: '80px'
    },
    sm: {
      padding: '8px 12px',
      fontSize: '14px',
      minHeight: '100px'
    },
    md: {
      padding: '10px 14px',
      fontSize: '16px',
      minHeight: '120px'
    },
    lg: {
      padding: '12px 16px',
      fontSize: '18px',
      minHeight: '140px'
    },
    xl: {
      padding: '14px 18px',
      fontSize: '20px',
      minHeight: '160px'
    }
  };
  
  // Get variant styles using CSS variables
  const getVariantStyles = () => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: 'rgb(var(--surface))',
          border: '2px solid transparent',
          boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)'
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          border: 'none',
          borderBottom: '2px solid rgb(var(--border))',
          borderRadius: '0',
          paddingLeft: '0',
          paddingRight: '0'
        };
      default: // 'default'
        return {
          backgroundColor: 'rgb(var(--background))',
          border: '2px solid rgb(var(--border))',
          boxShadow: 'var(--shadow-sm)'
        };
    }
  };
  
  // Get state styles using CSS variables
  const getStateStyles = () => {
    if (error) {
      return {
        borderColor: 'rgb(var(--error))',
        backgroundColor: 'rgb(var(--error) / 0.05)'
      };
    }
    if (success) {
      return {
        borderColor: 'rgb(var(--success))',
        backgroundColor: 'rgb(var(--success) / 0.05)'
      };
    }
    if (focused && !error && !success) {
      return {
        borderColor: 'rgb(var(--primary))',
        boxShadow: variant !== 'ghost' ? '0 0 0 3px rgb(var(--primary) / 0.1)' : undefined
      };
    }
    return {};
  };
  
  // Build textarea styles
  const textareaStyles: React.CSSProperties = {
    ...sizes[textareaSize],
    ...getVariantStyles(),
    ...getStateStyles(),
    width: fullWidth ? '100%' : 'auto',
    borderRadius: variant === 'ghost' ? '0' : 'var(--radius)',
    fontFamily: 'var(--font-sans)',
    color: 'rgb(var(--text))',
    outline: 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    resize: resize as any,
    lineHeight: '1.6',
    ...style
  };
  
  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setFocused(true);
    if (onFocus) onFocus(e);
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setFocused(false);
    if (onBlur) onBlur(e);
  };
  
  return (
    <textarea
      ref={ref}
      className="qwanyx-input"
      style={textareaStyles}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...registration}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';