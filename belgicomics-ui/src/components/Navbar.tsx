import React, { useState } from 'react'
import { Container, Button } from '@qwanyx/ui'

interface NavbarProps {
  scrolled: boolean
  onLoginClick: () => void
  onRegisterClick: () => void
  isLoggedIn?: boolean
  onLogout?: () => void
}

const Navbar: React.FC<NavbarProps> = ({ scrolled, onLoginClick, onRegisterClick, isLoggedIn = false, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  return (
    <nav className={`belgicomics-navbar ${scrolled ? 'scrolled' : ''}`}>
      <Container>
        <div className="navbar-content">
          {/* Logo */}
          <div className="navbar-logo">
            <a href="/" className="navbar-logo-link">
              <img 
                src="/img/belgicomixlogo.png" 
                alt="Belgicomics" 
                className="navbar-logo-img"
              />
            </a>
          </div>
          
          {/* Desktop Menu */}
          <div className="navbar-desktop">
            <nav className="navbar-links">
              <a 
                href="#" 
                className="navbar-link"
                onClick={(e) => {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                Accueil
              </a>
              <a href="#services" className="navbar-link">
                Explorer
              </a>
              <a href="#contact" className="navbar-link">
                Contact
              </a>
            </nav>
            
            {/* Auth Button */}
            <div className="navbar-auth">
              {isLoggedIn ? (
                <Button 
                  variant="outline" 
                  size="md"
                  onClick={onLogout}
                  className="belgicomics-login-button"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Se déconnecter</span>
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="md"
                  onClick={onLoginClick}
                  className="belgicomics-login-button"
                >
                  <i className="fas fa-user"></i>
                  <span>Connexion</span>
                </Button>
              )}
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="navbar-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <i className={`fas fa-${mobileMenuOpen ? 'times' : 'bars'}`}></i>
          </button>
        </div>
        
        {/* Mobile Menu */}
        <div className={`navbar-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <nav className="navbar-mobile-nav">
            <a 
              href="#" 
              className="navbar-mobile-link"
              onClick={(e) => {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
                setMobileMenuOpen(false)
              }}
            >
              <i className="fas fa-home navbar-mobile-icon"></i>
              Accueil
            </a>
            <a 
              href="#services" 
              className="navbar-mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-search navbar-mobile-icon"></i>
              Explorer
            </a>
            <a 
              href="#contact" 
              className="navbar-mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-envelope navbar-mobile-icon"></i>
              Contact
            </a>
            
            <div className="navbar-mobile-divider">
              <Button 
                variant="outline" 
                size="md"
                onClick={() => {
                  onLoginClick()
                  setMobileMenuOpen(false)
                }}
                className="belgicomics-login-button navbar-mobile-button"
              >
                <i className="fas fa-user"></i>
                <span>Connexion</span>
              </Button>
            </div>
          </nav>
        </div>
      </Container>
      
      <style>{`
        .navbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
        }
        
        .navbar-logo {
          display: flex;
          align-items: center;
        }
        
        .navbar-logo-link {
          display: flex;
          align-items: center;
          text-decoration: none;
        }
        
        .navbar-logo-img {
          height: 40px;
          width: auto;
        }
        
        .navbar-desktop {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        
        .navbar-links {
          display: flex;
          gap: 1.5rem;
        }
        
        .navbar-link {
          color: var(--gray-700);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
        }
        
        .navbar-link:hover {
          color: var(--gray-900);
        }
        
        .navbar-auth {
          display: flex;
          gap: 0.5rem;
        }
        
        .navbar-mobile-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: var(--gray-700);
          cursor: pointer;
          padding: 0.5rem;
        }
        
        .navbar-mobile-menu {
          display: none;
          position: absolute;
          top: 60px;
          left: 0;
          right: 0;
          background: white;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          padding: 1rem;
          z-index: 999;
        }
        
        .navbar-mobile-menu.open {
          display: block;
        }
        
        .navbar-mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .navbar-mobile-link {
          color: var(--gray-700);
          text-decoration: none;
          font-weight: 500;
          padding: 0.75rem;
          border-radius: 0.25rem;
          transition: background 0.2s;
        }
        
        .navbar-mobile-link:hover {
          background: var(--gray-100);
        }
        
        .navbar-mobile-icon {
          margin-right: 0.75rem;
          width: 1rem;
          display: inline-block;
        }
        
        .navbar-mobile-divider {
          border-top: 1px solid var(--gray-300);
          margin-top: 0.5rem;
          padding-top: 1rem;
        }
        
        .navbar-mobile-button {
          width: 100%;
          justify-content: center;
        }
        
        /* Media Queries */
        @media (max-width: 768px) {
          .navbar-desktop {
            display: none !important;
          }
          .navbar-mobile-toggle {
            display: block !important;
          }
        }
        
        @media (min-width: 769px) {
          .navbar-mobile-menu {
            display: none !important;
          }
          .navbar-mobile-menu.open {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  )
}

export default Navbar