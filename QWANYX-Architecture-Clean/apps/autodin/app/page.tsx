'use client'

import React, { useState, useEffect } from 'react'
import { 
  Container,
  Button,
  Navbar,
  NavbarBrand,
  NavbarLogo,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  MaterialIcon
} from '@qwanyx/ui'

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentPage] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavigation = (e: React.MouseEvent, target: string) => {
    e.preventDefault()
    if (target === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const element = document.getElementById(target)
      element?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleAuth = () => {
    // Will be implemented with auth modal
    console.log('Auth clicked')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  const handleDashboard = () => {
    // Navigate to dashboard
    console.log('Dashboard clicked')
  }

  return (
    <>
      <Navbar 
        fixed={true} 
        className={`autodin-navbar ${scrolled ? 'scrolled' : ''}`}
      >
        <Container>
          <div className="navbar-wrapper">
            {/* Brand/Logo */}
            <NavbarBrand>
              <a href="/" className="navbar-logo-link">
                <NavbarLogo 
                  src="/logo.svg" 
                  alt="Autodin Logo" 
                  size="md"
                />
              </a>
            </NavbarBrand>

            {/* Desktop Navigation */}
            <NavbarContent align="center" className="navbar-desktop">
              <NavbarItem 
                as="a"
                href="#"
                onClick={(e) => handleNavigation(e, 'home')}
                active={currentPage === 'home'}
              >
                Accueil
              </NavbarItem>
              <NavbarItem 
                as="a"
                href="#services"
                onClick={(e) => handleNavigation(e, 'services')}
              >
                Services
              </NavbarItem>
              <NavbarItem 
                as="a"
                href="#contact"
                onClick={(e) => handleNavigation(e, 'contact')}
              >
                Contact
              </NavbarItem>
              {isLoggedIn && (
                <NavbarItem 
                  as="a"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    handleDashboard()
                  }}
                  className="navbar-item-dashboard"
                >
                  <MaterialIcon icon="Dashboard" size="sm" />
                  <span>Tableau de bord</span>
                </NavbarItem>
              )}
            </NavbarContent>

            {/* Desktop Auth Button */}
            <NavbarContent align="right" className="navbar-auth-desktop">
              {isLoggedIn ? (
                <Button 
                  variant="ghost" 
                  size="md"
                  onClick={handleLogout}
                  className="autodin-button-logout"
                >
                  <MaterialIcon icon="Logout" size="sm" />
                  <span>Déconnexion</span>
                </Button>
              ) : (
                <Button 
                  variant="solid" 
                  size="md"
                  onClick={handleAuth}
                  className="autodin-button-primary"
                >
                  <MaterialIcon icon="Person" size="sm" />
                  <span>Connexion</span>
                </Button>
              )}
            </NavbarContent>

            {/* Mobile Menu Toggle */}
            <button
              className="navbar-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <MaterialIcon 
                name={mobileMenuOpen ? "Close" : "Menu"} 
                size="md"
              />
            </button>
          </div>
        </Container>

        {/* Mobile Menu */}
        <NavbarMenu mobile open={mobileMenuOpen}>
          <Container>
            <div className="navbar-mobile-nav">
              <NavbarItem 
                as="a"
                href="#"
                onClick={(e) => {
                  handleNavigation(e, 'home')
                  setMobileMenuOpen(false)
                }}
                className="navbar-mobile-item"
              >
                <MaterialIcon icon="Home" size="sm" />
                <span>Accueil</span>
              </NavbarItem>
              <NavbarItem 
                as="a"
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="navbar-mobile-item"
              >
                <MaterialIcon icon="Build" size="sm" />
                <span>Services</span>
              </NavbarItem>
              <NavbarItem 
                as="a"
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="navbar-mobile-item"
              >
                <MaterialIcon icon="Email" size="sm" />
                <span>Contact</span>
              </NavbarItem>
              
              {isLoggedIn && (
                <NavbarItem 
                  as="a"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    handleDashboard()
                    setMobileMenuOpen(false)
                  }}
                  className="navbar-mobile-item navbar-item-dashboard"
                >
                  <MaterialIcon icon="Dashboard" size="sm" />
                  <span>Tableau de bord</span>
                </NavbarItem>
              )}
              
              <div className="navbar-mobile-divider">
                {isLoggedIn ? (
                  <Button 
                    variant="ghost" 
                    size="md"
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="navbar-mobile-button autodin-button-logout"
                  >
                    <MaterialIcon icon="Logout" size="sm" />
                    <span>Déconnexion</span>
                  </Button>
                ) : (
                  <Button 
                    variant="solid" 
                    size="md"
                    onClick={() => {
                      handleAuth()
                      setMobileMenuOpen(false)
                    }}
                    className="navbar-mobile-button autodin-button-primary"
                  >
                    <MaterialIcon icon="Person" size="sm" />
                    <span>Connexion</span>
                  </Button>
                )}
              </div>
            </div>
          </Container>
        </NavbarMenu>
      </Navbar>

      {/* Main Content */}
      <main className="main-content">
        <Container>
          <div id="home" className="hero-section">
            <h1>Bienvenue sur Autodin</h1>
            <p>Votre marketplace de pièces automobiles</p>
          </div>
          
          <div id="services" className="services-section">
            <h2>Nos Services</h2>
            <p>Découvrez nos services</p>
          </div>
          
          <div id="contact" className="contact-section">
            <h2>Contact</h2>
            <p>Contactez-nous</p>
          </div>
        </Container>
      </main>
    </>
  )
}