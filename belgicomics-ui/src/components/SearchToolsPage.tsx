import React from 'react'
import { Container, Button } from '@qwanyx/ui'

interface SearchToolsPageProps {
  onBack: () => void
}

const SearchToolsPage: React.FC<SearchToolsPageProps> = ({ onBack }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--gray-100)',
      paddingTop: '80px'
    }}>
      <Container>
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <div style={{
            fontSize: '5rem',
            marginBottom: '2rem',
            opacity: 0.3
          }}>
            <i className="fas fa-tools"></i>
          </div>
          
          <h1 style={{
            fontSize: '2.5rem',
            color: 'var(--gray-800)',
            marginBottom: '1rem',
            fontWeight: 'bold'
          }}>
            Page en construction
          </h1>
          
          <p style={{
            fontSize: '1.2rem',
            color: 'var(--gray-600)',
            marginBottom: '2rem',
            lineHeight: 1.6
          }}>
            Les outils de recherche avancés seront bientôt disponibles. 
            Nous travaillons dur pour vous offrir la meilleure expérience 
            de recherche dans notre collection de BD belges.
          </p>
          
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              color: 'var(--gray-700)',
              marginBottom: '1rem'
            }}>
              Fonctionnalités à venir :
            </h3>
            <ul style={{
              textAlign: 'left',
              color: 'var(--gray-600)',
              lineHeight: 2,
              listStyle: 'none',
              padding: 0
            }}>
              <li><i className="fas fa-check" style={{ color: 'var(--gray-400)', marginRight: '0.5rem' }}></i> Recherche par auteur</li>
              <li><i className="fas fa-check" style={{ color: 'var(--gray-400)', marginRight: '0.5rem' }}></i> Recherche par année</li>
              <li><i className="fas fa-check" style={{ color: 'var(--gray-400)', marginRight: '0.5rem' }}></i> Recherche par personnage</li>
              <li><i className="fas fa-check" style={{ color: 'var(--gray-400)', marginRight: '0.5rem' }}></i> Filtres avancés</li>
              <li><i className="fas fa-check" style={{ color: 'var(--gray-400)', marginRight: '0.5rem' }}></i> Sauvegarde des recherches</li>
            </ul>
          </div>
          
          <Button
            size="lg"
            onClick={onBack}
            style={{
              background: 'var(--gray-700)',
              color: 'white',
              padding: '0.75rem 2rem'
            }}
          >
            <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
            Retour à l'accueil
          </Button>
        </div>
      </Container>
    </div>
  )
}

export default SearchToolsPage