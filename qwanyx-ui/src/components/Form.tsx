import React, { createContext, useContext, ReactNode } from 'react';
import { 
  useForm as useReactHookForm, 
  FormProvider, 
  useFormContext,
  FieldValues,
  UseFormReturn,
  SubmitHandler,
  DefaultValues,
  RegisterOptions
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';

// Form Context
interface FormContextValue {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'bordered' | 'filled';
}

const FormStyleContext = createContext<FormContextValue>({});

// Form Component
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

export function Form<T extends FieldValues = FieldValues>({
  children,
  onSubmit,
  schema,
  defaultValues,
  className = '',
  size = 'md',
  variant = 'default',
  methods: externalMethods
}: FormProps<T>) {
  const internalMethods = useReactHookForm<T>({
    defaultValues,
    resolver: schema ? zodResolver(schema as any) : undefined
  });

  const methods = externalMethods || internalMethods;

  return (
    <FormProvider {...methods}>
      <FormStyleContext.Provider value={{ size, variant }}>
        <form 
          onSubmit={methods.handleSubmit(onSubmit)}
          className={`form ${className}`}
          noValidate
        >
          {children}
        </form>
      </FormStyleContext.Provider>
    </FormProvider>
  );
}

// Field Component (wrapper for form fields with label and error)
export interface FieldProps {
  name: string;
  label?: string;
  help?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  horizontal?: boolean;
}

export const Field: React.FC<FieldProps> = ({
  name,
  label,
  help,
  required,
  children,
  className = '',
  horizontal = false
}) => {
  const methods = useFormContext();
  const error = methods?.formState?.errors?.[name];

  const fieldClass = horizontal ? 'field is-horizontal' : 'field';
  const labelClass = horizontal ? 'field-label' : '';
  const bodyClass = horizontal ? 'field-body' : '';

  return (
    <div className={`${fieldClass} ${className}`}>
      {label && (
        <div className={labelClass}>
          <label className="label" htmlFor={name}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
      )}
      <div className={bodyClass}>
        <div className="field">
          <div className="control">
            {children}
          </div>
          {help && !error && (
            <p className="help text-gray-500">{help}</p>
          )}
          {error && (
            <p className="help text-red-500">
              {typeof error === 'object' && error !== null && 'message' in error 
                ? (error as any).message 
                : 'This field is invalid'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Control Component (wrapper for form controls)
export interface ControlProps {
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  className?: string;
}

export const Control: React.FC<ControlProps> = ({
  children,
  leftIcon,
  rightIcon,
  loading = false,
  className = ''
}) => {
  const hasIcons = leftIcon || rightIcon;
  const controlClass = [
    'control',
    hasIcons && 'has-icons',
    leftIcon && 'has-icons-left',
    rightIcon && 'has-icons-right',
    loading && 'is-loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={controlClass}>
      {children}
      {leftIcon && (
        <span className="icon is-left">
          {leftIcon}
        </span>
      )}
      {rightIcon && (
        <span className="icon is-right">
          {rightIcon}
        </span>
      )}
    </div>
  );
};

// Select Component
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

export const Select: React.FC<SelectProps> = ({
  name,
  options,
  placeholder,
  multiple = false,
  size,
  loading = false,
  disabled = false,
  rules,
  className = '',
  fullWidth = false
}) => {
  const { register } = useFormContext();
  const { size: formSize, variant } = useContext(FormStyleContext);

  const sizeClasses = {
    sm: 'text-sm py-1 px-2',
    md: 'text-base py-2 px-3',
    lg: 'text-lg py-3 px-4'
  };

  const variantClasses = {
    default: 'border-gray-300 focus:border-blue-500',
    bordered: 'border-2 border-gray-400 focus:border-blue-500',
    filled: 'bg-gray-100 border-transparent focus:bg-white focus:border-blue-500'
  };

  const selectClass = [
    'select',
    sizeClasses[formSize || 'md'],
    variantClasses[variant || 'default'],
    'rounded-md',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-blue-500',
    'focus:ring-opacity-50',
    fullWidth && 'w-full',
    disabled && 'opacity-50 cursor-not-allowed',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={`select-wrapper ${loading ? 'is-loading' : ''}`}>
      <select
        {...register(name, rules)}
        multiple={multiple}
        size={size}
        disabled={disabled || loading}
        className={selectClass}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Checkbox Component
export interface CheckboxProps {
  name: string;
  label?: string;
  value?: string | number;
  disabled?: boolean;
  rules?: RegisterOptions;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Checkbox: React.FC<CheckboxProps> = ({
  name,
  label,
  value,
  disabled = false,
  rules,
  className = '',
  size = 'md'
}) => {
  const { register } = useFormContext();
  const { size: formSize } = useContext(FormStyleContext);
  const actualSize = size || formSize || 'md';

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <label className={`inline-flex items-center gap-2 cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}>
      <input
        type="checkbox"
        {...register(name, rules)}
        value={value}
        disabled={disabled}
        className={`
          ${sizeClasses[actualSize]}
          rounded 
          border-gray-300 
          text-blue-600 
          focus:ring-2 
          focus:ring-blue-500 
          focus:ring-offset-0
          disabled:opacity-50
          disabled:cursor-not-allowed
          cursor-pointer
        `}
      />
      {label && (
        <span className={`${textSizeClasses[actualSize]} select-none`}>
          {label}
        </span>
      )}
    </label>
  );
};

// Radio Component
export interface RadioProps {
  name: string;
  label?: string;
  value: string | number;
  disabled?: boolean;
  rules?: RegisterOptions;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Radio: React.FC<RadioProps> = ({
  name,
  label,
  value,
  disabled = false,
  rules,
  className = '',
  size = 'md'
}) => {
  const { register } = useFormContext();
  const { size: formSize } = useContext(FormStyleContext);
  const actualSize = size || formSize || 'md';

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <label className={`inline-flex items-center gap-2 cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}>
      <input
        type="radio"
        {...register(name, rules)}
        value={value}
        disabled={disabled}
        className={`
          ${sizeClasses[actualSize]}
          border-gray-300 
          text-blue-600 
          focus:ring-2 
          focus:ring-blue-500 
          focus:ring-offset-0
          disabled:opacity-50
          disabled:cursor-not-allowed
          cursor-pointer
        `}
      />
      {label && (
        <span className={`${textSizeClasses[actualSize]} select-none`}>
          {label}
        </span>
      )}
    </label>
  );
};

// File Input Component
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

export const FileInput: React.FC<FileInputProps> = ({
  name,
  accept,
  multiple = false,
  disabled = false,
  boxed = false,
  centered = false,
  fullWidth = false,
  rules,
  className = '',
  label = 'Choose a file...',
  icon
}) => {
  const { register, watch } = useFormContext();
  const files = watch(name);

  const fileInputClass = [
    'file',
    boxed && 'has-boxed',
    centered && 'is-centered',
    fullWidth && 'is-fullwidth',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={fileInputClass}>
      <label className="file-label">
        <input
          className="file-input"
          type="file"
          {...register(name, rules)}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
        />
        <span className="file-cta">
          {icon && (
            <span className="file-icon">
              {icon}
            </span>
          )}
          <span className="file-label">
            {label}
          </span>
        </span>
        {files && files.length > 0 && (
          <span className="file-name">
            {multiple 
              ? `${files.length} files selected`
              : files[0]?.name
            }
          </span>
        )}
      </label>
    </div>
  );
};

// Export useFormContext for custom components
export { useFormContext, useForm } from 'react-hook-form';
export type { FieldValues, UseFormReturn, SubmitHandler } from 'react-hook-form';