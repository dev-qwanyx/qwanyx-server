import React from 'react'
import * as MaterialIcons from '@mui/icons-material'

// Type for Material Icon components
type MaterialIconComponent = React.ComponentType<{ fontSize?: 'inherit' | 'small' | 'medium' | 'large'; sx?: any }>

// Map common icon names to Material Icons
const iconMap: Record<string, MaterialIconComponent> = {
  // Navigation
  Menu: MaterialIcons.Menu,
  Close: MaterialIcons.Close,
  X: MaterialIcons.Close,
  ChevronDown: MaterialIcons.KeyboardArrowDown,
  ChevronUp: MaterialIcons.KeyboardArrowUp,
  ChevronLeft: MaterialIcons.KeyboardArrowLeft,
  ChevronRight: MaterialIcons.KeyboardArrowRight,
  ArrowLeft: MaterialIcons.ArrowBack,
  ArrowRight: MaterialIcons.ArrowForward,
  ArrowUp: MaterialIcons.ArrowUpward,
  ArrowDown: MaterialIcons.ArrowDownward,
  ExpandMore: MaterialIcons.ExpandMore,
  ExpandLess: MaterialIcons.ExpandLess,
  
  // Actions
  Search: MaterialIcons.Search,
  Filter: MaterialIcons.FilterList,
  Plus: MaterialIcons.Add,
  Add: MaterialIcons.Add,
  Minus: MaterialIcons.Remove,
  Remove: MaterialIcons.Remove,
  Check: MaterialIcons.Check,
  Copy: MaterialIcons.ContentCopy,
  Download: MaterialIcons.Download,
  Upload: MaterialIcons.Upload,
  Edit: MaterialIcons.Edit,
  Trash: MaterialIcons.Delete,
  Delete: MaterialIcons.Delete,
  Save: MaterialIcons.Save,
  Settings: MaterialIcons.Settings,
  Share: MaterialIcons.Share,
  Send: MaterialIcons.Send,
  Print: MaterialIcons.Print,
  Refresh: MaterialIcons.Refresh,
  
  // UI Elements
  Home: MaterialIcons.Home,
  User: MaterialIcons.Person,
  Person: MaterialIcons.Person,
  Users: MaterialIcons.Group,
  Group: MaterialIcons.Group,
  Mail: MaterialIcons.Mail,
  Email: MaterialIcons.Email,
  Phone: MaterialIcons.Phone,
  Calendar: MaterialIcons.CalendarMonth,
  Clock: MaterialIcons.AccessTime,
  Time: MaterialIcons.AccessTime,
  Star: MaterialIcons.Star,
  Heart: MaterialIcons.Favorite,
  Favorite: MaterialIcons.Favorite,
  Eye: MaterialIcons.Visibility,
  EyeOff: MaterialIcons.VisibilityOff,
  Lock: MaterialIcons.Lock,
  Unlock: MaterialIcons.LockOpen,
  Key: MaterialIcons.Key,
  
  // Status & Alerts
  AlertCircle: MaterialIcons.Error,
  Error: MaterialIcons.Error,
  AlertTriangle: MaterialIcons.Warning,
  Warning: MaterialIcons.Warning,
  Info: MaterialIcons.Info,
  CheckCircle: MaterialIcons.CheckCircle,
  XCircle: MaterialIcons.Cancel,
  Cancel: MaterialIcons.Cancel,
  HelpCircle: MaterialIcons.Help,
  Help: MaterialIcons.Help,
  
  // Media
  Image: MaterialIcons.Image,
  Camera: MaterialIcons.CameraAlt,
  Video: MaterialIcons.Videocam,
  Music: MaterialIcons.MusicNote,
  Mic: MaterialIcons.Mic,
  MicOff: MaterialIcons.MicOff,
  Volume: MaterialIcons.VolumeUp,
  VolumeOff: MaterialIcons.VolumeOff,
  Play: MaterialIcons.PlayArrow,
  Pause: MaterialIcons.Pause,
  Stop: MaterialIcons.Stop,
  Forward: MaterialIcons.FastForward,
  Rewind: MaterialIcons.FastRewind,
  
  // Files & Documents
  File: MaterialIcons.InsertDriveFile,
  FileText: MaterialIcons.Description,
  Document: MaterialIcons.Description,
  Folder: MaterialIcons.Folder,
  FolderOpen: MaterialIcons.FolderOpen,
  Paperclip: MaterialIcons.AttachFile,
  Attach: MaterialIcons.AttachFile,
  
  // Commerce
  ShoppingCart: MaterialIcons.ShoppingCart,
  Cart: MaterialIcons.ShoppingCart,
  ShoppingBag: MaterialIcons.ShoppingBag,
  CreditCard: MaterialIcons.CreditCard,
  Payment: MaterialIcons.Payment,
  DollarSign: MaterialIcons.AttachMoney,
  Money: MaterialIcons.AttachMoney,
  Tag: MaterialIcons.LocalOffer,
  Gift: MaterialIcons.CardGiftcard,
  Package: MaterialIcons.Inventory,
  Truck: MaterialIcons.LocalShipping,
  Shipping: MaterialIcons.LocalShipping,
  Store: MaterialIcons.Store,
  
  // Communication
  MessageSquare: MaterialIcons.Message,
  Message: MaterialIcons.Message,
  Chat: MaterialIcons.Chat,
  Bell: MaterialIcons.Notifications,
  Notifications: MaterialIcons.Notifications,
  BellOff: MaterialIcons.NotificationsOff,
  
  // Layout & Design
  Grid: MaterialIcons.GridView,
  List: MaterialIcons.List,
  Layers: MaterialIcons.Layers,
  Layout: MaterialIcons.Dashboard,
  Dashboard: MaterialIcons.Dashboard,
  Sidebar: MaterialIcons.ViewSidebar,
  
  // Technology
  Wifi: MaterialIcons.Wifi,
  WifiOff: MaterialIcons.WifiOff,
  Bluetooth: MaterialIcons.Bluetooth,
  Database: MaterialIcons.Storage,
  Storage: MaterialIcons.Storage,
  Server: MaterialIcons.Dns,
  Cloud: MaterialIcons.Cloud,
  CloudOff: MaterialIcons.CloudOff,
  Globe: MaterialIcons.Language,
  Language: MaterialIcons.Language,
  Monitor: MaterialIcons.Computer,
  Computer: MaterialIcons.Computer,
  Smartphone: MaterialIcons.Smartphone,
  Tablet: MaterialIcons.Tablet,
  Laptop: MaterialIcons.Laptop,
  
  // Weather & Nature
  Sun: MaterialIcons.WbSunny,
  Moon: MaterialIcons.NightsStay,
  CloudRain: MaterialIcons.CloudQueue,
  Water: MaterialIcons.Water,
  
  // Social (Material Icons has these!)
  Facebook: MaterialIcons.Facebook,
  Twitter: MaterialIcons.Twitter,
  Instagram: MaterialIcons.Instagram,
  LinkedIn: MaterialIcons.LinkedIn,
  GitHub: MaterialIcons.GitHub,
  YouTube: MaterialIcons.YouTube,
  
  // Automotive & Tools
  Car: MaterialIcons.DirectionsCar,
  Wrench: MaterialIcons.Build,
  Build: MaterialIcons.Build,
  Shield: MaterialIcons.Shield,
  Security: MaterialIcons.Security,
  Zap: MaterialIcons.Bolt,
  Bolt: MaterialIcons.Bolt,
  Activity: MaterialIcons.ShowChart,
  Chart: MaterialIcons.ShowChart,
  Gauge: MaterialIcons.Speed,
  Speed: MaterialIcons.Speed,
  
  // Other useful icons
  Palette: MaterialIcons.Palette,
  Code: MaterialIcons.Code,
  Link: MaterialIcons.Link,
  QR: MaterialIcons.QrCode,
  Location: MaterialIcons.LocationOn,
  Map: MaterialIcons.Map,
  Flight: MaterialIcons.Flight,
  Restaurant: MaterialIcons.Restaurant,
  Coffee: MaterialIcons.Coffee,
  School: MaterialIcons.School,
  Work: MaterialIcons.Work,
  Business: MaterialIcons.Business,
  Lightbulb: MaterialIcons.Lightbulb,
  Bookmark: MaterialIcons.Bookmark,
  Flag: MaterialIcons.Flag,
  ThumbUp: MaterialIcons.ThumbUp,
  ThumbDown: MaterialIcons.ThumbDown,
}

