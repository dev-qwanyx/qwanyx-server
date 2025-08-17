import React, { useEffect, useRef, useState } from 'react';

// Masonry layout for Pinterest-style responsive grids
export interface MasonryProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number | 'auto';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  breakpoints?: {
    [key: number]: number;
  };
}

export const Masonry = React.forwardRef<HTMLDivElement, MasonryProps>(({
  children,
  columns = 'auto',
  gap = 'md',
  breakpoints = {
    1280: 5,
    1024: 4,
    768: 3,
    640: 2,
    0: 1
  },
  style,
  ...props
}, ref) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const containerRef = ref || internalRef;
  const [columnCount, setColumnCount] = useState(3);
  const [mounted, setMounted] = useState(false);

  // Golden ratio based spacing
  const gaps = {
    none: 0,
    xs: 8,
    sm: 13,
    md: 21,
    lg: 34,
    xl: 55,
    '2xl': 89
  };

  const gapSize = gaps[gap];

  // Calculate column count based on container width
  useEffect(() => {
    setMounted(true);
    
    const calculateColumns = () => {
      const element = (containerRef as React.RefObject<HTMLDivElement>).current;
      if (!element) return;
      
      if (columns === 'auto') {
        const width = element.offsetWidth;
        const sortedBreakpoints = Object.keys(breakpoints)
          .map(Number)
          .sort((a, b) => b - a);
        
        for (const breakpoint of sortedBreakpoints) {
          if (width >= breakpoint) {
            setColumnCount(breakpoints[breakpoint]);
            break;
          }
        }
      } else {
        setColumnCount(columns);
      }
    };

    calculateColumns();
    
    const element = (containerRef as React.RefObject<HTMLDivElement>).current;
    const resizeObserver = new ResizeObserver(calculateColumns);
    if (element) {
      resizeObserver.observe(element);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [columns, breakpoints]);

  // Distribute children across columns
  const distributeChildren = () => {
    const items = React.Children.toArray(children);
    const columnArrays: React.ReactNode[][] = Array.from(
      { length: columnCount },
      () => []
    );

    // Simple round-robin distribution
    // For a more sophisticated approach, you'd measure heights
    items.forEach((item, index) => {
      const columnIndex = index % columnCount;
      columnArrays[columnIndex].push(item);
    });

    return columnArrays;
  };

  const columnArrays = mounted ? distributeChildren() : [];

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    gap: `${gapSize}px`,
    alignItems: 'flex-start',
    width: '100%',
    ...style
  };

  const columnStyles: React.CSSProperties = {
    flex: '1 1 0',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: `${gapSize}px`
  };

  // Server-side rendering fallback
  if (!mounted) {
    return (
      <div ref={containerRef as React.RefObject<HTMLDivElement>} style={containerStyles} {...props}>
        <div style={columnStyles}>{children}</div>
      </div>
    );
  }

  return (
    <div ref={containerRef as React.RefObject<HTMLDivElement>} style={containerStyles} {...props}>
      {columnArrays.map((column, index) => (
        <div key={index} style={columnStyles}>
          {column}
        </div>
      ))}
    </div>
  );
});

Masonry.displayName = 'Masonry';

// Advanced Masonry with item height calculation
export interface AdvancedMasonryProps extends MasonryProps {
  itemSelector?: string;
  animate?: boolean;
}

export const AdvancedMasonry = React.forwardRef<HTMLDivElement, AdvancedMasonryProps>(({
  children,
  columns = 'auto',
  gap = 'md',
  itemSelector = '[data-masonry-item]',
  animate = true,
  breakpoints = {
    1280: 5,
    1024: 4,
    768: 3,
    640: 2,
    0: 1
  },
  style,
  ...props
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(3);
  const [layout, setLayout] = useState<{ [key: number]: number }>({});

  // Golden ratio based spacing
  const gaps = {
    none: 0,
    xs: 8,
    sm: 13,
    md: 21,
    lg: 34,
    xl: 55,
    '2xl': 89
  };

  const gapSize = gaps[gap];

  useEffect(() => {
    const calculateColumns = () => {
      if (!containerRef.current) return;
      
      if (columns === 'auto') {
        const width = containerRef.current.offsetWidth;
        const sortedBreakpoints = Object.keys(breakpoints)
          .map(Number)
          .sort((a, b) => b - a);
        
        for (const breakpoint of sortedBreakpoints) {
          if (width >= breakpoint) {
            setColumnCount(breakpoints[breakpoint]);
            break;
          }
        }
      } else {
        setColumnCount(columns);
      }
    };

    calculateColumns();
    window.addEventListener('resize', calculateColumns);
    
    return () => {
      window.removeEventListener('resize', calculateColumns);
    };
  }, [columns, breakpoints]);

  useEffect(() => {
    if (!containerRef.current) return;

    const calculateLayout = () => {
      const container = containerRef.current;
      if (!container) return;

      const items = container.querySelectorAll(itemSelector);
      const columnWidth = (container.offsetWidth - gapSize * (columnCount - 1)) / columnCount;
      const columnHeights = new Array(columnCount).fill(0);
      const newLayout: { [key: number]: number } = {};

      items.forEach((item, index) => {
        const element = item as HTMLElement;
        const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
        
        const x = shortestColumn * (columnWidth + gapSize);
        const y = columnHeights[shortestColumn];
        
        element.style.position = 'absolute';
        element.style.width = `${columnWidth}px`;
        element.style.transform = `translate(${x}px, ${y}px)`;
        
        if (animate) {
          element.style.transition = 'transform 0.3s ease';
        }
        
        columnHeights[shortestColumn] += element.offsetHeight + gapSize;
        newLayout[index] = shortestColumn;
      });

      container.style.height = `${Math.max(...columnHeights) - gapSize}px`;
      setLayout(newLayout);
    };

    // Delay to ensure DOM is ready
    const timer = setTimeout(calculateLayout, 100);
    
    // Recalculate on image load
    const images = containerRef.current.querySelectorAll('img');
    images.forEach(img => {
      if (img.complete) {
        calculateLayout();
      } else {
        img.addEventListener('load', calculateLayout);
      }
    });

    return () => {
      clearTimeout(timer);
      images.forEach(img => {
        img.removeEventListener('load', calculateLayout);
      });
    };
  }, [children, columnCount, gapSize, itemSelector, animate]);

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    ...style
  };

  return (
    <div ref={ref} style={containerStyles} {...props}>
      <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              ...child.props,
              'data-masonry-item': true,
              key: index
            });
          }
          return child;
        })}
      </div>
    </div>
  );
});

AdvancedMasonry.displayName = 'AdvancedMasonry';