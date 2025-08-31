// Configuration tsup uniforme pour tous les packages
import { defineConfig } from 'tsup'

export const baseConfig = defineConfig({
  entry: ['src/index.ts', 'src/index.tsx'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  minify: false, // On minifiera en production seulement
  treeshake: true,
  esbuildOptions(options) {
    // Support JSX
    options.jsx = 'automatic'
  }
})