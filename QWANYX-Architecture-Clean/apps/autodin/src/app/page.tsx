'use client'

import React, { useState, useEffect } from 'react'
import { 
  Container, 
  Section, 
  Heading, 
  Text, 
  Button,
  Navbar,
  ServiceCard,
  Grid,
  HeroWithFlipSection,
  SimpleFooterSection,
  ContactFormSection,
  detailedContactFields
} from '@qwanyx/ui'
import { AuthModule } from '@qwanyx/auth'

function AppContent() {
  const [activeSection, setActiveSection] = useState<string>('details')
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [user, setUser] = useState<any>(null)
  
  // Add CSS for services grid and navbar styling
  React.useEffect(() => {
    const styleId = 'autodin-custom-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }
        @media (max-width: 1024px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .services-grid {
            grid-template-columns: 1fr;
          }
        }
        
        /* Navbar brand colors */
        nav h1, nav h2, nav h3 {
          color: #E67E22 !important;
        }
        
        /* Navbar buttons */
        nav button {
          border-color: #E67E22 !important;
        }
        
        nav button:hover {
          background-color: #E67E22 !important;
          color: white !important;
        }
        
        /* Primary button in navbar */
        nav button[data-variant="default"] {
          background-color: #E67E22 !important;
          border-color: #E67E22 !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, [])
  
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
      name: 'email',
      label: 'Email',
      type: 'email' as const,
      placeholder: 'Entrez votre email',
      required: true,
      validation: 'email' as const,
      autoComplete: 'email'
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
      name: 'companyName',
      label: "Nom de l'entreprise",
      type: 'text' as const,
      placeholder: 'Nom de votre entreprise',
      showIf: (formData: any) => formData.accountType === 'professionnel',
      required: true
    },
    {
      name: 'vatNumber',
      label: 'Numéro de TVA',
      type: 'text' as const,
      placeholder: 'BE0123456789',
      helperText: 'Format: BE0123456789',
      showIf: (formData: any) => formData.accountType === 'professionnel',
      required: true,
      validation: 'vat' as const
    },
    {
      name: 'proTypes',
      label: "Type d'activité",
      type: 'checkbox' as const,
      showIf: (formData: any) => formData.accountType === 'professionnel',
      required: true,
      helperText: 'Sélectionnez au moins une activité (obligatoire)',
      options: [
        { value: 'garagiste', label: 'Garagiste' },
        { value: 'fournisseur', label: 'Fournisseur de pièces' },
        { value: 'carrossier', label: 'Carrossier' }
      ]
    }
  ]
  
  // Debug
  useEffect(() => {
    console.log('Auth state changed:', { showAuth, authMode })
  }, [showAuth, authMode])
  
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
      <Navbar
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
            console.log('Register clicked - setting mode to register')
            setAuthMode('register')
            // Use setTimeout to ensure state update happens before opening modal
            setTimeout(() => setShowAuth(true), 0)
          },
          variant: 'outline' as const
        } : undefined}
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
          backgroundImage="/images/elena-mozhvilo-lVGr-HFxAfE-unsplash.jpg"
          overlayOpacity={0.7}
          parallax="slow"
        />
        
        <Container>
          <div id="services"></div>
          <Section spacing="2xl" gap="xl">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ color: '#2C3E50', marginBottom: '1rem', fontSize: '3.5rem', fontWeight: 'bold' }}>
                Nos Services
              </h2>
              <p style={{ color: '#7f8c8d', fontSize: '1.125rem' }}>
                Découvrez comment Autodin facilite votre recherche et vos transactions
              </p>
            </div>
            <div className="services-grid">
              <div onClick={() => {
                if (!user) {
                  setAuthMode('login')
                  setShowAuth(true)
                } else {
                  window.location.href = '/dashboard'
                }
              }} style={{ cursor: 'pointer' }}>
                <ServiceCard
                  icon="search"
                  title="Recherche rapide"
                  description="Trouvez instantanément parmi plus de 50 000 pièces disponibles en stock."
                />
              </div>
              <div onClick={() => {
                if (!user) {
                  setAuthMode('login')
                  setShowAuth(true)
                } else {
                  window.location.href = '/dashboard'
                }
              }} style={{ cursor: 'pointer' }}>
                <ServiceCard
                  icon="chat"
                  title="Faire une demande"
                  description="Diffusez facilement vos besoins spécifiques. Notre réseau vous répond rapidement."
                />
              </div>
              <div onClick={() => {
                if (!user) {
                  setAuthMode('login')
                  setShowAuth(true)
                } else {
                  window.location.href = '/dashboard'
                }
              }} style={{ cursor: 'pointer' }}>
                <ServiceCard
                  icon="directions_car"
                  title="Proposer un véhicule"
                  description="Valorisez vos véhicules endommagés ou destinés aux pièces auprès d'acheteurs qualifiés."
                />
              </div>
              <div onClick={() => {
                if (!user) {
                  setAuthMode('login')
                  setShowAuth(true)
                } else {
                  window.location.href = '/dashboard'
                }
              }} style={{ cursor: 'pointer' }}>
                <ServiceCard
                  icon="sell"
                  title="Véhicules d'occasion"
                  description="Découvrez notre sélection de véhicules d'occasion vérifiés par des vendeurs de confiance."
                />
              </div>
              <div onClick={() => {
                if (!user) {
                  setAuthMode('register')
                  setShowAuth(true)
                } else {
                  window.location.href = '/dashboard'
                }
              }} style={{ cursor: 'pointer' }}>
                <ServiceCard
                  icon="handshake"
                  title="Devenir partenaire"
                  description="Rejoignez notre réseau et accédez à des milliers d'acheteurs potentiels."
                />
              </div>
              <div onClick={() => {
                if (!user) {
                  setAuthMode('login')
                  setShowAuth(true)
                } else {
                  window.location.href = '/dashboard'
                }
              }} style={{ cursor: 'pointer' }}>
                <ServiceCard
                  icon="local_shipping"
                  title="Livraison rapide"
                  description="Expédition sous 24-48h avec nos partenaires transporteurs de confiance."
                />
              </div>
            </div>
          </Section>
        </Container>
        
        <div id="contact">
          <ContactFormSection
            title="Contactez-nous"
            subtitle="Une question ? Besoin d'aide ? Notre équipe est là pour vous"
            fields={detailedContactFields}
            backgroundImage="/images/elena-mozhvilo-lVGr-HFxAfE-unsplash.jpg"
            overlayOpacity={0.8}
            parallax="slow"
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
      {console.log('Rendering AuthModule with isOpen:', showAuth, 'mode:', authMode)}
      <AuthModule
        key={`auth-${authMode}-${showAuth}`}
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

    </div>
  )
}

export default function App() {
  return <AppContent />
}