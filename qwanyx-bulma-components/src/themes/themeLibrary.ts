// QWANYX Theme Library
// Pre-built themes for all QWANYX projects

export interface Theme {
  name: string;
  description: string;
  colors: ThemeColors;
}

export interface ThemeColors {
  // Main colors
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
  
  // Scheme colors
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

// QWANYX Themes - Black & White Minimalist
export const qwanyxLight: Theme = {
  name: 'QWANYX Light',
  description: 'Minimalist black and white theme for QWANYX',
  colors: {
    primary: '#000000',      // Pure black
    link: '#333333',         // Dark grey for links
    info: '#666666',         // Medium grey
    success: '#000000',      // Black for success
    warning: '#666666',      // Grey for warning
    danger: '#000000',       // Black for danger
    dark: '#000000',         // Pure black
    light: '#f5f5f5',        // Light grey
    white: '#ffffff',        // Pure white
    black: '#000000',        // Pure black
    
    'scheme-main': '#ffffff',
    'scheme-main-bis': '#fafafa',
    'scheme-main-ter': '#f5f5f5',
    'scheme-invert': '#000000',
    'scheme-invert-bis': '#0a0a0a',
    'scheme-invert-ter': '#1a1a1a',
    
    text: '#000000',
    'text-light': '#666666',
    'text-dark': '#000000',
    'text-strong': '#000000',
    
    background: '#ffffff',
    border: '#e0e0e0',
  }
};

export const qwanyxDark: Theme = {
  name: 'QWANYX Dark',
  description: 'Minimalist white and black theme for QWANYX',
  colors: {
    primary: '#ffffff',      // Pure white
    link: '#cccccc',         // Light grey for links
    info: '#999999',         // Medium grey
    success: '#ffffff',      // White for success
    warning: '#999999',      // Grey for warning
    danger: '#ffffff',       // White for danger
    dark: '#f5f5f5',         // Light grey (inverted)
    light: '#1a1a1a',        // Dark grey (inverted)
    white: '#000000',        // Black (inverted)
    black: '#ffffff',        // White (inverted)
    
    'scheme-main': '#000000',
    'scheme-main-bis': '#0a0a0a',
    'scheme-main-ter': '#1a1a1a',
    'scheme-invert': '#ffffff',
    'scheme-invert-bis': '#fafafa',
    'scheme-invert-ter': '#f5f5f5',
    
    text: '#ffffff',
    'text-light': '#999999',
    'text-dark': '#ffffff',
    'text-strong': '#ffffff',
    
    background: '#000000',
    border: '#333333',
  }
};

// Autodin Themes - Orange & Black
export const autodinLight: Theme = {
  name: 'Autodin Light',
  description: 'Orange and black theme for Autodin marketplace',
  colors: {
    primary: '#E67E22',      // Autodin Orange
    link: '#E67E22',         // Orange for links
    info: '#3498db',         // Blue
    success: '#27ae60',      // Green
    warning: '#f39c12',      // Yellow
    danger: '#e74c3c',       // Red
    dark: '#2C3E50',         // Autodin Dark
    light: '#ecf0f1',        // Light grey
    white: '#ffffff',
    black: '#2C3E50',
    
    'scheme-main': '#ffffff',
    'scheme-main-bis': '#fdf6f1',
    'scheme-main-ter': '#faebd7',
    'scheme-invert': '#2C3E50',
    'scheme-invert-bis': '#34495e',
    'scheme-invert-ter': '#3d566e',
    
    text: '#2C3E50',
    'text-light': '#7f8c8d',
    'text-dark': '#2C3E50',
    'text-strong': '#2C3E50',
    
    background: '#fdf6f1',
    border: '#e8b898',
  }
};

export const autodinDark: Theme = {
  name: 'Autodin Dark',
  description: 'Dark orange and black theme for Autodin marketplace',
  colors: {
    primary: '#ff9444',      // Brighter orange for dark mode
    link: '#ff9444',
    info: '#5dade2',
    success: '#52c77a',
    warning: '#f5b041',
    danger: '#ec7063',
    dark: '#ecf0f1',         // Light (inverted)
    light: '#2C3E50',        // Dark (inverted)
    white: '#1a1a1a',        // Dark background
    black: '#ecf0f1',        // Light text
    
    'scheme-main': '#2C3E50',
    'scheme-main-bis': '#34495e',
    'scheme-main-ter': '#3d566e',
    'scheme-invert': '#ecf0f1',
    'scheme-invert-bis': '#d5dbdb',
    'scheme-invert-ter': '#bdc3c7',
    
    text: '#ecf0f1',
    'text-light': '#95a5a6',
    'text-dark': '#ecf0f1',
    'text-strong': '#ffffff',
    
    background: '#34495e',
    border: '#566573',
  }
};

// Belgicomics Themes - Grey & Modern
export const belgicomicsLight: Theme = {
  name: 'Belgicomics Light',
  description: 'Modern grey theme for Belgicomics',
  colors: {
    primary: '#546e7a',      // Blue-grey
    link: '#546e7a',
    info: '#039be5',
    success: '#43a047',
    warning: '#fb8c00',
    danger: '#e53935',
    dark: '#37474f',
    light: '#eceff1',
    white: '#ffffff',
    black: '#263238',
    
    'scheme-main': '#ffffff',
    'scheme-main-bis': '#fafafa',
    'scheme-main-ter': '#f5f5f5',
    'scheme-invert': '#263238',
    'scheme-invert-bis': '#2e3d44',
    'scheme-invert-ter': '#37474f',
    
    text: '#455a64',
    'text-light': '#78909c',
    'text-dark': '#37474f',
    'text-strong': '#263238',
    
    background: '#f5f5f5',
    border: '#cfd8dc',
  }
};

export const belgicomicsDark: Theme = {
  name: 'Belgicomics Dark',
  description: 'Modern dark grey theme for Belgicomics',
  colors: {
    primary: '#78909c',      // Lighter blue-grey for dark
    link: '#90a4ae',
    info: '#4fc3f7',
    success: '#66bb6a',
    warning: '#ffa726',
    danger: '#ef5350',
    dark: '#eceff1',         // Light (inverted)
    light: '#37474f',        // Dark (inverted)
    white: '#263238',        // Dark background
    black: '#eceff1',        // Light text
    
    'scheme-main': '#263238',
    'scheme-main-bis': '#2e3d44',
    'scheme-main-ter': '#37474f',
    'scheme-invert': '#eceff1',
    'scheme-invert-bis': '#cfd8dc',
    'scheme-invert-ter': '#b0bec5',
    
    text: '#cfd8dc',
    'text-light': '#90a4ae',
    'text-dark': '#eceff1',
    'text-strong': '#ffffff',
    
    background: '#2e3d44',
    border: '#455a64',
  }
};

// Personal-CASH Themes - Green & Professional
export const personalCashLight: Theme = {
  name: 'Personal-CASH Light',
  description: 'Professional green theme for Personal-CASH',
  colors: {
    primary: '#2e7d32',      // Dark green
    link: '#388e3c',
    info: '#1976d2',
    success: '#2e7d32',
    warning: '#f57c00',
    danger: '#d32f2f',
    dark: '#1b5e20',
    light: '#e8f5e9',
    white: '#ffffff',
    black: '#1b5e20',
    
    'scheme-main': '#ffffff',
    'scheme-main-bis': '#f1f8e9',
    'scheme-main-ter': '#e8f5e9',
    'scheme-invert': '#1b5e20',
    'scheme-invert-bis': '#2e7d32',
    'scheme-invert-ter': '#388e3c',
    
    text: '#2e7d32',
    'text-light': '#66bb6a',
    'text-dark': '#1b5e20',
    'text-strong': '#1b5e20',
    
    background: '#f1f8e9',
    border: '#a5d6a7',
  }
};

export const personalCashDark: Theme = {
  name: 'Personal-CASH Dark',
  description: 'Professional dark green theme for Personal-CASH',
  colors: {
    primary: '#66bb6a',      // Light green for dark
    link: '#81c784',
    info: '#64b5f6',
    success: '#66bb6a',
    warning: '#ffb74d',
    danger: '#e57373',
    dark: '#e8f5e9',
    light: '#1b5e20',
    white: '#1b5e20',
    black: '#e8f5e9',
    
    'scheme-main': '#1b5e20',
    'scheme-main-bis': '#2e7d32',
    'scheme-main-ter': '#388e3c',
    'scheme-invert': '#e8f5e9',
    'scheme-invert-bis': '#c8e6c9',
    'scheme-invert-ter': '#a5d6a7',
    
    text: '#c8e6c9',
    'text-light': '#81c784',
    'text-dark': '#e8f5e9',
    'text-strong': '#ffffff',
    
    background: '#2e7d32',
    border: '#4caf50',
  }
};

// Digital Human Themes - Futuristic
export const digitalHumanLight: Theme = {
  name: 'Digital Human Light',
  description: 'Futuristic cyan theme for Digital Human apps',
  colors: {
    primary: '#00bcd4',      // Cyan
    link: '#0097a7',
    info: '#00acc1',
    success: '#00e676',
    warning: '#ffab00',
    danger: '#ff1744',
    dark: '#006064',
    light: '#e0f7fa',
    white: '#ffffff',
    black: '#006064',
    
    'scheme-main': '#ffffff',
    'scheme-main-bis': '#f0fcfd',
    'scheme-main-ter': '#e0f7fa',
    'scheme-invert': '#006064',
    'scheme-invert-bis': '#00838f',
    'scheme-invert-ter': '#0097a7',
    
    text: '#006064',
    'text-light': '#00acc1',
    'text-dark': '#004d40',
    'text-strong': '#004d40',
    
    background: '#f0fcfd',
    border: '#80deea',
  }
};

export const digitalHumanDark: Theme = {
  name: 'Digital Human Dark',
  description: 'Futuristic dark cyan theme for Digital Human apps',
  colors: {
    primary: '#00f4ff',      // Bright cyan for dark
    link: '#4dd0e1',
    info: '#26c6da',
    success: '#69f0ae',
    warning: '#ffd54f',
    danger: '#ff5252',
    dark: '#e0f7fa',
    light: '#006064',
    white: '#004d40',
    black: '#b2ebf2',
    
    'scheme-main': '#004d40',
    'scheme-main-bis': '#006064',
    'scheme-main-ter': '#00838f',
    'scheme-invert': '#e0f7fa',
    'scheme-invert-bis': '#b2ebf2',
    'scheme-invert-ter': '#80deea',
    
    text: '#b2ebf2',
    'text-light': '#4dd0e1',
    'text-dark': '#e0f7fa',
    'text-strong': '#ffffff',
    
    background: '#006064',
    border: '#00acc1',
  }
};

// Theme collection
export const themes = {
  // QWANYX
  qwanyxLight,
  qwanyxDark,
  
  // Autodin
  autodinLight,
  autodinDark,
  
  // Belgicomics
  belgicomicsLight,
  belgicomicsDark,
  
  // Personal-CASH
  personalCashLight,
  personalCashDark,
  
  // Digital Human
  digitalHumanLight,
  digitalHumanDark,
};

// Helper function to apply theme
export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVarName = `--bulma-${key}`;
    root.style.setProperty(cssVarName, value);
  });
  
  // Set body background
  document.body.style.backgroundColor = theme.colors['scheme-main'];
};

// Helper function to generate CSS from theme
export const generateThemeCSS = (theme: Theme): string => {
  const cssVars = Object.entries(theme.colors)
    .map(([key, value]) => `  --bulma-${key}: ${value};`)
    .join('\n');
  
  return `:root {\n${cssVars}\n}`;
};

// Helper function to export theme as JSON
export const exportTheme = (theme: Theme): string => {
  return JSON.stringify(theme, null, 2);
};