import React, { useState, useEffect } from 'react';

export interface LogoProps {
  src?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  variant?: 'default' | 'white' | 'dark';
  asLink?: boolean;
  href?: string;
  fallbackToText?: boolean;
  text?: string;
  autoDetect?: boolean; // Auto-detect best available format
}

export const Logo: React.FC<LogoProps> = ({
  src,
  alt = 'Logo',
  width = 120,
  height = 40,
  className = '',
  variant = 'default',
  asLink = true,
  href = '/',
  fallbackToText = true,
  text = 'QWANYX',
  autoDetect = true
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [imageError, setImageError] = useState(false);

  // Default paths for different variants and formats
  const getLogoPath = () => {
    if (src) return src;
    
    const basePath = '/images/logo';
    const variantSuffix = variant === 'default' ? '' : `-${variant}`;
    
    // Try different formats in order of preference
    const formats = ['.svg', '.png', '.jpg', '.webp'];
    
    if (!autoDetect) {
      return `${basePath}${variantSuffix}.svg`; // Default to SVG
    }
    
    // In production, you'd check which files exist
    // For now, return the first format
    return `${basePath}${variantSuffix}${formats[0]}`;
  };

  useEffect(() => {
    setImageSrc(getLogoPath());
    setImageError(false);
  }, [src, variant]);

  const handleImageError = () => {
    setImageError(true);
    
    // Try fallback formats
    const basePath = '/images/logo';
    const variantSuffix = variant === 'default' ? '' : `-${variant}`;
    const formats = ['.png', '.jpg', '.webp'];
    
    // Try next format
    for (const format of formats) {
      const testSrc = `${basePath}${variantSuffix}${format}`;
      if (testSrc !== imageSrc) {
        setImageSrc(testSrc);
        return;
      }
    }
  };

  // Fallback to text logo if image fails
  if (imageError && fallbackToText) {
    return <TextLogo text={text} asLink={asLink} href={href} className={className} />;
  }

  const logoElement = (
    <img
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={`logo ${className}`}
      onError={handleImageError}
      style={{
        maxWidth: '100%',
        height: 'auto',
        display: 'block'
      }}
    />
  );

  if (asLink) {
    return (
      <a 
        href={href}
        className="logo-link inline-block"
        aria-label={alt}
      >
        {logoElement}
      </a>
    );
  }

  return logoElement;
};

// Text-based logo component (fallback or alternative)
export interface TextLogoProps {
  text?: string;
  tagline?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  asLink?: boolean;
  href?: string;
}

export const TextLogo: React.FC<TextLogoProps> = ({
  text = 'QWANYX',
  tagline,
  className = '',
  size = 'md',
  asLink = true,
  href = '/'
}) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const logoElement = (
    <div className={`text-logo ${className}`}>
      <span className={`font-bold ${sizeClasses[size]} tracking-tight`}>
        {text}
      </span>
      {tagline && (
        <span className="block text-xs text-gray-500 mt-1">
          {tagline}
        </span>
      )}
    </div>
  );

  if (asLink) {
    return (
      <a 
        href={href}
        className="logo-link inline-block no-underline text-inherit hover:opacity-80 transition-opacity"
      >
        {logoElement}
      </a>
    );
  }

  return logoElement;
};