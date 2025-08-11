import React from 'react';
import { ButtonProps } from './Button.types';
import { cn } from '../../utils/classNames';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  // Bulma props
  color,
  size,
  isLoading = false,
  isActive = false,
  isFocused = false,
  isHovered = false,
  isStatic = false,
  isSelected = false,
  isFullwidth = false,
  isOutlined = false,
  isInverted = false,
  isRounded = false,
  isLight = false,
  
  // Icon props
  leftIcon,
  rightIcon,
  iconOnly = false,
  
  // Component props
  as = 'button',
  href,
  target,
  children,
  className,
  disabled,
  ...rest
}, ref) => {
  
  // Build Bulma classes
  const buttonClasses = cn(
    'button',
    
    // Color
    color && `is-${color}`,
    
    // Size
    size && size !== 'normal' && `is-${size}`,
    
    // States
    isLoading && 'is-loading',
    isActive && 'is-active',
    isFocused && 'is-focused',
    isHovered && 'is-hovered',
    isStatic && 'is-static',
    isSelected && 'is-selected',
    
    // Styles
    isFullwidth && 'is-fullwidth',
    isOutlined && 'is-outlined',
    isInverted && 'is-inverted',
    isRounded && 'is-rounded',
    isLight && 'is-light',
    
    // Custom
    className
  );
  
  // Render content with icons
  const content = (
    <>
      {leftIcon && (
        <span className="icon">
          {typeof leftIcon === 'string' ? (
            <i className={leftIcon}></i>
          ) : (
            leftIcon
          )}
        </span>
      )}
      {!iconOnly && children && <span>{children}</span>}
      {rightIcon && (
        <span className="icon">
          {typeof rightIcon === 'string' ? (
            <i className={rightIcon}></i>
          ) : (
            rightIcon
          )}
        </span>
      )}
    </>
  );
  
  // Render as anchor if href is provided
  if (as === 'a' || href) {
    return (
      <a
        className={buttonClasses}
        href={href}
        target={target}
        {...(rest as any)}
      >
        {content}
      </a>
    );
  }
  
  // Render as span if static
  if (as === 'span' || isStatic) {
    return (
      <span className={buttonClasses} {...(rest as any)}>
        {content}
      </span>
    );
  }
  
  // Default: render as button
  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={disabled || isStatic}
      {...rest}
    >
      {content}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;