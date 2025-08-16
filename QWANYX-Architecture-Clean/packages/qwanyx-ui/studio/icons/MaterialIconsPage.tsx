import React, { useState, useMemo } from 'react'
import { MaterialIcon } from '../../src/components/MaterialIcon'
import { MaterialIconDynamic } from '../../src/components/MaterialIconDynamic'
import { Container } from '../../src/components/Container'
import { Heading, Text } from '../../src/components/Text'
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/Card'
import { Grid } from '../../src/components/Container'
import { Input } from '../../src/components/Input'
import { SimpleSelect } from '../../src/components/SimpleSelect'
import { Button } from '../../src/components/Button'
import { useTheme } from '../../src/providers/ThemeProvider'

// Organized icon categories with Material Icons
const iconCategories = {
  'Navigation': [
    'Menu', 'Close', 'ArrowBack', 'ArrowForward', 'ArrowUpward', 'ArrowDownward',
    'KeyboardArrowDown', 'KeyboardArrowUp', 'KeyboardArrowLeft', 'KeyboardArrowRight',
    'ExpandMore', 'ExpandLess', 'ChevronLeft', 'ChevronRight', 'MoreVert', 'MoreHoriz'
  ],
  'Actions': [
    'Search', 'Home', 'Settings', 'Done', 'Add', 'Remove', 'Delete', 'Edit',
    'Save', 'Share', 'Download', 'Upload', 'ContentCopy', 'ContentPaste',
    'Refresh', 'Sync', 'Print', 'Send', 'Archive', 'Unarchive'
  ],
  'User & Account': [
    'Person', 'Group', 'PersonAdd', 'PersonRemove', 'AccountCircle', 'AccountBox',
    'SupervisedUserCircle', 'ManageAccounts', 'Badge', 'ContactMail', 'Contacts'
  ],
  'Communication': [
    'Email', 'Mail', 'Message', 'Chat', 'Forum', 'QuestionAnswer',
    'Phone', 'PhoneInTalk', 'Voicemail', 'DialerSip', 'ContactPhone',
    'Notifications', 'NotificationsActive', 'NotificationsOff', 'NotificationAdd'
  ],
  'Media': [
    'Image', 'PhotoCamera', 'PhotoLibrary', 'Collections', 'Panorama',
    'VideoCam', 'VideoLibrary', 'Movie', 'Theaters', 'MusicNote',
    'Album', 'Mic', 'MicOff', 'VolumeUp', 'VolumeDown', 'VolumeMute', 'VolumeOff',
    'PlayArrow', 'Pause', 'Stop', 'SkipNext', 'SkipPrevious', 'FastForward', 'FastRewind'
  ],
  'Files & Folders': [
    'Folder', 'FolderOpen', 'CreateNewFolder', 'FolderShared', 'FolderSpecial',
    'InsertDriveFile', 'Description', 'Article', 'FileCopy', 'AttachFile',
    'CloudUpload', 'CloudDownload', 'CloudQueue', 'CloudDone', 'CloudOff'
  ],
  'Status & Alerts': [
    'CheckCircle', 'Cancel', 'Error', 'Warning', 'Info', 'Help',
    'CheckCircleOutline', 'ErrorOutline', 'WarningAmber', 'InfoOutlined',
    'ReportProblem', 'Announcement', 'Feedback', 'NewReleases'
  ],
  'Commerce': [
    'ShoppingCart', 'ShoppingBag', 'Store', 'Storefront', 'LocalMall',
    'AddShoppingCart', 'RemoveShoppingCart', 'Payment', 'CreditCard',
    'AttachMoney', 'MonetizationOn', 'Euro', 'LocalOffer', 'Loyalty',
    'CardGiftcard', 'Sell', 'Inventory', 'LocalShipping', 'Receipt'
  ],
  'Social Media': [
    'Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube', 'Pinterest',
    'Reddit', 'GitHub', 'WhatsApp', 'Telegram', 'Share', 'ThumbUp', 'ThumbDown'
  ],
  'Technology': [
    'Computer', 'Laptop', 'Smartphone', 'Tablet', 'Watch', 'Headphones',
    'Keyboard', 'Mouse', 'Memory', 'Storage', 'Dns', 'Router',
    'Wifi', 'WifiOff', 'Bluetooth', 'BluetoothDisabled', 'Battery0Bar',
    'BatteryFull', 'BatteryCharging', 'PowerSettingsNew', 'Power'
  ],
  'Maps & Location': [
    'Map', 'MyLocation', 'LocationOn', 'LocationOff', 'LocationSearching',
    'Navigation', 'NearMe', 'Place', 'LocalHospital', 'LocalPharmacy',
    'Restaurant', 'Fastfood', 'Coffee', 'LocalBar', 'Hotel', 'LocalParking',
    'DirectionsCar', 'DirectionsBus', 'Train', 'Flight', 'DirectionsBike', 'DirectionsWalk'
  ],
  'Business': [
    'Business', 'Work', 'WorkOutline', 'BusinessCenter', 'Domain',
    'Assessment', 'Analytics', 'BarChart', 'ShowChart', 'TrendingUp', 'TrendingDown',
    'AttachMoney', 'MoneyOff', 'Euro', 'CurrencyExchange', 'Paid'
  ],
  'Education': [
    'School', 'MenuBook', 'AutoStories', 'LibraryBooks', 'Book',
    'Bookmark', 'BookmarkBorder', 'Grade', 'Star', 'StarBorder',
    'Science', 'Psychology', 'Biotech', 'Calculate', 'Functions'
  ],
  'Weather & Nature': [
    'WbSunny', 'NightsStay', 'Cloud', 'CloudQueue', 'WbCloudy',
    'Thunderstorm', 'AcUnit', 'Waves', 'Water', 'WaterDrop',
    'Park', 'Nature', 'LocalFlorist', 'Grass', 'Forest'
  ],
  'Security': [
    'Lock', 'LockOpen', 'Security', 'Shield', 'VerifiedUser',
    'Fingerprint', 'VpnKey', 'Password', 'Pin', 'Pattern',
    'AdminPanelSettings', 'Policy', 'PrivacyTip', 'GppGood', 'GppBad'
  ]
}

