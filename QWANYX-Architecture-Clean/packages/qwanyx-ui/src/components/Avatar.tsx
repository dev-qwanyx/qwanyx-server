import React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;  // For generating initials
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square';
  fallback?: string | React.ReactNode;
  status?: 'online' | 'offline' | 'away' | 'busy';
  statusPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(({
  src,
  alt = '',
  name,
  size = 'md',
  shape = 'circle',
  fallback,
  status,
  statusPosition = 'bottom-right',
  className = '',
  style,
  children,
  ...props
}, ref) => {
  const [imageError, setImageError] = React.useState(false);
  
  // Size mappings
  const sizeMap = {
    xs: '24px',
    sm: '32px',
    md: '40px',
    lg: '48px',
    xl: '56px',
    '2xl': '64px'
  };
  
  const statusSizeMap = {
    xs: '6px',
    sm: '8px',
    md: '10px',
    lg: '12px',
    xl: '14px',
    '2xl': '16px'
  };
  
  const fontSizeMap = {
    xs: '10px',
    sm: '12px',
    md: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px'
  };
  
  // Generate initials from name
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };
  
  // Generate color from name for initials
  const getColorFromName = (name: string) => {
    const colors = [
      'rgb(var(--qwanyx-primary))',
      'rgb(var(--qwanyx-secondary))',
      'rgb(var(--qwanyx-accent))',
      'rgb(var(--qwanyx-success))',
      'rgb(var(--qwanyx-warning))',
      'rgb(var(--qwanyx-error))',
      'rgb(var(--qwanyx-info))'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };
  
  // Status colors
  const statusColors = {
    online: 'rgb(var(--qwanyx-success))',
    offline: 'rgb(var(--qwanyx-muted))',
    away: 'rgb(var(--qwanyx-warning))',
    busy: 'rgb(var(--qwanyx-error))'
  };
  
  // Status positions
  const getStatusPosition = () => {
    const positions = {
      'top-right': { top: '0', right: '0' },
      'top-left': { top: '0', left: '0' },
      'bottom-right': { bottom: '0', right: '0' },
      'bottom-left': { bottom: '0', left: '0' }
    };
    return positions[statusPosition];
  };
  
  // Avatar container styles
  const avatarStyles: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: sizeMap[size],
    height: sizeMap[size],
    borderRadius: shape === 'circle' ? '50%' : 'var(--radius)',
    backgroundColor: (!src || imageError) 
      ? (name ? getColorFromName(name) : 'rgb(var(--qwanyx-muted))') 
      : 'transparent',
    overflow: 'hidden',
    flexShrink: 0,
    userSelect: 'none',
    ...style
  };
  
  // Image styles
  const imageStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };
  
  // Fallback styles
  const fallbackStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    fontSize: fontSizeMap[size],
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.95)'
  };
  
  // Status styles
  const statusStyles: React.CSSProperties = {
    position: 'absolute',
    width: statusSizeMap[size],
    height: statusSizeMap[size],
    backgroundColor: statusColors[status!],
    borderRadius: '50%',
    border: `2px solid rgb(var(--background))`,
    ...getStatusPosition()
  };
  
  const renderContent = () => {
    if (src && !imageError) {
      return (
        <img
          src={src}
          alt={alt || name}
          style={imageStyles}
          onError={() => setImageError(true)}
        />
      );
    }
    
    if (fallback) {
      if (typeof fallback === 'string') {
        return <span style={fallbackStyles}>{fallback}</span>;
      }
      return fallback;
    }
    
    if (name) {
      return <span style={fallbackStyles}>{getInitials(name)}</span>;
    }
    
    // Default fallback icon
    return (
      <span style={fallbackStyles}>
        <svg width="60%" height="60%" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </span>
    );
  };
  
  const combinedClassName = [
    'qwanyx-avatar',
    `qwanyx-avatar--${size}`,
    `qwanyx-avatar--${shape}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div ref={ref} className={combinedClassName} style={avatarStyles} {...props}>
      {renderContent()}
      {children}
      {status && <span style={statusStyles} />}
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
  style,
  ...props
}, ref) => {
  const spacingMap = {
    tight: '-8px',
    normal: '-12px',
    loose: '-16px'
  };
  
  const groupStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    ...style
  };
  
  const childrenArray = React.Children.toArray(children);
  const visibleChildren = childrenArray.slice(0, max);
  const remainingCount = childrenArray.length - max;
  
  const combinedClassName = [
    'qwanyx-avatar-group',
    `qwanyx-avatar-group--${spacing}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div ref={ref} className={combinedClassName} style={groupStyles} {...props}>
      {visibleChildren.map((child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            size,
            style: {
              ...(child.props as any).style,
              marginLeft: index === 0 ? 0 : spacingMap[spacing],
              zIndex: visibleChildren.length - index,
              border: `2px solid rgb(var(--background))`
            }
          });
        }
        return child;
      })}
      {remainingCount > 0 && (
        <Avatar
          size={size}
          fallback={`+${remainingCount}`}
          style={{
            marginLeft: spacingMap[spacing],
            backgroundColor: 'rgb(var(--muted))',
            zIndex: 0
          }}
        />
      )}
    </div>
  );
});

AvatarGroup.displayName = 'AvatarGroup';

// Avatar with initials
export interface InitialsAvatarProps extends Omit<AvatarProps, 'fallback' | 'name'> {
  name: string;
  color?: 'auto' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
}

export const InitialsAvatar = React.forwardRef<HTMLDivElement, InitialsAvatarProps>(({
  name,
  color = 'auto',
  className = '',
  style,
  ...props
}, ref) => {
  const getBackgroundColor = () => {
    if (color === 'auto') {
      const colors = [
        'rgb(var(--primary))',
        'rgb(var(--secondary))',
        'rgb(var(--accent))',
        'rgb(var(--success))',
        'rgb(var(--warning))',
        'rgb(var(--error))',
        'rgb(var(--info))'
      ];
      
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
    }
    
    const colorMap: Record<string, string> = {
      primary: 'rgb(var(--primary))',
      secondary: 'rgb(var(--secondary))',
      accent: 'rgb(var(--accent))',
      success: 'rgb(var(--success))',
      warning: 'rgb(var(--warning))',
      error: 'rgb(var(--error))',
      info: 'rgb(var(--info))'
    };
    
    return colorMap[color] || 'rgb(var(--muted))';
  };
  
  return (
    <Avatar
      ref={ref}
      name={name}
      className={className}
      style={{
        backgroundColor: getBackgroundColor(),
        ...style
      }}
      {...props}
    />
  );
});

InitialsAvatar.displayName = 'InitialsAvatar';