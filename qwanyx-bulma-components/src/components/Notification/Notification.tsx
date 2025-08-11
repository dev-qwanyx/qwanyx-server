import React from 'react';
import { cn } from '../../utils/classNames';

interface NotificationProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger' | 'dark' | 'light';
  light?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

const Notification = React.forwardRef<HTMLDivElement, NotificationProps>(({
  color,
  light = false,
  as: Component = 'div',
  className,
  children,
  ...rest
}, ref) => {
  const notificationClasses = cn(
    'notification',
    color && `is-${color}`,
    light && 'is-light',
    className
  );

  return React.createElement(
    Component,
    {
      ref,
      className: notificationClasses,
      ...rest
    },
    children
  );
});

Notification.displayName = 'Notification';

export default Notification;