export const MaterialIconsPage: React.FC = () => {
  const { theme } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSize, setSelectedSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('lg')
  const [selectedColor, setSelectedColor] = useState('foreground')
  const [selectedVariant, setSelectedVariant] = useState<'filled' | 'outlined' | 'rounded' | 'sharp' | 'twoTone'>('filled')
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
    const code = `<MaterialIcon icon="${iconName}" size="${selectedSize}" />`
    navigator.clipboard.writeText(code)
    setCopiedIcon(iconName)
    setTimeout(() => setCopiedIcon(null), 2000)
  }

  const handleCopyImport = () => {
    navigator.clipboard.writeText(`import { MaterialIcon } from '@qwanyx/ui'`)
    alert('Import statement copied to clipboard!')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Container>
        {/* Header */}
        <div style={{ padding: '3rem 0 2rem' }}>
          <Heading size="4xl" style={{ marginBottom: '0.5rem' }}>
            Material Icons Library
          </Heading>
          <Text size="lg" style={{ color: '#6b7280' }}>
            Browse Google Material Icons - Over 2000+ icons with multiple variants
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
                        <MaterialIcon icon="GridView" size="sm" />
                      </Button>
                      <Button
                        size="sm"
                        variant={viewMode === 'list' ? 'solid' : 'outline'}
                        onClick={() => setViewMode('list')}
                      >
                        <MaterialIcon icon="List" size="sm" />
                      </Button>
                    </div>
                  </div>
                </Grid>
              </div>
              
              <div>
                <Grid cols={4} style={{ gap: '1rem' }}>
                  <div>
                    <Text weight="semibold" size="sm" style={{ marginBottom: '0.5rem' }}>Variant</Text>
                    <SimpleSelect
                      value={selectedVariant}
                      options={[
                        { value: 'filled', label: 'Filled' },
                        { value: 'outlined', label: 'Outlined' },
                        { value: 'rounded', label: 'Rounded' },
                        { value: 'sharp', label: 'Sharp' },
                        { value: 'twoTone', label: 'Two Tone' }
                      ]}
                      onChange={(e) => setSelectedVariant((e.target as HTMLSelectElement).value as any)}
                    />
                  </div>
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
                    <Text weight="semibold" size="sm" style={{ marginBottom: '0.5rem' }}>
                      Color
                      <span style={{
                        display: 'inline-block',
                        width: '16px',
                        height: '16px',
                        marginLeft: '8px',
                        backgroundColor: getThemeColor(selectedColor),
                        border: '1px solid #e5e7eb',
                        borderRadius: '2px',
                        verticalAlign: 'middle'
                      }} />
                    </Text>
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
                        { value: 'text-primary', label: 'Text Primary' },
                        { value: 'text-secondary', label: 'Text Secondary' },
                        { value: 'text-muted', label: 'Text Muted' },
                        { value: 'currentColor', label: 'Current Color' }
                      ]}
                      onChange={(e) => setSelectedColor((e.target as HTMLSelectElement).value)}
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
                Showing {displayIcons.length} icons
              </Text>
              <Button 
                onClick={() => { 
                  setSearchTerm(''); 
                  setSelectedCategory('all');
                  setSelectedColor('foreground');
                  setSelectedSize('lg');
                  setSelectedVariant('filled');
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '0.75rem',
            marginBottom: '3rem'
          }}>
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
                  <MaterialIconDynamic 
                    name={iconName} 
                    size={selectedSize} 
                    color={copiedIcon === iconName ? 'white' : getThemeColor(selectedColor)}
                    variant={selectedVariant}
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
          </div>
        ) : (
          <div style={{ marginBottom: '3rem' }}>
            {displayIcons.map(iconName => (
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
                  <MaterialIconDynamic 
                    name={iconName} 
                    size={selectedSize} 
                    color={copiedIcon === iconName ? 'white' : getThemeColor(selectedColor)}
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
                    {copiedIcon === iconName ? 'Copied!' : `<MaterialIcon icon="${iconName}" />`}
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
                  <code>{`import { MaterialIcon } from '@qwanyx/ui'

// Basic icon (filled by default)
<MaterialIcon icon="Search" />

// With variant
<MaterialIcon icon="Home" variant="outlined" />
<MaterialIcon icon="Star" variant="rounded" />
<MaterialIcon icon="Settings" variant="sharp" />
<MaterialIcon icon="Favorite" variant="twoTone" />

// With size and color
<MaterialIcon icon="Star" size="lg" color="#FFD700" />

// Social icons (Material has these!)
<MaterialIcon icon="Facebook" variant="filled" />
<MaterialIcon icon="Twitter" variant="outlined" />`}</code>
                </pre>
              </div>
              
              <div>
                <Heading size="md" style={{ marginBottom: '1rem' }}>Available Sizes</Heading>
                <div style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <MaterialIcon icon="Star" size="xs" />
                    <Text>xs - 14px</Text>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <MaterialIcon icon="Star" size="sm" />
                    <Text>sm - 18px</Text>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <MaterialIcon icon="Star" size="md" />
                    <Text>md - 24px (default)</Text>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <MaterialIcon icon="Star" size="lg" />
                    <Text>lg - 32px</Text>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <MaterialIcon icon="Star" size="xl" />
                    <Text>xl - 40px</Text>
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