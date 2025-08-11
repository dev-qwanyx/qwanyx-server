import React from 'react';
import { cn } from '../../utils/classNames';

interface ControlProps extends React.HTMLAttributes<HTMLDivElement> {
  expanded?: boolean;
  hasIcons?: 'left' | 'right' | 'both';
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  as?: keyof JSX.IntrinsicElements;
}

const Control = React.forwardRef<HTMLDivElement, ControlProps>(({
  expanded = false,
  hasIcons,
  loading = false,
  size,
  as: Component = 'div',
  className,
  children,
  ...rest
}, ref) => {
  const controlClasses = cn(
    'control',
    expanded && 'is-expanded',
    hasIcons === 'left' && 'has-icons-left',
    hasIcons === 'right' && 'has-icons-right',
    hasIcons === 'both' && 'has-icons-left has-icons-right',
    loading && 'is-loading',
    size && `is-${size}`,
    className
  );

  return React.createElement(
    Component,
    {
      ref,
      className: controlClasses,
      ...rest
    },
    children
  );
});

Control.displayName = 'Control';

export default Control;