import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Title, 
  Button, 
  Field, 
  Control, 
  Input,
  Columns,
  Column,
  Section,
  Container,
  Tabs,
  Tab,
  Notification,
  Tag
} from '@qwanyx/bulma-components';

interface ThemeColors {
  // Bulma main colors - these actually work!
  primary: string;
  link: string;
  info: string;
  success: string;
  warning: string;
  danger: string;
  dark: string;
  light: string;
  white: string;
  black: string;
  
  // Bulma scheme colors
  'scheme-main': string;
  'scheme-main-bis': string;
  'scheme-main-ter': string;
  'scheme-invert': string;
  'scheme-invert-bis': string;
  'scheme-invert-ter': string;
  
  // Text colors
  text: string;
  'text-light': string;
  'text-dark': string;
  'text-strong': string;
  
  // Background/Border
  background: string;
  border: string;
}

const defaultLightTheme: ThemeColors = {
  primary: '#00d1b2',
  link: '#485fc7',
  info: '#3e8ed0',
  success: '#48c78e',
  warning: '#ffe08a',
  danger: '#f14668',
  dark: '#363636',
  light: '#f5f5f5',
  white: '#ffffff',
  black: '#0a0a0a',
  'scheme-main': '#ffffff',
  'scheme-main-bis': '#fafafa',
  'scheme-main-ter': '#f5f5f5',
  'scheme-invert': '#0a0a0a',
  'scheme-invert-bis': '#0e0e0e',
  'scheme-invert-ter': '#242424',
  text: '#4a4a4a',
  'text-light': '#7a7a7a',
  'text-dark': '#363636',
  'text-strong': '#363636',
  background: '#f5f5f5',
  border: '#dbdbdb',
};

const defaultDarkTheme: ThemeColors = {
  // Main colors - slightly adjusted for dark mode visibility
  primary: '#00f4d4',  // Brighter teal
  link: '#5e71e3',     // Brighter blue
  info: '#4fa3e0',     // Brighter info
  success: '#5ada9e',  // Brighter green
  warning: '#ffb86c',  // Adjusted yellow
  danger: '#ff5370',   // Brighter red
  
  // INVERTED: dark becomes light, light becomes dark
  dark: '#f5f5f5',     // Was dark gray, now light
  light: '#363636',    // Was light gray, now dark
  
  // INVERTED: white becomes dark, black becomes light
  white: '#181818',    // Was white, now dark background
  black: '#f5f5f5',    // Was black, now light text
  
  // INVERTED: All schemes flip
  'scheme-main': '#1a1a1a',        // Dark background (was white)
  'scheme-main-bis': '#242424',    // Darker (was light gray)
  'scheme-main-ter': '#2e2e2e',    // Even darker (was lighter gray)
  'scheme-invert': '#f5f5f5',      // Light (was dark)
  'scheme-invert-bis': '#ebebeb',  // Lighter (was darker)
  'scheme-invert-ter': '#e0e0e0',  // Even lighter (was darkest)
  
  // INVERTED: All text colors
  text: '#e4e4e4',         // Light text (was dark)
  'text-light': '#b5b5b5', // Medium light (was medium dark)
  'text-dark': '#f5f5f5',  // Very light (was very dark)
  'text-strong': '#ffffff', // Pure white (was dark)
  
  // INVERTED: Backgrounds and borders
  background: '#2a2a2a',   // Dark background (was light)
  border: '#404040',       // Dark border (was light)
};

interface ThemeEditorProps {
  onThemeChange?: (theme: ThemeColors) => void;
  initialTheme?: ThemeColors | null;
  currentThemeName?: string;
  currentThemeId?: string;
}

