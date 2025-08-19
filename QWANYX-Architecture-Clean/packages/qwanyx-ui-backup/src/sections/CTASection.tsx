import React from 'react'
import { Container, Section } from '../components/Container'
import { Heading, Text } from '../components/Text'
import { Button } from '../components/Button'

export interface CTASectionProps {
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
  backgroundGradient?: string
  backgroundColor?: string
  variant?: 'default' | 'centered' | 'split' | 'minimal'
}

export const CTASection: React.FC<CTASectionProps> = ({
  id,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  backgroundGradient,
  backgroundColor,
  variant = 'centered'
}) => {
  const sectionStyle: React.CSSProperties = {
    background: backgroundGradient || backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    position: 'relative',
    overflow: 'hidden'
  }

  const contentStyles = {
    default: {
      textAlign: 'center' as const,
      padding: '4rem 0'
    },
    centered: {
      textAlign: 'center' as const,
      padding: '5rem 0'
    },
    split: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '3rem 0'
    },
    minimal: {
      textAlign: 'center' as const,
      padding: '3rem 0'
    }
  }

  return (
    <Section id={id} style={sectionStyle}>
      <Container>
        <div style={contentStyles[variant]}>
          <div style={variant === 'split' ? { flex: 1 } : {}}>
            <Heading 
              size={variant === 'minimal' ? 'xl' : '2xl'} 
              style={{ color: 'white', marginBottom: subtitle ? '1rem' : '2rem' }}
            >
              {title}
            </Heading>
            {subtitle && (
              <Text 
                size="lg" 
                style={{ 
                  color: 'rgba(255,255,255,0.9)', 
                  marginBottom: '2rem',
                  maxWidth: variant === 'centered' ? '600px' : 'none',
                  margin: variant === 'centered' ? '0 auto 2rem' : '0 0 2rem 0'
                }}
              >
                {subtitle}
              </Text>
            )}
          </div>
          
          {(primaryAction || secondaryAction) && (
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: variant === 'split' ? 'flex-end' : 'center',
              flexWrap: 'wrap'
            }}>
              {primaryAction && (
                <Button 
                  size="lg"
                  variant="solid"
                  onClick={primaryAction.onClick}
                  style={{ 
                    backgroundColor: 'white',
                    color: 'rgb(102, 126, 234)'
                  }}
                >
                  {primaryAction.label}
                </Button>
              )}
              {secondaryAction && (
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={secondaryAction.onClick}
                  style={{ 
                    borderColor: 'white',
                    color: 'white'
                  }}
                >
                  {secondaryAction.label}
                </Button>
              )}
            </div>
          )}
        </div>
      </Container>
    </Section>
  )
}