export interface MaterialIconProps {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number
  color?: string
  className?: string
  variant?: 'outlined' | 'filled' | 'rounded' | 'sharp' | 'two-tone'
}

export const MaterialIcon: React.FC<MaterialIconProps> = ({
  name,
  size = 'md',
  color = 'currentColor',
  className = ''
}) => {
  // Size mapping
  const sizeMap = {
    xs: 14,
    sm: 18,
    md: 24,
    lg: 32,
    xl: 40
  }

  const iconSize = typeof size === 'number' ? size : sizeMap[size] || 24
  
  // Get Material UI size prop
  const muiSize = iconSize <= 18 ? 'small' : iconSize <= 24 ? 'medium' : 'large'
  
  // Map theme colors
  const getThemeColor = (colorValue: string) => {
    const themeColors: Record<string, string> = {
      'primary': 'var(--qwanyx-primary)',
      'secondary': 'var(--qwanyx-secondary)',
      'accent': 'var(--qwanyx-accent)',
      'success': 'var(--qwanyx-success)',
      'warning': 'var(--qwanyx-warning)',
      'error': 'var(--qwanyx-error)',
      'info': 'var(--qwanyx-info)',
      'muted': 'var(--qwanyx-text-muted)',
      'text': 'var(--qwanyx-text-primary)',
      'text-primary': 'var(--qwanyx-text-primary)',
      'text-secondary': 'var(--qwanyx-text-secondary)'
    }
    return themeColors[colorValue] || colorValue
  }
  
  // Get the icon component (case-insensitive)
  let IconComponent = iconMap[name]
  
  // If not found, try case-insensitive match
  if (!IconComponent) {
    const lowerName = name.toLowerCase()
    const matchedKey = Object.keys(iconMap).find(key => key.toLowerCase() === lowerName)
    if (matchedKey) {
      IconComponent = iconMap[matchedKey]
    }
  }
  
  // Try to get directly from MaterialIcons if not in map
  if (!IconComponent && MaterialIcons[name as keyof typeof MaterialIcons]) {
    IconComponent = MaterialIcons[name as keyof typeof MaterialIcons] as MaterialIconComponent
  }

  if (IconComponent) {
    return (
      <IconComponent 
        fontSize={muiSize}
        sx={{ 
          fontSize: iconSize,
          color: getThemeColor(color),
          verticalAlign: 'middle'
        }}
      />
    )
  }

  // Fallback to text/emoji if not a Material icon
  if (typeof name === 'string' && name.length <= 2) {
    return (
      <span 
        className={`qwanyx-icon qwanyx-icon--emoji ${className}`}
        style={{ 
          fontSize: `${iconSize}px`,
          color,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          verticalAlign: 'middle'
        }}
      >
        {name}
      </span>
    )
  }

  // Return placeholder if icon not found
  console.warn(`Icon "${name}" not found in Material Icons`)
  return (
    <span 
      className={`qwanyx-icon qwanyx-icon--placeholder ${className}`}
      style={{ 
        width: `${iconSize}px`,
        height: `${iconSize}px`,
        display: 'inline-block',
        backgroundColor: '#e5e7eb',
        borderRadius: '4px',
        verticalAlign: 'middle'
      }}
    />
  )
}

