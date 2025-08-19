import { default as React } from 'react';
export interface DashboardPageProps {
    navigation?: {
        title?: string;
        items?: Array<{
            label: string;
            href?: string;
        }>;
        actions?: React.ReactNode;
    };
    user?: {
        name: string;
        role?: string;
        avatar?: string;
    };
    stats?: Array<{
        label: string;
        value: string | number;
        change?: string;
        trend?: 'up' | 'down' | 'neutral';
    }>;
    recentActivity?: Array<{
        title: string;
        description: string;
        time: string;
        icon?: React.ReactNode;
    }>;
    quickActions?: Array<{
        label: string;
        icon?: React.ReactNode;
        onClick?: () => void;
    }>;
}
export declare const DashboardPage: React.FC<DashboardPageProps>;
//# sourceMappingURL=DashboardPage.d.ts.map