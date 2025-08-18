import React, { useState } from 'react'
import { 
  DashboardLayout,
  SuperNavbar,
  SuperSidebar,
  Container,
  Grid,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Text,
  Button,
  Badge
} from '../../src'
import type { SidebarItem } from '../../src/components/SuperSidebar'

export const DashboardShowcase: React.FC = () => {
  const [activeView, setActiveView] = useState<'holy-grail' | 'dashboard' | 'analytics'>('holy-grail')

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'Dashboard',
      active: activeView === 'dashboard',
      onClick: () => setActiveView('dashboard')
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'Analytics',
      badge: '3',
      active: activeView === 'analytics',
      onClick: () => setActiveView('analytics'),
      children: [
        {
          id: 'analytics-overview',
          label: 'Overview',
          onClick: () => console.log('Overview clicked')
        },
        {
          id: 'analytics-reports',
          label: 'Reports',
          onClick: () => console.log('Reports clicked')
        }
      ]
    },
    {
      id: 'users',
      label: 'Users',
      icon: 'People',
      children: [
        {
          id: 'users-list',
          label: 'All Users',
          onClick: () => console.log('All Users clicked')
        },
        {
          id: 'users-roles',
          label: 'Roles & Permissions',
          onClick: () => console.log('Roles clicked')
        }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'Settings',
      onClick: () => console.log('Settings clicked')
    }
  ]

  const navbarConfig = {
    title: 'QWANYX Dashboard',
    variant: 'glass' as const,
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Services', href: '/services' },
      { label: 'About', href: '/about' }
    ],
    actions: (
      <Button size="sm" variant="primary">
        New Project
      </Button>
    )
  }

  const sidebarConfig = {
    items: sidebarItems,
    title: 'Admin Panel',
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Administrator',
      avatar: undefined
    },
    footer: (
      <div style={{ textAlign: 'center', opacity: 0.7 }}>
        <Text size="xs">© 2024 QWANYX</Text>
      </div>
    ),
    onLogout: () => console.log('Logout clicked')
  }

  const stats = [
    { label: 'Total Revenue', value: '$45,231', change: '+12%', trend: 'up' as const },
    { label: 'Active Users', value: '2,341', change: '+5%', trend: 'up' as const },
    { label: 'Conversion Rate', value: '3.24%', change: '-2%', trend: 'down' as const },
    { label: 'Avg. Order Value', value: '$312', change: '0%', trend: 'neutral' as const }
  ]

  const renderContent = () => {
    switch(activeView) {
      case 'dashboard':
        return (
          <Container>
            <div style={{ marginBottom: '2rem' }}>
              <Text size="2xl" weight="bold">Dashboard Overview</Text>
              <Text size="sm" color="secondary">Welcome back! Here's what's happening with your business today.</Text>
            </div>
            
            <Grid cols={4} style={{ marginBottom: '2rem', gap: '1.5rem' }}>
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent>
                    <Text size="sm" color="secondary">{stat.label}</Text>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <Text size="2xl" weight="bold">{stat.value}</Text>
                      <Badge 
                        size="sm" 
                        color={stat.trend === 'up' ? 'success' : stat.trend === 'down' ? 'danger' : 'secondary'}
                      >
                        {stat.change}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </Grid>

            <Grid cols={2} style={{ gap: '1.5rem' }}>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                      { title: 'New order #1234', time: '2 minutes ago', status: 'success' },
                      { title: 'User registration', time: '5 minutes ago', status: 'info' },
                      { title: 'Payment processed', time: '10 minutes ago', status: 'success' },
                      { title: 'System update', time: '1 hour ago', status: 'warning' }
                    ].map((activity, index) => (
                      <div key={index} style={{ 
                        padding: '0.75rem', 
                        background: 'rgba(var(--qwanyx-primary-rgb), 0.05)', 
                        borderRadius: '0.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Text size="sm" weight="medium">{activity.title}</Text>
                        <Text size="xs" color="secondary">{activity.time}</Text>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Button variant="outline" fullWidth>Create Report</Button>
                    <Button variant="outline" fullWidth>Export Data</Button>
                    <Button variant="outline" fullWidth>Add User</Button>
                    <Button variant="outline" fullWidth>View Logs</Button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Container>
        )
      
      case 'analytics':
        return (
          <Container>
            <Text size="2xl" weight="bold">Analytics</Text>
            <Text size="sm" color="secondary" style={{ marginBottom: '2rem' }}>
              Track your performance metrics and insights
            </Text>
            <Card>
              <CardContent>
                <div style={{ 
                  height: '400px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(var(--qwanyx-primary-rgb), 0.1), rgba(var(--qwanyx-secondary-rgb), 0.1))',
                  borderRadius: '0.5rem'
                }}>
                  <Text size="lg" color="secondary">Analytics Chart Placeholder</Text>
                </div>
              </CardContent>
            </Card>
          </Container>
        )

      default:
        return (
          <Container>
            <Text size="2xl" weight="bold">Welcome to QWANYX Dashboard</Text>
            <Text size="sm" color="secondary" style={{ marginBottom: '2rem' }}>
              Select a menu item from the sidebar to get started
            </Text>
            <Card>
              <CardContent>
                <Text>This is a demonstration of the DashboardLayout component with SuperNavbar and SuperSidebar.</Text>
              </CardContent>
            </Card>
          </Container>
        )
    }
  }

  return (
    <div style={{ marginTop: '-80px' }}>
      <DashboardLayout
        navbar={navbarConfig}
        sidebar={sidebarConfig}
        contentPadding={true}
      >
        {renderContent()}
      </DashboardLayout>
    </div>
  )
}