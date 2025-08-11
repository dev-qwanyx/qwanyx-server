import React from 'react';
import { cn } from '../../utils/classNames';

interface ColumnsProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  multiline?: boolean;
  centered?: boolean;
  vcentered?: boolean;
  mobile?: boolean;
  desktop?: boolean;
  tablet?: boolean;
  variable?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

const Columns = React.forwardRef<HTMLDivElement, ColumnsProps>(({
  gap,
  multiline = false,
  centered = false,
  vcentered = false,
  mobile = false,
  desktop = false,
  tablet = false,
  variable = false,
  as: Component = 'div',
  className,
  children,
  ...rest
}, ref) => {
  const columnsClasses = cn(
    'columns',
    gap !== undefined && `is-${gap}`,
    multiline && 'is-multiline',
    centered && 'is-centered',
    vcentered && 'is-vcentered',
    mobile && 'is-mobile',
    desktop && 'is-desktop',
    tablet && 'is-tablet',
    variable && 'is-variable',
    className
  );

  return React.createElement(
    Component,
    {
      ref,
      className: columnsClasses,
      ...rest
    },
    children
  );
});

Columns.displayName = 'Columns';

export default Columns;