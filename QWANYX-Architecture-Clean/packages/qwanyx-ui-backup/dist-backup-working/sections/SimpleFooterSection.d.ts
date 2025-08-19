import { default as React } from 'react';
export interface SimpleFooterSectionProps {
    logo?: React.ReactNode;
    title?: string;
    description?: string;
    address?: {
        street?: string;
        city?: string;
        country?: string;
    };
    phone?: string;
    email?: string;
    links?: Array<{
        label: string;
        href?: string;
        onClick?: () => void;
    }>;
    socials?: Array<{
        icon: string;
        href?: string;
        onClick?: () => void;
        label?: string;
    }>;
    copyright?: string;
    className?: string;
    bgColor?: string;
    textColor?: string;
}
export declare const SimpleFooterSection: React.FC<SimpleFooterSectionProps>;
//# sourceMappingURL=SimpleFooterSection.d.ts.map