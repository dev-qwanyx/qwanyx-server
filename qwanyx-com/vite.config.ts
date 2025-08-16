import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'qwanyx-com',
      remotes: {
        'qwanyx-modules': 'http://localhost:4173/assets/remoteEntry.js'
      },
      shared: ['react', 'react-dom', '@qwanyx/ui']
    })
  ],
  server: {
    port: 4000,
    cors: true
  }
})
