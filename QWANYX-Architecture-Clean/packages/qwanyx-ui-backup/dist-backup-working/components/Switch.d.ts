import { default as React } from 'react';
export interface SwitchProps {
    /**
     * Whether the switch is checked
     */
    checked?: boolean;
    /**
     * Default checked state (for uncontrolled component)
     */
    defaultChecked?: boolean;
    /**
     * Callback when switch state changes
     */
    onChange?: (checked: boolean) => void;
    /**
     * Whether the switch is disabled
     */
    disabled?: boolean;
    /**
     * Size of the switch
     */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    /**
     * Color when checked
     */
    color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
    /**
     * Label text for the switch
     */
    label?: string;
    /**
     * Position of the label
     */
    labelPosition?: 'left' | 'right';
    /**
     * Name attribute for form submission
     */
    name?: string;
    /**
     * Value attribute for form submission
     */
    value?: string;
    /**
     * Additional CSS classes
     */
    className?: string;
    /**
     * Required field
     */
    required?: boolean;
}
/**
 * Switch component for binary choices
 */
export declare const Switch: React.FC<SwitchProps>;
export interface SwitchGroupProps {
    children: React.ReactNode;
    label?: string;
    orientation?: 'horizontal' | 'vertical';
    className?: string;
}
export declare const SwitchGroup: React.FC<SwitchGroupProps>;
//# sourceMappingURL=Switch.d.ts.map