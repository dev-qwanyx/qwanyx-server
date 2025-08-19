import { RegisterOptions } from 'react-hook-form';
import { ZodSchema } from 'zod';

/**
 * Base field configuration for form generation
 */
export interface FormField {
  // Core properties
  name: string;
  label?: string;
  type: FormFieldType;
  placeholder?: string;
  defaultValue?: any;
  required?: boolean;
  disabled?: boolean;
  
  // Validation
  validation?: 'email' | 'phone' | 'url' | 'vat' | 'linkedin' | RegExp | ((value: any) => boolean | string);
  rules?: RegisterOptions;
  
  // Options for select, radio, checkbox
  options?: FormFieldOption[];
  
  // Layout
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  className?: string;
  
  // Conditional display
  showIf?: string | ((formData: any) => boolean);
  
  // Help & errors
  helperText?: string;
  errorMessage?: string;
  
  // Other HTML attributes
  autoComplete?: string;
  min?: number | string;
  max?: number | string;
  step?: number;
  rows?: number; // for textarea
  accept?: string; // for file input
  multiple?: boolean; // for file input or multi-select
}

/**
 * Option for select, radio, checkbox fields
 */
export interface FormFieldOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

/**
 * Supported field types
 */
export type FormFieldType = 
  // Text inputs
  | 'text'
  | 'email'
  | 'password'
  | 'tel'
  | 'url'
  | 'number'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'textarea'
  | 'search'
  
  // Selection
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'switch'
  
  // Special
  | 'file'
  | 'otp'
  | 'color'
  | 'range'
  
  // Custom
  | 'custom';

/**
 * Form configuration
 */
export interface FormConfig {
  fields: FormField[];
  schema?: ZodSchema;
  layout?: 'vertical' | 'horizontal' | 'inline';
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 12 | 'auto';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  submitButton?: {
    text?: string;
    variant?: 'solid' | 'outline' | 'ghost';
    color?: 'primary' | 'secondary' | 'success' | 'error';
    fullWidth?: boolean;
    loading?: boolean;
    disabled?: boolean;
  };
  resetButton?: {
    show?: boolean;
    text?: string;
  };
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Form generator props
 */
export interface FormGeneratorProps {
  config: FormConfig;
  onSubmit: (data: any) => void | Promise<void>;
  onChange?: (data: any) => void;
  onError?: (errors: any) => void;
  defaultValues?: Record<string, any>;
  mode?: 'onSubmit' | 'onChange' | 'onBlur' | 'onTouched' | 'all';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Field renderer props
 */
export interface FieldRendererProps {
  field: FormField;
  value?: any;
  error?: string;
  onChange: (value: any) => void;
  onBlur?: () => void;
  disabled?: boolean;
}

/**
 * Validation helper types
 */
export type ValidationFunction = (value: any) => boolean | string;

export interface ValidationRule {
  type: 'required' | 'pattern' | 'min' | 'max' | 'minLength' | 'maxLength' | 'custom';
  value?: any;
  message?: string;
  validator?: ValidationFunction;
}

/**
 * Form state
 */
export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}