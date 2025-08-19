'use client'

import { useEffect } from 'react'
import { ThemeProvider, WorkspaceProvider } from '@qwanyx/ui'
import { AuthProvider } from '@qwanyx/auth'

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
    
    // Set CSS variables for the theme colors
    root.style.setProperty('--qwanyx-primary', '230, 126, 34') // #E67E22 in RGB
    root.style.setProperty('--qwanyx-secondary', '52, 73, 94') // #34495E in RGB
    root.style.setProperty('--qwanyx-accent', '243, 156, 18') // #F39C12 in RGB
    root.style.setProperty('--qwanyx-success', '39, 174, 96') // #27AE60 in RGB
    root.style.setProperty('--qwanyx-warning', '241, 196, 15') // #F1C40F in RGB
    root.style.setProperty('--qwanyx-error', '231, 76, 60') // #E74C3C in RGB
    root.style.setProperty('--qwanyx-info', '52, 152, 219') // #3498DB in RGB
  }, [])
  
  return (
    <WorkspaceProvider defaultWorkspace="autodin">
      <ThemeProvider 
        defaultTheme={autodinTheme}
        persistTheme={false} // Don't save to localStorage - always use Autodin theme
      >
        <AuthProvider workspace="autodin">
          {children}
        </AuthProvider>
      </ThemeProvider>
    </WorkspaceProvider>
  )
}