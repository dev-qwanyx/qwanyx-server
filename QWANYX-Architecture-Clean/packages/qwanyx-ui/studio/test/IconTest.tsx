import React, { useState } from 'react'
import { Icon } from '../../src/components/Icon'
import { Container } from '../../src/components/Container'
import { Heading, Text } from '../../src/components/Text'
import { Card, CardContent } from '../../src/components/Card'
import { Button } from '../../src/components/Button'

const iconTestCases = [
  // Case sensitivity tests
  { name: 'car', label: 'Car (lowercase)' },
  { name: 'Car', label: 'Car (proper case)' },
  { name: 'CAR', label: 'Car (uppercase)' },
  
  // Common icons
  { name: 'Search', label: 'Search' },
  { name: 'Menu', label: 'Menu' },
  { name: 'Settings', label: 'Settings' },
  { name: 'Home', label: 'Home' },
  { name: 'User', label: 'User' },
  { name: 'Heart', label: 'Heart' },
  { name: 'Star', label: 'Star' },
  { name: 'ShoppingCart', label: 'Shopping Cart' },
  
  // Icons with different names in Lucide
  { name: 'Trash', label: 'Trash (maps to Trash2)' },
  { name: 'Volume', label: 'Volume (maps to Volume2)' },
  
  // Different sizes
  { name: 'Palette', label: 'Palette XS', size: 'xs' as const },
  { name: 'Palette', label: 'Palette SM', size: 'sm' as const },
  { name: 'Palette', label: 'Palette MD', size: 'md' as const },
  { name: 'Palette', label: 'Palette LG', size: 'lg' as const },
  { name: 'Palette', label: 'Palette XL', size: 'xl' as const },
  
  // Different colors (using theme colors)
  { name: 'Heart', label: 'Error Heart', color: 'error' as const },
  { name: 'Star', label: 'Warning Star', color: 'warning' as const },
  { name: 'CheckCircle', label: 'Success Check', color: 'success' as const },
  { name: 'AlertCircle', label: 'Info Alert', color: 'info' as const },
]

const variantExamples = [
  'Heart', 'Star', 'Bell', 'Mail', 'Settings', 'Home', 
  'User', 'ShoppingCart', 'Calendar', 'Clock', 'Download', 'Upload'
]

export const IconTest: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<'outlined' | 'filled' | 'rounded' | 'sharp'>('outlined')
  
  return (
    <Container>
      <div style={{ padding: '2rem' }}>
        <Heading size="2xl" style={{ marginBottom: '2rem' }}>
          Icon Component Test Suite
        </Heading>
        
        {/* Variant Showcase */}
        <Card style={{ marginBottom: '2rem' }}>
          <CardContent>
            <Heading size="lg" style={{ marginBottom: '1rem' }}>
              Icon Variants
            </Heading>
            <Text style={{ marginBottom: '1rem' }}>
              Google Material Symbols support different visual styles. Choose a variant:
            </Text>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
              <Button 
                variant={selectedVariant === 'outlined' ? 'solid' : 'outline'}
                size="sm"
                onClick={() => setSelectedVariant('outlined')}
              >
                Outlined (Default)
              </Button>
              <Button 
                variant={selectedVariant === 'filled' ? 'solid' : 'outline'}
                size="sm"
                onClick={() => setSelectedVariant('filled')}
              >
                Filled
              </Button>
              <Button 
                variant={selectedVariant === 'rounded' ? 'solid' : 'outline'}
                size="sm"
                onClick={() => setSelectedVariant('rounded')}
              >
                Rounded
              </Button>
              <Button 
                variant={selectedVariant === 'sharp' ? 'solid' : 'outline'}
                size="sm"
                onClick={() => setSelectedVariant('sharp')}
              >
                Sharp
              </Button>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
              gap: '1rem'
            }}>
              {variantExamples.map((iconName) => (
                <div 
                  key={iconName}
                  style={{
                    padding: '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    textAlign: 'center',
                    background: '#f9fafb'
                  }}
                >
                  <div style={{ marginBottom: '0.5rem' }}>
                    <Icon 
                      name={iconName} 
                      size="lg"
                      variant={selectedVariant}
                    />
                  </div>
                  <Text size="xs" style={{ fontWeight: 600 }}>
                    {iconName}
                  </Text>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card style={{ marginBottom: '2rem' }}>
          <CardContent>
            <Heading size="lg" style={{ marginBottom: '1rem' }}>
              Icon Test Cases
            </Heading>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '1rem'
            }}>
              {iconTestCases.map((test, index) => (
                <div 
                  key={index}
                  style={{
                    padding: '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    textAlign: 'center',
                    background: '#f9fafb'
                  }}
                >
                  <div style={{ marginBottom: '0.5rem' }}>
                    <Icon 
                      name={test.name} 
                      size={test.size || 'md'}
                      color={test.color as any}
                    />
                  </div>
                  <Text size="xs" style={{ fontWeight: 600 }}>
                    {test.label}
                  </Text>
                  <Text size="xs" style={{ color: '#6b7280' }}>
                    "{test.name}"
                  </Text>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Heading size="lg" style={{ marginBottom: '1rem' }}>
              Test Summary
            </Heading>
            <Text>
              This page tests various aspects of the Icon component:
            </Text>
            <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
              <li>Case-insensitive icon name matching</li>
              <li>Icon name aliases (Trash → Trash2, Volume → Volume2)</li>
              <li>Different sizes (xs, sm, md, lg, xl)</li>
              <li>Custom colors</li>
              <li>All commonly used icons from Lucide React</li>
            </ul>
            <Text style={{ marginTop: '1rem', color: '#059669', fontWeight: 600 }}>
              ✓ If you see icons above instead of gray placeholders, the Icon component is working correctly!
            </Text>
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}