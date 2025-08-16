'use client'

import { useState, useEffect } from 'react'
import { ThemeProvider, WorkspaceProvider } from '@qwanyx/ui'
// import { AuthModule, AuthProvider } from '@qwanyx/auth' // Temporairement désactivé
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
  FeaturesSection,
  ContactFormSection,
  detailedContactFields
} from '@qwanyx/ui'
import { ThemeEditor } from './components/ThemeEditor'

function AppContent() {
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'about' | 'services'>('home')
  const [activeSection, setActiveSection] = useState<string>('details')
  const [user, setUser] = useState<any>(null)
  const [showAuth, setShowAuth] = useState(false)
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const navbarHeight = 95 // Perfect offset for navbar
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
    // Store user info for dashboard
    localStorage.setItem('user', JSON.stringify(user))
    if (token) {
      localStorage.setItem('token', token)
    }
    // Redirect to dashboard
    window.location.href = '/dashboard'
  }
  
  const handleLogout = () => {
    setUser(null)
    // Clear storage
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('qwanyx-template_token')
    localStorage.removeItem('qwanyx-template_user')
    sessionStorage.removeItem('qwanyx-template_token')
    sessionStorage.removeItem('qwanyx-template_user')
  }
  
  // Check for existing auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user') || 
                      localStorage.getItem('qwanyx-template_user') || 
                      sessionStorage.getItem('qwanyx-template_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Failed to parse stored user')
      }
    }
  }, [])
  
  return (
    <div className="qwanyx-min-h-screen qwanyx-bg-background">
      <SimpleNavbar
        title="QWANYX App"
        subtitle="Template"
        fixed={true}
        actions={null /* Temporairement désactivé */}
        items={[
          {
            label: 'Détails',
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
          // Temporairement désactivé
          /* ...(user ? [{
            label: 'Tableau de bord',
            active: false,
            onClick: () => {
              window.location.href = '/dashboard'
            }
          }] : []) */
        ]}
      />
      
      <main>
        {currentView === 'home' && (
          <>
            <HeroWithFlipSection
              title="Welcome to QWANYX"
              subtitle="Build Amazing Apps"
              description="Create beautiful, responsive applications with our comprehensive UI component library"
              images={[
                'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=500&fit=crop',
                'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=500&fit=crop',
                'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=500&fit=crop',
                'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=400&h=500&fit=crop'
              ]}
              primaryAction={{
                label: 'Get Started',
                onClick: () => setCurrentView('services')
              }}
              secondaryAction={{
                label: 'Learn More',
                onClick: () => setCurrentView('about')
              }}
              flipInterval={3000}
              flipPosition="right"
              flipSize="md"
              backgroundImage="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=800&fit=crop"
              overlayOpacity={0.7}
            />
            
            <Container>
              <div id="services"></div>
              <Section spacing="2xl" gap="xl">
                <Heading as="h2" size="5xl" align="center">
                  Services
                </Heading>
                <Grid cols={3} gap="xl">
                  <ServiceCard
                    icon="cloud"
                    title="Cloud Infrastructure"
                    description="Scalable cloud hosting with automatic backups and 99.9% uptime guarantee"
                  />
                  <ServiceCard
                    icon="analytics"
                    title="Business Analytics"
                    description="Real-time dashboards and insights to track your business performance"
                  />
                  <ServiceCard
                    icon="shield"
                    title="Security Suite"
                    description="Advanced threat protection, SSL certificates, and GDPR compliance tools"
                  />
                  <ServiceCard
                    icon="api"
                    title="API Integration"
                    description="Connect with 500+ third-party services and automate your workflows"
                  />
                  <ServiceCard
                    icon="support_agent"
                    title="24/7 Support"
                    description="Expert technical support available round the clock via chat, phone, or email"
                  />
                  <ServiceCard
                    icon="auto_mode"
                    title="AI Automation"
                    description="Smart automation powered by AI to streamline repetitive tasks and boost productivity"
                  />
                </Grid>
              </Section>
            </Container>
            
            {/* Contact Section */}
            <div id="contact">
              <ContactFormSection
                title="Contact Us"
                subtitle="Have a question? We'd love to hear from you"
                fields={detailedContactFields}
                backgroundImage="https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=1920&h=800&fit=crop"
                overlayOpacity={0.6}
                parallax="normal"
                onSubmit={async (data) => {
                  console.log('Form submitted:', data)
                  alert('Thank you for your message! We will get back to you soon.')
                }}
                submitText="Send Message"
              />
            </div>
          </>
        )}
        
        {currentView === 'about' && (
          <Container>
            <Section spacing="xl" className="qwanyx-pt-20">
              <Heading as="h2" size="3xl" className="qwanyx-mb-4">About</Heading>
              <Text size="lg">This is the about page content.</Text>
            </Section>
          </Container>
        )}
        
        {/* Dashboard - Temporairement désactivé */}
        
        {currentView === 'services' && (
          <Container>
            <Section spacing="xl" className="qwanyx-pt-20">
              <Heading as="h2" size="3xl" className="qwanyx-mb-4">Services</Heading>
              <Text size="lg">This is the services page content.</Text>
            </Section>
          </Container>
        )}
        
        {/* Theme editor removed from navigation - still available if needed 
        {currentView === 'theme' && (
          <div className="qwanyx-pt-20">
            <ThemeEditor />
          </div>
        )} */}
      </main>
      
      <SimpleFooterSection
        title="QWANYX App"
        description="Plateforme collaborative pour créer des applications modernes"
        address={{
          street: "Boulevard Example 111",
          city: "1000 Brussels",
          country: "Belgium"
        }}
        phone="+32 2 xxx xx xx"
        email="info@qwanyx.com"
        links={[
          { label: "Conditions générales d'utilisation", href: "#" },
          { label: "Politique de confidentialité (RGPD)", href: "#" },
          { label: "Mentions légales", href: "#" },
          { label: "Contact", href: "#contact" }
        ]}
        socials={[
          { icon: "Facebook", href: "#", label: "Facebook" },
          { icon: "Twitter", href: "#", label: "Twitter" },
          { icon: "LinkedIn", href: "#", label: "LinkedIn" },
          { icon: "Instagram", href: "#", label: "Instagram" }
        ]}
        copyright="© 2024 QWANYX. Tous droits réservés."
        className="qwanyx-footer-custom"
      />
      
      {/* Auth Modal - Temporairement désactivé
      <AuthModule
        workspace="qwanyx-template"
        apiUrl="http://localhost:5002"
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        asModal
        onSuccess={handleAuthSuccess}
        primaryColor="rgb(var(--qwanyx-primary))"
        logo="/images/logo.png"
        initialMode="register"
        passwordless={true}
      /> */}
    </div>
  )
}

export default function App() {
  return (
    <WorkspaceProvider defaultWorkspace="qwanyx-app">
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </WorkspaceProvider>
  )
}