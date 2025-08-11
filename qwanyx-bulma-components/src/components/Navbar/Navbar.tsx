import React, { useState } from 'react';
import { cn } from '../../utils/classNames';

interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  color?: 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger' | 'dark' | 'light' | 'white' | 'black';
  fixed?: 'top' | 'bottom';
  transparent?: boolean;
  spaced?: boolean;
  shadow?: boolean;
}

interface NavbarBrandProps extends React.HTMLAttributes<HTMLDivElement> {}
interface NavbarBurgerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
}
interface NavbarMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
}
interface NavbarStartProps extends React.HTMLAttributes<HTMLDivElement> {}
interface NavbarEndProps extends React.HTMLAttributes<HTMLDivElement> {}
interface NavbarItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  as?: keyof JSX.IntrinsicElements;
  isActive?: boolean;
  hasDropdown?: boolean;
  hoverable?: boolean;
  isExpanded?: boolean;
  isTab?: boolean;
}
interface NavbarLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  isArrowless?: boolean;
}
interface NavbarDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  isBoxed?: boolean;
  isRight?: boolean;
}
interface NavbarDividerProps extends React.HTMLAttributes<HTMLHRElement> {}

export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(({
  color,
  fixed,
  transparent = false,
  spaced = false,
  shadow = false,
  className,
  children,
  ...rest
}, ref) => {
  const navbarClasses = cn(
    'navbar',
    color && `is-${color}`,
    fixed && `is-fixed-${fixed}`,
    transparent && 'is-transparent',
    spaced && 'is-spaced',
    shadow && 'has-shadow',
    className
  );

  return (
    <nav ref={ref} className={navbarClasses} role="navigation" aria-label="main navigation" {...rest}>
      {children}
    </nav>
  );
});

export const NavbarBrand = React.forwardRef<HTMLDivElement, NavbarBrandProps>(({
  className,
  children,
  ...rest
}, ref) => {
  return (
    <div ref={ref} className={cn('navbar-brand', className)} {...rest}>
      {children}
    </div>
  );
});

export const NavbarBurger = React.forwardRef<HTMLButtonElement, NavbarBurgerProps>(({
  isActive = false,
  className,
  onClick,
  ...rest
}, ref) => {
  const burgerClasses = cn(
    'navbar-burger',
    isActive && 'is-active',
    className
  );

  return (
    <button
      ref={ref}
      className={burgerClasses}
      aria-label="menu"
      aria-expanded={isActive}
      onClick={onClick}
      {...rest}
    >
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </button>
  );
});

export const NavbarMenu = React.forwardRef<HTMLDivElement, NavbarMenuProps>(({
  isActive = false,
  className,
  children,
  ...rest
}, ref) => {
  const menuClasses = cn(
    'navbar-menu',
    isActive && 'is-active',
    className
  );

  return (
    <div ref={ref} className={menuClasses} {...rest}>
      {children}
    </div>
  );
});

export const NavbarStart = React.forwardRef<HTMLDivElement, NavbarStartProps>(({
  className,
  children,
  ...rest
}, ref) => {
  return (
    <div ref={ref} className={cn('navbar-start', className)} {...rest}>
      {children}
    </div>
  );
});

export const NavbarEnd = React.forwardRef<HTMLDivElement, NavbarEndProps>(({
  className,
  children,
  ...rest
}, ref) => {
  return (
    <div ref={ref} className={cn('navbar-end', className)} {...rest}>
      {children}
    </div>
  );
});

export const NavbarItem = React.forwardRef<HTMLAnchorElement, NavbarItemProps>(({
  as: Component = 'a',
  isActive = false,
  hasDropdown = false,
  hoverable = false,
  isExpanded = false,
  isTab = false,
  className,
  children,
  ...rest
}, ref) => {
  const itemClasses = cn(
    'navbar-item',
    isActive && 'is-active',
    hasDropdown && 'has-dropdown',
    hoverable && 'is-hoverable',
    isExpanded && 'is-expanded',
    isTab && 'is-tab',
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

export const NavbarLink = React.forwardRef<HTMLAnchorElement, NavbarLinkProps>(({
  isArrowless = false,
  className,
  children,
  ...rest
}, ref) => {
  const linkClasses = cn(
    'navbar-link',
    isArrowless && 'is-arrowless',
    className
  );

  return (
    <a ref={ref} className={linkClasses} {...rest}>
      {children}
    </a>
  );
});

export const NavbarDropdown = React.forwardRef<HTMLDivElement, NavbarDropdownProps>(({
  isBoxed = false,
  isRight = false,
  className,
  children,
  ...rest
}, ref) => {
  const dropdownClasses = cn(
    'navbar-dropdown',
    isBoxed && 'is-boxed',
    isRight && 'is-right',
    className
  );

  return (
    <div ref={ref} className={dropdownClasses} {...rest}>
      {children}
    </div>
  );
});

export const NavbarDivider = React.forwardRef<HTMLHRElement, NavbarDividerProps>(({
  className,
  ...rest
}, ref) => {
  return (
    <hr ref={ref} className={cn('navbar-divider', className)} {...rest} />
  );
});

Navbar.displayName = 'Navbar';
NavbarBrand.displayName = 'NavbarBrand';
NavbarBurger.displayName = 'NavbarBurger';
NavbarMenu.displayName = 'NavbarMenu';
NavbarStart.displayName = 'NavbarStart';
NavbarEnd.displayName = 'NavbarEnd';
NavbarItem.displayName = 'NavbarItem';
NavbarLink.displayName = 'NavbarLink';
NavbarDropdown.displayName = 'NavbarDropdown';
NavbarDivider.displayName = 'NavbarDivider';

export default Navbar;