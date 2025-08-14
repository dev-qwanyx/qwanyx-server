import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'qwanyx-modules',
      filename: 'remoteEntry.js',
      exposes: {
        // Modules génériques
        './NavbarQwanyx': './src/modules/generic/NavbarQwanyx',
        './HeroGeneric': './src/modules/generic/HeroGeneric',
        './FooterGeneric': './src/modules/generic/FooterGeneric',
        './ServicesGrid': './src/modules/generic/ServicesGrid',
        './AuthModule': './src/modules/generic/AuthModule',
        
        // Modules Autodin
        './NavbarAutodin': './src/modules/autodin/NavbarAutodin',
        './HeroAutodin': './src/modules/autodin/HeroAutodin',
        './ServicesAutodin': './src/modules/autodin/ServicesAutodin',
        './ContactAutodin': './src/modules/autodin/ContactAutodin',
        './DashboardAutodin': './src/modules/autodin/DashboardAutodin',
        './AuthModalAutodin': './src/modules/autodin/AuthModalAutodin',
        './AuthAutodin': './src/modules/autodin/AuthAutodin',
        
        // Hooks partagés
        './hooks/useAuth': './src/hooks/useAuth',
        './hooks/useWorkspace': './src/hooks/useWorkspace'
      },
      shared: ['react', 'react-dom', '@qwanyx/ui']
    })
  ],
  server: {
    port: 5000,
    cors: true
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})
