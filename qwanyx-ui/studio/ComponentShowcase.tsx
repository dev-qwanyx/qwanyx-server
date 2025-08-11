import React, { useState } from 'react';
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
} from '../src';

export const ComponentShowcase: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  
  return (
    <Container>
      <Section spacing="xl">
        {/* Typography Section */}
        <div className="mb-12">
          <Heading as="h2" className="mb-8">Typography</Heading>
          
          <div className="space-y-4">
            <Heading as="h1">Heading 1 - The quick brown fox</Heading>
            <Heading as="h2">Heading 2 - Jumps over the lazy dog</Heading>
            <Heading as="h3">Heading 3 - Pack my box with five dozen</Heading>
            <Heading as="h4">Heading 4 - Liquor jugs</Heading>
            <Heading as="h5">Heading 5 - The five boxing wizards</Heading>
            <Heading as="h6">Heading 6 - Jump quickly</Heading>
            
            <div className="mt-6">
              <Text size="2xl" className="mb-2">Extra Large Text</Text>
              <Text size="xl" className="mb-2">Extra Large Text</Text>
              <Text size="lg" className="mb-2">Large Text</Text>
              <Text className="mb-2">Base Text (Default)</Text>
              <Text size="sm" className="mb-2">Small Text</Text>
              <Text size="xs" className="mb-2">Extra Small Text</Text>
            </div>
            
            <div className="mt-6">
              <Text color="primary" className="mb-2">Primary Text Color</Text>
              <Text color="secondary" className="mb-2">Secondary Text Color</Text>
              <Text color="muted" className="mb-2">Muted Text Color</Text>
              <Text color="accent" className="mb-2">Accent Text Color</Text>
              <Text color="success" className="mb-2">Success Text Color</Text>
              <Text color="warning" className="mb-2">Warning Text Color</Text>
              <Text color="error" className="mb-2">Error Text Color</Text>
              <Text color="info" className="mb-2">Info Text Color</Text>
            </div>
            
            <div className="mt-6">
              <Text italic className="mb-2">Italic Text Style</Text>
              <Text underline className="mb-2">Underlined Text</Text>
              <Text lineThrough className="mb-2">Line Through Text</Text>
              <Text weight="bold" className="mb-2">Bold Text Weight</Text>
            </div>
            
            <div className="mt-6">
              <Code>const inline = 'code';</Code>
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
        
        {/* Buttons Section */}
        <div className="mb-12">
          <Heading as="h2" className="mb-8">Buttons</Heading>
          
          <div className="space-y-6">
            <div>
              <Text weight="semibold" className="mb-3">Solid Buttons</Text>
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
              <Text weight="semibold" className="mb-3">Outline Buttons</Text>
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
              <Text weight="semibold" className="mb-3">Ghost Buttons</Text>
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
              <Text weight="semibold" className="mb-3">Link Buttons</Text>
              <Flex gap="sm" wrap="wrap">
                <Button variant="link" color="primary">Primary Link</Button>
                <Button variant="link" color="secondary">Secondary Link</Button>
                <Button variant="link" color="accent">Accent Link</Button>
              </Flex>
            </div>
            
            <div>
              <Text weight="semibold" className="mb-3">Button Sizes</Text>
              <Flex gap="sm" align="center" wrap="wrap">
                <Button size="xs">Extra Small</Button>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </Flex>
            </div>
            
            <div>
              <Text weight="semibold" className="mb-3">Button States</Text>
              <Flex gap="sm" wrap="wrap">
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
                <Button fullWidth>Full Width Button</Button>
              </Flex>
            </div>
          </div>
        </div>
        
        {/* Cards Section */}
        <div className="mb-12">
          <Heading as="h2" className="mb-8">Cards</Heading>
          
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
        </div>
        
        {/* Forms Section */}
        <div className="mb-12">
          <Heading as="h2" className="mb-8">Form Elements</Heading>
          
          <Grid cols={2} gap="lg">
            <div className="space-y-6">
              <div>
                <Text weight="semibold" className="mb-3">Input Variants</Text>
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
                <Text weight="semibold" className="mb-3">Input States</Text>
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
                <Text weight="semibold" className="mb-3">Input Sizes</Text>
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
                <Text weight="semibold" className="mb-3">Textarea</Text>
                <Textarea 
                  placeholder="Enter your message here..."
                  rows={4}
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                />
              </div>
              
              <div>
                <Text weight="semibold" className="mb-3">Textarea Variants</Text>
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
                <Text weight="semibold" className="mb-3">Resize Options</Text>
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
        </div>
        
        {/* Layout Section */}
        <div className="mb-12">
          <Heading as="h2" className="mb-8">Layout Components</Heading>
          
          <div className="space-y-6">
            <div>
              <Text weight="semibold" className="mb-3">Grid Layout</Text>
              <Grid cols={4} gap="md">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Card key={i} variant="outlined" padding="sm">
                    <Text align="center">Grid Item {i}</Text>
                  </Card>
                ))}
              </Grid>
            </div>
            
            <div>
              <Text weight="semibold" className="mb-3">Flex Layout</Text>
              <Card variant="outlined" padding="md">
                <Flex justify="between" align="center">
                  <Text>Left aligned</Text>
                  <Text>Center content</Text>
                  <Text>Right aligned</Text>
                </Flex>
              </Card>
            </div>
            
            <div>
              <Text weight="semibold" className="mb-3">Container Sizes</Text>
              <div className="space-y-3">
                <Container size="sm" className="bg-card border border-border rounded p-4">
                  <Text align="center">Small Container</Text>
                </Container>
                <Container size="md" className="bg-card border border-border rounded p-4">
                  <Text align="center">Medium Container</Text>
                </Container>
                <Container size="lg" className="bg-card border border-border rounded p-4">
                  <Text align="center">Large Container</Text>
                </Container>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </Container>
  );
};