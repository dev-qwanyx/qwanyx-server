import React from 'react';

// Holy Grail Layout - Classic 3-column layout with header and footer
export interface HolyGrailLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebar?: React.ReactNode;
  aside?: React.ReactNode;
  sidebarPosition?: 'left' | 'right';
  asidePosition?: 'left' | 'right';
  sidebarWidth?: string;
  asideWidth?: string;
  headerHeight?: string;
  footerHeight?: string;
  gap?: 'none' | 'sm' | 'md' | 'lg';
  stickyHeader?: boolean;
  stickyFooter?: boolean;
  stickySidebar?: boolean;
}

export const HolyGrailLayout = React.forwardRef<HTMLDivElement, HolyGrailLayoutProps>(({
  children,
  header,
  footer,
  sidebar,
  aside,
  sidebarPosition = 'left',
  asidePosition = 'right',
  sidebarWidth = '250px',
  asideWidth = '300px',
  headerHeight = 'auto',
  footerHeight = 'auto',
  gap = 'md',
  stickyHeader = false,
  stickyFooter = false,
  stickySidebar = false,
  style,
  ...props
}, ref) => {
  const gaps = {
    none: '0',
    sm: '13px',
    md: '21px',
    lg: '34px'
  };

  const gapSize = gaps[gap];

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    ...style
  };

  const headerStyles: React.CSSProperties = {
    height: headerHeight,
    flexShrink: 0,
    position: stickyHeader ? 'sticky' : 'relative',
    top: stickyHeader ? 0 : undefined,
    zIndex: stickyHeader ? 100 : undefined,
    backgroundColor: 'rgb(var(--background))',
    borderBottom: '1px solid rgb(var(--border))'
  };

  const mainStyles: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    gap: gapSize,
    overflow: 'hidden'
  };

  const sidebarStyles: React.CSSProperties = {
    width: sidebarWidth,
    flexShrink: 0,
    position: stickySidebar ? 'sticky' : 'relative',
    top: stickySidebar ? (stickyHeader ? headerHeight : 0) : undefined,
    height: stickySidebar ? 'fit-content' : undefined,
    maxHeight: stickySidebar ? 'calc(100vh - 100px)' : undefined,
    overflowY: 'auto',
    order: sidebarPosition === 'left' ? -1 : 1
  };

  const asideStyles: React.CSSProperties = {
    width: asideWidth,
    flexShrink: 0,
    order: asidePosition === 'left' ? -2 : 2
  };

  const contentStyles: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    overflowY: 'auto'
  };

  const footerStyles: React.CSSProperties = {
    height: footerHeight,
    flexShrink: 0,
    position: stickyFooter ? 'sticky' : 'relative',
    bottom: stickyFooter ? 0 : undefined,
    backgroundColor: 'rgb(var(--background))',
    borderTop: '1px solid rgb(var(--border))'
  };

  return (
    <div ref={ref} style={containerStyles} {...props}>
      {header && <header style={headerStyles}>{header}</header>}
      
      <main style={mainStyles}>
        {aside && <aside style={asideStyles}>{aside}</aside>}
        {sidebar && <nav style={sidebarStyles}>{sidebar}</nav>}
        <article style={contentStyles}>{children}</article>
      </main>
      
      {footer && <footer style={footerStyles}>{footer}</footer>}
    </div>
  );
});

HolyGrailLayout.displayName = 'HolyGrailLayout';

// Magazine/Editorial Layout - Asymmetric grid for content-heavy sites
export interface MagazineLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  hero?: React.ReactNode;
  featured?: React.ReactNode[];
  sidebar?: React.ReactNode;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

