import React, { useEffect } from 'react'
import { Container, Button } from '@qwanyx/ui'
import DoubleImageFlip from './DoubleImageFlip'

// Import the image URLs - Car parts and automobiles
const mysteryImages = [
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80', // Moteur de voiture
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80', // Voiture de luxe
  'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&q=80', // Pièces détachées
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80', // BMW rouge
  'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=600&q=80', // Moteur ouvert
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80', // Audi grise
  'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=600&q=80', // Roue et frein
  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80', // Intérieur voiture
  'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=600&q=80', // Mercedes classique
  'https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=600&q=80'  // Pièces mécaniques
]

interface HeroProps {
  siteName?: string;
  siteTagline?: string;
  siteDescription?: string;
}

const Hero: React.FC<HeroProps> = ({ 
  siteName = 'Autodin',
  siteTagline = 'La marketplace de référence pour l\'achat et la vente de pièces détachées automobiles',
  siteDescription = 'Trouvez rapidement la pièce qu\'il vous faut ou vendez vos pièces à des milliers d\'acheteurs.'
}) => {
  useEffect(() => {
    // Add parallax effect to background on scroll
    const handleScroll = () => {
      const scrolled = window.scrollY
      const parallaxElement = document.querySelector('.autodin-hero') as HTMLElement
      if (parallaxElement) {
        parallaxElement.style.backgroundPositionY = `${scrolled * 0.5}px`
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="autodin-hero">
      <Container>
        <div className="hero-content">
          {/* Left Column - Text Content */}
          <div className="hero-text">
            <h1 className="hero-title animate__animated animate__fadeInLeft">
              Bienvenue sur {siteName}
            </h1>
            
            <h2 className="hero-subtitle animate__animated animate__fadeInLeft animate__delay-1s">
              {siteTagline}
            </h2>
            
            <p className="hero-description animate__animated animate__fadeInLeft animate__delay-2s">
              {siteDescription}
            </p>
            
            <div className="hero-buttons animate__animated animate__fadeInUp animate__delay-3s">
              <Button 
                size="lg" 
                variant="solid" 
                className="autodin-button-primary"
                onClick={() => {
                  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <i className="fas fa-search" style={{ marginRight: '8px' }}></i>
                Explorer
              </Button>
            </div>
          </div>
          
          {/* Right Column - Double Image Flip */}
          <div className="hero-images animate__animated animate__fadeInRight animate__delay-1s">
            <DoubleImageFlip images={mysteryImages} />
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Hero