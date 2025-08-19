# QWANYX Style Grammar System

## 🎯 Purpose
A mini CSS-like grammar for component props to reduce verbosity and increase expressiveness.

## 📚 FOR AI REFERENCE - IMPORTANT
This document defines the style grammar system for QWANYX components. When working with QWANYX components, refer to this grammar for prop syntax.

## Grammar Syntax

### Color Grammar
```
color="base/alpha/modifier"

Examples:
- "primary"           → Primary color at 100% opacity
- "primary/50"        → Primary color at 50% opacity  
- "primary/50/frost-md" → Primary with 50% opacity and medium frost effect
- "error/20"          → Error color at 20% opacity
```

### Spacing Grammar (padding/margin)
```
spacing="size/direction-size"

Examples:
- "md"                → Medium all around
- "lg/x-sm"          → Large vertical, small horizontal
- "lg/top-xl/bottom-sm" → Large default, XL top, SM bottom
- "auto/x-lg"        → Auto horizontal, large vertical
```

### Border Grammar
```
border="width/color/style/sides"

Examples:
- "1"                 → 1px solid default color
- "1/primary"        → 1px solid primary color
- "2/error/dashed"   → 2px dashed error color
- "1/primary/solid/top-bottom" → 1px solid primary on top and bottom only
```

### Shadow Grammar
```
shadow="size/color/type"

Examples:
- "sm"               → Small shadow
- "lg/primary"       → Large shadow with primary tint
- "md/error/inset"   → Medium inset shadow with error tint
```

## Size Scale
- `xs` - Extra small
- `sm` - Small  
- `md` - Medium (usually default)
- `lg` - Large
- `xl` - Extra large
- `2xl` - 2X large
- `3xl` - 3X large

## Directions
- `x` - Horizontal (left and right)
- `y` - Vertical (top and bottom)  
- `top` - Top only
- `bottom` - Bottom only
- `left` - Left only
- `right` - Right only
- `start` - Logical start (LTR: left, RTL: right)
- `end` - Logical end (LTR: right, RTL: left)

## Colors
Base colors from theme:
- `primary` 
- `secondary`
- `success`
- `error` 
- `warning`
- `info`
- `surface`
- `background`
- `foreground`

## Implementation Example

```typescript
// In a component
import { parseStyleGrammar } from '@qwanyx/ui/utils';

export const Input = ({ 
  color,      // "primary/50"
  padding,    // "md/x-lg"
  border,     // "1/primary"
  ...props 
}) => {
  const colorStyles = parseStyleGrammar(color, 'color');
  const paddingStyles = parseStyleGrammar(padding, 'spacing');
  const borderStyles = parseStyleGrammar(border, 'border');
  
  const styles = {
    ...colorStyles,
    ...paddingStyles,
    ...borderStyles
  };
  
  return <input style={styles} {...props} />;
};
```

## Parser Implementation

```typescript
export function parseStyleGrammar(value: string, type: StyleType) {
  if (!value) return {};
  
  const parts = value.split('/');
  
  switch(type) {
    case 'color':
      return parseColor(parts);
    case 'spacing':
      return parseSpacing(parts);
    case 'border':
      return parseBorder(parts);
    case 'shadow':
      return parseShadow(parts);
    default:
      return {};
  }
}
```

## Migration Strategy

### Old API (deprecated but working)
```tsx
<Input 
  inputSize="md"
  error={true}
  borderWidth={2}
/>
```

### New API (recommended)
```tsx
<Input
  size="md"
  isInvalid={true}
  border="2/error"
/>
```

### Both work during transition
The component internally maps old props to new system for backward compatibility.

## Benefits
- **Concise**: `border="1/primary/dashed"` vs 3 separate props
- **Readable**: Looks like CSS shorthand
- **Extensible**: Easy to add new modifiers
- **Type-safe**: Can use TypeScript template literals for autocomplete
- **Consistent**: Same grammar across all components

## Testing Checklist for Input Component
- [ ] Basic border: `border="1"`
- [ ] Colored border: `border="1/primary"`
- [ ] Border on focus: `border="1/primary/focus-2"`
- [ ] Padding variations: `padding="md/x-lg"`
- [ ] Color with alpha: `color="primary/50"`
- [ ] Backward compatibility: Old props still work
- [ ] TypeScript types are correct
- [ ] No breaking changes in existing apps

## Notes for AI
- Always prefer the grammar syntax over multiple props
- Keep backward compatibility when updating components
- Document any new grammar patterns here
- Test with existing apps before finalizing changes