'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Dashboard, createMarketplaceDashboard } from '@qwanyx/dashboard-v2'
import type { DashboardConfig, DashboardStat, DashboardActivity } from '@qwanyx/dashboard-v2'
import { Container, Text, Card, CardContent, Grid, Button, Badge } from '@qwanyx/ui'
import { ThotManagement, DigitalHumansPage } from '@qwanyx/thot'
import UsersContent from './UsersContent'
import { getApiUrl } from '@/config/api.config'

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab')
  const [currentView, setCurrentView] = useState(tabFromUrl || 'overview')
  const [userCount, setUserCount] = useState<number | null>(0)
  const [dhCount, setDhCount] = useState<number | null>(0)
  const [currentUserRole, setCurrentUserRole] = useState<string>('particulier')
  
  // Get user directly from localStorage - no loading state needed
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('autodin_user') : null
  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('autodin_token') : null
  const tokenExpiry = typeof window !== 'undefined' ? localStorage.getItem('autodin_token_expiry') : null
  
  const [user] = useState<any>(storedUser ? JSON.parse(storedUser) : null)

  // Update currentView when URL changes
  useEffect(() => {
    if (tabFromUrl) {
      setCurrentView(tabFromUrl)
    }
  }, [tabFromUrl])

  useEffect(() => {
    console.log('Dashboard useEffect triggered')
    // Check if user is logged in
    if (!storedUser || !storedToken || !tokenExpiry) {
      // Not logged in, redirect to home
      console.log('No auth, redirecting')
      router.push('/')
      return
    }
    
    const expiryTime = parseInt(tokenExpiry)
    if (expiryTime <= Date.now()) {
      // Token expired, redirect to home
      console.log('Token expired, redirecting')
      localStorage.removeItem('autodin_user')
      localStorage.removeItem('autodin_token')
      localStorage.removeItem('autodin_token_expiry')
      router.push('/')
      return
    }
    
    // Fetch user count
    const fetchUserCount = async () => {
      try {
        const workspace = localStorage.getItem('autodin_workspace') || 'autodin'
        console.log('Fetching user count...')
        const response = await fetch(getApiUrl('/users'), {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
            'X-Workspace': workspace
          }
        })
        
        console.log('Response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Users data:', data)
          const usersArray = Array.isArray(data) ? data : (data.users || [])
          // Filter out DH users
          const regularUsers = usersArray.filter((u: any) => u.type !== 'DH')
          const dhUsers = usersArray.filter((u: any) => u.type === 'DH')
          console.log('Regular users count:', regularUsers.length)
          console.log('Digital Humans count:', dhUsers.length)
          setUserCount(regularUsers.length)
          setDhCount(dhUsers.length)
          
          // Find current user's role
          const userEmail = user?.email
          if (userEmail) {
            const currentUser = usersArray.find((u: any) => u.email === userEmail)
            if (currentUser) {
              setCurrentUserRole(currentUser.role || 'particulier')
              console.log('Current user role:', currentUser.role)
            }
          }
        } else {
          console.error('Failed to fetch users:', response.status)
          // Set a default value
          setUserCount(0)
        }
      } catch (error) {
        console.error('Error fetching user count:', error)
        // Set a default value
        setUserCount(0)
      }
    }
    
    fetchUserCount()
  }, [router, storedUser, storedToken, tokenExpiry, user])

  const handleLogout = () => {
    localStorage.removeItem('autodin_user')
    localStorage.removeItem('autodin_token')
    localStorage.removeItem('autodin_token_expiry')
    sessionStorage.removeItem('autodin_user')
    sessionStorage.removeItem('autodin_token')
    router.push('/')
  }

  if (!user) {
    return null
  }

  // Autodin specific stats
  const stats: DashboardStat[] = [
    { 
      label: 'Annonces actives', 
      value: '3', 
      change: '+2 ce mois', 
      trend: 'up',
      color: '#E67E22'
    },
    { 
      label: 'Vues totales', 
      value: '1,234', 
      change: '+15%', 
      trend: 'up',
      color: '#3498db'
    },
    { 
      label: 'Messages reçus', 
      value: '12', 
      change: '5 non lus', 
      trend: 'neutral',
      color: '#9b59b6'
    },
    { 
      label: 'Ventes réalisées', 
      value: '8', 
      change: '2,450€', 
      trend: 'up',
      color: '#27ae60'
    }
  ]

  // Recent activity
  const recentActivity: DashboardActivity[] = [
    { 
      id: '1',
      title: 'Nouveau message pour "Phare avant Golf 5"', 
      time: 'Il y a 2h', 
      type: 'message'
    },
    { 
      id: '2',
      title: 'Votre annonce "Rétroviseur Clio 3" a été vue 45 fois', 
      time: 'Il y a 5h', 
      type: 'view'
    },
    { 
      id: '3',
      title: 'Nouvelle offre sur "Jantes alu 17 pouces"', 
      time: 'Hier', 
      type: 'offer'
    },
    { 
      id: '4',
      title: 'Vente confirmée: "Pare-choc arrière 206"', 
      time: 'Il y a 2 jours', 
      type: 'sale'
    }
  ]

  // Custom content for different views
  const customContent = {
    'users': (
      <UsersContent />
    ),
    'thot': (
      <ThotManagement config={{
        apiUrl: 'http://135.181.72.183:5002/api',
        workspace: 'autodin'
      }} />
    ),
    'thot': (
      <DigitalHumansPage />
    ),
    'thot-configuration': (
      <ThotManagement config={{
        apiUrl: 'http://135.181.72.183:5002/api',
        workspace: 'autodin'
      }} />
    ),
    'thot-templates': (
      <ThotManagement config={{
        apiUrl: 'http://135.181.72.183:5002/api',
        workspace: 'autodin'
      }} />
    ),
    'thot-prompts': (
      <ThotManagement config={{
        apiUrl: 'http://135.181.72.183:5002/api',
        workspace: 'autodin'
      }} />
    ),
    'thot-inbox': (
      <ThotManagement config={{
        apiUrl: 'http://135.181.72.183:5002/api',
        workspace: 'autodin'
      }} />
    ),
    'thot-logs': (
      <ThotManagement config={{
        apiUrl: 'http://135.181.72.183:5002/api',
        workspace: 'autodin'
      }} />
    ),
    'listings': (
      <Container>
        <Text size="2xl" weight="bold">Mes annonces actives</Text>
        <Text size="sm" color="secondary" style={{ marginBottom: '2rem' }}>
          Gérez vos annonces de pièces automobiles
        </Text>
        
        <Grid cols={3} style={{ gap: '1.5rem' }}>
          {[
            { title: 'Phare avant Golf 5', price: '120€', views: 234, messages: 3 },
            { title: 'Rétroviseur Clio 3', price: '45€', views: 156, messages: 1 },
            { title: 'Jantes alu 17 pouces', price: '350€', views: 89, messages: 5 }
          ].map((listing, index) => (
            <Card key={index}>
              <CardContent>
                <div style={{ 
                  height: '120px', 
                  background: 'linear-gradient(135deg, rgba(230, 126, 34, 0.1), rgba(230, 126, 34, 0.2))',
                  borderRadius: '0.5rem',
                  marginBottom: '1rem'
                }}>
                </div>
                <Text weight="semibold">{listing.title}</Text>
                <Text size="xl" weight="bold" style={{ color: '#E67E22', margin: '0.5rem 0' }}>
                  {listing.price}
                </Text>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <Badge size="sm" color="secondary">{listing.views} vues</Badge>
                  <Badge size="sm" color="primary">{listing.messages} msg</Badge>
                </div>
                <Button 
                  variant="outline" 
                  fullWidth 
                  size="sm"
                  style={{ marginTop: '1rem' }}
                >
                  Gérer
                </Button>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Container>
    ),
    'messages': (
      <Container>
        <Text size="2xl" weight="bold">Messages</Text>
        <Text size="sm" color="secondary" style={{ marginBottom: '2rem' }}>
          Vous avez 5 messages non lus
        </Text>
        <Card>
          <CardContent>
            <div style={{ 
              height: '400px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(230, 126, 34, 0.05), rgba(230, 126, 34, 0.1))',
              borderRadius: '0.5rem'
            }}>
              <Text size="lg" color="secondary">Zone de messagerie (à implémenter)</Text>
            </div>
          </CardContent>
        </Card>
      </Container>
    )
  }

  // Build sidebar items based on user role
  const buildSidebarItems = () => {
    console.log('Building sidebar with role:', currentUserRole)
    const items = [
      {
        id: 'overview',
        label: 'Vue d\'ensemble',
        icon: 'Dashboard'
      }
    ]
    
    // Users menu - available to everyone for now
    items.push({
      id: 'users',
      label: 'Utilisateurs',
      icon: 'People',
      badge: userCount !== null ? userCount.toString() : undefined
    })
    
    // Digital Team - available to everyone for now
    items.push({
      id: 'thot',
      label: 'Digital Team',
      icon: 'SmartToy',
      badge: dhCount !== null ? dhCount.toString() : undefined
    })
    
    // Continue with other items that everyone can see
    items.push(
      {
        id: 'listings',
        label: 'Mes annonces',
        icon: 'DirectionsCar',
        badge: '3',
        children: [
          {
            id: 'listings-active',
            label: 'Annonces actives'
          },
          {
            id: 'listings-draft',
            label: 'Brouillons'
          },
          {
            id: 'listings-sold',
            label: 'Vendues'
          }
        ]
      },
      {
        id: 'messages',
        label: 'Messages',
        icon: 'Mail',
        badge: '12'
      },
      {
        id: 'analytics',
        label: 'Statistiques',
        icon: 'Analytics'
      },
      {
        id: 'favorites',
        label: 'Favoris',
        icon: 'Favorite'
      },
      {
        id: 'settings',
        label: 'Paramètres',
        icon: 'Settings',
        children: [
          {
            id: 'settings-profile',
            label: 'Mon profil'
          },
          {
            id: 'settings-security',
            label: 'Sécurité'
          },
          {
            id: 'settings-notifications',
            label: 'Notifications'
          }
        ]
      }
    )
    
    return items
  }

  // Dashboard configuration for Autodin - Simplified with only left sidebar
  const dashboardConfig: DashboardConfig = createMarketplaceDashboard({
    title: 'Autodin',
    primaryColor: '#E67E22',
    user: user ? {
      id: user.id || user._id || '1',
      name: user.firstName || user.email,
      email: user.email,
      role: user.role || 'Vendeur',
      avatar: user.avatar
    } : undefined,
    sidebarItems: buildSidebarItems(),
    sidebarFooter: (
      <div style={{ textAlign: 'center', opacity: 0.7 }}>
        <Text size="xs">© 2024 Autodin</Text>
        <Text size="xs">Marketplace de pièces auto</Text>
      </div>
    ),
    sidebarStyle: {
      borderRight: '2px solid rgba(230, 126, 34, 0.2)'
    },
    stats,
    recentActivity,
    quickActions: [
      {
        label: 'Créer une nouvelle annonce',
        onClick: () => router.push('/dashboard/new-listing'),
        variant: 'primary'
      },
      {
        label: 'Voir mes messages',
        onClick: () => setCurrentView('messages'),
        variant: 'outline'
      },
      {
        label: 'Gérer mes annonces',
        onClick: () => setCurrentView('listings'),
        variant: 'outline'
      },
      {
        label: 'Parcourir le marketplace',
        onClick: () => router.push('/marketplace'),
        variant: 'outline'
      }
    ],
    customContent
  })

  return (
    <Dashboard 
      config={dashboardConfig}
      currentView={currentView}
      onViewChange={setCurrentView}
    />
  )
}