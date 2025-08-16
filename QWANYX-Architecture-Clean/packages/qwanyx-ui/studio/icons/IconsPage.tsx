import React, { useState, useMemo } from 'react'
import { Icon } from '../../src/components/Icon'
import { Container } from '../../src/components/Container'
import { Heading, Text } from '../../src/components/Text'
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/Card'
import { Grid } from '../../src/components/Container'
import { Input } from '../../src/components/Input'
import { SimpleSelect } from '../../src/components/SimpleSelect'
import { Button } from '../../src/components/Button'
import * as LucideIcons from 'lucide-react'

// Organized icon categories
const iconCategories = {
  'Navigation': [
    'Menu', 'X', 'ChevronDown', 'ChevronUp', 'ChevronLeft', 'ChevronRight',
    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'ArrowUpRight', 'ArrowDownLeft',
    'MoveLeft', 'MoveRight', 'MoveUp', 'MoveDown', 'CornerDownLeft', 'CornerUpRight'
  ],
  'Actions': [
    'Search', 'Filter', 'Plus', 'Minus', 'Check', 'Copy', 'Download', 'Upload',
    'Edit', 'Edit2', 'Edit3', 'Trash2', 'Save', 'RefreshCw', 'RotateCcw', 'RotateCw',
    'Share', 'Share2', 'Send', 'Bookmark', 'Archive', 'Inbox'
  ],
  'User Interface': [
    'Home', 'User', 'Users', 'UserPlus', 'UserMinus', 'UserCheck', 'UserX',
    'Mail', 'Phone', 'Calendar', 'Clock', 'Star', 'Heart', 'Eye', 'EyeOff',
    'Lock', 'Unlock', 'Key', 'Settings', 'Settings2', 'Sliders'
  ],
  'Status & Alerts': [
    'AlertCircle', 'AlertTriangle', 'Info', 'CheckCircle', 'XCircle', 'HelpCircle',
    'Bell', 'BellOff', 'BellRing', 'MessageSquare', 'MessageCircle', 'Activity'
  ],
  'Media': [
    'Image', 'Camera', 'Video', 'Film', 'Music', 'Mic', 'MicOff', 'Volume', 'Volume1', 
    'Volume2', 'VolumeX', 'Play', 'Pause', 'PlayCircle', 'PauseCircle', 'SkipBack', 'SkipForward'
  ],
  'Files & Documents': [
    'File', 'FileText', 'FilePlus', 'FileMinus', 'FileCheck', 'FileX',
    'Folder', 'FolderOpen', 'FolderPlus', 'FolderMinus', 'Paperclip', 'FileCode'
  ],
  'Commerce': [
    'ShoppingCart', 'ShoppingBag', 'CreditCard', 'DollarSign', 'Euro', 'PoundSterling',
    'Tag', 'Tags', 'Gift', 'Package', 'Package2', 'Truck', 'Receipt', 'Percent'
  ],
  'Technology': [
    'Wifi', 'WifiOff', 'Bluetooth', 'Database', 'Server', 'Cloud', 'CloudOff',
    'Globe', 'Globe2', 'Monitor', 'Smartphone', 'Tablet', 'Laptop', 'HardDrive',
    'Cpu', 'Battery', 'BatteryCharging'
  ],
  'Social': [
    'Github', 'Gitlab', 'Youtube', 'Twitch', 'Chrome'
  ],
  'Weather & Nature': [
    'Sun', 'Moon', 'Cloud', 'CloudRain', 'CloudSnow', 'CloudLightning',
    'Wind', 'Droplet', 'Umbrella', 'Thermometer', 'Sunrise', 'Sunset'
  ],
  'Automotive': [
    'Car', 'Truck', 'Bike', 'Bus', 'Train', 'Plane',
    'Wrench', 'Hammer', 'Shield', 'Zap', 'Gauge', 'Fuel'
  ],
  'Layout & Design': [
    'Grid', 'Grid3x3', 'List', 'Layers', 'Layout', 'LayoutGrid', 'LayoutList',
    'Sidebar', 'PanelLeft', 'PanelRight', 'PanelTop', 'PanelBottom',
    'Columns', 'Rows', 'AlignLeft', 'AlignCenter', 'AlignRight', 'AlignJustify'
  ]
}

