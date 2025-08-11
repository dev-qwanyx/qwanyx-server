import { ReactNode, HTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';

/**
 * Common prop types used across components
 */

export interface BaseComponentProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export interface BulmaComponentProps extends BaseComponentProps {
  color?: 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger' | 'dark' | 'light' | 'white' | 'black' | 'text' | 'ghost';
  size?: 'small' | 'normal' | 'medium' | 'large';
  isFullwidth?: boolean;
  isLoading?: boolean;
  isOutlined?: boolean;
  isRounded?: boolean;
  isStatic?: boolean;
}

export interface ColumnSize {
  mobile?: number | 'narrow' | 'full' | 'half' | 'one-third' | 'two-thirds' | 'one-quarter' | 'three-quarters';
  tablet?: number | 'narrow' | 'full' | 'half' | 'one-third' | 'two-thirds' | 'one-quarter' | 'three-quarters';
  desktop?: number | 'narrow' | 'full' | 'half' | 'one-third' | 'two-thirds' | 'one-quarter' | 'three-quarters';
  widescreen?: number | 'narrow' | 'full' | 'half' | 'one-third' | 'two-thirds' | 'one-quarter' | 'three-quarters';
  fullhd?: number | 'narrow' | 'full' | 'half' | 'one-third' | 'two-thirds' | 'one-quarter' | 'three-quarters';
}

export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
    light: string;
    dark: string;
  };
  fonts: {
    family: string;
    size: {
      small: string;
      normal: string;
      medium: string;
      large: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    small: string;
    normal: string;
    large: string;
    rounded: string;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
}