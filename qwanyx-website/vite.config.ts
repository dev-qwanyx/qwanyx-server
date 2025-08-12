import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@qwanyx/bulma-components': path.resolve(__dirname, '../qwanyx-bulma-components/src/index.ts')
    }
  }
})
