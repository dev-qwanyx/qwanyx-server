import React, { useState } from 'react';
import { z } from 'zod';
import { QwanyxTemplate } from '../src/templates/QwanyxTemplate';
import {
  Container,
  Section,
  Grid,
  Flex,
  Heading,
  Text,
  Code,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardImage,
  Input,
  Textarea,
  Form,
  Field,
  Select,
  Checkbox,
  Radio,
  FileInput,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Hero,
  HeroTitle,
  HeroSubtitle,
  HeroContent,
  HeroActions,
  Feature,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription,
  FeaturesGrid,
  Footer,
  FooterSection,
  FooterTitle,
  FooterLink,
  FooterLinks,
  FooterGrid,
  FooterBottom,
  Badge,
  ClosableBadge,
  DotBadge,
  Avatar,
  AvatarGroup,
  InitialsAvatar,
  SimpleModal,
} from '../src';

export const ComponentShowcase: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <Container>
      <Section spacing="xl">
        <Heading as="h1" className="mb-8">Component Library</Heading>
        
        <Tabs defaultValue="typography">
          <TabsList variant="boxed" fullWidth>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="buttons">Buttons</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
            <TabsTrigger value="website">Website</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          {/* Typography Tab */}
          <TabsContent value="typography">
            <div className="space-y-8">
              <div>
                <Heading as="h3" className="mb-4">Headings</Heading>
                <div className="space-y-2">
                  <Heading as="h1">Heading 1 - The quick brown fox</Heading>
                  <Heading as="h2">Heading 2 - Jumps over the lazy dog</Heading>
                  <Heading as="h3">Heading 3 - Pack my box with five dozen</Heading>
                  <Heading as="h4">Heading 4 - Liquor jugs</Heading>
                  <Heading as="h5">Heading 5 - The five boxing wizards</Heading>
                  <Heading as="h6">Heading 6 - Jump quickly</Heading>
                </div>
              </div>
              
              <div>
                <Heading as="h3" className="mb-4">Text Sizes</Heading>
                <div className="space-y-2">
                  <Text size="2xl">Extra Large Text</Text>
                  <Text size="xl">Extra Large Text</Text>
                  <Text size="lg">Large Text</Text>
                  <Text>Base Text (Default)</Text>
                  <Text size="sm">Small Text</Text>
                  <Text size="xs">Extra Small Text</Text>
                </div>
              </div>
              
              <div>
                <Heading as="h3" className="mb-4">Text Colors</Heading>
                <div className="space-y-2">
                  <Text color="primary">Primary Text Color</Text>
                  <Text color="secondary">Secondary Text Color</Text>
                  <Text color="muted">Muted Text Color</Text>
                  <Text color="accent">Accent Text Color</Text>
                  <Text color="success">Success Text Color</Text>
                  <Text color="warning">Warning Text Color</Text>
                  <Text color="error">Error Text Color</Text>
                  <Text color="info">Info Text Color</Text>
                </div>
              </div>
              
              <div>
                <Heading as="h3" className="mb-4">Text Styles</Heading>
                <div className="space-y-2">
                  <Text italic>Italic Text Style</Text>
                  <Text underline>Underlined Text</Text>
                  <Text lineThrough>Line Through Text</Text>
                  <Text weight="bold">Bold Text Weight</Text>
                </div>
              </div>
              
              <div>
                <Heading as="h3" className="mb-4">Code</Heading>
                <div className="space-y-4">
                  <div>
                    <Text className="mb-2">Inline code: <Code>const inline = 'code';</Code></Text>
                  </div>
                  <Code variant="block" language="typescript">
{`function example() {
  const message = "Hello, World!";
  console.log(message);
  return message;
}`}
                  </Code>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Buttons Tab */}
          <TabsContent value="buttons">
            <div className="space-y-8">
              <div>
                <Heading as="h3" className="mb-4">Solid Buttons</Heading>
                <Flex gap="sm" wrap="wrap">
                  <Button color="primary">Primary</Button>
                  <Button color="secondary">Secondary</Button>
                  <Button color="accent">Accent</Button>
                  <Button color="success">Success</Button>
                  <Button color="warning">Warning</Button>
                  <Button color="error">Error</Button>
                  <Button color="info">Info</Button>
                </Flex>
              </div>
              
              <div>
                <Heading as="h3" className="mb-4">Outline Buttons</Heading>
                <Flex gap="sm" wrap="wrap">
                  <Button variant="outline" color="primary">Primary</Button>
                  <Button variant="outline" color="secondary">Secondary</Button>
                  <Button variant="outline" color="accent">Accent</Button>
                  <Button variant="outline" color="success">Success</Button>
                  <Button variant="outline" color="warning">Warning</Button>
                  <Button variant="outline" color="error">Error</Button>
                  <Button variant="outline" color="info">Info</Button>
                </Flex>
              </div>
              
              <div>
                <Heading as="h3" className="mb-4">Ghost Buttons</Heading>
                <Flex gap="sm" wrap="wrap">
                  <Button variant="ghost" color="primary">Primary</Button>
                  <Button variant="ghost" color="secondary">Secondary</Button>
                  <Button variant="ghost" color="accent">Accent</Button>
                  <Button variant="ghost" color="success">Success</Button>
                  <Button variant="ghost" color="warning">Warning</Button>
                  <Button variant="ghost" color="error">Error</Button>
                  <Button variant="ghost" color="info">Info</Button>
                </Flex>
              </div>
              
              <div>
                <Heading as="h3" className="mb-4">Link Buttons</Heading>
                <Flex gap="sm" wrap="wrap">
                  <Button variant="link" color="primary">Primary Link</Button>
                  <Button variant="link" color="secondary">Secondary Link</Button>
                  <Button variant="link" color="accent">Accent Link</Button>
                </Flex>
              </div>
              
              <div>
                <Heading as="h3" className="mb-4">Button Sizes</Heading>
                <Flex gap="sm" align="center" wrap="wrap">
                  <Button size="xs">Extra Small</Button>
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </Flex>
              </div>
              
              <div>
                <Heading as="h3" className="mb-4">Button States</Heading>
                <Flex gap="sm" wrap="wrap">
                  <Button loading>Loading</Button>
                  <Button disabled>Disabled</Button>
                  <Button fullWidth>Full Width Button</Button>
                </Flex>
              </div>
            </div>
          </TabsContent>
          
          {/* Cards Tab */}
          <TabsContent value="cards">
            <Grid cols={3} gap="lg">
              <Card>
                <CardHeader>
                  <CardTitle>Simple Card</CardTitle>
                  <CardDescription>This is a basic card with header</CardDescription>
                </CardHeader>
                <CardContent>
                  <Text>
                    Cards are versatile containers that can hold any type of content. 
                    They help organize information in a clear, scannable way.
                  </Text>
                </CardContent>
                <CardFooter>
                  <Flex gap="sm">
                    <Button size="sm">Action</Button>
                    <Button size="sm" variant="ghost">Cancel</Button>
                  </Flex>
                </CardFooter>
              </Card>
              
              <Card variant="outlined">
                <CardImage 
                  src="https://picsum.photos/400/200?random=1" 
                  alt="Random landscape"
                  aspectRatio="16/9"
                />
                <CardContent>
                  <Heading as="h4">Card with Image</Heading>
                  <Text size="sm" color="secondary" className="mt-2">
                    This card includes an image at the top. Images can have different aspect ratios.
                  </Text>
                </CardContent>
              </Card>
              
              <Card variant="filled" hoverable>
                <CardContent>
                  <Heading as="h4">Hoverable Card</Heading>
                  <Text size="sm" color="secondary" className="mt-2">
                    This card has a hover effect. Try hovering over it to see the elevation change.
                  </Text>
                  <div className="mt-4">
                    <Button size="sm" fullWidth>
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </TabsContent>
          
          {/* Forms Tab */}
          <TabsContent value="forms">
            <Grid cols={2} gap="lg">
              <div className="space-y-6">
                <div>
                  <Heading as="h3" className="mb-4">Input Variants</Heading>
                  <div className="space-y-3">
                    <Input 
                      placeholder="Default input" 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                    <Input 
                      variant="filled" 
                      placeholder="Filled input"
                    />
                    <Input 
                      variant="ghost" 
                      placeholder="Ghost input"
                    />
                  </div>
                </div>
                
                <div>
                  <Heading as="h3" className="mb-4">Input States</Heading>
                  <div className="space-y-3">
                    <Input 
                      placeholder="Success state" 
                      success
                    />
                    <Input 
                      placeholder="Error state" 
                      error
                    />
                    <Input 
                      placeholder="Disabled state" 
                      disabled
                    />
                  </div>
                </div>
                
                <div>
                  <Heading as="h3" className="mb-4">Input Sizes</Heading>
                  <div className="space-y-3">
                    <Input inputSize="xs" placeholder="Extra small" />
                    <Input inputSize="sm" placeholder="Small" />
                    <Input inputSize="md" placeholder="Medium" />
                    <Input inputSize="lg" placeholder="Large" />
                    <Input inputSize="xl" placeholder="Extra large" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Heading as="h3" className="mb-4">Textarea</Heading>
                  <Textarea 
                    placeholder="Enter your message here..."
                    rows={4}
                    value={textareaValue}
                    onChange={(e) => setTextareaValue(e.target.value)}
                  />
                </div>
                
                <div>
                  <Heading as="h3" className="mb-4">Textarea Variants</Heading>
                  <div className="space-y-3">
                    <Textarea 
                      variant="filled" 
                      placeholder="Filled textarea"
                      rows={3}
                    />
                    <Textarea 
                      variant="ghost" 
                      placeholder="Ghost textarea"
                      rows={3}
                    />
                  </div>
                </div>
                
                <div>
                  <Heading as="h3" className="mb-4">Resize Options</Heading>
                  <div className="space-y-3">
                    <Textarea 
                      placeholder="No resize"
                      resize="none"
                      rows={2}
                    />
                    <Textarea 
                      placeholder="Vertical resize only (default)"
                      resize="vertical"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </Grid>
          </TabsContent>
          
          {/* Layout Tab */}
          <TabsContent value="layout">
            <div className="space-y-8">
              <div>
                <Heading as="h3" className="mb-4">Grid Layout</Heading>
                <Grid cols={4} gap="md">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Card key={i} variant="outlined" padding="sm">
                      <Text align="center">Grid Item {i}</Text>
                    </Card>
                  ))}
                </Grid>
              </div>
              
              <div>
                <Heading as="h3" className="mb-4">Flex Layout</Heading>
                <Card variant="outlined" padding="md">
                  <Flex justify="between" align="center">
                    <Text>Left aligned</Text>
                    <Text>Center content</Text>
                    <Text>Right aligned</Text>
                  </Flex>
                </Card>
              </div>
              
              <div>
                <Heading as="h3" className="mb-4">Container Sizes</Heading>
                <div className="space-y-3">
                  <Container size="sm" className="bg-gray-100 rounded p-4">
                    <Text align="center">Small Container</Text>
                  </Container>
                  <Container size="md" className="bg-gray-100 rounded p-4">
                    <Text align="center">Medium Container</Text>
                  </Container>
                  <Container size="lg" className="bg-gray-100 rounded p-4">
                    <Text align="center">Large Container</Text>
                  </Container>
                </div>
              </div>
              
              <div>
                <Heading as="h3" className="mb-4">Section Spacing</Heading>
                <div className="space-y-2">
                  <Section spacing="sm" className="bg-gray-100 rounded">
                    <Text align="center">Small Section Spacing</Text>
                  </Section>
                  <Section spacing="md" className="bg-gray-100 rounded">
                    <Text align="center">Medium Section Spacing</Text>
                  </Section>
                  <Section spacing="lg" className="bg-gray-100 rounded">
                    <Text align="center">Large Section Spacing</Text>
                  </Section>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Navigation Tab */}
          <TabsContent value="navigation">
            <div className="space-y-8">
              <div>
                <Heading as="h3" className="mb-4">Tab Variants</Heading>
                
                <div className="space-y-8">
                  <div>
                    <Text weight="semibold" className="mb-3">Line Tabs (Default)</Text>
                    <Tabs defaultValue="tab1">
                      <TabsList variant="line">
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                      </TabsList>
                      <TabsContent value="tab1">
                        <Card><CardContent>Content for Tab 1</CardContent></Card>
                      </TabsContent>
                      <TabsContent value="tab2">
                        <Card><CardContent>Content for Tab 2</CardContent></Card>
                      </TabsContent>
                      <TabsContent value="tab3">
                        <Card><CardContent>Content for Tab 3</CardContent></Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  <div>
                    <Text weight="semibold" className="mb-3">Boxed Tabs</Text>
                    <Tabs defaultValue="tab1">
                      <TabsList variant="boxed">
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                      </TabsList>
                      <TabsContent value="tab1">
                        <Card><CardContent>Content for Tab 1</CardContent></Card>
                      </TabsContent>
                      <TabsContent value="tab2">
                        <Card><CardContent>Content for Tab 2</CardContent></Card>
                      </TabsContent>
                      <TabsContent value="tab3">
                        <Card><CardContent>Content for Tab 3</CardContent></Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  <div>
                    <Text weight="semibold" className="mb-3">Pills Tabs</Text>
                    <Tabs defaultValue="tab1">
                      <TabsList variant="pills">
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                      </TabsList>
                      <TabsContent value="tab1">
                        <Card><CardContent>Content for Tab 1</CardContent></Card>
                      </TabsContent>
                      <TabsContent value="tab2">
                        <Card><CardContent>Content for Tab 2</CardContent></Card>
                      </TabsContent>
                      <TabsContent value="tab3">
                        <Card><CardContent>Content for Tab 3</CardContent></Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  <div>
                    <Text weight="semibold" className="mb-3">Full Width Tabs</Text>
                    <Tabs defaultValue="tab1">
                      <TabsList variant="line" fullWidth>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                      </TabsList>
                      <TabsContent value="tab1">
                        <Card><CardContent>Content for Tab 1</CardContent></Card>
                      </TabsContent>
                      <TabsContent value="tab2">
                        <Card><CardContent>Content for Tab 2</CardContent></Card>
                      </TabsContent>
                      <TabsContent value="tab3">
                        <Card><CardContent>Content for Tab 3</CardContent></Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Website Components Tab */}
          <TabsContent value="website">
            <div className="space-y-12">
              {/* Hero Section */}
              <div>
                <Heading as="h3" className="mb-6">Hero Sections</Heading>
                <div className="space-y-6">
                  <Hero size="md" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
                    <HeroContent>
                      <HeroTitle>Welcome to QWANYX UI</HeroTitle>
                      <HeroSubtitle>Build beautiful websites with our modern component library</HeroSubtitle>
                      <HeroActions>
                        <Button size="lg" variant="solid">Get Started</Button>
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">Learn More</Button>
                      </HeroActions>
                    </HeroContent>
                  </Hero>
                  
                  <Hero size="sm" centered={false} className="bg-gray-100 rounded-lg">
                    <HeroContent>
                      <Grid cols={2} gap="lg">
                        <div>
                          <HeroTitle as="h2">Build Faster</HeroTitle>
                          <Text className="mb-4">Create stunning interfaces with pre-built components.</Text>
                          <Button>Start Building</Button>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="w-64 h-64 bg-gray-300 rounded-lg" />
                        </div>
                      </Grid>
                    </HeroContent>
                  </Hero>
                </div>
              </div>
              
              {/* Features */}
              <div>
                <Heading as="h3" className="mb-6">Features</Heading>
                <FeaturesGrid cols={3}>
                  <Feature centered>
                    <FeatureIcon size="lg" color="primary">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </FeatureIcon>
                    <FeatureTitle>Lightning Fast</FeatureTitle>
                    <FeatureDescription>
                      Optimized for performance with minimal bundle size.
                    </FeatureDescription>
                  </Feature>
                  
                  <Feature centered>
                    <FeatureIcon size="lg" color="success">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </FeatureIcon>
                    <FeatureTitle>Secure by Default</FeatureTitle>
                    <FeatureDescription>
                      Built with security best practices in mind.
                    </FeatureDescription>
                  </Feature>
                  
                  <Feature centered>
                    <FeatureIcon size="lg" color="accent">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    </FeatureIcon>
                    <FeatureTitle>Fully Customizable</FeatureTitle>
                    <FeatureDescription>
                      Easily customize colors, typography, and spacing.
                    </FeatureDescription>
                  </Feature>
                </FeaturesGrid>
              </div>
              
              {/* Badges */}
              <div>
                <Heading as="h3" className="mb-4">Badges</Heading>
                <div className="space-y-4">
                  <div>
                    <Text weight="semibold" className="mb-2">Solid Badges</Text>
                    <Flex gap="sm" wrap="wrap">
                      <Badge>Default</Badge>
                      <Badge color="primary">Primary</Badge>
                      <Badge color="secondary">Secondary</Badge>
                      <Badge color="success">Success</Badge>
                      <Badge color="warning">Warning</Badge>
                      <Badge color="error">Error</Badge>
                      <Badge color="info">Info</Badge>
                    </Flex>
                  </div>
                  
                  <div>
                    <Text weight="semibold" className="mb-2">Outline Badges</Text>
                    <Flex gap="sm" wrap="wrap">
                      <Badge variant="outline" color="primary">Primary</Badge>
                      <Badge variant="outline" color="secondary">Secondary</Badge>
                      <Badge variant="outline" color="success">Success</Badge>
                      <Badge variant="outline" color="warning">Warning</Badge>
                      <Badge variant="outline" color="error">Error</Badge>
                    </Flex>
                  </div>
                  
                  <div>
                    <Text weight="semibold" className="mb-2">Subtle Badges</Text>
                    <Flex gap="sm" wrap="wrap">
                      <Badge variant="subtle" color="primary">Primary</Badge>
                      <Badge variant="subtle" color="secondary">Secondary</Badge>
                      <Badge variant="subtle" color="success">Success</Badge>
                      <Badge variant="subtle" color="warning">Warning</Badge>
                      <Badge variant="subtle" color="error">Error</Badge>
                    </Flex>
                  </div>
                  
                  <div>
                    <Text weight="semibold" className="mb-2">Badge Sizes</Text>
                    <Flex gap="sm" align="center" wrap="wrap">
                      <Badge size="xs">Extra Small</Badge>
                      <Badge size="sm">Small</Badge>
                      <Badge size="md">Medium</Badge>
                      <Badge size="lg">Large</Badge>
                    </Flex>
                  </div>
                  
                  <div>
                    <Text weight="semibold" className="mb-2">Special Badges</Text>
                    <Flex gap="sm" wrap="wrap">
                      <DotBadge color="success">Online</DotBadge>
                      <DotBadge color="warning" dotColor="warning">Away</DotBadge>
                      <DotBadge color="error" dotColor="error">Busy</DotBadge>
                      <ClosableBadge onClose={() => console.log('Closed')}>Closable</ClosableBadge>
                    </Flex>
                  </div>
                </div>
              </div>
              
              {/* Avatars */}
              <div>
                <Heading as="h3" className="mb-4">Avatars</Heading>
                <div className="space-y-4">
                  <div>
                    <Text weight="semibold" className="mb-2">Avatar Sizes</Text>
                    <Flex gap="sm" align="center">
                      <Avatar size="xs" src="https://i.pravatar.cc/150?img=1" />
                      <Avatar size="sm" src="https://i.pravatar.cc/150?img=2" />
                      <Avatar size="md" src="https://i.pravatar.cc/150?img=3" />
                      <Avatar size="lg" src="https://i.pravatar.cc/150?img=4" />
                      <Avatar size="xl" src="https://i.pravatar.cc/150?img=5" />
                      <Avatar size="2xl" src="https://i.pravatar.cc/150?img=6" />
                    </Flex>
                  </div>
                  
                  <div>
                    <Text weight="semibold" className="mb-2">Avatar with Status</Text>
                    <Flex gap="sm" align="center">
                      <Avatar src="https://i.pravatar.cc/150?img=7" status="online" />
                      <Avatar src="https://i.pravatar.cc/150?img=8" status="away" />
                      <Avatar src="https://i.pravatar.cc/150?img=9" status="busy" />
                      <Avatar src="https://i.pravatar.cc/150?img=10" status="offline" />
                    </Flex>
                  </div>
                  
                  <div>
                    <Text weight="semibold" className="mb-2">Initials Avatars</Text>
                    <Flex gap="sm" align="center">
                      <InitialsAvatar name="John Doe" size="sm" />
                      <InitialsAvatar name="Jane Smith" size="md" />
                      <InitialsAvatar name="Bob Johnson" size="lg" />
                      <InitialsAvatar name="Alice Williams" size="xl" />
                    </Flex>
                  </div>
                  
                  <div>
                    <Text weight="semibold" className="mb-2">Avatar Group</Text>
                    <AvatarGroup max={4}>
                      <Avatar src="https://i.pravatar.cc/150?img=11" />
                      <Avatar src="https://i.pravatar.cc/150?img=12" />
                      <Avatar src="https://i.pravatar.cc/150?img=13" />
                      <Avatar src="https://i.pravatar.cc/150?img=14" />
                      <Avatar src="https://i.pravatar.cc/150?img=15" />
                      <Avatar src="https://i.pravatar.cc/150?img=16" />
                    </AvatarGroup>
                  </div>
                </div>
              </div>
              
              {/* Modal */}
              <div>
                <Heading as="h3" className="mb-4">Modals</Heading>
                <Flex gap="sm" wrap="wrap">
                  <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
                </Flex>
                
                <SimpleModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  title="Example Modal"
                  description="This is a simple modal component"
                  footer={
                    <>
                      <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                      <Button onClick={() => setIsModalOpen(false)}>Confirm</Button>
                    </>
                  }
                >
                  <Text>
                    This is the modal body content. You can put any content here including forms, images, or other components.
                  </Text>
                </SimpleModal>
              </div>
              
              {/* Forms */}
              <div>
                <Heading as="h3" className="mb-4">Forms</Heading>
                <div className="space-y-6">
                  {/* Simple Contact Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Form Example</CardTitle>
                      <CardDescription>Form with validation using Zod</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const contactSchema = z.object({
                          name: z.string().min(2, 'Name must be at least 2 characters'),
                          email: z.string().email('Invalid email'),
                          subject: z.string().min(1, 'Please select a subject'),
                          message: z.string().min(10, 'Message must be at least 10 characters'),
                          newsletter: z.boolean().optional(),
                          priority: z.enum(['low', 'medium', 'high'])
                        });

                        type ContactData = z.infer<typeof contactSchema>;

                        const handleSubmit = (data: ContactData) => {
                          console.log('Form submitted:', data);
                          alert('Form submitted! Check console.');
                        };

                        const subjects = [
                          { value: '', label: 'Choose a subject', disabled: true },
                          { value: 'general', label: 'General Inquiry' },
                          { value: 'support', label: 'Support' },
                          { value: 'feedback', label: 'Feedback' }
                        ];

                        return (
                          <Form<ContactData>
                            onSubmit={handleSubmit}
                            schema={contactSchema}
                            defaultValues={{
                              name: '',
                              email: '',
                              subject: '',
                              message: '',
                              newsletter: false,
                              priority: 'medium'
                            }}
                          >
                            <div className="space-y-4">
                              <Field name="name" label="Your Name" required>
                                <Input name="name" placeholder="John Doe" fullWidth />
                              </Field>

                              <Field name="email" label="Email" required>
                                <Input name="email" type="email" placeholder="john@example.com" fullWidth />
                              </Field>

                              <Field name="subject" label="Subject" required>
                                <Select name="subject" options={subjects} fullWidth />
                              </Field>

                              <Field name="message" label="Message" required>
                                <Textarea name="message" placeholder="Your message..." rows={4} fullWidth />
                              </Field>

                              <Field name="priority" label="Priority">
                                <Flex gap="sm">
                                  <Radio name="priority" value="low" label="Low" />
                                  <Radio name="priority" value="medium" label="Medium" />
                                  <Radio name="priority" value="high" label="High" />
                                </Flex>
                              </Field>

                              <Checkbox name="newsletter" label="Subscribe to newsletter" />

                              <Flex gap="sm">
                                <Button type="submit">Submit</Button>
                                <Button type="reset" variant="ghost">Reset</Button>
                              </Flex>
                            </div>
                          </Form>
                        );
                      })()}
                    </CardContent>
                  </Card>

                  {/* Form Elements Examples */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Form Elements</CardTitle>
                      <CardDescription>Individual form components (wrapped in a form)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form onSubmit={(data) => console.log('Elements:', data)}>
                        <div className="space-y-4">
                          <div>
                            <Text weight="semibold" className="mb-2">File Input</Text>
                            <FileInput 
                              name="file"
                              label="Choose file..."
                              accept=".pdf,.doc,.docx"
                            />
                          </div>

                          <div>
                            <Text weight="semibold" className="mb-2">Checkboxes</Text>
                            <div className="space-y-2">
                              <Checkbox name="option1" label="Option 1" />
                              <Checkbox name="option2" label="Option 2" />
                              <Checkbox name="option3" label="Option 3 (disabled)" disabled />
                            </div>
                          </div>

                          <div>
                            <Text weight="semibold" className="mb-2">Select Dropdown</Text>
                            <Select 
                              name="country"
                              options={[
                                { value: '', label: 'Select a country', disabled: true },
                                { value: 'us', label: 'United States' },
                                { value: 'uk', label: 'United Kingdom' },
                                { value: 'fr', label: 'France' },
                                { value: 'de', label: 'Germany' }
                              ]}
                              fullWidth
                            />
                          </div>
                        </div>
                      </Form>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Footer */}
              <div>
                <Heading as="h3" className="mb-4">Footer</Heading>
                <div className="border rounded-lg overflow-hidden">
                  <Footer>
                    <FooterGrid cols={4}>
                      <FooterSection>
                        <FooterTitle>Product</FooterTitle>
                        <FooterLinks>
                          <FooterLink href="#">Features</FooterLink>
                          <FooterLink href="#">Pricing</FooterLink>
                          <FooterLink href="#">Documentation</FooterLink>
                          <FooterLink href="#">API</FooterLink>
                        </FooterLinks>
                      </FooterSection>
                      
                      <FooterSection>
                        <FooterTitle>Company</FooterTitle>
                        <FooterLinks>
                          <FooterLink href="#">About</FooterLink>
                          <FooterLink href="#">Blog</FooterLink>
                          <FooterLink href="#">Careers</FooterLink>
                          <FooterLink href="#">Press</FooterLink>
                        </FooterLinks>
                      </FooterSection>
                      
                      <FooterSection>
                        <FooterTitle>Resources</FooterTitle>
                        <FooterLinks>
                          <FooterLink href="#">Community</FooterLink>
                          <FooterLink href="#">Support</FooterLink>
                          <FooterLink href="#">Status</FooterLink>
                          <FooterLink href="#">Security</FooterLink>
                        </FooterLinks>
                      </FooterSection>
                      
                      <FooterSection>
                        <FooterTitle>Legal</FooterTitle>
                        <FooterLinks>
                          <FooterLink href="#">Privacy</FooterLink>
                          <FooterLink href="#">Terms</FooterLink>
                          <FooterLink href="#">Cookie Policy</FooterLink>
                          <FooterLink href="#">License</FooterLink>
                        </FooterLinks>
                      </FooterSection>
                    </FooterGrid>
                    
                    <FooterBottom>
                      <Flex justify="between">
                        <Text>&copy; 2024 QWANYX UI. All rights reserved.</Text>
                        <Flex gap="sm">
                          <FooterLink href="#">Twitter</FooterLink>
                          <FooterLink href="#">GitHub</FooterLink>
                          <FooterLink href="#">LinkedIn</FooterLink>
                        </Flex>
                      </Flex>
                    </FooterBottom>
                  </Footer>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates">
            <div className="space-y-8">
              <div>
                <Heading as="h3" className="mb-4">QWANYX Corporate Template</Heading>
                <Text className="mb-6">
                  A complete corporate website template built with QWANYX-UI components.
                  This is the same structure as the original QWANYX site but using our Tailwind-based components.
                </Text>
                
                <div className="space-y-4 mb-8">
                  <div>
                    <Text weight="semibold">Features:</Text>
                    <ul className="list-disc list-inside text-gray-600 ml-4">
                      <li>Responsive navigation with scroll effects</li>
                      <li>Hero section with gradient background</li>
                      <li>Features grid with icons</li>
                      <li>Services cards with images</li>
                      <li>Stats counter section</li>
                      <li>Contact form with validation</li>
                      <li>Full footer with social links</li>
                    </ul>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 p-4 border-b">
                    <Text weight="semibold">Full Template Preview</Text>
                  </div>
                  <div className="relative" style={{ height: '800px', overflow: 'auto' }}>
                    <QwanyxTemplate />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Section>
    </Container>
  );
};