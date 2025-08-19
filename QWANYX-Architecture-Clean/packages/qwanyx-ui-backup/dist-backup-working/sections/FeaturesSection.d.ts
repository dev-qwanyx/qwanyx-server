import { default as React } from 'react';
export interface FeatureItem {
    icon: string | React.ReactNode;
    title: string;
    description: string;
}
export interface FeaturesSectionProps {
    id?: string;
    title?: string;
    subtitle?: string;
    features: FeatureItem[];
    columns?: 2 | 3 | 4 | 6;
    variant?: 'default' | 'centered' | 'cards' | 'minimal';
    backgroundColor?: string;
}
export declare const FeaturesSection: React.FC<FeaturesSectionProps>;
//# sourceMappingURL=FeaturesSection.d.ts.map