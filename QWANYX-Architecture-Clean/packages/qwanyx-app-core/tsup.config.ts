import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/styles.css'],
  format: ['cjs', 'esm'],
  dts: false, // Disabled temporarily to avoid type errors
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', '@qwanyx/ui', '@qwanyx/auth', '@qwanyx/dashboard-v2'],
});