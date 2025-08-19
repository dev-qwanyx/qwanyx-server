import { default as React } from 'react';
export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    centered?: boolean;
    overlay?: boolean;
    overlayOpacity?: number;
    backgroundImage?: string;
    backgroundColor?: string;
}
export declare const Hero: React.ForwardRefExoticComponent<HeroProps & React.RefAttributes<HTMLElement>>;
export interface HeroTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    as?: 'h1' | 'h2' | 'h3';
}
export declare const HeroTitle: React.ForwardRefExoticComponent<HeroTitleProps & React.RefAttributes<HTMLHeadingElement>>;
export interface HeroSubtitleProps extends React.HTMLAttributes<HTMLParagraphElement> {
}
export declare const HeroSubtitle: React.ForwardRefExoticComponent<HeroSubtitleProps & React.RefAttributes<HTMLParagraphElement>>;
export interface HeroContentProps extends React.HTMLAttributes<HTMLDivElement> {
}
export declare const HeroContent: React.ForwardRefExoticComponent<HeroContentProps & React.RefAttributes<HTMLDivElement>>;
export interface HeroActionsProps extends React.HTMLAttributes<HTMLDivElement> {
    spacing?: 'sm' | 'md' | 'lg';
}
export declare const HeroActions: React.ForwardRefExoticComponent<HeroActionsProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Hero.d.ts.map