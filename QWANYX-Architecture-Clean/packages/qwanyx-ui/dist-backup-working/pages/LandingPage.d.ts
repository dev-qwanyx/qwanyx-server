import { default as React } from 'react';
export interface LandingPageProps {
    navigation?: {
        title?: string;
        items?: Array<{
            label: string;
            href?: string;
        }>;
        actions?: React.ReactNode;
    };
    hero?: {
        title: string;
        subtitle?: string;
        primaryAction?: {
            label: string;
            onClick?: () => void;
        };
        secondaryAction?: {
            label: string;
            onClick?: () => void;
        };
        backgroundImage?: string;
    };
    features?: Array<{
        icon: string | React.ReactNode;
        title: string;
        description: string;
    }>;
    pricing?: Array<{
        title: string;
        price: string;
        description?: string;
        features: string[];
        highlighted?: boolean;
    }>;
    showFooter?: boolean;
}
export declare const LandingPage: React.FC<LandingPageProps>;
//# sourceMappingURL=LandingPage.d.ts.map