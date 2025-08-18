'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardRouter } from '@qwanyx/dashboard'
import { Text } from '@qwanyx/ui'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('autodin_user')
    const storedToken = localStorage.getItem('autodin_token')
    const tokenExpiry = localStorage.getItem('autodin_token_expiry')
    
    if (storedUser && storedToken && tokenExpiry) {
      const expiryTime = parseInt(tokenExpiry)
      if (expiryTime > Date.now()) {
        setUser(JSON.parse(storedUser))
        setLoading(false)
      } else {
        // Token expired, redirect to home
        localStorage.removeItem('autodin_user')
        localStorage.removeItem('autodin_token')
        localStorage.removeItem('autodin_token_expiry')
        router.push('/')
      }
    } else {
      // Not logged in, redirect to home
      router.push('/')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('autodin_user')
    localStorage.removeItem('autodin_token')
    localStorage.removeItem('autodin_token_expiry')
    sessionStorage.removeItem('autodin_user')
    sessionStorage.removeItem('autodin_token')
    router.push('/')
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Text>Chargement...</Text>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Create the dashboard configuration
  const dashboardConfig = {
    title: 'Autodin Dashboard',
    logo: <img src="/images/logo.png" alt="Autodin" style={{ height: '40px' }} />,
    user: {
      id: user.id || user._id || '1',
      name: user.firstName || user.email,
      email: user.email,
      role: user.role || 'user'
    },
    menuItems: [
      {
        id: 'overview',
        label: 'Vue d\'ensemble',
        icon: '📊',
        href: '/dashboard'
      },
      {
        id: 'listings',
        label: 'Mes annonces',
        icon: '🚗',
        href: '/dashboard/listings'
      },
      {
        id: 'messages',
        label: 'Messages',
        icon: '💬',
        href: '/dashboard/messages'
      },
      {
        id: 'analytics',
        label: 'Statistiques',
        icon: '📈',
        href: '/dashboard/analytics'
      },
      {
        id: 'settings',
        label: 'Paramètres',
        icon: '⚙️',
        href: '/dashboard/settings'
      }
    ],
    modules: {}, // No external modules for now
    onLogout: handleLogout,
    theme: 'light' as const
  }

  return (
    <DashboardRouter 
      config={dashboardConfig}
      currentPath={typeof window !== 'undefined' ? window.location.pathname : '/dashboard'}
    />
  )
}