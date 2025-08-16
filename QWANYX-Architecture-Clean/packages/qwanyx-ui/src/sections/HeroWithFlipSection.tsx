import React, { useState, useEffect } from 'react'
import { Container } from '../components/Container'
import { Heading, Text } from '../components/Text'
import { Button } from '../components/Button'
import { DoubleImageFlip } from '../components/DoubleImageFlip'

export interface HeroWithFlipSectionProps {
  id?: string
  title: string
  subtitle?: string
  description?: string
  primaryAction?: {
    label: string
    onClick?: () => void
    icon?: React.ReactNode
  }
  secondaryAction?: {
    label: string
    onClick?: () => void
    icon?: React.ReactNode
  }
  images: string[]
  flipInterval?: number
  flipIntervalMin?: number
  flipIntervalMax?: number
  flipDuration?: number
  showMysteryIcon?: boolean
  hoverScale?: number
  backgroundImage?: string
  backgroundOverlay?: boolean
  overlayOpacity?: number
  variant?: 'default' | 'centered' | 'compact'
  flipPosition?: 'left' | 'right'
  flipSize?: 'sm' | 'md' | 'lg' | 'xl'
}

export const HeroWithFlipSection: React.FC<HeroWithFlipSectionProps> = ({
  id,
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  images,
  flipInterval = 3000,
  flipIntervalMin,
  flipIntervalMax,
  flipDuration = 800,
  showMysteryIcon = true,
  hoverScale = 1.02,
  backgroundImage,
  backgroundOverlay = true,
  overlayOpacity = 0.7,
  variant = 'default',
  flipPosition = 'right',
  flipSize = 'md'
}) => {
  const [isResponsive, setIsResponsive] = useState(false)
  
  useEffect(() => {
    const checkResponsive = () => {
      setIsResponsive(window.innerWidth <= 1270)
    }
    
    checkResponsive()
    window.addEventListener('resize', checkResponsive)
    
    return () => window.removeEventListener('resize', checkResponsive)
  }, [])
  
  const sectionStyle: React.CSSProperties = {
    position: 'relative',
    minHeight: variant === 'compact' ? '500px' : '600px',
    paddingTop: '100px', // Account for fixed navbar with more space
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    ...(backgroundImage && {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    })
  }

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
    zIndex: 1
  }

  const contentContainerStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 2,
    width: '100%',
    padding: variant === 'compact' ? '3rem 0' : '4rem 0'
  }

  const gridStyle: React.CSSProperties = isResponsive ? {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '3rem',
    alignItems: 'center'
  } : {
    display: 'grid',
    gridTemplateColumns: flipPosition === 'right' ? '1fr auto' : 'auto 1fr',
    gap: '4rem',
    alignItems: 'center'
  }

  const contentStyle: React.CSSProperties = {
    color: backgroundImage ? 'white' : 'inherit',
    ...(variant === 'centered' && { textAlign: 'center' })
  }

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
    flexWrap: 'wrap',
    ...(variant === 'centered' && { justifyContent: 'center' })
  }

  return (
    <section id={id} style={sectionStyle}>
      {backgroundImage && backgroundOverlay && <div style={overlayStyle} />}
      
      <div style={contentContainerStyle}>
        <Container>
          <div style={gridStyle}>
            {/* In responsive mode, always show content first */}
            {!isResponsive && flipPosition === 'left' && images.length >= 2 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DoubleImageFlip
                  images={images}
                  size={flipSize}
                  flipInterval={flipInterval}
                  flipIntervalMin={flipIntervalMin}
                  flipIntervalMax={flipIntervalMax}
                  flipDuration={flipDuration}
                  showMysteryIcon={showMysteryIcon}
                  hoverScale={hoverScale}
                />
              </div>
            )}
            
            <div style={contentStyle}>
              <Heading 
                size={variant === 'compact' ? '3xl' : '4xl'}
                style={{ 
                  marginBottom: subtitle ? '1rem' : '2rem',
                  color: backgroundImage ? 'white' : undefined
                }}
              >
                {title}
              </Heading>
              
              {subtitle && (
                <Text 
                  size="xl" 
                  style={{ 
                    marginBottom: description ? '1rem' : '2rem',
                    color: backgroundImage ? 'rgba(255,255,255,0.9)' : undefined,
                    fontWeight: 500
                  }}
                >
                  {subtitle}
                </Text>
              )}
              
              {description && (
                <Text 
                  size="lg" 
                  style={{ 
                    marginBottom: '2rem',
                    color: backgroundImage ? 'rgba(255,255,255,0.8)' : undefined,
                    maxWidth: variant === 'centered' ? '600px' : 'none',
                    margin: variant === 'centered' ? '0 auto 2rem' : '0 0 2rem 0'
                  }}
                >
                  {description}
                </Text>
              )}
              
              {(primaryAction || secondaryAction) && (
                <div style={actionsStyle}>
                  {primaryAction && (
                    <Button 
                      size="lg"
                      onClick={primaryAction.onClick}
                      style={backgroundImage ? {
                        backgroundColor: 'rgb(var(--qwanyx-primary))',
                        color: 'white',
                        border: 'none'
                      } : undefined}
                    >
                      {primaryAction.icon && <span style={{ marginRight: '0.5rem' }}>{primaryAction.icon}</span>}
                      {primaryAction.label}
                    </Button>
                  )}
                  {secondaryAction && (
                    <Button 
                      size="lg"
                      variant="outline"
                      onClick={secondaryAction.onClick}
                      style={backgroundImage ? {
                        borderColor: 'white',
                        color: 'white'
                      } : undefined}
                    >
                      {secondaryAction.icon && <span style={{ marginRight: '0.5rem' }}>{secondaryAction.icon}</span>}
                      {secondaryAction.label}
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            {/* Flip Column - Right Position or Responsive Mode */}
            {((isResponsive && images.length >= 2) || (!isResponsive && flipPosition === 'right' && images.length >= 2)) && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DoubleImageFlip
                  images={images}
                  size={flipSize}
                  flipInterval={flipInterval}
                  flipIntervalMin={flipIntervalMin}
                  flipIntervalMax={flipIntervalMax}
                  flipDuration={flipDuration}
                  showMysteryIcon={showMysteryIcon}
                  hoverScale={hoverScale}
                />
              </div>
            )}
          </div>
        </Container>
      </div>
    </section>
  )
}