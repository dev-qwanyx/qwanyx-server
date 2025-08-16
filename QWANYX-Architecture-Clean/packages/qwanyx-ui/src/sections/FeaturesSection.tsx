import React from 'react'
import { Container, Section } from '../components/Container'
import { FeaturesGrid, Feature, FeatureIcon, FeatureTitle, FeatureDescription } from '../components/Feature'
import { Heading, Text } from '../components/Text'

export interface FeatureItem {
  icon: string | React.ReactNode
  title: string
  description: string
}

export interface FeaturesSectionProps {
  id?: string
  title?: string
  subtitle?: string
  features: FeatureItem[]
  columns?: 2 | 3 | 4 | 6
  variant?: 'default' | 'centered' | 'cards' | 'minimal'
  backgroundColor?: string
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  id,
  title,
  subtitle,
  features,
  columns = 3,
  variant = 'default',
  backgroundColor
}) => {
  return (
    <Section 
      id={id} 
      spacing="xl"
      style={{ backgroundColor }}
    >
      <Container>
        {(title || subtitle) && (
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            {title && <Heading size="2xl">{title}</Heading>}
            {subtitle && <Text size="lg" style={{ marginTop: '1rem' }}>{subtitle}</Text>}
          </div>
        )}
        
        <FeaturesGrid cols={columns === 6 ? 3 : columns as any}>
          {features.map((feature, index) => (
            <Feature 
              key={index}
              className={variant === 'cards' ? 'qwanyx-feature--card' : ''}
            >
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
  )
}