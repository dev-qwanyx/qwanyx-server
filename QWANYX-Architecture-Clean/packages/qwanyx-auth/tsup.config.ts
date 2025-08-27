import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false, // Temporarily disabled
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  minify: false,
  treeshake: true,
  esbuildOptions(options) {
    options.jsx = 'automatic'
  }
})