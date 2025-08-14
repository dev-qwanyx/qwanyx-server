import React from 'react'
import { Container, Card, CardContent, Button, Text } from '@qwanyx/ui'
import { motion } from 'framer-motion'

interface DashboardProps {
  currentUser: any
  onBack: () => void
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, onBack }) => {
  const dashboardItems = [
    {
      icon: 'fa-search',
      title: 'Recherche rapide',
      description: 'Trouvez des pièces parmi notre catalogue',
      color: 'var(--autodin-primary)',
      link: '/recherche'
    },
    {
      icon: 'fa-list',
      title: 'Mes annonces',
      description: 'Gérez vos annonces de pièces',
      color: '#3498db',
      link: '/mes-annonces'
    },
    {
      icon: 'fa-envelope',
      title: 'Messages',
      description: 'Consultez vos messages',
      color: '#9b59b6',
      link: '/messages'
    },
    {
      icon: 'fa-user',
      title: 'Mon profil',
      description: 'Modifiez vos informations',
      color: '#34495e',
      link: '/profil'
    },
    {
      icon: 'fa-car',
      title: 'Véhicules',
      description: 'Gérez vos véhicules',
      color: '#e74c3c',
      link: '/vehicules'
    },
    {
      icon: 'fa-chart-line',
      title: 'Statistiques',
      description: 'Suivez vos performances',
      color: '#2ecc71',
      link: '/stats'
    }
  ]

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--gray-100)',
      paddingTop: '80px'
    }}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            paddingTop: '2rem'
          }}>
            <div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'var(--autodin-dark)',
                marginBottom: '0.5rem'
              }}>
                Tableau de bord
              </h1>
              <Text style={{ color: 'var(--gray-600)' }}>
                Bienvenue, {currentUser?.firstName || currentUser?.email || 'Utilisateur'} !
              </Text>
            </div>
            <Button
              variant="ghost"
              onClick={onBack}
              style={{ color: 'var(--autodin-primary)' }}
            >
              <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
              Retour au site
            </Button>
          </div>

          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            <Card style={{ 
              background: 'white',
              borderLeft: '4px solid var(--autodin-primary)'
            }}>
              <CardContent style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Text style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--autodin-primary)' }}>
                      0
                    </Text>
                    <Text style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                      Annonces actives
                    </Text>
                  </div>
                  <i className="fas fa-clipboard-list" style={{ fontSize: '2rem', color: 'var(--gray-400)' }}></i>
                </div>
              </CardContent>
            </Card>

            <Card style={{ 
              background: 'white',
              borderLeft: '4px solid #3498db'
            }}>
              <CardContent style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Text style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3498db' }}>
                      0
                    </Text>
                    <Text style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                      Messages non lus
                    </Text>
                  </div>
                  <i className="fas fa-envelope" style={{ fontSize: '2rem', color: 'var(--gray-400)' }}></i>
                </div>
              </CardContent>
            </Card>

            <Card style={{ 
              background: 'white',
              borderLeft: '4px solid #2ecc71'
            }}>
              <CardContent style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Text style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2ecc71' }}>
                      0
                    </Text>
                    <Text style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                      Vues cette semaine
                    </Text>
                  </div>
                  <i className="fas fa-eye" style={{ fontSize: '2rem', color: 'var(--gray-400)' }}></i>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'var(--autodin-dark)',
            marginBottom: '1.5rem'
          }}>
            Actions rapides
          </h2>

          <motion.div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem'
            }}
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {dashboardItems.map((item, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.3 }
                  }
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  hoverable
                  style={{ 
                    background: 'white',
                    cursor: 'pointer',
                    height: '100%'
                  }}
                >
                  <CardContent style={{
                    padding: '2rem',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      margin: '0 auto 1rem',
                      background: item.color,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className={`fas ${item.icon}`} style={{ 
                        fontSize: '1.5rem',
                        color: 'white'
                      }}></i>
                    </div>
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: 'var(--autodin-dark)',
                      marginBottom: '0.5rem'
                    }}>
                      {item.title}
                    </h3>
                    <Text style={{
                      color: 'var(--gray-600)',
                      fontSize: '0.875rem'
                    }}>
                      {item.description}
                    </Text>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </div>
  )
}

export default Dashboard