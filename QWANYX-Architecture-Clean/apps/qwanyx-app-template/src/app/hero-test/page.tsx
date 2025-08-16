'use client'

import { HeroWithFlipSection } from '@qwanyx/ui'

export default function HeroTestPage() {
  return (
    <div className="qwanyx-min-h-screen qwanyx-bg-background">
      <HeroWithFlipSection
        title="Welcome to QWANYX"
        subtitle="Build Amazing Apps"
        description="Create beautiful, responsive applications with our comprehensive UI component library"
        images={[
          'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=500&fit=crop',
          'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=500&fit=crop',
          'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=500&fit=crop',
          'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=400&h=500&fit=crop'
        ]}
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