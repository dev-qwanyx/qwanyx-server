import React from 'react';
import { cn } from '../../utils/classNames';

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  alignment?: 'centered' | 'right';
  size?: 'small' | 'normal' | 'medium' | 'large';
  boxed?: boolean;
  toggle?: boolean;
  toggleRounded?: boolean;
  fullwidth?: boolean;
}

interface TabProps extends React.LIHTMLAttributes<HTMLLIElement> {
  isActive?: boolean;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(({
  alignment,
  size,
  boxed = false,
  toggle = false,
  toggleRounded = false,
  fullwidth = false,
  className,
  children,
  ...rest
}, ref) => {
  const tabsClasses = cn(
    'tabs',
    alignment && `is-${alignment}`,
    size && size !== 'normal' && `is-${size}`,
    boxed && 'is-boxed',
    toggle && 'is-toggle',
    toggleRounded && 'is-toggle-rounded',
    fullwidth && 'is-fullwidth',
    className
  );

  return (
    <div ref={ref} className={tabsClasses} {...rest}>
      <ul>{children}</ul>
    </div>
  );
});

export const Tab = React.forwardRef<HTMLLIElement, TabProps>(({
  isActive = false,
  className,
  children,
  ...rest
}, ref) => {
  const tabClasses = cn(
    isActive && 'is-active',
    className
  );

  return (
    <li ref={ref} className={tabClasses} {...rest}>
      {children}
    </li>
  );
});

Tabs.displayName = 'Tabs';
Tab.displayName = 'Tab';

export default Tabs;