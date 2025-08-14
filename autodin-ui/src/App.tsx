import { useState, useEffect, lazy, Suspense } from 'react'
import { ThemeProvider, WorkspaceProvider, useWorkspace } from '@qwanyx/ui'
import { config } from './config'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AutodinAuthModalNew from './components/AutodinAuthModalNew'
import SearchToolsPage from './components/SearchToolsPage'
import DemandesPage from './components/DemandesPage'

// Import Dashboard from module federation
const Dashboard = lazy(() => import('qwanyx-modules/DashboardAutodin'))

function AppContent() {
  const { user, isAuthenticated, login, logout } = useWorkspace()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [scrolled, setScrolled] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Gérer le scroll vers les ancres après le chargement de la page
  useEffect(() => {
    if (currentPage === 'home') {
      const hash = window.location.hash
      if (hash) {
        setTimeout(() => {
          const element = document.querySelector(hash)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
      }
    }
  }, [currentPage])

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }

  const handleLogout = () => {
    logout()
    setCurrentPage('home')
  }

  const handleDashboardClick = () => {
    setCurrentPage('dashboard')
  }
  
  const handleBackToHome = () => {
    // Do a full page reload like the logo does
    window.location.href = '/'
  }

  return (
    <div className="autodin-app">
      {currentPage !== 'dashboard' && currentPage !== 'demandes' && (
        <Navbar 
          scrolled={scrolled}
          isLoggedIn={isAuthenticated}
          currentUser={user}
          onLoginClick={() => handleAuthClick('login')}
          onRegisterClick={() => handleAuthClick('register')}
          onLogout={handleLogout}
          onDashboardClick={handleDashboardClick}
          onHomeClick={() => setCurrentPage('home')}
          currentPage={currentPage}
        />
      )}
      
      <main key={currentPage} style={{ 
        backgroundColor: currentPage === 'dashboard' ? 'var(--gray-100)' : 'transparent',
        minHeight: currentPage === 'dashboard' ? '100%' : 'auto',
        paddingBottom: currentPage === 'dashboard' ? '2rem' : '0'
      }}>
        {currentPage === 'dashboard' ? (
          <Suspense fallback={
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2>Chargement du module Dashboard...</h2>
              <p>Module Federation Active</p>
            </div>
          }>
            <Dashboard 
              currentUser={user}
              onBack={handleBackToHome}
              onNavigate={(page) => setCurrentPage(page)}
            />
          </Suspense>
        ) : currentPage === 'search-tools' ? (
          <SearchToolsPage onBack={() => setCurrentPage('home')} />
        ) : currentPage === 'demandes' ? (
          <DemandesPage 
            onBack={() => setCurrentPage('dashboard')} 
            onNavigate={(page) => setCurrentPage(page)}
          />
        ) : (
          <>
            <Hero />
            <Services 
              services={config.services}
              isLoggedIn={isAuthenticated}
              onAuthRequired={() => handleAuthClick('login')}
              onServiceClick={(service) => {
                if (isAuthenticated) {
                  // Si connecté et c'est "Faire une demande", aller directement à la page Demandes
                  if (service.title === 'Faire une demande') {
                    setCurrentPage('demandes')
                  } else {
                    // Sinon, ouvrir le tableau de bord
                    setCurrentPage('dashboard')
                  }
                } else if (service.title === 'Outils de recherche') {
                  setCurrentPage('search-tools')
                }
              }}
            />
            <Contact />
          </>
        )}
      </main>
      
      <Footer />
      
      {/* Custom Autodin Auth Modal */}
      <AutodinAuthModalNew
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onSuccess={(user, token) => {
          console.log('Auth successful!', user, token)
          setIsAuthModalOpen(false)
          login(user, token)
        }}
      />
    </div>
  )
}

function App() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5002';
  
  return (
    <WorkspaceProvider defaultWorkspace="autodin" apiUrl={apiUrl}>
      <AppContent />
    </WorkspaceProvider>
  )
}

export default App