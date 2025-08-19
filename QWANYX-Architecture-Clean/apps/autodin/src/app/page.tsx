'use client'

import { useState, useEffect } from 'react'
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
  detailedContactFields,
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter
} from '@qwanyx/ui'
import { AuthModule } from '@qwanyx/auth'

function AppContent() {
  const [activeSection, setActiveSection] = useState<string>('details')
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [user, setUser] = useState<any>(null)
  const [showTestModal, setShowTestModal] = useState(false)
  
  // Configuration des champs pour le formulaire d'enregistrement
  const registerFields = [
    {
      name: 'firstName',
      label: 'Prénom',
      type: 'text' as const,
      placeholder: 'Votre prénom',
      required: true
    },
    {
      name: 'lastName',
      label: 'Nom',
      type: 'text' as const,
      placeholder: 'Votre nom',
      required: true
    },
    {
      name: 'phone',
      label: 'Téléphone',
      type: 'tel' as const,
      placeholder: '+32 123 45 67 89',
      required: false,
      validation: 'phone' as const
    },
    {
      name: 'accountType',
      label: 'Type de compte',
      type: 'radio' as const,
      required: true,
      defaultValue: 'particulier',
      options: [
        { value: 'particulier', label: 'Particulier' },
        { value: 'professionnel', label: 'Professionnel' }
      ]
    },
    {
      name: 'proTypes',
      label: "Type d'activité",
      type: 'checkbox' as const,
      required: true,
      helperText: 'Sélectionnez au moins une activité (obligatoire)',
      options: [
        { value: 'garagiste', label: 'Garagiste' },
        { value: 'fournisseur', label: 'Fournisseur de pièces' },
        { value: 'carrossier', label: 'Carrossier' }
      ]
    },
    {
      name: 'companyName',
      label: "Nom de l'entreprise",
      type: 'text' as const,
      placeholder: 'Nom de votre entreprise',
      showIf: (formData: any) => formData.accountType === 'professionnel',
      required: false
    },
    {
      name: 'vatNumber',
      label: 'Numéro de TVA',
      type: 'text' as const,
      placeholder: 'BE0123456789',
      helperText: 'Format: BE0123456789',
      showIf: (formData: any) => formData.accountType === 'professionnel',
      validation: 'vat' as const
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email' as const,
      placeholder: 'Entrez votre email',
      required: true,
      validation: 'email' as const,
      autoComplete: 'email'
    }
  ]
  
  // Debug
  useEffect(() => {
    console.log('Auth state changed:', { showAuth, authMode })
  }, [showAuth, authMode])
  
  useEffect(() => {
    console.log('TEST MODAL STATE CHANGED:', showTestModal)
  }, [showTestModal])
  
  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('autodin_user')
    const storedToken = localStorage.getItem('autodin_token')
    const tokenExpiry = localStorage.getItem('autodin_token_expiry')
    
    if (storedUser && storedToken && tokenExpiry) {
      const expiryTime = parseInt(tokenExpiry)
      if (expiryTime > Date.now()) {
        setUser(JSON.parse(storedUser))
      } else {
        // Token expired, clean up
        localStorage.removeItem('autodin_user')
        localStorage.removeItem('autodin_token')
        localStorage.removeItem('autodin_token_expiry')
      }
    }
  }, [])
  
  const handleAuthSuccess = (authUser: any, token?: string) => {
    setUser(authUser)
    setShowAuth(false)
    
    // Store in localStorage for persistence
    if (token) {
      const expiryTime = Date.now() + (5 * 24 * 60 * 60 * 1000) // 5 days
      localStorage.setItem('autodin_user', JSON.stringify(authUser))
      localStorage.setItem('autodin_token', token)
      localStorage.setItem('autodin_token_expiry', expiryTime.toString())
    }
    
    console.log('Authentication successful:', authUser)
  }
  
  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('autodin_user')
    localStorage.removeItem('autodin_token')
    localStorage.removeItem('autodin_token_expiry')
    sessionStorage.removeItem('autodin_user')
    sessionStorage.removeItem('autodin_token')
  }
  
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
          },
          ...(user ? [
            {
              label: 'Dashboard',
              onClick: () => {
                window.location.href = '/dashboard'
              }
            }
          ] : [])
        ]}
        primaryAction={user ? {
          label: `${user.firstName || user.email}`,
          onClick: () => {
            console.log('Logout clicked')
            handleLogout()
          },
          icon: 'logout'
        } : {
          label: 'Se connecter',
          onClick: () => {
            console.log('Login button clicked - setting showAuth to true')
            setAuthMode('login')
            setShowAuth(true)
            console.log('After setState - showAuth should be true now')
          },
          icon: 'login'
        }}
        secondaryAction={!user ? {
          label: "S'inscrire",
          onClick: () => {
            console.log('Register clicked')
            setAuthMode('register')
            setShowAuth(true)
          },
          variant: 'outline' as const
        } : undefined}
      />
      
      <main>
        {/* Test button for modal */}
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
          <Button 
            onClick={() => {
              console.log('Test button clicked, current state:', showTestModal);
              setShowTestModal(true);
              console.log('State should be true now');
            }}
            style={{ backgroundColor: 'red' }}
          >
            Test Modal (State: {showTestModal ? 'TRUE' : 'FALSE'})
          </Button>
        </div>

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
      
      {/* Auth Modal */}
      {console.log('Rendering AuthModule with isOpen:', showAuth)}
      <AuthModule
        workspace="autodin"
        apiUrl="http://localhost:5002"
        locale="fr"
        initialMode={authMode}
        allowModeSwitch={true}
        passwordless={true}
        rememberMe={true}
        logo="/images/logo.png"
        primaryColor="#E67E22"
        registerFields={registerFields}
        buttonText={{
          register: 'Créer mon compte',
          login: 'Se connecter',
          switchToLogin: 'Déjà un compte ? Se connecter',
          switchToRegister: "Pas encore de compte ? S'inscrire"
        }}
        isOpen={showAuth}
        onClose={() => {
          console.log('AuthModule onClose called')
          setShowAuth(false)
        }}
        asModal={true}
        onSuccess={handleAuthSuccess}
        onError={(error) => console.error('Auth error:', error)}
      />

      {/* Test Modal - SUPER SIMPLE */}
      {showTestModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2>Test Modal (Direct HTML)</h2>
            <p>Si vous voyez ça, le problème vient du composant Modal!</p>
            <button 
              onClick={() => setShowTestModal(false)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  return <AppContent />
}