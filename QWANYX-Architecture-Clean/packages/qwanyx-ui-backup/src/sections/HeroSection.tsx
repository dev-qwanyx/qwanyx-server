import React from 'react'
import { Hero, HeroTitle, HeroSubtitle, HeroContent, HeroActions } from '../components/Hero'
import { Button } from '../components/Button'
import { Container } from '../components/Container'

export interface HeroSectionProps {
  id?: string
  title: string
  subtitle?: string
  primaryAction?: {
    label: string
    onClick?: () => void
    href?: string
  }
  secondaryAction?: {
    label: string
    onClick?: () => void
    href?: string
  }
  backgroundImage?: string
  backgroundGradient?: string
  height?: string
  variant?: 'default' | 'centered' | 'left' | 'right'
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  id,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  backgroundImage,
  backgroundGradient,
  height = '70vh',
  variant = 'centered'
}) => {
  const alignmentStyles = {
    default: { textAlign: 'center' as const },
    centered: { textAlign: 'center' as const },
    left: { textAlign: 'left' as const },
    right: { textAlign: 'right' as const }
  }

  return (
    <section id={id} style={{ position: 'relative' }}>
      <Hero 
        backgroundImage={backgroundImage}
        style={{
          height,
          background: backgroundGradient || undefined,
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <Container>
          <HeroContent style={alignmentStyles[variant]}>
            <HeroTitle>{title}</HeroTitle>
            {subtitle && <HeroSubtitle>{subtitle}</HeroSubtitle>}
            {(primaryAction || secondaryAction) && (
              <HeroActions style={{ justifyContent: variant === 'centered' ? 'center' : `flex-${variant === 'right' ? 'end' : 'start'}` }}>
                {primaryAction && (
                  <Button 
                    size="lg" 
                    onClick={primaryAction.onClick}
                  >
                    {primaryAction.label}
                  </Button>
                )}
                {secondaryAction && (
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={secondaryAction.onClick}
                  >
                    {secondaryAction.label}
                  </Button>
                )}
              </HeroActions>
            )}
          </HeroContent>
        </Container>
      </Hero>
    </section>
  )
}