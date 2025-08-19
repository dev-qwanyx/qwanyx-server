/**
 * 🎨 Logo Component
 * Displays brand logo with optional text
 */

import React from 'react';

export interface LogoProps {
  src?: string;
  alt?: string;
  text?: string;
  href?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  src = '/logo.png',
  alt = 'Logo',
  text,
  href = '/',
  size = 'md',
  showText = true,
  className = '',
  style = {},
  onClick
}) => {
  const sizeMap = {
    sm: { height: '32px', fontSize: '1.25rem' },
    md: { height: '40px', fontSize: '1.5rem' },
    lg: { height: '48px', fontSize: '1.875rem' }
  };

  const logoStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.75rem',
    textDecoration: 'none',
    color: 'inherit',
    cursor: 'pointer',
    ...style
  };

  const imgStyle: React.CSSProperties = {
    height: sizeMap[size].height,
    width: 'auto',
    objectFit: 'contain'
  };

  const textStyle: React.CSSProperties = {
    fontSize: sizeMap[size].fontSize,
    fontWeight: 700,
    letterSpacing: '-0.025em'
  };

  const content = (
    <>
      <img 
        src={src} 
        alt={alt} 
        style={imgStyle}
      />
      {showText && text && (
        <span style={textStyle}>{text}</span>
      )}
    </>
  );

  if (href && !onClick) {
    return (
      <a 
        href={href} 
        className={`qwanyx-logo ${className}`.trim()}
        style={logoStyle}
      >
        {content}
      </a>
    );
  }

  return (
    <div 
      className={`qwanyx-logo ${className}`.trim()}
      style={logoStyle}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {content}
    </div>
  );
};