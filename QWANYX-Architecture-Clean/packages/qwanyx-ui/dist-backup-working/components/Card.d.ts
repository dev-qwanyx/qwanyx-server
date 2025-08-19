import { default as React } from 'react';
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'elevated' | 'outlined' | 'filled' | 'glass' | 'gradient' | 'neon';
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    hoverable?: boolean;
    clickable?: boolean;
    glowColor?: string;
    gradientFrom?: string;
    gradientTo?: string;
    blur?: boolean;
    animation?: 'none' | 'lift' | 'glow' | 'tilt' | 'morph';
}
export declare const Card: React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>>;
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    bordered?: boolean;
}
export declare const CardHeader: React.ForwardRefExoticComponent<CardHeaderProps & React.RefAttributes<HTMLDivElement>>;
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    size?: 'sm' | 'md' | 'lg' | 'xl';
}
export declare const CardTitle: React.ForwardRefExoticComponent<CardTitleProps & React.RefAttributes<HTMLHeadingElement>>;
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    color?: 'default' | 'muted' | 'secondary';
}
export declare const CardDescription: React.ForwardRefExoticComponent<CardDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    noPadding?: boolean;
}
export declare const CardContent: React.ForwardRefExoticComponent<CardContentProps & React.RefAttributes<HTMLDivElement>>;
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    bordered?: boolean;
    justify?: 'start' | 'center' | 'end' | 'between';
}
export declare const CardFooter: React.ForwardRefExoticComponent<CardFooterProps & React.RefAttributes<HTMLDivElement>>;
export interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    aspectRatio?: 'square' | '16/9' | '4/3' | '21/9';
    overlay?: boolean;
    overlayGradient?: string;
}
export declare const CardImage: React.ForwardRefExoticComponent<CardImageProps & React.RefAttributes<HTMLImageElement>>;
//# sourceMappingURL=Card.d.ts.map