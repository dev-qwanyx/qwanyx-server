import React from 'react'

// Import ONLY the icons we actually use
import Menu from '@mui/icons-material/Menu'
import Close from '@mui/icons-material/Close'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import ArrowBack from '@mui/icons-material/ArrowBack'
import ArrowForward from '@mui/icons-material/ArrowForward'
import ArrowUpward from '@mui/icons-material/ArrowUpward'
import ArrowDownward from '@mui/icons-material/ArrowDownward'
import ExpandMore from '@mui/icons-material/ExpandMore'
import ExpandLess from '@mui/icons-material/ExpandLess'
import Search from '@mui/icons-material/Search'
import FilterList from '@mui/icons-material/FilterList'
import Add from '@mui/icons-material/Add'
import Remove from '@mui/icons-material/Remove'
import Check from '@mui/icons-material/Check'
import ContentCopy from '@mui/icons-material/ContentCopy'
import Download from '@mui/icons-material/Download'
import Upload from '@mui/icons-material/Upload'
import Edit from '@mui/icons-material/Edit'
import Delete from '@mui/icons-material/Delete'
import Save from '@mui/icons-material/Save'
import Settings from '@mui/icons-material/Settings'
import Share from '@mui/icons-material/Share'
import Send from '@mui/icons-material/Send'
import Print from '@mui/icons-material/Print'
import Refresh from '@mui/icons-material/Refresh'
import Home from '@mui/icons-material/Home'
import Person from '@mui/icons-material/Person'
import Group from '@mui/icons-material/Group'
import People from '@mui/icons-material/People'
import Mail from '@mui/icons-material/Mail'
import Email from '@mui/icons-material/Email'
import Phone from '@mui/icons-material/Phone'
import CalendarMonth from '@mui/icons-material/CalendarMonth'
import AccessTime from '@mui/icons-material/AccessTime'
import Star from '@mui/icons-material/Star'
import Favorite from '@mui/icons-material/Favorite'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Lock from '@mui/icons-material/Lock'
import LockOpen from '@mui/icons-material/LockOpen'
import Key from '@mui/icons-material/Key'
import Error from '@mui/icons-material/Error'
import Warning from '@mui/icons-material/Warning'
import Info from '@mui/icons-material/Info'
import CheckCircle from '@mui/icons-material/CheckCircle'
import Cancel from '@mui/icons-material/Cancel'
import Help from '@mui/icons-material/Help'
import Dashboard from '@mui/icons-material/Dashboard'
import Assignment from '@mui/icons-material/Assignment'
import Analytics from '@mui/icons-material/Analytics'
import Notifications from '@mui/icons-material/Notifications'
import NotificationsOff from '@mui/icons-material/NotificationsOff'
import ShoppingCart from '@mui/icons-material/ShoppingCart'
import Payment from '@mui/icons-material/Payment'
import TrendingUp from '@mui/icons-material/TrendingUp'
import Assessment from '@mui/icons-material/Assessment'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Logout from '@mui/icons-material/Logout'
import History from '@mui/icons-material/History'
import LocationOn from '@mui/icons-material/LocationOn'
import Facebook from '@mui/icons-material/Facebook'
import Twitter from '@mui/icons-material/Twitter'
import Instagram from '@mui/icons-material/Instagram'
import LinkedIn from '@mui/icons-material/LinkedIn'
import Cloud from '@mui/icons-material/Cloud'
import Shield from '@mui/icons-material/Shield'
import Api from '@mui/icons-material/Api'
import SupportAgent from '@mui/icons-material/SupportAgent'
import AutoMode from '@mui/icons-material/AutoMode'

// Type for Material Icon components
type MaterialIconComponent = React.ComponentType<{ fontSize?: 'inherit' | 'small' | 'medium' | 'large'; sx?: any }>

// Map common icon names to Material Icons - ONLY imported ones
const iconMap: Record<string, MaterialIconComponent> = {
  // Navigation
  Menu,
  Close,
  X: Close,
  ChevronDown: KeyboardArrowDown,
  ChevronUp: KeyboardArrowUp,
  ChevronLeft: KeyboardArrowLeft,
  ChevronRight: KeyboardArrowRight,
  ArrowLeft: ArrowBack,
  ArrowRight: ArrowForward,
  ArrowUp: ArrowUpward,
  ArrowDown: ArrowDownward,
  ExpandMore,
  ExpandLess,
  
  // Actions
  Search,
  Filter: FilterList,
  Plus: Add,
  Add,
  Minus: Remove,
  Remove,
  Check,
  Copy: ContentCopy,
  Download,
  Upload,
  Edit,
  Trash: Delete,
  Delete,
  Save,
  Settings,
  Share,
  Send,
  Print,
  Refresh,
  
  // UI Elements
  Home,
  User: Person,
  Person,
  Users: Group,
  Group,
  People,
  Mail,
  Email,
  Phone,
  Calendar: CalendarMonth,
  Clock: AccessTime,
  Time: AccessTime,
  Star,
  Heart: Favorite,
  Favorite,
  Eye: Visibility,
  EyeOff: VisibilityOff,
  Lock,
  Unlock: LockOpen,
  Key,
  
  // Status & Alerts
  AlertCircle: Error,
  Error,
  AlertTriangle: Warning,
  Warning,
  Info,
  CheckCircle,
  XCircle: Cancel,
  Cancel,
  HelpCircle: Help,
  Help,
  
  // Dashboard specific
  Dashboard,
  Assignment,
  Analytics,
  Bell: Notifications,
  Notifications,
  BellOff: NotificationsOff,
  ShoppingCart,
  Payment,
  TrendingUp,
  Assessment,
  PersonAdd,
  Logout,
  History,
  
  // Footer icons
  LocationOn,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  
  // Service icons
  CloudIcon: Cloud,
  Cloud,
  ShieldIcon: Shield,
  Shield,
  ApiIcon: Api,
  Api,
  SupportIcon: SupportAgent,
  Support: SupportAgent,
  AutoModeIcon: AutoMode,
  AutoMode,
}

// Dynamic import function for icons not in the map
export const loadIcon = async (iconName: string): Promise<MaterialIconComponent | null> => {
  try {
    const module = await import(`@mui/icons-material/${iconName}`)
    return module.default
  } catch (error) {
    console.warn(`Failed to load icon "${iconName}"`)
    return null
  }
}

export interface MaterialIconProps {
  icon: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number
  color?: string
  className?: string
}

export const MaterialIcon: React.FC<MaterialIconProps> = ({
  icon,
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
  let IconComponent = iconMap[icon]
  
  // If not found, try case-insensitive match
  if (!IconComponent) {
    const lowerName = icon.toLowerCase()
    const matchedKey = Object.keys(iconMap).find(key => key.toLowerCase() === lowerName)
    if (matchedKey) {
      IconComponent = iconMap[matchedKey]
    }
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
  if (typeof icon === 'string' && icon.length <= 2) {
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
        {icon}
      </span>
    )
  }

  // Return placeholder if icon not found
  console.warn(`Icon "${icon}" not found. Add it to the import list if needed.`)
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
  
  // Dashboard
  Dashboard: 'Dashboard',
  Assignment: 'Assignment',
  Analytics: 'Analytics',
  Notifications: 'Notifications',
  ShoppingCart: 'ShoppingCart',
  Payment: 'Payment',
  TrendingUp: 'TrendingUp',
  Assessment: 'Assessment',
  PersonAdd: 'PersonAdd',
  Logout: 'Logout',
  History: 'History',
} as const

export type IconName = keyof typeof Icons | string