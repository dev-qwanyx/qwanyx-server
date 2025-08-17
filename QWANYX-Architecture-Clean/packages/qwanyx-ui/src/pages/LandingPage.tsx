import React from 'react'
import { Page } from '../components/Page'
import { Hero, HeroTitle, HeroSubtitle, HeroContent, HeroActions } from '../components/Hero'
import { Button } from '../components/Button'
import { Container, Section } from '../components/Container'
import { Grid } from '../components/Grid'
import { FeaturesGrid, Feature, FeatureIcon, FeatureTitle, FeatureDescription } from '../components/Feature'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card'
import { Heading, Text } from '../components/Text'

export interface LandingPageProps {
  navigation?: {
    title?: string
    items?: Array<{
      label: string
      href?: string
    }>
    actions?: React.ReactNode
  }
  hero?: {
    title: string
    subtitle?: string
    primaryAction?: {
      label: string
      onClick?: () => void
    }
    secondaryAction?: {
      label: string
      onClick?: () => void
    }
    backgroundImage?: string
  }
  features?: Array<{
    icon: string | React.ReactNode
    title: string
    description: string
  }>
  pricing?: Array<{
    title: string
    price: string
    description?: string
    features: string[]
    highlighted?: boolean
  }>
  showFooter?: boolean
}

export const LandingPage: React.FC<LandingPageProps> = ({
  navigation = {
    title: 'Brand',
    items: [
      { label: 'Home', href: '#top' },
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'About', href: '#about' },
      { label: 'Contact', href: '#contact' }
    ],
    actions: <Button size="sm">Get Started</Button>
  },
  hero = {
    title: 'Welcome to Our Platform',
    subtitle: 'Build something amazing with our powerful tools',
    primaryAction: { label: 'Get Started' },
    secondaryAction: { label: 'Learn More' }
  },
  features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Optimized for speed and performance'
    },
    {
      icon: '🔒',
      title: 'Secure',
      description: 'Enterprise-grade security built in'
    },
    {
      icon: '📱',
      title: 'Responsive',
      description: 'Works perfectly on all devices'
    },
    {
      icon: '🚀',
      title: 'Scalable',
      description: 'Grows with your business needs'
    },
    {
      icon: '🛠️',
      title: 'Customizable',
      description: 'Adapt to your specific requirements'
    },
    {
      icon: '💡',
      title: 'Innovative',
      description: 'Cutting-edge technology stack'
    }
  ],
  pricing = [
    {
      title: 'Starter',
      price: '$9/mo',
      description: 'Perfect for small projects',
      features: ['1 User', '10 Projects', 'Basic Support', '1GB Storage']
    },
    {
      title: 'Professional',
      price: '$29/mo',
      description: 'For growing teams',
      features: ['5 Users', 'Unlimited Projects', 'Priority Support', '10GB Storage', 'Advanced Analytics'],
      highlighted: true
    },
    {
      title: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: ['Unlimited Users', 'Unlimited Projects', '24/7 Support', 'Unlimited Storage', 'Custom Features']
    }
  ],
  showFooter = true
}) => {
  return (
    <Page navigation={navigation} footer={{ show: showFooter }}>
      {/* Hero Section */}
      {hero && (
        <Hero backgroundImage={hero.backgroundImage}>
          <HeroContent>
            <HeroTitle>{hero.title}</HeroTitle>
            {hero.subtitle && <HeroSubtitle>{hero.subtitle}</HeroSubtitle>}
            <HeroActions>
              {hero.primaryAction && (
                <Button size="lg" onClick={hero.primaryAction.onClick}>
                  {hero.primaryAction.label}
                </Button>
              )}
              {hero.secondaryAction && (
                <Button size="lg" variant="outline" onClick={hero.secondaryAction.onClick}>
                  {hero.secondaryAction.label}
                </Button>
              )}
            </HeroActions>
          </HeroContent>
        </Hero>
      )}

      {/* Features Section */}
      {features && features.length > 0 && (
        <Section id="features">
          <Container>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <Heading size="2xl">Features</Heading>
              <Text size="lg">Everything you need to succeed</Text>
            </div>
            <FeaturesGrid>
              {features.map((feature, index) => (
                <Feature key={index}>
                  <FeatureIcon>
                    {typeof feature.icon === 'string' ? feature.icon : feature.icon}
                  </FeatureIcon>
                  <FeatureTitle>{feature.title}</FeatureTitle>
                  <FeatureDescription>{feature.description}</FeatureDescription>
                </Feature>
              ))}
            </FeaturesGrid>
          </Container>
        </Section>
      )}

      {/* Pricing Section */}
      {pricing && pricing.length > 0 && (
        <Section id="pricing" style={{ backgroundColor: '#f8f9fa' }}>
          <Container>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <Heading size="2xl">Pricing</Heading>
              <Text size="lg">Choose the perfect plan for your needs</Text>
            </div>
            <Grid cols={pricing.length}>
              {pricing.map((plan, index) => (
                <Card 
                  key={index} 
                  className={plan.highlighted ? 'qwanyx-card--highlighted' : ''}
                >
                  <CardHeader>
                    <CardTitle>{plan.title}</CardTitle>
                    <Text size="3xl" weight="bold">{plan.price}</Text>
                    {plan.description && (
                      <CardDescription>{plan.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {plan.features.map((feature, idx) => (
                        <li key={idx} style={{ padding: '0.5rem 0' }}>
                          ✓ {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      fullWidth 
                      variant={plan.highlighted ? 'primary' : 'outline'}
                    >
                      Choose {plan.title}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Grid>
          </Container>
        </Section>
      )}
    </Page>
  )
}