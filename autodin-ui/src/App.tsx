import { useState, useEffect } from 'react'
import { WorkspaceProvider, useWorkspace } from '@qwanyx/ui'
import { config } from './config'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AutodinAuthModal from './components/AutodinAuthModal'
import SearchToolsPage from './components/SearchToolsPage'
import Dashboard from './components/Dashboard'

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

  return (
    <div className="autodin-app">
      <Navbar 
        scrolled={scrolled}
        isLoggedIn={isAuthenticated}
        currentUser={user}
        onLoginClick={() => handleAuthClick('login')}
        onRegisterClick={() => handleAuthClick('register')}
        onLogout={handleLogout}
        onDashboardClick={handleDashboardClick}
      />
      
      <main>
        {currentPage === 'dashboard' ? (
          <Dashboard 
            currentUser={user}
            onBack={() => setCurrentPage('home')} 
          />
        ) : currentPage === 'search-tools' ? (
          <SearchToolsPage onBack={() => setCurrentPage('home')} />
        ) : (
          <>
            <Hero />
            <Services 
              services={config.services}
              isLoggedIn={isAuthenticated}
              onAuthRequired={() => handleAuthClick('login')}
              onServiceClick={(service) => {
                if (isAuthenticated) {
                  // Si connecté, toutes les cartes ouvrent le tableau de bord
                  setCurrentPage('dashboard')
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
      <AutodinAuthModal
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
  return (
    <WorkspaceProvider defaultWorkspace="autodin" apiUrl="http://localhost:5002">
      <AppContent />
    </WorkspaceProvider>
  )
}

export default App