import React from 'react'
import '../styles/components/icon.css'

export interface IconProps {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'inherit' | 'foreground' | 'muted'
  variant?: 'outlined' | 'filled' | 'rounded' | 'sharp'
  weight?: 'thin' | 'light' | 'regular' | 'medium' | 'bold'
  className?: string
  style?: React.CSSProperties
  onClick?: (e: React.MouseEvent) => void
  spin?: boolean
}

// Map common icon names to Material Symbols names
// This helps with backwards compatibility when migrating from other icon libraries
const iconNameMap: Record<string, string> = {
  // Navigation
  'Menu': 'menu',
  'Close': 'close',
  'X': 'close',
  'ArrowBack': 'arrow_back',
  'ArrowForward': 'arrow_forward',
  'ArrowUpward': 'arrow_upward',
  'ArrowDownward': 'arrow_downward',
  'ArrowLeft': 'arrow_back',
  'ArrowRight': 'arrow_forward',
  'ArrowUp': 'arrow_upward',
  'ArrowDown': 'arrow_downward',
  'KeyboardArrowDown': 'keyboard_arrow_down',
  'KeyboardArrowUp': 'keyboard_arrow_up',
  'KeyboardArrowLeft': 'keyboard_arrow_left',
  'KeyboardArrowRight': 'keyboard_arrow_right',
  'ChevronDown': 'expand_more',
  'ChevronUp': 'expand_less',
  'ChevronLeft': 'chevron_left',
  'ChevronRight': 'chevron_right',
  'ExpandMore': 'expand_more',
  'ExpandLess': 'expand_less',
  
  // Common actions
  'Search': 'search',
  'FilterList': 'filter_list',
  'Filter': 'filter_list',
  'Add': 'add',
  'Plus': 'add',
  'Remove': 'remove',
  'Minus': 'remove',
  'Check': 'check',
  'ContentCopy': 'content_copy',
  'Copy': 'content_copy',
  'Download': 'download',
  'Upload': 'upload',
  'Edit': 'edit',
  'Delete': 'delete',
  'Trash': 'delete',
  'Trash2': 'delete',
  'Save': 'save',
  'Settings': 'settings',
  'Share': 'share',
  'Send': 'send',
  'Print': 'print',
  'Refresh': 'refresh',
  
  // User & Account
  'Home': 'home',
  'Person': 'person',
  'User': 'person',
  'Group': 'group',
  'People': 'people',
  'Users': 'people',
  'PersonAdd': 'person_add',
  'Logout': 'logout',
  
  // Communication
  'Mail': 'mail',
  'Email': 'email',
  'Phone': 'phone',
  'Notifications': 'notifications',
  'NotificationsOff': 'notifications_off',
  'Bell': 'notifications',
  'BellOff': 'notifications_off',
  'MessageSquare': 'message',
  'MessageCircle': 'chat',
  'Chat': 'chat',
  
  // Time & Calendar
  'CalendarMonth': 'calendar_month',
  'Calendar': 'calendar_today',
  'AccessTime': 'access_time',
  'Clock': 'schedule',
  'History': 'history',
  
  // Feedback
  'Star': 'star',
  'Favorite': 'favorite',
  'Heart': 'favorite',
  'Visibility': 'visibility',
  'VisibilityOff': 'visibility_off',
  'Eye': 'visibility',
  'EyeOff': 'visibility_off',
  
  // Security
  'Lock': 'lock',
  'LockOpen': 'lock_open',
  'Unlock': 'lock_open',
  'Key': 'key',
  'Shield': 'shield',
  
  // Status
  'Error': 'error',
  'Warning': 'warning',
  'Info': 'info',
  'CheckCircle': 'check_circle',
  'Cancel': 'cancel',
  'XCircle': 'cancel',
  'Help': 'help',
  'HelpCircle': 'help',
  'AlertCircle': 'error',
  'AlertTriangle': 'warning',
  
  // Business
  'Dashboard': 'dashboard',
  'Assignment': 'assignment',
  'Analytics': 'analytics',
  'Assessment': 'assessment',
  'TrendingUp': 'trending_up',
  'ShoppingCart': 'shopping_cart',
  'Payment': 'payment',
  'CreditCard': 'credit_card',
  'DollarSign': 'attach_money',
  'Tag': 'label',
  'Gift': 'card_giftcard',
  'Package': 'inventory_2',
  'Truck': 'local_shipping',
  'ShoppingBag': 'shopping_bag',
  
  // Places
  'LocationOn': 'location_on',
  
  // Social (Note: Material Symbols doesn't have social icons, we'll use alternatives)
  'Facebook': 'public',
  'Twitter': 'tag',
  'Instagram': 'camera_alt',
  'LinkedIn': 'work',
  'Github': 'code',
  
  // Technology
  'Cloud': 'cloud',
  'Api': 'api',
  'Support': 'support_agent',
  'SupportAgent': 'support_agent',
  'AutoMode': 'auto_mode',
  'Wifi': 'wifi',
  'WifiOff': 'wifi_off',
  'Bluetooth': 'bluetooth',
  'Database': 'database',
  'Server': 'dns',
  'Globe': 'language',
  'Monitor': 'computer',
  'Smartphone': 'smartphone',
  
  // Media
  'Image': 'image',
  'Camera': 'photo_camera',
  'Video': 'videocam',
  'Music': 'music_note',
  'Mic': 'mic',
  'Volume': 'volume_up',
  'Volume2': 'volume_up',
  
  // Files
  'File': 'description',
  'FileText': 'article',
  'Folder': 'folder',
  'FolderOpen': 'folder_open',
  'Paperclip': 'attach_file',
  
  // Layout
  'Grid': 'grid_view',
  'List': 'list',
  'Layers': 'layers',
  'Layout': 'dashboard',
  'Sidebar': 'view_sidebar',
  
  // Weather
  'Sun': 'light_mode',
  'Moon': 'dark_mode',
  'CloudRain': 'cloudy',
  
  // Automotive
  'Car': 'directions_car',
  'Wrench': 'build',
  'Zap': 'bolt',
  'Activity': 'show_chart',
  'Gauge': 'speed',
  
  // Other
  'Palette': 'palette'
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color = 'inherit',
  variant = 'outlined',
  weight = 'regular',
  className = '',
  style,
  onClick,
  spin = false
}) => {
  // Convert icon name to Material Symbols name
  const symbolName = iconNameMap[name] || name.toLowerCase().replace(/([A-Z])/g, '_$1').replace(/^_/, '').trim()
  
  const sizeClasses = {
    'xs': 'qwanyx-icon-xs',
    'sm': 'qwanyx-icon-sm',
    'md': 'qwanyx-icon-md',
    'lg': 'qwanyx-icon-lg',
    'xl': 'qwanyx-icon-xl',
    '2xl': 'qwanyx-icon-2xl',
    '3xl': 'qwanyx-icon-3xl'
  }
  
  const colorClasses = {
    'primary': 'qwanyx-icon-primary',
    'secondary': 'qwanyx-icon-secondary',
    'accent': 'qwanyx-icon-accent',
    'success': 'qwanyx-icon-success',
    'warning': 'qwanyx-icon-warning',
    'error': 'qwanyx-icon-error',
    'info': 'qwanyx-icon-info',
    'inherit': 'qwanyx-icon-inherit',
    'foreground': 'qwanyx-icon-foreground',
    'muted': 'qwanyx-icon-muted'
  }
  
  const variantClasses = {
    'outlined': 'material-symbols-outlined',
    'filled': 'material-symbols-filled',
    'rounded': 'material-symbols-rounded',
    'sharp': 'material-symbols-sharp'
  }
  
  const weightClasses = {
    'thin': 'qwanyx-icon-thin',
    'light': 'qwanyx-icon-light',
    'regular': 'qwanyx-icon-regular',
    'medium': 'qwanyx-icon-medium',
    'bold': 'qwanyx-icon-bold'
  }
  
  const classes = [
    'qwanyx-icon',
    variantClasses[variant],
    sizeClasses[size],
    colorClasses[color],
    weightClasses[weight],
    onClick ? 'qwanyx-icon-clickable' : '',
    spin ? 'qwanyx-icon-spin' : '',
    className
  ].filter(Boolean).join(' ')
  
  return (
    <span 
      className={classes}
      style={style}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={name}
    >
      {symbolName}
    </span>
  )
}


