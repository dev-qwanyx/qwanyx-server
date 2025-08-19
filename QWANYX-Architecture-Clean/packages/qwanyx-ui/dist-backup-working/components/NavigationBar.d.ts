import { default as React } from 'react';
export interface NavItem {
    label: string;
    href?: string;
    onClick?: () => void;
    active?: boolean;
    icon?: React.ReactNode;
    badge?: string | number;
    children?: NavItem[];
}
export interface NavigationBarProps {
    logo?: React.ReactNode;
    title?: string;
    subtitle?: string;
    onBrandClick?: () => void;
    items?: NavItem[];
    actions?: React.ReactNode;
    search?: boolean;
    searchPlaceholder?: string;
    onSearch?: (query: string) => void;
    variant?: 'default' | 'minimal' | 'centered' | 'full';
    position?: 'static' | 'fixed' | 'sticky';
    transparent?: boolean;
    bordered?: boolean;
    elevated?: boolean;
    mobileBreakpoint?: number;
    mobileMenuType?: 'drawer' | 'fullscreen' | 'dropdown';
    height?: string;
    backgroundColor?: string;
    className?: string;
    style?: React.CSSProperties;
}
export declare const NavigationBar: React.FC<NavigationBarProps>;
//# sourceMappingURL=NavigationBar.d.ts.map