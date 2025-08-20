'use client'

import { 
  SimpleNavbar,
  Hero,
  HeroTitle,
  HeroSubtitle,
  HeroContent,
  HeroActions,
  Button,
  Container,
  Section,
  Grid,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Feature,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription,
  FeaturesGrid,
  Footer,
  FooterGrid,
  FooterSection,
  FooterTitle,
  FooterLinks,
  FooterLink,
  FooterBottom
} from '@qwanyx/ui'
import { useState } from 'react'
import './autodin.css'  // Import our override CSS

export default function HomePage() {
  const [authOpen, setAuthOpen] = useState(false)

  const navItems = [
    { label: 'Accueil', href: '/' },
    { label: 'Rechercher', href: '/search' },
    { label: 'Vendre', href: '/sell' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
  ]

  const services = [
    {
      icon: '🔍',
      title: 'Recherche Avancée',
      description: 'Trouvez exactement la pièce dont vous avez besoin'
    },
    {
      icon: '🚗',
      title: 'Toutes Marques',
      description: 'Pièces pour toutes les marques de véhicules'
    },
    {
      icon: '✅',
      title: 'Qualité Garantie',
      description: 'Toutes nos pièces sont vérifiées'
    },
    {
      icon: '🚚',
      title: 'Livraison Rapide',
      description: 'Livraison dans toute la Belgique'
    },
    {
      icon: '💰',
      title: 'Meilleurs Prix',
      description: 'Économisez jusqu\'à 70%'
    },
    {
      icon: '🛡️',
      title: 'Paiement Sécurisé',
      description: 'Transactions sécurisées'
    }
  ]

  return (
    <>
      <SimpleNavbar
        brand="Autodin"
        items={navItems}
        onAuthClick={() => setAuthOpen(true)}
      />

      <Hero>
        <HeroContent>
          <HeroTitle>
            La Marketplace #1 des Pièces Auto
          </HeroTitle>
          <HeroSubtitle>
            Achetez et vendez des pièces auto en Belgique
          </HeroSubtitle>
          <HeroActions>
            <Button size="lg">
              Rechercher
            </Button>
            <Button size="lg" variant="outline">
              Vendre
            </Button>
          </HeroActions>
        </HeroContent>
      </Hero>

      <Section>
        <Container>
          <FeaturesGrid>
            {services.map((service, index) => (
              <Feature key={index}>
                <FeatureIcon>{service.icon}</FeatureIcon>
                <FeatureTitle>{service.title}</FeatureTitle>
                <FeatureDescription>{service.description}</FeatureDescription>
              </Feature>
            ))}
          </FeaturesGrid>
        </Container>
      </Section>

      <Footer>
        <FooterGrid>
          <FooterSection>
            <FooterTitle>Autodin</FooterTitle>
          </FooterSection>
          
          <FooterSection>
            <FooterTitle>Navigation</FooterTitle>
            <FooterLinks>
              <FooterLink href="/search">Rechercher</FooterLink>
              <FooterLink href="/sell">Vendre</FooterLink>
            </FooterLinks>
          </FooterSection>
        </FooterGrid>
        
        <FooterBottom>
          <p>© 2024 Autodin. Tous droits réservés.</p>
        </FooterBottom>
      </Footer>
    </>
  )
}