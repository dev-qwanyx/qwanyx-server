import React from 'react';
import { cn } from '../../utils/classNames';

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  separator?: 'arrow' | 'bullet' | 'dot' | 'succeeds';
  alignment?: 'centered' | 'right';
  size?: 'small' | 'normal' | 'medium' | 'large';
}

interface BreadcrumbItemProps extends React.LIHTMLAttributes<HTMLLIElement> {
  isActive?: boolean;
}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(({
  separator,
  alignment,
  size,
  className,
  children,
  ...rest
}, ref) => {
  const breadcrumbClasses = cn(
    'breadcrumb',
    separator && `has-${separator}-separator`,
    alignment && `is-${alignment}`,
    size && size !== 'normal' && `is-${size}`,
    className
  );

  return (
    <nav ref={ref} className={breadcrumbClasses} aria-label="breadcrumbs" {...rest}>
      <ul>{children}</ul>
    </nav>
  );
});

export const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(({
  isActive = false,
  className,
  children,
  ...rest
}, ref) => {
  const itemClasses = cn(
    isActive && 'is-active',
    className
  );

  return (
    <li ref={ref} className={itemClasses} {...rest}>
      {children}
    </li>
  );
});

Breadcrumb.displayName = 'Breadcrumb';
BreadcrumbItem.displayName = 'BreadcrumbItem';

export default Breadcrumb;