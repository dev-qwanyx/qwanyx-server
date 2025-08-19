import { default as React } from 'react';
export interface SuperNavbarMenuItem {
    label?: string;
    href?: string;
    onClick?: () => void;
    icon?: string;
    badge?: string | number;
    children?: SuperNavbarMenuItem[];
    description?: string;
    divider?: boolean;
    active?: boolean;
}
export interface SuperNavbarProps {
    logo?: string | React.ReactNode;
    title?: string;
    subtitle?: string;
    onLogoClick?: () => void;
    items?: SuperNavbarMenuItem[];
    search?: boolean;
    searchPlaceholder?: string;
    onSearch?: (query: string) => void;
    searchExpanded?: boolean;
    user?: {
        name: string;
        email?: string;
        avatar?: string;
        role?: string;
    };
    userMenuItems?: SuperNavbarMenuItem[];
    onLogout?: () => void;
    notifications?: Array<{
        id: string;
        title: string;
        description?: string;
        time?: string;
        read?: boolean;
        icon?: string;
        type?: 'info' | 'success' | 'warning' | 'error';
    }>;
    notificationCount?: number;
    onNotificationClick?: (id: string) => void;
    onNotificationsClear?: () => void;
    actions?: React.ReactNode;
    primaryAction?: {
        label: string;
        onClick: () => void;
        icon?: string;
    };
    secondaryAction?: {
        label: string;
        onClick: () => void;
        icon?: string;
        variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    };
    variant?: 'default' | 'minimal' | 'centered' | 'dashboard' | 'landing';
    position?: 'static' | 'fixed' | 'sticky' | 'absolute';
    transparent?: boolean;
    blur?: boolean;
    bordered?: boolean;
    elevated?: boolean;
    hideOnScroll?: boolean;
    mobileBreakpoint?: number;
    mobileMenuType?: 'drawer' | 'fullscreen' | 'dropdown';
    dark?: boolean;
    color?: 'primary' | 'secondary' | 'accent' | string;
    height?: string;
    className?: string;
    style?: React.CSSProperties;
}
export declare const SuperNavbar: React.FC<SuperNavbarProps>;
//# sourceMappingURL=SuperNavbar.d.ts.map