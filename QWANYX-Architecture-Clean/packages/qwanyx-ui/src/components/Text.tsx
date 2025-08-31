import React from 'react';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: '5xl' | '4xl' | '3xl' | '2xl' | 'xl' | 'lg' | 'md' | 'base' | 'sm' | 'xs';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  color?: 'primary' | 'secondary' | 'muted' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  align?: 'left' | 'center' | 'right' | 'justify';
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(({
  children,
  as: Component = 'h2',
  size,
  weight = 'semibold',
  color = 'primary',
  align = 'left',
  className = '',
  style,
  ...props
}, ref) => {
  // Auto-size based on heading level if not specified
  const autoSize = size || {
    h1: '4xl',
    h2: '3xl',
    h3: '2xl',
    h4: 'xl',
    h5: 'lg',
    h6: 'base'
  }[Component] as HeadingProps['size'];
  
  const sizeMap = {
    '5xl': '3rem',
    '4xl': '2.25rem',
    '3xl': '1.875rem',
    '2xl': '1.5rem',
    'xl': '1.25rem',
    'lg': '1.125rem',
    'md': '1rem',
    'base': '1rem',
    'sm': '0.875rem',
    'xs': '0.75rem'
  };
  
  const weightMap = {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800'
  };
  
  const colorMap = {
    primary: 'rgb(var(--foreground))',
    secondary: 'rgb(var(--foreground) / 0.7)',
    muted: 'rgb(var(--foreground) / 0.5)',
    accent: 'rgb(var(--primary))',
    success: 'rgb(var(--success))',
    warning: 'rgb(var(--warning))',
    error: 'rgb(var(--error))',
    info: 'rgb(var(--info))'
  };
  
  const headingStyle: React.CSSProperties = {
    fontSize: sizeMap[autoSize!],
    fontWeight: weightMap[weight],
    color: colorMap[color],
    textAlign: align,
    fontFamily: 'var(--font-heading, var(--font-sans))',
    lineHeight: '1.2',
    ...style
  };
  
  return (
    <Component ref={ref as any} className={className} style={headingStyle} {...props}>
      {children}
    </Component>
  );
});

Heading.displayName = 'Heading';

export interface TextProps {
  children?: React.ReactNode;
  as?: 'p' | 'span' | 'div' | 'label';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'muted' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  align?: 'left' | 'center' | 'right' | 'justify';
  italic?: boolean;
  underline?: boolean;
  lineThrough?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(({
  children,
  as: Component = 'p',
  size = 'base',
  weight = 'normal',
  color = 'primary',
  align = 'left',
  italic = false,
  underline = false,
  lineThrough = false,
  className = '',
  style
}, ref) => {
  const sizeMap = {
    'xs': '0.75rem',
    'sm': '0.875rem',
    'base': '1rem',
    'lg': '1.125rem',
    'xl': '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem'
  };
  
  const weightMap = {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  };
  
  const colorMap = {
    primary: 'rgb(var(--foreground))',
    secondary: 'rgb(var(--foreground) / 0.7)',
    muted: 'rgb(var(--foreground) / 0.5)',
    accent: 'rgb(var(--primary))',
    success: 'rgb(var(--success))',
    warning: 'rgb(var(--warning))',
    error: 'rgb(var(--error))',
    info: 'rgb(var(--info))'
  };
  
  const textStyle: React.CSSProperties = {
    fontSize: sizeMap[size],
    fontWeight: weightMap[weight],
    color: colorMap[color],
    textAlign: align,
    fontStyle: italic ? 'italic' : 'normal',
    textDecoration: underline ? 'underline' : lineThrough ? 'line-through' : 'none',
    ...style
  };
  
  const combinedClassName = className;
  
  // Handle label element
  if (Component === 'label') {
    return (
      <label ref={ref as any} className={combinedClassName} style={textStyle}>
        {children}
      </label>
    );
  }
  
  return (
    <Component ref={ref as any} className={combinedClassName} style={textStyle}>
      {children}
    </Component>
  );
});

Text.displayName = 'Text';

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'inline' | 'block';
  language?: string;
}

export const Code = React.forwardRef<HTMLElement, CodeProps>(({
  children,
  variant = 'inline',
  language,
  className = '',
  ...props
}, ref) => {
  if (variant === 'block') {
    return (
      <pre 
        ref={ref as any}
        className={`bg-foreground/5 border border-border rounded-md p-4 overflow-x-auto ${className}`}
        {...props}
      >
        <code className="text-sm font-mono text-text-primary" data-language={language}>
          {children}
        </code>
      </pre>
    );
  }
  
  return (
    <code
      ref={ref as any}
      className={`bg-foreground/10 px-1.5 py-0.5 rounded text-sm font-mono text-text-primary ${className}`}
      {...props}
    >
      {children}
    </code>
  );
});

Code.displayName = 'Code';