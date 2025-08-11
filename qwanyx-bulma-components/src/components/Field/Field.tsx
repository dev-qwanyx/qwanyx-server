import React from 'react';
import { cn } from '../../utils/classNames';

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  grouped?: boolean | 'centered' | 'right' | 'multiline';
  addons?: boolean | 'centered' | 'right';
  horizontal?: boolean;
  narrow?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

interface FieldLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'small' | 'normal' | 'medium' | 'large';
  as?: keyof JSX.IntrinsicElements;
}

interface FieldBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: keyof JSX.IntrinsicElements;
}

// Main Field Component
export const Field = React.forwardRef<HTMLDivElement, FieldProps>(({
  grouped,
  addons,
  horizontal = false,
  narrow = false,
  as: Component = 'div',
  className,
  children,
  ...rest
}, ref) => {
  const fieldClasses = cn(
    'field',
    grouped === true && 'is-grouped',
    grouped === 'centered' && 'is-grouped is-grouped-centered',
    grouped === 'right' && 'is-grouped is-grouped-right',
    grouped === 'multiline' && 'is-grouped is-grouped-multiline',
    addons === true && 'has-addons',
    addons === 'centered' && 'has-addons has-addons-centered',
    addons === 'right' && 'has-addons has-addons-right',
    horizontal && 'is-horizontal',
    narrow && 'is-narrow',
    className
  );

  return React.createElement(
    Component,
    {
      ref,
      className: fieldClasses,
      ...rest
    },
    children
  );
});

// Field Label (for horizontal fields)
export const FieldLabel = React.forwardRef<HTMLDivElement, FieldLabelProps>(({
  size,
  as: Component = 'div',
  className,
  children,
  ...rest
}, ref) => {
  const labelClasses = cn(
    'field-label',
    size && `is-${size}`,
    className
  );

  return React.createElement(
    Component,
    {
      ref,
      className: labelClasses,
      ...rest
    },
    children
  );
});

// Field Body (for horizontal fields)
export const FieldBody = React.forwardRef<HTMLDivElement, FieldBodyProps>(({
  as: Component = 'div',
  className,
  children,
  ...rest
}, ref) => {
  return React.createElement(
    Component,
    {
      ref,
      className: cn('field-body', className),
      ...rest
    },
    children
  );
});

Field.displayName = 'Field';
FieldLabel.displayName = 'FieldLabel';
FieldBody.displayName = 'FieldBody';

export default Field;