import { default as React, ReactNode } from 'react';
import { SuperNavbarProps } from './SuperNavbar';
import { SuperSidebarProps } from './SuperSidebar';
export interface DashboardLayoutProps {
    navbar?: SuperNavbarProps | false;
    sidebar?: SuperSidebarProps | false;
    rightSidebar?: SuperSidebarProps | false;
    children: ReactNode;
    contentPadding?: boolean;
    contentMaxWidth?: number | string | false;
    className?: string;
    style?: React.CSSProperties;
}
export declare const DashboardLayout: React.FC<DashboardLayoutProps>;
export declare const ContentLayout: React.FC<DashboardLayoutProps>;
export declare const FullWidthLayout: React.FC<DashboardLayoutProps>;
//# sourceMappingURL=DashboardLayout.d.ts.map