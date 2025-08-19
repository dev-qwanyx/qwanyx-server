import { default as React } from 'react';
export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    variant?: 'line' | 'boxed' | 'pills' | 'segment' | 'nav';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    orientation?: 'horizontal' | 'vertical';
    swipeable?: boolean;
    color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
    backgroundColor?: string;
    mobileMode?: 'tabs' | 'dropdown' | 'auto';
    mobileBreakpoint?: number;
}
export declare const Tabs: React.ForwardRefExoticComponent<TabsProps & React.RefAttributes<HTMLDivElement>>;
export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'line' | 'boxed' | 'pills' | 'segment' | 'nav';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    orientation?: 'horizontal' | 'vertical';
    showArrows?: boolean;
    scrollable?: boolean;
}
export declare const TabsList: React.ForwardRefExoticComponent<TabsListProps & React.RefAttributes<HTMLDivElement>>;
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
export declare const TabsTrigger: React.FC<TabsTriggerProps>;
export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    keepMounted?: boolean;
}
export declare const TabsContent: React.ForwardRefExoticComponent<TabsContentProps & React.RefAttributes<HTMLDivElement>>;
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
    mobileMode?: 'tabs' | 'dropdown' | 'auto';
    mobileBreakpoint?: number;
}
export declare const SimpleTabs: React.FC<SimpleTabsProps>;
//# sourceMappingURL=Tabs.d.ts.map