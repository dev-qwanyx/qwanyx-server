import { useState, useEffect } from 'react'
import { config } from './config'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Contact from './components/Contact'
import Footer from './components/Footer'
import BelgicomicsAuthModalNew from './components/BelgicomicsAuthModalNew'
import SearchToolsPage from './components/SearchToolsPage'

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [scrolled, setScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('belgicomics-be_token')
  })
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

  return (
    <div className="belgicomics-app">
      <Navbar 
        scrolled={scrolled}
        onLoginClick={() => handleAuthClick('login')}
        onRegisterClick={() => handleAuthClick('register')}
        isLoggedIn={isLoggedIn}
        onLogout={() => {
          setIsLoggedIn(false)
          localStorage.removeItem('belgicomics-be_token')
          localStorage.removeItem('belgicomics-be_user')
        }}
      />
      
      <main>
        {currentPage === 'search-tools' ? (
          <SearchToolsPage onBack={() => setCurrentPage('home')} />
        ) : (
          <>
            <Hero />
            <Services 
              services={config.services}
              isLoggedIn={isLoggedIn}
              onAuthRequired={() => handleAuthClick('login')}
              onServiceClick={(service) => {
                if (service.title === 'Outils de recherche') {
                  setCurrentPage('search-tools')
                }
              }}
            />
            <Contact />
          </>
        )}
      </main>
      
      <Footer />
      
      {/* Custom Belgicomics Auth Modal */}
      <BelgicomicsAuthModalNew
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onSuccess={(user, token) => {
          console.log('Auth successful!', user, token)
          setIsAuthModalOpen(false)
          setIsLoggedIn(true)
        }}
      />
    </div>
  )
}

export default App