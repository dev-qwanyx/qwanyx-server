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
export declare const themes: Record<string, Theme>;
export declare const getThemeByWorkspace: (workspace: string) => Theme;
export declare const getAllThemes: () => Theme[];
export declare const getThemeById: (id: string) => Theme | undefined;
export default themes;
//# sourceMappingURL=index.d.ts.map