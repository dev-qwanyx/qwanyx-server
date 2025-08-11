/**
 * Utility for combining class names conditionally
 * Similar to clsx/classnames but lightweight
 */

type ClassValue = string | number | boolean | undefined | null | ClassObject | ClassArray;
type ClassObject = Record<string, any>;
type ClassArray = ClassValue[];

export function cn(...args: ClassValue[]): string {
  const classes: string[] = [];

  for (const arg of args) {
    if (!arg) continue;

    const argType = typeof arg;

    if (argType === 'string' || argType === 'number') {
      classes.push(String(arg));
    } else if (Array.isArray(arg)) {
      const inner = cn(...arg);
      if (inner) {
        classes.push(inner);
      }
    } else if (argType === 'object') {
      for (const key in arg as ClassObject) {
        if ((arg as ClassObject)[key]) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
}

/**
 * Bulma-specific class builders
 */

export function bulmaClasses(base: string, modifiers?: Record<string, any>): string {
  const classes = [base];
  
  if (modifiers) {
    Object.entries(modifiers).forEach(([key, value]) => {
      if (value === true) {
        classes.push(`is-${key}`);
      } else if (value && typeof value === 'string') {
        classes.push(`is-${value}`);
      }
    });
  }
  
  return classes.join(' ');
}

/**
 * Size mapping for Bulma
 */
export const SIZES = {
  small: 'is-small',
  normal: '',
  medium: 'is-medium',
  large: 'is-large',
} as const;

/**
 * Color mapping for Bulma
 */
export const COLORS = {
  primary: 'is-primary',
  link: 'is-link',
  info: 'is-info',
  success: 'is-success',
  warning: 'is-warning',
  danger: 'is-danger',
  dark: 'is-dark',
  light: 'is-light',
  white: 'is-white',
  black: 'is-black',
  text: 'is-text',
  ghost: 'is-ghost',
} as const;

export type BulmaSize = keyof typeof SIZES;
export type BulmaColor = keyof typeof COLORS;