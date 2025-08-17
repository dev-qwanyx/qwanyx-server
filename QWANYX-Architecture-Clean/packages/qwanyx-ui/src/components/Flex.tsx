import React from 'react';

// Flexbox layout component following CSS Flexbox specification
export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'stretch' | 'baseline';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  inline?: boolean;
  flex?: string | number;
}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(({
  children,
  direction = 'row',
  wrap = 'nowrap',
  justify = 'start',
  align = 'stretch',
  gap = 'none',
  inline = false,
  flex,
  style,
  ...props
}, ref) => {
  // Golden ratio based spacing
  const gaps = {
    none: '0',
    xs: '8px',
    sm: '13px',
    md: '21px',
    lg: '34px',
    xl: '55px',
    '2xl': '89px'
  };

  const justifyContent = {
    start: 'flex-start',
    end: 'flex-end',
    center: 'center',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly'
  };

  const alignItems = {
    start: 'flex-start',
    end: 'flex-end',
    center: 'center',
    stretch: 'stretch',
    baseline: 'baseline'
  };

  const flexStyles: React.CSSProperties = {
    display: inline ? 'inline-flex' : 'flex',
    flexDirection: direction,
    flexWrap: wrap,
    justifyContent: justifyContent[justify],
    alignItems: alignItems[align],
    gap: gaps[gap],
    flex: flex,
    ...style
  };

  return (
    <div ref={ref} style={flexStyles} {...props}>
      {children}
    </div>
  );
});

Flex.displayName = 'Flex';

// Flex Item with grow, shrink, and basis control
export interface FlexItemProps extends React.HTMLAttributes<HTMLDivElement> {
  grow?: number;
  shrink?: number;
  basis?: string | number;
  order?: number;
  alignSelf?: 'auto' | 'start' | 'end' | 'center' | 'stretch' | 'baseline';
}

export const FlexItem = React.forwardRef<HTMLDivElement, FlexItemProps>(({
  children,
  grow = 0,
  shrink = 1,
  basis = 'auto',
  order,
  alignSelf = 'auto',
  style,
  ...props
}, ref) => {
  const alignSelfMap = {
    auto: 'auto',
    start: 'flex-start',
    end: 'flex-end',
    center: 'center',
    stretch: 'stretch',
    baseline: 'baseline'
  };

  const itemStyles: React.CSSProperties = {
    flexGrow: grow,
    flexShrink: shrink,
    flexBasis: basis,
    order: order,
    alignSelf: alignSelfMap[alignSelf],
    ...style
  };

  return (
    <div ref={ref} style={itemStyles} {...props}>
      {children}
    </div>
  );
});

FlexItem.displayName = 'FlexItem';

// Spacer component for flexible spacing
export interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'auto';
  direction?: 'horizontal' | 'vertical' | 'both';
}

export const Spacer: React.FC<SpacerProps> = ({ 
  size = 'auto',
  direction = 'horizontal' 
}) => {
  if (size === 'auto') {
    return <div style={{ flex: '1 1 auto' }} />;
  }

  const sizes = {
    xs: '8px',
    sm: '13px',
    md: '21px',
    lg: '34px',
    xl: '55px',
    '2xl': '89px'
  };

  const spacerStyle: React.CSSProperties = {
    width: direction === 'vertical' ? undefined : sizes[size],
    height: direction === 'horizontal' ? undefined : sizes[size],
    minWidth: direction === 'both' ? sizes[size] : undefined,
    minHeight: direction === 'both' ? sizes[size] : undefined,
    flexShrink: 0
  };

  return <div style={spacerStyle} />;
};

Spacer.displayName = 'Spacer';