import { default as React } from 'react';
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
export declare const useTheme: () => ThemeContextType;
interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: Theme;
    persistTheme?: boolean;
}
export declare const ThemeProvider: React.FC<ThemeProviderProps>;
export {};
//# sourceMappingURL=ThemeProvider.d.ts.map