import React from 'react';
import { cn } from '../../utils/classNames';

type ColumnSize = 
  | 'full' | 'four-fifths' | 'three-quarters' | 'two-thirds' | 'three-fifths' 
  | 'half' | 'two-fifths' | 'one-third' | 'one-quarter' | 'one-fifth'
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface ColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ColumnSize;
  offset?: ColumnSize;
  narrow?: boolean;
  mobile?: ColumnSize;
  tablet?: ColumnSize;
  desktop?: ColumnSize;
  widescreen?: ColumnSize;
  fullhd?: ColumnSize;
  as?: keyof JSX.IntrinsicElements;
}

export const Column = React.forwardRef<HTMLDivElement, ColumnProps>(({
  size,
  offset,
  narrow = false,
  mobile,
  tablet,
  desktop,
  widescreen,
  fullhd,
  as: Component = 'div',
  className,
  children,
  ...rest
}, ref) => {
  const columnClasses = cn(
    'column',
    size && `is-${size}`,
    offset && `is-offset-${offset}`,
    narrow && 'is-narrow',
    mobile && `is-${mobile}-mobile`,
    tablet && `is-${tablet}-tablet`,
    desktop && `is-${desktop}-desktop`,
    widescreen && `is-${widescreen}-widescreen`,
    fullhd && `is-${fullhd}-fullhd`,
    className
  );

  return React.createElement(
    Component,
    {
      ref,
      className: columnClasses,
      ...rest
    },
    children
  );
});

Column.displayName = 'Column';

export default Column;