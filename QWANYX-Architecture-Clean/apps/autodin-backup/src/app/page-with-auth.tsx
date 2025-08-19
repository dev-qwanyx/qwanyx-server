'use client'

import { useState, useEffect } from 'react'
import { ThemeProvider, WorkspaceProvider } from '@qwanyx/ui'
import { AuthModule, AuthProvider } from '@qwanyx/auth'
import { 
  Container, 
  Section, 
  Heading, 
  Text, 
  Button,
  SimpleNavbar,
  ServiceCard,
  Grid,
  HeroWithFlipSection,
  SimpleFooterSection,
  ContactFormSection,
  detailedContactFields
} from '@qwanyx/ui'

function AppContent() {
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'about' | 'services'>('home')
  const [activeSection, setActiveSection] = useState<string>('details')
  const [user, setUser] = useState<any>(null)
  const [showAuth, setShowAuth] = useState(false)
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const navbarHeight = 95
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - navbarHeight
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }
  
  const handleAuthSuccess = (user: any, token?: string) => {
    setUser(user)
    setShowAuth(false)
    localStorage.setItem('user', JSON.stringify(user))
    if (token) {
      localStorage.setItem('token', token)
    }
    window.location.href = '/dashboard'
  }
  
  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('autodin_token')
    localStorage.removeItem('autodin_user')
    sessionStorage.removeItem('autodin_token')
    sessionStorage.removeItem('autodin_user')
  }
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user') || 
                      localStorage.getItem('autodin_user') || 
                      sessionStorage.getItem('autodin_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Failed to parse stored user')
      }
    }
  }, [])
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'rgb(var(--background))' }}>
      <SimpleNavbar
        title="Autodin"
        subtitle="Marketplace"
        fixed={true}
        actions={
          user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Text style={{ color: 'rgb(var(--qwanyx-text-secondary))' }}>
                {user.email}
              </Text>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                Se déconnecter
              </Button>
            </div>
          ) : (
            <AuthModule
              workspace="autodin"
              apiUrl="http://localhost:5002"
              locale="fr"
              asButton
              buttonText={{ login: "S'identifier" }}
              onSuccess={handleAuthSuccess}
              primaryColor="#E67E22"
              initialMode="login"
              passwordless={true}
            />
          )
        }
        items={[
          {
            label: 'Accueil',
            active: activeSection === 'details',
            onClick: () => {
              setCurrentView('home')
              setActiveSection('details')
              setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
            }
          },
          {
            label: 'Services',
            active: activeSection === 'services',
            onClick: () => {
              setCurrentView('home')
              setActiveSection('services')
              setTimeout(() => scrollToSection('services'), 100)
            }
          },
          {
            label: 'Contact',
            active: activeSection === 'contact',
            onClick: () => {
              setCurrentView('home')
              setActiveSection('contact')
              setTimeout(() => scrollToSection('contact'), 100)
            }
          },
          ...(user ? [{
            label: 'Tableau de bord',
            active: false,
            onClick: () => {
              window.location.href = '/dashboard'
            }
          }] : [])
        ]}
      />
      
      <main>
        {currentView === 'home' && (
          <>
            <HeroWithFlipSection
              title="La Marketplace #1 des Pièces Auto"
              subtitle="Autodin Belgium"
              description="Achetez et vendez des pièces auto d'occasion en Belgique. Économisez jusqu'à 70% sur vos pièces."
              images={[
                '/assets/img/autodinpictures/hero1.jpg',
                '/assets/img/autodinpictures/hero2.jpg',
                '/assets/img/autodinpictures/hero3.jpg',
                '/assets/img/autodinpictures/hero4.jpg'
              ]}
              primaryAction={{
                label: 'Rechercher des pièces',
                onClick: () => scrollToSection('services')
              }}
              secondaryAction={{
                label: 'Vendre mes pièces',
                onClick: () => setShowAuth(true)
              }}
              flipInterval={3000}
              flipPosition="right"
              flipSize="md"
              backgroundImage="/assets/img/autodinpictures/hero-bg.jpg"
              overlayOpacity={0.7}
            />
            
            <Container>
              <div id="services"></div>
              <Section spacing="2xl" gap="xl">
                <Heading as="h2" size="5xl" align="center" style={{ color: '#E67E22' }}>
                  Nos Services
                </Heading>
                <Grid columns={3} gap="xl">
                  <ServiceCard
                    icon="search"
                    title="Recherche Avancée"
                    description="Trouvez exactement la pièce dont vous avez besoin parmi des milliers d'annonces"
                    iconColor="#E67E22"
                  />
                  <ServiceCard
                    icon="directions_car"
                    title="Toutes Marques"
                    description="Pièces pour toutes les marques de véhicules : BMW, Mercedes, Audi, Volkswagen..."
                    iconColor="#E67E22"
                  />
                  <ServiceCard
                    icon="verified"
                    title="Qualité Garantie"
                    description="Toutes nos pièces sont vérifiées et contrôlées avant la mise en vente"
                    iconColor="#E67E22"
                  />
                  <ServiceCard
                    icon="local_shipping"
                    title="Livraison Rapide"
                    description="Livraison dans toute la Belgique en 24-48h avec suivi en temps réel"
                    iconColor="#E67E22"
                  />
                  <ServiceCard
                    icon="savings"
                    title="Meilleurs Prix"
                    description="Économisez jusqu'à 70% par rapport aux pièces neuves"
                    iconColor="#E67E22"
                  />
                  <ServiceCard
                    icon="security"
                    title="Paiement Sécurisé"
                    description="Transactions sécurisées avec protection acheteur et vendeur"
                    iconColor="#E67E22"
                  />
                </Grid>
              </Section>
            </Container>
            
            <div id="contact">
              <ContactFormSection
                title="Contactez-nous"
                subtitle="Une question ? Besoin d'aide ? Notre équipe est là pour vous"
                fields={detailedContactFields}
                backgroundImage="/assets/img/autodinpictures/contact-bg.jpg"
                overlayOpacity={0.8}
                parallax="normal"
                onSubmit={async (data) => {
                  console.log('Form submitted:', data)
                  alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.')
                }}
                submitText="Envoyer le message"
              />
            </div>
          </>
        )}
        
        {currentView === 'about' && (
          <Container>
            <Section spacing="xl" style={{ paddingTop: '5rem' }}>
              <Heading as="h2" size="3xl" style={{ marginBottom: '1rem', color: '#E67E22' }}>
                À propos d'Autodin
              </Heading>
              <Text size="lg">
                Autodin est la première marketplace belge dédiée aux pièces auto d'occasion.
                Notre mission est de rendre l'entretien automobile plus accessible et écologique.
              </Text>
            </Section>
          </Container>
        )}
        
        {currentView === 'services' && (
          <Container>
            <Section spacing="xl" style={{ paddingTop: '5rem' }}>
              <Heading as="h2" size="3xl" style={{ marginBottom: '1rem', color: '#E67E22' }}>
                Services détaillés
              </Heading>
              <Text size="lg">
                Découvrez l'ensemble de nos services pour acheter et vendre des pièces auto.
              </Text>
            </Section>
          </Container>
        )}
      </main>
      
      <SimpleFooterSection
        title="Autodin"
        description="La marketplace #1 des pièces auto d'occasion en Belgique"
        address={{
          street: "Rue de l'Automobile 42",
          city: "1000 Bruxelles",
          country: "Belgique"
        }}
        phone="+32 2 123 45 67"
        email="contact@autodin.be"
        links={[
          { label: "Conditions générales", href: "#" },
          { label: "Politique de confidentialité", href: "#" },
          { label: "Mentions légales", href: "#" },
          { label: "Contact", href: "#contact" }
        ]}
        socials={[
          { icon: "Facebook", href: "#", label: "Facebook" },
          { icon: "Twitter", href: "#", label: "Twitter" },
          { icon: "LinkedIn", href: "#", label: "LinkedIn" },
          { icon: "Instagram", href: "#", label: "Instagram" }
        ]}
        copyright="© 2024 Autodin. Tous droits réservés."
        style={{ backgroundColor: '#2C3E50', color: '#ffffff' }}
      />
      
    </div>
  )
}

export default function App() {
  return (
    <WorkspaceProvider defaultWorkspace="autodin">
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </WorkspaceProvider>
  )
}