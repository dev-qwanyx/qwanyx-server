import { default as React } from 'react';
export type AgileStatus = 'backlog' | 'todo' | 'doing' | 'review' | 'done' | 'blocked' | 'validated' | 'archived';
export interface AgileStatusIconProps {
    /**
     * The agile status
     */
    status: AgileStatus;
    /**
     * Progress value (0-100) - optional, will show appropriate icon based on status if not provided
     */
    progress?: number;
    /**
     * Size of the icon
     */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    /**
     * Show label next to icon
     */
    showLabel?: boolean;
    /**
     * Additional CSS classes
     */
    className?: string;
}
/**
 * AgileStatusIcon - A molecule combining Progress/Icon with agile status colors
 */
export declare const AgileStatusIcon: React.FC<AgileStatusIconProps>;
/**
 * AgileStatusBadge - A molecule combining Badge with agile status
 */
export interface AgileStatusBadgeProps {
    status: AgileStatus;
    progress?: number;
    showIcon?: boolean;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    variant?: 'solid' | 'outline' | 'subtle';
    className?: string;
}
export declare const AgileStatusBadge: React.FC<AgileStatusBadgeProps>;
/**
 * AgileTaskCard - A molecule for displaying task with status
 */
export interface AgileTaskCardProps {
    title: string;
    status: AgileStatus;
    progress?: number;
    assignee?: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    dueDate?: string;
    description?: string;
    className?: string;
}
export declare const AgileTaskCard: React.FC<AgileTaskCardProps>;
//# sourceMappingURL=AgileStatus.d.ts.map