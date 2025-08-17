import React, { useState, createContext, useContext, useRef, useEffect } from 'react';
import { Button } from './Button';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
  variant?: 'line' | 'boxed' | 'pills' | 'segment' | 'nav';
  color?: string;
  backgroundColor?: string;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: 'line' | 'boxed' | 'pills' | 'segment' | 'nav';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  orientation?: 'horizontal' | 'vertical';
  swipeable?: boolean; // For mobile
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  backgroundColor?: string; // Custom background color for active tabs (e.g., 'rgb(var(--surface))')
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(({
  children,
  defaultValue,
  value,
  onValueChange,
  variant = 'line',
  size = 'md',
  fullWidth = false,
  orientation = 'horizontal',
  swipeable = false,
  color = 'primary',
  backgroundColor,
  style,
  ...props
}, ref) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const activeTab = value !== undefined ? value : internalValue;
  
  const setActiveTab = (id: string) => {
    if (value === undefined) {
      setInternalValue(id);
    }
    onValueChange?.(id);
  };
  
  const tabsStyle: React.CSSProperties = {
    width: fullWidth ? '100%' : 'auto',
    display: orientation === 'vertical' ? 'flex' : 'block',
    gap: orientation === 'vertical' ? '24px' : undefined,
    ...style
  };
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, variant, color, backgroundColor }}>
      <div ref={ref} style={tabsStyle} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
});

