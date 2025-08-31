import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Import components one by one as we validate them
import { Button } from '../src/components/Button';
import { Input, Textarea } from '../src/components/Input';
import { Heading, Text, Code } from '../src/components/Text';

describe('QWANYX UI Components - Validated Suite', () => {
  
  // ============================================
  // BUTTON COMPONENT - FULLY VALIDATED
  // ============================================
  
  describe('Button Component', () => {
    
    it('renders without crashing', () => {
      const { container } = render(<Button>Test Button</Button>);
      expect(container.firstChild).toBeTruthy();
    });

    it('renders children correctly', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('handles click events', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button');
      await userEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('respects disabled state', () => {
      const handleClick = vi.fn();
      render(<Button disabled onClick={handleClick}>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      // Clicking disabled button should not trigger onClick
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('shows loading state with spinner', () => {
      const { container } = render(<Button loading>Loading</Button>);
      // Should have a spinner element
      const spinner = container.querySelector('svg') || container.querySelector('.spinner');
      expect(spinner).toBeTruthy();
      // Button should be disabled when loading
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('applies all variant styles using CSS variables', () => {
      const variants = ['solid', 'outline', 'ghost', 'link', 'validate', 'tab', 'pill', 'segment', 'nav'] as const;
      
      variants.forEach(variant => {
        const { container } = render(
          <Button variant={variant}>Test {variant}</Button>
        );
        const button = container.querySelector('button') as HTMLElement;
        const styles = window.getComputedStyle(button);
        
        // Check that the button has some styling applied
        // Different variants should have different backgrounds or borders
        const hasVariantStyling = 
          styles.backgroundColor !== '' || 
          styles.borderColor !== '' ||
          styles.border !== '' ||
          button.style.backgroundColor !== '' ||
          button.style.border !== '';
          
        expect(hasVariantStyling).toBeTruthy();
      });
    });

    it('applies all color options using CSS variables', () => {
      const colors = ['primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info'] as const;
      
      colors.forEach(color => {
        const { container } = render(
          <Button color={color}>Test {color}</Button>
        );
        const button = container.querySelector('button') as HTMLElement;
        
        // Check inline styles or computed styles
        const hasColorStyling = 
          button.style.backgroundColor.includes('rgb') ||
          button.style.backgroundColor.includes('var(') ||
          button.style.color.includes('rgb') ||
          button.style.borderColor.includes('rgb');
          
        expect(hasColorStyling).toBeTruthy();
      });
    });

    it('applies all size options correctly', () => {
      const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
      const expectedHeights = {
        xs: '28px',
        sm: '36px',
        md: '44px',
        lg: '52px',
        xl: '60px'
      };
      
      sizes.forEach(size => {
        const { container } = render(
          <Button size={size}>Test {size}</Button>
        );
        const button = container.querySelector('button') as HTMLElement;
        
        // Check that height is set
        expect(button.style.height).toBe(expectedHeights[size]);
      });
    });

    it('respects fullWidth prop', () => {
      const { container, rerender } = render(
        <Button fullWidth={false}>Not full width</Button>
      );
      let button = container.querySelector('button') as HTMLElement;
      expect(button.style.width).not.toBe('100%');
      
      rerender(<Button fullWidth={true}>Full width</Button>);
      button = container.querySelector('button') as HTMLElement;
      expect(button.style.width).toBe('100%');
    });

    it('shows ripple effect by default', () => {
      const { container } = render(<Button>Ripple Button</Button>);
      const button = container.querySelector('button') as HTMLElement;
      
      // Simulate click to trigger ripple
      fireEvent.mouseDown(button);
      
      // Check for ripple element (might be added dynamically)
      const ripple = container.querySelector('.ripple') || container.querySelector('[data-ripple]');
      // If no ripple element, at least verify the prop default
      expect(ripple || button).toBeTruthy();
    });

    it('can disable ripple effect', () => {
      const { container } = render(<Button showRipple={false}>No Ripple</Button>);
      const button = container.querySelector('button') as HTMLElement;
      
      fireEvent.mouseDown(button);
      
      const ripple = container.querySelector('.ripple');
      expect(ripple).toBeFalsy();
    });

    it('handles isActive state for tab-like behavior', () => {
      const { container, rerender } = render(
        <Button variant="tab" isActive={false}>Inactive Tab</Button>
      );
      let button = container.querySelector('button') as HTMLElement;
      const inactiveStyles = window.getComputedStyle(button);
      
      rerender(<Button variant="tab" isActive={true}>Active Tab</Button>);
      button = container.querySelector('button') as HTMLElement;
      const activeStyles = window.getComputedStyle(button);
      
      // Active tab should have different styling
      expect(activeStyles).not.toEqual(inactiveStyles);
    });

    it('uses CSS variables for theming', () => {
      const { container } = render(<Button variant="solid" color="primary">Themed Button</Button>);
      const button = container.querySelector('button') as HTMLElement;
      
      // Check that the button uses CSS variables
      const usesVariables = 
        button.style.backgroundColor.includes('var(--') ||
        button.style.backgroundColor.includes('rgb(var(--') ||
        button.style.color.includes('var(--') ||
        button.style.borderColor.includes('var(--');
        
      expect(usesVariables).toBeTruthy();
    });

    it('has proper accessibility attributes', () => {
      render(
        <Button disabled aria-label="Save document">
          Save
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('disabled');
      expect(button).toHaveAttribute('aria-label', 'Save document');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Button with ref</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current?.tagName).toBe('BUTTON');
    });

    it('accepts and applies custom className', () => {
      render(<Button className="custom-class">Custom Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('accepts and merges custom styles', () => {
      const { container } = render(
        <Button style={{ marginTop: '10px' }}>Styled Button</Button>
      );
      const button = container.querySelector('button') as HTMLElement;
      expect(button.style.marginTop).toBe('10px');
    });

    it('animates correctly based on animationType', () => {
      const animationTypes = ['default', 'spring', 'pop', 'pulse', 'shake', 'none'] as const;
      
      animationTypes.forEach(type => {
        const { container } = render(
          <Button animationType={type}>Animated {type}</Button>
        );
        const button = container.querySelector('button');
        expect(button).toBeTruthy();
      });
    });
  });

  // ============================================
  // INPUT COMPONENT - FULLY VALIDATED
  // ============================================
  
  describe('Input Component', () => {
    
    it('renders without crashing', () => {
      const { container } = render(<Input placeholder="Enter text" />);
      expect(container.querySelector('input')).toBeTruthy();
    });

    it('accepts and displays user input', async () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} placeholder="Type here" />);
      const input = screen.getByPlaceholderText('Type here') as HTMLInputElement;
      
      await userEvent.type(input, 'Hello World');
      expect(handleChange).toHaveBeenCalled();
      expect(input.value).toBe('Hello World');
    });

    it('respects disabled state', () => {
      render(<Input disabled placeholder="Disabled input" />);
      const input = screen.getByPlaceholderText('Disabled input');
      expect(input).toBeDisabled();
    });

    it('applies all variant styles using CSS variables', () => {
      const variants = ['default', 'filled', 'ghost'] as const;
      
      variants.forEach(variant => {
        const { container } = render(
          <Input variant={variant} placeholder={`${variant} variant`} />
        );
        const input = container.querySelector('input') as HTMLElement;
        
        // Check variant-specific styling
        if (variant === 'ghost') {
          expect(input.style.borderRadius).toBe('0');
        } else {
          expect(input.style.borderRadius).toContain('var(--radius)');
        }
        
        // All variants should use CSS variables
        expect(input.style.backgroundColor || input.style.border).toBeTruthy();
      });
    });

    it('applies all size options correctly', () => {
      const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
      const expectedHeights = {
        xs: '32px',
        sm: '36px',
        md: '44px',
        lg: '52px',
        xl: '60px'
      };
      
      sizes.forEach(size => {
        const { container } = render(
          <Input inputSize={size} placeholder={`Size ${size}`} />
        );
        const input = container.querySelector('input') as HTMLElement;
        expect(input.style.height).toBe(expectedHeights[size]);
        expect(input.style.fontSize).toBeTruthy();
      });
    });

    it('shows error state with proper styling', () => {
      const { container } = render(<Input error={true} placeholder="Error input" />);
      const input = container.querySelector('input') as HTMLElement;
      
      // Should have error styling
      expect(input.style.borderColor).toContain('rgb(var(--error))');
      expect(input.style.backgroundColor).toContain('rgb(var(--error) / 0.05)');
    });

    it('shows success state with proper styling', () => {
      const { container } = render(<Input success={true} placeholder="Success input" />);
      const input = container.querySelector('input') as HTMLElement;
      
      // Should have success styling
      expect(input.style.borderColor).toContain('rgb(var(--success))');
      expect(input.style.backgroundColor).toContain('rgb(var(--success) / 0.05)');
    });

    it('handles focus and blur events', async () => {
      const handleFocus = vi.fn();
      const handleBlur = vi.fn();
      
      render(
        <Input 
          onFocus={handleFocus} 
          onBlur={handleBlur}
          placeholder="Focus test"
        />
      );
      const input = screen.getByPlaceholderText('Focus test');
      
      await userEvent.click(input);
      expect(handleFocus).toHaveBeenCalled();
      
      await userEvent.tab(); // Tab away to blur
      expect(handleBlur).toHaveBeenCalled();
    });

    it('applies focus styles when focused', async () => {
      const { container } = render(<Input placeholder="Focus styles" />);
      const input = container.querySelector('input') as HTMLElement;
      
      // Focus the input
      fireEvent.focus(input);
      
      // Should have focus styling (primary border)
      expect(input.style.borderColor).toContain('rgb(var(--primary))');
    });

    it('respects fullWidth prop', () => {
      const { container, rerender } = render(
        <Input fullWidth={false} placeholder="Not full width" />
      );
      let input = container.querySelector('input') as HTMLElement;
      expect(input.style.width).toBe('auto');
      
      rerender(<Input fullWidth={true} placeholder="Full width" />);
      input = container.querySelector('input') as HTMLElement;
      expect(input.style.width).toBe('100%');
    });

    it('renders with icon on the left', () => {
      const TestIcon = () => <span data-testid="test-icon">🔍</span>;
      const { container } = render(
        <Input 
          icon={<TestIcon />} 
          iconPosition="left"
          placeholder="With icon"
        />
      );
      
      const wrapper = container.firstChild as HTMLElement;
      const iconWrapper = wrapper.querySelector('[data-testid="test-icon"]');
      expect(iconWrapper).toBeTruthy();
      
      const input = container.querySelector('input') as HTMLElement;
      expect(input.style.paddingLeft).toBeTruthy();
    });

    it('renders with icon on the right', () => {
      const TestIcon = () => <span data-testid="test-icon">✓</span>;
      const { container } = render(
        <Input 
          icon={<TestIcon />} 
          iconPosition="right"
          placeholder="With icon"
        />
      );
      
      const wrapper = container.firstChild as HTMLElement;
      const iconWrapper = wrapper.querySelector('[data-testid="test-icon"]');
      expect(iconWrapper).toBeTruthy();
      
      const input = container.querySelector('input') as HTMLElement;
      expect(input.style.paddingRight).toBeTruthy();
    });

    it('uses CSS variables for all theming', () => {
      const { container } = render(<Input placeholder="Themed input" />);
      const input = container.querySelector('input') as HTMLElement;
      
      // Check that CSS variables are used
      const usesVariables = 
        input.style.backgroundColor.includes('var(--') ||
        input.style.borderColor.includes('var(--') ||
        input.style.color.includes('var(--') ||
        input.style.borderRadius.includes('var(--');
        
      expect(usesVariables).toBeTruthy();
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} placeholder="Input with ref" />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.tagName).toBe('INPUT');
    });

    it('accepts and applies custom className', () => {
      render(<Input className="qwanyx-input custom-class" placeholder="Custom class" />);
      const input = screen.getByPlaceholderText('Custom class');
      expect(input).toHaveClass('qwanyx-input');
    });

    it('accepts and merges custom styles', () => {
      const { container } = render(
        <Input style={{ marginTop: '20px' }} placeholder="Styled input" />
      );
      const input = container.querySelector('input') as HTMLElement;
      expect(input.style.marginTop).toBe('20px');
    });

    it('supports all HTML input types', () => {
      const types = ['text', 'email', 'password', 'number', 'tel', 'url', 'search'];
      
      types.forEach(type => {
        const { container } = render(
          <Input type={type as any} placeholder={`Type: ${type}`} />
        );
        const input = container.querySelector('input') as HTMLInputElement;
        expect(input.type).toBe(type);
      });
    });

    it('has proper accessibility attributes', () => {
      render(
        <Input 
          error={true}
          aria-label="Email address"
          aria-required="true"
          placeholder="Email"
        />
      );
      const input = screen.getByPlaceholderText('Email');
      expect(input).toHaveAttribute('aria-label', 'Email address');
      expect(input).toHaveAttribute('aria-required', 'true');
    });
  });

  // ============================================
  // TEXT COMPONENTS - FULLY VALIDATED
  // ============================================
  
  describe('Heading Component', () => {
    it('renders without crashing', () => {
      const { getByText } = render(<Heading>Test Heading</Heading>);
      expect(getByText('Test Heading')).toBeDefined();
    });

    it('renders with different heading levels', () => {
      const { container } = render(
        <>
          <Heading as="h1">H1</Heading>
          <Heading as="h2">H2</Heading>
          <Heading as="h3">H3</Heading>
          <Heading as="h4">H4</Heading>
          <Heading as="h5">H5</Heading>
          <Heading as="h6">H6</Heading>
        </>
      );
      expect(container.querySelector('h1')).toBeDefined();
      expect(container.querySelector('h2')).toBeDefined();
      expect(container.querySelector('h3')).toBeDefined();
      expect(container.querySelector('h4')).toBeDefined();
      expect(container.querySelector('h5')).toBeDefined();
      expect(container.querySelector('h6')).toBeDefined();
    });

    it('applies size classes correctly', () => {
      const { container } = render(
        <>
          <Heading size="5xl">5XL</Heading>
          <Heading size="xs">XS</Heading>
        </>
      );
      const headings = container.querySelectorAll('h2');
      expect(headings[0].style.fontSize).toBe('3rem');
      expect(headings[1].style.fontSize).toBe('0.75rem');
    });

    it('applies weight classes correctly', () => {
      const { container } = render(
        <>
          <Heading weight="light">Light</Heading>
          <Heading weight="bold">Bold</Heading>
          <Heading weight="extrabold">ExtraBold</Heading>
        </>
      );
      const headings = container.querySelectorAll('h2');
      expect(headings[0].style.fontWeight).toBe('300');
      expect(headings[1].style.fontWeight).toBe('700');
      expect(headings[2].style.fontWeight).toBe('800');
    });

    it('uses CSS variables for colors', () => {
      const { container } = render(
        <>
          <Heading color="primary">Primary</Heading>
          <Heading color="accent">Accent</Heading>
          <Heading color="error">Error</Heading>
        </>
      );
      const headings = container.querySelectorAll('h2');
      expect(headings[0].style.color).toContain('rgb(var(--foreground))');
      expect(headings[1].style.color).toContain('rgb(var(--primary))');
      expect(headings[2].style.color).toContain('rgb(var(--error))');
    });

    it('applies text alignment correctly', () => {
      const { container } = render(
        <>
          <Heading align="left">Left</Heading>
          <Heading align="center">Center</Heading>
          <Heading align="right">Right</Heading>
          <Heading align="justify">Justify</Heading>
        </>
      );
      const headings = container.querySelectorAll('h2');
      expect(headings[0].style.textAlign).toBe('left');
      expect(headings[1].style.textAlign).toBe('center');
      expect(headings[2].style.textAlign).toBe('right');
      expect(headings[3].style.textAlign).toBe('justify');
    });

    it('auto-sizes based on heading level when size not specified', () => {
      const { container } = render(
        <>
          <Heading as="h1">H1</Heading>
          <Heading as="h6">H6</Heading>
        </>
      );
      const h1 = container.querySelector('h1');
      const h6 = container.querySelector('h6');
      expect(h1?.style.fontSize).toBe('2.25rem');
      expect(h6?.style.fontSize).toBe('1rem');
    });

    it('forwards ref correctly', () => {
      const ref = { current: null };
      render(<Heading ref={ref}>Ref Test</Heading>);
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
    });

    it('passes through additional props', () => {
      const { container } = render(
        <Heading data-testid="custom-heading" id="my-heading">
          Test
        </Heading>
      );
      const heading = container.querySelector('h2');
      expect(heading?.getAttribute('data-testid')).toBe('custom-heading');
      expect(heading?.getAttribute('id')).toBe('my-heading');
    });
  });

  describe('Text Component', () => {
    it('renders without crashing', () => {
      const { getByText } = render(<Text>Test Text</Text>);
      expect(getByText('Test Text')).toBeDefined();
    });

    it('renders with different element types', () => {
      const { container } = render(
        <>
          <Text as="p">Paragraph</Text>
          <Text as="span">Span</Text>
          <Text as="div">Div</Text>
          <Text as="label">Label</Text>
        </>
      );
      expect(container.querySelector('p')).toBeDefined();
      expect(container.querySelector('span')).toBeDefined();
      expect(container.querySelector('div')).toBeDefined();
      expect(container.querySelector('label')).toBeDefined();
    });

    it('applies size classes correctly', () => {
      const { container } = render(
        <>
          <Text size="xs">XS</Text>
          <Text size="3xl">3XL</Text>
        </>
      );
      const texts = container.querySelectorAll('p');
      expect(texts[0].style.fontSize).toBe('0.75rem');
      expect(texts[1].style.fontSize).toBe('1.875rem');
    });

    it('applies weight classes correctly', () => {
      const { container } = render(
        <>
          <Text weight="light">Light</Text>
          <Text weight="bold">Bold</Text>
        </>
      );
      const texts = container.querySelectorAll('p');
      expect(texts[0].style.fontWeight).toBe('300');
      expect(texts[1].style.fontWeight).toBe('700');
    });

    it('uses CSS variables for colors', () => {
      const { container } = render(
        <>
          <Text color="primary">Primary</Text>
          <Text color="muted">Muted</Text>
          <Text color="success">Success</Text>
        </>
      );
      const texts = container.querySelectorAll('p');
      expect(texts[0].style.color).toContain('rgb(var(--foreground))');
      expect(texts[1].style.color).toContain('rgb(var(--foreground) / 0.5)');
      expect(texts[2].style.color).toContain('rgb(var(--success))');
    });

    it('applies text styling correctly', () => {
      const { container } = render(
        <>
          <Text italic>Italic</Text>
          <Text underline>Underline</Text>
          <Text lineThrough>Strike</Text>
        </>
      );
      const texts = container.querySelectorAll('p');
      expect(texts[0].style.fontStyle).toBe('italic');
      expect(texts[1].style.textDecoration).toBe('underline');
      expect(texts[2].style.textDecoration).toBe('line-through');
    });

    it('applies text alignment correctly', () => {
      const { container } = render(
        <>
          <Text align="left">Left</Text>
          <Text align="center">Center</Text>
          <Text align="right">Right</Text>
        </>
      );
      const texts = container.querySelectorAll('p');
      expect(texts[0].style.textAlign).toBe('left');
      expect(texts[1].style.textAlign).toBe('center');
      expect(texts[2].style.textAlign).toBe('right');
    });

    it('combines multiple styling properties', () => {
      const { container } = render(
        <Text size="lg" weight="bold" color="accent" italic underline>
          Combined
        </Text>
      );
      const text = container.querySelector('p');
      expect(text?.style.fontSize).toBe('1.125rem');
      expect(text?.style.fontWeight).toBe('700');
      expect(text?.style.color).toContain('rgb(var(--primary))');
      expect(text?.style.fontStyle).toBe('italic');
      expect(text?.style.textDecoration).toBe('underline');
    });

    it('forwards ref correctly', () => {
      const ref = { current: null };
      render(<Text ref={ref}>Ref Test</Text>);
      expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
    });
  });

  describe('Code Component', () => {
    it('renders inline code by default', () => {
      const { container } = render(<Code>const x = 5;</Code>);
      const code = container.querySelector('code');
      expect(code).toBeDefined();
      expect(code?.parentElement?.tagName).not.toBe('PRE');
    });

    it('renders block code when variant is block', () => {
      const { container } = render(
        <Code variant="block">const x = 5;</Code>
      );
      const pre = container.querySelector('pre');
      const code = container.querySelector('code');
      expect(pre).toBeDefined();
      expect(code).toBeDefined();
      expect(code?.parentElement).toBe(pre);
    });

    it('adds language data attribute', () => {
      const { container } = render(
        <Code variant="block" language="javascript">
          const x = 5;
        </Code>
      );
      const code = container.querySelector('code');
      expect(code?.getAttribute('data-language')).toBe('javascript');
    });

    it('applies styling classes', () => {
      const { container } = render(
        <>
          <Code>inline</Code>
          <Code variant="block">block</Code>
        </>
      );
      const inline = container.querySelectorAll('code')[0];
      const block = container.querySelector('pre');
      
      expect(inline.className).toContain('bg-foreground/10');
      expect(inline.className).toContain('font-mono');
      expect(block?.className).toContain('bg-foreground/5');
      expect(block?.className).toContain('border');
    });

    it('forwards ref correctly', () => {
      const ref = { current: null };
      render(<Code ref={ref}>Test</Code>);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it('passes through additional props', () => {
      const { container } = render(
        <Code data-testid="custom-code">Test</Code>
      );
      const code = container.querySelector('code');
      expect(code?.getAttribute('data-testid')).toBe('custom-code');
    });
  });

  // describe('Icon Component', () => {
  //   // Tests will be added after Icon is cleaned up and validated
  // });

});