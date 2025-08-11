import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'auto';

interface ThemeConfig {
  primary?: string;
  link?: string;
  info?: string;
  success?: string;
  warning?: string;
  danger?: string;
  dark?: string;
  light?: string;
  
  // Background colors
  background?: string;
  backgroundLight?: string;
  backgroundDark?: string;
  
  // Text colors
  text?: string;
  textLight?: string;
  textDark?: string;
  textInvert?: string;
  
  // Component specific
  navbarBackground?: string;
  navbarText?: string;
  cardBackground?: string;
  cardShadow?: string;
  boxBackground?: string;
  boxShadow?: string;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  currentTheme: 'light' | 'dark';
  customColors?: ThemeConfig;
  setCustomColors?: (colors: ThemeConfig) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const lightTheme: ThemeConfig = {
  primary: '#00d1b2',
  link: '#485fc7',
  info: '#3e8ed0',
  success: '#48c78e',
  warning: '#ffe08a',
  danger: '#f14668',
  dark: '#363636',
  light: '#f5f5f5',
  
  background: '#ffffff',
  backgroundLight: '#fafafa',
  backgroundDark: '#f5f5f5',
  
  text: '#4a4a4a',
  textLight: '#7a7a7a',
  textDark: '#363636',
  textInvert: '#ffffff',
  
  navbarBackground: '#ffffff',
  navbarText: '#4a4a4a',
  cardBackground: '#ffffff',
  cardShadow: '0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1)',
  boxBackground: '#ffffff',
  boxShadow: '0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1)',
};

const darkTheme: ThemeConfig = {
  primary: '#00d1b2',
  link: '#485fc7',
  info: '#3e8ed0',
  success: '#48c78e',
  warning: '#ffe08a',
  danger: '#f14668',
  dark: '#dbdbdb',
  light: '#363636',
  
  background: '#1a1a1a',
  backgroundLight: '#242424',
  backgroundDark: '#141414',
  
  text: '#dbdbdb',
  textLight: '#b5b5b5',
  textDark: '#f5f5f5',
  textInvert: '#1a1a1a',
  
  navbarBackground: '#242424',
  navbarText: '#dbdbdb',
  cardBackground: '#242424',
  cardShadow: '0 0.5em 1em -0.125em rgba(0, 0, 0, 0.3)',
  boxBackground: '#242424',
  boxShadow: '0 0.5em 1em -0.125em rgba(0, 0, 0, 0.3)',
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  customLightTheme?: ThemeConfig;
  customDarkTheme?: ThemeConfig;
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'light',
  customLightTheme,
  customDarkTheme,
  storageKey = 'qwanyx-theme'
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      return (stored as Theme) || defaultTheme;
    }
    return defaultTheme;
  });

  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  // Detect system preference
  useEffect(() => {
    if (theme === 'auto' && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setCurrentTheme(mediaQuery.matches ? 'dark' : 'light');

      const handleChange = (e: MediaQueryListEvent) => {
        setCurrentTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else if (theme !== 'auto') {
      setCurrentTheme(theme as 'light' | 'dark');
    }
  }, [theme]);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    const themeConfig = currentTheme === 'dark' 
      ? { ...darkTheme, ...customDarkTheme }
      : { ...lightTheme, ...customLightTheme };

    // Apply CSS variables
    Object.entries(themeConfig).forEach(([key, value]) => {
      const cssVar = `--bulma-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    });

    // Add theme class to body
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${currentTheme}`);

    // Update Bulma's built-in dark mode if available
    if (currentTheme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }, [currentTheme, customLightTheme, customDarkTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};