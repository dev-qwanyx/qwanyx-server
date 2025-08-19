import { default as React } from 'react';
export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
    fixed?: boolean;
    transparent?: boolean;
    bordered?: boolean;
}
export declare const Navbar: React.ForwardRefExoticComponent<NavbarProps & React.RefAttributes<HTMLElement>>;
export interface NavbarBrandProps extends React.HTMLAttributes<HTMLDivElement> {
}
export declare const NavbarBrand: React.ForwardRefExoticComponent<NavbarBrandProps & React.RefAttributes<HTMLDivElement>>;
export interface NavbarLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    size?: 'sm' | 'md' | 'lg';
}
export declare const NavbarLogo: React.ForwardRefExoticComponent<NavbarLogoProps & React.RefAttributes<HTMLImageElement>>;
export interface NavbarContentProps extends React.HTMLAttributes<HTMLDivElement> {
    align?: 'left' | 'center' | 'right';
}
export declare const NavbarContent: React.ForwardRefExoticComponent<NavbarContentProps & React.RefAttributes<HTMLDivElement>>;
export interface NavbarItemProps {
    children?: React.ReactNode;
    active?: boolean;
    as?: 'div' | 'a' | 'button';
    href?: string;
    className?: string;
    onClick?: () => void;
}
export declare const NavbarItem: React.ForwardRefExoticComponent<NavbarItemProps & React.RefAttributes<HTMLDivElement>>;
export interface NavbarMenuProps extends React.HTMLAttributes<HTMLDivElement> {
    mobile?: boolean;
    open?: boolean;
}
export declare const NavbarMenu: React.ForwardRefExoticComponent<NavbarMenuProps & React.RefAttributes<HTMLDivElement>>;
export interface SimpleNavbarProps extends React.HTMLAttributes<HTMLElement> {
    logo?: React.ReactNode;
    title?: string;
    subtitle?: string;
    items?: Array<{
        label: string;
        href?: string;
        active?: boolean;
        onClick?: () => void;
    }>;
    actions?: React.ReactNode;
    fixed?: boolean;
    sticky?: boolean;
}
export declare const SimpleNavbar: React.FC<SimpleNavbarProps>;
//# sourceMappingURL=Navbar.d.ts.map