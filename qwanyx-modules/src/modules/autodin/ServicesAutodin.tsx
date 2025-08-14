import React from 'react';
import { Container, Card, CardContent, Text, Heading, Button } from '@qwanyx/ui';
// CSS imported by host app

export interface Service {
  icon: string;
  title: string;
  description: string;
  link: string;
  requireAuth?: boolean;
}

export interface ServicesAutodinProps {
  services: Service[];
  isLoggedIn?: boolean;
  onAuthRequired?: () => void;
  onServiceClick?: (service: Service) => void;
}

const ServicesAutodin: React.FC<ServicesAutodinProps> = ({
  services,
  isLoggedIn = false,
  onAuthRequired,
  onServiceClick
}) => {
  const handleServiceClick = (service: Service) => {
    if (service.requireAuth && !isLoggedIn) {
      onAuthRequired?.();
    } else {
      onServiceClick?.(service);
    }
  };

  return (
    <section id="services" style={{ 
      padding: '5rem 0',
      backgroundColor: 'var(--gray-100)'
    }}>
      <Container>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Heading as="h2" style={{ 
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'var(--autodin-dark)',
            marginBottom: '1rem'
          }}>
            Nos Services
          </Heading>
          <Text size="lg" style={{ color: 'var(--gray-600)' }}>
            Découvrez toutes les fonctionnalités d'Autodin
          </Text>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {services.map((service, index) => (
            <Card 
              key={index}
              hoverable
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                height: '100%'
              }}
              onClick={() => handleServiceClick(service)}
            >
              <CardContent style={{ 
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(230, 126, 34, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <i 
                    className={`fas ${service.icon}`} 
                    style={{ 
                      fontSize: '1.5rem',
                      color: 'var(--autodin-primary)'
                    }}
                  ></i>
                </div>

                <Heading as="h3" style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: 'var(--autodin-dark)',
                  marginBottom: '0.75rem'
                }}>
                  {service.title}
                </Heading>

                <Text style={{
                  color: 'var(--gray-600)',
                  marginBottom: '1.5rem',
                  flex: 1
                }}>
                  {service.description}
                </Text>

                <Button
                  variant="ghost"
                  size="sm"
                  style={{
                    color: 'var(--autodin-primary)',
                    borderColor: 'var(--autodin-primary)',
                    alignSelf: 'flex-start'
                  }}
                >
                  {service.requireAuth && !isLoggedIn ? (
                    <>
                      <i className="fas fa-lock" style={{ marginRight: '0.5rem' }}></i>
                      Connexion requise
                    </>
                  ) : (
                    <>
                      En savoir plus
                      <i className="fas fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ServicesAutodin;