import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    foreground: string;
    card: string;
    'card-foreground': string;
    border: string;
    input: string;
    ring: string;
    'text-primary': string;
    'text-secondary': string;
    'text-muted': string;
  };
  fonts?: {
    sans?: string;
    heading?: string;
    mono?: string;
  };
  spacing?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  };
  radius?: {
    sm?: string;
    DEFAULT?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
  shadows?: {
    sm?: string;
    DEFAULT?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  };
  transitions?: {
    fast?: string;
    base?: string;
    slow?: string;
  };
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: Theme[];
  addTheme: (theme: Theme) => void;
  removeTheme: (name: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Convert hex to RGB values (returns space-separated RGB)
const hexToRgb = (hex: string): string => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0 0 0';
  return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`;
};

// Apply theme to CSS variables
const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  
  // Apply colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    // Convert hex to RGB for CSS variable support
    const rgbValue = value.startsWith('#') ? hexToRgb(value) : value;
    
    // Set the qwanyx CSS variables
    if (key.startsWith('text-')) {
      root.style.setProperty(`--qwanyx-${key}`, rgbValue);
    } else if (key === 'card-foreground') {
      root.style.setProperty(`--qwanyx-card-foreground`, rgbValue);
    } else {
      root.style.setProperty(`--qwanyx-${key}`, rgbValue);
    }
  });
  
  // Apply fonts
  if (theme.fonts) {
    Object.entries(theme.fonts).forEach(([key, value]) => {
      root.style.setProperty(`--qwanyx-font-${key}`, value);
    });
  }
  
  // Apply spacing
  if (theme.spacing) {
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--qwanyx-spacing-${key}`, value);
    });
  }
  
  // Apply radius
  if (theme.radius) {
    Object.entries(theme.radius).forEach(([key, value]) => {
      const varName = key === 'DEFAULT' ? '--qwanyx-radius' : `--qwanyx-radius-${key}`;
      root.style.setProperty(varName, value);
    });
  }
  
  // Apply shadows
  if (theme.shadows) {
    Object.entries(theme.shadows).forEach(([key, value]) => {
      const varName = key === 'DEFAULT' ? '--qwanyx-shadow' : `--qwanyx-shadow-${key}`;
      root.style.setProperty(varName, value);
    });
  }
  
  // Apply transitions
  if (theme.transitions) {
    Object.entries(theme.transitions).forEach(([key, value]) => {
      root.style.setProperty(`--qwanyx-transition-${key}`, value);
    });
  }
};

// Default themes
const defaultThemes: Theme[] = [
  {
    name: 'QWANYX Light',
    colors: {
      primary: '#3B82F6',
      secondary: '#A855F7',
      accent: '#22C55E',
      success: '#22C55E',
      warning: '#FACC15',
      error: '#EF4444',
      info: '#3B82F6',
      background: '#F9FAFB',
      foreground: '#0F172A',
      card: '#FFFFFF',
      'card-foreground': '#0F172A',
      border: '#E2E8F0',
      input: '#FFFFFF',
      ring: '#3B82F6',
      'text-primary': '#0F172A',
      'text-secondary': '#475569',
      'text-muted': '#94A3B8'
    }
  },
  {
    name: 'QWANYX Dark',
    colors: {
      primary: '#60A5FA',
      secondary: '#C084FC',
      accent: '#4ADE80',
      success: '#4ADE80',
      warning: '#FDE047',
      error: '#F87171',
      info: '#60A5FA',
      background: '#0F172A',
      foreground: '#F8FAFC',
      card: '#1E293B',
      'card-foreground': '#F8FAFC',
      border: '#334155',
      input: '#1E293B',
      ring: '#60A5FA',
      'text-primary': '#F8FAFC',
      'text-secondary': '#CBD5E1',
      'text-muted': '#64748B'
    }
  },
  {
    name: 'Ocean Blue',
    colors: {
      primary: '#0EA5E9',
      secondary: '#06B6D4',
      accent: '#14B8A6',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#0EA5E9',
      background: '#F0F9FF',
      foreground: '#0C4A6E',
      card: '#FFFFFF',
      'card-foreground': '#0C4A6E',
      border: '#BAE6FD',
      input: '#E0F2FE',
      ring: '#0EA5E9',
      'text-primary': '#0C4A6E',
      'text-secondary': '#0369A1',
      'text-muted': '#7DD3FC'
    }
  },
  {
    name: 'Forest Green',
    colors: {
      primary: '#16A34A',
      secondary: '#15803D',
      accent: '#84CC16',
      success: '#22C55E',
      warning: '#EAB308',
      error: '#DC2626',
      info: '#0891B2',
      background: '#F0FDF4',
      foreground: '#14532D',
      card: '#FFFFFF',
      'card-foreground': '#14532D',
      border: '#BBF7D0',
      input: '#DCFCE7',
      ring: '#16A34A',
      'text-primary': '#14532D',
      'text-secondary': '#166534',
      'text-muted': '#86EFAC'
    }
  }
];

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  persistTheme?: boolean; // Allow disabling localStorage persistence
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = defaultThemes[0],
  persistTheme = true // By default, persist theme to localStorage
}) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [themes, setThemes] = useState<Theme[]>(defaultThemes);
  
  // Apply theme on change
  useEffect(() => {
    applyTheme(theme);
    if (persistTheme) {
      localStorage.setItem('qwanyx-ui-current-theme', JSON.stringify(theme));
    }
  }, [theme, persistTheme]);
  
  // Load saved theme on mount
  useEffect(() => {
    if (persistTheme) {
      const savedTheme = localStorage.getItem('qwanyx-ui-current-theme');
      if (savedTheme) {
        try {
          const parsed = JSON.parse(savedTheme);
          setThemeState(parsed);
        } catch (e) {
          console.error('Failed to load saved theme:', e);
        }
      }
      
      const savedThemes = localStorage.getItem('qwanyx-ui-themes');
      if (savedThemes) {
        try {
          const parsed = JSON.parse(savedThemes);
          setThemes([...defaultThemes, ...parsed]);
        } catch (e) {
          console.error('Failed to load saved themes:', e);
        }
      }
    }
  }, []);
  
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };
  
  const addTheme = (newTheme: Theme) => {
    const updatedThemes = [...themes, newTheme];
    setThemes(updatedThemes);
    
    if (persistTheme) {
      // Save custom themes (excluding defaults)
      const customThemes = updatedThemes.filter(t => 
        !defaultThemes.some(dt => dt.name === t.name)
      );
      localStorage.setItem('qwanyx-ui-themes', JSON.stringify(customThemes));
    }
  };
  
  const removeTheme = (name: string) => {
    // Don't allow removing default themes
    if (defaultThemes.some(t => t.name === name)) return;
    
    const updatedThemes = themes.filter(t => t.name !== name);
    setThemes(updatedThemes);
    
    if (persistTheme) {
      // Save custom themes (excluding defaults)
      const customThemes = updatedThemes.filter(t => 
        !defaultThemes.some(dt => dt.name === t.name)
      );
      localStorage.setItem('qwanyx-ui-themes', JSON.stringify(customThemes));
    }
  };
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes, addTheme, removeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};