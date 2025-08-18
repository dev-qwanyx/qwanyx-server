import React, { useState, ReactNode } from 'react'
import { 
  DashboardLayout,
  Container,
  Grid,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Text,
  Button,
  Badge
} from '@qwanyx/ui'

// Define our own SidebarItem type to avoid conflicts
export interface SidebarItem {
  id: string
  label: string
  icon?: string
  href?: string
  onClick?: () => void
  badge?: string | number
  active?: boolean
  children?: SidebarItem[]
  disabled?: boolean
}

// Type definitions for the dashboard
export interface DashboardUser {
  id: string
  name: string
  email: string
  role?: string
  avatar?: string
}

export interface DashboardStat {
  label: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  color?: string
  icon?: ReactNode
}

export interface DashboardActivity {
  id: string
  title: string
  description?: string
  time: string
  type?: string
  icon?: ReactNode
}

export interface DashboardConfig {
  // Basic Info
  title: string
  logo?: ReactNode | string
  
  // Sidebar (only layout component in dashboard-v2)
  sidebarItems: SidebarItem[]
  sidebarFooter?: ReactNode
  sidebarTheme?: 'light' | 'dark' | 'auto'
  sidebarStyle?: React.CSSProperties
  
  // User
  user?: DashboardUser
  
  // Content
  stats?: DashboardStat[]
  recentActivity?: DashboardActivity[]
  quickActions?: Array<{
    label: string
    icon?: ReactNode
    onClick?: () => void
    variant?: 'primary' | 'secondary' | 'outline'
  }>
  
  // Customization
  primaryColor?: string
  contentPadding?: boolean
  customContent?: Record<string, ReactNode>
}

