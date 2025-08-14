import React from 'react';
import { Container, Card, CardContent, Text, Heading } from '@qwanyx/ui';

export interface DashboardAutodinProps {
  currentUser?: any;
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

const DashboardAutodin: React.FC<DashboardAutodinProps> = ({ 
  currentUser, 
  onNavigate
}) => {
  const dashboardItems = [
    {
      icon: 'fa-search',
      title: 'Recherche rapide',
      description: 'Trouvez des pièces parmi notre catalogue',
      color: 'var(--autodin-primary)',
      link: '/recherche'
    },
    {
      icon: 'fa-bullhorn',
      title: 'Demandes',
      description: 'Diffusez vos demandes de pièces chez nos partenaires',
      color: 'var(--qwanyx-info)',
      link: '/demandes'
    },
    {
      icon: 'fa-envelope',
      title: 'Messages',
      description: 'Consultez vos messages',
      color: 'var(--qwanyx-accent)',
      link: '/messages'
    },
    {
      icon: 'fa-user',
      title: 'Mon profil',
      description: 'Modifiez vos informations',
      color: 'var(--autodin-dark)',
      link: '/profil'
    },
    {
      icon: 'fa-car',
      title: 'Véhicules',
      description: 'Gérez vos véhicules',
      color: 'var(--qwanyx-error)',
      link: '/vehicules'
    },
    {
      icon: 'fa-chart-line',
      title: 'Statistiques',
      description: 'Suivez vos performances',
      color: 'var(--qwanyx-success)',
      link: '/stats'
    }
  ];

  const stats = [
    { label: 'Demandes actives', value: '12', icon: 'fa-bullhorn', color: 'var(--qwanyx-info)' },
    { label: 'Messages non lus', value: '3', icon: 'fa-envelope', color: 'var(--qwanyx-accent)' },
    { label: 'Vues cette semaine', value: '234', icon: 'fa-eye', color: 'var(--qwanyx-success)' },
    { label: 'Favoris', value: '18', icon: 'fa-heart', color: 'var(--qwanyx-error)' }
  ];

  return (
    <div>
      <Container>
        {/* Breadcrumb */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          paddingTop: '1.5rem',
          paddingBottom: '1rem',
          fontSize: '1.035rem',
          color: 'var(--gray-600)'
        }}>
          <a 
            href="#"
            onClick={(e) => {
              e.preventDefault()
              window.location.href = '/'
            }}
            style={{
              color: 'var(--autodin-primary)',
              textDecoration: 'none'
            }}
          >
            <i className="fas fa-home" style={{ marginRight: '0.25rem' }}></i>
            Accueil
          </a>
          <i className="fas fa-chevron-right" style={{ fontSize: '0.75rem' }}></i>
          <span style={{ color: 'var(--gray-700)', fontWeight: '500' }}>
            Tableau de bord
          </span>
        </div>

        {/* Header */}
        <div style={{
          marginBottom: '2rem'
        }}>
          <Heading as="h1" style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'var(--autodin-dark)',
            marginBottom: '0.5rem'
          }}>
            Tableau de bord
          </Heading>
          <Text style={{ color: 'var(--gray-600)' }}>
            Bienvenue, {currentUser?.firstName || currentUser?.email || 'Utilisateur'} !
          </Text>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {stats.map((stat, index) => (
            <Card key={index} style={{ 
              background: 'var(--qwanyx-card)',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <CardContent style={{ 
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <Text style={{ 
                    color: 'var(--gray-600)',
                    fontSize: '0.875rem',
                    marginBottom: '0.5rem'
                  }}>
                    {stat.label}
                  </Text>
                  <Text style={{ 
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: 'var(--autodin-dark)'
                  }}>
                    {stat.value}
                  </Text>
                </div>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '10px',
                  backgroundColor: `${stat.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className={`fas ${stat.icon}`} style={{ 
                    fontSize: '1.25rem',
                    color: stat.color
                  }}></i>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dashboard Items Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {dashboardItems.map((item, index) => (
            <Card 
              key={index}
              hoverable
              className="autodin-dashboard-card"
              onClick={() => {
                console.log('Card clicked:', item.link);
                if (item.link === '/demandes' && onNavigate) {
                  console.log('Navigating to demandes...');
                  onNavigate('demandes');
                } else if (onNavigate) {
                  // Pour les autres cartes, on pourrait naviguer aussi
                  const pageName = item.link.replace('/', '');
                  console.log('Would navigate to:', pageName);
                }
              }}
              style={{ 
                cursor: 'pointer',
                backgroundColor: 'var(--autodin-dark)',
                border: 'none',
                borderRadius: '0.5rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                aspectRatio: '1 / 1'
              }}
            >
              <CardContent style={{ 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                textAlign: 'center',
                padding: '2rem'
              }}>
                <div style={{
                  fontSize: '3rem',
                  color: 'var(--autodin-primary)',
                  marginBottom: '1rem'
                }}>
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <h3 style={{
                  color: 'rgba(255, 255, 255, 0.95)',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.75rem'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '0.95rem',
                  lineHeight: '1.5'
                }}>
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default DashboardAutodin;