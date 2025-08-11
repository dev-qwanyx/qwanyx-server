import React from 'react';
import { cn } from '../../utils/classNames';

interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  alignment?: 'centered' | 'right';
  size?: 'small' | 'normal' | 'medium' | 'large';
  rounded?: boolean;
}

interface PaginationPreviousProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
interface PaginationNextProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
interface PaginationLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  isCurrent?: boolean;
}
interface PaginationEllipsisProps extends React.HTMLAttributes<HTMLSpanElement> {}
interface PaginationListProps extends React.HTMLAttributes<HTMLUListElement> {}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(({
  alignment,
  size,
  rounded = false,
  className,
  children,
  ...rest
}, ref) => {
  const paginationClasses = cn(
    'pagination',
    alignment && `is-${alignment}`,
    size && size !== 'normal' && `is-${size}`,
    rounded && 'is-rounded',
    className
  );

  return (
    <nav ref={ref} className={paginationClasses} role="navigation" aria-label="pagination" {...rest}>
      {children}
    </nav>
  );
});

export const PaginationPrevious = React.forwardRef<HTMLButtonElement, PaginationPreviousProps>(({
  className,
  children = 'Previous',
  ...rest
}, ref) => {
  return (
    <button ref={ref} className={cn('pagination-previous', className)} {...rest}>
      {children}
    </button>
  );
});

export const PaginationNext = React.forwardRef<HTMLButtonElement, PaginationNextProps>(({
  className,
  children = 'Next',
  ...rest
}, ref) => {
  return (
    <button ref={ref} className={cn('pagination-next', className)} {...rest}>
      {children}
    </button>
  );
});

export const PaginationLink = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(({
  isCurrent = false,
  className,
  children,
  ...rest
}, ref) => {
  const linkClasses = cn(
    'pagination-link',
    isCurrent && 'is-current',
    className
  );

  return (
    <a ref={ref} className={linkClasses} aria-label={`Page ${children}`} aria-current={isCurrent ? 'page' : undefined} {...rest}>
      {children}
    </a>
  );
});

export const PaginationEllipsis = React.forwardRef<HTMLSpanElement, PaginationEllipsisProps>(({
  className,
  ...rest
}, ref) => {
  return (
    <span ref={ref} className={cn('pagination-ellipsis', className)} {...rest}>
      &hellip;
    </span>
  );
});

export const PaginationList = React.forwardRef<HTMLUListElement, PaginationListProps>(({
  className,
  children,
  ...rest
}, ref) => {
  return (
    <ul ref={ref} className={cn('pagination-list', className)} {...rest}>
      {children}
    </ul>
  );
});

Pagination.displayName = 'Pagination';
PaginationPrevious.displayName = 'PaginationPrevious';
PaginationNext.displayName = 'PaginationNext';
PaginationLink.displayName = 'PaginationLink';
PaginationEllipsis.displayName = 'PaginationEllipsis';
PaginationList.displayName = 'PaginationList';

export default Pagination;