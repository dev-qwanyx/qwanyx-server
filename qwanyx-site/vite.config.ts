import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'qwanyx-ui': path.resolve(__dirname, '../qwanyx-ui/src/index.ts')
    }
  },
  optimizeDeps: {
    include: ['qwanyx-ui']
  }
})
