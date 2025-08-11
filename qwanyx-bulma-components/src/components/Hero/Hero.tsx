import React from 'react';
import { cn } from '../../utils/classNames';

interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  color?: 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger' | 'dark' | 'light' | 'white' | 'black';
  size?: 'small' | 'medium' | 'large' | 'halfheight' | 'fullheight' | 'fullheight-with-navbar';
  bold?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

interface HeroPartProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: keyof JSX.IntrinsicElements;
}

// Main Hero Component
export const Hero = React.forwardRef<HTMLElement, HeroProps>(({
  color,
  size,
  bold = false,
  as: Component = 'section',
  className,
  children,
  ...rest
}, ref) => {
  const heroClasses = cn(
    'hero',
    color && `is-${color}`,
    size && `is-${size}`,
    bold && 'is-bold',
    className
  );

  return React.createElement(
    Component,
    {
      ref,
      className: heroClasses,
      ...rest
    },
    children
  );
});

// Hero Head
export const HeroHead = React.forwardRef<HTMLDivElement, HeroPartProps>(({
  as: Component = 'div',
  className,
  children,
  ...rest
}, ref) => {
  return React.createElement(
    Component,
    {
      ref,
      className: cn('hero-head', className),
      ...rest
    },
    children
  );
});

// Hero Body
export const HeroBody = React.forwardRef<HTMLDivElement, HeroPartProps>(({
  as: Component = 'div',
  className,
  children,
  ...rest
}, ref) => {
  return React.createElement(
    Component,
    {
      ref,
      className: cn('hero-body', className),
      ...rest
    },
    children
  );
});

// Hero Foot
export const HeroFoot = React.forwardRef<HTMLDivElement, HeroPartProps>(({
  as: Component = 'div',
  className,
  children,
  ...rest
}, ref) => {
  return React.createElement(
    Component,
    {
      ref,
      className: cn('hero-foot', className),
      ...rest
    },
    children
  );
});

Hero.displayName = 'Hero';
HeroHead.displayName = 'HeroHead';
HeroBody.displayName = 'HeroBody';
HeroFoot.displayName = 'HeroFoot';

export default Hero;