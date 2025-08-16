import React from 'react'
import { 
  Search, Palette, HelpCircle, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Menu, X, ArrowLeft, ArrowRight, ArrowUp, ArrowDown,
  Filter, Plus, Minus, Check, Copy, Download, Upload, Edit, Trash2, Save, Settings,
  Home, User, Users, Mail, Phone, Calendar, Clock, Star, Heart, Eye, EyeOff, Lock, Unlock, Key,
  AlertCircle, AlertTriangle, Info, CheckCircle, XCircle,
  Image, Camera, Video, Music, Mic, Volume2,
  File, FileText, Folder, FolderOpen, Paperclip,
  ShoppingCart, ShoppingBag, CreditCard, DollarSign, Tag, Gift, Package, Truck,
  MessageSquare, MessageCircle, Send, Bell, BellOff,
  Grid, List, Layers, Layout, Sidebar,
  Wifi, WifiOff, Bluetooth, Database, Server, Cloud, Globe, Monitor, Smartphone,
  Sun, Moon, CloudRain,
  Github,
  Car, Wrench, Shield, Zap, Activity, Gauge,
  type LucideIcon
} from 'lucide-react'

// Map of icon names to components
const iconMap: { [key: string]: LucideIcon } = {
  // Navigation
  Menu, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  ArrowLeft, ArrowRight, ArrowUp, ArrowDown,
  
  // Actions
  Search, Filter, Plus, Minus, Check, Copy, Download, Upload, Edit, 
  Trash: Trash2, // Trash2 is the actual icon name
  Trash2,
  Save, Settings,
  
  // UI Elements
  Home, User, Users, Mail, Phone, Calendar, Clock, Star, Heart, Eye, EyeOff, Lock, Unlock, Key,
  
  // Status
  AlertCircle, AlertTriangle, Info, CheckCircle, XCircle, HelpCircle,
  
  // Media
  Image, Camera, Video, Music, Mic, 
  Volume: Volume2, // Volume2 is the actual icon name
  Volume2,
  
  // Files
  File, FileText, Folder, FolderOpen, Paperclip,
  
  // Commerce
  ShoppingCart, ShoppingBag, CreditCard, DollarSign, Tag, Gift, Package, Truck,
  
  // Communication
  MessageSquare, MessageCircle, Send, Bell, BellOff,
  
  // Layout
  Grid, List, Layers, Layout, Sidebar,
  
  // Technology
  Wifi, WifiOff, Bluetooth, Database, Server, Cloud, Globe, Monitor, Smartphone,
  
  // Weather
  Sun, Moon, CloudRain,
  
  // Social
  Github,
  
  // Automotive
  Car, Wrench, Shield, Zap, Activity, Gauge,
  
  // Other
  Palette
}

export interface IconProps {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number
  color?: string
  className?: string
  strokeWidth?: number
  variant?: 'outline' | 'bold' | 'thin'
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color = 'currentColor',
  className = '',
  strokeWidth,
  variant = 'outline'
}) => {
  // Size mapping
  const sizeMap = {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32
  }

  const iconSize = typeof size === 'number' ? size : sizeMap[size] || 20
  
  // Stroke width based on variant
  const getStrokeWidth = () => {
    if (strokeWidth !== undefined) return strokeWidth
    switch (variant) {
      case 'thin': return 1
      case 'outline': return 2
      case 'bold': return 3
      default: return 2
    }
  }
  
  const finalStrokeWidth = getStrokeWidth()

  // Get the icon component (case-insensitive)
  // First try exact match
  let IconComponent = iconMap[name]
  
  // If not found, try case-insensitive match
  if (!IconComponent) {
    const lowerName = name.toLowerCase()
    const matchedKey = Object.keys(iconMap).find(key => key.toLowerCase() === lowerName)
    if (matchedKey) {
      IconComponent = iconMap[matchedKey]
    }
  }

  if (IconComponent) {
    return (
      <IconComponent 
        size={iconSize}
        color={color}
        strokeWidth={finalStrokeWidth}
        className={`qwanyx-icon qwanyx-icon--${variant} ${className}`}
      />
    )
  }
  
  // Debug: log when icon not found
  console.log(`Icon "${name}" not found in iconMap. Available icons:`, Object.keys(iconMap))

  // Fallback to text/emoji if not a Lucide icon
  if (typeof name === 'string' && name.length <= 2) {
    return (
      <span 
        className={`qwanyx-icon qwanyx-icon--emoji ${className}`}
        style={{ 
          fontSize: `${iconSize}px`,
          color,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {name}
      </span>
    )
  }

  // Return placeholder if icon not found
  console.warn(`Icon "${name}" not found`)
  return (
    <span 
      className={`qwanyx-icon qwanyx-icon--placeholder ${className}`}
      style={{ 
        width: `${iconSize}px`,
        height: `${iconSize}px`,
        display: 'inline-block',
        backgroundColor: '#e5e7eb',
        borderRadius: '4px'
      }}
    />
  )
}

// Export icon names for convenience
export const Icons = {
  // Navigation
  Menu: 'Menu',
  X: 'X',
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
  Plus: 'Plus',
  Minus: 'Minus',
  Check: 'Check',
  Copy: 'Copy',
  Download: 'Download',
  Upload: 'Upload',
  Edit: 'Edit',
  Trash: 'Trash2',
  Save: 'Save',
  Settings: 'Settings',
  
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
  
  // Media
  Image: 'Image',
  Camera: 'Camera',
  Video: 'Video',
  Music: 'Music',
  Mic: 'Mic',
  Volume: 'Volume2',
  
  // Files
  File: 'File',
  FileText: 'FileText',
  Folder: 'Folder',
  FolderOpen: 'FolderOpen',
  Paperclip: 'Paperclip',
  
  // Commerce
  ShoppingCart: 'ShoppingCart',
  ShoppingBag: 'ShoppingBag',
  CreditCard: 'CreditCard',
  DollarSign: 'DollarSign',
  Tag: 'Tag',
  Gift: 'Gift',
  Package: 'Package',
  Truck: 'Truck',
  
  // Communication
  MessageSquare: 'MessageSquare',
  MessageCircle: 'MessageCircle',
  Send: 'Send',
  Bell: 'Bell',
  BellOff: 'BellOff',
  
  // Layout
  Grid: 'Grid',
  List: 'List',
  Layers: 'Layers',
  Layout: 'Layout',
  Sidebar: 'Sidebar',
  
  // Technology
  Wifi: 'Wifi',
  WifiOff: 'WifiOff',
  Bluetooth: 'Bluetooth',
  Database: 'Database',
  Server: 'Server',
  Cloud: 'Cloud',
  Globe: 'Globe',
  Monitor: 'Monitor',
  Smartphone: 'Smartphone',
  
  // Weather
  Sun: 'Sun',
  Moon: 'Moon',
  CloudRain: 'CloudRain',
  
  // Social
  Github: 'Github',
  
  // Automotive
  Car: 'Car',
  Wrench: 'Wrench',
  Shield: 'Shield',
  Zap: 'Zap',
  Activity: 'Activity',
  Gauge: 'Gauge',
  
  // Other
  Palette: 'Palette'
} as const

export type IconName = keyof typeof Icons | string