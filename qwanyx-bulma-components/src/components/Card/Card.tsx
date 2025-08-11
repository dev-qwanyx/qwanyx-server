import React from 'react';
import { cn } from '../../utils/classNames';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: keyof JSX.IntrinsicElements;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
}

interface CardImageProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: keyof JSX.IntrinsicElements;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: keyof JSX.IntrinsicElements;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
}

// Main Card Component
export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  as: Component = 'div',
  className,
  children,
  ...rest
}, ref) => {
  return React.createElement(
    Component,
    {
      ref,
      className: cn('card', className),
      ...rest
    },
    children
  );
});

// Card Header
export const CardHeader = React.forwardRef<HTMLElement, CardHeaderProps>(({
  as: Component = 'header',
  className,
  children,
  ...rest
}, ref) => {
  return React.createElement(
    Component,
    {
      ref,
      className: cn('card-header', className),
      ...rest
    },
    children
  );
});

// Card Header Title
export const CardHeaderTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({
  className,
  children,
  ...rest
}, ref) => {
  return (
    <p ref={ref} className={cn('card-header-title', className)} {...rest}>
      {children}
    </p>
  );
});

// Card Header Icon
export const CardHeaderIcon = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({
  className,
  children,
  ...rest
}, ref) => {
  return (
    <button ref={ref} className={cn('card-header-icon', className)} {...rest}>
      {children}
    </button>
  );
});

// Card Image
export const CardImage = React.forwardRef<HTMLDivElement, CardImageProps>(({
  as: Component = 'div',
  className,
  children,
  ...rest
}, ref) => {
  return React.createElement(
    Component,
    {
      ref,
      className: cn('card-image', className),
      ...rest
    },
    children
  );
});

// Card Content
export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(({
  as: Component = 'div',
  className,
  children,
  ...rest
}, ref) => {
  return React.createElement(
    Component,
    {
      ref,
      className: cn('card-content', className),
      ...rest
    },
    children
  );
});

// Card Footer
export const CardFooter = React.forwardRef<HTMLElement, CardFooterProps>(({
  as: Component = 'footer',
  className,
  children,
  ...rest
}, ref) => {
  return React.createElement(
    Component,
    {
      ref,
      className: cn('card-footer', className),
      ...rest
    },
    children
  );
});

// Card Footer Item
export const CardFooterItem = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(({
  className,
  children,
  ...rest
}, ref) => {
  return (
    <a ref={ref} className={cn('card-footer-item', className)} {...rest}>
      {children}
    </a>
  );
});

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardHeaderTitle.displayName = 'CardHeaderTitle';
CardHeaderIcon.displayName = 'CardHeaderIcon';
CardImage.displayName = 'CardImage';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';
CardFooterItem.displayName = 'CardFooterItem';

export default Card;