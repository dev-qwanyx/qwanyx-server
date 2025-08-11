import React from 'react';
import { cn } from '../../utils/classNames';

interface MessageProps extends React.HTMLAttributes<HTMLElement> {
  color?: 'dark' | 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'normal' | 'medium' | 'large';
}

interface MessageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
interface MessageBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Message = React.forwardRef<HTMLElement, MessageProps>(({
  color,
  size,
  className,
  children,
  ...rest
}, ref) => {
  const messageClasses = cn(
    'message',
    color && `is-${color}`,
    size && size !== 'normal' && `is-${size}`,
    className
  );

  return (
    <article ref={ref} className={messageClasses} {...rest}>
      {children}
    </article>
  );
});

export const MessageHeader = React.forwardRef<HTMLDivElement, MessageHeaderProps>(({
  className,
  children,
  ...rest
}, ref) => {
  return (
    <div ref={ref} className={cn('message-header', className)} {...rest}>
      {children}
    </div>
  );
});

export const MessageBody = React.forwardRef<HTMLDivElement, MessageBodyProps>(({
  className,
  children,
  ...rest
}, ref) => {
  return (
    <div ref={ref} className={cn('message-body', className)} {...rest}>
      {children}
    </div>
  );
});

Message.displayName = 'Message';
MessageHeader.displayName = 'MessageHeader';
MessageBody.displayName = 'MessageBody';

export default Message;