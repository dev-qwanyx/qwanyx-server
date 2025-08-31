import React, { useState } from 'react';
import { 
  Container, 
  Card, 
  Text, 
  Button, 
  Badge,
  Flex,
  Input,
  Alert,
  Tabs,
  TabList,
  Tab,
  TabPanel
} from '@qwanyx/ui';
import { EmailVerificationStatus } from '../types';

interface EmailVerificationProps {
  userEmail: string;
  workspace?: string;
  onVerificationComplete?: (status: EmailVerificationStatus) => void;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({ 
  userEmail,
  workspace,
  onVerificationComplete
}) => {
  const [verificationStatus, setVerificationStatus] = useState<'none' | 'pending' | 'verified'>('none');
  const [checking, setChecking] = useState(false);
  const [activeTab, setActiveTab] = useState<'send' | 'receive'>('send');
  
  // Email receiving config
  const [forwardingAddress, setForwardingAddress] = useState('');
  const [imapConfig, setImapConfig] = useState({
    host: '',
    port: '993',
    username: '',
    password: '',
    secure: true
  });

  const handleSendVerification = async () => {
    setVerificationStatus('pending');
    // TODO: Call API to send verification email
    console.log('Sending verification to:', userEmail);
  };

  const handleCheckStatus = async () => {
    setChecking(true);
    try {
      // TODO: Call API to check verification status
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // For demo, randomly succeed
      if (Math.random() > 0.3) {
        setVerificationStatus('verified');
        if (onVerificationComplete) {
          onVerificationComplete({
            email: userEmail,
            verified: true,
            verifiedAt: new Date(),
            canSend: true,
            canReceive: false
          });
        }
      }
    } finally {
      setChecking(false);
    }
  };

  const generateForwardingAddress = () => {
    const uniqueId = Math.random().toString(36).substring(7);
    setForwardingAddress(`${uniqueId}-gtd@receive.qwanyx.com`);
  };

  const testIMAPConnection = async () => {
    // TODO: Test IMAP connection
    console.log('Testing IMAP:', imapConfig);
  };

  return (
    <Container>
      <Card padding="lg">
        <Text variant="h2" marginBottom="md">Email Integration Setup</Text>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'send' | 'receive')}>
          <TabList>
            <Tab value="send">Send Emails</Tab>
            <Tab value="receive">Receive Emails</Tab>
          </TabList>
          
          <TabPanel value="send">
            <Container padding="md">
              <Text variant="h3" marginBottom="md">Verify Your Email for Sending</Text>
              
              <Card variant="ghost" padding="md" marginBottom="md">
                <Flex justify="between" align="center">
                  <div>
                    <Text variant="label">Email Address</Text>
                    <Text variant="large">{userEmail}</Text>
                  </div>
                  <Badge 
                    variant={
                      verificationStatus === 'verified' ? 'success' : 
                      verificationStatus === 'pending' ? 'warning' : 
                      'ghost'
                    }
                  >
                    {verificationStatus === 'verified' ? '✓ Verified' :
                     verificationStatus === 'pending' ? '⏳ Pending' :
                     '✗ Not Verified'}
                  </Badge>
                </Flex>
              </Card>

              {verificationStatus === 'none' && (
                <>
                  <Alert variant="info" marginBottom="md">
                    <Text variant="small">
                      We need to verify your email address with AWS to enable sending emails from GTD.
                      You'll receive a verification email from Amazon Web Services.
                    </Text>
                  </Alert>
                  
                  <Button variant="primary" onClick={handleSendVerification}>
                    Send Verification Email
                  </Button>
                </>
              )}

              {verificationStatus === 'pending' && (
                <>
                  <Alert variant="warning" marginBottom="md">
                    <Text variant="small">
                      <strong>Check your inbox!</strong> Click the verification link in the email from AWS.
                      After clicking the link, come back here and check your verification status.
                    </Text>
                  </Alert>
                  
                  <Card variant="ghost" padding="md" marginBottom="md">
                    <Text variant="h4" marginBottom="sm">Instructions:</Text>
                    <ol style={{ margin: '0 0 0 20px' }}>
                      <li>Check your email inbox (and spam folder)</li>
                      <li>Look for an email from "Amazon Web Services"</li>
                      <li>Click the verification link in that email</li>
                      <li>Return here and click "Check Status"</li>
                    </ol>
                  </Card>
                  
                  <Flex gap="sm">
                    <Button 
                      variant="primary" 
                      onClick={handleCheckStatus}
                      disabled={checking}
                    >
                      {checking ? 'Checking...' : 'Check Verification Status'}
                    </Button>
                    <Button 
                      variant="ghost"
                      onClick={handleSendVerification}
                    >
                      Resend Email
                    </Button>
                  </Flex>
                </>
              )}

