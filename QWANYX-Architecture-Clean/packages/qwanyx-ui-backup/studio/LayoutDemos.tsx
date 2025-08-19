import React from 'react';
import {
  Container,
  Grid,
  GridItem,
  Flex,
  FlexItem,
  Spacer,
  Stack,
  VStack,
  HStack,
  Center,
  Masonry,
  HolyGrailLayout,
  MagazineLayout,
  SplitLayout,
  BentoLayout,
  AsymmetricLayout,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardImage,
  Button,
  Badge,
  Text
} from '../src';

// Helper function to generate sample cards
const generateCard = (index: number, variant?: any, title?: string) => (
  <Card 
    variant={variant || (index % 2 === 0 ? 'elevated' : 'outlined')}
    hoverable
    animation={index % 3 === 0 ? 'lift' : index % 3 === 1 ? 'glow' : 'morph'}
  >
    <CardHeader bordered>
      <CardTitle>{title || `Card ${index + 1}`}</CardTitle>
      <CardDescription>
        Demonstrating layout capabilities
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Text size="sm">
        This card showcases how content arranges within the layout system using golden ratio spacing.
      </Text>
    </CardContent>
    <CardFooter justify="between">
      <Badge variant="info">Item {index + 1}</Badge>
      <Button size="sm" variant="ghost">Details</Button>
    </CardFooter>
  </Card>
);

const generateImageCard = (index: number, height?: string) => (
  <Card variant="glass" hoverable animation="lift">
    <CardImage 
      src={`https://picsum.photos/400/${height || '300'}?random=${index}`}
      aspectRatio={index % 2 === 0 ? '16/9' : '4/3'}
      overlay
      overlayGradient="linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)"
    />
    <CardContent>
      <CardTitle>Visual {index + 1}</CardTitle>
      <CardDescription>
        Beautiful imagery with gradient overlays
      </CardDescription>
    </CardContent>
  </Card>
);

// Grid Layout Demo
export const GridLayoutDemo: React.FC<{ onClose: () => void }> = () => {
  return (
    <Container  padding="xl">
      <VStack spacing="2xl">
        {/* 12-column demonstration */}
        <section>
          <Text as="h3" size="xl" weight="semibold" style={{ marginBottom: '21px' }}>
            12-Column Grid System
          </Text>
          <Grid cols={12} gap="md">
            <GridItem span={12}>
              {generateCard(0, 'gradient', 'Full Width (12 columns)')}
            </GridItem>
            <GridItem span={6}>
              {generateCard(1, 'glass', 'Half Width (6 columns)')}
            </GridItem>
            <GridItem span={6}>
              {generateCard(2, 'glass', 'Half Width (6 columns)')}
            </GridItem>
            <GridItem span={4}>
              {generateCard(3, 'elevated', 'One Third (4 columns)')}
            </GridItem>
            <GridItem span={4}>
              {generateCard(4, 'elevated', 'One Third (4 columns)')}
            </GridItem>
            <GridItem span={4}>
              {generateCard(5, 'elevated', 'One Third (4 columns)')}
            </GridItem>
            <GridItem span={3}>
              {generateCard(6, 'outlined', 'Quarter (3 columns)')}
            </GridItem>
            <GridItem span={3}>
              {generateCard(7, 'outlined', 'Quarter (3 columns)')}
            </GridItem>
            <GridItem span={3}>
              {generateCard(8, 'outlined', 'Quarter (3 columns)')}
            </GridItem>
            <GridItem span={3}>
              {generateCard(9, 'outlined', 'Quarter (3 columns)')}
            </GridItem>
            <GridItem span={8}>
              {generateCard(10, 'neon', 'Two Thirds (8 columns)')}
            </GridItem>
            <GridItem span={4}>
              {generateCard(11, 'filled', 'One Third (4 columns)')}
            </GridItem>
          </Grid>
        </section>

        {/* Auto-fit responsive grid */}
        <section>
          <Text as="h3" size="xl" weight="semibold" style={{ marginBottom: '21px' }}>
            Auto-Fit Responsive Grid
          </Text>
          <Grid cols="auto" gap="lg" minChildWidth="300px">
            {Array.from({ length: 9 }).map((_, i) => generateCard(i))}
          </Grid>
        </section>

        {/* Different gap sizes */}
        <section>
          <Text as="h3" size="xl" weight="semibold" style={{ marginBottom: '21px' }}>
            Golden Ratio Gap Sizes
          </Text>
          <VStack spacing="lg">
            <div>
              <Text size="sm" color="muted" style={{ marginBottom: '8px' }}>Gap: xs (8px)</Text>
              <Grid cols={4} gap="xs">
                {Array.from({ length: 4 }).map((_, i) => generateCard(i, 'outlined'))}
              </Grid>
            </div>
            <div>
              <Text size="sm" color="muted" style={{ marginBottom: '8px' }}>Gap: md (21px)</Text>
              <Grid cols={4} gap="md">
                {Array.from({ length: 4 }).map((_, i) => generateCard(i, 'glass'))}
              </Grid>
            </div>
            <div>
              <Text size="sm" color="muted" style={{ marginBottom: '8px' }}>Gap: xl (55px)</Text>
              <Grid cols={4} gap="xl">
                {Array.from({ length: 4 }).map((_, i) => generateCard(i, 'gradient'))}
              </Grid>
            </div>
          </VStack>
        </section>
      </VStack>
    </Container>
  );
};

