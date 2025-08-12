import React from 'react'
import { Container } from '@qwanyx/ui'

const Footer: React.FC = () => {
  return (
    <footer className="belgicomics-footer">
      <Container>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 1fr',
          gap: '4rem',
          alignItems: 'start',
          padding: '2rem 0'
        }}>
          {/* Left Column - Title and Description */}
          <div>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
              color: 'var(--gray-800)'
            }}>
              Belgicomics
            </h3>
            <p style={{
              color: 'var(--gray-600)',
              fontSize: '0.9rem',
              lineHeight: 1.5,
              marginBottom: '1rem'
            }}>
              Plateforme collaborative patrimoniale de la bande dessinée belge
            </p>
            
            {/* Contact Info */}
            <div style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
              <p style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center' }}>
                <i className="fas fa-map-marker-alt" style={{ 
                  marginRight: '0.5rem',
                  width: '1rem',
                  fontSize: '0.875rem'
                }}></i>
                Boulevard Anspach 111, 1000 Bruxelles
              </p>
              <p style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center' }}>
                <i className="fas fa-phone" style={{ 
                  marginRight: '0.5rem',
                  width: '1rem',
                  fontSize: '0.875rem'
                }}></i>
                +32 2 xxx xx xx
              </p>
              <p style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center' }}>
                <i className="fas fa-envelope" style={{ 
                  marginRight: '0.5rem',
                  width: '1rem',
                  fontSize: '0.875rem'
                }}></i>
                info@belgicomics.be
              </p>
            </div>
          </div>
          
          {/* Middle Column - Empty/Spacer */}
          <div></div>
          
          {/* Right Column - Links and Social */}
          <div>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              fontSize: '0.9rem'
            }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ display: 'flex', alignItems: 'center' }}>
                  <i className="fas fa-chevron-right" style={{ 
                    marginRight: '0.5rem',
                    fontSize: '0.7rem'
                  }}></i>
                  Conditions générales d'utilisation
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ display: 'flex', alignItems: 'center' }}>
                  <i className="fas fa-chevron-right" style={{ 
                    marginRight: '0.5rem',
                    fontSize: '0.7rem'
                  }}></i>
                  Politique de confidentialité (RGPD)
                </a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#" style={{ display: 'flex', alignItems: 'center' }}>
                  <i className="fas fa-chevron-right" style={{ 
                    marginRight: '0.5rem',
                    fontSize: '0.7rem'
                  }}></i>
                  Mentions légales
                </a>
              </li>
              <li style={{ marginBottom: '1rem' }}>
                <a href="#" style={{ display: 'flex', alignItems: 'center' }}>
                  <i className="fas fa-chevron-right" style={{ 
                    marginRight: '0.5rem',
                    fontSize: '0.7rem'
                  }}></i>
                  Contact
                </a>
              </li>
            </ul>
            
            {/* Social Media Icons */}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'flex-end'
            }}>
              <a href="#" style={{
                color: 'var(--gray-600)',
                fontSize: '1.2rem'
              }}>
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" style={{
                color: 'var(--gray-600)',
                fontSize: '1.2rem'
              }}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" style={{
                color: 'var(--gray-600)',
                fontSize: '1.2rem'
              }}>
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" style={{
                color: 'var(--gray-600)',
                fontSize: '1.2rem'
              }}>
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer