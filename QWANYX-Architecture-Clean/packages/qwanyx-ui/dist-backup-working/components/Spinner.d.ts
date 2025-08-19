import { default as React } from 'react';
export interface SpinnerProps {
    /**
     * Size of the spinner
     */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    /**
     * Color of the spinner (uses theme colors)
     */
    color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
    /**
     * Type of spinner animation
     */
    type?: 'circle' | 'ring' | 'sync';
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
 * Spinner component for loading states
 */
export declare const Spinner: React.FC<SpinnerProps>;
export interface SpinnerWithTextProps extends SpinnerProps {
    text?: string;
    textPosition?: 'left' | 'right';
}
export declare const SpinnerWithText: React.FC<SpinnerWithTextProps>;
//# sourceMappingURL=Spinner.d.ts.map