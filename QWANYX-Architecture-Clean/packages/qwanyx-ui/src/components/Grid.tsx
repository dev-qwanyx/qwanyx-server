import React from 'react';

// Classical 12-column grid system with golden ratio spacing
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 12 | 'auto';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  responsive?: boolean;
  minChildWidth?: string;
  flow?: 'row' | 'column' | 'dense' | 'row-dense' | 'column-dense';
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(({
  children,
  columns = 12,
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  responsive = true,
  minChildWidth,
  flow = 'row',
  style,
  ...props
}, ref) => {
  // Golden ratio based spacing (1.618)
  const gaps = {
    none: '0',
    xs: '8px',   // 8
    sm: '13px',  // 8 * 1.618
    md: '21px',  // 13 * 1.618
    lg: '34px',  // 21 * 1.618
    xl: '55px',  // 34 * 1.618
    '2xl': '89px' // 55 * 1.618
  };

  const alignItems = {
    start: 'start',
    center: 'center',
    end: 'end',
    stretch: 'stretch',
    baseline: 'baseline'
  };

  const justifyContent = {
    start: 'start',
    center: 'center',
    end: 'end',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly'
  };

  // Auto-fit grid with minimum column width
  const getGridTemplateColumns = () => {
    if (minChildWidth) {
      return `repeat(auto-fit, minmax(${minChildWidth}, 1fr))`;
    }
    if (columns === 'auto') {
      return 'repeat(auto-fit, minmax(250px, 1fr))';
    }
    if (responsive) {
      // Responsive breakpoints following classical design principles
      return `repeat(${columns}, minmax(0, 1fr))`;
    }
    return `repeat(${columns}, 1fr)`;
  };

  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: getGridTemplateColumns(),
    gap: gaps[gap],
    alignItems: alignItems[align],
    justifyContent: justifyContent[justify],
    gridAutoFlow: flow,
    width: '100%',
    ...style
  };

  // Add responsive CSS variables for dynamic breakpoints
  if (responsive && columns !== 'auto' && !minChildWidth) {
    const id = `grid-${columns}-${Math.random().toString(36).substr(2, 9)}`;
    if (typeof document !== 'undefined' && !document.getElementById(id)) {
      const styleEl = document.createElement('style');
      styleEl.id = id;
      styleEl.innerHTML = `
        @media (max-width: 1280px) {
          [data-grid-id="${id}"] {
            grid-template-columns: repeat(${Math.min(columns as number, 8)}, minmax(0, 1fr));
          }
        }
        @media (max-width: 1024px) {
          [data-grid-id="${id}"] {
            grid-template-columns: repeat(${Math.min(columns as number, 6)}, minmax(0, 1fr));
          }
        }
        @media (max-width: 768px) {
          [data-grid-id="${id}"] {
            grid-template-columns: repeat(${Math.min(columns as number, 4)}, minmax(0, 1fr));
          }
        }
        @media (max-width: 640px) {
          [data-grid-id="${id}"] {
            grid-template-columns: repeat(${Math.min(columns as number, 2)}, minmax(0, 1fr));
          }
        }
        @media (max-width: 480px) {
          [data-grid-id="${id}"] {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }
        }
      `;
      document.head.appendChild(styleEl);
    }
    return (
      <div ref={ref} style={gridStyles} data-grid-id={id} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} style={gridStyles} {...props}>
      {children}
    </div>
  );
});

Grid.displayName = 'Grid';

// Grid Item for spanning multiple columns
export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';
  start?: number;
  end?: number;
  rowSpan?: number;
  rowStart?: number;
  rowEnd?: number;
  order?: number;
}

export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(({
  children,
  span,
  start,
  end,
  rowSpan,
  rowStart,
  rowEnd,
  order,
  style,
  ...props
}, ref) => {
  const itemStyles: React.CSSProperties = {
    ...style
  };

  if (span) {
    itemStyles.gridColumn = span === 'full' ? '1 / -1' : `span ${span}`;
  }
  if (start !== undefined) {
    itemStyles.gridColumnStart = start;
  }
  if (end !== undefined) {
    itemStyles.gridColumnEnd = end;
  }
  if (rowSpan) {
    itemStyles.gridRow = `span ${rowSpan}`;
  }
  if (rowStart !== undefined) {
    itemStyles.gridRowStart = rowStart;
  }
  if (rowEnd !== undefined) {
    itemStyles.gridRowEnd = rowEnd;
  }
  if (order !== undefined) {
    itemStyles.order = order;
  }

  return (
    <div ref={ref} style={itemStyles} {...props}>
      {children}
    </div>
  );
});

GridItem.displayName = 'GridItem';