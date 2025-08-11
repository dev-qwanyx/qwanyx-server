import React from 'react';
import { cn } from '../../utils/classNames';

interface MenuProps extends React.HTMLAttributes<HTMLElement> {}
interface MenuLabelProps extends React.HTMLAttributes<HTMLParagraphElement> {}
interface MenuListProps extends React.HTMLAttributes<HTMLUListElement> {}

export const Menu = React.forwardRef<HTMLElement, MenuProps>(({
  className,
  children,
  ...rest
}, ref) => {
  return (
    <aside ref={ref} className={cn('menu', className)} {...rest}>
      {children}
    </aside>
  );
});

export const MenuLabel = React.forwardRef<HTMLParagraphElement, MenuLabelProps>(({
  className,
  children,
  ...rest
}, ref) => {
  return (
    <p ref={ref} className={cn('menu-label', className)} {...rest}>
      {children}
    </p>
  );
});

export const MenuList = React.forwardRef<HTMLUListElement, MenuListProps>(({
  className,
  children,
  ...rest
}, ref) => {
  return (
    <ul ref={ref} className={cn('menu-list', className)} {...rest}>
      {children}
    </ul>
  );
});

Menu.displayName = 'Menu';
MenuLabel.displayName = 'MenuLabel';
MenuList.displayName = 'MenuList';

export default Menu;