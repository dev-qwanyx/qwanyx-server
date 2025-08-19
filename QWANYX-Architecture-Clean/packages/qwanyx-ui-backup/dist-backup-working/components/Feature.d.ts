import { default as React } from 'react';
export interface FeatureProps extends React.HTMLAttributes<HTMLDivElement> {
    icon?: React.ReactNode;
    iconPosition?: 'top' | 'left' | 'right';
    centered?: boolean;
}
export declare const Feature: React.ForwardRefExoticComponent<FeatureProps & React.RefAttributes<HTMLDivElement>>;
export interface FeatureIconProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'circle' | 'square' | 'none';
    color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
}
export declare const FeatureIcon: React.ForwardRefExoticComponent<FeatureIconProps & React.RefAttributes<HTMLDivElement>>;
export interface FeatureTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    as?: 'h2' | 'h3' | 'h4' | 'h5';
}
export declare const FeatureTitle: React.ForwardRefExoticComponent<FeatureTitleProps & React.RefAttributes<HTMLHeadingElement>>;
export interface FeatureDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
}
export declare const FeatureDescription: React.ForwardRefExoticComponent<FeatureDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
export interface FeaturesGridProps extends React.HTMLAttributes<HTMLDivElement> {
    cols?: 1 | 2 | 3 | 4;
    gap?: 'sm' | 'md' | 'lg' | 'xl';
}
export declare const FeaturesGrid: React.ForwardRefExoticComponent<FeaturesGridProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Feature.d.ts.map