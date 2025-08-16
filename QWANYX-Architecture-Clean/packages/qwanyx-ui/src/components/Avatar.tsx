import React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square';
  fallback?: string | React.ReactNode;
  status?: 'online' | 'offline' | 'away' | 'busy';
  statusPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(({
  src,
  alt = '',
  size = 'md',
  shape = 'circle',
  fallback,
  status,
  statusPosition = 'bottom-right',
  className = '',
  children,
  ...props
}, ref) => {
  const combinedClassName = [
    'qwanyx-avatar',
    `qwanyx-avatar--${size}`,
    `qwanyx-avatar--${shape}`,
    className
  ].filter(Boolean).join(' ');
  
  const renderFallback = () => {
    if (typeof fallback === 'string') {
      return (
        <span className="qwanyx-avatar__fallback">
          {fallback}
        </span>
      );
    }
    return fallback;
  };
  
  return (
    <div ref={ref} className={combinedClassName} {...props}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="qwanyx-avatar__image"
        />
      ) : (
        renderFallback()
      )}
      {children}
      {status && (
        <span
          className={`qwanyx-avatar__status qwanyx-avatar__status--${status} qwanyx-avatar__status--${statusPosition}`}
        />
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

// Avatar Group component
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  spacing?: 'tight' | 'normal' | 'loose';
}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(({
  children,
  max = 5,
  size = 'md',
  spacing = 'normal',
  className = '',
  ...props
}, ref) => {
  const combinedClassName = [
    'qwanyx-avatar-group',
    `qwanyx-avatar-group--${spacing}`,
    className
  ].filter(Boolean).join(' ');
  
  const childrenArray = React.Children.toArray(children);
  const visibleChildren = childrenArray.slice(0, max);
  const remainingCount = childrenArray.length - max;
  
  return (
    <div ref={ref} className={combinedClassName} {...props}>
      {visibleChildren.map((child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            size,
            className: `${(child.props as any).className || ''}`
          });
        }
        return child;
      })}
      {remainingCount > 0 && (
        <Avatar
          size={size}
          fallback={`+${remainingCount}`}
          className="qwanyx-avatar--count"
        />
      )}
    </div>
  );
});

AvatarGroup.displayName = 'AvatarGroup';

// Avatar with initials
export interface InitialsAvatarProps extends Omit<AvatarProps, 'fallback'> {
  name: string;
  color?: 'auto' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
}

export const InitialsAvatar = React.forwardRef<HTMLDivElement, InitialsAvatarProps>(({
  name,
  color = 'auto',
  className = '',
  ...props
}, ref) => {
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };
  
  const getColorIndexFromName = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 9;
  };
  
  const getColorClass = () => {
    if (color === 'auto') {
      return `qwanyx-avatar--color-${getColorIndexFromName(name)}`;
    }
    return `qwanyx-avatar--${color}`;
  };
  
  return (
    <Avatar
      ref={ref}
      fallback={
        <span className="qwanyx-avatar--initials">
          {getInitials(name)}
        </span>
      }
      className={`${getColorClass()} ${className}`}
      {...props}
    />
  );
});

InitialsAvatar.displayName = 'InitialsAvatar';