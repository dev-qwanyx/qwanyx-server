import { lazy, Suspense } from 'react'
import { ThemeProvider } from '@qwanyx/ui'
import '@qwanyx/ui/dist/ui.css'
import themeQwanyx from './theme-qwanyx.json'
import { siteConfig } from './config'
import './App.css'

// Import dynamique des modules via Module Federation
const NavbarQwanyx = lazy(() => import('qwanyx-modules/NavbarQwanyx'))
const HeroGeneric = lazy(() => import('qwanyx-modules/HeroGeneric'))
const ServicesGrid = lazy(() => import('qwanyx-modules/ServicesGrid'))
const FooterGeneric = lazy(() => import('qwanyx-modules/FooterGeneric'))

function App() {
  const handleAuthClick = () => {
    console.log('Auth modal will be implemented')
    // TODO: Implement auth modal
  }

  return (
    <ThemeProvider theme={themeQwanyx}>
      <Suspense fallback={<div className="loading">Chargement...</div>}>
        <div className="app">
          <NavbarQwanyx 
            {...siteConfig.navbar}
            onAuthClick={handleAuthClick}
          />
          
          <HeroGeneric {...siteConfig.hero} />
          
          <ServicesGrid 
            {...siteConfig.services}
            services={siteConfig.services.items}
          />
          
          <FooterGeneric {...siteConfig.footer} />
        </div>
      </Suspense>
    </ThemeProvider>
  )
}

export default App