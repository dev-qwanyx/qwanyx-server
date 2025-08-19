import React, { useState } from 'react';
import { z } from 'zod';
import {
  // Layout
  Container,
  Section,
  Grid,
  Flex,
  // Typography
  Heading,
  Text,
  // Navigation
  Navbar,
  // Hero
  Hero,
  HeroTitle,
  HeroSubtitle,
  HeroContent,
  HeroActions,
  // Features
  Feature,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription,
  FeaturesGrid,
  // Cards
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardImage,
  // Forms
  Form,
  Field,
  Select,
  Checkbox,
  // Inputs
  Input,
  Textarea,
  Button,
  // Footer
  Footer,
  FooterSection,
  FooterTitle,
  FooterLink,
  FooterLinks,
  FooterGrid,
  FooterBottom,
  // Utilities
  Badge,
  Favicon
} from '../index';

// Contact form schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms'
  })
});

type ContactFormData = z.infer<typeof contactSchema>;

export interface QwanyxTemplateProps {
  companyName?: string;
  tagline?: string;
  primaryColor?: string;
  accentColor?: string;
}

export const QwanyxTemplate: React.FC<QwanyxTemplateProps> = ({
  companyName = 'QWANYX',
  tagline = 'Build Amazing Digital Experiences'
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for navbar effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContactSubmit = (data: ContactFormData) => {
    console.log('Contact form submitted:', data);
    alert('Thank you for your message! We will get back to you soon.');
  };

  const subjects = [
    { value: '', label: 'Choose a subject', disabled: true },
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'sales', label: 'Sales' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'other', label: 'Other' }
  ];

  const navItems = [
    { label: 'Home', href: '#home', active: true },
    { label: 'Features', href: '#features' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <>
      <Favicon autoDetect={true} />
      
      {/* Navigation */}
      <Navbar
        title={companyName}
        position="fixed"
        className={`transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
        }`}
        items={navItems}
        actions={
          <Button variant="solid" color="primary" size="sm">
            Get Started
          </Button>
        }
      />

      {/* Hero Section */}
      <Hero 
        id="home"
        size="lg" 
        className="bg-gradient-to-br from-blue-600 to-purple-600 text-white"
        style={{ paddingTop: '100px' }}
      >
        <HeroContent>
          <HeroTitle className="text-5xl md:text-6xl font-bold mb-6">
            {tagline}
          </HeroTitle>
          <HeroSubtitle className="text-xl md:text-2xl mb-8 opacity-90">
            Transform your ideas into reality with our cutting-edge solutions
          </HeroSubtitle>
          <HeroActions>
            <Button size="lg" variant="solid" className="bg-white text-gray-900 hover:bg-gray-100">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
              Watch Demo
            </Button>
          </HeroActions>
        </HeroContent>
      </Hero>

      {/* Features Section */}
      <Section id="features" spacing="xl" className="bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" className="text-4xl font-bold mb-4">
              Why Choose {companyName}?
            </Heading>
            <Text className="text-xl text-gray-600">
              Discover the features that make us stand out
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
                Lightning Fast
              </FeatureTitle>
              <FeatureDescription className="text-gray-600">
                Optimized performance with incredible speed. Your applications will run smoother than ever.
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
                Secure by Default
              </FeatureTitle>
              <FeatureDescription className="text-gray-600">
                Enterprise-grade security built into every layer. Your data is protected with the latest encryption.
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
                Fully Customizable
              </FeatureTitle>
              <FeatureDescription className="text-gray-600">
                Tailor every aspect to match your brand. Complete control over colors, layouts, and functionality.
              </FeatureDescription>
            </Feature>
          </FeaturesGrid>
        </Container>
      </Section>

      {/* Services/Products Section */}
      <Section id="services" spacing="xl">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" className="text-4xl font-bold mb-4">
              Our Services
            </Heading>
            <Text className="text-xl text-gray-600">
              Professional solutions tailored to your needs
            </Text>
          </div>

          <Grid cols={3} gap="lg">
            <Card className="hover:shadow-lg transition-shadow">
              <CardImage 
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=250&fit=crop" 
                alt="Business Strategy"
              />
              <CardHeader>
                <CardTitle>Business Consulting</CardTitle>
                <CardDescription>Strategic planning for growth</CardDescription>
              </CardHeader>
              <CardContent>
                <Text>
                  Expert guidance to transform your business operations and maximize efficiency with proven strategies.
                </Text>
              </CardContent>
              <CardFooter>
                <Button fullWidth variant="outline">Learn More</Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardImage 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop" 
                alt="Digital Solutions"
              />
              <CardHeader>
                <CardTitle>Digital Transformation</CardTitle>
                <CardDescription>Modernize your infrastructure</CardDescription>
              </CardHeader>
              <CardContent>
                <Text>
                  Comprehensive digital solutions to streamline your workflows and enhance productivity across teams.
                </Text>
              </CardContent>
              <CardFooter>
                <Button fullWidth variant="outline">Learn More</Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardImage 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=250&fit=crop" 
                alt="Team Training"
              />
              <CardHeader>
                <CardTitle>Team Development</CardTitle>
                <CardDescription>Empower your workforce</CardDescription>
              </CardHeader>
              <CardContent>
                <Text>
                  Professional training programs designed to upskill your team and foster a culture of innovation.
                </Text>
              </CardContent>
              <CardFooter>
                <Button fullWidth variant="outline">Learn More</Button>
              </CardFooter>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* Stats Section */}
      <Section spacing="lg" className="bg-gray-900 text-white">
        <Container>
          <Grid cols={4} gap="lg">
            <div className="text-center">
              <Heading as="h3" className="text-4xl font-bold mb-2">500+</Heading>
              <Text className="text-gray-400">Happy Clients</Text>
            </div>
            <div className="text-center">
              <Heading as="h3" className="text-4xl font-bold mb-2">1000+</Heading>
              <Text className="text-gray-400">Projects Completed</Text>
            </div>
            <div className="text-center">
              <Heading as="h3" className="text-4xl font-bold mb-2">50+</Heading>
              <Text className="text-gray-400">Team Members</Text>
            </div>
            <div className="text-center">
              <Heading as="h3" className="text-4xl font-bold mb-2">10+</Heading>
              <Text className="text-gray-400">Years Experience</Text>
            </div>
          </Grid>
        </Container>
      </Section>

      {/* Contact Section */}
      <Section id="contact" spacing="xl" className="bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <Heading as="h2" className="text-4xl font-bold mb-4">
              Get In Touch
            </Heading>
            <Text className="text-xl text-gray-600">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </Text>
          </div>

          <Card className="shadow-lg">
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
                    <Field name="name" label="Your Name" required>
                      <Input name="name" placeholder="John Doe" fullWidth />
                    </Field>
                    
                    <Field name="email" label="Email Address" required>
                      <Input name="email" type="email" placeholder="john@example.com" fullWidth />
                    </Field>
                  </Grid>

                  <Field name="subject" label="Subject" required>
                    <Select name="subject" options={subjects} fullWidth />
                  </Field>

                  <Field name="message" label="Message" required>
                    <Textarea 
                      name="message" 
                      placeholder="Tell us about your project..." 
                      rows={6} 
                      fullWidth 
                    />
                  </Field>

                  <Checkbox 
                    name="terms" 
                    label="I agree to the terms and conditions and privacy policy"
                  />

                  <Button type="submit" variant="solid" color="primary" size="lg" fullWidth>
                    Send Message
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
              <Heading as="h4" className="text-xl font-bold mb-4">{companyName}</Heading>
              <Text className="text-gray-400 mb-4">
                Building the future of digital experiences, one project at a time.
              </Text>
              <Flex gap="sm">
                <Badge variant="outline" color="primary">Innovation</Badge>
                <Badge variant="outline" color="success">Quality</Badge>
              </Flex>
            </FooterSection>

            <FooterSection>
              <FooterTitle>Products</FooterTitle>
              <FooterLinks>
                <FooterLink href="#">Features</FooterLink>
                <FooterLink href="#">Pricing</FooterLink>
                <FooterLink href="#">Documentation</FooterLink>
                <FooterLink href="#">API Reference</FooterLink>
              </FooterLinks>
            </FooterSection>

            <FooterSection>
              <FooterTitle>Company</FooterTitle>
              <FooterLinks>
                <FooterLink href="#">About Us</FooterLink>
                <FooterLink href="#">Careers</FooterLink>
                <FooterLink href="#">Blog</FooterLink>
                <FooterLink href="#">Press Kit</FooterLink>
              </FooterLinks>
            </FooterSection>

            <FooterSection>
              <FooterTitle>Support</FooterTitle>
              <FooterLinks>
                <FooterLink href="#">Help Center</FooterLink>
                <FooterLink href="#">Contact Us</FooterLink>
                <FooterLink href="#">Status</FooterLink>
                <FooterLink href="#">Terms of Service</FooterLink>
              </FooterLinks>
            </FooterSection>
          </FooterGrid>

          <FooterBottom className="border-t border-gray-800 mt-8 pt-8">
            <Flex justify="between" align="center">
              <Text className="text-gray-400">
                © 2024 {companyName}. All rights reserved.
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
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
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
    </>
  );
};