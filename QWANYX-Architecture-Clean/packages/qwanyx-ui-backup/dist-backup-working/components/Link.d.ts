import { default as React } from 'react';
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    smoothScroll?: boolean | 'smooth' | 'auto';
    scrollOffset?: number;
    animated?: boolean;
    hoverScale?: number;
    hoverColor?: string;
    activeColor?: string;
    underline?: boolean | 'hover' | 'always' | 'never';
    variant?: 'default' | 'nav' | 'footer';
    children: React.ReactNode;
}
export declare const Link: React.FC<LinkProps>;
export interface NavLinkProps extends LinkProps {
    active?: boolean;
}
export declare const NavLink: React.FC<NavLinkProps>;
export default Link;
//# sourceMappingURL=Link.d.ts.map