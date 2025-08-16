import React, { useState } from 'react'
// DoubleImageFlip removed - needs reimplementation
// import { DoubleImageFlip } from '../../src/components/DoubleImageFlip'
import { Container } from '../../src/components/Container'
import { Heading, Text } from '../../src/components/Text'
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/Card'
import { Button } from '../../src/components/Button'
import { Grid } from '../../src/components/Container'
import { Input } from '../../src/components/Input'
import { SimpleSelect } from '../../src/components/SimpleSelect'
import { Icon } from '../../src/components/Icon'
import { IconShowcase } from './IconShowcase'

// Default images list (from autodin-ui)
const defaultCarImages = [
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

const natureImages = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', // Mountains
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&q=80', // Ocean sunset
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80', // Forest
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80', // Hills
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600&q=80', // Nature landscape
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&q=80'  // Forest path
]

const techImages = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80', // Circuit board
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80', // Retro tech
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80', // Matrix code
  'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&q=80', // Laptop
  'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=600&q=80', // Keyboard
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'  // Server room
]

const imageSets = {
  cars: defaultCarImages,
  nature: natureImages,
  tech: techImages
}

export const MiscShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flip' | 'icons'>('flip')
  const [selectedImages, setSelectedImages] = useState(defaultCarImages)
  const [customImages, setCustomImages] = useState<string[]>([])
  const [customImageInput, setCustomImageInput] = useState('')
  const [selectedSize, setSelectedSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md')
  const [flipInterval, setFlipInterval] = useState(3000)
  const [flipIntervalMin, setFlipIntervalMin] = useState(2000)
  const [flipIntervalMax, setFlipIntervalMax] = useState(4000)
  const [flipDuration, setFlipDuration] = useState(800)
  const [showMysteryIcon, setShowMysteryIcon] = useState(true)
  const [hoverScale, setHoverScale] = useState(1.02)
  const [showConfig, setShowConfig] = useState(false)

  if (activeTab === 'icons') {
    return (
      <div>
        <div style={{ padding: '1rem 2rem', borderBottom: '1px solid #e5e7eb' }}>
          <Button 
            variant="ghost" 
            onClick={() => setActiveTab('flip')}
            style={{ marginRight: '1rem' }}
          >
            ← Back to Double Image Flip
          </Button>
        </div>
        <IconShowcase />
      </div>
    )
  }

  const handleAddCustomImage = () => {
    if (customImageInput.trim()) {
      setCustomImages([...customImages, customImageInput.trim()])
      setCustomImageInput('')
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Container>
        <Heading size="3xl" style={{ marginBottom: '1rem' }}>
          Miscellaneous Components
        </Heading>
        <Text size="lg" style={{ marginBottom: '2rem' }}>
          Special effect components and utilities for enhanced user experience
        </Text>
        
        {/* Navigation Buttons */}
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
          <Button 
            variant="outline"
            onClick={() => setActiveTab('icons')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem' 
            }}
          >
            <Icon name="Palette" size="sm" />
            View Icon Library
          </Button>
        </div>

        {/* DoubleImageFlip Section */}
        <Card style={{ marginBottom: '3rem' }}>
          <CardHeader>
            <CardTitle>Double Image Flip</CardTitle>
          </CardHeader>
          <CardContent>
            <Text style={{ marginBottom: '2rem' }}>
              An animated component that displays two images side by side with automatic flipping animations. 
              Perfect for showcasing products, portfolios, or creating engaging visual effects.
            </Text>

            {/* Advanced Configuration Toggle */}
            <div style={{ marginBottom: '2rem' }}>
              <Button 
                variant="outline"
                onClick={() => setShowConfig(!showConfig)}
                style={{ marginBottom: '1rem' }}
              >
                {showConfig ? '▼' : '▶'} Advanced Configuration Editor
              </Button>
              
              {showConfig && (
                <Card style={{ background: '#f9fafb', padding: '1rem' }}>
                  <Grid cols={2} style={{ gap: '2rem' }}>
                    <div>
                      <Heading size="sm" style={{ marginBottom: '1rem' }}>Timing Settings</Heading>
                      
                      <div style={{ marginBottom: '1rem' }}>
                        <Text size="sm" weight="semibold">Base Flip Interval: {flipInterval}ms</Text>
                        <input 
                          type="range"
                          min="1000"
                          max="10000"
                          step="100"
                          value={flipInterval}
                          onChange={(e) => setFlipInterval(Number(e.target.value))}
                          style={{ width: '100%' }}
                        />
                        <Text size="xs" style={{ color: '#6b7280' }}>Time between automatic flips</Text>
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <Text size="sm" weight="semibold">Interval Variance Range:</Text>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <div style={{ flex: 1 }}>
                            <Text size="xs">Min: {flipIntervalMin}ms</Text>
                            <input 
                              type="range"
                              min="1000"
                              max="5000"
                              step="100"
                              value={flipIntervalMin}
                              onChange={(e) => setFlipIntervalMin(Number(e.target.value))}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <Text size="xs">Max: {flipIntervalMax}ms</Text>
                            <input 
                              type="range"
                              min="2000"
                              max="10000"
                              step="100"
                              value={flipIntervalMax}
                              onChange={(e) => setFlipIntervalMax(Number(e.target.value))}
                              style={{ width: '100%' }}
                            />
                          </div>
                        </div>
                        <Text size="xs" style={{ color: '#6b7280' }}>Random delay will be between these values</Text>
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <Text size="sm" weight="semibold">Flip Animation Duration: {flipDuration}ms</Text>
                        <input 
                          type="range"
                          min="300"
                          max="2000"
                          step="50"
                          value={flipDuration}
                          onChange={(e) => setFlipDuration(Number(e.target.value))}
                          style={{ width: '100%' }}
                        />
                        <Text size="xs" style={{ color: '#6b7280' }}>How fast the flip animation plays</Text>
                      </div>
                    </div>

                    <div>
                      <Heading size="sm" style={{ marginBottom: '1rem' }}>Visual Settings</Heading>
                      
                      <div style={{ marginBottom: '1rem' }}>
                        <Text size="sm" weight="semibold">Hover Scale: {hoverScale}x</Text>
                        <input 
                          type="range"
                          min="1"
                          max="1.2"
                          step="0.01"
                          value={hoverScale}
                          onChange={(e) => setHoverScale(Number(e.target.value))}
                          style={{ width: '100%' }}
                        />
                        <Text size="xs" style={{ color: '#6b7280' }}>Scale effect on hover</Text>
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input 
                            type="checkbox"
                            checked={showMysteryIcon}
                            onChange={(e) => setShowMysteryIcon(e.target.checked)}
                          />
                          <Text size="sm">Show mystery icon on hover</Text>
                        </label>
                      </div>
                    </div>
                  </Grid>

                  {/* Export Configuration */}
                  <div style={{ marginTop: '2rem', padding: '1rem', background: 'white', borderRadius: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <Text weight="semibold">Configuration Export</Text>
                      <Button 
                        size="sm"
                        onClick={() => {
                          const config = `<DoubleImageFlip
  images={[
${selectedImages.map(img => `    '${img}'`).join(',\n')}
  ]}
  size="${selectedSize}"
  flipInterval={${flipInterval}}
  flipIntervalMin={${flipIntervalMin}}
  flipIntervalMax={${flipIntervalMax}}
  flipDuration={${flipDuration}}
  showMysteryIcon={${showMysteryIcon}}
  hoverScale={${hoverScale}}
  onImageClick={(src, side) => {
    console.log(\`Clicked \${side}: \${src}\`)
  }}
/>`
                          navigator.clipboard.writeText(config)
                          alert('Configuration copied to clipboard!')
                        }}
                      >
                        Copy to Clipboard
                      </Button>
                    </div>
                    <pre style={{ 
                      background: '#f3f4f6', 
                      padding: '1rem', 
                      borderRadius: '0.5rem',
                      overflow: 'auto',
                      fontSize: '0.75rem',
                      maxHeight: '200px'
                    }}>
                      <code>{`<DoubleImageFlip
  images={[/* ${selectedImages.length} images */]}
  size="${selectedSize}"
  flipInterval={${flipInterval}}
  flipIntervalMin={${flipIntervalMin}}
  flipIntervalMax={${flipIntervalMax}}
  flipDuration={${flipDuration}}
  showMysteryIcon={${showMysteryIcon}}
  hoverScale={${hoverScale}}
/>`}</code>
                    </pre>
                  </div>
                </Card>
              )}
            </div>

            {/* Basic Configuration */}
            <Grid cols={2} style={{ gap: '2rem', marginBottom: '2rem' }}>
              <div>
                <Heading size="md" style={{ marginBottom: '1rem' }}>Quick Settings</Heading>
                
                <div style={{ marginBottom: '1rem' }}>
                  <Text weight="semibold" style={{ marginBottom: '0.5rem' }}>Image Set:</Text>
                  <SimpleSelect
                    options={[
                      { value: 'cars', label: 'Cars (Default)' },
                      { value: 'nature', label: 'Nature' },
                      { value: 'tech', label: 'Technology' },
                      { value: 'custom', label: 'Custom Images' }
                    ]}
                    onChange={(e) => {
                      const value = (e.target as HTMLSelectElement).value
                      if (value === 'custom') {
                        setSelectedImages(customImages.length > 0 ? customImages : defaultCarImages)
                      } else {
                        setSelectedImages(imageSets[value as keyof typeof imageSets])
                      }
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <Text weight="semibold" style={{ marginBottom: '0.5rem' }}>Size:</Text>
                  <SimpleSelect
                    value={selectedSize}
                    options={[
                      { value: 'sm', label: 'Small (200px)' },
                      { value: 'md', label: 'Medium (300px)' },
                      { value: 'lg', label: 'Large (400px)' },
                      { value: 'xl', label: 'Extra Large (500px)' }
                    ]}
                    onChange={(e) => setSelectedSize((e.target as HTMLSelectElement).value as any)}
                  />
                </div>

              </div>

              <div>
                <Heading size="md" style={{ marginBottom: '1rem' }}>Custom Images</Heading>
                <Text size="sm" style={{ marginBottom: '0.5rem' }}>
                  Add your own image URLs (minimum 2 required):
                </Text>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={customImageInput}
                    onChange={(e) => setCustomImageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCustomImage()}
                  />
                  <Button onClick={handleAddCustomImage}>Add</Button>
                </div>
                {customImages.length > 0 && (
                  <div>
                    <Text size="sm" weight="semibold">Custom images ({customImages.length}):</Text>
                    <ul style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                      {customImages.map((img, idx) => (
                        <li key={idx} style={{ 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap',
                          maxWidth: '300px'
                        }}>
                          {img}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setCustomImages([])}
                      style={{ marginTop: '0.5rem' }}
                    >
                      Clear Custom Images
                    </Button>
                  </div>
                )}
              </div>
            </Grid>

            {/* Usage Example */}
            <details style={{ marginBottom: '2rem' }}>
              <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                <Text weight="semibold">Usage Example</Text>
              </summary>
              <pre style={{ 
                background: '#f3f4f6', 
                padding: '1rem', 
                borderRadius: '0.5rem',
                overflow: 'auto'
              }}>
                <code>{`import { DoubleImageFlip } from '@qwanyx/ui'

const images = [
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
  'https://example.com/image3.jpg',
  // ... more images
]

<DoubleImageFlip
  images={images}
  size="md"
  flipInterval={3000}
  showMysteryIcon={true}
  onImageClick={(src, side) => {
    console.log(\`Clicked \${side} panel: \${src}\`)
  }}
/>`}</code>
              </pre>
            </details>

            {/* Live Demo */}
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '0.5rem',
              padding: '2rem',
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {selectedImages.length >= 2 ? (
                <div>
                  <img 
                    src={selectedImages[0]} 
                    alt="Preview" 
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                  />
                  <Text style={{ color: 'white', marginTop: '1rem' }}>
                    DoubleImageFlip component temporarily disabled (migration from MUI)
                  </Text>
                </div>
              ) : (
                <Text style={{ color: 'white' }}>
                  Please add at least 2 images to see the demo
                </Text>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Props Documentation */}
        <Card>
          <CardHeader>
            <CardTitle>DoubleImageFlip Props</CardTitle>
          </CardHeader>
          <CardContent>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Prop</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Type</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Default</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.5rem' }}><code>images</code></td>
                  <td style={{ padding: '0.5rem' }}>string[]</td>
                  <td style={{ padding: '0.5rem' }}>required</td>
                  <td style={{ padding: '0.5rem' }}>Array of image URLs to display</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.5rem' }}><code>size</code></td>
                  <td style={{ padding: '0.5rem' }}>'sm' | 'md' | 'lg' | 'xl'</td>
                  <td style={{ padding: '0.5rem' }}>'md'</td>
                  <td style={{ padding: '0.5rem' }}>Size of the image panels</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.5rem' }}><code>flipInterval</code></td>
                  <td style={{ padding: '0.5rem' }}>number</td>
                  <td style={{ padding: '0.5rem' }}>3000</td>
                  <td style={{ padding: '0.5rem' }}>Milliseconds between automatic flips</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.5rem' }}><code>showMysteryIcon</code></td>
                  <td style={{ padding: '0.5rem' }}>boolean</td>
                  <td style={{ padding: '0.5rem' }}>true</td>
                  <td style={{ padding: '0.5rem' }}>Show "?" icon on hover</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.5rem' }}><code>onImageClick</code></td>
                  <td style={{ padding: '0.5rem' }}>function</td>
                  <td style={{ padding: '0.5rem' }}>-</td>
                  <td style={{ padding: '0.5rem' }}>Callback when an image is clicked</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem' }}><code>className</code></td>
                  <td style={{ padding: '0.5rem' }}>string</td>
                  <td style={{ padding: '0.5rem' }}>''</td>
                  <td style={{ padding: '0.5rem' }}>Additional CSS classes</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </Container>
    </div>
  )
}