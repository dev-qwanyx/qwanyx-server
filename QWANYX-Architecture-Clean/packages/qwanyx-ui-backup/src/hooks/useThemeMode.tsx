import { useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface UseThemeModeReturn {
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
}

const STORAGE_KEY = 'qwanyx-theme-mode';

export function useThemeMode(): UseThemeModeReturn {
  // Get initial mode from localStorage or default to 'system'
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'system';
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
    return 'system';
  });

  // Resolved mode (what's actually displayed)
  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>('light');

  // Listen to system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateResolvedMode = () => {
      if (mode === 'system') {
        const isDark = mediaQuery.matches;
        setResolvedMode(isDark ? 'dark' : 'light');
      } else {
        setResolvedMode(mode as 'light' | 'dark');
      }
    };

    // Initial update
    updateResolvedMode();

    // Listen for changes
    const listener = () => updateResolvedMode();
    mediaQuery.addEventListener('change', listener);

    return () => mediaQuery.removeEventListener('change', listener);
  }, [mode]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(resolvedMode);
    
    // Also set data attribute for CSS targeting
    root.setAttribute('data-theme', resolvedMode);
  }, [resolvedMode]);

  // Set mode and persist to localStorage
  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('themechange', { 
      detail: { mode: newMode } 
    }));
  }, []);

  return {
    mode,
    resolvedMode,
    setMode
  };
}

// Helper to get current theme without hook (for SSR)
export function getStoredThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system';
}

// Helper to get resolved theme without hook
export function getResolvedTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  
  const mode = getStoredThemeMode();
  
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  return mode as 'light' | 'dark';
}