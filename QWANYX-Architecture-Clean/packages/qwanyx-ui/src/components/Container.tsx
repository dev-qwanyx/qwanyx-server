import React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  center?: boolean;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(({
  children,
  size = 'xl',
  padding = 'md',
  center = true,
  className = '',
  style,
  ...props
}, ref) => {
  // Get max-width based on size
  const getMaxWidth = () => {
    switch (size) {
      case 'sm': return 'var(--container-sm)';
      case 'md': return 'var(--container-md)';
      case 'lg': return 'var(--container-lg)';
      case 'xl': return 'var(--container-xl)';
      case '2xl': return 'var(--container-2xl)';
      case 'full': return '100%';
      default: return 'var(--container-xl)';
    }
  };
  
  // Get padding based on padding prop
  const getPadding = () => {
    switch (padding) {
      case 'none': return '0';
      case 'sm': return 'var(--spacing-sm)';
      case 'md': return 'var(--spacing-md)';
      case 'lg': return 'var(--spacing-lg)';
      case 'xl': return 'var(--spacing-xl)';
      default: return 'var(--spacing-md)';
    }
  };
  
  const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: getMaxWidth(),
    marginLeft: center ? 'auto' : undefined,
    marginRight: center ? 'auto' : undefined,
    paddingLeft: getPadding(),
    paddingRight: getPadding(),
    ...style
  };
  
  return (
    <div ref={ref} className={className} style={containerStyle} {...props}>
      {children}
    </div>
  );
});

Container.displayName = 'Container';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fullHeight?: boolean;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(({
  children,
  spacing = 'lg',
  gap,
  fullHeight = false,
  className = '',
  style,
  ...props
}, ref) => {
  // Get spacing values
  const getSpacing = () => {
    switch (spacing) {
      case 'none': return '0';
      case 'sm': return 'var(--spacing-sm)';
      case 'md': return 'var(--spacing-md)';
      case 'lg': return 'var(--spacing-lg)';
      case 'xl': return 'var(--spacing-xl)';
      case '2xl': return 'var(--spacing-2xl)';
      default: return 'var(--spacing-lg)';
    }
  };
  
  const getGap = () => {
    if (!gap || gap === 'none') return undefined;
    switch (gap) {
      case 'sm': return 'var(--spacing-sm)';
      case 'md': return 'var(--spacing-md)';
      case 'lg': return 'var(--spacing-lg)';
      case 'xl': return 'var(--spacing-xl)';
      case '2xl': return 'var(--spacing-2xl)';
      default: return undefined;
    }
  };
  
  const sectionStyle: React.CSSProperties = {
    paddingTop: getSpacing(),
    paddingBottom: getSpacing(),
    display: gap ? 'flex' : undefined,
    flexDirection: gap ? 'column' : undefined,
    gap: getGap(),
    minHeight: fullHeight ? '100vh' : undefined,
    ...style
  };
  
  return (
    <section ref={ref} className={className} style={sectionStyle} {...props}>
      {children}
    </section>
  );
});

Section.displayName = 'Section';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto' | number;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
  minChildWidth?: string;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(({
  children,
  cols = 3,
  gap = 'md',
  responsive = true,
  minChildWidth,
  className = '',
  style,
  ...props
}, ref) => {
  // Get gap value
  const getGap = () => {
    switch (gap) {
      case 'none': return '0';
      case 'sm': return 'var(--spacing-sm)';
      case 'md': return 'var(--spacing-md)';
      case 'lg': return 'var(--spacing-lg)';
      case 'xl': return 'var(--spacing-xl)';
      default: return 'var(--spacing-md)';
    }
  };
  
  // Get grid template columns
  const getGridTemplateColumns = () => {
    if (cols === 'auto') {
      return `repeat(auto-fit, minmax(${minChildWidth || '250px'}, 1fr))`;
    }
    
    if (responsive && typeof cols === 'number') {
      const minWidth = minChildWidth || `${Math.max(200, 100/cols)}px`;
      return `repeat(auto-fit, minmax(min(100%, ${minWidth}), 1fr))`;
    }
    
    return `repeat(${cols}, 1fr)`;
  };
  
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: getGridTemplateColumns(),
    gap: getGap(),
    ...style
  };
  
  return (
    <div ref={ref} className={className} style={gridStyle} {...props}>
      {children}
    </div>
  );
});

Grid.displayName = 'Grid';

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  fullHeight?: boolean;
}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(({
  children,
  direction = 'row',
  wrap = 'nowrap',
  justify = 'start',
  align = 'stretch',
  gap = 'none',
  fullWidth = false,
  fullHeight = false,
  className = '',
  style,
  ...props
}, ref) => {
  // Get gap value
  const getGap = () => {
    switch (gap) {
      case 'none': return '0';
      case 'sm': return 'var(--spacing-sm)';
      case 'md': return 'var(--spacing-md)';
      case 'lg': return 'var(--spacing-lg)';
      case 'xl': return 'var(--spacing-xl)';
      default: return '0';
    }
  };
  
  // Get flex direction
  const getFlexDirection = (): React.CSSProperties['flexDirection'] => {
    switch (direction) {
      case 'row': return 'row';
      case 'col': return 'column';
      case 'row-reverse': return 'row-reverse';
      case 'col-reverse': return 'column-reverse';
      default: return 'row';
    }
  };
  
  // Get justify content
  const getJustifyContent = () => {
    switch (justify) {
      case 'start': return 'flex-start';
      case 'end': return 'flex-end';
      case 'center': return 'center';
      case 'between': return 'space-between';
      case 'around': return 'space-around';
      case 'evenly': return 'space-evenly';
      default: return 'flex-start';
    }
  };
  
  // Get align items
  const getAlignItems = () => {
    switch (align) {
      case 'start': return 'flex-start';
      case 'end': return 'flex-end';
      case 'center': return 'center';
      case 'baseline': return 'baseline';
      case 'stretch': return 'stretch';
      default: return 'stretch';
    }
  };
  
  const flexStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: getFlexDirection(),
    flexWrap: wrap,
    justifyContent: getJustifyContent(),
    alignItems: getAlignItems(),
    gap: getGap(),
    width: fullWidth ? '100%' : undefined,
    height: fullHeight ? '100%' : undefined,
    ...style
  };
  
  return (
    <div ref={ref} className={className} style={flexStyle} {...props}>
      {children}
    </div>
  );
});

Flex.displayName = 'Flex';