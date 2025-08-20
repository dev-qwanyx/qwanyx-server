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
  // Modal components
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  SimpleModal,
  // OTP components
  OTPInput,
  OTPTimer,
  // Alert component
  Alert,
  // Divider,
  Tooltip,
} from '../../src';

export const AtomsShowcase: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [_switchValue, _setSwitchValue] = useState(false);
  const [showBasicModal, setShowBasicModal] = useState(false);
  const [showSimpleModal, setShowSimpleModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpValueFilled, setOtpValueFilled] = useState('123456');
  const [otpValuePartial, setOtpValuePartial] = useState('123');
  const [otpValueError, setOtpValueError] = useState('');

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

              {/* Modal Atom */}
              <div>
                <Heading as="h3" className="qwanyx-mb-4">Modal</Heading>
                <Text color="muted" className="qwanyx-mb-6">
                  Status: <Badge color="success" size="sm">Stable</Badge> • 
                  Used in: Dialogs, Forms, Confirmations, Authentication
                </Text>
                
                <div className="qwanyx-space-y-4">
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-2">Types</Text>
                    <Flex gap="sm" wrap="wrap">
                      <Button onClick={() => setShowBasicModal(true)}>
                        Basic Modal
                      </Button>
                      <Button variant="outline" onClick={() => setShowSimpleModal(true)}>
                        Simple Modal
                      </Button>
                      <Button variant="ghost" onClick={() => setShowAuthModal(true)}>
                        Auth-like Modal
                      </Button>
                    </Flex>
                  </div>

                  <div>
                    <Text weight="semibold" className="qwanyx-mb-2">Features</Text>
                    <Grid cols={2} gap="sm">
                      <Card>
                        <CardContent>
                          <Text size="sm" weight="semibold">✅ Portal Rendering</Text>
                          <Text size="xs" color="muted">Renders outside DOM hierarchy</Text>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent>
                          <Text size="sm" weight="semibold">✅ Focus Management</Text>
                          <Text size="xs" color="muted">Traps focus within modal</Text>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent>
                          <Text size="sm" weight="semibold">✅ Keyboard Support</Text>
                          <Text size="xs" color="muted">ESC to close, Tab navigation</Text>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent>
                          <Text size="sm" weight="semibold">✅ Responsive</Text>
                          <Text size="xs" color="muted">Adapts to screen size</Text>
                        </CardContent>
                      </Card>
                    </Grid>
                  </div>
                </div>

                {/* Basic Modal */}
                <Modal
                  isOpen={showBasicModal}
                  onClose={() => setShowBasicModal(false)}
                  size="md"
                >
                  <ModalHeader>
                    <ModalTitle>Basic Modal</ModalTitle>
                    <ModalDescription>
                      This is a basic modal with all standard components
                    </ModalDescription>
                  </ModalHeader>
                  <ModalBody>
                    <Text>
                      Modal content goes here. You can put any content inside the modal body.
                      This modal demonstrates the basic structure with header, body, and footer.
                    </Text>
                  </ModalBody>
                  <ModalFooter>
                    <Button variant="ghost" onClick={() => setShowBasicModal(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setShowBasicModal(false)}>
                      Confirm
                    </Button>
                  </ModalFooter>
                </Modal>

                {/* Simple Modal */}
                <SimpleModal
                  isOpen={showSimpleModal}
                  onClose={() => setShowSimpleModal(false)}
                  title="Simple Modal"
                  description="Quick modal setup with SimpleModal component"
                  footer={
                    <>
                      <Button variant="ghost" onClick={() => setShowSimpleModal(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setShowSimpleModal(false)}>
                        OK
                      </Button>
                    </>
                  }
                >
                  <Text>
                    SimpleModal is a convenience component that wraps the Modal components
                    for common use cases. Perfect for quick confirmations and simple dialogs.
                  </Text>
                </SimpleModal>

                {/* Auth-like Modal */}
                <Modal
                  isOpen={showAuthModal}
                  onClose={() => setShowAuthModal(false)}
                  size="md"
                >
                  <div style={{ padding: '2rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                      <Heading as="h2" size="2xl">Welcome Back</Heading>
                      <Text color="muted" style={{ marginTop: '0.5rem' }}>
                        Sign in to your account
                      </Text>
                    </div>
                    
                    <form onSubmit={(e) => { e.preventDefault(); setShowAuthModal(false); }}>
                      <Input
                        type="email"
                        placeholder="Email"
                        fullWidth
                        style={{ marginBottom: '1rem' }}
                        required
                      />
                      <Input
                        type="password"
                        placeholder="Password"
                        fullWidth
                        style={{ marginBottom: '1.5rem' }}
                        required
                      />
                      <Button type="submit" fullWidth variant="primary">
                        Sign In
                      </Button>
                    </form>
                    
                    <div style={{
                      marginTop: '1.5rem',
                      textAlign: 'center',
                      paddingTop: '1rem',
                      borderTop: '1px solid rgb(var(--border))'
                    }}>
                      <Text size="sm" color="muted">
                        Don't have an account?
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {}}
                          style={{ marginLeft: '0.5rem' }}
                        >
                          Sign up
                        </Button>
                      </Text>
                    </div>
                  </div>
                </Modal>
              </div>

              {/* OTP Input Atom */}
              <div>
                <Heading as="h3" className="qwanyx-mb-4">OTP Input</Heading>
                <Text color="muted" className="qwanyx-mb-6">
                  Status: <Badge color="success" size="sm">Stable</Badge> • 
                  Used in: Authentication, Verification, Two-factor auth
                </Text>
                
                <div className="qwanyx-space-y-6">
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-4">Different States</Text>
                    
                    <div className="qwanyx-space-y-8">
                      {/* Empty State */}
                      <Card>
                        <CardContent>
                          <Text size="sm" weight="semibold" className="qwanyx-mb-3">Empty (Default)</Text>
                          <OTPInput
                            value={otpValue}
                            onChange={setOtpValue}
                            onComplete={(code) => {
                              console.log('OTP Complete:', code);
                            }}
                          />
                          <Text size="xs" color="muted" className="qwanyx-mt-2">
                            Current value: {otpValue || '(empty)'}
                          </Text>
                        </CardContent>
                      </Card>

                      {/* Partially Filled */}
                      <Card>
                        <CardContent>
                          <Text size="sm" weight="semibold" className="qwanyx-mb-3">Partially Filled</Text>
                          <OTPInput
                            value={otpValuePartial}
                            onChange={setOtpValuePartial}
                            onComplete={(code) => {
                              console.log('OTP Complete:', code);
                            }}
                          />
                          <Text size="xs" color="muted" className="qwanyx-mt-2">
                            Current value: {otpValuePartial}
                          </Text>
                        </CardContent>
                      </Card>

                      {/* Fully Filled */}
                      <Card>
                        <CardContent>
                          <Text size="sm" weight="semibold" className="qwanyx-mb-3">Fully Filled (Success)</Text>
                          <OTPInput
                            value={otpValueFilled}
                            onChange={setOtpValueFilled}
                            onComplete={(code) => {
                              console.log('OTP Complete:', code);
                            }}
                          />
                          <Text size="xs" color="muted" className="qwanyx-mt-2">
                            Current value: {otpValueFilled}
                          </Text>
                        </CardContent>
                      </Card>

                      {/* Error State */}
                      <Card>
                        <CardContent>
                          <Text size="sm" weight="semibold" className="qwanyx-mb-3">Error State</Text>
                          <OTPInput
                            value={otpValueError}
                            onChange={setOtpValueError}
                            error={true}
                            onComplete={(code) => {
                              console.log('OTP Complete:', code);
                            }}
                          />
                          <Text size="xs" color="error" className="qwanyx-mt-2">
                            Invalid code. Please try again.
                          </Text>
                        </CardContent>
                      </Card>

                      {/* Disabled State */}
                      <Card>
                        <CardContent>
                          <Text size="sm" weight="semibold" className="qwanyx-mb-3">Disabled</Text>
                          <OTPInput
                            value="123"
                            onChange={() => {}}
                            disabled={true}
                          />
                          <Text size="xs" color="muted" className="qwanyx-mt-2">
                            Input is disabled
                          </Text>
                        </CardContent>
                      </Card>

                      {/* With Timer */}
                      <Card>
                        <CardContent>
                          <Text size="sm" weight="semibold" className="qwanyx-mb-3">With Timer</Text>
                          <OTPInput
                            value=""
                            onChange={() => {}}
                            onComplete={(code) => {
                              console.log('OTP Complete:', code);
                            }}
                          />
                          <div className="qwanyx-mt-4">
                            <OTPTimer
                              duration={120}
                              onExpire={() => console.log('Code expired')}
                              onResend={() => console.log('Resend code')}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Different Lengths */}
                      <Card>
                        <CardContent>
                          <Text size="sm" weight="semibold" className="qwanyx-mb-3">4-Digit Code</Text>
                          <OTPInput
                            length={4}
                            value=""
                            onChange={() => {}}
                            onComplete={(code) => {
                              console.log('OTP Complete:', code);
                            }}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <Text weight="semibold" className="qwanyx-mb-3">Features</Text>
                    <Grid cols={2} gap="sm">
                      <Card>
                        <CardContent>
                          <Text size="sm" weight="semibold">✅ Auto-focus</Text>
                          <Text size="xs" color="muted">Automatically focuses next input</Text>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent>
                          <Text size="sm" weight="semibold">✅ Paste Support</Text>
                          <Text size="xs" color="muted">Paste full code at once</Text>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent>
                          <Text size="sm" weight="semibold">✅ Keyboard Navigation</Text>
                          <Text size="xs" color="muted">Arrow keys, backspace support</Text>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent>
                          <Text size="sm" weight="semibold">✅ Visual Feedback</Text>
                          <Text size="xs" color="muted">Success, error, filled states</Text>
                        </CardContent>
                      </Card>
                    </Grid>
                  </div>
                </div>
              </div>

              {/* Alert Atom */}
              <div>
                <Heading as="h3" className="qwanyx-mb-4">Alert</Heading>
                <Text color="muted" className="qwanyx-mb-6">
                  Status: <Badge color="success" size="sm">Stable</Badge> • 
                  Used in: Forms, Notifications, Feedback messages
                </Text>
                
                <div className="qwanyx-space-y-4">
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-4">Alert Variants</Text>
                    
                    {/* Info Alert */}
                    <div className="qwanyx-mb-4">
                      <Alert variant="info" title="Information">
                        This is an informational alert. Use it to provide helpful information to users.
                      </Alert>
                    </div>

                    {/* Success Alert */}
                    <div className="qwanyx-mb-4">
                      <Alert variant="success" title="Success!">
                        Your operation completed successfully. Everything went as expected.
                      </Alert>
                    </div>

                    {/* Warning Alert */}
                    <div className="qwanyx-mb-4">
                      <Alert variant="warning" title="Warning">
                        Please be careful. This action may have unintended consequences.
                      </Alert>
                    </div>

                    {/* Error Alert */}
                    <div className="qwanyx-mb-4">
                      <Alert variant="error" title="Error">
                        Something went wrong. Please try again or contact support.
                      </Alert>
                    </div>
                  </div>

                  <div>
                    <Text weight="semibold" className="qwanyx-mb-4">Without Title</Text>
                    
                    <div className="qwanyx-space-y-4">
                      <Alert variant="info">
                        Simple info message without a title.
                      </Alert>
                      
                      <Alert variant="success">
                        Operation completed successfully!
                      </Alert>
                      
                      <Alert variant="warning">
                        Please review your settings.
                      </Alert>
                      
                      <Alert variant="error">
                        Invalid input provided.
                      </Alert>
                    </div>
                  </div>

                  <div>
                    <Text weight="semibold" className="qwanyx-mb-4">Dismissible Alerts</Text>
                    
                    <div className="qwanyx-space-y-4">
                      <Alert 
                        variant="info" 
                        title="Dismissible Alert"
                        dismissible
                        onDismiss={() => console.log('Alert dismissed')}
                      >
                        This alert can be dismissed by clicking the X button.
                      </Alert>
                      
                      <Alert 
                        variant="success" 
                        dismissible
                        onDismiss={() => console.log('Success alert dismissed')}
                      >
                        Success message that can be closed.
                      </Alert>
                    </div>
                  </div>

                  <div>
                    <Text weight="semibold" className="qwanyx-mb-4">Real-world Examples</Text>
                    
                    <div className="qwanyx-space-y-4">
                      <Alert variant="success">
                        ✅ Your profile has been updated successfully.
                      </Alert>
                      
                      <Alert variant="error" title="Login Failed">
                        Invalid email or password. Please try again.
                      </Alert>
                      
                      <Alert variant="warning" title="Subscription Expiring">
                        Your subscription will expire in 3 days. Please renew to continue using all features.
                      </Alert>
                      
                      <Alert variant="info" title="New Feature">
                        🎉 We've added dark mode support! Check it out in your settings.
                      </Alert>
                    </div>
                  </div>
                </div>
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
                      <Switch size="xs" label="Extra Small" defaultChecked />
                      <Switch size="sm" label="Small" defaultChecked />
                      <Switch size="md" label="Medium" defaultChecked />
                      <Switch size="lg" label="Large" defaultChecked />
                      <Switch size="xl" label="Extra Large" defaultChecked />
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

              {/* Tooltip Section */}
              <div>
                <Heading as="h3" className="qwanyx-mb-4">Tooltip</Heading>
                <Text color="muted" className="qwanyx-mb-6">
                  Status: <Badge color="success" size="sm">Ready</Badge> • 
                  Used in: Help text, Hints, Information overlays
                </Text>
                <div className="qwanyx-space-y-6">
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-4">Positions</Text>
                    <Flex gap="xl" wrap="wrap" align="center" justify="center">
                      <Tooltip content="This is a top tooltip" position="top">
                        <Button variant="outline">Hover Top</Button>
                      </Tooltip>
                      <Tooltip content="This is a bottom tooltip" position="bottom">
                        <Button variant="outline">Hover Bottom</Button>
                      </Tooltip>
                      <Tooltip content="This is a left tooltip" position="left">
                        <Button variant="outline">Hover Left</Button>
                      </Tooltip>
                      <Tooltip content="This is a right tooltip" position="right">
                        <Button variant="outline">Hover Right</Button>
                      </Tooltip>
                    </Flex>
                  </div>

                  <div>
                    <Text weight="semibold" className="qwanyx-mb-4">With Icons</Text>
                    <Flex gap="xl" wrap="wrap" align="center" justify="center">
                      <Tooltip content="Information tooltip" icon="Info">
                        <Button variant="ghost">ℹ️ Info</Button>
                      </Tooltip>
                      <Tooltip content="Warning message" icon="AlertTriangle" position="bottom">
                        <Button variant="ghost" color="warning">⚠️ Warning</Button>
                      </Tooltip>
                      <Tooltip content="Success! Operation completed" icon="Check" position="right">
                        <Button variant="ghost" color="success">✅ Success</Button>
                      </Tooltip>
                      <Tooltip content="Help is available here" icon="HelpCircle" position="left">
                        <Button variant="ghost">❓ Help</Button>
                      </Tooltip>
                    </Flex>
                  </div>

                  <div>
                    <Text weight="semibold" className="qwanyx-mb-4">Different Triggers</Text>
                    <Flex gap="xl" wrap="wrap" align="center">
                      <Tooltip content="Quick hover (200ms delay)" delay={200}>
                        <Badge color="primary" size="lg">Default Delay</Badge>
                      </Tooltip>
                      <Tooltip content="Instant tooltip (0ms delay)" delay={0}>
                        <Badge color="info" size="lg">Instant</Badge>
                      </Tooltip>
                      <Tooltip content="Slow tooltip (500ms delay)" delay={500}>
                        <Badge color="secondary" size="lg">Slow Delay</Badge>
                      </Tooltip>
                    </Flex>
                  </div>

                  <div>
                    <Text weight="semibold" className="qwanyx-mb-4">Real-world Examples</Text>
                    <div className="qwanyx-space-y-4">
                      <Flex gap="md" wrap="wrap" align="center">
                        <Tooltip content="Edit this item">
                          <Button variant="ghost" size="sm">
                            <Icon name="Edit" size="sm" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Delete this item" position="bottom">
                          <Button variant="ghost" size="sm" color="error">
                            <Icon name="Trash" size="sm" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Share with others">
                          <Button variant="ghost" size="sm">
                            <Icon name="Share2" size="sm" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Download file">
                          <Button variant="ghost" size="sm">
                            <Icon name="Download" size="sm" />
                          </Button>
                        </Tooltip>
                      </Flex>

                      <Card>
                        <CardContent>
                          <Flex justify="between" align="center">
                            <Text>Settings Option</Text>
                            <Tooltip content="This setting controls the visibility of your profile to other users">
                              <Icon name="HelpCircle" size="sm" color="muted" />
                            </Tooltip>
                          </Flex>
                        </CardContent>
                      </Card>

                      <div>
                        <Text size="sm" className="qwanyx-mb-2">Form Field with Help</Text>
                        <Flex gap="sm" align="center">
                          <Input placeholder="Enter your API key" />
                          <Tooltip content="You can find your API key in the settings page under 'Developer Options'" position="left">
                            <Icon name="Info" size="sm" color="info" />
                          </Tooltip>
                        </Flex>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Text weight="semibold" className="qwanyx-mb-4">Complex Content</Text>
                    <Flex gap="xl" wrap="wrap">
                      <Tooltip content="Click to view more details about this user" position="top">
                        <Avatar size="lg" src="https://i.pravatar.cc/150?img=8" />
                      </Tooltip>
                      <Tooltip content="Premium feature - Upgrade to access" position="bottom" icon="Lock">
                        <Button disabled>Premium Feature 🔒</Button>
                      </Tooltip>
                      <Tooltip content="Keyboard shortcut: Ctrl+S" position="right">
                        <Button variant="outline">
                          <Icon name="Save" size="sm" /> Save
                        </Button>
                      </Tooltip>
                    </Flex>
                  </div>

                  <div>
                    <Text weight="semibold" className="qwanyx-mb-4">Features</Text>
                    <Grid cols={2} gap="sm">
                      <Card>
                        <CardContent>
                          <Text size="sm" weight="semibold">✅ Smart Positioning</Text>
                          <Text size="xs" color="muted">Auto-adjusts near edges</Text>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent>
                          <Text size="sm" weight="semibold">✅ Customizable Delay</Text>
                          <Text size="xs" color="muted">Control when tooltip appears</Text>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent>
                          <Text size="sm" weight="semibold">✅ Icon Support</Text>
                          <Text size="xs" color="muted">Add icons for context</Text>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent>
                          <Text size="sm" weight="semibold">✅ Accessible</Text>
                          <Text size="xs" color="muted">ARIA compliant</Text>
                        </CardContent>
                      </Card>
                    </Grid>
                  </div>
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
                      <Text size="sm">• Spinner ✅</Text>
                      <Text size="sm">• Switch ✅</Text>
                      <Text size="sm">• Divider</Text>
                      <Text size="sm">• Tooltip ✅</Text>
                      <Text size="sm">• Progress ✅</Text>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <Heading as="h4" size="md">📊 Progress</Heading>
                    <div className="qwanyx-mt-3">
                      <Text size="lg" weight="bold">93%</Text>
                      <Text size="sm" color="muted">13 of 14 atoms completed</Text>
                      <div className="qwanyx-mt-2 qwanyx-h-2 qwanyx-bg-gray-200 qwanyx-rounded-full">
                        <div className="qwanyx-h-full qwanyx-bg-success qwanyx-rounded-full" style={{ width: '93%' }} />
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