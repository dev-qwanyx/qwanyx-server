'use client'

import { useEffect } from 'react'
import { ThemeProvider } from '@qwanyx/ui'

// Autodin theme configuration
const autodinTheme = {
  name: 'Autodin Theme',
  colors: {
    primary: '#E67E22',
    secondary: '#34495E', 
    accent: '#F39C12',
    success: '#27AE60',
    warning: '#F1C40F',
    error: '#E74C3C',
    info: '#3498DB',
    background: '#F9FAFB',
    foreground: '#2C3E50',
    card: '#FFFFFF',
    'card-foreground': '#2C3E50',
    border: '#E5E7EB',
    input: '#FFFFFF',
    ring: '#E67E22',
    'text-primary': '#2C3E50',
    'text-secondary': '#475569',
    'text-muted': '#94A3B8'
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Force light mode for Autodin
    const root = document.documentElement
    root.setAttribute('data-theme', 'light')
    root.classList.remove('dark')
    root.classList.add('light')
    
    // Clear theme mode storage to prevent dark mode
    localStorage.setItem('qwanyx-theme-mode', 'light')
  }, [])
  
  return (
    <ThemeProvider 
      defaultTheme={autodinTheme}
      persistTheme={false} // Don't save to localStorage - always use Autodin theme
    >
      {children}
    </ThemeProvider>
  )
}