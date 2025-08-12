import React from 'react';
import { Container } from './Container';

export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centered?: boolean;
  overlay?: boolean;
  overlayOpacity?: number;
  backgroundImage?: string;
  backgroundColor?: string;
}

export const Hero = React.forwardRef<HTMLElement, HeroProps>(({
  children,
  size = 'lg',
  centered = true,
  overlay = false,
  overlayOpacity = 0.5,
  backgroundImage,
  backgroundColor,
  className = '',
  style,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'py-12',
    md: 'py-20',
    lg: 'py-32',
    xl: 'py-48',
    full: 'min-h-screen flex items-center'
  };
  
  const baseClasses = 'relative overflow-hidden';
  const centerClasses = centered ? 'text-center' : '';
  
  const combinedClassName = [
    baseClasses,
    sizeClasses[size],
    centerClasses,
    className
  ].filter(Boolean).join(' ');
  
  const backgroundStyle: React.CSSProperties = {
    ...style,
    ...(backgroundImage && {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }),
    ...(backgroundColor && { backgroundColor })
  };
  
  return (
    <section ref={ref} className={combinedClassName} style={backgroundStyle} {...props}>
      {overlay && backgroundImage && (
        <div 
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: overlayOpacity }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export interface HeroTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3';
}

export const HeroTitle = React.forwardRef<HTMLHeadingElement, HeroTitleProps>(({
  children,
  as: Component = 'h1',
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'text-4xl md:text-5xl lg:text-6xl font-bold mb-6';
  
  const combinedClassName = [
    baseClasses,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <Component ref={ref as any} className={combinedClassName} {...props}>
      {children}
    </Component>
  );
});

HeroTitle.displayName = 'HeroTitle';

export interface HeroSubtitleProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const HeroSubtitle = React.forwardRef<HTMLParagraphElement, HeroSubtitleProps>(({
  children,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'text-lg md:text-xl lg:text-2xl mb-8 opacity-90';
  
  const combinedClassName = [
    baseClasses,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <p ref={ref} className={combinedClassName} {...props}>
      {children}
    </p>
  );
});

HeroSubtitle.displayName = 'HeroSubtitle';

export interface HeroContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const HeroContent = React.forwardRef<HTMLDivElement, HeroContentProps>(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <Container>
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    </Container>
  );
});

HeroContent.displayName = 'HeroContent';

export interface HeroActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: 'sm' | 'md' | 'lg';
}

export const HeroActions = React.forwardRef<HTMLDivElement, HeroActionsProps>(({
  children,
  spacing = 'md',
  className = '',
  ...props
}, ref) => {
  const spacingClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };
  
  const baseClasses = 'flex flex-wrap justify-center items-center';
  
  const combinedClassName = [
    baseClasses,
    spacingClasses[spacing],
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div ref={ref} className={combinedClassName} {...props}>
      {children}
    </div>
  );
});

HeroActions.displayName = 'HeroActions';