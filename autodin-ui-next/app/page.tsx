'use client'

import {
  Container,
  Hero,
  HeroTitle,
  HeroSubtitle,
  HeroActions,
  Button,
  FeaturesGrid,
  Feature,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription,
  Footer,
  FooterGrid,
  FooterSection,
  FooterTitle,
  FooterLinks,
  FooterLink,
  FooterBottom,
  SimpleNavbar
} from '@qwanyx/ui'

export default function Home() {
  return (
    <>
      {/* Navbar */}
      <SimpleNavbar
        brand="Autodin"
        links={[
          { label: 'Accueil', href: '#' },
          { label: 'Services', href: '#services' },
          { label: 'Contact', href: '#contact' }
        ]}
        actions={
          <Button variant="primary">
            <i className="fas fa-user mr-2"></i>
            Connexion
          </Button>
        }
      />

      {/* Hero Section */}
      <Hero>
        <Container>
          <HeroTitle>
            La marketplace de référence pour vos pièces auto
          </HeroTitle>
          <HeroSubtitle>
            Trouvez rapidement la pièce qu'il vous faut ou vendez vos pièces à des milliers d'acheteurs
          </HeroSubtitle>
          <HeroActions>
            <Button variant="primary" size="lg">
              <i className="fas fa-search mr-2"></i>
              Rechercher une pièce
            </Button>
            <Button variant="outline" size="lg">
              <i className="fas fa-plus mr-2"></i>
              Publier une annonce
            </Button>
          </HeroActions>
        </Container>
      </Hero>

      {/* Services Section */}
      <Container className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Nos Services</h2>
        <FeaturesGrid columns={3}>
          <Feature>
            <FeatureIcon>
              <i className="fas fa-search text-3xl"></i>
            </FeatureIcon>
            <FeatureTitle>Recherche rapide</FeatureTitle>
            <FeatureDescription>
              Trouvez instantanément parmi plus de 50 000 pièces disponibles
            </FeatureDescription>
          </Feature>

          <Feature>
            <FeatureIcon>
              <i className="fas fa-comments text-3xl"></i>
            </FeatureIcon>
            <FeatureTitle>Faire une demande</FeatureTitle>
            <FeatureDescription>
              Diffusez vos besoins spécifiques auprès de notre réseau
            </FeatureDescription>
          </Feature>

          <Feature>
            <FeatureIcon>
              <i className="fas fa-car text-3xl"></i>
            </FeatureIcon>
            <FeatureTitle>Proposer un véhicule</FeatureTitle>
            <FeatureDescription>
              Valorisez vos véhicules endommagés auprès d'acheteurs qualifiés
            </FeatureDescription>
          </Feature>

          <Feature>
            <FeatureIcon>
              <i className="fas fa-tags text-3xl"></i>
            </FeatureIcon>
            <FeatureTitle>Véhicules d'occasion</FeatureTitle>
            <FeatureDescription>
              Découvrez notre sélection vérifiée par des vendeurs de confiance
            </FeatureDescription>
          </Feature>

          <Feature>
            <FeatureIcon>
              <i className="fas fa-handshake text-3xl"></i>
            </FeatureIcon>
            <FeatureTitle>Devenir partenaire</FeatureTitle>
            <FeatureDescription>
              Rejoignez notre réseau et accédez à des milliers d'acheteurs
            </FeatureDescription>
          </Feature>

          <Feature>
            <FeatureIcon>
              <i className="fas fa-truck text-3xl"></i>
            </FeatureIcon>
            <FeatureTitle>Livraison rapide</FeatureTitle>
            <FeatureDescription>
              Expédition sous 24-48h avec nos partenaires transporteurs
            </FeatureDescription>
          </Feature>
        </FeaturesGrid>
      </Container>

      {/* Footer */}
      <Footer>
        <FooterGrid>
          <FooterSection>
            <FooterTitle>À propos</FooterTitle>
            <FooterLinks>
              <FooterLink href="#">Qui sommes-nous</FooterLink>
              <FooterLink href="#">Notre mission</FooterLink>
              <FooterLink href="#">Témoignages</FooterLink>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Services</FooterTitle>
            <FooterLinks>
              <FooterLink href="#">Recherche de pièces</FooterLink>
              <FooterLink href="#">Vendre des pièces</FooterLink>
              <FooterLink href="#">Devenir partenaire</FooterLink>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Contact</FooterTitle>
            <FooterLinks>
              <FooterLink href="#">
                <i className="fas fa-envelope mr-2"></i>
                contact@autodin.be
              </FooterLink>
              <FooterLink href="#">
                <i className="fas fa-phone mr-2"></i>
                +32 2 xxx xx xx
              </FooterLink>
              <FooterLink href="#">
                <i className="fas fa-map-marker-alt mr-2"></i>
                Bruxelles, Belgique
              </FooterLink>
            </FooterLinks>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Suivez-nous</FooterTitle>
            <FooterLinks>
              <FooterLink href="#">
                <i className="fab fa-facebook mr-2"></i>
                Facebook
              </FooterLink>
              <FooterLink href="#">
                <i className="fab fa-instagram mr-2"></i>
                Instagram
              </FooterLink>
              <FooterLink href="#">
                <i className="fab fa-linkedin mr-2"></i>
                LinkedIn
              </FooterLink>
            </FooterLinks>
          </FooterSection>
        </FooterGrid>

        <FooterBottom>
          <p>&copy; 2024 Autodin. Tous droits réservés.</p>
          <div className="flex gap-4">
            <FooterLink href="#">Mentions légales</FooterLink>
            <FooterLink href="#">Politique de confidentialité</FooterLink>
            <FooterLink href="#">CGV</FooterLink>
          </div>
        </FooterBottom>
      </Footer>
    </>
  )
}