import React from 'react'
import { Page, PageSection } from '../components/Page'
import { Container, Grid } from '../components/Container'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardImage } from '../components/Card'
import { Heading, Text } from '../components/Text'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { Input } from '../components/Input'
import { SimpleSelect } from '../components/SimpleSelect'

export interface MarketplaceItem {
  id: string
  title: string
  description: string
  price: string
  image?: string
  category?: string
  seller?: string
  rating?: number
  inStock?: boolean
}

export interface MarketplacePageProps {
  navigation?: {
    title?: string
    items?: Array<{
      label: string
      href?: string
    }>
    actions?: React.ReactNode
  }
  hero?: {
    title: string
    subtitle?: string
    searchPlaceholder?: string
  }
  categories?: Array<{
    label: string
    value: string
    count?: number
  }>
  items?: MarketplaceItem[]
  filters?: {
    showSearch?: boolean
    showCategories?: boolean
    showPriceRange?: boolean
    showSort?: boolean
  }
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  navigation = {
    title: 'Marketplace',
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
    ),
    sticky: true
  },
  hero = {
    title: 'Find What You Need',
    subtitle: 'Browse thousands of items from trusted sellers',
    searchPlaceholder: 'Search for items...'
  },
  categories = [
    { label: 'All Categories', value: 'all', count: 1234 },
    { label: 'Electronics', value: 'electronics', count: 342 },
    { label: 'Fashion', value: 'fashion', count: 456 },
    { label: 'Home & Garden', value: 'home', count: 234 },
    { label: 'Sports', value: 'sports', count: 123 },
    { label: 'Books', value: 'books', count: 89 }
  ],
  items = [
    {
      id: '1',
      title: 'Premium Headphones',
      description: 'Wireless noise-canceling headphones with premium sound quality',
      price: '$299',
      category: 'Electronics',
      seller: 'TechStore',
      rating: 4.5,
      inStock: true
    },
    {
      id: '2',
      title: 'Vintage Camera',
      description: 'Classic film camera in excellent condition',
      price: '$450',
      category: 'Electronics',
      seller: 'RetroShop',
      rating: 5,
      inStock: true
    },
    {
      id: '3',
      title: 'Designer Bag',
      description: 'Authentic leather handbag with modern design',
      price: '$180',
      category: 'Fashion',
      seller: 'LuxuryGoods',
      rating: 4.8,
      inStock: false
    },
    {
      id: '4',
      title: 'Smart Watch',
      description: 'Latest model with health tracking features',
      price: '$399',
      category: 'Electronics',
      seller: 'TechStore',
      rating: 4.2,
      inStock: true
    },
    {
      id: '5',
      title: 'Indoor Plant Set',
      description: 'Collection of 5 easy-care indoor plants',
      price: '$75',
      category: 'Home & Garden',
      seller: 'GreenThumb',
      rating: 4.7,
      inStock: true
    },
    {
      id: '6',
      title: 'Yoga Mat',
      description: 'Premium non-slip yoga mat with carrying strap',
      price: '$45',
      category: 'Sports',
      seller: 'FitGear',
      rating: 4.6,
      inStock: true
    }
  ],
  filters = {
    showSearch: true,
    showCategories: true,
    showPriceRange: true,
    showSort: true
  }
}) => {
  return (
    <Page navigation={navigation}>
      {/* Hero Section */}
      <PageSection spacing="lg" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Container>
          <div style={{ textAlign: 'center', color: 'white', padding: '2rem 0' }}>
            <Heading size="3xl" style={{ color: 'white', marginBottom: '1rem' }}>
              {hero.title}
            </Heading>
            {hero.subtitle && (
              <Text size="lg" style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '2rem' }}>
                {hero.subtitle}
              </Text>
            )}
            {filters?.showSearch && (
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <Input 
                  placeholder={hero.searchPlaceholder}
                  inputSize="lg"
                  style={{ width: '100%' }}
                />
              </div>
            )}
          </div>
        </Container>
      </PageSection>

      {/* Filters Section */}
      <PageSection spacing="md" style={{ borderBottom: '1px solid #e5e7eb' }}>
        <Container>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {filters?.showCategories && (
              <SimpleSelect 
                placeholder="All Categories"
                options={categories.map(cat => ({
                  value: cat.value,
                  label: `${cat.label} (${cat.count})`
                }))}
              />
            )}
            {filters?.showPriceRange && (
              <>
                <Input placeholder="Min Price" style={{ width: '120px' }} />
                <Input placeholder="Max Price" style={{ width: '120px' }} />
              </>
            )}
            {filters?.showSort && (
              <SimpleSelect 
                style={{ marginLeft: 'auto' }}
                options={[
                  { value: 'featured', label: 'Sort by: Featured' },
                  { value: 'price-asc', label: 'Price: Low to High' },
                  { value: 'price-desc', label: 'Price: High to Low' },
                  { value: 'newest', label: 'Newest First' },
                  { value: 'rating', label: 'Best Rated' }
                ]}
              />
            )}
          </div>
        </Container>
      </PageSection>

      {/* Products Grid */}
      <PageSection spacing="xl">
        <Container>
          <Grid cols={3} style={{ gap: '2rem' }}>
            {items.map((item) => (
              <Card key={item.id} className="qwanyx-card--hover">
                {item.image && <CardImage src={item.image} alt={item.title} />}
                {!item.image && (
                  <div style={{ 
                    height: '200px', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem'
                  }}>
                    📦
                  </div>
                )}
                <CardHeader>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <CardTitle>{item.title}</CardTitle>
                      <Text size="2xl" weight="bold" style={{ marginTop: '0.5rem' }}>
                        {item.price}
                      </Text>
                    </div>
                    {item.inStock !== undefined && (
                      <Badge color={item.inStock ? 'success' : 'error'} variant="subtle">
                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <Text size="sm" style={{ color: '#6b7280' }}>
                      {item.category} • {item.seller}
                    </Text>
                    {item.rating && (
                      <Text size="sm">
                        ⭐ {item.rating}
                      </Text>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button fullWidth variant="outline">View Details</Button>
                    <Button fullWidth disabled={!item.inStock}>Add to Cart</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </Grid>

          {/* Load More */}
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Button size="lg" variant="outline">
              Load More Items
            </Button>
          </div>
        </Container>
      </PageSection>
    </Page>
  )
}