Tabs.displayName = 'Tabs';

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'line' | 'boxed' | 'pills' | 'segment' | 'nav';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  orientation?: 'horizontal' | 'vertical';
  showArrows?: boolean; // Show navigation arrows when overflow
  scrollable?: boolean; // Enable horizontal scrolling
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(({
  children,
  variant = 'line',
  size = 'md',
  fullWidth = false,
  orientation = 'horizontal',
  showArrows = true,
  scrollable = true,
  style,
  ...props
}) => {
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const context = useContext(TabsContext);
  
  // Check if tabs overflow and update scroll buttons
  const checkScrollButtons = () => {
    if (scrollContainerRef.current && orientation === 'horizontal' && scrollable) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Scroll handlers
  const scrollToLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollToRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Mouse/Touch drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    e.preventDefault(); // Prevent text selection
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Multiply for faster scroll
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    checkScrollButtons();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    checkScrollButtons();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Check scroll buttons on mount and resize
  useEffect(() => {
    checkScrollButtons();
    const handleResize = () => checkScrollButtons();
    window.addEventListener('resize', handleResize);
    
    // Add global mouse up handler
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, []);

  // Calculate indicator position for sliding animation (only for line variant)
  useEffect(() => {
    if (variant === 'line' && listRef.current && context?.activeTab) {
      const activeButton = listRef.current.querySelector(`[data-value="${context.activeTab}"]`) as HTMLElement;
      if (activeButton) {
        const { offsetLeft, offsetWidth, offsetTop, offsetHeight } = activeButton;
        setIndicatorStyle({
          position: 'absolute',
          bottom: orientation === 'horizontal' ? '0' : undefined,
          left: orientation === 'horizontal' ? `${offsetLeft}px` : '0',
          top: orientation === 'vertical' ? `${offsetTop}px` : undefined,
          width: orientation === 'horizontal' ? `${offsetWidth}px` : '2px',
          height: orientation === 'horizontal' ? '2px' : `${offsetHeight}px`,
          backgroundColor: 'rgb(var(--primary))',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: 'var(--radius-full)',
          zIndex: 10
        });
        
        // Auto-scroll to active tab if it's out of view
        if (scrollContainerRef.current && scrollable) {
          const container = scrollContainerRef.current;
          const buttonLeft = activeButton.offsetLeft;
          const buttonRight = buttonLeft + activeButton.offsetWidth;
          const containerLeft = container.scrollLeft;
          const containerRight = containerLeft + container.clientWidth;
          
          if (buttonLeft < containerLeft) {
            container.scrollTo({ left: buttonLeft - 20, behavior: 'smooth' });
          } else if (buttonRight > containerRight) {
            container.scrollTo({ left: buttonRight - container.clientWidth + 20, behavior: 'smooth' });
          }
        }
      }
    }
  }, [context?.activeTab, variant, orientation, scrollable]);
  
  const getListStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: orientation === 'vertical' ? 'flex' : 'inline-flex',
      flexDirection: orientation === 'vertical' ? 'column' : 'row',
      position: 'relative',
      width: fullWidth ? '100%' : 'auto',
      gap: variant === 'pills' ? '8px' : variant === 'segment' ? '0' : '4px',
    };
    
    switch (variant) {
      case 'line':
        return {
          ...base,
          borderBottom: orientation === 'horizontal' ? '1px solid rgb(var(--border))' : undefined,
          borderLeft: orientation === 'vertical' ? '1px solid rgb(var(--border))' : undefined,
        };
      case 'boxed':
        return {
          ...base,
          borderBottom: '1px solid rgb(var(--border))',
          gap: '0'
        };
      case 'segment':
        return {
          ...base,
          backgroundColor: 'rgb(var(--surface))',
          padding: '4px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
        };
      case 'nav':
        return {
          ...base,
          backgroundColor: 'rgb(var(--background))',
          boxShadow: 'var(--shadow)',
          borderRadius: 'var(--radius-lg)',
          padding: '8px',
        };
      default:
        return base;
    }
  };
  
  const listStyles = {
    ...getListStyles(),
    ...style
  };

  // If scrollable and horizontal, wrap in a scroll container
  if (scrollable && orientation === 'horizontal') {
    return (
      <div style={{ position: 'relative', width: fullWidth ? '100%' : 'auto' }}>
        {/* Left scroll arrow */}
        {showArrows && canScrollLeft && (
          <button
            onClick={scrollToLeft}
            style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              background: 'linear-gradient(90deg, rgb(var(--background)) 60%, transparent)',
              border: 'none',
              padding: '8px 12px 8px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              height: '100%'
            }}
            aria-label="Scroll tabs left"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        
        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          style={{
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE
            WebkitOverflowScrolling: 'touch', // iOS smooth scrolling
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: isDragging ? 'none' : 'auto',
          }}
          onScroll={checkScrollButtons}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          <style>{`
            div::-webkit-scrollbar { display: none; }
            /* Don't show grab cursor on buttons */
            button { cursor: pointer !important; }
          `}</style>
          <div ref={listRef} style={{ ...listStyles, minWidth: 'max-content' }} {...props}>
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<any>, {
                  variant,
                  size,
                  fullWidth: false, // Never fullWidth in scrollable mode
                  orientation
                });
              }
              return child;
            })}
            {variant === 'line' && <div style={indicatorStyle} />}
          </div>
        </div>
        
        {/* Right scroll arrow */}
        {showArrows && canScrollRight && (
          <button
            onClick={scrollToRight}
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              background: 'linear-gradient(270deg, rgb(var(--background)) 60%, transparent)',
              border: 'none',
              padding: '8px 8px 8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              height: '100%'
            }}
            aria-label="Scroll tabs right"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  // Non-scrollable or vertical orientation
  return (
    <div ref={listRef} style={listStyles} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            variant,
            size,
            fullWidth,
            orientation
          });
        }
        return child;
      })}
      {variant === 'line' && <div style={indicatorStyle} />}
    </div>
  );
});

TabsList.displayName = 'TabsList';

