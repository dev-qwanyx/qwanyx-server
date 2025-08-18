'use client'

import { HeroWithFlipSection } from '@qwanyx/ui'

export default function TestCarsPage() {
  // URLs spécifiques de voitures
  const carImages = [
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=500&fit=crop', // Voiture rouge
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=500&fit=crop', // Porsche
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=500&fit=crop', // Chevrolet
    'https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&h=500&fit=crop'  // McLaren
  ];

  return (
    <div className="qwanyx-min-h-screen qwanyx-bg-background">
      <HeroWithFlipSection
        title="Welcome to QWANYX"
        subtitle="Build Amazing Apps"
        description="Create beautiful, responsive applications with our comprehensive UI component library"
        images={carImages}
        primaryAction={{
          label: 'Get Started',
          onClick: () => console.log('Get Started clicked')
        }}
        secondaryAction={{
          label: 'Learn More',
          onClick: () => console.log('Learn More clicked')
        }}
        backgroundImage="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=800&fit=crop"
        overlayOpacity={0.7}
        flipPosition="right"
        flipSize="md"
        flipInterval={3000}
        showMysteryIcon={true}
        hoverScale={1.02}
        flipDuration={800}
      />
    </div>
  )
}