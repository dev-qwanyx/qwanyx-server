// Import all theme files
import defaultTheme from './default.json';
import autodinTheme from './autodin.json';
import belgicomicsTheme from './belgicomics.json';

export interface Theme {
  name: string;
  id: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    card: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
  };
  typography: {
    fontFamily: {
      heading: string;
      body: string;
      mono: string;
    };
    fontSize: Record<string, string>;
    fontWeight: Record<string, number>;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
}

// Export all themes as a map
export const themes: Record<string, Theme> = {
  default: defaultTheme,
  autodin: autodinTheme,
  belgicomics: belgicomicsTheme
};

// Helper function to get theme by workspace
export const getThemeByWorkspace = (workspace: string): Theme => {
  return themes[workspace] || themes.default;
};

// Helper function to get all available themes
export const getAllThemes = (): Theme[] => {
  return Object.values(themes);
};

// Helper function to get theme by ID
export const getThemeById = (id: string): Theme | undefined => {
  return themes[id];
};

export default themes;