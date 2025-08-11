import React from 'react';
import { cn } from '../../utils/classNames';

interface LevelProps extends React.HTMLAttributes<HTMLElement> {
  isMobile?: boolean;
}

interface LevelLeftProps extends React.HTMLAttributes<HTMLDivElement> {}
interface LevelRightProps extends React.HTMLAttributes<HTMLDivElement> {}
interface LevelItemProps extends React.HTMLAttributes<HTMLDivElement> {
  hasTextCentered?: boolean;
}

export const Level = React.forwardRef<HTMLElement, LevelProps>(({
  isMobile = false,
  className,
  children,
  ...rest
}, ref) => {
  const levelClasses = cn(
    'level',
    isMobile && 'is-mobile',
    className
  );

  return (
    <nav ref={ref} className={levelClasses} {...rest}>
      {children}
    </nav>
  );
});

export const LevelLeft = React.forwardRef<HTMLDivElement, LevelLeftProps>(({
  className,
  children,
  ...rest
}, ref) => {
  return (
    <div ref={ref} className={cn('level-left', className)} {...rest}>
      {children}
    </div>
  );
});

export const LevelRight = React.forwardRef<HTMLDivElement, LevelRightProps>(({
  className,
  children,
  ...rest
}, ref) => {
  return (
    <div ref={ref} className={cn('level-right', className)} {...rest}>
      {children}
    </div>
  );
});

export const LevelItem = React.forwardRef<HTMLDivElement, LevelItemProps>(({
  hasTextCentered = false,
  className,
  children,
  ...rest
}, ref) => {
  const itemClasses = cn(
    'level-item',
    hasTextCentered && 'has-text-centered',
    className
  );

  return (
    <div ref={ref} className={itemClasses} {...rest}>
      {children}
    </div>
  );
});

Level.displayName = 'Level';
LevelLeft.displayName = 'LevelLeft';
LevelRight.displayName = 'LevelRight';
LevelItem.displayName = 'LevelItem';

export default Level;