import React, { useState, createContext, useContext, useRef, useEffect } from 'react';
import { Button } from './Button';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
  variant?: 'line' | 'boxed' | 'pills' | 'segment' | 'nav';
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
    <TabsContext.Provider value={{ activeTab, setActiveTab, variant }}>
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
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(({
  children,
  variant = 'line',
  size = 'md',
  fullWidth = false,
  orientation = 'horizontal',
  style,
  ...props
}) => {
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const listRef = useRef<HTMLDivElement>(null);
  const context = useContext(TabsContext);
  
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
      }
    }
  }, [context?.activeTab, variant, orientation]);
  
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
  
  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;
  
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
    if (variant === 'boxed') {
      return {
        borderTopLeftRadius: 'var(--radius)',
        borderTopRightRadius: 'var(--radius)',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        marginBottom: '-1px',
        backgroundColor: isActive ? 'rgb(var(--background))' : 'transparent',
        borderTop: isActive ? '1px solid rgb(var(--border))' : '1px solid transparent',
        borderLeft: isActive ? '1px solid rgb(var(--border))' : '1px solid transparent',
        borderRight: isActive ? '1px solid rgb(var(--border))' : '1px solid transparent',
        borderBottom: isActive ? '1px solid rgb(var(--background))' : '1px solid transparent',
      };
    }
    if (variant === 'line') {
      // Remove the bottom border from tab buttons since we draw the indicator separately
      return {
        borderBottom: 'none',
        marginBottom: '0'
      };
    }
    return undefined;
  };
  
  return (
    <Button
      variant={getButtonVariant()}
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
}

export const SimpleTabs: React.FC<SimpleTabsProps> = ({
  tabs,
  defaultTab,
  variant = 'line',
  size = 'md',
  fullWidth = false,
  orientation = 'horizontal',
  className = ''
}) => {
  const defaultValue = defaultTab || tabs[0]?.id;
  
  return (
    <Tabs 
      defaultValue={defaultValue} 
      variant={variant}
      orientation={orientation}
      className={className}
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