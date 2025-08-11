import React from 'react';
import { cn } from '../../utils/classNames';

type ColumnSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
  'three-quarters' | 'two-thirds' | 'half' | 'one-third' | 'one-quarter' |
  'full' | 'four-fifths' | 'three-fifths' | 'two-fifths' | 'one-fifth' |
  'narrow';

interface ColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ColumnSize;
  offset?: ColumnSize;
  narrow?: boolean;
  
  // Responsive sizes
  mobile?: ColumnSize;
  tablet?: ColumnSize;
  desktop?: ColumnSize;
  widescreen?: ColumnSize;
  fullhd?: ColumnSize;
  
  // Responsive offsets
  mobileOffset?: ColumnSize;
  tabletOffset?: ColumnSize;
  desktopOffset?: ColumnSize;
  widescreenOffset?: ColumnSize;
  fullhdOffset?: ColumnSize;
  
  as?: keyof JSX.IntrinsicElements;
}

const Column = React.forwardRef<HTMLDivElement, ColumnProps>(({
  size,
  offset,
  narrow = false,
  mobile,
  tablet,
  desktop,
  widescreen,
  fullhd,
  mobileOffset,
  tabletOffset,
  desktopOffset,
  widescreenOffset,
  fullhdOffset,
  as: Component = 'div',
  className,
  children,
  ...rest
}, ref) => {
  const columnClasses = cn(
    'column',
    
    // Base size
    size && `is-${size}`,
    offset && `is-offset-${offset}`,
    narrow && 'is-narrow',
    
    // Responsive sizes
    mobile && `is-${mobile}-mobile`,
    tablet && `is-${tablet}-tablet`,
    desktop && `is-${desktop}-desktop`,
    widescreen && `is-${widescreen}-widescreen`,
    fullhd && `is-${fullhd}-fullhd`,
    
    // Responsive offsets
    mobileOffset && `is-offset-${mobileOffset}-mobile`,
    tabletOffset && `is-offset-${tabletOffset}-tablet`,
    desktopOffset && `is-offset-${desktopOffset}-desktop`,
    widescreenOffset && `is-offset-${widescreenOffset}-widescreen`,
    fullhdOffset && `is-offset-${fullhdOffset}-fullhd`,
    
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