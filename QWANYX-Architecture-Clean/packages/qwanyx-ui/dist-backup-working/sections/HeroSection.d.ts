import { default as React } from 'react';
export interface HeroSectionProps {
    id?: string;
    title: string;
    subtitle?: string;
    primaryAction?: {
        label: string;
        onClick?: () => void;
        href?: string;
    };
    secondaryAction?: {
        label: string;
        onClick?: () => void;
        href?: string;
    };
    backgroundImage?: string;
    backgroundGradient?: string;
    height?: string;
    variant?: 'default' | 'centered' | 'left' | 'right';
}
export declare const HeroSection: React.FC<HeroSectionProps>;
//# sourceMappingURL=HeroSection.d.ts.map