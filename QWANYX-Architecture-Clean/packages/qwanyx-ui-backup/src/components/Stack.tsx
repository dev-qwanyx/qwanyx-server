import React from 'react';

// Stack component for vertical or horizontal stacking with consistent spacing
export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'vertical' | 'horizontal';
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  divider?: boolean;
  dividerColor?: string;
  wrap?: boolean;
  reverse?: boolean;
  inline?: boolean;
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(({
  children,
  direction = 'vertical',
  spacing = 'md',
  align = 'stretch',
  justify = 'start',
  divider = false,
  dividerColor = 'rgb(var(--border))',
  wrap = false,
  reverse = false,
  inline = false,
  style,
  ...props
}, ref) => {
  // Golden ratio based spacing
  const spacings = {
    none: '0',
    xs: '8px',
    sm: '13px',
    md: '21px',
    lg: '34px',
    xl: '55px',
    '2xl': '89px'
  };

  const alignItems = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch'
  };

  const justifyContent = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly'
  };

  const isVertical = direction === 'vertical';
  const flexDirection = isVertical 
    ? (reverse ? 'column-reverse' : 'column')
    : (reverse ? 'row-reverse' : 'row');

  const stackStyles: React.CSSProperties = {
    display: inline ? 'inline-flex' : 'flex',
    flexDirection: flexDirection,
    gap: spacings[spacing],
    alignItems: alignItems[align],
    justifyContent: justifyContent[justify],
    flexWrap: wrap ? 'wrap' : 'nowrap',
    width: isVertical && !inline ? '100%' : undefined,
    ...style
  };

  // Process children to add dividers
  const processedChildren = React.Children.toArray(children).filter(Boolean);
  
  if (divider && processedChildren.length > 1) {
    const childrenWithDividers: React.ReactNode[] = [];
    
    processedChildren.forEach((child, index) => {
      childrenWithDividers.push(child);
      
      if (index < processedChildren.length - 1) {
        const dividerStyle: React.CSSProperties = isVertical
          ? {
              width: '100%',
              height: '1px',
              backgroundColor: dividerColor,
              flexShrink: 0
            }
          : {
              width: '1px',
              height: '100%',
              minHeight: '20px',
              backgroundColor: dividerColor,
              flexShrink: 0
            };
        
        childrenWithDividers.push(
          <div key={`divider-${index}`} style={dividerStyle} />
        );
      }
    });
    
    return (
      <div ref={ref} style={stackStyles} {...props}>
        {childrenWithDividers}
      </div>
    );
  }

  return (
    <div ref={ref} style={stackStyles} {...props}>
      {processedChildren}
    </div>
  );
});

Stack.displayName = 'Stack';

// VStack - Vertical Stack shorthand
export interface VStackProps extends Omit<StackProps, 'direction'> {}

export const VStack = React.forwardRef<HTMLDivElement, VStackProps>((props, ref) => {
  return <Stack ref={ref} direction="vertical" {...props} />;
});

VStack.displayName = 'VStack';

// HStack - Horizontal Stack shorthand
export interface HStackProps extends Omit<StackProps, 'direction'> {}

export const HStack = React.forwardRef<HTMLDivElement, HStackProps>((props, ref) => {
  return <Stack ref={ref} direction="horizontal" {...props} />;
});

HStack.displayName = 'HStack';

// Center component - centers content both horizontally and vertically
export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  inline?: boolean;
  minHeight?: string;
}

export const Center = React.forwardRef<HTMLDivElement, CenterProps>(({
  children,
  inline = false,
  minHeight,
  style,
  ...props
}, ref) => {
  const centerStyles: React.CSSProperties = {
    display: inline ? 'inline-flex' : 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: inline ? undefined : '100%',
    minHeight: minHeight,
    ...style
  };

  return (
    <div ref={ref} style={centerStyles} {...props}>
      {children}
    </div>
  );
});

Center.displayName = 'Center';