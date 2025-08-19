export type ThemeMode = 'light' | 'dark' | 'system';
interface UseThemeModeReturn {
    mode: ThemeMode;
    resolvedMode: 'light' | 'dark';
    setMode: (mode: ThemeMode) => void;
}
export declare function useThemeMode(): UseThemeModeReturn;
export declare function getStoredThemeMode(): ThemeMode;
export declare function getResolvedTheme(): 'light' | 'dark';
export {};
//# sourceMappingURL=useThemeMode.d.ts.map