import React from 'react'
import * as FilledIcons from '@mui/icons-material'
import * as OutlinedIcons from '@mui/icons-material'

// For dynamic variant loading
const getIconComponent = (name: string, variant: string) => {
  // Clean up the icon name
  const cleanName = name.replace(/[^a-zA-Z0-9]/g, '')
  
  // Map variants to their imports
  let IconComponent: any = null
  
  switch(variant) {
    case 'filled':
      IconComponent = FilledIcons[cleanName as keyof typeof FilledIcons]
      break
    case 'outlined':
      // Add 'Outlined' suffix for outlined variant
      const outlinedName = cleanName + 'Outlined'
      IconComponent = OutlinedIcons[outlinedName as keyof typeof OutlinedIcons]
      // Fallback to regular if outlined doesn't exist
      if (!IconComponent) {
        IconComponent = FilledIcons[cleanName as keyof typeof FilledIcons]
      }
      break
    case 'rounded':
      // Add 'Rounded' suffix for rounded variant
      const roundedName = cleanName + 'Rounded'
      IconComponent = FilledIcons[roundedName as keyof typeof FilledIcons]
      // Fallback to regular if rounded doesn't exist
      if (!IconComponent) {
        IconComponent = FilledIcons[cleanName as keyof typeof FilledIcons]
      }
      break
    case 'sharp':
      // Add 'Sharp' suffix for sharp variant
      const sharpName = cleanName + 'Sharp'
      IconComponent = FilledIcons[sharpName as keyof typeof FilledIcons]
      // Fallback to regular if sharp doesn't exist
      if (!IconComponent) {
        IconComponent = FilledIcons[cleanName as keyof typeof FilledIcons]
      }
      break
    case 'twoTone':
      // Add 'TwoTone' suffix for two tone variant
      const twoToneName = cleanName + 'TwoTone'
      IconComponent = FilledIcons[twoToneName as keyof typeof FilledIcons]
      // Fallback to regular if two tone doesn't exist
      if (!IconComponent) {
        IconComponent = FilledIcons[cleanName as keyof typeof FilledIcons]
      }
      break
    default:
      IconComponent = FilledIcons[cleanName as keyof typeof FilledIcons]
  }
  
  return IconComponent
}

export interface MaterialIconDynamicProps {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number
  color?: string
  className?: string
  variant?: 'filled' | 'outlined' | 'rounded' | 'sharp' | 'twoTone'
}

export const MaterialIconDynamic: React.FC<MaterialIconDynamicProps> = ({
  name,
  size = 'md',
  color = 'currentColor',
  className = '',
  variant = 'filled'
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
  const muiSize = iconSize <= 18 ? 'small' : iconSize <= 24 ? 'medium' : 'large'
  
  const IconComponent = getIconComponent(name, variant)

  if (IconComponent) {
    return (
      <IconComponent 
        fontSize={muiSize}
        sx={{ 
          fontSize: iconSize,
          color: color,
          verticalAlign: 'middle'
        }}
      />
    )
  }

  // Return placeholder if icon not found
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