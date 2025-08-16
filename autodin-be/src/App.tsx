import { lazy, Suspense, useState, useEffect } from 'react'
import { ThemeProvider, WorkspaceProvider } from '@qwanyx/ui'
// import { AuthProvider } from 'qwanyx-modules/hooks/useAuth'
import '@qwanyx/ui/dist/ui.css'
import themeAutodin from './theme-autodin.json'
import { siteConfig } from './config'
import './styles/autodin-theme.css'
import './App.css'

// Import local Hero component
import Hero from './components/Hero'

// Import dynamique des modules via Module Federation
const NavbarAutodin = lazy(() => import('qwanyx-modules/NavbarAutodin'))
const ServicesAutodin = lazy(() => import('qwanyx-modules/ServicesAutodin'))
const ContactAutodin = lazy(() => import('qwanyx-modules/ContactAutodin'))
const DashboardAutodin = lazy(() => import('qwanyx-modules/DashboardAutodin'))
const FooterGeneric = lazy(() => import('qwanyx-modules/FooterGeneric'))

function App() {
  const [scrolled, setScrolled] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    // Handle scroll
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleDashboardClick = () => {
    setCurrentPage('dashboard')
  }

  // Apply custom CSS variables from theme
  useEffect(() => {
    if (themeAutodin.custom) {
      Object.entries(themeAutodin.custom).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value as string)
      })
    }
  }, [])

  return (
    <WorkspaceProvider 
      defaultWorkspace={siteConfig.workspace}
      apiUrl={siteConfig.apiUrl}
    >
      <ThemeProvider theme={themeAutodin}>
        <Suspense fallback={<div className="loading">Chargement...</div>}>
            <div className="autodin-app">
              <NavbarAutodin 
                scrolled={scrolled}
                workspace={siteConfig.workspace}
                onDashboardClick={handleDashboardClick}
              />
            
              <main>
                {currentPage === 'dashboard' ? (
                  <DashboardAutodin 
                    onBack={() => setCurrentPage('home')} 
                  />
              ) : (
                  <>
                  <Hero 
                    siteName={siteConfig.workspace}
                    siteTagline="Votre partenaire automobile de confiance"
                    siteDescription="Découvrez notre marketplace de pièces automobiles et services"
                  />
                    <ServicesAutodin 
                      services={siteConfig.services}
                      onServiceClick={() => setCurrentPage('dashboard')}
                    />
                  <ContactAutodin />
                  <FooterGeneric 
                    theme="dark"
                    copyright={`© ${new Date().getFullYear()} Autodin. Tous droits réservés.`}
                    sections={[
                      {
                        title: 'Services',
                        links: [
                          { label: 'Recherche', href: '/recherche' },
                          { label: 'Marketplace', href: '/marketplace' },
                          { label: 'Outils', href: '/outils' }
                        ]
                      },
                      {
                        title: 'Support',
                        links: [
                          { label: 'Aide', href: '/aide' },
                          { label: 'Contact', href: '#contact' },
                          { label: 'FAQ', href: '/faq' }
                        ]
                      },
                      {
                        title: 'Légal',
                        links: [
                          { label: 'Conditions', href: '/conditions' },
                          { label: 'Confidentialité', href: '/confidentialite' },
                          { label: 'Cookies', href: '/cookies' }
                        ]
                      }
                    ]}
                  />
                  </>
                )}
              </main>
            </div>
          </Suspense>
      </ThemeProvider>
    </WorkspaceProvider>
  )
}

export default App
