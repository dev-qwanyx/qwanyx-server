import React from 'react';
import { cn } from '../../utils/classNames';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  size?: 'small' | 'medium' | 'large';
  as?: keyof JSX.IntrinsicElements;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(({
  size,
  as: Component = 'section',
  className,
  children,
  ...rest
}, ref) => {
  const sectionClasses = cn(
    'section',
    size && `is-${size}`,
    className
  );

  return React.createElement(
    Component,
    {
      ref,
      className: sectionClasses,
      ...rest
    },
    children
  );
});

Section.displayName = 'Section';

export default Section;