// Flexbox Layout Demo
export const FlexLayoutDemo: React.FC<{ onClose: () => void }> = () => {
  return (
    <Container  padding="xl">
      <VStack spacing="2xl">
        {/* Justify options */}
        <section>
          <Text as="h3" size="xl" weight="semibold" style={{ marginBottom: '21px' }}>
            Flex Justify Options
          </Text>
          <VStack spacing="lg">
            <div>
              <Text size="sm" color="muted" style={{ marginBottom: '8px' }}>justify="start"</Text>
              <Flex justify="start" gap="md" style={{ backgroundColor: 'rgba(var(--accent), 0.05)', padding: '20px' }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <FlexItem key={i} basis="200px">{generateCard(i)}</FlexItem>
                ))}
              </Flex>
            </div>
            <div>
              <Text size="sm" color="muted" style={{ marginBottom: '8px' }}>justify="center"</Text>
              <Flex justify="center" gap="md" style={{ backgroundColor: 'rgba(var(--accent), 0.05)', padding: '20px' }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <FlexItem key={i} basis="200px">{generateCard(i, 'glass')}</FlexItem>
                ))}
              </Flex>
            </div>
            <div>
              <Text size="sm" color="muted" style={{ marginBottom: '8px' }}>justify="end"</Text>
              <Flex justify="end" gap="md" style={{ backgroundColor: 'rgba(var(--accent), 0.05)', padding: '20px' }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <FlexItem key={i} basis="200px">{generateCard(i, 'gradient')}</FlexItem>
                ))}
              </Flex>
            </div>
            <div>
              <Text size="sm" color="muted" style={{ marginBottom: '8px' }}>justify="between"</Text>
              <Flex justify="between" gap="md" style={{ backgroundColor: 'rgba(var(--accent), 0.05)', padding: '20px' }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <FlexItem key={i} basis="200px">{generateCard(i, 'neon')}</FlexItem>
                ))}
              </Flex>
            </div>
          </VStack>
        </section>

        {/* Flex with Spacer */}
        <section>
          <Text as="h3" size="xl" weight="semibold" style={{ marginBottom: '21px' }}>
            Flex with Spacer
          </Text>
          <Flex gap="md" style={{ backgroundColor: 'rgba(var(--primary), 0.05)', padding: '20px' }}>
            {generateCard(0)}
            <Spacer />
            {generateCard(1)}
            {generateCard(2)}
          </Flex>
        </section>

        {/* Flex grow */}
        <section>
          <Text as="h3" size="xl" weight="semibold" style={{ marginBottom: '21px' }}>
            Flex Grow Properties
          </Text>
          <Flex gap="md">
            <FlexItem grow={1}>
              <Card variant="outlined">
                <CardContent>
                  <Text size="sm" weight="semibold">Grow: 1</Text>
                  <Text size="xs" color="muted">Takes 1 unit of space</Text>
                </CardContent>
              </Card>
            </FlexItem>
            <FlexItem grow={2}>
              <Card variant="gradient" gradientFrom="#667eea" gradientTo="#764ba2">
                <CardContent>
                  <Text size="sm" weight="semibold" style={{ color: 'white' }}>Grow: 2</Text>
                  <Text size="xs" style={{ color: 'rgba(255,255,255,0.8)' }}>Takes 2 units of space</Text>
                </CardContent>
              </Card>
            </FlexItem>
            <FlexItem grow={1}>
              <Card variant="outlined">
                <CardContent>
                  <Text size="sm" weight="semibold">Grow: 1</Text>
                  <Text size="xs" color="muted">Takes 1 unit of space</Text>
                </CardContent>
              </Card>
            </FlexItem>
          </Flex>
        </section>
      </VStack>
    </Container>
  );
};