export const IconsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSize, setSelectedSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('lg')
  const [selectedVariant, setSelectedVariant] = useState<'thin' | 'outline' | 'bold'>('outline')
  const [selectedColor, setSelectedColor] = useState('#000000')
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Get all available Lucide icons
  const allIcons = useMemo(() => {
    return Object.keys(LucideIcons).filter(
      key => typeof LucideIcons[key as keyof typeof LucideIcons] === 'function' && 
      !key.includes('Icon') && 
      key !== 'createLucideIcon'
    )
  }, [])

  // Filter icons based on search and category
  const filteredIcons = useMemo(() => {
    let icons = allIcons
    
    // Filter by category
    if (selectedCategory !== 'all') {
      const categoryIcons = iconCategories[selectedCategory as keyof typeof iconCategories] || []
      icons = icons.filter(icon => categoryIcons.includes(icon))
    }
    
    // Filter by search term
    if (searchTerm) {
      icons = icons.filter(icon => 
        icon.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    return icons
  }, [allIcons, searchTerm, selectedCategory])

  const handleCopyIcon = (iconName: string) => {
    const code = `<Icon name="${iconName}" size="${selectedSize}" variant="${selectedVariant}" />`
    navigator.clipboard.writeText(code)
    setCopiedIcon(iconName)
    setTimeout(() => setCopiedIcon(null), 2000)
  }

  const handleCopyImport = () => {
    navigator.clipboard.writeText(`import { Icon } from '@qwanyx/ui'`)
    alert('Import statement copied to clipboard!')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Container>
        {/* Header */}
        <div style={{ padding: '3rem 0 2rem' }}>
          <Heading size="4xl" style={{ marginBottom: '0.5rem' }}>
            Icon Library
          </Heading>
          <Text size="lg" style={{ color: '#6b7280' }}>
            Browse and search through {allIcons.length} Lucide React icons
          </Text>
        </div>

        {/* Controls */}
        <Card style={{ marginBottom: '2rem', position: 'sticky', top: '1rem', zIndex: 10 }}>
          <CardContent>
            <Grid cols={2} style={{ gap: '2rem', marginBottom: '1rem' }}>
              <div>
                <Grid cols={3} style={{ gap: '1rem' }}>
                  <div>
                    <Text weight="semibold" size="sm" style={{ marginBottom: '0.5rem' }}>Search</Text>
                    <Input
                      placeholder="Search icons..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <Text weight="semibold" size="sm" style={{ marginBottom: '0.5rem' }}>Category</Text>
                    <SimpleSelect
                      value={selectedCategory}
                      options={[
                        { value: 'all', label: 'All Categories' },
                        ...Object.keys(iconCategories).map(cat => ({ value: cat, label: cat }))
                      ]}
                      onChange={(e) => setSelectedCategory((e.target as HTMLSelectElement).value)}
                    />
                  </div>
                  <div>
                    <Text weight="semibold" size="sm" style={{ marginBottom: '0.5rem' }}>View Mode</Text>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button
                        size="sm"
                        variant={viewMode === 'grid' ? 'solid' : 'outline'}
                        onClick={() => setViewMode('grid')}
                      >
                        <Icon name="Grid" size="sm" />
                      </Button>
                      <Button
                        size="sm"
                        variant={viewMode === 'list' ? 'solid' : 'outline'}
                        onClick={() => setViewMode('list')}
                      >
                        <Icon name="List" size="sm" />
                      </Button>
                    </div>
                  </div>
                </Grid>
              </div>
              
              <div>
                <Grid cols={4} style={{ gap: '1rem' }}>
                  <div>
                    <Text weight="semibold" size="sm" style={{ marginBottom: '0.5rem' }}>Size</Text>
                    <SimpleSelect
                      value={selectedSize}
                      options={[
                        { value: 'xs', label: 'XS' },
                        { value: 'sm', label: 'SM' },
                        { value: 'md', label: 'MD' },
                        { value: 'lg', label: 'LG' },
                        { value: 'xl', label: 'XL' }
                      ]}
                      onChange={(e) => setSelectedSize((e.target as HTMLSelectElement).value as any)}
                    />
                  </div>
                  <div>
                    <Text weight="semibold" size="sm" style={{ marginBottom: '0.5rem' }}>Variant</Text>
                    <SimpleSelect
                      value={selectedVariant}
                      options={[
                        { value: 'thin', label: 'Thin' },
                        { value: 'outline', label: 'Outline' },
                        { value: 'bold', label: 'Bold' }
                      ]}
                      onChange={(e) => setSelectedVariant((e.target as HTMLSelectElement).value as any)}
                    />
                  </div>
                  <div>
                    <Text weight="semibold" size="sm" style={{ marginBottom: '0.5rem' }}>Color</Text>
                    <Input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      style={{ height: '38px', cursor: 'pointer' }}
                    />
                  </div>
                  <div>
                    <Text weight="semibold" size="sm" style={{ marginBottom: '0.5rem' }}>&nbsp;</Text>
                    <Button onClick={handleCopyImport} variant="outline" size="sm">
                      Copy Import
                    </Button>
                  </div>
                </Grid>
              </div>
            </Grid>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text size="sm" style={{ color: '#6b7280' }}>
                Showing {filteredIcons.length} of {allIcons.length} icons
              </Text>
              <Button 
                onClick={() => { 
                  setSearchTerm(''); 
                  setSelectedCategory('all');
                  setSelectedColor('#000000');
                  setSelectedVariant('outline');
                  setSelectedSize('lg');
                }}
                variant="ghost"
                size="sm"
              >
                Reset All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Icon Grid/List */}
        {viewMode === 'grid' ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: '1rem',
            marginBottom: '3rem'
          }}>
            {filteredIcons.map(iconName => (
              <Card
                key={iconName}
                onClick={() => handleCopyIcon(iconName)}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: copiedIcon === iconName ? '#10b981' : 'white',
                  transform: copiedIcon === iconName ? 'scale(0.95)' : 'scale(1)',
                }}
                className="hover-lift"
              >
                <CardContent style={{ 
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '120px'
                }}>
                  <Icon 
                    name={iconName} 
                    size={selectedSize} 
                    color={copiedIcon === iconName ? 'white' : selectedColor}
                    variant={selectedVariant}
                  />
                  <Text 
                    size="xs" 
                    style={{ 
                      marginTop: '0.75rem',
                      color: copiedIcon === iconName ? 'white' : '#374151',
                      fontWeight: 500,
                      textAlign: 'center',
                      wordBreak: 'break-word'
                    }}
                  >
                    {copiedIcon === iconName ? 'Copied!' : iconName}
                  </Text>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div style={{ marginBottom: '3rem' }}>
            {filteredIcons.map(iconName => (
              <Card
                key={iconName}
                onClick={() => handleCopyIcon(iconName)}
                style={{
                  marginBottom: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: copiedIcon === iconName ? '#10b981' : 'white',
                }}
                className="hover-lift"
              >
                <CardContent style={{ 
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <Icon 
                    name={iconName} 
                    size={selectedSize} 
                    color={copiedIcon === iconName ? 'white' : selectedColor}
                    variant={selectedVariant}
                  />
                  <Text 
                    style={{ 
                      flex: 1,
                      color: copiedIcon === iconName ? 'white' : '#374151',
                      fontWeight: 500
                    }}
                  >
                    {iconName}
                  </Text>
                  <Text 
                    size="sm"
                    style={{ 
                      color: copiedIcon === iconName ? 'white' : '#6b7280',
                      fontFamily: 'monospace'
                    }}
                  >
                    {copiedIcon === iconName ? 'Copied!' : `<Icon name="${iconName}" />`}
                  </Text>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Reference */}
        <Card style={{ marginBottom: '3rem' }}>
          <CardHeader>
            <CardTitle>Quick Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols={2} style={{ gap: '2rem' }}>
              <div>
                <Heading size="md" style={{ marginBottom: '1rem' }}>Basic Usage</Heading>
                <pre style={{ 
                  background: '#f3f4f6', 
                  padding: '1rem', 
                  borderRadius: '0.5rem',
                  overflow: 'auto'
                }}>
                  <code>{`import { Icon } from '@qwanyx/ui'

// Basic icon
<Icon name="Search" />

// With size
<Icon name="Heart" size="lg" />

// With color
<Icon name="Star" color="#FFD700" />

// With variant
<Icon name="Settings" variant="bold" />`}</code>
                </pre>
              </div>
              
              <div>
                <Heading size="md" style={{ marginBottom: '1rem' }}>Props</Heading>
                <div style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem' }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <Text weight="semibold">name</Text>: string (required)
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <Text weight="semibold">size</Text>: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <Text weight="semibold">color</Text>: string (CSS color)
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <Text weight="semibold">variant</Text>: 'thin' | 'outline' | 'bold'
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <Text weight="semibold">strokeWidth</Text>: number (overrides variant)
                  </div>
                  <div>
                    <Text weight="semibold">className</Text>: string
                  </div>
                </div>
              </div>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </div>
  )
}