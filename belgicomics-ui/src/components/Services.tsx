import React from 'react'
import { Container, Card, CardContent } from '@qwanyx/ui'

interface Service {
  icon: string
  title: string
  description: string
  link: string
}

interface ServicesProps {
  services: Service[]
  isLoggedIn?: boolean
  onAuthRequired?: () => void
  onServiceClick?: (service: Service) => void
}

const Services: React.FC<ServicesProps> = ({ services, isLoggedIn = false, onAuthRequired, onServiceClick }) => {
  
  const handleCardClick = (service: Service) => {
    if (!isLoggedIn && onAuthRequired) {
      onAuthRequired()
    } else if (onServiceClick) {
      onServiceClick(service)
    }
  }
  return (
    <section id="services" className="belgicomics-section">
      <Container>
        <h2 style={{
          textAlign: 'center',
          fontSize: '2.5rem',
          marginBottom: '1rem',
          color: 'var(--gray-800)',
          fontWeight: 'bold'
        }}>
          Explorer
        </h2>
        
        <p style={{
          textAlign: 'center',
          fontSize: '1.1rem',
          color: 'var(--gray-600)',
          marginBottom: '3rem',
          maxWidth: '600px',
          margin: '0 auto 3rem'
        }}>
          Découvrez tout ce que Belgicomics peut vous offrir pour explorer 
          le monde fascinant de la bande dessinée belge
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {services.map((service, index) => (
            <div
              key={service.link}
              style={{
                opacity: 0,
                animation: `fadeInUp 0.6s ease forwards`,
                animationDelay: `${index * 100}ms`
              }}
            >
              <Card 
                hoverable
                className="belgicomics-service-card"
                style={{ 
                  height: '100%',
                  aspectRatio: '1 / 1',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer'
                }}
                onClick={() => handleCardClick(service)}
              >
                <CardContent style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  textAlign: 'center'
                }}>
                  <div className="belgicomics-service-icon">
                    <i className={`fas ${service.icon}`}></i>
                  </div>
                  
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    marginBottom: '0.75rem',
                    color: 'var(--gray-800)'
                  }}>
                    {service.title}
                  </h3>
                  
                  <p style={{
                    color: 'var(--gray-600)',
                    lineHeight: 1.6
                  }}>
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default Services