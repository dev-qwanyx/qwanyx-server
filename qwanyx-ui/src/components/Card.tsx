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
  const classNames = [
    'qwanyx-card',
    `qwanyx-card--${variant}`,
    `qwanyx-card--padding-${padding}`,
    hoverable && 'qwanyx-card--hoverable',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div ref={ref} className={classNames} {...props}>
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
      className={`qwanyx-card__header ${className}`} 
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
      className={`qwanyx-card__title ${className}`} 
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
      className={`qwanyx-card__description ${className}`} 
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
      className={`qwanyx-card__content ${className}`} 
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
      className={`qwanyx-card__footer ${className}`} 
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
    'square': 'qwanyx-card__image-container--square',
    '16/9': 'qwanyx-card__image-container--video',
    '4/3': 'qwanyx-card__image-container--4-3',
    '21/9': 'qwanyx-card__image-container--21-9'
  };
  
  return (
    <div className={`qwanyx-card__image-container ${aspectClasses[aspectRatio]}`}>
      <img 
        ref={ref}
        className={`qwanyx-card__image ${className}`}
        alt={alt}
        {...props}
      />
    </div>
  );
});

CardImage.displayName = 'CardImage';