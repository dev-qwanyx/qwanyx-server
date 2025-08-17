# Atom Design Principles for QWANYX UI

## 🚨 CRITICAL RULE: No CSS Classes in Atoms

**All atom components MUST use inline styles exclusively.**

### Why Inline Styles for Atoms?

1. **Zero Dependencies** - Atoms work anywhere without CSS frameworks
2. **True Portability** - Can be copy-pasted into any project
3. **Predictable Behavior** - What you see is what you get
4. **Props-Driven** - All styling controlled through props
5. **No CSS Conflicts** - Immune to global CSS issues
6. **Framework Agnostic** - Works with any build system

### Required Props for All Atoms

Every atom MUST support these base props:

```typescript
interface BaseAtomProps {
  // Visual
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  variant?: string; // Component-specific variants
  
  // State
  disabled?: boolean;
  loading?: boolean; // Where applicable
  
  // Layout
  fullWidth?: boolean; // Where applicable
  className?: string; // For wrapper div only, not for styling
  style?: React.CSSProperties; // For overrides
  
  // Accessibility
  ariaLabel?: string;
  role?: string;
}
```

### Color System

All colors must be defined as RGB values in the component:

```typescript
const colors = {
  primary: 'rgb(59 130 246)',
  secondary: 'rgb(168 85 247)',
  accent: 'rgb(34 197 94)',
  success: 'rgb(34 197 94)',
  warning: 'rgb(250 204 21)',
  error: 'rgb(239 68 68)',
  info: 'rgb(59 130 246)',
  // Agile status colors
  backlog: 'rgb(148 163 184)',
  todo: 'rgb(59 130 246)',
  doing: 'rgb(234 88 12)',
  review: 'rgb(168 85 247)',
  done: 'rgb(34 197 94)',
  blocked: 'rgb(239 68 68)',
  validated: 'rgb(20 184 166)',
  archived: 'rgb(71 85 105)',
};
```

### Size System

Standard sizes with pixel values:

```typescript
const sizes = {
  xs: { /* specific measurements */ },
  sm: { /* specific measurements */ },
  md: { /* specific measurements */ },
  lg: { /* specific measurements */ },
  xl: { /* specific measurements */ },
};
```

### Example: Proper Atom Implementation

```typescript
// ✅ CORRECT - Using inline styles
export const Button: React.FC<ButtonProps> = ({
  size = 'md',
  color = 'primary',
  variant = 'solid',
  disabled = false,
  children,
  onClick,
  style,
  ...props
}) => {
  const sizes = {
    sm: { padding: '4px 12px', fontSize: '14px' },
    md: { padding: '8px 16px', fontSize: '16px' },
    lg: { padding: '12px 24px', fontSize: '18px' },
  };

  const colors = {
    primary: 'rgb(59 130 246)',
    secondary: 'rgb(168 85 247)',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...sizes[size],
        backgroundColor: variant === 'solid' ? colors[color] : 'transparent',
        color: variant === 'solid' ? 'white' : colors[color],
        border: variant === 'outline' ? `2px solid ${colors[color]}` : 'none',
        borderRadius: '6px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 200ms ease',
        ...style, // Allow overrides
      }}
      {...props}
    >
      {children}
    </button>
  );
};
```

```typescript
// ❌ WRONG - Using CSS classes
export const Button: React.FC<ButtonProps> = ({ size, color, className }) => {
  return (
    <button 
      className={`btn btn-${size} btn-${color} ${className}`}
    >
      {children}
    </button>
  );
};
```

### Atom Categories

1. **Display Atoms**
   - Icon, Badge, Avatar, Spinner, Progress

2. **Input Atoms**
   - Button, Input, Textarea, Switch, Checkbox, Radio

3. **Layout Atoms**
   - Divider, Spacer

4. **Feedback Atoms**
   - Tooltip, Popover

### Testing Atoms

Each atom MUST be tested for:
- All size variations
- All color variations  
- All state variations (disabled, loading, etc.)
- Responsive behavior
- Accessibility (ARIA attributes, keyboard navigation)

### Documentation Requirements

Each atom MUST have:
- TypeScript interface with all props documented
- Default values for all optional props
- Usage examples for common scenarios
- Accessibility guidelines
- Browser compatibility notes

## Summary

**The Golden Rule: Atoms are self-contained, style-independent components that work anywhere.**

No Tailwind. No CSS modules. No styled-components. No emotion. Just React, props, and inline styles.

This ensures our atoms are:
- Truly portable
- Framework agnostic
- Predictable
- Maintainable
- Testable