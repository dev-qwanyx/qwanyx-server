import React from 'react'

interface BagProps {
  children: React.ReactNode
  color?: string  // Hex color or rgb
  opacity?: number  // 0 to 1
  blur?: boolean
  padding?: 'sm' | 'md' | 'lg'
  width?: string | number
  style?: React.CSSProperties
}

export const Bag: React.FC<BagProps> = ({
  children,
  color = '#6b7280',  // Default grey
  opacity = 0.7,
  blur = true,
  padding = 'sm',
  width,
  style = {}
}) => {
  const paddings = {
    sm: '6px',
    md: '10px', 
    lg: '14px'
  }

  // Convert hex to RGB if needed
  const getRgbColor = (color: string) => {
    if (color.startsWith('#')) {
      const hex = color.replace('#', '')
      const r = parseInt(hex.substring(0, 2), 16)
      const g = parseInt(hex.substring(2, 4), 16)
      const b = parseInt(hex.substring(4, 6), 16)
      return `${r}, ${g}, ${b}`
    }
    return color // Assume it's already in RGB format
  }

  const bgColor = `rgba(${getRgbColor(color)}, ${opacity})`
  console.log('Bag rendering with color:', bgColor)  // Debug log
  
  return (
    <div
      style={{
        backgroundColor: bgColor,
        backdropFilter: blur ? 'blur(10px) saturate(1.5)' : 'none',
        border: `1px solid rgba(${getRgbColor(color)}, 0.3)`,
        borderRadius: '6px',
        padding: paddings[padding],
        width: width || 'auto',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        ...style
      }}
    >
      {children}
    </div>
  )
}