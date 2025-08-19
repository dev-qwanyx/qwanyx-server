import React from 'react';
import {
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
  Container,
  Text
} from '../src';

// Sample card data
const generateCard = (index: number, variant?: any) => (
  <Card 
    key={index} 
    variant={variant || (index % 2 === 0 ? 'elevated' : 'outlined')}
    hoverable
    animation={index % 3 === 0 ? 'lift' : index % 3 === 1 ? 'glow' : 'morph'}
  >
    <CardHeader bordered>
      <CardTitle>Card {index + 1}</CardTitle>
      <CardDescription>
        A beautiful card demonstrating the layout system
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Text>
        This is card content that showcases how cards work within different layout systems.
        The golden ratio spacing creates visual harmony.
      </Text>
    </CardContent>
    <CardFooter justify="between">
      <Badge variant="info">Layout Demo</Badge>
      <Button size="sm" variant="ghost">View More</Button>
    </CardFooter>
  </Card>
);

const generateImageCard = (index: number, height?: string) => (
  <Card key={index} variant="glass" hoverable animation="lift">
    <CardImage 
      src={`https://picsum.photos/400/${height || '300'}?random=${index}`}
      aspectRatio={index % 2 === 0 ? '16/9' : '4/3'}
      overlay
      overlayGradient="linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)"
    />
    <CardContent>
      <CardTitle size="lg">Visual Card {index + 1}</CardTitle>
      <CardDescription>
        A card with beautiful imagery and gradient overlays
      </CardDescription>
    </CardContent>
  </Card>
);

