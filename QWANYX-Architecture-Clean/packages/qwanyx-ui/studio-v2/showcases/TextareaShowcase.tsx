import React from 'react';
import { Textarea } from '../../src';
import { ComponentConfigurator } from '../components/ComponentConfigurator';

const textareaAPI = {
  name: 'Textarea',
  description: 'Multi-line text input component with auto-resize and variants',
  interface: `export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'filled' | 'ghost';
  textareaSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  error?: boolean;
  success?: boolean;
  fullWidth?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  name?: string;
  rows?: number;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  // ...all standard textarea HTML props
}`,
  props: [
    {
      name: 'placeholder',
      type: 'text' as const,
      defaultValue: 'Enter your message...',
      description: 'Placeholder text when textarea is empty',
      required: false
    },
    {
      name: 'variant',
      type: 'select' as const,
      options: ['default', 'filled', 'ghost'],
      defaultValue: 'default',
      description: 'Visual style variant of the textarea'
    },
    {
      name: 'textareaSize',
      type: 'select' as const,
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      defaultValue: 'md',
      description: 'Size of the textarea'
    },
    {
      name: 'rows',
      type: 'number' as const,
      defaultValue: 4,
      description: 'Number of visible text lines'
    },
    {
      name: 'resize',
      type: 'select' as const,
      options: ['none', 'vertical', 'horizontal', 'both'],
      defaultValue: 'vertical',
      description: 'Resize behavior of the textarea'
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
      description: 'Disables the textarea'
    },
    {
      name: 'fullWidth',
      type: 'boolean' as const,
      defaultValue: false,
      description: 'Makes textarea take full width of container'
    }
  ],
  examples: [
    { name: 'Default', config: { placeholder: 'Type your message...', rows: 4 } },
    { name: 'Large Comment', config: { placeholder: 'Leave a comment...', textareaSize: 'lg', rows: 6 } },
    { name: 'Filled Style', config: { placeholder: 'Description...', variant: 'filled', rows: 3 } },
    { name: 'Error State', config: { placeholder: 'Required field', error: true, rows: 3 } },
    { name: 'Success State', config: { placeholder: 'Valid input', success: true, rows: 3 } },
    { name: 'No Resize', config: { placeholder: 'Fixed size', resize: 'none', rows: 5 } },
    { name: 'Full Width', config: { placeholder: 'Full width textarea', fullWidth: true, rows: 4 } },
    { name: 'Ghost Minimal', config: { placeholder: 'Minimal style...', variant: 'ghost', rows: 2 } }
  ]
};

export const TextareaShowcase: React.FC = () => {
  return <ComponentConfigurator component={Textarea} api={textareaAPI} />;
};