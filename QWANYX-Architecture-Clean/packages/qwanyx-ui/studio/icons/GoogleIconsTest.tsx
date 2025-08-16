import React, { useState } from 'react'
import { Icon } from '../../src/components/Icon'
import { Container } from '../../src/components/Container'
import { Heading, Text } from '../../src/components/Text'
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/Card'
import { Grid } from '../../src/components/Container'
import { SimpleSelect } from '../../src/components/SimpleSelect'

// Common Material Symbols icons
const testIcons = [
  'home', 'search', 'settings', 'person', 'mail', 'phone', 'calendar_today',
  'dashboard', 'analytics', 'shopping_cart', 'favorite', 'star', 'delete',
  'edit', 'save', 'share', 'download', 'upload', 'print', 'refresh',
  'lock', 'lock_open', 'visibility', 'visibility_off', 'notifications',
  'menu', 'close', 'expand_more', 'expand_less', 'chevron_left', 'chevron_right',
  'add', 'remove', 'check', 'error', 'warning', 'info', 'help'
]

export const GoogleIconsTest: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md')
  const [selectedColor, setSelectedColor] = useState<'primary' | 'secondary' | 'accent' | 'inherit'>('primary')
  const [selectedVariant, setSelectedVariant] = useState<'outlined' | 'filled' | 'rounded' | 'sharp'>('outlined')

  return (
    <Container>
      <div style={{ padding: '2rem 0' }}>
        <Heading size="3xl" style={{ marginBottom: '2rem' }}>
          Google Material Symbols Test
        </Heading>

        {/* Controls */}
        <Card style={{ marginBottom: '2rem' }}>
          <CardHeader>
            <CardTitle>Icon Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols={3} style={{ gap: '1rem' }}>
              <div>
                <Text weight="semibold" size="sm" style={{ marginBottom: '0.5rem' }}>Size</Text>
                <SimpleSelect
                  value={selectedSize}
                  options={[
                    { value: 'xs', label: 'XS (16px)' },
                    { value: 'sm', label: 'SM (20px)' },
                    { value: 'md', label: 'MD (24px)' },
                    { value: 'lg', label: 'LG (32px)' },
                    { value: 'xl', label: 'XL (40px)' }
                  ]}
                  onChange={(e) => setSelectedSize((e.target as HTMLSelectElement).value as any)}
                />
              </div>
              <div>
                <Text weight="semibold" size="sm" style={{ marginBottom: '0.5rem' }}>Color</Text>
                <SimpleSelect
                  value={selectedColor}
                  options={[
                    { value: 'primary', label: 'Primary' },
                    { value: 'secondary', label: 'Secondary' },
                    { value: 'accent', label: 'Accent' },
                    { value: 'inherit', label: 'Inherit' }
                  ]}
                  onChange={(e) => setSelectedColor((e.target as HTMLSelectElement).value as any)}
                />
              </div>
              <div>
                <Text weight="semibold" size="sm" style={{ marginBottom: '0.5rem' }}>Variant</Text>
                <SimpleSelect
                  value={selectedVariant}
                  options={[
                    { value: 'outlined', label: 'Outlined' },
                    { value: 'filled', label: 'Filled' },
                    { value: 'rounded', label: 'Rounded' },
                    { value: 'sharp', label: 'Sharp' }
                  ]}
                  onChange={(e) => setSelectedVariant((e.target as HTMLSelectElement).value as any)}
                />
              </div>
            </Grid>
          </CardContent>
        </Card>

        {/* Test using Icon component */}
        <Card style={{ marginBottom: '2rem' }}>
          <CardHeader>
            <CardTitle>Using Icon Component</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
              gap: '1rem'
            }}>
              {testIcons.map(iconName => (
                <div key={iconName} style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  padding: '0.5rem',
                  border: '1px solid var(--border)',
                  borderRadius: '4px'
                }}>
                  <Icon 
                    name={iconName} 
                    size={selectedSize}
                    color={selectedColor}
                    variant={selectedVariant}
                  />
                  <Text size="xs" style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                    {iconName}
                  </Text>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>


        {/* Raw HTML test */}
        <Card style={{ marginTop: '2rem' }}>
          <CardHeader>
            <CardTitle>Raw HTML Test (Direct Font Usage)</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>
                home
              </span>
              <span className="material-symbols-filled" style={{ fontSize: '48px' }}>
                favorite
              </span>
              <span className="material-symbols-rounded" style={{ fontSize: '48px' }}>
                settings
              </span>
              <span className="material-symbols-sharp" style={{ fontSize: '48px' }}>
                dashboard
              </span>
            </div>
            <Text size="sm" style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
              If you see icons above, Google Material Symbols fonts are loading correctly!
            </Text>
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}