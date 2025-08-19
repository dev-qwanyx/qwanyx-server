import { default as React } from 'react';
export interface PricingPlan {
    id: string;
    name: string;
    price: string;
    period?: string;
    description?: string;
    features: string[];
    highlighted?: boolean;
    badge?: string;
    ctaLabel?: string;
    ctaAction?: () => void;
}
export interface PricingSectionProps {
    id?: string;
    title?: string;
    subtitle?: string;
    plans: PricingPlan[];
    columns?: 2 | 3 | 4;
    backgroundColor?: string;
}
export declare const PricingSection: React.FC<PricingSectionProps>;
//# sourceMappingURL=PricingSection.d.ts.map