/**
 * 📦 PACKAGE: @qwanyx/app-core
 * 🎭 LEVEL: types
 * 🎯 PURPOSE: Type definitions for QWANYX applications
 */

export interface AppConfig {
  name: string;
  version: string;
  theme?: AppTheme;
  workspace?: string;
  apiUrl?: string;
}

export interface AppTheme {
  primaryColor?: string;
  secondaryColor?: string;
  mode?: 'light' | 'dark' | 'auto';
}