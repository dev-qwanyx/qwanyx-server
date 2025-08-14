import React, { useState } from 'react';
import { Navbar, NavbarBrand, NavbarMenu, NavbarItem, Button, Container } from '@qwanyx/ui';
import '@qwanyx/ui/dist/ui.css';

export interface NavbarQwanyxProps {
  logo?: string;
  logoAlt?: string;
  workspace?: string;
  links?: Array<{
    label: string;
    href: string;
    active?: boolean;
  }>;
  showAuth?: boolean;
  onAuthClick?: () => void;
  theme?: 'light' | 'dark';
}

const NavbarQwanyx: React.FC<NavbarQwanyxProps> = ({
  logo = '/qwanyx-logo.png',
  logoAlt = 'QWANYX',
  links = [],
  showAuth = true,
  onAuthClick
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAuthClick = () => {
    if (onAuthClick) {
      onAuthClick();
    }
  };

  return (
    <Navbar fixed bordered transparent={false}>
      <Container>
        <div className="navbar-content">
          <NavbarBrand>
            <img src={logo} alt={logoAlt} height="40" />
          </NavbarBrand>
          
          <NavbarMenu>
            {links.map((link, index) => (
              <NavbarItem key={index} active={link.active}>
                <a href={link.href}>{link.label}</a>
              </NavbarItem>
            ))}
          </NavbarMenu>

          {showAuth && (
            <div className="navbar-actions">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleAuthClick}
              >
                Se connecter
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={handleAuthClick}
              >
                S'inscrire
              </Button>
            </div>
          )}

          <button 
            className="navbar-burger"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="menu"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>
      </Container>
    </Navbar>
  );
};

export default NavbarQwanyx;