import React from 'react';
import { Container } from './Container';

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'simple' | 'detailed' | 'minimal';
}

export const Footer = React.forwardRef<HTMLElement, FooterProps>(({
  children,
  variant = 'simple',
  className = '',
  ...props
}, ref) => {
  const variantClasses = {
    simple: 'py-8',
    detailed: 'py-12',
    minimal: 'py-4'
  };
  
  const baseClasses = '';
  
  const combinedClassName = [
    baseClasses,
    variantClasses[variant],
    className
  ].filter(Boolean).join(' ');
  
  return (
    <footer ref={ref} className={combinedClassName} {...props}>
      <Container>
        {children}
      </Container>
    </footer>
  );
});

Footer.displayName = 'Footer';

export interface FooterSectionProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FooterSection = React.forwardRef<HTMLDivElement, FooterSectionProps>(({
  children,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'text-left';
  
  const combinedClassName = [
    baseClasses,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div ref={ref} className={combinedClassName} {...props}>
      {children}
    </div>
  );
});

FooterSection.displayName = 'FooterSection';

export interface FooterTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const FooterTitle = React.forwardRef<HTMLHeadingElement, FooterTitleProps>(({
  children,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'font-semibold text-gray-900 mb-4 text-left';
  
  const combinedClassName = [
    baseClasses,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <h3 ref={ref} className={combinedClassName} {...props}>
      {children}
    </h3>
  );
});

FooterTitle.displayName = 'FooterTitle';

export interface FooterLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

export const FooterLink = React.forwardRef<HTMLAnchorElement, FooterLinkProps>(({
  children,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'text-gray-600 hover:text-gray-900 transition-colors';
  
  const combinedClassName = [
    baseClasses,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <a ref={ref} className={combinedClassName} {...props}>
      {children}
    </a>
  );
});

FooterLink.displayName = 'FooterLink';

export interface FooterLinksProps extends React.HTMLAttributes<HTMLUListElement> {
  spacing?: 'sm' | 'md' | 'lg';
}

export const FooterLinks = React.forwardRef<HTMLUListElement, FooterLinksProps>(({
  children,
  spacing = 'md',
  className = '',
  ...props
}, ref) => {
  const spacingClasses = {
    sm: 'space-y-1',
    md: 'space-y-2',
    lg: 'space-y-3'
  };
  
  const combinedClassName = [
    spacingClasses[spacing],
    'text-left',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <ul ref={ref} className={combinedClassName} {...props}>
      {React.Children.map(children, (child) => (
        <li className="text-left">{child}</li>
      ))}
    </ul>
  );
});

FooterLinks.displayName = 'FooterLinks';

export interface FooterGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

export const FooterGrid = React.forwardRef<HTMLDivElement, FooterGridProps>(({
  children,
  cols = 4,
  gap = 'lg',
  className = '',
  ...props
}, ref) => {
  const colsClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
  };
  
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  };
  
  const baseClasses = 'grid';
  
  const combinedClassName = [
    baseClasses,
    colsClasses[cols],
    gapClasses[gap],
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div ref={ref} className={combinedClassName} {...props}>
      {children}
    </div>
  );
});

FooterGrid.displayName = 'FooterGrid';

export interface FooterBottomProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FooterBottom = React.forwardRef<HTMLDivElement, FooterBottomProps>(({
  children,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'mt-8 pt-8 text-sm text-gray-600';
  
  const combinedClassName = [
    baseClasses,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div ref={ref} className={combinedClassName} {...props}>
      {children}
    </div>
  );
});

FooterBottom.displayName = 'FooterBottom';