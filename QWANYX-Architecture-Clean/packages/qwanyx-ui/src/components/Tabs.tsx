import React, { useState, createContext, useContext } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: 'line' | 'boxed' | 'pills';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(({
  children,
  defaultValue,
  value,
  onValueChange,
  variant = 'line',
  size = 'md',
  fullWidth = false,
  className = '',
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
  
  const baseClasses = 'w-full';
  
  const combinedClassName = [
    baseClasses,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div ref={ref} className={combinedClassName} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
});

Tabs.displayName = 'Tabs';

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'line' | 'boxed' | 'pills';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(({
  children,
  variant = 'line',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'flex';
  
  const variantClasses = {
    line: 'border-b border-border',
    boxed: 'border-b border-gray-200',
    pills: 'gap-2'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const combinedClassName = [
    baseClasses,
    variantClasses[variant],
    widthClass,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div ref={ref} className={combinedClassName} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            variant,
            size,
            fullWidth
          });
        }
        return child;
      })}
    </div>
  );
});

TabsList.displayName = 'TabsList';

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  variant?: 'line' | 'boxed' | 'pills';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(({
  children,
  value,
  variant = 'line',
  size = 'md',
  fullWidth = false,
  className = '',
  onClick,
  ...props
}, ref) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsTrigger must be used within Tabs');
  }
  
  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveTab(value);
    onClick?.(e);
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  const variantClasses = {
    line: isActive
      ? 'border-b-2 border-blue-500 text-blue-500 -mb-[1px]'
      : 'text-gray-600 hover:text-gray-900 hover:border-b-2 hover:border-gray-300 -mb-[1px]',
    boxed: isActive
      ? 'bg-white border border-gray-200 border-b-white -mb-[1px] rounded-t-md text-gray-900'
      : 'border border-transparent hover:bg-gray-50 text-gray-600 hover:text-gray-900',
    pills: isActive
      ? 'bg-blue-500 text-white rounded-full'
      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full'
  };
  
  const baseClasses = 'font-medium transition-all duration-200 focus:outline-none';
  const widthClass = fullWidth ? 'flex-1' : '';
  
  const combinedClassName = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    widthClass,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={isActive}
      className={combinedClassName}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});

TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(({
  children,
  value,
  className = '',
  ...props
}, ref) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsContent must be used within Tabs');
  }
  
  const { activeTab } = context;
  
  if (activeTab !== value) {
    return null;
  }
  
  return (
    <div
      ref={ref}
      role="tabpanel"
      className={`mt-6 ${className}`}
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
    disabled?: boolean;
  }>;
  defaultTab?: string;
  variant?: 'line' | 'boxed' | 'pills';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export const SimpleTabs: React.FC<SimpleTabsProps> = ({
  tabs,
  defaultTab,
  variant = 'line',
  size = 'md',
  fullWidth = false,
  className = ''
}) => {
  const defaultValue = defaultTab || tabs[0]?.id;
  
  return (
    <Tabs defaultValue={defaultValue} className={className}>
      <TabsList variant={variant} size={size} fullWidth={fullWidth}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
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