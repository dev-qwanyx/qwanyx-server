import { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // Bulma color variants
  color?: 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger' | 'dark' | 'light' | 'white' | 'black' | 'text' | 'ghost';
  
  // Bulma size variants
  size?: 'small' | 'normal' | 'medium' | 'large';
  
  // Bulma states
  isLoading?: boolean;
  isActive?: boolean;
  isFocused?: boolean;
  isHovered?: boolean;
  isStatic?: boolean;
  isSelected?: boolean;
  
  // Bulma styles
  isFullwidth?: boolean;
  isOutlined?: boolean;
  isInverted?: boolean;
  isRounded?: boolean;
  isLight?: boolean;
  
  // Icon support
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  iconOnly?: boolean;
  
  // Component options
  as?: 'button' | 'a' | 'span';
  href?: string;
  target?: string;
  children?: ReactNode;
}