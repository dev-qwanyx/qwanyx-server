import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src/**/*'],
      outDir: 'dist',
      rollupTypes: true
    })
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'QwanyxDashboard',
      formats: ['es', 'umd'],
      fileName: (format) => format === 'es' ? 'index.mjs' : 'index.js'
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@qwanyx/ui'],
      output: {
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM',
          '@qwanyx/ui': 'QwanyxUI'
        }
      }
    }
  }
})