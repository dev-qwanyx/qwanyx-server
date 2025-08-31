import React from 'react';
import { Input } from '../../src';
import { ComponentConfigurator } from '../components/ComponentConfigurator';

const inputAPI = {
  name: 'Input',
  description: 'Text input component with variants, sizes, states, and icon support',
  interface: `export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'filled' | 'ghost';
  inputSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  error?: boolean;
  success?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  name?: string;
  disabled?: boolean;
  placeholder?: string;
  type?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  // ...all standard input HTML props
}`,
  props: [
    {
      name: 'placeholder',
      type: 'text' as const,
      defaultValue: 'Enter text...',
      description: 'Placeholder text when input is empty',
      required: false
    },
    {
      name: 'variant',
      type: 'select' as const,
      options: ['default', 'filled', 'ghost'],
      defaultValue: 'default',
      description: 'Visual style variant of the input'
    },
    {
      name: 'inputSize',
      type: 'select' as const,
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      defaultValue: 'md',
      description: 'Size of the input'
    },
    {
      name: 'type',
      type: 'select' as const,
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date'],
      defaultValue: 'text',
      description: 'HTML input type'
    },
    {
      name: 'error',
      type: 'boolean' as const,
      defaultValue: false,
      description: 'Shows error state styling'
    },
    {
      name: 'success',
      type: 'boolean' as const,
      defaultValue: false,
      description: 'Shows success state styling'
    },
    {
      name: 'disabled',
      type: 'boolean' as const,
      defaultValue: false,
      description: 'Disables the input'
    },
    {
      name: 'fullWidth',
      type: 'boolean' as const,
      defaultValue: false,
      description: 'Makes input take full width of container'
    }
  ],
  examples: [
    { name: 'Default', config: { placeholder: 'Enter your name...', variant: 'default' } },
    { name: 'Email Input', config: { placeholder: 'email@example.com', type: 'email', inputSize: 'lg' } },
    { name: 'Password', config: { placeholder: 'Enter password', type: 'password', variant: 'filled' } },
    { name: 'Error State', config: { placeholder: 'Invalid input', error: true, variant: 'default' } },
    { name: 'Success State', config: { placeholder: 'Valid input', success: true, variant: 'default' } },
    { name: 'Ghost Style', config: { placeholder: 'Minimal input', variant: 'ghost' } },
    { name: 'Full Width', config: { placeholder: 'Full width input', fullWidth: true, inputSize: 'lg' } },
    { name: 'Small Disabled', config: { placeholder: 'Disabled', disabled: true, inputSize: 'sm' } }
  ]
};

export const InputShowcase: React.FC = () => {
  return <ComponentConfigurator component={Input} api={inputAPI} />;
};