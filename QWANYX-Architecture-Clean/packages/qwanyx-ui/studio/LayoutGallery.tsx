import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  Center
} from '../src';

// Import all layout demos
import { 
  GridLayoutDemo,
  FlexLayoutDemo,
  StackLayoutDemo,
  MasonryLayoutDemo,
  HolyGrailLayoutDemo,
  MagazineLayoutDemo,
  SplitLayoutDemo,
  BentoLayoutDemo,
  AsymmetricLayoutDemo
} from './LayoutDemos';

interface LayoutInfo {
  id: string;
  title: string;
  description: string;
  features: string[];
  variant: 'elevated' | 'glass' | 'gradient' | 'neon' | 'filled' | 'outlined';
  gradientFrom?: string;
  gradientTo?: string;
  component: React.ComponentType<{ onClose: () => void }>;
}

const layouts: LayoutInfo[] = [
  {
    id: 'grid',
    title: '12-Column Grid',
    description: 'Classical 12-column grid system with golden ratio spacing. The foundation of modern web design.',
    features: ['Responsive breakpoints', 'Column spanning', 'Auto-fit mode', 'Golden ratio gaps'],
    variant: 'gradient',
    gradientFrom: '#667eea',
    gradientTo: '#764ba2',
    component: GridLayoutDemo
  },
  {
    id: 'flex',
    title: 'Flexbox Layout',
    description: 'Flexible box layout for dynamic content arrangement with powerful alignment options.',
    features: ['Direction control', 'Justify & align', 'Grow/shrink/basis', 'Spacer component'],
    variant: 'glass',
    component: FlexLayoutDemo
  },
  {
    id: 'stack',
    title: 'Stack Layout',
    description: 'Vertical and horizontal stacking with consistent spacing and optional dividers.',
    features: ['VStack & HStack', 'Dividers', 'Center component', 'Reverse stacking'],
    variant: 'neon',
    gradientFrom: '#00d2ff',
    component: StackLayoutDemo
  },
  {
    id: 'masonry',
    title: 'Masonry Grid',
    description: 'Pinterest-style responsive grid that optimally arranges content of varying heights.',
    features: ['Auto columns', 'Height calculation', 'Responsive', 'Smooth animations'],
    variant: 'gradient',
    gradientFrom: '#f093fb',
    gradientTo: '#f5576c',
    component: MasonryLayoutDemo
  },
  {
    id: 'holygrail',
    title: 'Holy Grail Layout',
    description: 'Classic 3-column layout with header and footer. Perfect for dashboards and apps.',
    features: ['Sticky elements', 'Flexible sidebar', 'Fixed header/footer', 'Responsive'],
    variant: 'elevated',
    component: HolyGrailLayoutDemo
  },
  {
    id: 'magazine',
    title: 'Magazine Layout',
    description: 'Editorial-style asymmetric grid for content-heavy sites and blogs.',
    features: ['Hero section', 'Featured grid', 'Sidebar support', 'Content hierarchy'],
    variant: 'gradient',
    gradientFrom: '#fa709a',
    gradientTo: '#fee140',
    component: MagazineLayoutDemo
  },
  {
    id: 'split',
    title: 'Split Layout',
    description: 'Two-column layouts with various ratios including the golden ratio.',
    features: ['Multiple ratios', 'Golden ratio', 'Stack on mobile', 'Reverse option'],
    variant: 'glass',
    component: SplitLayoutDemo
  },
  {
    id: 'bento',
    title: 'Bento Layout',
    description: 'Japanese-inspired asymmetric grid creating visually interesting compositions.',
    features: ['Asymmetric boxes', 'Auto patterns', 'Visual hierarchy', 'Modern aesthetic'],
    variant: 'neon',
    gradientFrom: '#4facfe',
    component: BentoLayoutDemo
  },
  {
    id: 'asymmetric',
    title: 'Asymmetric Layout',
    description: 'Creative irregular grids for dynamic, artistic designs.',
    features: ['Editorial variant', 'Artistic variant', 'Dynamic patterns', 'Creative freedom'],
    variant: 'gradient',
    gradientFrom: '#43e97b',
    gradientTo: '#38f9d7',
    component: AsymmetricLayoutDemo
  }
];

