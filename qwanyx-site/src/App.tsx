import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  Container,
  Section,
  Grid,
  Flex,
  Heading,
  Text,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardImage,
  SimpleNavbar,
  Hero,
  HeroTitle,
  HeroSubtitle,
  HeroContent,
  HeroActions,
  Feature,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription,
  FeaturesGrid,
  Footer,
  FooterSection,
  FooterTitle,
  FooterLink,
  FooterLinks,
  FooterGrid,
  FooterBottom,
  Form,
  Field,
  Select,
  Checkbox,
  Input,
  Badge,
  Favicon,
  AuthModal,
  AuthStatus
} from 'qwanyx-ui';
import Textarea from './components/Textarea';
import { z } from 'zod';

// Contact form schema
const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  subject: z.string().min(1, 'Veuillez sélectionner un sujet'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
  terms: z.boolean().refine((val) => val === true, {
    message: 'Vous devez accepter les conditions'
  })
});

type ContactFormData = z.infer<typeof contactSchema>;

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('qwanyx_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleContactSubmit = (data: ContactFormData) => {
    console.log('Formulaire de contact soumis:', data);
    alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
  };

  const navItems = [
    { label: 'Accueil', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'À propos', href: '#about' },
    { label: 'Contact', href: '#contact' }
  ];

  const subjects = [
    { value: '', label: 'Choisissez un sujet', disabled: true },
    { value: 'general', label: 'Question générale' },
    { value: 'support', label: 'Support technique' },
    { value: 'partnership', label: 'Partenariat' },
    { value: 'other', label: 'Autre' }
  ];

  return (
    <ThemeProvider>
      <Favicon autoDetect={true} />
      
      {/* Navigation */}
      <div className="bg-white">
        <SimpleNavbar
          logo={<img src="/images/logo.png" alt="QWANYX" style={{height: 40, width: 'auto'}} />}
          title=""
          fixed={true}
        items={navItems}
        actions={
          user ? (
            <AuthStatus 
              workspace="qwanyx"
              onLogin={() => setShowAuth(true)}
              onLogout={() => {
                setUser(null);
                localStorage.removeItem('qwanyx_user');
                localStorage.removeItem('qwanyx_token');
              }}
            />
          ) : (
            <Button 
              variant="solid" 
              color="primary" 
              size="sm"
              onClick={() => setShowAuth(true)}
            >
              Connexion
            </Button>
          )
        }
      />
      </div>

      {/* Hero Section */}
      <Hero 
        id="home"
        size="lg" 
        className="bg-gradient-to-br from-blue-600 to-purple-600 text-white"
        style={{ paddingTop: '100px' }}
      >
        <HeroContent>
          <HeroTitle className="text-5xl md:text-6xl font-bold mb-6">
            Transformez vos idées en réalité digitale
          </HeroTitle>
          <HeroSubtitle className="text-xl md:text-2xl mb-8 opacity-90">
            Solutions innovantes pour propulser votre entreprise vers le futur
          </HeroSubtitle>
          <HeroActions>
            <Button size="lg" variant="solid" color="primary">
              Démarrer maintenant
            </Button>
            <Button size="lg" variant="outline" color="primary">
              En savoir plus
            </Button>
          </HeroActions>
        </HeroContent>
      </Hero>

      {/* Services Section */}
      <Section id="services" spacing="xl">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" className="text-4xl font-bold mb-4">
              Nos Services
            </Heading>
            <Text className="text-xl text-gray-600">
              Des solutions professionnelles adaptées à vos besoins
            </Text>
          </div>

          <Grid cols={3} gap="lg">
            <Card hoverable>
              <CardImage 
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=250&fit=crop" 
                alt="Conseil en stratégie"
              />
              <CardHeader>
                <CardTitle>Conseil Stratégique</CardTitle>
                <CardDescription>Planification pour la croissance</CardDescription>
              </CardHeader>
              <CardContent>
                <Text>
                  Expertise pour transformer vos opérations et maximiser l'efficacité avec des stratégies éprouvées.
                </Text>
              </CardContent>
              <CardFooter>
                <Button fullWidth variant="outline">En savoir plus</Button>
              </CardFooter>
            </Card>

            <Card hoverable>
              <CardImage 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop" 
                alt="Solutions digitales"
              />
              <CardHeader>
                <CardTitle>Transformation Digitale</CardTitle>
                <CardDescription>Modernisez votre infrastructure</CardDescription>
              </CardHeader>
              <CardContent>
                <Text>
                  Solutions complètes pour optimiser vos processus et améliorer la productivité de vos équipes.
                </Text>
              </CardContent>
              <CardFooter>
                <Button fullWidth variant="outline">En savoir plus</Button>
              </CardFooter>
            </Card>

            <Card hoverable>
              <CardImage 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=250&fit=crop" 
                alt="Formation d'équipe"
              />
              <CardHeader>
                <CardTitle>Formation & Développement</CardTitle>
                <CardDescription>Renforcez vos équipes</CardDescription>
              </CardHeader>
              <CardContent>
                <Text>
                  Programmes de formation professionnelle pour développer les compétences et l'innovation.
                </Text>
              </CardContent>
              <CardFooter>
                <Button fullWidth variant="outline">En savoir plus</Button>
              </CardFooter>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* Features Section */}
      <Section id="about" spacing="xl" className="bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" className="text-4xl font-bold mb-4">
              Pourquoi choisir QWANYX ?
            </Heading>
            <Text className="text-xl text-gray-600">
              Découvrez ce qui nous distingue
            </Text>
          </div>

          <FeaturesGrid cols={3}>
            <Feature centered>
              <FeatureIcon size="lg" color="primary" className="mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </FeatureIcon>
              <FeatureTitle className="text-xl font-semibold mb-2">
                Performance Optimale
              </FeatureTitle>
              <FeatureDescription className="text-gray-600">
                Technologies de pointe pour des applications ultra-rapides et performantes.
              </FeatureDescription>
            </Feature>

            <Feature centered>
              <FeatureIcon size="lg" color="success" className="mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </FeatureIcon>
              <FeatureTitle className="text-xl font-semibold mb-2">
                Sécurité Maximale
              </FeatureTitle>
              <FeatureDescription className="text-gray-600">
                Protection de niveau entreprise avec les dernières technologies de sécurité.
              </FeatureDescription>
            </Feature>

            <Feature centered>
              <FeatureIcon size="lg" color="accent" className="mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </FeatureIcon>
              <FeatureTitle className="text-xl font-semibold mb-2">
                Personnalisation Totale
              </FeatureTitle>
              <FeatureDescription className="text-gray-600">
                Solutions sur mesure adaptées parfaitement à vos besoins spécifiques.
              </FeatureDescription>
            </Feature>
          </FeaturesGrid>
        </Container>
      </Section>

      {/* Stats Section */}
      <Section spacing="lg" className="bg-gray-900 text-white">
        <Container>
          <Grid cols={4} gap="lg">
            <div className="text-center">
              <Heading as="h3" className="text-4xl font-bold mb-2">500+</Heading>
              <Text className="text-gray-400">Clients satisfaits</Text>
            </div>
            <div className="text-center">
              <Heading as="h3" className="text-4xl font-bold mb-2">1000+</Heading>
              <Text className="text-gray-400">Projets réalisés</Text>
            </div>
            <div className="text-center">
              <Heading as="h3" className="text-4xl font-bold mb-2">50+</Heading>
              <Text className="text-gray-400">Experts</Text>
            </div>
            <div className="text-center">
              <Heading as="h3" className="text-4xl font-bold mb-2">10+</Heading>
              <Text className="text-gray-400">Années d'expérience</Text>
            </div>
          </Grid>
        </Container>
      </Section>

      {/* Contact Section */}
      <Section id="contact" spacing="xl" className="bg-gray-50">
        <Container size="md">
          <div className="text-center mb-12">
            <Heading as="h2" className="text-4xl font-bold mb-4">
              Contactez-nous
            </Heading>
            <Text className="text-xl text-gray-600">
              Nous sommes à votre écoute pour répondre à toutes vos questions
            </Text>
          </div>

          <Card shadow="lg">
            <CardContent>
              <Form<ContactFormData>
                onSubmit={handleContactSubmit}
                schema={contactSchema}
                defaultValues={{
                  name: '',
                  email: '',
                  subject: '',
                  message: '',
                  terms: false
                }}
              >
                <div className="space-y-6">
                  <Grid cols={2} gap="md">
                    <Field name="name" label="Votre nom" required>
                      <Input name="name" placeholder="Jean Dupont" fullWidth />
                    </Field>
                    
                    <Field name="email" label="Email" required>
                      <Input name="email" type="email" placeholder="jean@exemple.com" fullWidth />
                    </Field>
                  </Grid>

                  <Field name="subject" label="Sujet" required>
                    <Select name="subject" options={subjects} fullWidth />
                  </Field>

                  <Field name="message" label="Message" required>
                    <Textarea 
                      name="message" 
                      placeholder="Décrivez votre projet ou votre question..." 
                      rows={6} 
                      fullWidth 
                    />
                  </Field>

                  <Checkbox 
                    name="terms" 
                    label="J'accepte les conditions d'utilisation et la politique de confidentialité"
                  />

                  <Button type="submit" variant="solid" color="primary" size="lg" fullWidth>
                    Envoyer le message
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>
        </Container>
      </Section>

      {/* Footer */}
      <Footer className="bg-gray-900 text-white">
        <Container>
          <FooterGrid cols={4}>
            <FooterSection>
              <Heading as="h4" className="text-xl font-bold mb-4">QWANYX</Heading>
              <Text className="text-gray-400 mb-4">
                Construisons ensemble le futur digital de votre entreprise.
              </Text>
              <Flex gap="sm">
                <Badge variant="outline" color="primary">Innovation</Badge>
                <Badge variant="outline" color="success">Qualité</Badge>
              </Flex>
            </FooterSection>

            <FooterSection>
              <FooterTitle>Services</FooterTitle>
              <FooterLinks>
                <FooterLink href="#">Développement Web</FooterLink>
                <FooterLink href="#">Applications Mobiles</FooterLink>
                <FooterLink href="#">Consulting</FooterLink>
                <FooterLink href="#">Formation</FooterLink>
              </FooterLinks>
            </FooterSection>

            <FooterSection>
              <FooterTitle>Entreprise</FooterTitle>
              <FooterLinks>
                <FooterLink href="#">À propos</FooterLink>
                <FooterLink href="#">Carrières</FooterLink>
                <FooterLink href="#">Blog</FooterLink>
                <FooterLink href="#">Presse</FooterLink>
              </FooterLinks>
            </FooterSection>

            <FooterSection>
              <FooterTitle>Support</FooterTitle>
              <FooterLinks>
                <FooterLink href="#">Centre d'aide</FooterLink>
                <FooterLink href="#">Contact</FooterLink>
                <FooterLink href="#">Status</FooterLink>
                <FooterLink href="#">Conditions</FooterLink>
              </FooterLinks>
            </FooterSection>
          </FooterGrid>

          <FooterBottom className="border-t border-gray-800 mt-8 pt-8">
            <Flex justify="between" align="center">
              <Text className="text-gray-400">
                © 2024 QWANYX. Tous droits réservés.
              </Text>
              <Flex gap="md">
                <FooterLink href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </FooterLink>
                <FooterLink href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </FooterLink>
                <FooterLink href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                  </svg>
                </FooterLink>
              </Flex>
            </Flex>
          </FooterBottom>
        </Container>
      </Footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        workspace="qwanyx"
        apiUrl="http://localhost:5002"
        onSuccess={(user, token) => {
          setUser(user);
          localStorage.setItem('qwanyx_user', JSON.stringify(user));
          localStorage.setItem('qwanyx_token', token);
          setShowAuth(false);
        }}
      />
    </ThemeProvider>
  );
}

export default App;