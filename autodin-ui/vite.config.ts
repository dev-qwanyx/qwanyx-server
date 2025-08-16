import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'autodin-ui',
      remotes: {
        'qwanyx-modules': 'http://localhost:4184/assets/remoteEntry.js'
      },
      shared: ['react', 'react-dom', '@qwanyx/ui']
    })
  ],
  server: {
    port: 4000
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})