export const MagazineLayout = React.forwardRef<HTMLDivElement, MagazineLayoutProps>(({
  children,
  hero,
  featured = [],
  sidebar,
  gap = 'lg',
  style,
  ...props
}, ref) => {
  const gaps = {
    sm: '13px',
    md: '21px',
    lg: '34px',
    xl: '55px'
  };

  const gapSize = gaps[gap];

  const containerStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: sidebar ? '1fr 300px' : '1fr',
    gap: gapSize,
    maxWidth: '1400px',
    margin: '0 auto',
    padding: gapSize,
    ...style
  };

  const heroStyles: React.CSSProperties = {
    gridColumn: sidebar ? 'span 2' : 'span 1',
    marginBottom: gapSize
  };

  const featuredGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: gapSize,
    marginBottom: gapSize
  };

  const mainContentStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: gapSize
  };

  const sidebarStyles: React.CSSProperties = {
    position: 'sticky',
    top: gapSize,
    height: 'fit-content',
    maxHeight: `calc(100vh - ${gapSize} * 2)`
  };

  return (
    <div ref={ref} style={containerStyles} {...props}>
      {hero && <section style={heroStyles}>{hero}</section>}
      
      <div style={mainContentStyles}>
        {featured.length > 0 && (
          <section style={featuredGridStyles}>
            {featured.map((item, index) => (
              <article key={index}>{item}</article>
            ))}
          </section>
        )}
        
        <section>{children}</section>
      </div>
      
      {sidebar && <aside style={sidebarStyles}>{sidebar}</aside>}
    </div>
  );
});

MagazineLayout.displayName = 'MagazineLayout';

// Split Layout - Two equal columns
export interface SplitLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  left: React.ReactNode;
  right: React.ReactNode;
  ratio?: '50-50' | '60-40' | '40-60' | '70-30' | '30-70' | 'golden';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  stackOnMobile?: boolean;
  reverseOnMobile?: boolean;
}

export const SplitLayout = React.forwardRef<HTMLDivElement, SplitLayoutProps>(({
  left,
  right,
  ratio = '50-50',
  gap = 'md',
  stackOnMobile = true,
  reverseOnMobile = false,
  style,
  ...props
}, ref) => {
  const gaps = {
    none: '0',
    sm: '13px',
    md: '21px',
    lg: '34px',
    xl: '55px'
  };

  const ratios = {
    '50-50': '1fr 1fr',
    '60-40': '3fr 2fr',
    '40-60': '2fr 3fr',
    '70-30': '7fr 3fr',
    '30-70': '3fr 7fr',
    'golden': '1.618fr 1fr'
  };

  const gapSize = gaps[gap];
  const gridColumns = ratios[ratio];

  // Generate unique ID for responsive styles
  const id = `split-${Math.random().toString(36).substr(2, 9)}`;
  
  if (typeof document !== 'undefined' && !document.getElementById(id)) {
    const styleEl = document.createElement('style');
    styleEl.id = id;
    styleEl.innerHTML = `
      @media (max-width: 768px) {
        [data-split-id="${id}"] {
          ${stackOnMobile ? `
            grid-template-columns: 1fr !important;
            ${reverseOnMobile ? 'direction: rtl;' : ''}
          ` : ''}
        }
        ${reverseOnMobile && stackOnMobile ? `
          [data-split-id="${id}"] > * {
            direction: ltr;
          }
        ` : ''}
      }
    `;
    document.head.appendChild(styleEl);
  }

  const containerStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: gridColumns,
    gap: gapSize,
    alignItems: 'stretch',
    ...style
  };

  return (
    <div ref={ref} style={containerStyles} data-split-id={id} {...props}>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
});

SplitLayout.displayName = 'SplitLayout';

// Bento Layout - Asymmetric grid inspired by Japanese bento boxes
export interface BentoLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: 'sm' | 'md' | 'lg';
}

