import { default as React } from 'react';
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: 'default' | 'filled' | 'ghost';
    inputSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    error?: boolean;
    success?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    name?: string;
}
export declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    variant?: 'default' | 'filled' | 'ghost';
    textareaSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    error?: boolean;
    success?: boolean;
    fullWidth?: boolean;
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
    name?: string;
}
export declare const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;
//# sourceMappingURL=Input.d.ts.map