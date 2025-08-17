import React, { useState, useMemo } from 'react'
import { Icon } from '../../src/components/Icon'
import { Container } from '../../src/components/Container'
import { Heading, Text } from '../../src/components/Text'
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/Card'
import { Grid, GridItem } from '../../src/components/Grid'
import { Flex, FlexItem } from '../../src/components/Flex'
import { HStack, VStack } from '../../src/components/Stack'
import { Input } from '../../src/components/Input'
import { SimpleSelect } from '../../src/components/SimpleSelect'
import { Button } from '../../src/components/Button'
import { useTheme } from '../../src/providers/ThemeProvider'

// Organized icon categories with Material Symbols (snake_case names)
const iconCategories = {
  'Navigation': [
    'menu', 'close', 'arrow_back', 'arrow_forward', 'arrow_upward', 'arrow_downward',
    'keyboard_arrow_down', 'keyboard_arrow_up', 'keyboard_arrow_left', 'keyboard_arrow_right',
    'expand_more', 'expand_less', 'chevron_left', 'chevron_right', 'more_vert', 'more_horiz'
  ],
  'Actions': [
    'search', 'home', 'settings', 'done', 'add', 'remove', 'delete', 'edit',
    'save', 'share', 'download', 'upload', 'content_copy', 'content_paste',
    'refresh', 'sync', 'print', 'send', 'archive', 'unarchive'
  ],
  'User & Account': [
    'person', 'group', 'person_add', 'person_remove', 'account_circle', 'account_box',
    'supervised_user_circle', 'manage_accounts', 'badge', 'contact_mail', 'contacts'
  ],
  'Communication': [
    'email', 'mail', 'message', 'chat', 'forum', 'question_answer',
    'phone', 'phone_in_talk', 'voicemail', 'dialer_sip', 'contact_phone',
    'notifications', 'notifications_active', 'notifications_off', 'notification_add'
  ],
  'Media': [
    'image', 'photo_camera', 'photo_library', 'collections', 'panorama',
    'videocam', 'video_library', 'movie', 'theaters', 'music_note',
    'album', 'mic', 'mic_off', 'volume_up', 'volume_down', 'volume_mute', 'volume_off',
    'play_arrow', 'pause', 'stop', 'skip_next', 'skip_previous', 'fast_forward', 'fast_rewind'
  ],
  'Files & Folders': [
    'folder', 'folder_open', 'create_new_folder', 'folder_shared', 'folder_special',
    'insert_drive_file', 'description', 'article', 'file_copy', 'attach_file',
    'cloud_upload', 'cloud_download', 'cloud', 'cloud_done', 'cloud_off'
  ],
  'Status & Alerts': [
    'check_circle', 'cancel', 'error', 'warning', 'info', 'help',
    'check_circle_outline', 'error_outline', 'warning', 'info',
    'report_problem', 'announcement', 'feedback', 'new_releases'
  ],
  'Commerce': [
    'shopping_cart', 'shopping_bag', 'store', 'storefront', 'local_mall',
    'add_shopping_cart', 'remove_shopping_cart', 'payment', 'credit_card',
    'attach_money', 'monetization_on', 'euro', 'local_offer', 'loyalty',
    'card_giftcard', 'sell', 'inventory', 'local_shipping', 'receipt'
  ]
}