export const BentoLayout = React.forwardRef<HTMLDivElement, BentoLayoutProps>(({
  children,
  gap = 'md',
  style,
  ...props
}, ref) => {
  const gaps = {
    sm: '13px',
    md: '21px',
    lg: '34px'
  };

  const gapSize = gaps[gap];
  
  const containerStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gridAutoRows: 'minmax(120px, auto)',
    gap: gapSize,
    ...style
  };

  // Process children to assign different grid spans
  const processedChildren = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;
    
    // Bento patterns for first 8 items
    const patterns = [
      { gridColumn: 'span 3', gridRow: 'span 2' }, // Large
      { gridColumn: 'span 3', gridRow: 'span 1' }, // Wide
      { gridColumn: 'span 2', gridRow: 'span 1' }, // Medium
      { gridColumn: 'span 2', gridRow: 'span 2' }, // Tall medium
      { gridColumn: 'span 2', gridRow: 'span 1' }, // Medium
      { gridColumn: 'span 4', gridRow: 'span 1' }, // Extra wide
      { gridColumn: 'span 2', gridRow: 'span 1' }, // Medium
      { gridColumn: 'span 2', gridRow: 'span 1' }, // Medium
    ];
    
    const pattern = patterns[index % patterns.length];
    
    return React.cloneElement(child, {
      style: {
        ...child.props.style,
        ...pattern
      }
    });
  });

  return (
    <div ref={ref} style={containerStyles} {...props}>
      {processedChildren}
    </div>
  );
});

BentoLayout.displayName = 'BentoLayout';

// Asymmetric Layout - Creative irregular grid
export interface AsymmetricLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'editorial' | 'artistic' | 'dynamic';
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

export const AsymmetricLayout = React.forwardRef<HTMLDivElement, AsymmetricLayoutProps>(({
  children,
  variant = 'editorial',
  gap = 'lg',
  style,
  ...props
}, ref) => {
  const gaps = {
    sm: '13px',
    md: '21px',
    lg: '34px',
    xl: '55px'
  };

  const gapSize = gaps[gap];

  const getGridTemplate = () => {
    switch (variant) {
      case 'editorial':
        return {
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'repeat(auto-fit, minmax(100px, auto))'
        };
      case 'artistic':
        return {
          gridTemplateColumns: 'repeat(8, 1fr)',
          gridTemplateRows: 'repeat(auto-fit, minmax(150px, auto))'
        };
      case 'dynamic':
        return {
          gridTemplateColumns: 'repeat(10, 1fr)',
          gridTemplateRows: 'auto'
        };
      default:
        return {
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'auto'
        };
    }
  };

  const containerStyles: React.CSSProperties = {
    display: 'grid',
    ...getGridTemplate(),
    gap: gapSize,
    ...style
  };

  // Assign asymmetric spans based on variant
  const processedChildren = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;
    
    let spans: React.CSSProperties = {};
    
    if (variant === 'editorial') {
      const patterns = [
        { gridColumn: 'span 7', gridRow: 'span 2' },
        { gridColumn: 'span 5', gridRow: 'span 1' },
        { gridColumn: 'span 5', gridRow: 'span 1' },
        { gridColumn: 'span 4', gridRow: 'span 2' },
        { gridColumn: 'span 8', gridRow: 'span 1' },
        { gridColumn: 'span 3', gridRow: 'span 1' },
        { gridColumn: 'span 6', gridRow: 'span 1' },
        { gridColumn: 'span 3', gridRow: 'span 2' },
      ];
      spans = patterns[index % patterns.length];
    } else if (variant === 'artistic') {
      const patterns = [
        { gridColumn: 'span 5', gridRow: 'span 3' },
        { gridColumn: 'span 3', gridRow: 'span 2' },
        { gridColumn: 'span 3', gridRow: 'span 1' },
        { gridColumn: 'span 5', gridRow: 'span 2' },
        { gridColumn: 'span 2', gridRow: 'span 1' },
        { gridColumn: 'span 6', gridRow: 'span 2' },
      ];
      spans = patterns[index % patterns.length];
    } else {
      const patterns = [
        { gridColumn: 'span 6', gridRow: 'span 1' },
        { gridColumn: 'span 4', gridRow: 'span 1' },
        { gridColumn: 'span 3', gridRow: 'span 1' },
        { gridColumn: 'span 7', gridRow: 'span 1' },
        { gridColumn: 'span 5', gridRow: 'span 1' },
        { gridColumn: 'span 5', gridRow: 'span 1' },
      ];
      spans = patterns[index % patterns.length];
    }
    
    return React.cloneElement(child, {
      style: {
        ...child.props.style,
        ...spans
      }
    });
  });

  return (
    <div ref={ref} style={containerStyles} {...props}>
      {processedChildren}
    </div>
  );
});

AsymmetricLayout.displayName = 'AsymmetricLayout';