export const LayoutShowcase: React.FC = () => {
  return (
    <Container maxWidth="1600px" padding="xl">
      <VStack spacing="2xl">
        
        {/* Page 1: Grid System Showcase */}
        <section>
          <VStack spacing="lg">
            <Center>
              <VStack spacing="sm" align="center">
                <Text as="h1" size="4xl" weight="bold">
                  Classical Grid System
                </Text>
                <Text size="lg" color="muted">
                  12-column grid with golden ratio spacing
                </Text>
              </VStack>
            </Center>

            {/* Basic 12-column grid */}
            <div>
              <Text as="h2" size="2xl" weight="semibold" style={{ marginBottom: '21px' }}>
                12-Column Grid
              </Text>
              <Grid cols={12} gap="md">
                <GridItem span={4}>{generateCard(0)}</GridItem>
                <GridItem span={4}>{generateCard(1)}</GridItem>
                <GridItem span={4}>{generateCard(2)}</GridItem>
                <GridItem span={6}>{generateCard(3)}</GridItem>
                <GridItem span={6}>{generateCard(4)}</GridItem>
                <GridItem span={3}>{generateCard(5)}</GridItem>
                <GridItem span={3}>{generateCard(6)}</GridItem>
                <GridItem span={3}>{generateCard(7)}</GridItem>
                <GridItem span={3}>{generateCard(8)}</GridItem>
                <GridItem span="full">{generateCard(9, 'gradient')}</GridItem>
              </Grid>
            </div>

            {/* Auto-fit grid */}
            <div>
              <Text as="h2" size="2xl" weight="semibold" style={{ marginBottom: '21px' }}>
                Auto-Fit Responsive Grid
              </Text>
              <Grid cols="auto" gap="lg" minChildWidth="280px">
                {Array.from({ length: 8 }).map((_, i) => generateCard(i))}
              </Grid>
            </div>

            {/* Different column counts */}
            <div>
              <Text as="h2" size="2xl" weight="semibold" style={{ marginBottom: '21px' }}>
                Various Column Grids
              </Text>
              <VStack spacing="lg">
                <Grid cols={3} gap="md">
                  {Array.from({ length: 3 }).map((_, i) => generateCard(i, 'glass'))}
                </Grid>
                <Grid cols={4} gap="md">
                  {Array.from({ length: 4 }).map((_, i) => generateCard(i, 'neon'))}
                </Grid>
                <Grid cols={5} gap="md">
                  {Array.from({ length: 5 }).map((_, i) => generateCard(i, 'filled'))}
                </Grid>
              </VStack>
            </div>
          </VStack>
        </section>

        <hr style={{ border: '1px solid rgb(var(--border))', width: '100%' }} />

        {/* Page 2: Flexbox Layouts */}
        <section>
          <VStack spacing="lg">
            <Center>
              <VStack spacing="sm" align="center">
                <Text as="h1" size="4xl" weight="bold">
                  Flexbox Layouts
                </Text>
                <Text size="lg" color="muted">
                  Flexible box layouts for dynamic content
                </Text>
              </VStack>
            </Center>

            {/* Flex with different justifications */}
            <div>
              <Text as="h2" size="2xl" weight="semibold" style={{ marginBottom: '21px' }}>
                Flex Justify Options
              </Text>
              <VStack spacing="md">
                <Flex justify="start" gap="md">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <FlexItem key={i} basis="200px">{generateCard(i)}</FlexItem>
                  ))}
                </Flex>
                <Flex justify="center" gap="md">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <FlexItem key={i} basis="200px">{generateCard(i, 'glass')}</FlexItem>
                  ))}
                </Flex>
                <Flex justify="end" gap="md">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <FlexItem key={i} basis="200px">{generateCard(i, 'gradient')}</FlexItem>
                  ))}
                </Flex>
                <Flex justify="between" gap="md">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <FlexItem key={i} basis="200px">{generateCard(i, 'neon')}</FlexItem>
                  ))}
                </Flex>
              </VStack>
            </div>

            {/* Flex with spacer */}
            <div>
              <Text as="h2" size="2xl" weight="semibold" style={{ marginBottom: '21px' }}>
                Flex with Spacer
              </Text>
              <Flex gap="md">
                {generateCard(0)}
                <Spacer />
                {generateCard(1)}
                {generateCard(2)}
              </Flex>
            </div>

            {/* Flex grow/shrink */}
            <div>
              <Text as="h2" size="2xl" weight="semibold" style={{ marginBottom: '21px' }}>
                Flex Grow & Shrink
              </Text>
              <Flex gap="md">
                <FlexItem grow={1}>{generateCard(0)}</FlexItem>
                <FlexItem grow={2}>{generateCard(1, 'gradient')}</FlexItem>
                <FlexItem grow={1}>{generateCard(2)}</FlexItem>
              </Flex>
            </div>
          </VStack>
        </section>

        <hr style={{ border: '1px solid rgb(var(--border))', width: '100%' }} />

        {/* Page 3: Stack Layouts */}
        <section>
          <VStack spacing="lg">
            <Center>
              <VStack spacing="sm" align="center">
                <Text as="h1" size="4xl" weight="bold">
                  Stack Layouts
                </Text>
                <Text size="lg" color="muted">
                  Vertical and horizontal stacking with dividers
                </Text>
              </VStack>
            </Center>

            {/* VStack with dividers */}
            <div>
              <Text as="h2" size="2xl" weight="semibold" style={{ marginBottom: '21px' }}>
                Vertical Stack with Dividers
              </Text>
              <VStack spacing="lg" divider>
                {Array.from({ length: 3 }).map((_, i) => generateCard(i, 'outlined'))}
              </VStack>
            </div>

            {/* HStack examples */}
            <div>
              <Text as="h2" size="2xl" weight="semibold" style={{ marginBottom: '21px' }}>
                Horizontal Stack Variations
              </Text>
              <VStack spacing="lg">
                <HStack spacing="md" align="start">
                  {Array.from({ length: 3 }).map((_, i) => generateCard(i))}
                </HStack>
                <HStack spacing="lg" align="center" justify="center">
                  {Array.from({ length: 3 }).map((_, i) => generateCard(i, 'glass'))}
                </HStack>
                <HStack spacing="xl" divider>
                  {Array.from({ length: 3 }).map((_, i) => generateCard(i, 'gradient'))}
                </HStack>
              </VStack>
            </div>
          </VStack>
        </section>

        <hr style={{ border: '1px solid rgb(var(--border))', width: '100%' }} />

        {/* Page 4: Masonry Layout */}
        <section>
          <VStack spacing="lg">
            <Center>
              <VStack spacing="sm" align="center">
                <Text as="h1" size="4xl" weight="bold">
                  Masonry Layout
                </Text>
                <Text size="lg" color="muted">
                  Pinterest-style responsive grid
                </Text>
              </VStack>
            </Center>

            <div>
              <Text as="h2" size="2xl" weight="semibold" style={{ marginBottom: '21px' }}>
                Dynamic Masonry Grid
              </Text>
              <Masonry cols="auto" gap="lg">
                {Array.from({ length: 15 }).map((_, i) => 
                  generateImageCard(i, `${200 + (i % 4) * 100}`)
                )}
              </Masonry>
            </div>
          </VStack>
        </section>

        <hr style={{ border: '1px solid rgb(var(--border))', width: '100%' }} />

        {/* Page 5: Holy Grail Layout */}
        <section>
          <VStack spacing="lg">
            <Center>
              <VStack spacing="sm" align="center">
                <Text as="h1" size="4xl" weight="bold">
                  Holy Grail Layout
                </Text>
                <Text size="lg" color="muted">
                  Classic 3-column layout with header and footer
                </Text>
              </VStack>
            </Center>

            <div style={{ minHeight: '600px' }}>
              <HolyGrailLayout
                header={
                  <Center style={{ padding: '20px', backgroundColor: 'rgb(var(--surface))' }}>
                    <Text size="xl" weight="bold">Header Area</Text>
                  </Center>
                }
                sidebar={
                  <VStack spacing="md" style={{ padding: '20px' }}>
                    <Text weight="semibold">Sidebar</Text>
                    {generateCard(0)}
                    {generateCard(1)}
                  </VStack>
                }
                aside={
                  <VStack spacing="md" style={{ padding: '20px' }}>
                    <Text weight="semibold">Aside</Text>
                    {generateCard(2, 'glass')}
                    {generateCard(3, 'gradient')}
                  </VStack>
                }
                footer={
                  <Center style={{ padding: '20px', backgroundColor: 'rgb(var(--surface))' }}>
                    <Text size="sm" color="muted">Footer Content</Text>
                  </Center>
                }
                gap="lg"
                stickyHeader
                stickySidebar
              >
                <VStack spacing="lg" style={{ padding: '20px' }}>
                  <Text as="h2" size="2xl" weight="bold">Main Content Area</Text>
                  <Grid cols={2} gap="md">
                    {Array.from({ length: 4 }).map((_, i) => generateCard(i))}
                  </Grid>
                </VStack>
              </HolyGrailLayout>
            </div>
          </VStack>
        </section>

        <hr style={{ border: '1px solid rgb(var(--border))', width: '100%' }} />

        {/* Page 6: Magazine Layout */}
        <section>
          <VStack spacing="lg">
            <Center>
              <VStack spacing="sm" align="center">
                <Text as="h1" size="4xl" weight="bold">
                  Magazine Layout
                </Text>
                <Text size="lg" color="muted">
                  Editorial-style asymmetric grid
                </Text>
              </VStack>
            </Center>

            <MagazineLayout
              hero={
                <Card variant="gradient" gradientFrom="#667eea" gradientTo="#764ba2">
                  <CardContent>
                    <Center minHeight="300px">
                      <VStack align="center" spacing="md">
                        <Text as="h1" size="4xl" weight="bold" style={{ color: 'white' }}>
                          Hero Feature Story
                        </Text>
                        <Text size="lg" style={{ color: 'rgba(255,255,255,0.9)' }}>
                          The most important content goes here
                        </Text>
                      </VStack>
                    </Center>
                  </CardContent>
                </Card>
              }
              featured={[
                generateImageCard(0),
                generateImageCard(1),
                generateImageCard(2)
              ]}
              sidebar={
                <VStack spacing="md">
                  <Text weight="bold">Trending</Text>
                  {Array.from({ length: 3 }).map((_, i) => generateCard(i, 'outlined'))}
                </VStack>
              }
              gap="xl"
            >
              <Grid cols={2} gap="lg">
                {Array.from({ length: 6 }).map((_, i) => generateCard(i))}
              </Grid>
            </MagazineLayout>
          </VStack>
        </section>

        <hr style={{ border: '1px solid rgb(var(--border))', width: '100%' }} />

        {/* Page 7: Split Layouts */}
        <section>
          <VStack spacing="lg">
            <Center>
              <VStack spacing="sm" align="center">
                <Text as="h1" size="4xl" weight="bold">
                  Split Layouts
                </Text>
                <Text size="lg" color="muted">
                  Two-column layouts with various ratios
                </Text>
              </VStack>
            </Center>

            <VStack spacing="xl">
              <div>
                <Text as="h3" size="lg" weight="semibold" style={{ marginBottom: '13px' }}>
                  50-50 Split
                </Text>
                <SplitLayout
                  ratio="50-50"
                  gap="lg"
                  left={generateCard(0, 'glass')}
                  right={generateCard(1, 'gradient')}
                />
              </div>

              <div>
                <Text as="h3" size="lg" weight="semibold" style={{ marginBottom: '13px' }}>
                  Golden Ratio Split
                </Text>
                <SplitLayout
                  ratio="golden"
                  gap="lg"
                  left={generateImageCard(0)}
                  right={
                    <VStack spacing="md">
                      {generateCard(1)}
                      {generateCard(2)}
                    </VStack>
                  }
                />
              </div>

              <div>
                <Text as="h3" size="lg" weight="semibold" style={{ marginBottom: '13px' }}>
                  70-30 Split
                </Text>
                <SplitLayout
                  ratio="70-30"
                  gap="lg"
                  left={
                    <Card variant="filled">
                      <CardContent>
                        <Text as="h2" size="2xl" weight="bold">Main Content</Text>
                        <Text style={{ marginTop: '13px' }}>
                          The primary content takes up 70% of the available space,
                          perfect for article layouts where the main content needs prominence.
                        </Text>
                      </CardContent>
                    </Card>
                  }
                  right={
                    <Card variant="outlined">
                      <CardContent>
                        <Text weight="semibold">Sidebar</Text>
                        <Text size="sm" color="muted" style={{ marginTop: '8px' }}>
                          Supporting content in 30% width
                        </Text>
                      </CardContent>
                    </Card>
                  }
                />
              </div>
            </VStack>
          </VStack>
        </section>

        <hr style={{ border: '1px solid rgb(var(--border))', width: '100%' }} />

        {/* Page 8: Bento Layout */}
        <section>
          <VStack spacing="lg">
            <Center>
              <VStack spacing="sm" align="center">
                <Text as="h1" size="4xl" weight="bold">
                  Bento Layout
                </Text>
                <Text size="lg" color="muted">
                  Japanese-inspired asymmetric grid
                </Text>
              </VStack>
            </Center>

            <BentoLayout gap="lg">
              {Array.from({ length: 8 }).map((_, i) => {
                const variants = ['elevated', 'glass', 'gradient', 'neon', 'filled', 'outlined'];
                return generateCard(i, variants[i % variants.length]);
              })}
            </BentoLayout>
          </VStack>
        </section>

        <hr style={{ border: '1px solid rgb(var(--border))', width: '100%' }} />

        {/* Page 9: Asymmetric Layouts */}
        <section>
          <VStack spacing="lg">
            <Center>
              <VStack spacing="sm" align="center">
                <Text as="h1" size="4xl" weight="bold">
                  Asymmetric Layouts
                </Text>
                <Text size="lg" color="muted">
                  Creative irregular grids for dynamic designs
                </Text>
              </VStack>
            </Center>

            <VStack spacing="2xl">
              <div>
                <Text as="h2" size="2xl" weight="semibold" style={{ marginBottom: '21px' }}>
                  Editorial Asymmetric
                </Text>
                <AsymmetricLayout variant="editorial" gap="lg">
                  {Array.from({ length: 8 }).map((_, i) => 
                    i % 3 === 0 ? generateImageCard(i) : generateCard(i)
                  )}
                </AsymmetricLayout>
              </div>

              <div>
                <Text as="h2" size="2xl" weight="semibold" style={{ marginBottom: '21px' }}>
                  Artistic Asymmetric
                </Text>
                <AsymmetricLayout variant="artistic" gap="xl">
                  {Array.from({ length: 6 }).map((_, i) => {
                    const variants = ['glass', 'gradient', 'neon'];
                    return generateCard(i, variants[i % variants.length]);
                  })}
                </AsymmetricLayout>
              </div>

              <div>
                <Text as="h2" size="2xl" weight="semibold" style={{ marginBottom: '21px' }}>
                  Dynamic Asymmetric
                </Text>
                <AsymmetricLayout variant="dynamic" gap="md">
                  {Array.from({ length: 6 }).map((_, i) => generateCard(i, 'elevated'))}
                </AsymmetricLayout>
              </div>
            </VStack>
          </VStack>
        </section>

        <hr style={{ border: '1px solid rgb(var(--border))', width: '100%' }} />

        {/* Page 10: Complex Nested Layouts */}
        <section>
          <VStack spacing="lg">
            <Center>
              <VStack spacing="sm" align="center">
                <Text as="h1" size="4xl" weight="bold">
                  Complex Nested Layouts
                </Text>
                <Text size="lg" color="muted">
                  Combining multiple layout systems
                </Text>
              </VStack>
            </Center>

            <div>
              <Text as="h2" size="2xl" weight="semibold" style={{ marginBottom: '21px' }}>
                Dashboard-Style Layout
              </Text>
              <Grid cols={12} gap="lg">
                <GridItem span={8}>
                  <VStack spacing="lg">
                    <Card variant="gradient" gradientFrom="#f093fb" gradientTo="#f5576c">
                      <CardContent>
                        <Center minHeight="200px">
                          <Text as="h2" size="3xl" weight="bold" style={{ color: 'white' }}>
                            Main Dashboard Area
                          </Text>
                        </Center>
                      </CardContent>
                    </Card>
                    <Grid cols={2} gap="md">
                      {Array.from({ length: 4 }).map((_, i) => generateCard(i))}
                    </Grid>
                  </VStack>
                </GridItem>
                <GridItem span={4}>
                  <VStack spacing="md">
                    <Card variant="glass" blur>
                      <CardHeader bordered>
                        <CardTitle>Statistics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <VStack spacing="sm">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <Flex key={i} justify="between">
                              <Text size="sm">Metric {i + 1}</Text>
                              <Badge variant={i === 0 ? 'success' : i === 1 ? 'warning' : 'info'}>
                                {Math.floor(Math.random() * 100)}%
                              </Badge>
                            </Flex>
                          ))}
                        </VStack>
                      </CardContent>
                    </Card>
                    {Array.from({ length: 3 }).map((_, i) => generateCard(i, 'outlined'))}
                  </VStack>
                </GridItem>
              </Grid>
            </div>

            <div>
              <Text as="h2" size="2xl" weight="semibold" style={{ marginBottom: '21px' }}>
                Mixed Grid and Flex
              </Text>
              <Grid cols={3} gap="lg">
                <GridItem span={2}>
                  <Flex direction="column" gap="md">
                    {generateImageCard(0)}
                    <HStack spacing="md">
                      {generateCard(1, 'glass')}
                      {generateCard(2, 'glass')}
                    </HStack>
                  </Flex>
                </GridItem>
                <GridItem span={1}>
                  <VStack spacing="md" divider>
                    {Array.from({ length: 3 }).map((_, i) => generateCard(i, 'outlined'))}
                  </VStack>
                </GridItem>
              </Grid>
            </div>
          </VStack>
        </section>

      </VStack>
    </Container>
  );
};