export const ThemeEditor: React.FC<ThemeEditorProps> = ({ onThemeChange, initialTheme, currentThemeName, currentThemeId }) => {
  // Version history for undo/redo
  const [history, setHistory] = useState<ThemeColors[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lastSaveTime, setLastSaveTime] = useState<number>(Date.now());
  const [activeTab, setActiveTab] = useState<'colors' | 'export'>('colors');
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('qwanyx-theme-mode');
    return saved === 'dark';
  });
  const [theme, setTheme] = useState<ThemeColors>(() => {
    if (initialTheme) return initialTheme;
    const saved = localStorage.getItem('qwanyx-current-theme');
    if (saved) return JSON.parse(saved);
    return isDark ? defaultDarkTheme : defaultLightTheme;
  });
  const [savedThemes, setSavedThemes] = useState<{[key: string]: ThemeColors}>({});
  const [useSystemTheme, setUseSystemTheme] = useState(false);

  // Convert hex to HSL
  // Generate dark version from light theme
  const generateDarkFromLight = () => {
    if (isDark) {
      alert('Switch to light mode first, then generate dark version');
      return;
    }
    
    const darkTheme: ThemeColors = { ...theme };
    
    // Helper to adjust hex color brightness
    const adjustBrightness = (hex: string, factor: number) => {
      const num = parseInt(hex.replace('#', ''), 16);
      const r = Math.min(255, Math.floor(((num >> 16) & 255) * factor));
      const g = Math.min(255, Math.floor(((num >> 8) & 255) * factor));
      const b = Math.min(255, Math.floor((num & 255) * factor));
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };
    
    // Main colors - make brighter for dark mode
    darkTheme.primary = adjustBrightness(theme.primary, 1.3);
    darkTheme.link = adjustBrightness(theme.link, 1.3);
    darkTheme.info = adjustBrightness(theme.info, 1.3);
    darkTheme.success = adjustBrightness(theme.success, 1.3);
    darkTheme.warning = adjustBrightness(theme.warning, 1.2);
    darkTheme.danger = adjustBrightness(theme.danger, 1.3);
    
    // Invert light/dark
    darkTheme.dark = theme.light;
    darkTheme.light = theme.dark;
    
    // Invert black/white
    darkTheme.white = '#1a1a1a'; // Dark background
    darkTheme.black = '#f5f5f5'; // Light text
    
    // Invert scheme colors
    darkTheme['scheme-main'] = '#1a1a1a';
    darkTheme['scheme-main-bis'] = '#242424';
    darkTheme['scheme-main-ter'] = '#2e2e2e';
    darkTheme['scheme-invert'] = '#f5f5f5';
    darkTheme['scheme-invert-bis'] = '#ebebeb';
    darkTheme['scheme-invert-ter'] = '#e0e0e0';
    
    // Invert text colors
    darkTheme.text = '#e4e4e4';
    darkTheme['text-light'] = '#b5b5b5';
    darkTheme['text-dark'] = '#f5f5f5';
    darkTheme['text-strong'] = '#ffffff';
    
    // Dark backgrounds and borders
    darkTheme.background = '#2a2a2a';
    darkTheme.border = '#404040';
    
    // Save the generated dark theme
    setDarkTheme(darkTheme);
    localStorage.setItem('qwanyx-dark-theme', JSON.stringify(darkTheme));
    
    // Switch to dark mode to see it
    setIsDark(true);
    setTheme(darkTheme);
    
    alert('Dark theme generated! You can now fine-tune the colors.');
  };

  const hexToHSL = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  // Apply theme to CSS variables
  const applyTheme = (colors: ThemeColors) => {
    const root = document.documentElement;
    
    // Clear all existing theme variables first
    const allVars = Array.from(document.documentElement.style).filter(prop => prop.startsWith('--bulma-'));
    allVars.forEach(prop => root.style.removeProperty(prop));
    
    // For main colors, set both hex and HSL values
    const mainColors = ['primary', 'link', 'info', 'success', 'warning', 'danger', 'dark', 'light'];
    
    mainColors.forEach(colorName => {
      const value = colors[colorName as keyof ThemeColors];
      if (value && value.startsWith('#')) {
        const hsl = hexToHSL(value);
        // Set HSL components for Bulma 1.0
        root.style.setProperty(`--bulma-${colorName}-h`, `${hsl.h}deg`);
        root.style.setProperty(`--bulma-${colorName}-s`, `${hsl.s}%`);
        root.style.setProperty(`--bulma-${colorName}-l`, `${hsl.l}%`);
        // Also set the base color
        root.style.setProperty(`--bulma-${colorName}`, value);
      }
    });
    
    // Set scheme colors with HSL values for proper Bulma 1.0 dark mode
    if (colors['scheme-main']) {
      const schemeHsl = hexToHSL(colors['scheme-main']);
      root.style.setProperty('--bulma-scheme-h', `${schemeHsl.h}deg`);
      root.style.setProperty('--bulma-scheme-s', `${schemeHsl.s}%`);
      root.style.setProperty('--bulma-scheme-main-l', `${schemeHsl.l}%`);
      root.style.setProperty('--bulma-scheme-main', colors['scheme-main']);
    }
    
    // Set background and text with HSL
    if (colors.background) {
      const bgHsl = hexToHSL(colors.background);
      root.style.setProperty('--bulma-background-l', `${bgHsl.l}%`);
      root.style.setProperty('--bulma-background', colors.background);
    }
    
    if (colors.text) {
      const textHsl = hexToHSL(colors.text);
      root.style.setProperty('--bulma-text-l', `${textHsl.l}%`);
      root.style.setProperty('--bulma-text', colors.text);
    }
    
    // Set text variations
    if (colors['text-strong']) {
      const strongHsl = hexToHSL(colors['text-strong']);
      root.style.setProperty('--bulma-text-strong-l', `${strongHsl.l}%`);
      root.style.setProperty('--bulma-text-strong', colors['text-strong']);
    }
    
    if (colors['text-light']) {
      const lightHsl = hexToHSL(colors['text-light']);
      root.style.setProperty('--bulma-text-weak-l', `${lightHsl.l}%`);
      root.style.setProperty('--bulma-text-light', colors['text-light']);
    }
    
    // Set border
    if (colors.border) {
      const borderHsl = hexToHSL(colors.border);
      root.style.setProperty('--bulma-border-l', `${borderHsl.l}%`);
      root.style.setProperty('--bulma-border', colors.border);
    }
    
    // Set all other colors as direct values
    Object.entries(colors).forEach(([key, value]) => {
      if (!mainColors.includes(key) && !['scheme-main', 'background', 'text', 'text-strong', 'text-light', 'border'].includes(key)) {
        root.style.setProperty(`--bulma-${key}`, value);
      }
    });

    // Set body background using scheme-main
    if (colors['scheme-main']) {
      document.body.style.backgroundColor = colors['scheme-main'];
      root.style.setProperty('--bulma-body-background-color', colors['scheme-main']);
    }
    
    // Set dark mode brightness indicator for Bulma
    if (isDark) {
      root.style.setProperty('--bulma-scheme-brightness', 'dark');
    } else {
      root.style.setProperty('--bulma-scheme-brightness', 'light');
    }
  };

  // Listen for system theme changes
  useEffect(() => {
    if (useSystemTheme) {
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        const systemIsDark = e.matches;
        setIsDark(systemIsDark);
        setTheme(systemIsDark ? defaultDarkTheme : defaultLightTheme);
      };

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const systemIsDark = mediaQuery.matches;
      setIsDark(systemIsDark);
      setTheme(systemIsDark ? defaultDarkTheme : defaultLightTheme);
      
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }
  }, [useSystemTheme]);

  useEffect(() => {
    // First update the mode classes
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('theme-dark');
      document.documentElement.classList.remove('theme-light');
      document.body.classList.add('has-background-dark');
      document.body.classList.remove('has-background-white');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.add('theme-light');
      document.documentElement.classList.remove('theme-dark');
      document.body.classList.add('has-background-white');
      document.body.classList.remove('has-background-dark');
    }
    
    // Then apply the theme colors
    applyTheme(theme);
    
    // Save to localStorage
    localStorage.setItem('qwanyx-current-theme', JSON.stringify(theme));
    localStorage.setItem('qwanyx-theme-mode', isDark ? 'dark' : 'light');
    
    // Save the theme for the current mode
    if (isDark) {
      setDarkTheme(theme);
      localStorage.setItem('qwanyx-dark-theme', JSON.stringify(theme));
    } else {
      setLightTheme(theme);
      localStorage.setItem('qwanyx-light-theme', JSON.stringify(theme));
    }
    
    // Auto-save to library if editing an existing theme
    const now = Date.now();
    if (currentThemeId && (now - lastSaveTime) > 1000) { // Debounce 1 second
      const customThemes = JSON.parse(localStorage.getItem('qwanyx-custom-themes-library') || '[]');
      const updatedThemes = customThemes.map((t: any) => 
        t.id === currentThemeId 
          ? { 
              ...t, 
              colors: theme, 
              updatedAt: new Date().toISOString(),
              versions: [...(t.versions || []), { 
                colors: theme, 
                timestamp: new Date().toISOString() 
              }].slice(-10) // Keep last 10 versions
            }
          : t
      );
      localStorage.setItem('qwanyx-custom-themes-library', JSON.stringify(updatedThemes));
      setLastSaveTime(now);
    }
    
    // Add to history for undo/redo
    if (historyIndex === -1 || JSON.stringify(theme) !== JSON.stringify(history[historyIndex])) {
      const newHistory = [...history.slice(0, historyIndex + 1), theme].slice(-20); // Keep last 20 states
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
    
    // Notify parent component
    if (onThemeChange) {
      onThemeChange(theme);
    }
  }, [theme, isDark, onThemeChange, currentThemeId, lastSaveTime, history, historyIndex]);

  const handleColorChange = (colorKey: keyof ThemeColors, value: string) => {
    setTheme(prev => ({
      ...prev,
      [colorKey]: value
    }));
  };
  
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setTheme(history[newIndex]);
    }
  };
  
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setTheme(history[newIndex]);
    }
  };

  // Store separate light and dark custom themes
  const [lightTheme, setLightTheme] = useState<ThemeColors>(() => {
    const saved = localStorage.getItem('qwanyx-light-theme');
    return saved ? JSON.parse(saved) : defaultLightTheme;
  });
  
  const [darkTheme, setDarkTheme] = useState<ThemeColors>(() => {
    const saved = localStorage.getItem('qwanyx-dark-theme');
    return saved ? JSON.parse(saved) : defaultDarkTheme;
  });

  const switchTheme = (dark: boolean) => {
    setIsDark(dark);
    // Load the saved custom theme for that mode
    setTheme(dark ? darkTheme : lightTheme);
  };

  const exportTheme = () => {
    const themeData = {
      name: isDark ? 'custom-dark' : 'custom-light',
      isDark,
      colors: theme,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `theme-${isDark ? 'dark' : 'light'}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.colors) {
            setTheme(data.colors);
            setIsDark(data.isDark || false);
          }
        } catch (error) {
          console.error('Failed to import theme:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const ColorInput: React.FC<{
    label: string;
    colorKey: keyof ThemeColors;
    description?: string;
  }> = ({ label, colorKey, description }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tempColor, setTempColor] = useState(theme[colorKey]);
    const [brightness, setBrightness] = useState(100);
    
    // Helper to adjust brightness of a hex color
    const adjustBrightness = (hex: string, percent: number) => {
      // Remove # if present
      hex = hex.replace('#', '');
      
      // Convert to RGB
      const num = parseInt(hex, 16);
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;
      
      // Adjust brightness
      const factor = percent / 100;
      const newR = Math.min(255, Math.floor(r * factor));
      const newG = Math.min(255, Math.floor(g * factor));
      const newB = Math.min(255, Math.floor(b * factor));
      
      // Convert back to hex
      return '#' + ((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1);
    };
    
    // Calculate initial brightness when color changes
    const calculateBrightness = (hex: string) => {
      hex = hex.replace('#', '');
      const num = parseInt(hex, 16);
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;
      
      // Calculate perceived brightness
      const perceived = (r * 0.299 + g * 0.587 + b * 0.114) / 255 * 100;
      return Math.round(perceived);
    };
    
    // Update temp color when theme changes
    useEffect(() => {
      setTempColor(theme[colorKey]);
      setBrightness(100);
    }, [theme[colorKey]]);
    
    const handleOk = () => {
      handleColorChange(colorKey, tempColor);
      setIsOpen(false);
      setBrightness(100);
    };
    
    const handleCancel = () => {
      setTempColor(theme[colorKey]);
      setIsOpen(false);
      setBrightness(100);
    };
    
    const handleDirectInput = (value: string) => {
      handleColorChange(colorKey, value);
      setTempColor(value);
    };
    
    const handleBrightnessChange = (value: number) => {
      setBrightness(value);
      // Get the base color (at 100% brightness)
      const baseColor = theme[colorKey];
      const adjustedColor = adjustBrightness(baseColor, value);
      setTempColor(adjustedColor);
    };
    
    return (
      <Field>
        <label className="label">{label}</label>
        {description && <p className="help">{description}</p>}
        <Control>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', position: 'relative' }}>
            <div
              onClick={() => setIsOpen(!isOpen)}
              style={{ 
                width: '50px', 
                height: '38px', 
                backgroundColor: theme[colorKey],
                border: '1px solid #dbdbdb',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Click to open color picker"
            />
            <Input
              value={theme[colorKey]}
              onChange={(e) => handleDirectInput(e.target.value)}
              style={{ fontFamily: 'monospace' }}
              placeholder="#000000"
            />
            {isOpen && (
              <div style={{
                position: 'absolute',
                top: '45px',
                left: '0',
                zIndex: 1000,
                background: isDark ? '#363636' : 'white',
                border: '1px solid #dbdbdb',
                borderRadius: '8px',
                padding: '15px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                minWidth: '260px'
              }}>
                <div style={{ marginBottom: '10px' }}>
                  <strong style={{ color: isDark ? '#f5f5f5' : '#363636' }}>
                    Select Color for {label}
                  </strong>
                </div>
                <input
                  type="color"
                  value={tempColor}
                  onChange={(e) => {
                    setTempColor(e.target.value);
                    setBrightness(100);
                  }}
                  style={{ 
                    width: '100%', 
                    height: '120px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginBottom: '10px'
                  }}
                />
                
                {/* Brightness Slider */}
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '5px'
                  }}>
                    <label style={{ 
                      fontSize: '0.9rem',
                      color: isDark ? '#b5b5b5' : '#7a7a7a'
                    }}>
                      Brightness
                    </label>
                    <span style={{ 
                      fontSize: '0.9rem',
                      fontFamily: 'monospace',
                      color: isDark ? '#b5b5b5' : '#7a7a7a'
                    }}>
                      {brightness}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={brightness}
                    onChange={(e) => handleBrightnessChange(Number(e.target.value))}
                    style={{
                      width: '100%',
                      height: '8px',
                      borderRadius: '4px',
                      background: `linear-gradient(to right, 
                        ${adjustBrightness(theme[colorKey], 0)} 0%, 
                        ${adjustBrightness(theme[colorKey], 50)} 25%, 
                        ${theme[colorKey]} 50%, 
                        ${adjustBrightness(theme[colorKey], 150)} 75%, 
                        ${adjustBrightness(theme[colorKey], 200)} 100%)`,
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  />
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginTop: '5px'
                  }}>
                    <button
                      onClick={() => handleBrightnessChange(50)}
                      style={{
                        padding: '2px 8px',
                        fontSize: '0.75rem',
                        background: isDark ? '#4a4a4a' : '#f5f5f5',
                        border: '1px solid #dbdbdb',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        color: isDark ? '#f5f5f5' : '#363636'
                      }}
                    >
                      50%
                    </button>
                    <button
                      onClick={() => handleBrightnessChange(100)}
                      style={{
                        padding: '2px 8px',
                        fontSize: '0.75rem',
                        background: isDark ? '#4a4a4a' : '#f5f5f5',
                        border: '1px solid #dbdbdb',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        color: isDark ? '#f5f5f5' : '#363636'
                      }}
                    >
                      100%
                    </button>
                    <button
                      onClick={() => handleBrightnessChange(150)}
                      style={{
                        padding: '2px 8px',
                        fontSize: '0.75rem',
                        background: isDark ? '#4a4a4a' : '#f5f5f5',
                        border: '1px solid #dbdbdb',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        color: isDark ? '#f5f5f5' : '#363636'
                      }}
                    >
                      150%
                    </button>
                  </div>
                </div>
                
                <Input
                  value={tempColor}
                  onChange={(e) => {
                    setTempColor(e.target.value);
                    setBrightness(100);
                  }}
                  style={{ 
                    fontFamily: 'monospace',
                    marginBottom: '10px',
                    width: '100%'
                  }}
                  placeholder="#000000"
                />
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <Button size="small" color="success" onClick={handleOk}>
                    <span className="icon is-small">
                      <i className="fas fa-check"></i>
                    </span>
                    <span>OK</span>
                  </Button>
                  <Button size="small" onClick={handleCancel}>
                    <span className="icon is-small">
                      <i className="fas fa-times"></i>
                    </span>
                    <span>Cancel</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Control>
      </Field>
    );
  };

  return (
    <Box>
      <Title size={3}>Theme Editor</Title>
      {currentThemeName && (
        <Notification color="info" light className="mb-3">
          <strong>Currently Editing:</strong> {currentThemeName}
          {currentThemeId && (
            <span className="ml-2">
              <Tag color="primary">ID: {currentThemeId}</Tag>
            </span>
          )}
        </Notification>
      )}
      
      <div className="buttons mb-4">
        <Button 
          color={useSystemTheme ? 'info' : undefined}
          onClick={() => setUseSystemTheme(!useSystemTheme)}
        >
          {useSystemTheme ? '🔄 Using System Theme' : '🎨 Using Custom Theme'}
        </Button>
        {!useSystemTheme && (
          <>
            <Button 
              color={!isDark ? 'primary' : undefined}
              onClick={() => switchTheme(false)}
            >
              ☀️ Light Theme
            </Button>
            <Button 
              color={isDark ? 'primary' : undefined}
              onClick={() => switchTheme(true)}
            >
              🌙 Dark Theme
            </Button>
          </>
        )}
        <Button 
          onClick={undo}
          disabled={historyIndex <= 0}
        >
          ↩️ Undo
        </Button>
        <Button 
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
        >
          ↪️ Redo
        </Button>
        {!isDark && (
          <Button 
            color="info"
            onClick={generateDarkFromLight}
          >
            🌙 Generate Dark Version
          </Button>
        )}
      </div>
      
      {currentThemeId && (
        <Notification color="success" light>
          <strong>✓ Auto-saving enabled</strong> - Changes are saved automatically
        </Notification>
      )}
      
      {useSystemTheme && (
        <Notification color="info" light>
          <p><strong>System Theme Active</strong></p>
          <p>The theme will automatically switch based on your system preferences (prefers-color-scheme).</p>
          <p>Current system preference: <strong>{window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light'}</strong></p>
        </Notification>
      )}

      <Tabs>
        <Tab isActive={activeTab === 'colors'} onClick={() => setActiveTab('colors')}>
          <a>Colors</a>
        </Tab>
        <Tab isActive={activeTab === 'export'} onClick={() => setActiveTab('export')}>
          <a>Export/Import</a>
        </Tab>
      </Tabs>

      {activeTab === 'colors' && (
        <div className="mt-4">
          <Columns multiline>
            <Column size="half">
              <Title size={5}>Main Colors</Title>
              <ColorInput label="Primary" colorKey="primary" description="Main brand color" />
              <ColorInput label="Link" colorKey="link" description="Links and anchors" />
              <ColorInput label="Info" colorKey="info" description="Informational elements" />
              <ColorInput label="Success" colorKey="success" description="Success states" />
              <ColorInput label="Warning" colorKey="warning" description="Warning states" />
              <ColorInput label="Danger" colorKey="danger" description="Error/danger states" />
            </Column>
            
            <Column size="half">
              <Title size={5}>Base Colors</Title>
              <ColorInput label="Dark" colorKey="dark" description="Dark elements" />
              <ColorInput label="Light" colorKey="light" description="Light elements" />
              <ColorInput label="White" colorKey="white" />
              <ColorInput label="Black" colorKey="black" />
            </Column>

            <Column size="half">
              <Title size={5}>Text Colors</Title>
              <ColorInput label="Text" colorKey="text" description="Main text color" />
              <ColorInput label="Text Light" colorKey="text-light" description="Muted text" />
              <ColorInput label="Text Dark" colorKey="text-dark" description="Dark text" />
              <ColorInput label="Text Strong" colorKey="text-strong" description="Bold text" />
            </Column>

            <Column size="half">
              <Title size={5}>Backgrounds</Title>
              <ColorInput label="Scheme Main" colorKey="scheme-main" description="Main background" />
              <ColorInput label="Scheme Main Bis" colorKey="scheme-main-bis" description="Alt background" />
              <ColorInput label="Scheme Main Ter" colorKey="scheme-main-ter" description="Alt background 2" />
              <ColorInput label="Scheme Invert" colorKey="scheme-invert" description="Inverted scheme" />
              <ColorInput label="Background" colorKey="background" description="Section backgrounds" />
            </Column>

            <Column size="half">
              <Title size={5}>Borders</Title>
              <ColorInput label="Border" colorKey="border" description="Default borders" />
            </Column>
          </Columns>
        </div>
      )}

      {activeTab === 'export' && (
        <div className="mt-4">
          <Title size={5}>Export Current Theme</Title>
          <Field>
            <Control>
              <Button color="primary" onClick={exportTheme}>
                📥 Download Theme JSON
              </Button>
            </Control>
            <p className="help">Save your current theme configuration as a JSON file</p>
          </Field>

          <hr />

          <Title size={5}>Import Theme</Title>
          <Field>
            <div className="file">
              <label className="file-label">
                <input
                  className="file-input"
                  type="file"
                  accept=".json"
                  onChange={importTheme}
                />
                <span className="file-cta">
                  <span className="file-label">📤 Choose file...</span>
                </span>
              </label>
            </div>
            <p className="help">Load a previously exported theme JSON file</p>
          </Field>

          <hr />

          <Title size={5}>Theme Code</Title>
          <Notification color="info">
            <p className="mb-2">Copy this CSS to use in your project:</p>
            <pre style={{ 
              background: '#f5f5f5', 
              padding: '1rem', 
              borderRadius: '4px',
              overflow: 'auto',
              maxHeight: '300px'
            }}>
              {`:root {
  --bulma-primary: ${theme.primary};
  --bulma-link: ${theme.link};
  --bulma-info: ${theme.info};
  --bulma-success: ${theme.success};
  --bulma-warning: ${theme.warning};
  --bulma-danger: ${theme.danger};
  --bulma-dark: ${theme.dark};
  --bulma-light: ${theme.light};
  --bulma-scheme-main: ${theme['scheme-main']};
  --bulma-text: ${theme.text};
  --bulma-background: ${theme.background};
  --bulma-border: ${theme.border};
  /* Add more as needed */
}`}
            </pre>
          </Notification>
        </div>
      )}
    </Box>
  );
};