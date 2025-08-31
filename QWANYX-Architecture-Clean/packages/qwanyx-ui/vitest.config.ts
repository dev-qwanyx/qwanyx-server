import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '*.config.ts',
        'dist/',
        'studio/',
        'studio-v2/'
      ]
    },
    // Stop at first failure
    bail: 1,
    // Silent unless error
    reporters: process.env.CI ? ['dot'] : ['default'],
    // Disable watch by default
    watch: false
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});