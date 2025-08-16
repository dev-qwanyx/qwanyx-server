import React, { useState } from 'react'
import { Icon } from '../../src/components/Icon'
import { Container } from '../../src/components/Container'
import { Heading, Text } from '../../src/components/Text'
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/Card'
import { Grid } from '../../src/components/Container'
import { Input } from '../../src/components/Input'
import { SimpleSelect } from '../../src/components/SimpleSelect'
import { Button } from '../../src/components/Button'
// Lucide removed - using Google Material Symbols now
// import * as LucideIcons from 'lucide-react'

export const IconShowcase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSize, setSelectedSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md')
  const [selectedColor, setSelectedColor] = useState('#000000')
  const [selectedVariant, setSelectedVariant] = useState<'thin' | 'outline' | 'bold'>('outline')
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null)

  // List of available Material Symbols icons (subset for demo)
  const allIcons = [
    'home', 'search', 'settings', 'person', 'mail', 'phone', 'calendar_today',
    'dashboard', 'analytics', 'shopping_cart', 'favorite', 'star', 'delete',
    'edit', 'save', 'share', 'download', 'upload', 'print', 'refresh'
  ]

  // Filter icons based on search
  const filteredIcons = allIcons.filter(icon => 
    icon.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCopyIcon = (iconName: string) => {
    navigator.clipboard.writeText(`<Icon name="${iconName}" />`)
    setCopiedIcon(iconName)
    setTimeout(() => setCopiedIcon(null), 2000)
  }

  const iconCategories = {
    'Navigation': ['Menu', 'X', 'ChevronDown', 'ChevronUp', 'ChevronLeft', 'ChevronRight', 'ArrowLeft', 'ArrowRight'],
    'Actions': ['Search', 'Filter', 'Plus', 'Minus', 'Check', 'Copy', 'Download', 'Upload', 'Edit', 'Trash', 'Save'],
    'UI Elements': ['Home', 'User', 'Users', 'Mail', 'Phone', 'Calendar', 'Clock', 'Star', 'Heart', 'Eye', 'Lock'],
    'Status': ['AlertCircle', 'AlertTriangle', 'Info', 'CheckCircle', 'XCircle', 'HelpCircle'],
    'Commerce': ['ShoppingCart', 'ShoppingBag', 'CreditCard', 'DollarSign', 'Tag', 'Gift', 'Package', 'Truck'],
    'Automotive': ['Car', 'Wrench', 'Shield', 'Zap', 'Activity', 'Settings', 'Gauge']
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Container>
        <Heading size="3xl" style={{ marginBottom: '1rem' }}>
          Icon Library
        </Heading>
        <Text size="lg" style={{ marginBottom: '2rem' }}>
          Lucide React icons integrated with the qwanyx-ui design system. Click any icon to copy its usage.
        </Text>

        {/* Controls */}
        <Card style={{ marginBottom: '2rem' }}>
          <CardContent>
            <Grid cols={4} style={{ gap: '1rem', alignItems: 'end' }}>
              <div>
                <Text weight="semibold" style={{ marginBottom: '0.5rem' }}>Search Icons</Text>
                <Input
                  placeholder="Search icons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Text weight="semibold" style={{ marginBottom: '0.5rem' }}>Size</Text>
                <SimpleSelect
                  value={selectedSize}
                  options={[
                    { value: 'xs', label: 'Extra Small' },
                    { value: 'sm', label: 'Small' },
                    { value: 'md', label: 'Medium' },
                    { value: 'lg', label: 'Large' },
                    { value: 'xl', label: 'Extra Large' }
                  ]}
                  onChange={(e) => setSelectedSize((e.target as HTMLSelectElement).value as any)}
                />
              </div>
              <div>
                <Text weight="semibold" style={{ marginBottom: '0.5rem' }}>Variant</Text>
                <SimpleSelect
                  value={selectedVariant}
                  options={[
                    { value: 'thin', label: 'Thin (1px)' },
                    { value: 'outline', label: 'Outline (2px)' },
                    { value: 'bold', label: 'Bold (3px)' }
                  ]}
                  onChange={(e) => setSelectedVariant((e.target as HTMLSelectElement).value as any)}
                />
              </div>
              <div>
                <Text weight="semibold" style={{ marginBottom: '0.5rem' }}>Color</Text>
                <Input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  style={{ height: '38px', cursor: 'pointer' }}
                />
              </div>
              <Button onClick={() => { setSearchTerm(''); setSelectedColor('#000000'); setSelectedVariant('outline'); }}>
                Reset
              </Button>
            </Grid>
          </CardContent>
        </Card>

        {/* Usage Example */}
        <Card style={{ marginBottom: '2rem' }}>
          <CardHeader>
            <CardTitle>Usage Example</CardTitle>
          </CardHeader>
          <CardContent>
            <pre style={{ 
              background: '#f3f4f6', 
              padding: '1rem', 
              borderRadius: '0.5rem',
              overflow: 'auto'
            }}>
              <code>{`import { Icon } from '@qwanyx/ui'

// Basic usage
<Icon name="Search" />

// With size
<Icon name="Heart" size="lg" />

// With custom color
<Icon name="Star" color="#FFD700" />

// With variant (thin, outline, bold, filled)
<Icon name="Settings" variant="bold" />

// With custom size in pixels
<Icon name="Phone" size={32} />

// Combined props
<Icon name="Bell" size="lg" color="#3b82f6" variant="thin" />

// In a button
<Button>
  <Icon name="Plus" size="sm" variant="bold" />
  Add Item
</Button>`}</code>
            </pre>
          </CardContent>
        </Card>

        {/* Categories */}
        {searchTerm === '' ? (
          <>
            {Object.entries(iconCategories).map(([category, icons]) => (
              <Card key={category} style={{ marginBottom: '2rem' }}>
                <CardHeader>
                  <CardTitle>{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '1rem'
                  }}>
                    {icons.map(iconName => (
                      <button
                        key={iconName}
                        onClick={() => handleCopyIcon(iconName)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '1rem',
                          background: copiedIcon === iconName ? '#10b981' : '#f9fafb',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                          if (copiedIcon !== iconName) {
                            e.currentTarget.style.background = '#f3f4f6'
                            e.currentTarget.style.transform = 'translateY(-2px)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (copiedIcon !== iconName) {
                            e.currentTarget.style.background = '#f9fafb'
                            e.currentTarget.style.transform = 'translateY(0)'
                          }
                        }}
                      >
                        <Icon name={iconName} size={selectedSize} color={copiedIcon === iconName ? 'white' : selectedColor} variant={selectedVariant} />
                        <Text size="xs" style={{ 
                          marginTop: '0.5rem',
                          color: copiedIcon === iconName ? 'white' : undefined
                        }}>
                          {copiedIcon === iconName ? 'Copied!' : iconName}
                        </Text>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Search Results ({filteredIcons.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '1rem'
              }}>
                {filteredIcons.slice(0, 100).map(iconName => (
                  <button
                    key={iconName}
                    onClick={() => handleCopyIcon(iconName)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '1rem',
                      background: copiedIcon === iconName ? '#10b981' : '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (copiedIcon !== iconName) {
                        e.currentTarget.style.background = '#f3f4f6'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (copiedIcon !== iconName) {
                        e.currentTarget.style.background = '#f9fafb'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }
                    }}
                  >
                    <Icon name={iconName} size={selectedSize} color={copiedIcon === iconName ? 'white' : selectedColor} variant={selectedVariant} />
                    <Text size="xs" style={{ 
                      marginTop: '0.5rem',
                      color: copiedIcon === iconName ? 'white' : undefined
                    }}>
                      {copiedIcon === iconName ? 'Copied!' : iconName}
                    </Text>
                  </button>
                ))}
              </div>
              {filteredIcons.length > 100 && (
                <Text size="sm" style={{ marginTop: '1rem', textAlign: 'center', color: '#6b7280' }}>
                  Showing first 100 results. Refine your search to see more.
                </Text>
              )}
            </CardContent>
          </Card>
        )}
      </Container>
    </div>
  )
}