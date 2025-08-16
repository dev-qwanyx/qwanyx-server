declare module '@qwanyx/ui' {
  import { FC, ReactNode, HTMLAttributes } from 'react';

  export interface ThemeProviderProps {
    theme: any;
    children: ReactNode;
  }
  export const ThemeProvider: FC<ThemeProviderProps>;

  export interface WorkspaceProviderProps {
    workspace: string;
    apiUrl?: string;
    children: ReactNode;
  }
  export const WorkspaceProvider: FC<WorkspaceProviderProps>;
}