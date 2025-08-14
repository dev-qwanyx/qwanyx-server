import React from 'react';
import { Hero, Container, Button, Text, Heading } from '@qwanyx/ui';
// CSS imported by host app

const HeroAutodin: React.FC = () => {
  return (
    <Hero 
      style={{
        background: 'linear-gradient(135deg, rgba(230, 126, 34, 0.9) 0%, rgba(44, 62, 80, 0.95) 100%), url("/assets/img/autodinpictures/elena-mozhvilo-Unsplash.jpg") center/cover',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      <Container>
        <div style={{ 
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
          color: 'white',
          padding: '2rem 0'
        }}>
          <Heading 
            as="h1" 
            style={{ 
              fontSize: '3.5rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            Votre marketplace de pièces détachées automobiles
          </Heading>
          
          <Text 
            size="xl" 
            style={{ 
              marginBottom: '2rem',
              opacity: 0.95
            }}
          >
            Trouvez facilement les pièces dont vous avez besoin parmi des milliers d'annonces. 
            Vendez vos pièces à des acheteurs qualifiés.
          </Text>
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Button
              variant="primary"
              size="lg"
              style={{
                backgroundColor: 'var(--autodin-primary)',
                borderColor: 'var(--autodin-primary)',
                padding: '1rem 2rem',
                fontSize: '1.1rem'
              }}
            >
              <i className="fas fa-search" style={{ marginRight: '0.5rem' }}></i>
              Rechercher une pièce
            </Button>
            
            <Button
              variant="ghost"
              size="lg"
              style={{
                color: 'white',
                borderColor: 'white',
                padding: '1rem 2rem',
                fontSize: '1.1rem'
              }}
            >
              <i className="fas fa-plus" style={{ marginRight: '0.5rem' }}></i>
              Déposer une annonce
            </Button>
          </div>
          
          <div style={{ 
            marginTop: '4rem',
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: '2rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>10K+</Text>
              <Text style={{ opacity: 0.9 }}>Annonces actives</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>5K+</Text>
              <Text style={{ opacity: 0.9 }}>Utilisateurs</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>98%</Text>
              <Text style={{ opacity: 0.9 }}>Satisfaction</Text>
            </div>
          </div>
        </div>
      </Container>
    </Hero>
  );
};

export default HeroAutodin;