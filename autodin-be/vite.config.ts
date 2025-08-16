import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'autodin-be',
      remotes: {
        'qwanyx-modules': 'http://localhost:4173/assets/remoteEntry.js'
      },
      shared: ['react', 'react-dom', '@qwanyx/ui']
    })
  ],
  resolve: {
    alias: {
      '@qwanyx/ui': path.resolve(__dirname, '../qwanyx-ui')
    }
  },
  server: {
    port: 4010,
    cors: true
  }
})