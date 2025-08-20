import React, { useState } from 'react'
// Pages not implemented yet
// import { LandingPage } from '../../src/pages/LandingPage'
// import { DashboardPage } from '../../src/pages/DashboardPage'
// import { MarketplacePage } from '../../src/pages/MarketplacePage'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../src/components/Tabs'
import { Container } from '../../src/components/Container'
import { Heading, Text } from '../../src/components/Text'
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/Card'
import { Button } from '../../src/components/Button'
import { Grid } from '../../src/components/Container'

export const PageShowcase: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'landing' | 'dashboard' | 'marketplace'>('landing')
  const [showFullPage, setShowFullPage] = useState<string | null>(null)

  const pageDescriptions = {
    landing: {
      title: 'Landing Page',
      description: 'A complete landing page with hero, features, and pricing sections',
      usage: `import { LandingPage } from '@qwanyx/ui/pages'

<LandingPage 
  navigation={{
    title: "Your Brand",
    items: [...],
    actions: <Button>Get Started</Button>
  }}
  hero={{
    title: "Welcome",
    subtitle: "Your tagline here"
  }}
  features={[...]}
  pricing={[...]}
/>`
    },
    dashboard: {
      title: 'Dashboard Page',
      description: 'Admin dashboard with stats, charts, and activity feed',
      usage: `import { DashboardPage } from '@qwanyx/ui/pages'

<DashboardPage 
  navigation={{...}}
  user={{
    name: "John Doe",
    role: "Admin"
  }}
  stats={[...]}
  recentActivity={[...]}
/>`
    },
    marketplace: {
      title: 'Marketplace Page',
      description: 'E-commerce marketplace with product grid and filters',
      usage: `import { MarketplacePage } from '@qwanyx/ui/pages'

<MarketplacePage 
  navigation={{...}}
  hero={{
    title: "Find What You Need"
  }}
  categories={[...]}
  items={[...]}
  filters={{
    showSearch: true,
    showCategories: true
  }}
/>`
    }
  }

  // Full page preview overlay
  if (showFullPage) {
    return (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: 9999, 
        background: 'white',
        overflow: 'auto'
      }}>
        <button
          onClick={() => setShowFullPage(null)}
          style={{ 
            position: 'fixed', 
            top: '1rem', 
            right: '1rem', 
            zIndex: 10000,
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgb(var(--border))',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '300',
            color: 'rgb(var(--text))',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ✕
        </button>
        <div style={{ minHeight: '100vh' }}>
          {/* Pages not implemented yet */}
          {showFullPage === 'landing' && <div>LandingPage not implemented</div>}
          {showFullPage === 'dashboard' && <div>DashboardPage not implemented</div>}
          {showFullPage === 'marketplace' && <div>MarketplacePage not implemented</div>}
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Container>
        <Heading size="3xl" style={{ marginBottom: '1rem' }}>
          Preconfigured Pages
        </Heading>
        <Text size="lg" style={{ marginBottom: '2rem' }}>
          Ready-to-use page templates that you can customize for your needs
        </Text>

        <Grid cols={3} style={{ gap: '2rem', marginBottom: '3rem' }}>
          {/* Landing Page Card */}
          <Card>
            <CardHeader>
              <CardTitle>{pageDescriptions.landing.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Text style={{ marginBottom: '1rem' }}>
                {pageDescriptions.landing.description}
              </Text>
              <Button 
                fullWidth 
                onClick={() => setShowFullPage('landing')}
                style={{ marginBottom: '1rem' }}
              >
                View Full Page Demo
              </Button>
              <details>
                <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                  <Text weight="semibold">Usage Example</Text>
                </summary>
                <pre style={{ 
                  background: '#f3f4f6', 
                  padding: '1rem', 
                  borderRadius: '0.5rem',
                  overflow: 'auto',
                  fontSize: '0.875rem'
                }}>
                  <code>{pageDescriptions.landing.usage}</code>
                </pre>
              </details>
            </CardContent>
          </Card>

          {/* Dashboard Page Card */}
          <Card>
            <CardHeader>
              <CardTitle>{pageDescriptions.dashboard.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Text style={{ marginBottom: '1rem' }}>
                {pageDescriptions.dashboard.description}
              </Text>
              <Button 
                fullWidth 
                onClick={() => setShowFullPage('dashboard')}
                style={{ marginBottom: '1rem' }}
              >
                View Full Page Demo
              </Button>
              <details>
                <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                  <Text weight="semibold">Usage Example</Text>
                </summary>
                <pre style={{ 
                  background: '#f3f4f6', 
                  padding: '1rem', 
                  borderRadius: '0.5rem',
                  overflow: 'auto',
                  fontSize: '0.875rem'
                }}>
                  <code>{pageDescriptions.dashboard.usage}</code>
                </pre>
              </details>
            </CardContent>
          </Card>

          {/* Marketplace Page Card */}
          <Card>
            <CardHeader>
              <CardTitle>{pageDescriptions.marketplace.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Text style={{ marginBottom: '1rem' }}>
                {pageDescriptions.marketplace.description}
              </Text>
              <Button 
                fullWidth 
                onClick={() => setShowFullPage('marketplace')}
                style={{ marginBottom: '1rem' }}
              >
                View Full Page Demo
              </Button>
              <details>
                <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                  <Text weight="semibold">Usage Example</Text>
                </summary>
                <pre style={{ 
                  background: '#f3f4f6', 
                  padding: '1rem', 
                  borderRadius: '0.5rem',
                  overflow: 'auto',
                  fontSize: '0.875rem'
                }}>
                  <code>{pageDescriptions.marketplace.usage}</code>
                </pre>
              </details>
            </CardContent>
          </Card>
        </Grid>

        {/* Configuration Examples Section */}
        <Card>
          <CardHeader>
            <CardTitle>Advanced Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={currentPage} onValueChange={(value) => setCurrentPage(value as any)}>
              <TabsList>
                <TabsTrigger value="landing">Landing Page</TabsTrigger>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
              </TabsList>

              <TabsContent value="landing">
                <pre style={{ 
                  background: '#f3f4f6', 
                  padding: '1rem', 
                  borderRadius: '0.5rem',
                  overflow: 'auto'
                }}>
                  <code>{`// Full configuration example
<LandingPage 
  navigation={{
    title: "Your Brand",
    items: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'About', href: '#about' },
      { label: 'Contact', href: '#contact' }
    ],
    actions: <Button size="sm">Get Started</Button>
  }}
  hero={{
    title: "Welcome to Our Platform",
    subtitle: "Build something amazing",
    primaryAction: { 
      label: 'Get Started',
      onClick: () => console.log('Start') 
    },
    secondaryAction: { 
      label: 'Learn More',
      onClick: () => console.log('Learn') 
    },
    backgroundImage: "/hero-bg.jpg"
  }}
  features={[
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Optimized for speed'
    },
    // ... more features
  ]}
  pricing={[
    {
      title: 'Starter',
      price: '$9/mo',
      description: 'Perfect for small projects',
      features: ['1 User', '10 Projects'],
      highlighted: false
    },
    // ... more plans
  ]}
  showFooter={true}
/>`}</code>
                </pre>
              </TabsContent>

              <TabsContent value="dashboard">
                <pre style={{ 
                  background: '#f3f4f6', 
                  padding: '1rem', 
                  borderRadius: '0.5rem',
                  overflow: 'auto'
                }}>
                  <code>{`// Full configuration example
<DashboardPage 
  navigation={{
    title: "Dashboard",
    items: [
      { label: 'Overview', href: '/dashboard' },
      { label: 'Analytics', href: '/analytics' },
      { label: 'Reports', href: '/reports' },
      { label: 'Settings', href: '/settings' }
    ],
    actions: <Button size="sm" variant="outline">Logout</Button>
  }}
  user={{
    name: "John Doe",
    role: "Administrator",
    avatar: "/avatar.jpg"
  }}
  stats={[
    { 
      label: 'Total Sales', 
      value: '$12,456', 
      change: '+12%', 
      trend: 'up' 
    },
    { 
      label: 'Active Users', 
      value: '1,234', 
      change: '+5%', 
      trend: 'up' 
    },
    // ... more stats
  ]}
  recentActivity={[
    { 
      title: 'New order received', 
      description: 'Order #1234', 
      time: '2 min ago',
      icon: '📦'
    },
    // ... more activities
  ]}
  quickActions={[
    { label: 'New Order', icon: '📦', onClick: () => {} },
    { label: 'Add Product', icon: '➕', onClick: () => {} },
    // ... more actions
  ]}
/>`}</code>
                </pre>
              </TabsContent>

              <TabsContent value="marketplace">
                <pre style={{ 
                  background: '#f3f4f6', 
                  padding: '1rem', 
                  borderRadius: '0.5rem',
                  overflow: 'auto'
                }}>
                  <code>{`// Full configuration example
<MarketplacePage 
  navigation={{
    title: "Marketplace",
    items: [
      { label: 'Home', href: '/' },
      { label: 'Browse', href: '/browse' },
      { label: 'Sell', href: '/sell' },
      { label: 'My Items', href: '/my-items' }
    ],
    actions: (
      <>
        <Button size="sm" variant="outline">Cart (0)</Button>
        <Button size="sm">Sign In</Button>
      </>
    )
  }}
  hero={{
    title: "Find What You Need",
    subtitle: "Browse thousands of items",
    searchPlaceholder: "Search for items..."
  }}
  categories={[
    { label: 'All Categories', value: 'all', count: 1234 },
    { label: 'Electronics', value: 'electronics', count: 342 },
    // ... more categories
  ]}
  items={[
    {
      id: '1',
      title: 'Premium Headphones',
      description: 'Wireless noise-canceling',
      price: '$299',
      image: '/product.jpg',
      category: 'Electronics',
      seller: 'TechStore',
      rating: 4.5,
      inStock: true
    },
    // ... more items
  ]}
  filters={{
    showSearch: true,
    showCategories: true,
    showPriceRange: true,
    showSort: true
  }}
/>`}</code>
                </pre>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </Container>
    </div>
  )
}