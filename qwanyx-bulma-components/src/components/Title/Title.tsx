import React from 'react';
import { cn } from '../../utils/classNames';

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  size?: 1 | 2 | 3 | 4 | 5 | 6;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
  spaced?: boolean;
  subtitle?: boolean;
}

const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(({
  size,
  as,
  spaced = false,
  subtitle = false,
  className,
  children,
  ...rest
}, ref) => {
  // Determine element based on size or as prop
  const Component = as || (size ? `h${size}` : 'h3') as keyof JSX.IntrinsicElements;
  
  const titleClasses = cn(
    subtitle ? 'subtitle' : 'title',
    size && `is-${size}`,
    spaced && 'is-spaced',
    className
  );

  return React.createElement(
    Component,
    {
      ref,
      className: titleClasses,
      ...rest
    },
    children
  );
});

// Subtitle convenience component
export const Subtitle = React.forwardRef<HTMLHeadingElement, TitleProps>((props, ref) => {
  return <Title {...props} ref={ref} subtitle />;
});

Title.displayName = 'Title';
Subtitle.displayName = 'Subtitle';

export default Title;