import { default as React } from 'react';
export interface SidebarItem {
    id: string;
    label: string;
    href?: string;
    icon?: React.ReactNode;
    badge?: string | number;
    children?: SidebarItem[];
    onClick?: () => void;
}
export interface SidebarProps {
    items: SidebarItem[];
    logo?: React.ReactNode;
    user?: {
        name: string;
        email?: string;
        avatar?: string;
        role?: string;
    };
    footer?: React.ReactNode;
    collapsed?: boolean;
    collapsible?: boolean;
    onCollapse?: (collapsed: boolean) => void;
    className?: string;
    width?: string;
    collapsedWidth?: string;
}
export declare const Sidebar: React.FC<SidebarProps>;
export interface SimpleSidebarProps {
    items: Array<{
        label: string;
        href?: string;
        icon?: React.ReactNode;
        badge?: string | number;
    }>;
    logo?: React.ReactNode;
    user?: {
        name: string;
        avatar?: string;
    };
}
export declare const SimpleSidebar: React.FC<SimpleSidebarProps>;
//# sourceMappingURL=Sidebar.d.ts.map