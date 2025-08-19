import React from 'react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({
  children,
  variant = 'info',
  title,
  dismissible = false,
  onDismiss,
  className = '',
  style,
  ...props
}, ref) => {
  const variantStyles = {
    info: {
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      color: 'rgb(59, 130, 246)'
    },
    success: {
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      borderColor: 'rgba(34, 197, 94, 0.3)',
      color: 'rgb(34, 197, 94)'
    },
    warning: {
      backgroundColor: 'rgba(250, 204, 21, 0.1)',
      borderColor: 'rgba(250, 204, 21, 0.3)',
      color: 'rgb(200, 150, 0)'
    },
    error: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: 'rgba(239, 68, 68, 0.3)',
      color: 'rgb(239, 68, 68)'
    }
  };

  const alertStyle = {
    border: '1px solid',
    borderRadius: '8px',
    padding: '1rem',
    display: 'flex',
    gap: '0.75rem',
    ...variantStyles[variant],
    ...style
  };

  const iconStyle = {
    flexShrink: 0,
    width: '20px',
    height: '20px'
  };

  const contentStyle = {
    flex: 1,
    minWidth: 0
  };

  const titleStyle = {
    fontSize: '0.875rem',
    fontWeight: 600,
    marginBottom: '0.25rem',
    margin: 0,
    color: '#1f2937'
  };

  const messageStyle = {
    fontSize: '0.875rem',
    color: '#4b5563',
    lineHeight: 1.5
  };

  const dismissButtonStyle = {
    flexShrink: 0,
    background: 'none',
    border: 'none',
    padding: '0.25rem',
    cursor: 'pointer',
    color: 'currentColor',
    opacity: 0.6,
    borderRadius: '4px',
    transition: 'opacity 200ms ease'
  };

  const icons = {
    info: (
      <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    success: (
      <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg style={iconStyle} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    )
  };

  const combinedClassName = [
    'qwanyx-alert',
    `qwanyx-alert--${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={combinedClassName} style={alertStyle} role="alert" {...props}>
      {icons[variant]}
      <div style={contentStyle}>
        {title && (
          <h3 style={titleStyle}>{title}</h3>
        )}
        <div style={messageStyle}>{children}</div>
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          style={dismissButtonStyle}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
          aria-label="Dismiss"
        >
          <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
});

Alert.displayName = 'Alert';