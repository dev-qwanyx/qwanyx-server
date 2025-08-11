import React from 'react';
import { cn } from '../../utils/classNames';

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: keyof JSX.IntrinsicElements;
}

const Box = React.forwardRef<HTMLDivElement, BoxProps>(({
  as: Component = 'div',
  className,
  children,
  ...rest
}, ref) => {
  const boxClasses = cn('box', className);

  return React.createElement(
    Component,
    {
      ref,
      className: boxClasses,
      ...rest
    },
    children
  );
});

Box.displayName = 'Box';

export default Box;