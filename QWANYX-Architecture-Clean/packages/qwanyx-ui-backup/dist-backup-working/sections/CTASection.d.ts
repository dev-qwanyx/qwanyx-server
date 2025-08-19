import { default as React } from 'react';
export interface CTASectionProps {
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
    backgroundGradient?: string;
    backgroundColor?: string;
    variant?: 'default' | 'centered' | 'split' | 'minimal';
}
export declare const CTASection: React.FC<CTASectionProps>;
//# sourceMappingURL=CTASection.d.ts.map