import React from 'react'
import { Container, Card, CardContent } from '@qwanyx/ui'
import { motion } from 'framer-motion'

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  }

  return (
    <section id="services" className="autodin-section">
      <Container>
        <motion.h2 
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{
          textAlign: 'center',
          fontSize: '2.5rem',
          marginBottom: '1rem',
          color: 'var(--gray-800)',
          fontWeight: 'bold'
        }}>
          Nos Services
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
          textAlign: 'center',
          fontSize: '1.1rem',
          color: 'var(--gray-600)',
          marginBottom: '3rem',
          maxWidth: '600px',
          margin: '0 auto 3rem'
        }}>
          Découvrez comment Autodin facilite votre recherche et vos transactions
        </motion.p>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {services.map((service, index) => (
            <motion.div
              key={service.link}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                hoverable
                className="autodin-service-card"
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
                  <div className="autodin-service-icon">
                    <i className={`fas ${service.icon}`}></i>
                  </div>
                  
                  <h3 className="title">
                    {service.title}
                  </h3>
                  
                  <p>
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}

export default Services