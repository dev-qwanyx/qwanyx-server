import React from 'react';
import { cn } from '../../utils/classNames';

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger' | 'dark' | 'light' | 'white' | 'black';
  size?: 'normal' | 'medium' | 'large';
  rounded?: boolean;
  light?: boolean;
  delete?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

interface TagsProps extends React.HTMLAttributes<HTMLDivElement> {
  addons?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(({
  color,
  size,
  rounded = false,
  light = false,
  delete: isDelete = false,
  as: Component = 'span',
  className,
  children,
  ...rest
}, ref) => {
  const tagClasses = cn(
    'tag',
    color && `is-${color}`,
    size && size !== 'normal' && `is-${size}`,
    rounded && 'is-rounded',
    light && 'is-light',
    isDelete && 'is-delete',
    className
  );

  return React.createElement(
    Component,
    {
      ref,
      className: tagClasses,
      ...rest
    },
    children
  );
});

export const Tags = React.forwardRef<HTMLDivElement, TagsProps>(({
  addons = false,
  as: Component = 'div',
  className,
  children,
  ...rest
}, ref) => {
  const tagsClasses = cn(
    'tags',
    addons && 'has-addons',
    className
  );

  return React.createElement(
    Component,
    {
      ref,
      className: tagsClasses,
      ...rest
    },
    children
  );
});

Tag.displayName = 'Tag';
Tags.displayName = 'Tags';

export default Tag;