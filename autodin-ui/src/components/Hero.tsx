import React, { useEffect } from 'react'
import { Container, Button } from '@qwanyx/ui'
import { motion, useScroll, useTransform } from 'framer-motion'
import { config } from '../config'
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

const Hero: React.FC = () => {
  const { scrollY } = useScroll()
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150])
  
  useEffect(() => {
    console.log('Hero mounted - mysteryImages:', mysteryImages)
    console.log('Number of images:', mysteryImages.length)
  }, [])

  return (
    <motion.section 
      className="autodin-hero"
      style={{
        backgroundPositionY: backgroundY
      }}
    >
      <Container>
        <div className="hero-content">
          {/* Left Column - Text Content */}
          <motion.div 
            className="hero-text"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Bienvenue sur {config.siteName}
            </motion.h1>
            
            <motion.h2 
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {config.siteTagline}
            </motion.h2>
            
            <motion.p 
              className="hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {config.siteDescription}
            </motion.p>
            
            <motion.div 
              className="hero-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Button 
                size="lg" 
                variant="solid" 
                className="autodin-button-primary"
                style={{
                  borderRadius: '50px',
                  padding: '0.75rem 2rem'
                }}
                onClick={() => {
                  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <i className="fas fa-search"></i>
                Explorer
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Right Column - Double Image Flip */}
          <motion.div 
            className="hero-images"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <DoubleImageFlip images={mysteryImages} />
          </motion.div>
        </div>
      </Container>
    </motion.section>
  )
}

export default Hero