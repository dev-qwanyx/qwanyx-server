import { default as React } from 'react';
export interface ServiceCardProps {
    icon: string;
    iconColor?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
    title: string;
    description: string;
    hoverable?: boolean;
    className?: string;
}
export declare const ServiceCard: React.FC<ServiceCardProps>;
//# sourceMappingURL=ServiceCard.d.ts.map