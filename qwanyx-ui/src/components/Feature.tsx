import React from 'react';

export interface FeatureProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  iconPosition?: 'top' | 'left' | 'right';
  centered?: boolean;
}

export const Feature = React.forwardRef<HTMLDivElement, FeatureProps>(({
  children,
  icon,
  iconPosition = 'top',
  centered = false,
  className = '',
  ...props
}, ref) => {
  const baseClasses = centered ? 'text-center' : '';
  
  const layoutClasses = {
    top: 'flex flex-col',
    left: 'flex flex-row items-start',
    right: 'flex flex-row-reverse items-start'
  };
  
  const iconSpacingClasses = {
    top: 'mb-4',
    left: 'mr-4',
    right: 'ml-4'
  };
  
  const combinedClassName = [
    baseClasses,
    icon ? layoutClasses[iconPosition] : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div ref={ref} className={combinedClassName} {...props}>
      {icon && (
        <div className={iconSpacingClasses[iconPosition]}>
          {icon}
        </div>
      )}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
});

Feature.displayName = 'Feature';

export interface FeatureIconProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'square' | 'none';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
}

export const FeatureIcon = React.forwardRef<HTMLDivElement, FeatureIconProps>(({
  children,
  size = 'md',
  variant = 'circle',
  color = 'primary',
  className = '',
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-lg',
    md: 'w-12 h-12 text-xl',
    lg: 'w-16 h-16 text-2xl',
    xl: 'w-20 h-20 text-3xl'
  };
  
  const variantClasses = {
    circle: 'rounded-full',
    square: 'rounded-lg',
    none: ''
  };
  
  const colorClasses = {
    primary: 'bg-blue-100 text-blue-600',
    secondary: 'bg-purple-100 text-purple-600',
    accent: 'bg-green-100 text-green-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    error: 'bg-red-100 text-red-600',
    info: 'bg-blue-100 text-blue-600'
  };
  
  const baseClasses = 'flex items-center justify-center';
  
  const combinedClassName = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    variant !== 'none' ? colorClasses[color] : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div ref={ref} className={combinedClassName} {...props}>
      {children}
    </div>
  );
});

FeatureIcon.displayName = 'FeatureIcon';

export interface FeatureTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h2' | 'h3' | 'h4' | 'h5';
}

export const FeatureTitle = React.forwardRef<HTMLHeadingElement, FeatureTitleProps>(({
  children,
  as: Component = 'h3',
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'text-xl font-semibold mb-2';
  
  const combinedClassName = [
    baseClasses,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <Component ref={ref as any} className={combinedClassName} {...props}>
      {children}
    </Component>
  );
});

FeatureTitle.displayName = 'FeatureTitle';

export interface FeatureDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const FeatureDescription = React.forwardRef<HTMLParagraphElement, FeatureDescriptionProps>(({
  children,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'text-gray-600';
  
  const combinedClassName = [
    baseClasses,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <p ref={ref} className={combinedClassName} {...props}>
      {children}
    </p>
  );
});

FeatureDescription.displayName = 'FeatureDescription';

// Features Grid component for layout
export interface FeaturesGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

export const FeaturesGrid = React.forwardRef<HTMLDivElement, FeaturesGridProps>(({
  children,
  cols = 3,
  gap = 'lg',
  className = '',
  ...props
}, ref) => {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };
  
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  };
  
  const baseClasses = 'grid';
  
  const combinedClassName = [
    baseClasses,
    colsClasses[cols],
    gapClasses[gap],
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div ref={ref} className={combinedClassName} {...props}>
      {children}
    </div>
  );
});

FeaturesGrid.displayName = 'FeaturesGrid';