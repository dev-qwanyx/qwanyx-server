import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  children,
  variant = 'elevated',
  padding = 'md',
  hoverable = false,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'rounded-lg transition-all duration-base';
  
  const variantClasses = {
    elevated: 'bg-card text-card-foreground shadow-md',
    outlined: 'bg-card text-card-foreground border border-border',
    filled: 'bg-card text-card-foreground'
  };
  
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };
  
  const hoverClass = hoverable ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : '';
  
  const combinedClassName = [
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    hoverClass,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div ref={ref} className={combinedClassName} {...props}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div 
      ref={ref} 
      className={`px-6 py-4 border-b border-border ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(({
  children,
  as: Component = 'h3',
  className = '',
  ...props
}, ref) => {
  return (
    <Component 
      ref={ref as any} 
      className={`text-xl font-semibold text-text-primary ${className}`} 
      {...props}
    >
      {children}
    </Component>
  );
});

CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <p 
      ref={ref} 
      className={`text-sm text-text-secondary mt-1 ${className}`} 
      {...props}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = 'CardDescription';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div 
      ref={ref} 
      className={`p-6 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
});

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div 
      ref={ref} 
      className={`px-6 py-4 border-t border-border ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';

export interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: 'square' | '16/9' | '4/3' | '21/9';
}

export const CardImage = React.forwardRef<HTMLImageElement, CardImageProps>(({
  aspectRatio = '16/9',
  className = '',
  alt = '',
  ...props
}, ref) => {
  const aspectClasses = {
    'square': 'aspect-square',
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '21/9': 'aspect-[21/9]'
  };
  
  return (
    <div className={`overflow-hidden rounded-t-lg ${aspectClasses[aspectRatio]}`}>
      <img 
        ref={ref}
        className={`w-full h-full object-cover ${className}`}
        alt={alt}
        {...props}
      />
    </div>
  );
});

CardImage.displayName = 'CardImage';