export interface TabsTriggerProps {
  value: string;
  variant?: 'line' | 'boxed' | 'pills' | 'segment' | 'nav';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  orientation?: 'horizontal' | 'vertical';
  icon?: React.ReactNode;
  disabled?: boolean;
  children: React.ReactNode;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  children,
  value,
  variant = 'line',
  size = 'md',
  fullWidth = false,
  icon,
  disabled,
}) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsTrigger must be used within Tabs');
  }
  
  const { activeTab, setActiveTab, color: contextColor, backgroundColor: contextBgColor } = context;
  const isActive = activeTab === value;
  const tabColor = contextColor || 'primary';
  const tabBgColor = contextBgColor || 'rgb(var(--surface))'; // Default to surface (grey) instead of background (white)
  
  const handleClick = () => {
    if (!disabled) {
      setActiveTab(value);
    }
  };
  
  // Map tab variants to button variants
  const getButtonVariant = () => {
    switch (variant) {
      case 'line':
        return 'tab';
      case 'boxed':
        return 'ghost'; // Use ghost with custom styling
      case 'pills':
        return 'pill';
      case 'segment':
        return 'segment';
      case 'nav':
        return 'nav';
      default:
        return 'tab';
    }
  };
  
  // Custom styles for boxed variant
  const getCustomStyles = (): React.CSSProperties | undefined => {
    const baseStyle: React.CSSProperties = {
      minWidth: 'max-content', // Never smaller than content
      whiteSpace: 'nowrap', // Prevent text wrapping
    };

    if (variant === 'boxed') {
      return {
        ...baseStyle,
        borderTopLeftRadius: 'var(--radius)',
        borderTopRightRadius: 'var(--radius)',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        marginBottom: '-1px',
        backgroundColor: isActive ? tabBgColor : 'transparent',
        borderTop: isActive ? '1px solid rgb(var(--border))' : '1px solid transparent',
        borderLeft: isActive ? '1px solid rgb(var(--border))' : '1px solid transparent',
        borderRight: isActive ? '1px solid rgb(var(--border))' : '1px solid transparent',
        borderBottom: isActive ? `1px solid ${tabBgColor}` : '1px solid transparent',
      };
    }
    if (variant === 'line') {
      // Remove the bottom border from tab buttons since we draw the indicator separately
      return {
        ...baseStyle,
        borderBottom: 'none',
        marginBottom: '0'
      };
    }
    return baseStyle;
  };
  
  return (
    <Button
      variant={getButtonVariant()}
      color={tabColor as any}
      size={size as any}
      fullWidth={fullWidth}
      icon={icon}
      iconPosition="left"
      isActive={isActive}
      onClick={handleClick}
      disabled={disabled}
      animationType="none" // Tabs have their own animations
      showRipple={true} // Ensure ripple is enabled
      style={getCustomStyles()}
      data-value={value}
      role="tab"
      aria-selected={isActive}
    >
      {children}
    </Button>
  );
};

TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  keepMounted?: boolean; // Keep content in DOM when not active
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(({
  children,
  value,
  keepMounted = false,
  style,
  ...props
}, ref) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsContent must be used within Tabs');
  }
  
  const { activeTab } = context;
  const isActive = activeTab === value;
  
  if (!isActive && !keepMounted) {
    return null;
  }
  
  const contentStyle: React.CSSProperties = {
    marginTop: '24px',
    display: isActive ? 'block' : 'none',
    animation: isActive ? 'fadeIn 0.3s ease-out' : undefined,
    ...style
  };
  
  // Add fade animation
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const styleId = 'qwanyx-tab-content-animation';
      if (!document.getElementById(styleId)) {
        const styleTag = document.createElement('style');
        styleTag.id = styleId;
        styleTag.textContent = `
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `;
        document.head.appendChild(styleTag);
      }
    }
  }, []);
  
  return (
    <div
      ref={ref}
      role="tabpanel"
      style={contentStyle}
      {...props}
    >
      {children}
    </div>
  );
});

TabsContent.displayName = 'TabsContent';

// Simple Tabs component for easy use
export interface SimpleTabsProps {
  tabs: Array<{
    id: string;
    label: string;
    content: React.ReactNode;
    icon?: React.ReactNode;
    disabled?: boolean;
  }>;
  defaultTab?: string;
  variant?: 'line' | 'boxed' | 'pills' | 'segment' | 'nav';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  backgroundColor?: string;
}

export const SimpleTabs: React.FC<SimpleTabsProps> = ({
  tabs,
  defaultTab,
  variant = 'line',
  size = 'md',
  fullWidth = false,
  orientation = 'horizontal',
  className = '',
  color,
  backgroundColor
}) => {
  const defaultValue = defaultTab || tabs[0]?.id;
  
  return (
    <Tabs 
      defaultValue={defaultValue} 
      variant={variant}
      orientation={orientation}
      className={className}
      color={color}
      backgroundColor={backgroundColor}
    >
      <TabsList 
        variant={variant} 
        size={size} 
        fullWidth={fullWidth}
        orientation={orientation}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            icon={tab.icon}
            disabled={tab.disabled}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};