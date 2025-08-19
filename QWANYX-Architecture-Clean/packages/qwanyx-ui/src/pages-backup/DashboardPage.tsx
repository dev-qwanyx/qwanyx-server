import React from 'react'
import { Page, PageHeader, PageContent } from '../components/Page'
import { Container, Grid } from '../components/Container'
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card'
import { Heading, Text } from '../components/Text'
import { Button } from '../components/Button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/Tabs'

export interface DashboardPageProps {
  navigation?: {
    title?: string
    items?: Array<{
      label: string
      href?: string
    }>
    actions?: React.ReactNode
  }
  user?: {
    name: string
    role?: string
    avatar?: string
  }
  stats?: Array<{
    label: string
    value: string | number
    change?: string
    trend?: 'up' | 'down' | 'neutral'
  }>
  recentActivity?: Array<{
    title: string
    description: string
    time: string
    icon?: React.ReactNode
  }>
  quickActions?: Array<{
    label: string
    icon?: React.ReactNode
    onClick?: () => void
  }>
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  navigation = {
    title: 'Dashboard',
    items: [
      { label: 'Overview', href: '/dashboard' },
      { label: 'Analytics', href: '/analytics' },
      { label: 'Reports', href: '/reports' },
      { label: 'Settings', href: '/settings' }
    ],
    actions: <Button size="sm" variant="outline">Logout</Button>
  },
  user = {
    name: 'John Doe',
    role: 'Administrator'
  },
  stats = [
    { label: 'Total Sales', value: '$12,456', change: '+12%', trend: 'up' },
    { label: 'Active Users', value: '1,234', change: '+5%', trend: 'up' },
    { label: 'Conversion Rate', value: '3.4%', change: '-2%', trend: 'down' },
    { label: 'Avg. Order Value', value: '$156', change: '0%', trend: 'neutral' }
  ],
  recentActivity = [
    { title: 'New order received', description: 'Order #1234 from customer', time: '2 min ago' },
    { title: 'Payment processed', description: 'Payment for order #1233', time: '15 min ago' },
    { title: 'User registered', description: 'New user: jane@example.com', time: '1 hour ago' },
    { title: 'Report generated', description: 'Monthly sales report ready', time: '2 hours ago' }
  ],
  quickActions = [
    { label: 'New Order', icon: '📦' },
    { label: 'Add Product', icon: '➕' },
    { label: 'View Reports', icon: '📊' },
    { label: 'Settings', icon: '⚙️' }
  ]
}) => {
  const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
    switch(trend) {
      case 'up': return '#10b981'
      case 'down': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <Page navigation={navigation} footer={{ show: false }}>
      <PageHeader>
        <Container>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
            <div>
              <Heading size="xl">Welcome back, {user.name}</Heading>
              <Text>{user.role}</Text>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {quickActions.map((action, index) => (
                <Button key={index} onClick={action.onClick}>
                  <span style={{ marginRight: '0.5rem' }}>{action.icon}</span>
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </Container>
      </PageHeader>

      <PageContent>
        <Container>
          {/* Stats Grid */}
          <Grid cols={4} style={{ marginBottom: '2rem' }}>
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent>
                  <Text size="sm" style={{ color: '#6b7280' }}>{stat.label}</Text>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <Text size="2xl" weight="bold">{stat.value}</Text>
                    {stat.change && (
                      <Text size="sm" style={{ color: getTrendColor(stat.trend) }}>
                        {stat.change}
                      </Text>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </Grid>

          {/* Main Content Area */}
          <Grid cols={2} style={{ gap: '2rem' }}>
            {/* Charts/Analytics Section */}
            <Card>
              <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="weekly">
                  <TabsList>
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  </TabsList>
                  <TabsContent value="daily">
                    <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                      <Text>Daily Chart Placeholder</Text>
                    </div>
                  </TabsContent>
                  <TabsContent value="weekly">
                    <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                      <Text>Weekly Chart Placeholder</Text>
                    </div>
                  </TabsContent>
                  <TabsContent value="monthly">
                    <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                      <Text>Monthly Chart Placeholder</Text>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {recentActivity.map((activity, index) => (
                    <div key={index} style={{ padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <Text weight="semibold">{activity.title}</Text>
                        <Text size="sm" style={{ color: '#6b7280' }}>{activity.time}</Text>
                      </div>
                      <Text size="sm" style={{ color: '#6b7280' }}>{activity.description}</Text>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Container>
      </PageContent>
    </Page>
  )
}