// Note: Direct re-export of all Material Icons removed to avoid Next.js issues
// Import specific icons as needed

// Export icon names for convenience
export const Icons = {
  // Navigation
  Menu: 'Menu',
  Close: 'Close',
  ChevronDown: 'ChevronDown',
  ChevronUp: 'ChevronUp',
  ChevronLeft: 'ChevronLeft',
  ChevronRight: 'ChevronRight',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  
  // Actions
  Search: 'Search',
  Filter: 'Filter',
  Add: 'Add',
  Remove: 'Remove',
  Check: 'Check',
  Copy: 'Copy',
  Download: 'Download',
  Upload: 'Upload',
  Edit: 'Edit',
  Delete: 'Delete',
  Save: 'Save',
  Settings: 'Settings',
  Share: 'Share',
  Send: 'Send',
  
  // UI Elements
  Home: 'Home',
  User: 'User',
  Users: 'Users',
  Mail: 'Mail',
  Phone: 'Phone',
  Calendar: 'Calendar',
  Clock: 'Clock',
  Star: 'Star',
  Heart: 'Heart',
  Eye: 'Eye',
  EyeOff: 'EyeOff',
  Lock: 'Lock',
  Unlock: 'Unlock',
  Key: 'Key',
  
  // Status
  AlertCircle: 'AlertCircle',
  AlertTriangle: 'AlertTriangle',
  Info: 'Info',
  CheckCircle: 'CheckCircle',
  XCircle: 'XCircle',
  HelpCircle: 'HelpCircle',
  
  // And many more...
} as const

export type IconName = keyof typeof Icons | string