import { default as React } from 'react';
export interface NavigationItem {
    label: string;
    href?: string;
    active?: boolean;
    onClick?: () => void;
}
export interface PageProps {
    children: React.ReactNode;
    navigation?: {
        title?: string;
        subtitle?: string;
        logo?: React.ReactNode;
        items?: NavigationItem[];
        actions?: React.ReactNode;
        fixed?: boolean;
        sticky?: boolean;
    };
    footer?: {
        show?: boolean;
        content?: React.ReactNode;
    };
    title?: string;
    description?: string;
    keywords?: string;
    author?: string;
    ogImage?: string;
    className?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundGradient?: string;
    minHeight?: string;
    fullWidth?: boolean;
    noPadding?: boolean;
    centered?: boolean;
}
export declare const Page: React.FC<PageProps>;
export interface PageHeaderProps {
    children: React.ReactNode;
    sticky?: boolean;
    transparent?: boolean;
    className?: string;
}
export declare const PageHeader: React.FC<PageHeaderProps>;
export interface PageContentProps {
    children: React.ReactNode;
    className?: string;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    padding?: boolean;
}
export declare const PageContent: React.FC<PageContentProps>;
export interface PageFooterProps {
    children: React.ReactNode;
    className?: string;
    sticky?: boolean;
}
export declare const PageFooter: React.FC<PageFooterProps>;
export interface PageSectionProps {
    children: React.ReactNode;
    className?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    id?: string;
    style?: React.CSSProperties;
}
export declare const PageSection: React.FC<PageSectionProps>;
//# sourceMappingURL=Page.d.ts.map