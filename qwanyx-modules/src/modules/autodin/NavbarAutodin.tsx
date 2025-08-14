import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Button, 
  ThemeToggle,
  Navbar,
  NavbarBrand,
  NavbarLogo,
  NavbarItem,
  NavbarMenu,
  Flex
} from '@qwanyx/ui';
import { useAuth } from '../../hooks/useAuth';
import AuthAutodin from './AuthAutodin';
// CSS imported by host app

export interface NavbarAutodinProps {
  scrolled?: boolean;
  onDashboardClick?: () => void;
  workspace?: string;
}

const NavbarAutodin: React.FC<NavbarAutodinProps> = ({ 
  scrolled, 
  onDashboardClick,
  workspace = 'autodin-be'
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Try to use auth context if available
  let authContext: any = null;
  try {
    authContext = useAuth();
  } catch (e) {
    // AuthProvider not available, will check localStorage
  }
  
  // Check auth status on mount and when auth context changes
  useEffect(() => {
    if (authContext) {
      setIsAuthenticated(authContext.isAuthenticated);
    } else {
      // Fallback to checking localStorage directly
      const token = localStorage.getItem(`${workspace}_token`);
      const expiryStr = localStorage.getItem(`${workspace}_token_expiry`);
      if (token && expiryStr) {
        const expiry = parseInt(expiryStr, 10);
        setIsAuthenticated(Date.now() < expiry);
      }
    }
  }, [authContext?.isAuthenticated, authContext?.user, workspace]);
  
  // Listen for auth events
  useEffect(() => {
    const handleLogin = (event: CustomEvent) => {
      if (event.detail.workspace === workspace) {
        setIsAuthenticated(true);
      }
    };
    
    const handleLogout = () => {
      setIsAuthenticated(false);
    };
    
    window.addEventListener('auth:login', handleLogin as any);
    window.addEventListener('auth:logout', handleLogout);
    
    return () => {
      window.removeEventListener('auth:login', handleLogin as any);
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [workspace]);
  
  const handleLogout = () => {
    if (authContext) {
      authContext.logout();
    } else {
      // Clear localStorage manually
      localStorage.removeItem(`${workspace}_token`);
      localStorage.removeItem(`${workspace}_user`);
      localStorage.removeItem(`${workspace}_token_expiry`);
      sessionStorage.removeItem(`${workspace}_token`);
      sessionStorage.removeItem(`${workspace}_user`);
      
      // Emit event
      window.dispatchEvent(new CustomEvent('auth:logout'));
      
      setIsAuthenticated(false);
    }
  };
  
  const handleAuthSuccess = (_user: any, _token?: string) => {
    setShowAuthModal(false);
    setIsAuthenticated(true);
  };
  
  return (
    <Navbar fixed bordered className={scrolled ? 'scrolled' : ''}>
      <Container>
        <Flex justify="between" align="center" style={{ height: '60px' }}>
          {/* Logo and Navigation */}
          <Flex align="center" gap="xl">
            <NavbarBrand>
              <a href="/">
                <NavbarLogo 
                  src="/assets/img/logo.png" 
                  alt="Autodin Logo" 
                  size="md"
                />
              </a>
            </NavbarBrand>
            
            {/* Desktop Navigation */}
            <NavbarMenu>
              <NavbarItem 
                as="a"
                href="#top" 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Accueil
              </NavbarItem>
              <NavbarItem 
                as="a"
                href="#services"
              >
                Services
              </NavbarItem>
              <NavbarItem 
                as="a"
                href="#contact"
              >
                Contact
              </NavbarItem>
              {isAuthenticated && (
                <NavbarItem 
                  as="button"
                  onClick={() => onDashboardClick?.()}
                  active
                >
                  <i className="fas fa-tachometer-alt" style={{ marginRight: '0.5rem' }}></i>
                  Tableau de bord
                </NavbarItem>
              )}
            </NavbarMenu>
          </Flex>
          
          {/* Auth Button and Theme Toggle */}
          <Flex align="center" gap="md">
            <ThemeToggle variant="icon" />
            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                size="md"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt" style={{ marginRight: '0.5rem' }}></i>
                <span>Déconnexion</span>
              </Button>
            ) : (
              <Button 
                variant="validate"
                color="primary"
                size="md"
                onClick={() => setShowAuthModal(true)}
              >
                <i className="fas fa-user" style={{ marginRight: '0.5rem' }}></i>
                <span>S'identifier</span>
              </Button>
            )}
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="md"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <i className={`fas fa-${mobileMenuOpen ? 'times' : 'bars'}`}></i>
            </Button>
          </Flex>
        </Flex>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <NavbarMenu mobile>
            <NavbarItem 
              as="a"
              href="#top" 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
            >
              <i className="fas fa-home" style={{ marginRight: '0.5rem' }}></i>
              Accueil
            </NavbarItem>
            <NavbarItem 
              as="a"
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-cogs" style={{ marginRight: '0.5rem' }}></i>
              Services
            </NavbarItem>
            <NavbarItem 
              as="a"
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-envelope" style={{ marginRight: '0.5rem' }}></i>
              Contact
            </NavbarItem>
            
            {isAuthenticated && (
              <NavbarItem 
                as="button"
                onClick={() => {
                  onDashboardClick?.();
                  setMobileMenuOpen(false);
                }}
                active
              >
                <i className="fas fa-tachometer-alt" style={{ marginRight: '0.5rem' }}></i>
                Tableau de bord
              </NavbarItem>
            )}
            
            <Flex direction="col" gap="sm" style={{ paddingTop: '1rem' }}>
              {isAuthenticated ? (
                <Button 
                  variant="ghost" 
                  size="md"
                  fullWidth
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <i className="fas fa-sign-out-alt" style={{ marginRight: '0.5rem' }}></i>
                  <span>Déconnexion</span>
                </Button>
              ) : (
                <Button 
                  variant="validate"
                  color="primary"
                  size="md"
                  fullWidth
                  onClick={() => {
                    setShowAuthModal(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  <i className="fas fa-user" style={{ marginRight: '0.5rem' }}></i>
                  <span>S'identifier</span>
                </Button>
              )}
            </Flex>
          </NavbarMenu>
        )}
      </Container>
      
      {/* Auth Modal */}
      <AuthAutodin
        workspace={workspace}
        asModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        initialMode="login"
      />
    </Navbar>
  );
};

export default NavbarAutodin;