// Export common icon names for convenience
export const Icons = {
  // Navigation
  Menu: 'menu',
  Close: 'close',
  ArrowBack: 'arrow_back',
  ArrowForward: 'arrow_forward',
  ArrowUp: 'arrow_upward',
  ArrowDown: 'arrow_downward',
  ChevronDown: 'expand_more',
  ChevronUp: 'expand_less',
  ChevronLeft: 'chevron_left',
  ChevronRight: 'chevron_right',
  
  // Actions
  Search: 'search',
  Filter: 'filter_list',
  Add: 'add',
  Remove: 'remove',
  Check: 'check',
  Copy: 'content_copy',
  Download: 'download',
  Upload: 'upload',
  Edit: 'edit',
  Delete: 'delete',
  Save: 'save',
  Settings: 'settings',
  Share: 'share',
  Send: 'send',
  Print: 'print',
  Refresh: 'refresh',
  
  // User & Account
  Home: 'home',
  Person: 'person',
  People: 'people',
  PersonAdd: 'person_add',
  Logout: 'logout',
  
  // Communication
  Mail: 'mail',
  Email: 'email',
  Phone: 'phone',
  Notifications: 'notifications',
  NotificationsOff: 'notifications_off',
  Chat: 'chat',
  Message: 'message',
  
  // Time & Calendar
  Calendar: 'calendar_today',
  Clock: 'schedule',
  History: 'history',
  
  // Feedback
  Star: 'star',
  Favorite: 'favorite',
  Visibility: 'visibility',
  VisibilityOff: 'visibility_off',
  
  // Security
  Lock: 'lock',
  LockOpen: 'lock_open',
  Key: 'key',
  Shield: 'shield',
  
  // Status
  Error: 'error',
  Warning: 'warning',
  Info: 'info',
  CheckCircle: 'check_circle',
  Cancel: 'cancel',
  Help: 'help',
  
  // Business
  Dashboard: 'dashboard',
  Assignment: 'assignment',
  Analytics: 'analytics',
  Assessment: 'assessment',
  TrendingUp: 'trending_up',
  ShoppingCart: 'shopping_cart',
  Payment: 'payment',
  
  // Technology
  Cloud: 'cloud',
  Api: 'api',
  Support: 'support_agent',
  Wifi: 'wifi',
  Database: 'database',
  
  // Media
  Image: 'image',
  Camera: 'photo_camera',
  Video: 'videocam',
  Music: 'music_note',
  Mic: 'mic',
  VolumeUp: 'volume_up',
  
  // Files
  File: 'description',
  Folder: 'folder',
  FolderOpen: 'folder_open',
  AttachFile: 'attach_file',
  
  // Layout
  GridView: 'grid_view',
  List: 'list',
  Layers: 'layers',
  ViewSidebar: 'view_sidebar'
} as const

export type IconName = keyof typeof Icons | string