import { default as React, ReactNode } from 'react';
import { FieldValues, UseFormReturn, SubmitHandler, DefaultValues, RegisterOptions } from 'react-hook-form';
import { ZodSchema } from 'zod';
export interface FormProps<T extends FieldValues = FieldValues> {
    children: ReactNode;
    onSubmit: SubmitHandler<T>;
    schema?: ZodSchema;
    defaultValues?: DefaultValues<T>;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'bordered' | 'filled';
    methods?: UseFormReturn<T>;
}
export declare function Form<T extends FieldValues = FieldValues>({ children, onSubmit, schema, defaultValues, className, size, variant, methods: externalMethods }: FormProps<T>): import("react/jsx-runtime").JSX.Element;
export interface FieldProps {
    name: string;
    label?: string;
    help?: string;
    required?: boolean;
    children: ReactNode;
    className?: string;
    horizontal?: boolean;
    labelAlign?: 'left' | 'center' | 'right';
}
export declare const Field: React.FC<FieldProps>;
export interface ControlProps {
    children: ReactNode;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    loading?: boolean;
    className?: string;
}
export declare const Control: React.FC<ControlProps>;
export interface SelectOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}
export interface SelectProps {
    name: string;
    options: SelectOption[];
    placeholder?: string;
    multiple?: boolean;
    size?: number;
    loading?: boolean;
    disabled?: boolean;
    rules?: RegisterOptions;
    className?: string;
    fullWidth?: boolean;
}
export declare const Select: React.FC<SelectProps>;
export interface CheckboxProps {
    name?: string;
    label?: string;
    value?: string | number;
    disabled?: boolean;
    rules?: RegisterOptions;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    checked?: boolean;
    onChange?: (checked: boolean) => void;
}
export declare const Checkbox: React.FC<CheckboxProps>;
export interface FileInputProps {
    name: string;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    boxed?: boolean;
    centered?: boolean;
    fullWidth?: boolean;
    rules?: RegisterOptions;
    className?: string;
    label?: string;
    icon?: ReactNode;
}
export declare const FileInput: React.FC<FileInputProps>;
export { useFormContext, useForm } from 'react-hook-form';
export type { FieldValues, UseFormReturn, SubmitHandler } from 'react-hook-form';
//# sourceMappingURL=Form.d.ts.map