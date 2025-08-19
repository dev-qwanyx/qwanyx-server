import { default as React } from 'react';
export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
    variant?: 'simple' | 'detailed' | 'minimal';
}
export declare const Footer: React.ForwardRefExoticComponent<FooterProps & React.RefAttributes<HTMLElement>>;
export interface FooterSectionProps extends React.HTMLAttributes<HTMLDivElement> {
}
export declare const FooterSection: React.ForwardRefExoticComponent<FooterSectionProps & React.RefAttributes<HTMLDivElement>>;
export interface FooterTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
}
export declare const FooterTitle: React.ForwardRefExoticComponent<FooterTitleProps & React.RefAttributes<HTMLHeadingElement>>;
export interface FooterLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
}
export declare const FooterLink: React.ForwardRefExoticComponent<FooterLinkProps & React.RefAttributes<HTMLAnchorElement>>;
export interface FooterLinksProps extends React.HTMLAttributes<HTMLUListElement> {
    spacing?: 'sm' | 'md' | 'lg';
}
export declare const FooterLinks: React.ForwardRefExoticComponent<FooterLinksProps & React.RefAttributes<HTMLUListElement>>;
export interface FooterGridProps extends React.HTMLAttributes<HTMLDivElement> {
    cols?: 2 | 3 | 4 | 5 | 6;
    gap?: 'sm' | 'md' | 'lg' | 'xl';
}
export declare const FooterGrid: React.ForwardRefExoticComponent<FooterGridProps & React.RefAttributes<HTMLDivElement>>;
export interface FooterBottomProps extends React.HTMLAttributes<HTMLDivElement> {
}
export declare const FooterBottom: React.ForwardRefExoticComponent<FooterBottomProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Footer.d.ts.map