// Stack Layout Demo
export const StackLayoutDemo: React.FC<{ onClose: () => void }> = () => {
  return (
    <Container  padding="xl">
      <VStack spacing="2xl">
        {/* VStack with dividers */}
        <section>
          <Text as="h3" size="xl" weight="semibold" style={{ marginBottom: '21px' }}>
            Vertical Stack with Dividers
          </Text>
          <VStack spacing="lg" divider>
            {Array.from({ length: 4 }).map((_, i) => generateCard(i, 'outlined'))}
          </VStack>
        </section>

        {/* HStack variations */}
        <section>
          <Text as="h3" size="xl" weight="semibold" style={{ marginBottom: '21px' }}>
            Horizontal Stack Variations
          </Text>
          <VStack spacing="lg">
            <div>
              <Text size="sm" color="muted" style={{ marginBottom: '8px' }}>align="start"</Text>
              <HStack spacing="md" align="start">
                <Card variant="elevated" style={{ height: '150px' }}>
                  <CardContent><Text>Short</Text></CardContent>
                </Card>
                <Card variant="glass" style={{ height: '200px' }}>
                  <CardContent><Text>Medium</Text></CardContent>
                </Card>
                <Card variant="gradient" style={{ height: '250px' }}>
                  <CardContent><Text style={{ color: 'white' }}>Tall</Text></CardContent>
                </Card>
              </HStack>
            </div>
            <div>
              <Text size="sm" color="muted" style={{ marginBottom: '8px' }}>align="center"</Text>
              <HStack spacing="md" align="center">
                <Card variant="elevated" style={{ height: '150px' }}>
                  <CardContent><Text>Short</Text></CardContent>
                </Card>
                <Card variant="glass" style={{ height: '200px' }}>
                  <CardContent><Text>Medium</Text></CardContent>
                </Card>
                <Card variant="gradient" style={{ height: '250px' }}>
                  <CardContent><Text style={{ color: 'white' }}>Tall</Text></CardContent>
                </Card>
              </HStack>
            </div>
            <div>
              <Text size="sm" color="muted" style={{ marginBottom: '8px' }}>With dividers</Text>
              <HStack spacing="xl" divider>
                {Array.from({ length: 4 }).map((_, i) => generateCard(i, 'neon'))}
              </HStack>
            </div>
          </VStack>
        </section>

        {/* Center component */}
        <section>
          <Text as="h3" size="xl" weight="semibold" style={{ marginBottom: '21px' }}>
            Center Component
          </Text>
          <Center 
            minHeight="300px" 
            style={{ 
              backgroundColor: 'rgba(var(--accent), 0.05)',
              border: '2px dashed rgb(var(--border))'
            }}
          >
            <Card variant="gradient" gradientFrom="#f093fb" gradientTo="#f5576c">
              <CardContent>
                <Center>
                  <VStack spacing="sm" align="center">
                    <Text size="xl" weight="bold" style={{ color: 'white' }}>
                      Perfectly Centered
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                      Both horizontally and vertically
                    </Text>
                  </VStack>
                </Center>
              </CardContent>
            </Card>
          </Center>
        </section>
      </VStack>
    </Container>
  );
};

