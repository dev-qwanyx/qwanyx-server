'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import AutodinAuthModalNew from '@/components/AutodinAuthModalNew'
import { config } from '@/config'

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('autodin_token')
    const userData = localStorage.getItem('autodin_user')
    if (token && userData) {
      setIsAuthenticated(true)
      setUser(JSON.parse(userData))
    }
  }, [])

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
    localStorage.removeItem('autodin_token')
    localStorage.removeItem('autodin_user')
    setIsAuthenticated(false)
    setUser(null)
  }

  const handleAuthSuccess = (user: any, token: string) => {
    localStorage.setItem('autodin_token', token)
    localStorage.setItem('autodin_user', JSON.stringify(user))
    setIsAuthenticated(true)
    setUser(user)
    setIsAuthModalOpen(false)
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
        onDashboardClick={() => window.location.href = '/dashboard'}
        onHomeClick={() => window.location.href = '/'}
        currentPage="home"
      />
      
      <main>
        <Hero />
        <Services 
          services={config.services}
          isLoggedIn={isAuthenticated}
          onAuthRequired={() => handleAuthClick('login')}
          onServiceClick={(service) => {
            if (isAuthenticated) {
              if (service.title === 'Faire une demande') {
                window.location.href = '/demandes'
              } else {
                window.location.href = '/dashboard'
              }
            } else if (service.title === 'Outils de recherche') {
              window.location.href = '/search-tools'
            }
          }}
        />
        <Contact />
      </main>
      
      <Footer />
      
      <AutodinAuthModalNew
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onSuccess={handleAuthSuccess}
      />
    </div>
  )
}
