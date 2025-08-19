import { default as React } from 'react';
export interface SidebarItem {
    id: string;
    label: string;
    icon?: string;
    href?: string;
    onClick?: () => void;
    badge?: string | number;
    active?: boolean;
    children?: SidebarItem[];
    disabled?: boolean;
}
export interface SuperSidebarProps {
    items: SidebarItem[];
    logo?: React.ReactNode | string;
    title?: string;
    user?: {
        name: string;
        email?: string;
        avatar?: string;
        role?: string;
    };
    footer?: React.ReactNode;
    collapsed?: boolean;
    onCollapse?: (collapsed: boolean) => void;
    width?: number | string;
    collapsedWidth?: number | string;
    position?: 'left' | 'right';
    theme?: 'light' | 'dark' | 'auto';
    className?: string;
    style?: React.CSSProperties;
}
export declare const SuperSidebar: React.FC<SuperSidebarProps>;
//# sourceMappingURL=SuperSidebar.d.ts.map