// Masonry Layout Demo
export const MasonryLayoutDemo: React.FC<{ onClose: () => void }> = () => {
  const heights = [200, 300, 250, 400, 350, 280, 320, 260, 380, 300, 340, 290];
  
  return (
    <Container  padding="xl">
      <VStack spacing="2xl">
        <section>
          <Text as="h3" size="xl" weight="semibold" style={{ marginBottom: '21px' }}>
            Pinterest-Style Masonry Grid
          </Text>
          <Masonry cols="auto" gap="lg">
            {heights.map((height, i) => (
              <Card 
                key={i} 
                variant={i % 3 === 0 ? 'glass' : i % 3 === 1 ? 'gradient' : 'elevated'} 
                hoverable
                style={{ width: '100%' }}
              >
                <div style={{ 
                  width: '100%',
                  height: `${height}px`,
                  overflow: 'hidden',
                  backgroundColor: 'rgb(var(--surface))'
                }}>
                  <img
                    src={`https://picsum.photos/400/${height}?random=${i}`}
                    alt={`Item ${i + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <CardContent>
                  <CardTitle>Item {i + 1}</CardTitle>
                  <CardDescription>Height: {height}px</CardDescription>
                </CardContent>
              </Card>
            ))}
          </Masonry>
        </section>
      </VStack>
    </Container>
  );
};

// Holy Grail Layout Demo
export const HolyGrailLayoutDemo: React.FC<{ onClose: () => void }> = () => {
  return (
    <div style={{ minHeight: 'calc(100vh - 200px)' }}>
      <HolyGrailLayout
        header={
          <Center style={{ padding: '30px', backgroundColor: 'rgb(var(--surface))' }}>
            <VStack spacing="sm" align="center">
              <Text size="2xl" weight="bold">Header Section</Text>
              <Text color="muted">Classic header with navigation and branding</Text>
            </VStack>
          </Center>
        }
        sidebar={
          <VStack spacing="md" style={{ padding: '20px' }}>
            <Text weight="bold" size="lg">Sidebar</Text>
            <Text size="sm" color="muted">Navigation and filters</Text>
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} variant="outlined">
                <CardContent>
                  <Text size="sm">Menu Item {i + 1}</Text>
                </CardContent>
              </Card>
            ))}
          </VStack>
        }
        aside={
          <VStack spacing="md" style={{ padding: '20px' }}>
            <Text weight="bold" size="lg">Aside</Text>
            <Text size="sm" color="muted">Related content</Text>
            {Array.from({ length: 2 }).map((_, i) => generateCard(i, 'glass'))}
          </VStack>
        }
        footer={
          <Center style={{ padding: '30px', backgroundColor: 'rgb(var(--surface))' }}>
            <VStack spacing="sm" align="center">
              <Text weight="semibold">Footer Content</Text>
              <Text size="sm" color="muted">© 2024 QWANYX. All rights reserved.</Text>
            </VStack>
          </Center>
        }
        gap="lg"
        stickyHeader
        stickySidebar
      >
        <VStack spacing="lg" style={{ padding: '20px' }}>
          <Text as="h2" size="2xl" weight="bold">Main Content Area</Text>
          <Text color="muted">
            The Holy Grail layout is perfect for dashboards, admin panels, and content-heavy applications.
          </Text>
          <Grid cols={2} gap="md">
            {Array.from({ length: 6 }).map((_, i) => generateCard(i))}
          </Grid>
        </VStack>
      </HolyGrailLayout>
    </div>
  );
};

// Magazine Layout Demo
export const MagazineLayoutDemo: React.FC<{ onClose: () => void }> = () => {
  return (
    <Container  padding="xl">
      <MagazineLayout
        hero={
          <Card variant="gradient" gradientFrom="#667eea" gradientTo="#764ba2">
            <CardContent>
              <Center minHeight="400px">
                <VStack align="center" spacing="md">
                  <Text as="h1" size="4xl" weight="bold" style={{ color: 'white' }}>
                    Featured Story
                  </Text>
                  <Text size="xl" style={{ color: 'rgba(255,255,255,0.9)', textAlign: 'center', maxWidth: '600px' }}>
                    The hero section grabs attention with the most important content of your magazine or blog
                  </Text>
                  <Button variant="primary" size="lg" style={{ marginTop: '20px' }}>
                    Read More
                  </Button>
                </VStack>
              </Center>
            </CardContent>
          </Card>
        }
        featured={[
          generateImageCard(0, '300'),
          generateImageCard(1, '300'),
          generateImageCard(2, '300')
        ]}
        sidebar={
          <VStack spacing="lg">
            <Card variant="glass" blur>
              <CardHeader bordered>
                <CardTitle>Trending Now</CardTitle>
              </CardHeader>
              <CardContent>
                <VStack spacing="sm">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <HStack key={i} spacing="sm">
                      <Text size="lg" weight="bold" color="muted">{i + 1}</Text>
                      <Text size="sm">Trending article title here</Text>
                    </HStack>
                  ))}
                </VStack>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardHeader bordered>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <VStack spacing="xs">
                  {['Technology', 'Design', 'Business', 'Lifestyle', 'Travel'].map((cat) => (
                    <Badge key={cat} variant="default" size="sm" style={{ width: 'fit-content' }}>
                      {cat}
                    </Badge>
                  ))}
                </VStack>
              </CardContent>
            </Card>
          </VStack>
        }
        gap="xl"
      >
        <VStack spacing="xl">
          <Text as="h2" size="2xl" weight="bold">Latest Articles</Text>
          <Grid cols={2} gap="lg">
            {Array.from({ length: 6 }).map((_, i) => generateCard(i))}
          </Grid>
        </VStack>
      </MagazineLayout>
    </Container>
  );
};

// Split Layout Demo
export const SplitLayoutDemo: React.FC<{ onClose: () => void }> = () => {
  return (
    <Container  padding="xl">
      <VStack spacing="2xl">
        <section>
          <Text as="h3" size="xl" weight="semibold" style={{ marginBottom: '21px' }}>
            50-50 Split
          </Text>
          <SplitLayout
            ratio="50-50"
            gap="lg"
            left={
              <Card variant="glass" blur style={{ height: '100%' }}>
                <CardContent>
                  <VStack spacing="md">
                    <Text size="xl" weight="bold">Left Side</Text>
                    <Text>Equal width columns perfect for comparing content or showing related information side by side.</Text>
                  </VStack>
                </CardContent>
              </Card>
            }
            right={
              <Card variant="gradient" gradientFrom="#f093fb" gradientTo="#f5576c" style={{ height: '100%' }}>
                <CardContent>
                  <VStack spacing="md">
                    <Text size="xl" weight="bold" style={{ color: 'white' }}>Right Side</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.9)' }}>Both sides get exactly 50% of the available space.</Text>
                  </VStack>
                </CardContent>
              </Card>
            }
          />
        </section>

        <section>
          <Text as="h3" size="xl" weight="semibold" style={{ marginBottom: '21px' }}>
            Golden Ratio Split (1.618:1)
          </Text>
          <SplitLayout
            ratio="golden"
            gap="lg"
            left={
              <Card variant="elevated" style={{ height: '100%' }}>
                <CardImage src="https://picsum.photos/800/400?random=split" aspectRatio="16/9" />
                <CardContent>
                  <CardTitle size="xl">Golden Ratio Content</CardTitle>
                  <Text>The golden ratio creates naturally pleasing proportions that have been used in art and design for centuries.</Text>
                </CardContent>
              </Card>
            }
            right={
              <VStack spacing="md">
                <Card variant="outlined">
                  <CardContent>
                    <Text weight="semibold">Supporting Info</Text>
                    <Text size="sm" color="muted">Sidebar content in golden ratio proportion</Text>
                  </CardContent>
                </Card>
                <Card variant="filled">
                  <CardContent>
                    <Badge variant="success">1.618 : 1</Badge>
                    <Text size="sm" style={{ marginTop: '8px' }}>The mathematical beauty of nature</Text>
                  </CardContent>
                </Card>
              </VStack>
            }
          />
        </section>

        <section>
          <Text as="h3" size="xl" weight="semibold" style={{ marginBottom: '21px' }}>
            70-30 Split
          </Text>
          <SplitLayout
            ratio="70-30"
            gap="lg"
            left={
              <Card variant="filled">
                <CardHeader bordered>
                  <CardTitle size="xl">Main Content Area</CardTitle>
                  <CardDescription>Takes up 70% of the width</CardDescription>
                </CardHeader>
                <CardContent>
                  <Text>
                    This layout is perfect for blog posts, articles, or any content where you want the main content 
                    to be prominent while still having a sidebar for additional information, navigation, or ads.
                  </Text>
                </CardContent>
              </Card>
            }
            right={
              <Card variant="neon" glowColor="rgb(var(--primary))">
                <CardContent>
                  <VStack spacing="sm">
                    <Text weight="semibold">Sidebar</Text>
                    <Text size="sm">30% width</Text>
                    <Badge variant="info">Compact</Badge>
                  </VStack>
                </CardContent>
              </Card>
            }
          />
        </section>
      </VStack>
    </Container>
  );
};

// Bento Layout Demo
export const BentoLayoutDemo: React.FC<{ onClose: () => void }> = () => {
  const items = [
    { title: 'Large Feature', variant: 'gradient', gradientFrom: '#667eea', gradientTo: '#764ba2' },
    { title: 'Wide Card', variant: 'glass' },
    { title: 'Medium Item', variant: 'elevated' },
    { title: 'Tall Card', variant: 'neon' },
    { title: 'Standard', variant: 'outlined' },
    { title: 'Extra Wide', variant: 'gradient', gradientFrom: '#f093fb', gradientTo: '#f5576c' },
    { title: 'Compact', variant: 'filled' },
    { title: 'Small Box', variant: 'glass' }
  ];

  return (
    <Container  padding="xl">
      <VStack spacing="xl">
        <Text as="h3" size="xl" weight="semibold">
          Japanese-Inspired Bento Grid
        </Text>
        <Text color="muted">
          Asymmetric boxes create visual interest and hierarchy
        </Text>
        <BentoLayout gap="lg">
          {items.map((item, i) => (
            <Card 
              key={i} 
              variant={item.variant as any}
              gradientFrom={item.gradientFrom}
              gradientTo={item.gradientTo}
              hoverable
              animation="lift"
            >
              <CardContent>
                <Center style={{ height: '100%', minHeight: '100px' }}>
                  <VStack spacing="sm" align="center">
                    <Text 
                      size="lg" 
                      weight="bold"
                      style={{ 
                        color: item.variant === 'gradient' || item.variant === 'neon' 
                          ? 'white' 
                          : undefined 
                      }}
                    >
                      {item.title}
                    </Text>
                    <Badge 
                      variant="default"
                      style={{
                        backgroundColor: item.variant === 'gradient' || item.variant === 'neon'
                          ? 'rgba(255,255,255,0.2)'
                          : undefined,
                        color: item.variant === 'gradient' || item.variant === 'neon'
                          ? 'white'
                          : undefined
                      }}
                    >
                      Box {i + 1}
                    </Badge>
                  </VStack>
                </Center>
              </CardContent>
            </Card>
          ))}
        </BentoLayout>
      </VStack>
    </Container>
  );
};

// Asymmetric Layout Demo
export const AsymmetricLayoutDemo: React.FC<{ onClose: () => void }> = () => {
  return (
    <Container  padding="xl">
      <VStack spacing="2xl">
        <section>
          <Text as="h3" size="xl" weight="semibold" style={{ marginBottom: '21px' }}>
            Editorial Asymmetric
          </Text>
          <AsymmetricLayout variant="editorial" gap="lg">
            {Array.from({ length: 8 }).map((_, i) => {
              if (i === 0) {
                return (
                  <Card key={i} variant="gradient" gradientFrom="#667eea" gradientTo="#764ba2" hoverable>
                    <CardContent>
                      <Center minHeight="200px">
                        <VStack align="center">
                          <Text size="2xl" weight="bold" style={{ color: 'white' }}>
                            Featured Content
                          </Text>
                          <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                            Large asymmetric block
                          </Text>
                        </VStack>
                      </Center>
                    </CardContent>
                  </Card>
                );
              }
              return i % 3 === 0 ? generateImageCard(i) : generateCard(i);
            })}
          </AsymmetricLayout>
        </section>

        <section>
          <Text as="h3" size="xl" weight="semibold" style={{ marginBottom: '21px' }}>
            Artistic Asymmetric
          </Text>
          <AsymmetricLayout variant="artistic" gap="xl">
            {Array.from({ length: 6 }).map((_, i) => {
              const variants = ['glass', 'gradient', 'neon', 'elevated', 'outlined', 'filled'];
              return (
                <Card key={i} variant={variants[i] as any} hoverable animation="morph">
                  <CardContent>
                    <Center minHeight="150px">
                      <VStack align="center" spacing="sm">
                        <Text size="lg" weight="bold">
                          Art Block {i + 1}
                        </Text>
                        <Badge variant="default">Creative</Badge>
                      </VStack>
                    </Center>
                  </CardContent>
                </Card>
              );
            })}
          </AsymmetricLayout>
        </section>

        <section>
          <Text as="h3" size="xl" weight="semibold" style={{ marginBottom: '21px' }}>
            Dynamic Asymmetric
          </Text>
          <AsymmetricLayout variant="dynamic" gap="md">
            {Array.from({ length: 6 }).map((_, i) => generateCard(i, 'elevated'))}
          </AsymmetricLayout>
        </section>
      </VStack>
    </Container>
  );
};