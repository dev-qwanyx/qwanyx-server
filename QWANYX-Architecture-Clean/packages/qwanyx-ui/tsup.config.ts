import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false, // Temporarily disabled due to React type conflicts
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  minify: false,
  treeshake: true,
  esbuildOptions(options) {
    options.jsx = 'automatic'
  },
  // PostCSS will process @import statements
  postcss: true
})