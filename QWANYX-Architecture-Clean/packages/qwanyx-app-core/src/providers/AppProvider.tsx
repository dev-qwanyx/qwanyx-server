/**
 * 📦 PACKAGE: @qwanyx/app-core
 * 🎭 LEVEL: provider
 * 🎯 PURPOSE: Main provider that orchestrates all app-level providers
 * 
 * This is the FOUNDATION of every QWANYX app
 * It provides:
 * - CSS Reset and global styles
 * - Meta tags for PWA
 * - Theme system
 * - Core app configuration
 */

import React from 'react';
import { GlobalStyles } from '../components/GlobalStyles';
import { MetaTags } from '../components/MetaTags';
import type { AppConfig } from '../types';

interface AppProviderProps {
  config: AppConfig;
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const AppProvider: React.FC<AppProviderProps> = ({ 
  config, 
  children,
  title,
  description 
}) => {
  // Apply theme CSS variables to root
  React.useEffect(() => {
    if (config.theme?.primaryColor) {
      // Convert hex to RGB for CSS variables
      const hex = config.theme.primaryColor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      document.documentElement.style.setProperty('--primary', `${r}, ${g}, ${b}`);
    }

    // Set theme mode
    if (config.theme?.mode) {
      document.documentElement.setAttribute('data-theme', config.theme.mode);
    }
  }, [config.theme]);

  return (
    <>
      <GlobalStyles />
      <MetaTags 
        title={title || config.name}
        description={description || `${config.name} - Built with QWANYX`}
        themeColor={config.theme?.primaryColor}
      />
      <div data-qwanyx-app={config.name} data-qwanyx-version={config.version}>
        {children}
      </div>
    </>
  );
};