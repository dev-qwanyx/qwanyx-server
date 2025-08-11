import React from 'react';
import { cn } from '../../utils/classNames';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  fluid?: boolean;
  maxWidth?: 'widescreen' | 'fullhd' | 'max-desktop' | 'max-widescreen';
  as?: keyof JSX.IntrinsicElements;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(({
  fluid = false,
  maxWidth,
  as: Component = 'div',
  className,
  children,
  ...rest
}, ref) => {
  const containerClasses = cn(
    'container',
    fluid && 'is-fluid',
    maxWidth && `is-${maxWidth}`,
    className
  );

  return React.createElement(
    Component,
    {
      ref,
      className: containerClasses,
      ...rest
    },
    children
  );
});

Container.displayName = 'Container';

export default Container;