import { default as React } from 'react';
export interface HeroWithFlipSectionProps {
    id?: string;
    title: string;
    subtitle?: string;
    description?: string;
    primaryAction?: {
        label: string;
        onClick?: () => void;
        icon?: React.ReactNode;
    };
    secondaryAction?: {
        label: string;
        onClick?: () => void;
        icon?: React.ReactNode;
    };
    images: string[];
    flipInterval?: number;
    flipDuration?: number;
    backgroundImage?: string;
    backgroundOverlay?: boolean;
    overlayOpacity?: number;
    variant?: 'default' | 'centered' | 'compact';
    flipPosition?: 'left' | 'right';
    flipSize?: 'sm' | 'md' | 'lg' | 'xl';
}
export declare const HeroWithFlipSection: React.FC<HeroWithFlipSectionProps>;
//# sourceMappingURL=HeroWithFlipSection.d.ts.map