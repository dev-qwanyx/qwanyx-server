import React from 'react';
import { Button } from '../../src';
import { ComponentConfigurator } from '../components/ComponentConfigurator';

const buttonAPI = {
  name: 'Button',
  description: 'Interactive button component with multiple variants, sizes, and states',
  props: [
    {
      name: 'children',
      type: 'text' as const,
      defaultValue: 'Click me',
      description: 'The content to display inside the button',
      required: true
    },
    {
      name: 'variant',
      type: 'select' as const,
      options: ['solid', 'outline', 'ghost', 'link', 'validate', 'tab', 'pill', 'segment', 'nav'],
      defaultValue: 'solid',
      description: 'Visual style variant of the button'
    },
    {
      name: 'color',
      type: 'select' as const,
      options: ['primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info'],
      defaultValue: 'primary',
      description: 'Color scheme for the button'
    },
    {
      name: 'size',
      type: 'select' as const,
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      defaultValue: 'md',
      description: 'Size of the button'
    },
    {
      name: 'fullWidth',
      type: 'boolean' as const,
      defaultValue: false,
      description: 'Whether the button should take full width of its container'
    },
    {
      name: 'loading',
      type: 'boolean' as const,
      defaultValue: false,
      description: 'Shows loading spinner and disables interaction'
    },
    {
      name: 'disabled',
      type: 'boolean' as const,
      defaultValue: false,
      description: 'Disables the button'
    },
    {
      name: 'showRipple',
      type: 'boolean' as const,
      defaultValue: true,
      description: 'Shows ripple effect on click'
    },
    {
      name: 'isActive',
      type: 'boolean' as const,
      defaultValue: false,
      description: 'Active state for tab-like behaviors'
    }
  ],
  examples: [
    { name: 'Primary Solid', config: { children: 'Save Changes', variant: 'solid', color: 'primary' } },
    { name: 'Success Outline', config: { children: 'Confirm', variant: 'outline', color: 'success' } },
    { name: 'Error Ghost', config: { children: 'Delete', variant: 'ghost', color: 'error' } },
    { name: 'Large Loading', config: { children: 'Processing...', size: 'lg', loading: true } },
    { name: 'Full Width', config: { children: 'Sign In', fullWidth: true, size: 'lg', color: 'primary' } },
    { name: 'Link Style', config: { children: 'Learn More', variant: 'link' } }
  ]
};

export const ButtonShowcase: React.FC = () => {
  return <ComponentConfigurator component={Button} api={buttonAPI} />;
};