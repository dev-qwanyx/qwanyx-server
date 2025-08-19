import { default as React } from 'react';
export interface ProgressProps {
    /**
     * Progress value (0-100)
     */
    value: number;
    /**
     * Size of the progress indicator
     */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    /**
     * Color of the progress indicator
     */
    color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
    /**
     * Type of progress display
     */
    type?: 'circular' | 'bar' | 'dots';
    /**
     * Show percentage text
     */
    showPercent?: boolean;
    /**
     * Additional CSS classes
     */
    className?: string;
    /**
     * Accessibility label
     */
    label?: string;
}
/**
 * Progress component for showing completion status
 */
export declare const Progress: React.FC<ProgressProps>;
export interface ProgressWithLabelProps extends ProgressProps {
    label: string;
    labelPosition?: 'top' | 'bottom' | 'left' | 'right';
}
export declare const ProgressWithLabel: React.FC<ProgressWithLabelProps>;
//# sourceMappingURL=Progress.d.ts.map