'use client'

import { useState } from 'react'
import { ThemeProvider, WorkspaceProvider } from '@qwanyx/ui'
import { 
  Container, 
  Section, 
  Heading, 
  Text, 
  Button,
  SuperNavbar,
  ServiceCard,
  Grid,
  HeroWithFlipSection,
  SimpleFooterSection,
  ContactFormSection,
  detailedContactFields
} from '@qwanyx/ui'

function AppContent() {
  const [activeSection, setActiveSection] = useState<string>('details')
  
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
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'rgb(var(--background))' }}>
      <SuperNavbar
        logo="/images/logo.png"
        title="Autodin"
        subtitle="La Marketplace #1 des Pièces Auto"
        position="sticky"
        transparent={true}
        blur={true}
        elevated={true}
        search={true}
        searchPlaceholder="Rechercher des pièces..."
        items={[
          { 
            label: 'Accueil',
            onClick: () => {
              setActiveSection('details')
              setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
            }
          },
          { 
            label: 'Services',
            onClick: () => {
              setActiveSection('services')
              setTimeout(() => scrollToSection('services'), 100)
            }
          },
          { 
            label: 'Contact',
            onClick: () => {
              setActiveSection('contact')
              setTimeout(() => scrollToSection('contact'), 100)
            }
          }
        ]}
        primaryAction={{
          label: 'Se connecter',
          onClick: () => console.log('Login'),
          icon: 'login'
        }}
      />
      
      <main>
        <HeroWithFlipSection
          title="La Marketplace #1 des Pièces Auto"
          subtitle="Autodin Belgium"
          description="Achetez et vendez des pièces auto d'occasion en Belgique. Économisez jusqu'à 70% sur vos pièces."
          images={[
            'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=500&fit=crop'
          ]}
          primaryAction={{
            label: 'Rechercher des pièces',
            onClick: () => scrollToSection('services')
          }}
          secondaryAction={{
            label: 'Vendre mes pièces',
            onClick: () => {}
          }}
          flipInterval={3000}
          flipPosition="right"
          flipSize="md"
          backgroundImage="https://images.unsplash.com/photo-1490902931801-d6f80ca94fe4?w=1920&h=800&fit=crop"
          overlayOpacity={0.7}
        />
        
        <Container>
          <div id="services"></div>
          <Section spacing="2xl" gap="xl">
            <Heading as="h2" size="5xl" align="center" style={{ color: '#E67E22' }}>
              Nos Services
            </Heading>
            <Grid cols={3} gap="xl">
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
            backgroundImage="https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=1920&h=800&fit=crop"
            overlayOpacity={0.8}
            parallax="normal"
            onSubmit={async (data) => {
              console.log('Form submitted:', data)
              alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.')
            }}
            submitText="Envoyer le message"
          />
        </div>
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