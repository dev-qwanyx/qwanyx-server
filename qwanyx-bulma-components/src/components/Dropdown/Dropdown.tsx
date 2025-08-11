import React, { useState } from 'react';
import { cn } from '../../utils/classNames';

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
  isHoverable?: boolean;
  isRight?: boolean;
  isUp?: boolean;
}

interface DropdownTriggerProps extends React.HTMLAttributes<HTMLDivElement> {}
interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {}
interface DropdownContentProps extends React.HTMLAttributes<HTMLDivElement> {}
interface DropdownItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  as?: keyof JSX.IntrinsicElements;
  isActive?: boolean;
}
interface DropdownDividerProps extends React.HTMLAttributes<HTMLHRElement> {}

export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(({
  isActive = false,
  isHoverable = false,
  isRight = false,
  isUp = false,
  className,
  children,
  ...rest
}, ref) => {
  const dropdownClasses = cn(
    'dropdown',
    isActive && 'is-active',
    isHoverable && 'is-hoverable',
    isRight && 'is-right',
    isUp && 'is-up',
    className
  );

  return (
    <div ref={ref} className={dropdownClasses} {...rest}>
      {children}
    </div>
  );
});

export const DropdownTrigger = React.forwardRef<HTMLDivElement, DropdownTriggerProps>(({
  className,
  children,
  ...rest
}, ref) => {
  return (
    <div ref={ref} className={cn('dropdown-trigger', className)} {...rest}>
      {children}
    </div>
  );
});

export const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(({
  className,
  children,
  ...rest
}, ref) => {
  return (
    <div ref={ref} className={cn('dropdown-menu', className)} role="menu" {...rest}>
      {children}
    </div>
  );
});

export const DropdownContent = React.forwardRef<HTMLDivElement, DropdownContentProps>(({
  className,
  children,
  ...rest
}, ref) => {
  return (
    <div ref={ref} className={cn('dropdown-content', className)} {...rest}>
      {children}
    </div>
  );
});

export const DropdownItem = React.forwardRef<HTMLAnchorElement, DropdownItemProps>(({
  as: Component = 'a',
  isActive = false,
  className,
  children,
  ...rest
}, ref) => {
  const itemClasses = cn(
    'dropdown-item',
    isActive && 'is-active',
    className
  );

  return React.createElement(
    Component,
    {
      ref,
      className: itemClasses,
      ...rest
    },
    children
  );
});

export const DropdownDivider = React.forwardRef<HTMLHRElement, DropdownDividerProps>(({
  className,
  ...rest
}, ref) => {
  return (
    <hr ref={ref} className={cn('dropdown-divider', className)} {...rest} />
  );
});

Dropdown.displayName = 'Dropdown';
DropdownTrigger.displayName = 'DropdownTrigger';
DropdownMenu.displayName = 'DropdownMenu';
DropdownContent.displayName = 'DropdownContent';
DropdownItem.displayName = 'DropdownItem';
DropdownDivider.displayName = 'DropdownDivider';

export default Dropdown;