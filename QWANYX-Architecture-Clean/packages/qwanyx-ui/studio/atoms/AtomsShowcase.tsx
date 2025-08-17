import React, { useState } from 'react';
import {
  Container,
  Section,
  Heading,
  Text,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Grid,
  Flex,
  Card,
  CardContent,
  // Existing Atoms
  Button,
  Input,
  Textarea,
  Badge,
  Avatar,
  Icon,
  Link,
  // New Atoms
  Spinner,
  SpinnerWithText,
  Switch,
  SwitchGroup,
  Progress,
  ProgressWithLabel,
  // Divider,
  // Tooltip,
} from '../../src';

export const AtomsShowcase: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [switchValue, setSwitchValue] = useState(false);

  return (
    <Container>
      <Section spacing="xl">
        <div className="qwanyx-mb-8">
          <Heading as="h1" className="qwanyx-mb-4">⚛️ Atoms</Heading>
          <Text size="lg" color="secondary">
            Basic building blocks of our design system. These are the smallest, indivisible components.
          </Text>
        </div>

        <Tabs defaultValue="existing">
          <TabsList variant="boxed" fullWidth>
            <TabsTrigger value="existing">✅ Existing Atoms</TabsTrigger>
            <TabsTrigger value="new">🆕 New Atoms (Today)</TabsTrigger>
            <TabsTrigger value="all">📊 All Atoms</TabsTrigger>
          </TabsList>

          {/* Existing Atoms Tab */}
          <TabsContent value="existing">
            <div className="qwanyx-space-y-12">
              {/* Button Atom */}
              <div>
                <Heading as="h3" className="qwanyx-mb-4">Button</Heading>
                <Text color="muted" className="qwanyx-mb-6">
                  Status: <Badge color="success" size="sm">Stable</Badge> • 
                  Used in: Forms, Modals, Navigation
                </Text>
                <div className="qwanyx-space-y-4">
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-2">Variants</Text>
                    <Flex gap="sm" wrap="wrap">
                      <Button variant="solid">Solid</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="link">Link</Button>
                    </Flex>
                  </div>
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-2">Sizes</Text>
                    <Flex gap="sm" align="center" wrap="wrap">
                      <Button size="xs">Extra Small</Button>
                      <Button size="sm">Small</Button>
                      <Button size="md">Medium</Button>
                      <Button size="lg">Large</Button>
                      <Button size="xl">Extra Large</Button>
                    </Flex>
                  </div>
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-2">States</Text>
                    <Flex gap="sm" wrap="wrap">
                      <Button loading>Loading</Button>
                      <Button disabled>Disabled</Button>
                    </Flex>
                  </div>
                </div>
              </div>

              {/* Input Atom */}
              <div>
                <Heading as="h3" className="qwanyx-mb-4">Input</Heading>
                <Text color="muted" className="qwanyx-mb-6">
                  Status: <Badge color="success" size="sm">Stable</Badge> • 
                  Used in: Forms, Search, Auth
                </Text>
                <Grid cols={2} gap="lg">
                  <div className="qwanyx-space-y-3">
                    <Input placeholder="Default input" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                    <Input variant="filled" placeholder="Filled variant" />
                    <Input variant="ghost" placeholder="Ghost variant" />
                    <Input placeholder="With error" error />
                    <Input placeholder="Disabled" disabled />
                  </div>
                  <div className="qwanyx-space-y-3">
                    <Textarea placeholder="Textarea component" rows={3} value={textareaValue} onChange={(e) => setTextareaValue(e.target.value)} />
                    <Textarea variant="filled" placeholder="Filled textarea" rows={3} />
                  </div>
                </Grid>
              </div>

              {/* Text/Typography Atom */}
              <div>
                <Heading as="h3" className="qwanyx-mb-4">Text & Typography</Heading>
                <Text color="muted" className="qwanyx-mb-6">
                  Status: <Badge color="success" size="sm">Stable</Badge> • 
                  Used in: Everywhere
                </Text>
                <div className="qwanyx-space-y-2">
                  <Heading as="h1">Heading 1</Heading>
                  <Heading as="h2">Heading 2</Heading>
                  <Heading as="h3">Heading 3</Heading>
                  <Text size="xl">Extra Large Text</Text>
                  <Text>Normal Text</Text>
                  <Text size="sm" color="muted">Small Muted Text</Text>
                  <Text className="qwanyx-font-mono qwanyx-bg-muted qwanyx-px-1">const code = 'example';</Text>
                </div>
              </div>

              {/* Badge Atom */}
              <div>
                <Heading as="h3" className="qwanyx-mb-4">Badge</Heading>
                <Text color="muted" className="qwanyx-mb-6">
                  Status: <Badge color="success" size="sm">Stable</Badge> • 
                  Used in: Status indicators, Labels
                </Text>
                <div className="qwanyx-space-y-4">
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-2">Standard Colors</Text>
                    <Flex gap="sm" wrap="wrap">
                      <Badge>Default</Badge>
                      <Badge color="primary">Primary</Badge>
                      <Badge color="success">Success</Badge>
                      <Badge color="warning">Warning</Badge>
                      <Badge color="error">Error</Badge>
                      <Badge color="info">Info</Badge>
                      <Badge variant="outline" color="primary">Outline</Badge>
                      <Badge variant="subtle" color="primary">Subtle</Badge>
                    </Flex>
                  </div>
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-2">Agile Status Colors</Text>
                    <Flex gap="sm" wrap="wrap">
                      <Badge className="qwanyx-bg-status-backlog qwanyx-text-white">Backlog</Badge>
                      <Badge className="qwanyx-bg-status-todo qwanyx-text-white">To Do</Badge>
                      <Badge className="qwanyx-bg-status-doing qwanyx-text-white">In Progress</Badge>
                      <Badge className="qwanyx-bg-status-review qwanyx-text-white">Review</Badge>
                      <Badge className="qwanyx-bg-status-done qwanyx-text-white">Done</Badge>
                      <Badge className="qwanyx-bg-status-blocked qwanyx-text-white">Blocked</Badge>
                      <Badge className="qwanyx-bg-status-validated qwanyx-text-white">Validated</Badge>
                      <Badge className="qwanyx-bg-status-archived qwanyx-text-white">Archived</Badge>
                    </Flex>
                  </div>
                </div>
              </div>

              {/* Avatar Atom */}
              <div>
                <Heading as="h3" className="qwanyx-mb-4">Avatar</Heading>
                <Text color="muted" className="qwanyx-mb-6">
                  Status: <Badge color="success" size="sm">Stable</Badge> • 
                  Used in: User profiles, Comments, Lists
                </Text>
                <Flex gap="sm" align="center">
                  <Avatar size="xs" src="https://i.pravatar.cc/150?img=1" />
                  <Avatar size="sm" src="https://i.pravatar.cc/150?img=2" />
                  <Avatar size="md" src="https://i.pravatar.cc/150?img=3" />
                  <Avatar size="lg" src="https://i.pravatar.cc/150?img=4" />
                  <Avatar size="xl" src="https://i.pravatar.cc/150?img=5" />
                  <Avatar size="md" src="https://i.pravatar.cc/150?img=6" status="online" />
                  <Avatar size="md" src="https://i.pravatar.cc/150?img=7" status="away" />
                </Flex>
              </div>

              {/* Icon Atom */}
              <div>
                <Heading as="h3" className="qwanyx-mb-4">Icon</Heading>
                <Text color="muted" className="qwanyx-mb-6">
                  Status: <Badge color="success" size="sm">Stable</Badge> • 
                  Used in: Buttons, Navigation, Indicators
                </Text>
                <Flex gap="md" wrap="wrap" align="center">
                  <div className="qwanyx-text-center">
                    <Icon name="Home" size="sm" />
                    <Text size="xs" className="qwanyx-mt-1">Home</Text>
                  </div>
                  <div className="qwanyx-text-center">
                    <Icon name="User" size="md" />
                    <Text size="xs" className="qwanyx-mt-1">User</Text>
                  </div>
                  <div className="qwanyx-text-center">
                    <Icon name="Star" size="lg" />
                    <Text size="xs" className="qwanyx-mt-1">Star</Text>
                  </div>
                  <div className="qwanyx-text-center">
                    <Icon name="Shield" color="primary" />
                    <Text size="xs" className="qwanyx-mt-1">Shield</Text>
                  </div>
                  <div className="qwanyx-text-center">
                    <Icon name="Check" color="success" />
                    <Text size="xs" className="qwanyx-mt-1">Check</Text>
                  </div>
                  <div className="qwanyx-text-center">
                    <Icon name="Warning" color="error" />
                    <Text size="xs" className="qwanyx-mt-1">Warning</Text>
                  </div>
                </Flex>
              </div>


              {/* Link Atom */}
              <div>
                <Heading as="h3" className="qwanyx-mb-4">Link</Heading>
                <Text color="muted" className="qwanyx-mb-6">
                  Status: <Badge color="success" size="sm">Stable</Badge> • 
                  Used in: Navigation, Text content
                </Text>
                <Flex gap="md" wrap="wrap">
                  <Link href="#">Default Link</Link>
                  <Link href="#" color="primary">Primary Link</Link>
                  <Link href="#" underline="hover">Hover Underline</Link>
                  <Link href="#" underline="always">Always Underlined</Link>
                  <Link href="#">External Link</Link>
                </Flex>
              </div>
            </div>
          </TabsContent>

          {/* New Atoms Tab */}
          <TabsContent value="new">
            <div className="qwanyx-space-y-12">
              <div className="qwanyx-p-8 qwanyx-bg-info/10 qwanyx-rounded-lg qwanyx-border qwanyx-border-info">
                <Heading as="h3" className="qwanyx-mb-4">✨ New Atoms Added Today</Heading>
                <Text className="qwanyx-mb-4">
                  These new components have been successfully implemented!
                </Text>
              </div>

              {/* Spinner Section */}
              <div>
                <Heading as="h3" className="qwanyx-mb-4">Spinner</Heading>
                <Text color="muted" className="qwanyx-mb-6">
                  Status: <Badge color="success" size="sm">Ready</Badge> • 
                  Used in: Loading states, Buttons, Forms
                </Text>
                <div className="qwanyx-space-y-6">
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-3">Types</Text>
                    <Flex gap="xl" wrap="wrap" align="center">
                      <div className="qwanyx-text-center">
                        <Spinner type="circle" size="lg" />
                        <Text size="xs" className="qwanyx-mt-2">Circle</Text>
                      </div>
                      <div className="qwanyx-text-center">
                        <Spinner type="ring" size="lg" />
                        <Text size="xs" className="qwanyx-mt-2">Ring</Text>
                      </div>
                      <div className="qwanyx-text-center">
                        <Spinner type="sync" size="lg" />
                        <Text size="xs" className="qwanyx-mt-2">Sync</Text>
                      </div>
                    </Flex>
                  </div>
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-3">Sizes</Text>
                    <Flex gap="lg" align="center" wrap="wrap">
                      <Spinner size="xs" />
                      <Spinner size="sm" />
                      <Spinner size="md" />
                      <Spinner size="lg" />
                      <Spinner size="xl" />
                    </Flex>
                  </div>
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-3">Colors</Text>
                    <Flex gap="lg" wrap="wrap">
                      <Spinner color="primary" />
                      <Spinner color="secondary" />
                      <Spinner color="accent" />
                      <Spinner color="success" />
                      <Spinner color="warning" />
                      <Spinner color="error" />
                      <Spinner color="info" />
                    </Flex>
                  </div>
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-3">With Text</Text>
                    <Flex gap="lg" wrap="wrap">
                      <SpinnerWithText text="Loading..." />
                      <SpinnerWithText text="Please wait" textPosition="left" />
                    </Flex>
                  </div>
                </div>
              </div>

              {/* Switch Section */}
              <div>
                <Heading as="h3" className="qwanyx-mb-4">Switch</Heading>
                <Text color="muted" className="qwanyx-mb-6">
                  Status: <Badge color="success" size="sm">Ready</Badge> • 
                  Used in: Settings, Forms, Toggles
                </Text>
                <div className="qwanyx-space-y-6">
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-3">Basic Switch</Text>
                    <Flex gap="lg" wrap="wrap">
                      <Switch />
                      <Switch defaultChecked />
                      <Switch disabled />
                      <Switch defaultChecked disabled />
                    </Flex>
                  </div>
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-3">With Labels</Text>
                    <Flex direction="col" gap="md">
                      <Switch label="Enable notifications" />
                      <Switch label="Dark mode" defaultChecked />
                      <Switch label="Auto-save" labelPosition="left" />
                      <Switch label="Required setting" required />
                    </Flex>
                  </div>
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-3">Sizes</Text>
                    <Flex gap="lg" align="center" wrap="wrap">
                      <Switch size="xs" label="Extra Small" />
                      <Switch size="sm" label="Small" />
                      <Switch size="md" label="Medium" />
                      <Switch size="lg" label="Large" />
                      <Switch size="xl" label="Extra Large" />
                    </Flex>
                  </div>
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-3">Colors</Text>
                    <Flex direction="col" gap="md">
                      <Switch color="primary" label="Primary" defaultChecked />
                      <Switch color="secondary" label="Secondary" defaultChecked />
                      <Switch color="accent" label="Accent" defaultChecked />
                      <Switch color="success" label="Success" defaultChecked />
                      <Switch color="warning" label="Warning" defaultChecked />
                      <Switch color="error" label="Error" defaultChecked />
                      <Switch color="info" label="Info" defaultChecked />
                    </Flex>
                  </div>
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-3">Switch Group</Text>
                    <SwitchGroup label="Preferences" orientation="vertical">
                      <Switch label="Email notifications" />
                      <Switch label="SMS notifications" />
                      <Switch label="Push notifications" defaultChecked />
                    </SwitchGroup>
                  </div>
                </div>
              </div>

              {/* Divider Section (will be added) */}
              <div className="qwanyx-opacity-50">
                <Heading as="h3" className="qwanyx-mb-4">Divider (Coming Soon)</Heading>
                <Text color="muted" className="qwanyx-mb-6">
                  Status: <Badge color="warning" size="sm">In Development</Badge>
                </Text>
                <div className="qwanyx-p-8 qwanyx-border-2 qwanyx-border-dashed qwanyx-rounded-lg qwanyx-text-center">
                  <Text color="muted">Divider component will appear here once implemented</Text>
                </div>
              </div>

              {/* Tooltip Section (will be added) */}
              <div className="qwanyx-opacity-50">
                <Heading as="h3" className="qwanyx-mb-4">Tooltip (Coming Soon)</Heading>
                <Text color="muted" className="qwanyx-mb-6">
                  Status: <Badge color="warning" size="sm">In Development</Badge>
                </Text>
                <div className="qwanyx-p-8 qwanyx-border-2 qwanyx-border-dashed qwanyx-rounded-lg qwanyx-text-center">
                  <Text color="muted">Tooltip component will appear here once implemented</Text>
                </div>
              </div>

              {/* Progress Section */}
              <div>
                <Heading as="h3" className="qwanyx-mb-4">Progress</Heading>
                <Text color="muted" className="qwanyx-mb-6">
                  Status: <Badge color="success" size="sm">Ready</Badge> • 
                  Used in: Loading states, Forms, File uploads
                </Text>
                <div className="qwanyx-space-y-6">
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-3">Circular Progress (Clock Loader Icons)</Text>
                    <Flex gap="lg" wrap="wrap" align="center">
                      <div className="qwanyx-text-center">
                        <Progress type="circular" value={0} size="lg" />
                        <Text size="xs" className="qwanyx-mt-2">0%</Text>
                      </div>
                      <div className="qwanyx-text-center">
                        <Progress type="circular" value={20} size="lg" />
                        <Text size="xs" className="qwanyx-mt-2">20%</Text>
                      </div>
                      <div className="qwanyx-text-center">
                        <Progress type="circular" value={40} size="lg" />
                        <Text size="xs" className="qwanyx-mt-2">40%</Text>
                      </div>
                      <div className="qwanyx-text-center">
                        <Progress type="circular" value={60} size="lg" />
                        <Text size="xs" className="qwanyx-mt-2">60%</Text>
                      </div>
                      <div className="qwanyx-text-center">
                        <Progress type="circular" value={80} size="lg" />
                        <Text size="xs" className="qwanyx-mt-2">80%</Text>
                      </div>
                      <div className="qwanyx-text-center">
                        <Progress type="circular" value={100} size="lg" color="success" />
                        <Text size="xs" className="qwanyx-mt-2">100%</Text>
                      </div>
                    </Flex>
                  </div>
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-3">Bar Progress</Text>
                    <div className="qwanyx-space-y-3">
                      <Progress type="bar" value={25} showPercent />
                      <Progress type="bar" value={50} color="info" showPercent />
                      <Progress type="bar" value={75} color="warning" showPercent />
                      <Progress type="bar" value={100} color="success" showPercent />
                    </div>
                  </div>
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-3">Dots Progress</Text>
                    <div className="qwanyx-space-y-3">
                      <Progress type="dots" value={30} showPercent />
                      <Progress type="dots" value={60} color="info" showPercent />
                      <Progress type="dots" value={90} color="success" showPercent />
                    </div>
                  </div>
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-3">With Labels</Text>
                    <div className="qwanyx-space-y-3">
                      <ProgressWithLabel label="Upload Progress" value={65} type="bar" showPercent />
                      <ProgressWithLabel label="Processing" value={45} type="circular" showPercent labelPosition="left" />
                      <ProgressWithLabel label="Tasks Completed" value={70} type="dots" showPercent labelPosition="top" />
                    </div>
                  </div>
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-3">Sizes</Text>
                    <Flex gap="lg" align="center" wrap="wrap">
                      <Progress type="circular" value={50} size="xs" />
                      <Progress type="circular" value={50} size="sm" />
                      <Progress type="circular" value={50} size="md" />
                      <Progress type="circular" value={50} size="lg" />
                      <Progress type="circular" value={50} size="xl" />
                    </Flex>
                  </div>
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-3">Colors</Text>
                    <div className="qwanyx-space-y-3">
                      <Progress type="bar" value={40} color="primary" showPercent />
                      <Progress type="bar" value={50} color="secondary" showPercent />
                      <Progress type="bar" value={60} color="accent" showPercent />
                      <Progress type="bar" value={70} color="success" showPercent />
                      <Progress type="bar" value={80} color="warning" showPercent />
                      <Progress type="bar" value={90} color="error" showPercent />
                      <Progress type="bar" value={95} color="info" showPercent />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* All Atoms Overview Tab */}
          <TabsContent value="all">
            <div className="qwanyx-space-y-6">
              <div className="qwanyx-grid qwanyx-grid-cols-3 qwanyx-gap-4">
                <Card>
                  <CardContent>
                    <Heading as="h4" size="md">✅ Existing Atoms (8)</Heading>
                    <div className="qwanyx-mt-3 qwanyx-space-y-1">
                      <Text size="sm">• Button</Text>
                      <Text size="sm">• Input & Textarea</Text>
                      <Text size="sm">• Text & Typography</Text>
                      <Text size="sm">• Badge</Text>
                      <Text size="sm">• Avatar</Text>
                      <Text size="sm">• Icon</Text>
                      <Text size="sm">• Link</Text>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <Heading as="h4" size="md">🚧 In Development (5)</Heading>
                    <div className="qwanyx-mt-3 qwanyx-space-y-1">
                      <Text size="sm">• Spinner</Text>
                      <Text size="sm">• Switch</Text>
                      <Text size="sm">• Divider</Text>
                      <Text size="sm">• Tooltip</Text>
                      <Text size="sm">• Progress</Text>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <Heading as="h4" size="md">📊 Progress</Heading>
                    <div className="qwanyx-mt-3">
                      <Text size="lg" weight="bold">64%</Text>
                      <Text size="sm" color="muted">9 of 14 atoms completed</Text>
                      <div className="qwanyx-mt-2 qwanyx-h-2 qwanyx-bg-gray-200 qwanyx-rounded-full">
                        <div className="qwanyx-h-full qwanyx-bg-success qwanyx-rounded-full" style={{ width: '64%' }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="qwanyx-mt-8">
                <Heading as="h3" className="qwanyx-mb-4">Atom Development Guidelines</Heading>
                <div className="qwanyx-space-y-2">
                  <Text>✓ No dependencies on other components</Text>
                  <Text>✓ Single, focused responsibility</Text>
                  <Text>✓ Fully accessible (ARIA attributes)</Text>
                  <Text>✓ Theme-aware (uses CSS variables)</Text>
                  <Text>✓ TypeScript types exported</Text>
                  <Text>✓ Documented props</Text>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Section>
    </Container>
  );
};