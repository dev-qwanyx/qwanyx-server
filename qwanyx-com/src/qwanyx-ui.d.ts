declare module '@qwanyx/ui' {
  import { FC, ReactNode, HTMLAttributes } from 'react';

  // Theme Provider
  export interface Theme {
    colors?: any;
    typography?: any;
    spacing?: any;
    [key: string]: any;
  }
  
  export interface ThemeProviderProps {
    theme: Theme;
    children: ReactNode;
  }
  
  export const ThemeProvider: FC<ThemeProviderProps>;
  export function useTheme(): Theme;
}