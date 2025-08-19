/**
 * QWANYX Style Grammar Parser
 * 
 * 🎯 PURPOSE:
 * Parse CSS-like grammar strings into style objects
 * 
 * 🤖 FOR AI:
 * This is the core parser for the QWANYX style grammar system.
 * Use this to convert prop strings like "primary/50/frost-md" into CSS styles.
 * 
 * 👨‍💻 FOR DEVS:
 * Import and use parseStyleGrammar() in components to support the grammar.
 */

export type StyleType = 'color' | 'spacing' | 'border' | 'shadow';

// Size mappings
const sizeMap = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '0.75rem',  // 12px
  lg: '1rem',     // 16px
  xl: '1.5rem',   // 24px
  '2xl': '2rem',  // 32px
  '3xl': '3rem',  // 48px
};

// Frost effect levels (backdrop blur)
const frostLevels = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
};

/**
 * Main parser function
 * @param value - The grammar string to parse (e.g., "primary/50/frost-md")
 * @param type - The type of style being parsed
 * @returns CSS style object
 */
export function parseStyleGrammar(
  value: string | undefined,
  type: StyleType
): React.CSSProperties {
  if (!value) return {};
  
  const parts = value.split('/');
  
  switch (type) {
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

/**
 * Parse color grammar
 * Examples:
 * - "primary" → primary color
 * - "primary/50" → primary at 50% opacity
 * - "primary/50/frost-md" → primary at 50% with medium frost
 */
function parseColor(parts: string[]): React.CSSProperties {
  const [base, ...modifiers] = parts;
  
  let styles: React.CSSProperties = {};
  
  // Base color
  const isThemeColor = ['primary', 'secondary', 'success', 'error', 'warning', 'info', 'surface', 'background', 'foreground'].includes(base);
  const colorValue = isThemeColor ? `rgb(var(--${base}))` : base;
  
  // Find alpha modifier (number)
  const alpha = modifiers.find(m => !isNaN(Number(m)));
  
  // Find frost modifier
  const frostMatch = modifiers.find(m => m.startsWith('frost-'));
  const frostLevel = frostMatch?.split('-')[1] as keyof typeof frostLevels;
  
  // Apply color with alpha
  if (alpha) {
    styles.backgroundColor = isThemeColor 
      ? `rgb(var(--${base}) / ${Number(alpha) / 100})`
      : `${colorValue}${Math.round(Number(alpha) * 2.55).toString(16).padStart(2, '0')}`;
  } else {
    styles.backgroundColor = colorValue;
  }
  
  // Apply frost effect
  if (frostLevel && frostLevels[frostLevel]) {
    styles.backdropFilter = `blur(${frostLevels[frostLevel]})`;
    styles.WebkitBackdropFilter = `blur(${frostLevels[frostLevel]})`;
  }
  
  return styles;
}

/**
 * Parse spacing grammar (padding/margin)
 * Examples:
 * - "md" → medium all around
 * - "lg/x-sm" → large vertical, small horizontal
 * - "lg/top-xl/bottom-sm" → large default, xl top, sm bottom
 */
function parseSpacing(parts: string[]): React.CSSProperties {
  const [base, ...modifiers] = parts;
  
  let styles: React.CSSProperties = {};
  
  // Base spacing (all sides)
  const baseSize = sizeMap[base as keyof typeof sizeMap] || base;
  styles.padding = baseSize;
  
  // Parse modifiers
  modifiers.forEach(mod => {
    if (mod.includes('-')) {
      const [direction, size] = mod.split('-');
      const sizeValue = sizeMap[size as keyof typeof sizeMap] || size;
      
      switch (direction) {
        case 'x':
          styles.paddingLeft = sizeValue;
          styles.paddingRight = sizeValue;
          break;
        case 'y':
          styles.paddingTop = sizeValue;
          styles.paddingBottom = sizeValue;
          break;
        case 'top':
          styles.paddingTop = sizeValue;
          break;
        case 'bottom':
          styles.paddingBottom = sizeValue;
          break;
        case 'left':
          styles.paddingLeft = sizeValue;
          break;
        case 'right':
          styles.paddingRight = sizeValue;
          break;
      }
    }
  });
  
  return styles;
}

/**
 * Parse border grammar
 * Examples:
 * - "1" → 1px solid default
 * - "1/primary" → 1px solid primary
 * - "2/error/dashed" → 2px dashed error
 */
function parseBorder(parts: string[]): React.CSSProperties {
  const [width, color, style, sides] = parts;
  
  let styles: React.CSSProperties = {};
  
  // Parse width
  const borderWidth = width ? `${width}px` : '1px';
  
  // Parse color
  let borderColor = 'rgb(var(--border))';
  if (color) {
    const isThemeColor = ['primary', 'secondary', 'success', 'error', 'warning', 'info'].includes(color);
    borderColor = isThemeColor ? `rgb(var(--${color}))` : color;
  }
  
  // Parse style
  const borderStyle = style || 'solid';
  
  // Apply to sides
  if (sides) {
    if (sides === 'top-bottom') {
      styles.borderTop = `${borderWidth} ${borderStyle} ${borderColor}`;
      styles.borderBottom = `${borderWidth} ${borderStyle} ${borderColor}`;
    } else if (sides === 'left-right') {
      styles.borderLeft = `${borderWidth} ${borderStyle} ${borderColor}`;
      styles.borderRight = `${borderWidth} ${borderStyle} ${borderColor}`;
    } else {
      // Single side
      const sideKey = `border${sides.charAt(0).toUpperCase() + sides.slice(1)}` as keyof React.CSSProperties;
      styles[sideKey] = `${borderWidth} ${borderStyle} ${borderColor}`;
    }
  } else {
    // All sides
    styles.border = `${borderWidth} ${borderStyle} ${borderColor}`;
  }
  
  return styles;
}

/**
 * Parse shadow grammar
 * Examples:
 * - "sm" → small shadow
 * - "lg/primary" → large shadow with primary tint
 * - "md/error/inset" → medium inset shadow with error tint
 */
function parseShadow(parts: string[]): React.CSSProperties {
  const [size, color, type] = parts;
  
  let styles: React.CSSProperties = {};
  
  // Shadow sizes
  const shadows = {
    xs: '0 1px 2px 0',
    sm: '0 1px 3px 0',
    md: '0 4px 6px -1px',
    lg: '0 10px 15px -3px',
    xl: '0 20px 25px -5px',
    '2xl': '0 25px 50px -12px',
  };
  
  const shadowBase = shadows[size as keyof typeof shadows] || shadows.md;
  
  // Color
  let shadowColor = 'rgba(0, 0, 0, 0.1)';
  if (color) {
    const isThemeColor = ['primary', 'secondary', 'success', 'error', 'warning', 'info'].includes(color);
    shadowColor = isThemeColor ? `rgb(var(--${color}) / 0.2)` : color;
  }
  
  // Type (inset or normal)
  const inset = type === 'inset' ? 'inset ' : '';
  
  styles.boxShadow = `${inset}${shadowBase} ${shadowColor}`;
  
  return styles;
}

/**
 * Helper to combine multiple grammar styles
 * @param styles - Object with grammar strings for different style types
 * @returns Combined CSS style object
 */
export function combineGrammarStyles(styles: {
  color?: string;
  padding?: string;
  margin?: string;
  border?: string;
  shadow?: string;
}): React.CSSProperties {
  return {
    ...parseStyleGrammar(styles.color, 'color'),
    ...parseStyleGrammar(styles.padding, 'spacing'),
    ...parseStyleGrammar(styles.margin, 'spacing'),
    ...parseStyleGrammar(styles.border, 'border'),
    ...parseStyleGrammar(styles.shadow, 'shadow'),
  };
}