export const LayoutGallery: React.FC = () => {
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null);

  const handlePreview = (layoutId: string) => {
    setSelectedLayout(layoutId);
  };

  const handleClose = () => {
    setSelectedLayout(null);
  };

  // Find the selected layout
  const activeLayout = layouts.find(l => l.id === selectedLayout);

  // If a layout is selected, show its full-page demo
  if (activeLayout) {
    const LayoutComponent = activeLayout.component;
    return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: 1000,
            backgroundColor: 'rgba(var(--background), 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgb(var(--border))',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '20px' }}>×</span>
          Close Preview
        </Button>

        {/* Layout title bar */}
        <div style={{
          position: 'sticky',
          top: '64px',
          backgroundColor: 'rgb(var(--surface))',
          borderBottom: '1px solid rgb(var(--border))',
          padding: '16px',
          zIndex: 100
        }}>
          <Container maxWidth="1400px">
            <HStack justify="between" align="center">
              <VStack spacing="xs">
                <Text as="h2" size="2xl" weight="bold">
                  {activeLayout.title}
                </Text>
                <Text size="sm" color="muted">
                  {activeLayout.description}
                </Text>
              </VStack>
              <HStack spacing="sm">
                {activeLayout.features.map((feature, index) => (
                  <Badge key={index} variant="info" size="sm">
                    {feature}
                  </Badge>
                ))}
              </HStack>
            </HStack>
          </Container>
        </div>

        {/* Full layout demo */}
        <LayoutComponent onClose={handleClose} />
      </div>
    );
  }

  // Gallery view - show all layout cards
  return (
    <Container maxWidth="1400px" padding="xl">
      <VStack spacing="xl">
        {/* Header */}
        <Center>
          <VStack spacing="md" align="center">
            <Text as="h1" size="4xl" weight="bold">
              Layout Gallery
            </Text>
            <Text size="lg" color="muted" align="center">
              Explore classical design layouts based on golden ratio and proven design principles
            </Text>
          </VStack>
        </Center>

        {/* Layout cards grid */}
        <Grid columns={3} gap="lg" minChildWidth="320px">
          {layouts.map((layout) => (
            <Card
              key={layout.id}
              variant={layout.variant}
              hoverable
              animation="lift"
              gradientFrom={layout.gradientFrom}
              gradientTo={layout.gradientTo}
              style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardHeader bordered>
                <CardTitle size="xl">{layout.title}</CardTitle>
                <CardDescription>{layout.description}</CardDescription>
              </CardHeader>
              
              <CardContent style={{ flex: 1 }}>
                <VStack spacing="sm">
                  {layout.features.map((feature, index) => (
                    <HStack key={index} spacing="sm" align="center">
                      <Text 
                        style={{ 
                          color: layout.variant === 'gradient' || layout.variant === 'neon' 
                            ? 'rgba(255,255,255,0.9)' 
                            : 'rgb(var(--accent))',
                          fontSize: '16px'
                        }}
                      >
                        ✓
                      </Text>
                      <Text 
                        size="sm"
                        style={{
                          color: layout.variant === 'gradient' || layout.variant === 'neon'
                            ? 'rgba(255,255,255,0.85)'
                            : undefined
                        }}
                      >
                        {feature}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </CardContent>

              <CardFooter justify="between">
                <Badge 
                  variant={layout.variant === 'gradient' || layout.variant === 'neon' ? 'default' : 'success'}
                  style={{
                    backgroundColor: layout.variant === 'gradient' || layout.variant === 'neon'
                      ? 'rgba(255,255,255,0.2)'
                      : undefined,
                    color: layout.variant === 'gradient' || layout.variant === 'neon'
                      ? 'white'
                      : undefined
                  }}
                >
                  Layout System
                </Badge>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => handlePreview(layout.id)}
                  style={{
                    backgroundColor: layout.variant === 'gradient' || layout.variant === 'neon'
                      ? 'rgba(255,255,255,0.2)'
                      : undefined,
                    color: layout.variant === 'gradient' || layout.variant === 'neon'
                      ? 'white'
                      : undefined,
                    border: layout.variant === 'gradient' || layout.variant === 'neon'
                      ? '1px solid rgba(255,255,255,0.3)'
                      : undefined
                  }}
                >
                  Preview →
                </Button>
              </CardFooter>
            </Card>
          ))}
        </Grid>

        {/* Footer info */}
        <Center style={{ marginTop: '40px' }}>
          <VStack spacing="sm" align="center">
            <Text size="sm" color="muted">
              All layouts follow the golden ratio (1.618) for optimal visual harmony
            </Text>
            <HStack spacing="md">
              <Badge variant="default">Responsive</Badge>
              <Badge variant="default">Accessible</Badge>
              <Badge variant="default">Performance Optimized</Badge>
            </HStack>
          </VStack>
        </Center>
      </VStack>
    </Container>
  );
};