export interface DashboardProps {
  config: DashboardConfig
  currentView?: string
  onViewChange?: (view: string) => void
  children?: ReactNode
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  config, 
  currentView: externalView,
  onViewChange,
  children 
}) => {
  const [internalView, setInternalView] = useState('overview')
  const currentView = externalView || internalView
  
  const handleViewChange = (view: string) => {
    if (onViewChange) {
      onViewChange(view)
    } else {
      setInternalView(view)
    }
  }

  // Update sidebar items with active state
  const sidebarItemsWithActive: SidebarItem[] = config.sidebarItems.map(item => ({
    ...item,
    active: item.id === currentView,
    onClick: () => {
      handleViewChange(item.id)
      item.onClick?.()
    },
    children: item.children?.map(child => ({
      ...child,
      active: child.id === currentView,
      onClick: () => {
        handleViewChange(child.id)
        child.onClick?.()
      }
    }))
  }))

  const sidebarConfig = {
    items: sidebarItemsWithActive,
    logo: config.logo,
    title: config.title,
    theme: config.sidebarTheme || 'light',
    user: config.user,
    footer: config.sidebarFooter,
    style: config.sidebarStyle
  }

  const renderOverview = () => {
    const { stats = [], recentActivity = [], quickActions = [] } = config
    
    return (
      <div>
        {/* Statistics */}
        {stats.length > 0 && (
          <Grid cols={stats.length <= 4 ? stats.length : 4} style={{ marginBottom: '1.5rem', gap: '1rem' }}>
            {stats.map((stat, index) => (
              <Card key={index} style={{ borderTop: stat.color ? `3px solid ${stat.color}` : undefined }}>
                <CardContent>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {stat.icon}
                    <Text size="sm" color="secondary">{stat.label}</Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <Text size="2xl" weight="bold" style={{ color: stat.color }}>
                      {stat.value}
                    </Text>
                    {stat.change && (
                      <Badge 
                        size="sm" 
                        color={stat.trend === 'up' ? 'success' : stat.trend === 'down' ? 'error' : 'secondary'}
                      >
                        {stat.change}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </Grid>
        )}

        <Grid cols={2} style={{ gap: '1rem' }}>
          {/* Recent Activity */}
          {recentActivity.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} style={{ 
                      padding: '0.75rem', 
                      background: 'rgba(var(--qwanyx-primary-rgb), 0.05)', 
                      borderRadius: '0.5rem',
                      borderLeft: `3px solid ${config.primaryColor || 'rgb(var(--qwanyx-primary))'}`
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {activity.icon}
                        <Text size="sm" weight="medium">{activity.title}</Text>
                      </div>
                      {activity.description && (
                        <Text size="xs" color="secondary" style={{ marginTop: '0.25rem', marginLeft: activity.icon ? '1.5rem' : 0 }}>
                          {activity.description}
                        </Text>
                      )}
                      <Text size="xs" color="secondary" style={{ marginTop: '0.25rem', marginLeft: activity.icon ? '1.5rem' : 0 }}>
                        {activity.time}
                      </Text>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          {quickActions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  {quickActions.map((action, index) => (
                    <Button 
                      key={index}
                      variant={action.variant || 'outline'}
                      fullWidth
                      onClick={action.onClick}
                      style={action.variant === 'primary' && config.primaryColor ? {
                        backgroundColor: config.primaryColor,
                        borderColor: config.primaryColor
                      } : undefined}
                    >
                      {action.icon && <span style={{ marginRight: '0.5rem' }}>{action.icon}</span>}
                      {action.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </Grid>
      </div>
    )
  }

  const renderContent = () => {
    // If custom content is provided for this view, use it
    if (config.customContent?.[currentView]) {
      return config.customContent[currentView]
    }
    
    // If children are provided, use them
    if (children) {
      return children
    }
    
    // Default to overview
    if (currentView === 'overview') {
      return renderOverview()
    }
    
    // Fallback for other views
    return (
      <Container>
        <Text size="2xl" weight="bold">
          {currentView.charAt(0).toUpperCase() + currentView.slice(1).replace(/-/g, ' ')}
        </Text>
        <Text size="sm" color="secondary" style={{ marginBottom: '2rem' }}>
          This section is under development
        </Text>
        <Card>
          <CardContent>
            <Text>Content for view: {currentView}</Text>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <DashboardLayout
      navbar={false}  // No navbar in dashboard-v2
      sidebar={sidebarConfig}
      rightSidebar={false}  // No right sidebar in dashboard-v2
      contentPadding={config.contentPadding !== false}
    >
      {renderContent()}
    </DashboardLayout>
  )
}

// Preset dashboard configurations
export const createMarketplaceDashboard = (customConfig?: Partial<DashboardConfig>): DashboardConfig => ({
  title: 'Marketplace Dashboard',
  sidebarItems: [
    { id: 'overview', label: 'Overview', icon: 'Dashboard' },
    { id: 'products', label: 'Products', icon: 'Inventory' },
    { id: 'orders', label: 'Orders', icon: 'ShoppingCart' },
    { id: 'customers', label: 'Customers', icon: 'People' },
    { id: 'analytics', label: 'Analytics', icon: 'Analytics' },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ],
  ...customConfig
})

export const createAdminDashboard = (customConfig?: Partial<DashboardConfig>): DashboardConfig => ({
  title: 'Admin Dashboard',
  sidebarItems: [
    { id: 'overview', label: 'Overview', icon: 'Dashboard' },
    { id: 'users', label: 'Users', icon: 'People' },
    { id: 'roles', label: 'Roles & Permissions', icon: 'Security' },
    { id: 'content', label: 'Content', icon: 'Article' },
    { id: 'reports', label: 'Reports', icon: 'Assessment' },
    { id: 'system', label: 'System', icon: 'Build' },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ],
  ...customConfig
})

export const createProjectDashboard = (customConfig?: Partial<DashboardConfig>): DashboardConfig => ({
  title: 'Project Dashboard',
  sidebarItems: [
    { id: 'overview', label: 'Overview', icon: 'Dashboard' },
    { id: 'tasks', label: 'Tasks', icon: 'Task' },
    { id: 'team', label: 'Team', icon: 'Groups' },
    { id: 'timeline', label: 'Timeline', icon: 'Schedule' },
    { id: 'files', label: 'Files', icon: 'Folder' },
    { id: 'reports', label: 'Reports', icon: 'Assessment' },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ],
  ...customConfig
})

// Export all types and components
export default Dashboard