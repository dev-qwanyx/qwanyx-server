import React, { useState } from 'react'
import { HeroSection } from '../../src/sections/HeroSection'
import { FeaturesSection } from '../../src/sections/FeaturesSection'
import { CTASection } from '../../src/sections/CTASection'
import { TestimonialsSection } from '../../src/sections/TestimonialsSection'
import { PricingSection } from '../../src/sections/PricingSection'
import { HeroWithFlipSection } from '../../src/sections/HeroWithFlipSection'
import { SimpleFooterSection } from '../../src/sections/SimpleFooterSection'
import { ContactFormSection, simpleContactFields, detailedContactFields } from '../../src/sections/ContactFormSection'
import { Icon } from '../../src/components/Icon'
import { Container } from '../../src/components/Container'
import { Heading, Text } from '../../src/components/Text'
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/Card'
import { Button } from '../../src/components/Button'
import { Grid } from '../../src/components/Container'

export const SectionShowcase: React.FC = () => {
  const [showFullSection, setShowFullSection] = useState<string | null>(null)

  const sections = {
    hero: {
      title: 'Hero Section',
      description: 'Eye-catching hero section with multiple layout options',
      component: (
        <HeroSection
          id="hero-demo"
          title="Welcome to Our Platform"
          subtitle="Build something amazing with our powerful tools and services"
          primaryAction={{ label: 'Get Started' }}
          secondaryAction={{ label: 'Learn More' }}
          backgroundGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        />
      ),
      usage: `<HeroSection
  id="hero"
  title="Welcome to Our Platform"
  subtitle="Build something amazing"
  primaryAction={{ 
    label: 'Get Started',
    href: '#signup'
  }}
  secondaryAction={{ 
    label: 'Learn More',
    href: '#features'
  }}
  backgroundGradient="linear-gradient(...)"
  variant="centered"
/>`
    },
    features: {
      title: 'Features Section',
      description: 'Showcase your features in a grid layout',
      component: (
        <FeaturesSection
          id="features-demo"
          title="Our Features"
          subtitle="Everything you need to succeed"
          features={[
            { icon: '⚡', title: 'Lightning Fast', description: 'Optimized for speed' },
            { icon: '🔒', title: 'Secure', description: 'Enterprise-grade security' },
            { icon: '📱', title: 'Responsive', description: 'Works on all devices' },
            { icon: '🚀', title: 'Scalable', description: 'Grows with your needs' },
            { icon: '🛠️', title: 'Customizable', description: 'Adapt to your requirements' },
            { icon: '💡', title: 'Innovative', description: 'Cutting-edge technology' }
          ]}
          columns={3}
        />
      ),
      usage: `<FeaturesSection
  id="features"
  title="Our Features"
  subtitle="Everything you need"
  features={[
    { 
      icon: '⚡', 
      title: 'Fast', 
      description: 'Lightning speed' 
    },
    // ... more features
  ]}
  columns={3}
  variant="default"
/>`
    },
    cta: {
      title: 'CTA Section',
      description: 'Call-to-action section to drive conversions',
      component: (
        <CTASection
          id="cta-demo"
          title="Ready to Get Started?"
          subtitle="Join thousands of satisfied customers using our platform"
          primaryAction={{ label: 'Start Free Trial' }}
          secondaryAction={{ label: 'Contact Sales' }}
        />
      ),
      usage: `<CTASection
  id="cta"
  title="Ready to Get Started?"
  subtitle="Join thousands of customers"
  primaryAction={{ 
    label: 'Start Free Trial',
    href: '#signup'
  }}
  secondaryAction={{ 
    label: 'Contact Sales',
    href: '#contact'
  }}
  variant="centered"
/>`
    },
    testimonials: {
      title: 'Testimonials Section',
      description: 'Display customer testimonials and reviews',
      component: (
        <TestimonialsSection
          id="testimonials-demo"
          title="What Our Customers Say"
          subtitle="Don't just take our word for it"
          testimonials={[
            {
              id: '1',
              content: 'This platform has transformed how we work. The features are exactly what we needed.',
              author: 'Jane Doe',
              role: 'CEO',
              company: 'TechCorp',
              rating: 5
            },
            {
              id: '2',
              content: 'Outstanding service and support. The team is always there when we need them.',
              author: 'John Smith',
              role: 'CTO',
              company: 'StartupXYZ',
              rating: 5
            },
            {
              id: '3',
              content: 'The best investment we made this year. ROI has been incredible.',
              author: 'Sarah Johnson',
              role: 'Manager',
              company: 'BigCo',
              rating: 5
            }
          ]}
          columns={3}
        />
      ),
      usage: `<TestimonialsSection
  id="testimonials"
  title="What Our Customers Say"
  subtitle="Real feedback from real users"
  testimonials={[
    {
      id: '1',
      content: 'Amazing platform!',
      author: 'Jane Doe',
      role: 'CEO',
      company: 'TechCorp',
      rating: 5
    },
    // ... more testimonials
  ]}
  columns={3}
  variant="cards"
/>`
    },
    pricing: {
      title: 'Pricing Section',
      description: 'Display pricing plans and options',
      component: (
        <PricingSection
          id="pricing-demo"
          title="Choose Your Plan"
          subtitle="Flexible pricing that scales with your business"
          plans={[
            {
              id: 'starter',
              name: 'Starter',
              price: '$9',
              period: 'month',
              description: 'Perfect for small projects',
              features: ['1 User', '10 Projects', 'Basic Support', '1GB Storage'],
              ctaLabel: 'Start Free'
            },
            {
              id: 'pro',
              name: 'Professional',
              price: '$29',
              period: 'month',
              description: 'For growing teams',
              features: ['5 Users', 'Unlimited Projects', 'Priority Support', '10GB Storage', 'Advanced Analytics'],
              highlighted: true,
              badge: 'Most Popular',
              ctaLabel: 'Start Trial'
            },
            {
              id: 'enterprise',
              name: 'Enterprise',
              price: 'Custom',
              description: 'For large organizations',
              features: ['Unlimited Users', 'Unlimited Projects', '24/7 Support', 'Unlimited Storage', 'Custom Features'],
              ctaLabel: 'Contact Sales'
            }
          ]}
        />
      ),
      usage: `<PricingSection
  id="pricing"
  title="Choose Your Plan"
  subtitle="Flexible pricing options"
  plans={[
    {
      id: 'starter',
      name: 'Starter',
      price: '$9',
      period: 'month',
      features: ['Feature 1', 'Feature 2'],
      highlighted: false
    },
    // ... more plans
  ]}
  columns={3}
/>`
    },
    heroFlip: {
      title: 'Hero with Image Flip',
      description: 'Hero section with integrated DoubleImageFlip component',
      component: (
        <HeroWithFlipSection
          id="hero-flip-demo"
          title="Bienvenue sur Autodin"
          subtitle="La marketplace de référence pour l'achat et la vente de pièces détachées automobiles"
          description="Trouvez rapidement la pièce qu'il vous faut ou vendez vos pièces à des milliers d'acheteurs."
          primaryAction={{ 
            label: 'Explorer',
            icon: <Icon name="Search" size="sm" />
          }}
          images={[
            'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80',
            'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80',
            'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&q=80',
            'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80',
            'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=600&q=80',
            'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80'
          ]}
          backgroundImage="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80"
          overlayOpacity={0.8}
          flipSize="md"
          flipInterval={3000}
        />
      ),
      usage: `<HeroWithFlipSection
  id="hero"
  title="Welcome to Our Platform"
  subtitle="Your subtitle here"
  description="Optional description text"
  primaryAction={{ 
    label: 'Get Started',
    icon: '🚀'
  }}
  secondaryAction={{ 
    label: 'Learn More'
  }}
  images={[
    'image1.jpg',
    'image2.jpg',
    // ... at least 2 images required
  ]}
  backgroundImage="background.jpg"
  overlayOpacity={0.7}
  flipPosition="right"
  flipSize="md"
  flipInterval={3000}
  showMysteryIcon={true}
/>`
    },
    simpleFooter: {
      title: 'Simple Footer Section',
      description: 'Clean footer with contact info, links, and social media',
      component: (
        <SimpleFooterSection
          title="QWANYX"
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
        />
      ),
      usage: `<SimpleFooterSection
  title="Your Company"
  description="Your company description"
  address={{
    street: "123 Main Street",
    city: "City, ZIP",
    country: "Country"
  }}
  phone="+1 234 567 890"
  email="info@company.com"
  links={[
    { label: "Terms of Service", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Legal Notice", href: "#" },
    { label: "Contact", href: "#contact" }
  ]}
  socials={[
    { icon: "Facebook", href: "#", label: "Facebook" },
    { icon: "Twitter", href: "#", label: "Twitter" },
    { icon: "LinkedIn", href: "#", label: "LinkedIn" },
    { icon: "Instagram", href: "#", label: "Instagram" }
  ]}
  copyright="© 2024 Your Company. All rights reserved."
/>`
    },
    contactSimple: {
      title: 'Contact Form Section (Simple)',
      description: 'Basic contact form with name, email, and message',
      component: (
        <ContactFormSection
          title="Get in Touch"
          subtitle="We'd love to hear from you"
          fields={simpleContactFields}
          onSubmit={(data) => {
            console.log('Form submitted:', data)
            alert('Thank you for your message!')
          }}
        />
      ),
      usage: `<ContactFormSection
  title="Get in Touch"
  subtitle="We'd love to hear from you"
  fields={simpleContactFields}
  onSubmit={(data) => console.log(data)}
/>`
    },
    contactDetailed: {
      title: 'Contact Form Section (Detailed)',
      description: 'Detailed form with firstname, lastname, phone, and more',
      component: (
        <ContactFormSection
          title="Contact Our Team"
          subtitle="Fill out the form below and we'll get back to you soon"
          fields={detailedContactFields}
          backgroundImage="https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=1920&h=800&fit=crop"
          overlayOpacity={0.6}
          parallax="normal"
          onSubmit={(data) => {
            console.log('Form submitted:', data)
            alert('Thank you for your detailed inquiry!')
          }}
        />
      ),
      usage: `<ContactFormSection
  title="Contact Our Team"
  subtitle="Fill out the form below"
  fields={detailedContactFields}
  backgroundImage="image-url.jpg"
  overlayOpacity={0.6}
  parallax="normal"
  onSubmit={(data) => console.log(data)}
/>`
    },
    contactCustom: {
      title: 'Contact Form Section (Custom)',
      description: 'Custom form with your own field configuration',
      component: (
        <ContactFormSection
          title="Request a Demo"
          subtitle="See our product in action"
          fields={[
            { name: 'company', label: 'Company Name', type: 'text', placeholder: 'Acme Inc.', required: true },
            { name: 'size', label: 'Company Size', type: 'select', options: ['1-10', '11-50', '51-200', '200+'], required: true },
            { name: 'email', label: 'Work Email', type: 'email', placeholder: 'you@company.com', required: true },
            { name: 'role', label: 'Your Role', type: 'text', placeholder: 'CTO, Developer, etc.' },
            { name: 'needs', label: 'What are you looking for?', type: 'textarea', rows: 4, required: true }
          ]}
          submitText="Request Demo"
          parallax="fixed"
          backgroundImage="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=800&fit=crop"
          overlayOpacity={0.7}
          onSubmit={(data) => {
            console.log('Demo request:', data)
            alert('Demo request received!')
          }}
        />
      ),
      usage: `<ContactFormSection
  title="Request a Demo"
  subtitle="See our product in action"
  fields={[
    { name: 'company', label: 'Company Name', type: 'text', required: true },
    { name: 'size', label: 'Company Size', type: 'select', 
      options: ['1-10', '11-50', '51-200', '200+'], required: true },
    { name: 'email', label: 'Work Email', type: 'email', required: true },
    { name: 'role', label: 'Your Role', type: 'text' },
    { name: 'needs', label: 'What are you looking for?', 
      type: 'textarea', rows: 4, required: true }
  ]}
  submitText="Request Demo"
  parallax="fixed"
  backgroundImage="background.jpg"
  onSubmit={(data) => console.log(data)}
/>`
    }
  }

  // Full section preview
  if (showFullSection && sections[showFullSection as keyof typeof sections]) {
    const section = sections[showFullSection as keyof typeof sections]
    return (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: 9999, 
        background: 'white',
        overflow: 'auto'
      }}>
        <div style={{ 
          position: 'fixed', 
          top: '1rem', 
          right: '1rem', 
          zIndex: 10000
        }}>
          <Button 
            onClick={() => setShowFullSection(null)}
            variant="outline"
            style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            ✕ Close Preview
          </Button>
        </div>
        {section.component}
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Container>
        <Heading size="3xl" style={{ marginBottom: '1rem' }}>
          Section Library
        </Heading>
        <Text size="lg" style={{ marginBottom: '2rem' }}>
          Ready-to-use sections that you can combine to build complete pages. Each section has an ID for navbar linking.
        </Text>

        <Grid cols={3} style={{ gap: '2rem', marginBottom: '3rem' }}>
          {Object.entries(sections).map(([key, section]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Text style={{ marginBottom: '1rem' }}>
                  {section.description}
                </Text>
                <Button 
                  fullWidth 
                  onClick={() => setShowFullSection(key)}
                  style={{ marginBottom: '1rem' }}
                >
                  View Full Section
                </Button>
                <details>
                  <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                    <Text weight="semibold">Usage Example</Text>
                  </summary>
                  <pre style={{ 
                    background: '#f3f4f6', 
                    padding: '1rem', 
                    borderRadius: '0.5rem',
                    overflow: 'auto',
                    fontSize: '0.875rem'
                  }}>
                    <code>{section.usage}</code>
                  </pre>
                </details>
              </CardContent>
            </Card>
          ))}
        </Grid>

        {/* How to use sections with navigation */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use Sections with Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <Text style={{ marginBottom: '1rem' }}>
              Each section can have an ID that allows it to be linked from the navigation bar. This enables smooth scrolling to sections within a page.
            </Text>
            <pre style={{ 
              background: '#f3f4f6', 
              padding: '1rem', 
              borderRadius: '0.5rem',
              overflow: 'auto'
            }}>
              <code>{`// In your page component
<Page 
  navigation={{
    title: "My App",
    items: [
      { label: 'Home', href: '#hero' },
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Testimonials', href: '#testimonials' },
      { label: 'Contact', href: '#cta' }
    ]
  }}
>
  <HeroSection id="hero" ... />
  <FeaturesSection id="features" ... />
  <PricingSection id="pricing" ... />
  <TestimonialsSection id="testimonials" ... />
  <CTASection id="cta" ... />
</Page>`}</code>
            </pre>
          </CardContent>
        </Card>
      </Container>
    </div>
  )
}