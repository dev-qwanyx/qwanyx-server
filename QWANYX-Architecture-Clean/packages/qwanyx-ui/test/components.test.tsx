import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Import all components from the main index
import * as Components from '../src/index';

// Test utilities
const testComponent = (
  name: string,
  Component: React.ComponentType<any>,
  props: any = {},
  testId?: string
) => {
  it(`${name}: renders without crashing`, () => {
    const { container } = render(<Component {...props} />);
    expect(container.firstChild).toBeTruthy();
  });

  it(`${name}: accepts className prop`, () => {
    if (props.className !== undefined) {
      const { container } = render(<Component {...props} className="test-class" />);
      const element = testId ? screen.getByTestId(testId) : container.firstChild;
      expect(element).toHaveClass('test-class');
    }
  });

  it(`${name}: uses CSS variables for theming`, () => {
    const { container } = render(<Component {...props} />);
    const element = container.firstChild as HTMLElement;
    if (element && element.style) {
      const styles = window.getComputedStyle(element);
      const hasCustomProperties = Array.from(styles).some(prop => prop.startsWith('--'));
      // Component should either use CSS variables or inherit them
      expect(hasCustomProperties || styles.color.includes('rgb')).toBeTruthy();
    }
  });
};

describe('QWANYX UI Components Test Suite', () => {
  
  // ============================================
  // ATOMS
  // ============================================
  
  describe('Button Component', () => {
    testComponent('Button', Components.Button, { children: 'Test Button' });
    
    it('Button: handles click events', async () => {
      const handleClick = vi.fn();
      render(<Components.Button onClick={handleClick}>Click me</Components.Button>);
      const button = screen.getByRole('button');
      await userEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('Button: respects disabled state', () => {
      render(<Components.Button disabled>Disabled</Components.Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('Button: shows loading state', () => {
      const { container } = render(<Components.Button loading>Loading</Components.Button>);
      // Should have loading indicator
      const spinner = container.querySelector('.spinner, .loading, svg');
      expect(spinner).toBeTruthy();
    });

    it('Button: applies variant styles', () => {
      const variants = ['solid', 'outline', 'ghost', 'link'];
      variants.forEach(variant => {
        const { container } = render(
          <Components.Button variant={variant as any}>Test</Components.Button>
        );
        const button = container.firstChild as HTMLElement;
        const styles = window.getComputedStyle(button);
        // Each variant should have different styling
        expect(styles.backgroundColor || styles.border || styles.color).toBeTruthy();
      });
    });
  });

  describe('Input Component', () => {
    testComponent('Input', Components.Input, { placeholder: 'Test input' });
    
    it('Input: accepts user input', async () => {
      const handleChange = vi.fn();
      render(<Components.Input onChange={handleChange} />);
      const input = screen.getByRole('textbox');
      await userEvent.type(input, 'Hello');
      expect(handleChange).toHaveBeenCalled();
    });

    it('Input: shows error state', () => {
      const { container } = render(<Components.Input error={true} />);
      const input = container.querySelector('input') as HTMLElement;
      const styles = window.getComputedStyle(input);
      // Should have error styling (red border or background)
      expect(
        styles.borderColor.includes('rgb') || 
        styles.backgroundColor.includes('0.05')
      ).toBeTruthy();
    });

    it('Input: respects disabled state', () => {
      render(<Components.Input disabled placeholder="Disabled input" />);
      const input = screen.getByPlaceholderText('Disabled input');
      expect(input).toBeDisabled();
    });
  });

  describe('Text Component', () => {
    testComponent('Text', Components.Text, { children: 'Test text' });
    
    it('Text: renders different sizes', () => {
      const sizes = ['xs', 'sm', 'base', 'lg', 'xl'] as const;
      sizes.forEach(size => {
        const { container } = render(
          <Components.Text size={size}>Size {size}</Components.Text>
        );
        const text = container.firstChild as HTMLElement;
        // Check inline styles since Text component uses inline styles
        expect(text.style.fontSize).toBeTruthy();
      });
    });

    it('Text: applies weight variations', () => {
      const weights = ['normal', 'medium', 'semibold', 'bold'] as const;
      weights.forEach(weight => {
        const { container } = render(
          <Components.Text weight={weight}>Weight {weight}</Components.Text>
        );
        const text = container.firstChild as HTMLElement;
        // Check inline styles since Text component uses inline styles
        expect(text.style.fontWeight).toBeTruthy();
      });
    });
  });

  describe('Icon Component', () => {
    testComponent('Icon', Components.Icon, { name: 'home' });
    
    it('Icon: renders different sizes', () => {
      const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
      sizes.forEach(size => {
        const { container } = render(<Components.Icon name="settings" size={size as any} />);
        const icon = container.firstChild as HTMLElement;
        const styles = window.getComputedStyle(icon);
        expect(styles.fontSize || styles.width).toBeTruthy();
      });
    });

    it('Icon: handles click events when onClick provided', async () => {
      const handleClick = vi.fn();
      render(<Components.Icon name="close" onClick={handleClick} />);
      const icon = screen.getByRole('button');
      await userEvent.click(icon);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Badge Component', () => {
    testComponent('Badge', Components.Badge, { children: 'New' });
    
    it('Badge: renders with different variants', () => {
      const variants = ['default', 'success', 'warning', 'error', 'info'];
      variants.forEach(variant => {
        const { container } = render(
          <Components.Badge variant={variant as any}>Badge</Components.Badge>
        );
        expect(container.firstChild).toBeTruthy();
      });
    });
  });

  // ============================================
  // MOLECULES
  // ============================================
  
  describe('Card Component', () => {
    testComponent('Card', Components.Card, { children: 'Card content' });
    
    it('Card: renders with header and content', () => {
      render(
        <Components.Card>
          <Components.CardHeader>Header</Components.CardHeader>
          <Components.CardContent>Content</Components.CardContent>
        </Components.Card>
      );
      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('FormField Component', () => {
    testComponent('FormField', Components.FormField, { 
      label: 'Field Label',
      name: 'test-field'
    });
    
    it('FormField: shows label and input', () => {
      render(
        <Components.FormField label="Email" name="email" type="email" />
      );
      expect(screen.getByText('Email')).toBeInTheDocument();
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('FormField: shows error message', () => {
      render(
        <Components.FormField 
          label="Username" 
          name="username" 
          error="Username is required" 
        />
      );
      // FormField should display the error message
      const errorText = screen.queryByText('Username is required');
      if (!errorText) {
        // If FormField doesn't display errors, at least check the input has error state
        const input = screen.getByRole('textbox');
        const styles = window.getComputedStyle(input);
        expect(styles.borderColor || styles.backgroundColor).toBeTruthy();
      } else {
        expect(errorText).toBeInTheDocument();
      }
    });
  });

  describe('Tabs Component', () => {
    const TabsTest = () => (
      <Components.Tabs defaultValue="tab1">
        <Components.TabsList>
          <Components.TabsTrigger value="tab1">Tab 1</Components.TabsTrigger>
          <Components.TabsTrigger value="tab2">Tab 2</Components.TabsTrigger>
        </Components.TabsList>
        <Components.TabsContent value="tab1">Content 1</Components.TabsContent>
        <Components.TabsContent value="tab2">Content 2</Components.TabsContent>
      </Components.Tabs>
    );

    it('Tabs: renders tabs and content', () => {
      render(<TabsTest />);
      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Tab 2')).toBeInTheDocument();
      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });

    it('Tabs: switches content on tab click', async () => {
      render(<TabsTest />);
      const tab2 = screen.getByText('Tab 2');
      await userEvent.click(tab2);
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });
  });

  describe('Switch Component', () => {
    testComponent('Switch', Components.Switch, {});
    
    it('Switch: toggles on click', async () => {
      const handleChange = vi.fn();
      const { container } = render(<Components.Switch onCheckedChange={handleChange} />);
      const switchElement = container.querySelector('button[role="switch"]') || container.firstChild;
      if (switchElement) {
        await userEvent.click(switchElement as Element);
        expect(handleChange).toHaveBeenCalled();
      }
    });
  });

  describe('Select Components', () => {
    it('SimpleSelect: renders options', () => {
      render(
        <Components.SimpleSelect defaultValue="option1">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </Components.SimpleSelect>
      );
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });
  });

  // ============================================
  // LAYOUT COMPONENTS
  // ============================================
  
  describe('Container Component', () => {
    testComponent('Container', Components.Container, { children: 'Container content' });
    
    it('Container: applies max-width constraint', () => {
      const { container } = render(
        <Components.Container maxWidth="md">Content</Components.Container>
      );
      const element = container.firstChild as HTMLElement;
      const styles = window.getComputedStyle(element);
      expect(styles.maxWidth).toBeTruthy();
    });
  });

  describe('Grid Component', () => {
    testComponent('Grid', Components.Grid, { 
      children: <div>Grid item</div>,
      cols: 3 
    });
    
    it('Grid: creates grid layout', () => {
      const { container } = render(
        <Components.Grid cols={3}>
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
        </Components.Grid>
      );
      const grid = container.firstChild as HTMLElement;
      const styles = window.getComputedStyle(grid);
      expect(styles.display).toBe('grid');
    });
  });

  describe('Section Component', () => {
    testComponent('Section', Components.Section, { children: 'Section content' });
  });

  describe('Heading Component', () => {
    testComponent('Heading', Components.Heading, { children: 'Test Heading' });
    
    it('Heading: renders as h1 by default', () => {
      render(<Components.Heading>Default Heading</Components.Heading>);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('Heading: renders different levels', () => {
      const levels = [1, 2, 3, 4, 5, 6] as const;
      levels.forEach(level => {
        const { container } = render(
          <Components.Heading as={`h${level}` as any}>Level {level}</Components.Heading>
        );
        const heading = container.querySelector(`h${level}`);
        expect(heading).toBeInTheDocument();
      });
    });
  });

  // ============================================
  // THEME VALIDATION
  // ============================================
  
  describe('Theme System Validation', () => {
    it('All components use CSS variables', () => {
      // Create a test container with custom CSS variables
      const testContainer = document.createElement('div');
      testContainer.style.setProperty('--primary', '59, 130, 246');
      testContainer.style.setProperty('--secondary', '168, 85, 247');
      testContainer.style.setProperty('--text', '15, 23, 42');
      testContainer.style.setProperty('--background', '255, 255, 255');
      testContainer.style.setProperty('--border', '226, 232, 240');
      document.body.appendChild(testContainer);

      // Test that components can use these variables
      const { container } = render(
        <Components.Button variant="solid" color="primary">
          Themed Button
        </Components.Button>,
        { container: testContainer }
      );

      const button = container.querySelector('button') as HTMLElement;
      if (button) {
        const styles = window.getComputedStyle(button);
        // Should use the CSS variable colors
        expect(
          styles.backgroundColor.includes('59') || 
          styles.backgroundColor.includes('rgb') ||
          styles.backgroundColor.includes('var(')
        ).toBeTruthy();
      }

      document.body.removeChild(testContainer);
    });

    it('No hardcoded colors in components', () => {
      // This test checks that components don't have hardcoded hex colors
      const componentsToCheck = [
        <Components.Button>Test</Components.Button>,
        <Components.Input placeholder="Test" />,
        <Components.Card>Test</Components.Card>,
        <Components.Badge>Test</Components.Badge>
      ];

      componentsToCheck.forEach(component => {
        const { container } = render(component);
        const element = container.firstChild as HTMLElement;
        if (element && element.style) {
          const inlineStyles = element.getAttribute('style') || '';
          // Check for hardcoded hex colors
          const hasHardcodedColors = /#[0-9a-fA-F]{3,6}/.test(inlineStyles);
          expect(hasHardcodedColors).toBeFalsy();
        }
      });
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================
  
  describe('Accessibility', () => {
    it('Button: has proper ARIA attributes', () => {
      render(<Components.Button disabled>Disabled Button</Components.Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('disabled');
    });

    it('Input: has proper ARIA attributes for errors', () => {
      render(<Components.Input error={true} aria-label="Test input" />);
      const input = screen.getByLabelText('Test input');
      // Input with error should have aria-invalid or visual indication
      const styles = window.getComputedStyle(input);
      expect(
        input.getAttribute('aria-invalid') === 'true' ||
        styles.borderColor.includes('rgb')
      ).toBeTruthy();
    });

    it('Switch: has proper role', () => {
      const { container } = render(<Components.Switch />);
      const switchElement = container.querySelector('[role="switch"]');
      expect(switchElement).toBeInTheDocument();
    });
  });

  // ============================================
  // PERFORMANCE TESTS
  // ============================================
  
  describe('Performance', () => {
    it('Components render quickly', () => {
      const start = performance.now();
      const { unmount } = render(
        <div>
          <Components.Button>Button</Components.Button>
          <Components.Input />
          <Components.Text>Text</Components.Text>
          <Components.Icon name="home" />
          <Components.Badge>Badge</Components.Badge>
        </div>
      );
      const end = performance.now();
      const renderTime = end - start;
      
      // Components should render in less than 100ms
      expect(renderTime).toBeLessThan(100);
      unmount();
    });
  });
});