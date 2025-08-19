import { default as React } from 'react';
export interface RadioProps {
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
    variant?: 'default' | 'filled' | 'outlined';
    animation?: 'none' | 'smooth' | 'bounce' | 'pop' | 'pulse';
    label?: string;
    labelPosition?: 'left' | 'right';
    name?: string;
    value?: string;
    required?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
export declare const Radio: React.FC<RadioProps>;
export interface RadioGroupProps {
    children: React.ReactNode;
    label?: string;
    orientation?: 'horizontal' | 'vertical';
    gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    name?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    className?: string;
    style?: React.CSSProperties;
}
export declare const RadioGroup: React.FC<RadioGroupProps>;
//# sourceMappingURL=Radio.d.ts.map