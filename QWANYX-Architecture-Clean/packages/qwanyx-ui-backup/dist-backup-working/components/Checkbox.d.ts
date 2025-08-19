import { default as React } from 'react';
export interface CheckboxProps {
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    indeterminate?: boolean;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
    variant?: 'default' | 'filled' | 'outlined';
    animation?: 'none' | 'smooth' | 'bounce' | 'pop';
    label?: string;
    labelPosition?: 'left' | 'right';
    name?: string;
    value?: string;
    required?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
export declare const Checkbox: React.FC<CheckboxProps>;
export interface CheckboxGroupProps {
    children: React.ReactNode;
    label?: string;
    orientation?: 'horizontal' | 'vertical';
    gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    style?: React.CSSProperties;
}
export declare const CheckboxGroup: React.FC<CheckboxGroupProps>;
//# sourceMappingURL=Checkbox.d.ts.map