              {verificationStatus === 'verified' && (
                <>
                  <Alert variant="success" marginBottom="md">
                    <Text>
                      <strong>Email verified!</strong> You can now send emails from GTD.
                    </Text>
                  </Alert>
                  
                  <Card variant="ghost" padding="md">
                    <Text variant="h4" marginBottom="sm">You can now:</Text>
                    <ul style={{ margin: '0 0 0 20px' }}>
                      <li>Send task delegations via email</li>
                      <li>Send project status updates</li>
                      <li>Reply to emails directly from GTD</li>
                      <li>Forward items to team members</li>
                    </ul>
                  </Card>
                </>
              )}
            </Container>
          </TabPanel>
          
          <TabPanel value="receive">
            <Container padding="md">
              <Text variant="h3" marginBottom="md">Configure Email Receiving</Text>
              
              <Card marginBottom="md">
                <Text variant="h4" marginBottom="sm">Option 1: Email Forwarding (Recommended)</Text>
                <Text variant="muted" marginBottom="md">
                  Forward emails from your inbox to a unique GTD address
                </Text>
                
                {!forwardingAddress ? (
                  <Button variant="primary" onClick={generateForwardingAddress}>
                    Generate Forwarding Address
                  </Button>
                ) : (
                  <>
                    <Card variant="ghost" padding="md" marginBottom="md">
                      <Text variant="label">Your GTD Forwarding Address:</Text>
                      <Flex align="center" gap="sm">
                        <Text variant="code" style={{ userSelect: 'all' }}>
                          {forwardingAddress}
                        </Text>
                        <Button variant="ghost" size="sm">
                          Copy
                        </Button>
                      </Flex>
                    </Card>
                    
                    <Alert variant="info">
                      <Text variant="small">
                        <strong>Setup Instructions:</strong>
                      </Text>
                      <ol style={{ margin: '8px 0 0 20px', fontSize: '14px' }}>
                        <li>Go to your email provider (Gmail, Outlook, etc.)</li>
                        <li>Find the forwarding settings</li>
                        <li>Add a forwarding rule to: {forwardingAddress}</li>
                        <li>Optional: Create filters for specific senders or subjects</li>
                      </ol>
                    </Alert>
                  </>
                )}
              </Card>
              
              <Card>
                <Text variant="h4" marginBottom="sm">Option 2: IMAP Connection</Text>
                <Text variant="muted" marginBottom="md">
                  Connect directly to your email account
                </Text>
                
                <Grid columns={2} gap="md">
                  <div>
                    <Text variant="label" marginBottom="xs">IMAP Server</Text>
                    <Input
                      value={imapConfig.host}
                      onChange={(e) => setImapConfig({...imapConfig, host: e.target.value})}
                      placeholder="imap.gmail.com"
                    />
                  </div>
                  
                  <div>
                    <Text variant="label" marginBottom="xs">Port</Text>
                    <Input
                      type="number"
                      value={imapConfig.port}
                      onChange={(e) => setImapConfig({...imapConfig, port: e.target.value})}
                      placeholder="993"
                    />
                  </div>
                  
                  <div>
                    <Text variant="label" marginBottom="xs">Username</Text>
                    <Input
                      type="email"
                      value={imapConfig.username}
                      onChange={(e) => setImapConfig({...imapConfig, username: e.target.value})}
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <Text variant="label" marginBottom="xs">Password</Text>
                    <Input
                      type="password"
                      value={imapConfig.password}
                      onChange={(e) => setImapConfig({...imapConfig, password: e.target.value})}
                      placeholder="••••••••"
                    />
                  </div>
                </Grid>
                
                <Flex align="center" gap="sm" marginTop="md">
                  <input
                    type="checkbox"
                    checked={imapConfig.secure}
                    onChange={(e) => setImapConfig({...imapConfig, secure: e.target.checked})}
                  />
                  <Text variant="small">Use SSL/TLS</Text>
                </Flex>
                
                <Button 
                  variant="primary" 
                  marginTop="md"
                  onClick={testIMAPConnection}
                  disabled={!imapConfig.host || !imapConfig.username || !imapConfig.password}
                >
                  Test & Save IMAP Settings
                </Button>
              </Card>
            </Container>
          </TabPanel>
        </Tabs>
      </Card>
    </Container>
  );
};

// Helper Grid component
const Grid: React.FC<{ columns: number; gap: string; children: React.ReactNode }> = ({ 
  columns, 
  gap, 
  children 
}) => {
  const gapSizes = { sm: '8px', md: '16px', lg: '24px' };
  const gapValue = gapSizes[gap as keyof typeof gapSizes] || gap;
  
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: gapValue 
    }}>
      {children}
    </div>
  );
};