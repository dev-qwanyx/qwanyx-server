import { default as React } from 'react';
export interface SimpleSelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}
export interface SimpleSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    options?: SimpleSelectOption[];
    placeholder?: string;
    fullWidth?: boolean;
    selectSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}
export declare const SimpleSelect: React.FC<SimpleSelectProps>;
//# sourceMappingURL=SimpleSelect.d.ts.map