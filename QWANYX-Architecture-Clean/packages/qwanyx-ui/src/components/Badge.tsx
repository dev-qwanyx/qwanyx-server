import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'solid' | 'outline' | 'subtle';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'gray';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({
  children,
  variant = 'solid',
  color = 'primary',
  size = 'md',
  rounded = 'md',
  className = '',
  ...props
}, ref) => {
  const combinedClassName = [
    'qwanyx-badge',
    `qwanyx-badge--${size}`,
    `qwanyx-badge--rounded-${rounded}`,
    `qwanyx-badge--${variant}`,
    `qwanyx-badge--${color}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <span ref={ref} className={combinedClassName} {...props}>
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

// Badge with icon support
export interface IconBadgeProps extends BadgeProps {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const IconBadge = React.forwardRef<HTMLSpanElement, IconBadgeProps>(({
  children,
  icon,
  iconPosition = 'left',
  ...props
}, ref) => {
  return (
    <Badge ref={ref} {...props}>
      {icon && iconPosition === 'left' && (
        <span className={`qwanyx-badge__icon--${iconPosition}`}>{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className={`qwanyx-badge__icon--${iconPosition}`}>{icon}</span>
      )}
    </Badge>
  );
});

IconBadge.displayName = 'IconBadge';

// Badge with close button
export interface ClosableBadgeProps extends BadgeProps {
  onClose?: () => void;
}

export const ClosableBadge = React.forwardRef<HTMLSpanElement, ClosableBadgeProps>(({
  children,
  onClose,
  ...props
}, ref) => {
  return (
    <Badge ref={ref} {...props}>
      {children}
      {onClose && (
        <button
          onClick={onClose}
          className="qwanyx-badge__close"
          aria-label="Remove"
        >
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </Badge>
  );
});

ClosableBadge.displayName = 'ClosableBadge';

// Badge with dot indicator
export interface DotBadgeProps extends BadgeProps {
  dot?: boolean;
  dotPosition?: 'left' | 'right';
  dotColor?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
}

export const DotBadge = React.forwardRef<HTMLSpanElement, DotBadgeProps>(({
  children,
  dot = true,
  dotPosition = 'left',
  dotColor = 'primary',
  ...props
}, ref) => {
  return (
    <Badge ref={ref} {...props}>
      {dot && dotPosition === 'left' && (
        <span className={`qwanyx-badge__dot qwanyx-badge__dot--${dotPosition} qwanyx-badge__dot--${dotColor}`} />
      )}
      {children}
      {dot && dotPosition === 'right' && (
        <span className={`qwanyx-badge__dot qwanyx-badge__dot--${dotPosition} qwanyx-badge__dot--${dotColor}`} />
      )}
    </Badge>
  );
});

DotBadge.displayName = 'DotBadge';