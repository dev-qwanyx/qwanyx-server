/**
 * 📦 PACKAGE: @qwanyx/app-core
 * 🎭 LEVEL: utility
 * 🎯 PURPOSE: Factory function to create QWANYX apps with proper configuration
 */

import type { AppConfig } from '../types';

export function createApp(config: AppConfig) {
  console.log(`🚀 Initializing QWANYX App: ${config.name} v${config.version}`);
  
  return {
    config,
    // Future: Add app lifecycle methods here
    start: () => {
      console.log(`✅ ${config.name} started successfully`);
    },
    stop: () => {
      console.log(`🛑 ${config.name} stopped`);
    }
  };
}