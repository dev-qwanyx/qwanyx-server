import { default as React } from 'react';
export interface HolyGrailLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
    header?: React.ReactNode;
    footer?: React.ReactNode;
    sidebar?: React.ReactNode;
    aside?: React.ReactNode;
    sidebarPosition?: 'left' | 'right';
    asidePosition?: 'left' | 'right';
    sidebarWidth?: string;
    asideWidth?: string;
    headerHeight?: string;
    footerHeight?: string;
    gap?: 'none' | 'sm' | 'md' | 'lg';
    stickyHeader?: boolean;
    stickyFooter?: boolean;
    stickySidebar?: boolean;
}
export declare const HolyGrailLayout: React.ForwardRefExoticComponent<HolyGrailLayoutProps & React.RefAttributes<HTMLDivElement>>;
export interface MagazineLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
    hero?: React.ReactNode;
    featured?: React.ReactNode[];
    sidebar?: React.ReactNode;
    gap?: 'sm' | 'md' | 'lg' | 'xl';
}
export declare const MagazineLayout: React.ForwardRefExoticComponent<MagazineLayoutProps & React.RefAttributes<HTMLDivElement>>;
export interface SplitLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
    left: React.ReactNode;
    right: React.ReactNode;
    ratio?: '50-50' | '60-40' | '40-60' | '70-30' | '30-70' | 'golden';
    gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    stackOnMobile?: boolean;
    reverseOnMobile?: boolean;
}
export declare const SplitLayout: React.ForwardRefExoticComponent<SplitLayoutProps & React.RefAttributes<HTMLDivElement>>;
export interface BentoLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
    gap?: 'sm' | 'md' | 'lg';
}
export declare const BentoLayout: React.ForwardRefExoticComponent<BentoLayoutProps & React.RefAttributes<HTMLDivElement>>;
export interface AsymmetricLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'editorial' | 'artistic' | 'dynamic';
    gap?: 'sm' | 'md' | 'lg' | 'xl';
}
export declare const AsymmetricLayout: React.ForwardRefExoticComponent<AsymmetricLayoutProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Layouts.d.ts.map