export const IconLibraryPage: React.FC = () => {
  const { theme } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSize, setSelectedSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('lg')
  const [selectedColor, setSelectedColor] = useState('foreground')
  const [selectedVariant, setSelectedVariant] = useState<'filled' | 'outlined' | 'rounded' | 'sharp'>('outlined')
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Get the actual color value from theme
  const getThemeColor = (colorName: string) => {
    if (colorName === 'currentColor') return 'currentColor'
    return theme.colors[colorName as keyof typeof theme.colors] || theme.colors.foreground
  }

  // Get icons based on category and search
  const displayIcons = useMemo(() => {
    let icons: string[] = []
    
    if (selectedCategory === 'all') {
      // Show all icons from all categories
      icons = Object.values(iconCategories).flat()
    } else {
      icons = iconCategories[selectedCategory as keyof typeof iconCategories] || []
    }
    
    // Filter by search term
    if (searchTerm) {
      icons = icons.filter(icon => 
        icon.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Remove duplicates
    return [...new Set(icons)]
  }, [searchTerm, selectedCategory])

  const handleCopyIcon = (iconName: string) => {
    const code = `<Icon name="${iconName}" size="${selectedSize}" />`
    navigator.clipboard.writeText(code)
    setCopiedIcon(iconName)
    setTimeout(() => setCopiedIcon(null), 2000)
  }

  const handleCopyImport = () => {
    navigator.clipboard.writeText(`import { Icon } from '@qwanyx/ui'`)
    alert('Import statement copied to clipboard!')
  }

  return (
    <Container>
      {/* Controls - Sticky at top */}
      <Card style={{ 
        marginBottom: '0.5rem',
        position: 'sticky', 
        top: '0', 
        zIndex: 10,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        borderRadius: '0'
      }}>
          <CardContent style={{ padding: '12px 1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {/* First row of controls */}
              <Flex gap="sm" wrap="wrap" align="center" style={{ width: '100%' }}>
                <FlexItem grow={2} style={{ minWidth: '180px' }}>
                  <Input
                    placeholder="Search icons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </FlexItem>
                
                <FlexItem grow={1} style={{ minWidth: '140px' }}>
                  <SimpleSelect
                    value={selectedCategory}
                    options={[
                      { value: 'all', label: 'All Categories' },
                      ...Object.keys(iconCategories).map(cat => ({ value: cat, label: cat }))
                    ]}
                    onChange={(e) => setSelectedCategory((e.target as HTMLSelectElement).value)}
                    style={{ width: '100%' }}
                  />
                </FlexItem>

                <FlexItem style={{ minWidth: '100px' }}>
                  <SimpleSelect
                    value={selectedVariant}
                    options={[
                      { value: 'outlined', label: 'Outlined' },
                      { value: 'filled', label: 'Filled' },
                      { value: 'rounded', label: 'Rounded' },
                      { value: 'sharp', label: 'Sharp' }
                    ]}
                    onChange={(e) => setSelectedVariant((e.target as HTMLSelectElement).value as any)}
                    style={{ width: '100%' }}
                  />
                </FlexItem>

                <FlexItem style={{ minWidth: '70px' }}>
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
                    style={{ width: '100%' }}
                  />
                </FlexItem>

                <FlexItem grow={1} style={{ minWidth: '120px' }}>
                  <HStack spacing="xs" align="center" style={{ width: '100%' }}>
                    <SimpleSelect
                      value={selectedColor}
                      options={[
                        { value: 'foreground', label: 'Default' },
                        { value: 'primary', label: 'Primary' },
                        { value: 'secondary', label: 'Secondary' },
                        { value: 'accent', label: 'Accent' },
                        { value: 'success', label: 'Success' },
                        { value: 'warning', label: 'Warning' },
                        { value: 'error', label: 'Error' },
                        { value: 'info', label: 'Info' },
                        { value: 'muted', label: 'Muted' },
                        { value: 'inherit', label: 'Inherit' }
                      ]}
                      onChange={(e) => setSelectedColor((e.target as HTMLSelectElement).value)}
                      style={{ flex: 1 }}
                    />
                    <span style={{
                      display: 'inline-block',
                      width: '20px',
                      height: '20px',
                      backgroundColor: getThemeColor(selectedColor),
                      border: '1px solid rgb(var(--border))',
                      borderRadius: '4px'
                    }} />
                  </HStack>
                </FlexItem>

                <FlexItem>
                  <HStack spacing="xs">
                    <Button
                      size="sm"
                      variant={viewMode === 'grid' ? 'solid' : 'outline'}
                      onClick={() => setViewMode('grid')}
                      title="Grid View"
                    >
                      <Icon name="grid_view" size="sm" />
                    </Button>
                    <Button
                      size="sm"
                      variant={viewMode === 'list' ? 'solid' : 'outline'}
                      onClick={() => setViewMode('list')}
                      title="List View"
                    >
                      <Icon name="list" size="sm" />
                    </Button>
                  </HStack>
                </FlexItem>

                <FlexItem>
                  <Button onClick={handleCopyImport} variant="outline" size="sm">
                    Copy Import
                  </Button>
                </FlexItem>
              </Flex>
              
              {/* Stats and reset in same row */}
              <HStack justify="between" align="center" style={{ width: '100%' }}>
                <Text size="xs" style={{ color: 'rgb(var(--text-muted))' }}>
                  {displayIcons.length} icons
                </Text>
                <Button 
                  onClick={() => { 
                    setSearchTerm(''); 
                    setSelectedCategory('all');
                    setSelectedColor('foreground');
                    setSelectedSize('lg');
                    setSelectedVariant('outlined');
                  }}
                  variant="ghost"
                  size="xs"
                >
                  Reset
                </Button>
              </HStack>
            </div>
          </CardContent>
        </Card>

        {/* Icon Grid/List */}
        {viewMode === 'grid' ? (
          <Grid 
            columns="auto" 
            minChildWidth="140px"
            gap="sm"
            style={{ marginTop: '0.5rem', marginBottom: '1rem' }}
          >
            {displayIcons.map(iconName => (
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
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '100px'
                }}>
                  <Icon 
                    name={iconName} 
                    size={selectedSize} 
                    color={copiedIcon === iconName ? 'inherit' : selectedColor as any}
                    variant={selectedVariant}
                    style={copiedIcon === iconName ? { color: 'white' } : {}}
                  />
                  <Text 
                    style={{ 
                      marginTop: '0.5rem',
                      color: copiedIcon === iconName ? 'white' : '#374151',
                      fontWeight: 500,
                      textAlign: 'center',
                      wordBreak: 'break-word',
                      fontSize: '13px',
                      lineHeight: '1.2'
                    }}
                  >
                    {copiedIcon === iconName ? 'Copied!' : iconName}
                  </Text>
                </CardContent>
              </Card>
            ))}
          </Grid>
        ) : (
          <VStack spacing="xs" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
            {displayIcons.map(iconName => (
              <Card
                key={iconName}
                onClick={() => handleCopyIcon(iconName)}
                style={{
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
                    color={copiedIcon === iconName ? 'inherit' : selectedColor as any}
                    variant={selectedVariant}
                    style={copiedIcon === iconName ? { color: 'white' } : {}}
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
          </VStack>
        )}

        {/* Quick Reference */}
        <Card style={{ marginTop: '1rem', marginBottom: '1rem' }}>
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

// With variant
<Icon name="Home" variant="outlined" />
<Icon name="Star" variant="filled" />
<Icon name="Settings" variant="rounded" />
<Icon name="Favorite" variant="sharp" />

// With size and color
<Icon name="Star" size="lg" color="primary" />
<Icon name="Heart" size="xl" color="error" />`}</code>
                </pre>
              </div>
              
              <div>
                <Heading size="md" style={{ marginBottom: '1rem' }}>Available Sizes</Heading>
                <div style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <Icon name="star" size="xs" />
                    <Text>xs - 16px</Text>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <Icon name="star" size="sm" />
                    <Text>sm - 20px</Text>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <Icon name="star" size="md" />
                    <Text>md - 24px (default)</Text>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <Icon name="star" size="lg" />
                    <Text>lg - 32px</Text>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Icon name="star" size="xl" />
                    <Text>xl - 40px</Text>
                  </div>
                </div>
              </div>
            </Grid>
          </CardContent>
        </Card>
    </Container>
  )
}