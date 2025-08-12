import React, { useEffect } from 'react'
import { Container, Button } from '@qwanyx/ui'
import { config } from '../config'
import DoubleImageFlip from './DoubleImageFlip'

// Import the image URLs
const mysteryImages = [
  'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/IMAGES/upload/null/node_67cdb07a0ad953656e0079ec/Mystère A.jpg',
  'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/IMAGES/upload/64c9164919bd6f8d1f1feb6c/node_6703a3b13dab69e8e25caaeb/ImageMystèreJannin.jpg',
  'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/IMAGES/upload/null/node_665302cd771468deccfe2fd1/Devos mystère NEW1 copie.jpg',
  'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/IMAGES/upload/null/node_670e3cdbe77b2a08c3080a21/FranquinA.jpg',
  'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/IMAGES/upload/null/node_670e3d58e77b2a08c3080aa5/DavidWautierA.jpg',
  'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/IMAGES/upload/null/node_66fd13c18ef53105a07b1f69/ChrisLamquetImageMistere.jpg',
  'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/IMAGES/upload/645b5e00c7b61df466430901/node_65fe2a2c6a8b68f837ceb351/ANJO-MIST.png',
  'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/IMAGES/upload/null/node_6682e3f6ff2ab68d163e0f8c/Greg Shaw Mistère A.jpg',
  'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/LAUDY/LAUDY/LAUDY-M1.jpg',
  'https://qwanyx-storage-images.s3.eu-central-1.amazonaws.com/IMAGES/upload/null/node_66ced596e0fec37d8408944a/A.jpg'
]

const Hero: React.FC = () => {
  useEffect(() => {
    console.log('Hero mounted - mysteryImages:', mysteryImages)
    console.log('Number of images:', mysteryImages.length)
  }, [])

  return (
    <section className="belgicomics-hero">
      <Container>
        <div className="hero-content">
          {/* Left Column - Text Content */}
          <div className="hero-text">
            <h1 className="hero-title">
              Bienvenue sur {config.siteName}
            </h1>
            
            <h2 className="hero-subtitle">
              {config.siteTagline}
            </h2>
            
            <p className="hero-description">
              {config.siteDescription}
            </p>
            
            <div className="hero-buttons">
              <Button 
                size="lg" 
                variant="solid" 
                style={{
                  background: 'white',
                  color: 'var(--gray-800)',
                  borderRadius: '50px',
                  padding: '0.75rem 2rem'
                }}
                onClick={() => {
                  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <i className="fas fa-search" style={{ marginRight: '0.5rem' }}></i>
                Explorer
              </Button>
            </div>
          </div>
          
          {/* Right Column - Double Image Flip */}
          <div className="hero-images">
            <DoubleImageFlip images={mysteryImages} />
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Hero