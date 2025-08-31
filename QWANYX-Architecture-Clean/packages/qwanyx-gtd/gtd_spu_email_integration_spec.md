# GTD SPU Email Integration - AWS SES Verification

## Overview
Integration between GTD, SPU-Core email capabilities, and AWS SES for verified email sending.

## Current SPU Email Capability
```rust
// Current SPU implementation (hardcoded email)
pub async fn send_email(&self, to: &str, subject: &str, body: &str) -> Result<()> {
    // Currently uses hardcoded sender
    let from = "noreply@qwanyx.com"; // HARDCODED
    
    // Send via AWS SES
    self.ses_client.send_email(from, to, subject, body).await
}
```

## Email Verification Architecture

### 1. User Email Verification in AWS SES
```typescript
interface UserEmailVerification {
  workspace: string;
  userEmail: string;
  
  sesVerification: {
    status: 'pending' | 'verified' | 'failed' | 'temporary_failure';
    verifiedAt?: Date;
    verificationToken?: string;
    sandboxMode: boolean;  // SES sandbox limitations
  };
  
  capabilities: {
    canSend: boolean;
    canReceive: boolean;
    dailyLimit?: number;
    sentToday?: number;
  };
}

class SESEmailVerification {
  private sesClient: AWS.SES;
  private spuCore: SPUCoreClient;
  
  async verifyUserEmail(
    userEmail: string,
    workspace: string
  ): Promise<VerificationResult> {
    // Step 1: Check if email is already verified in SES
    const identities = await this.sesClient.listVerifiedEmailAddresses().promise();
    
    if (identities.VerifiedEmailAddresses?.includes(userEmail)) {
      return {
        status: 'already_verified',
        canSend: true
      };
    }
    
    // Step 2: Send verification request to SES
    await this.sesClient.verifyEmailIdentity({
      EmailAddress: userEmail
    }).promise();
    
    // Step 3: Store verification status
    await this.storeVerificationStatus(userEmail, workspace, 'pending');
    
    // Step 4: Return verification instructions
    return {
      status: 'verification_sent',
      message: 'Please check your email and click the verification link from AWS',
      canSend: false
    };
  }
  
  async checkVerificationStatus(userEmail: string): Promise<boolean> {
    const result = await this.sesClient.getIdentityVerificationAttributes({
      Identities: [userEmail]
    }).promise();
    
    const status = result.VerificationAttributes?.[userEmail];
    return status?.VerificationStatus === 'Success';
  }
  
  async enableSPUEmailForUser(
    userEmail: string,
    workspace: string
  ): Promise<void> {
    // Once verified, update SPU configuration
    await this.spuCore.updateEmailConfig({
      workspace,
      userEmail,
      verified: true,
      // SPU can now use this email as sender
      allowedSender: userEmail
    });
  }
}
```

### 2. SPU Email Integration
```typescript
interface SPUEmailRequest {
  from: string;           // User's verified email
  to: string;            // Recipient
  subject: string;
  body: string;
  workspace: string;
  
  // Optional GTD context
  gtdContext?: {
    taskId?: string;
    projectId?: string;
    action?: 'delegate' | 'followup' | 'report';
  };
}

class GTDSPUEmailService {
  private spu: SPUCoreClient;
  private ses: SESEmailVerification;
  
  async sendEmail(
    request: SPUEmailRequest,
    userMemory: GTDUserMemory
  ): Promise<EmailResult> {
    // Step 1: Verify sender is verified in SES
    const isVerified = await this.ses.checkVerificationStatus(request.from);
    
    if (!isVerified) {
      throw new Error(`Email ${request.from} is not verified in AWS SES`);
    }
    
    // Step 2: Call SPU with verified email
    const result = await this.spu.sendEmailWithSender({
      from: request.from,  // No longer hardcoded!
      to: request.to,
      subject: request.subject,
      body: request.body,
      
      // Include GTD context for SPU processing
      metadata: {
        workspace: request.workspace,
        gtdContext: request.gtdContext,
        userMemory: userMemory.memorySpace
      }
    });
    
    // Step 3: Store in user's email history
    await this.storeEmailHistory(userMemory, {
      type: 'sent',
      email: request,
      result,
      timestamp: new Date()
    });
    
    return result;
  }
  
  async sendTaskDelegation(
    task: GTDItem,
    delegateTo: string,
    userEmail: string,
    userMemory: GTDUserMemory
  ): Promise<void> {
    // Generate delegation email with SPU
    const emailContent = await this.spu.generateEmail({
      type: 'task_delegation',
      task,
      recipient: delegateTo,
      sender: userEmail,
      memoryContext: userMemory
    });
    
    // Send using verified email
    await this.sendEmail({
      from: userEmail,
      to: delegateTo,
      subject: emailContent.subject,
      body: emailContent.body,
      workspace: userMemory.workspace,
      gtdContext: {
        taskId: task.id,
        action: 'delegate'
      }
    }, userMemory);
  }
}
```

## React UI Components

### Email Verification Form
```typescript
export const EmailVerificationForm: React.FC = () => {
  const { user, workspace } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState<'none' | 'pending' | 'verified'>('none');
  const [checking, setChecking] = useState(false);
  const { verifyEmail, checkStatus } = useSESVerification();
  
  const handleVerifyEmail = async () => {
    try {
      const result = await verifyEmail(user.email, workspace);
      
      if (result.status === 'already_verified') {
        setVerificationStatus('verified');
        toast.success('Email already verified!');
      } else {
        setVerificationStatus('pending');
        toast.info('Verification email sent. Please check your inbox.');
      }
    } catch (error) {
      toast.error(`Verification failed: ${error.message}`);
    }
  };
  
  const handleCheckStatus = async () => {
    setChecking(true);
    try {
      const isVerified = await checkStatus(user.email);
      
      if (isVerified) {
        setVerificationStatus('verified');
        toast.success('Email verified successfully!');
        
        // Enable SPU email for user
        await enableSPUEmail(user.email, workspace);
      } else {
        toast.info('Email not yet verified. Please check your inbox.');
      }
    } finally {
      setChecking(false);
    }
  };
  
  return (
    <Container>
      <Title>Email Verification for GTD</Title>
      
      <EmailDisplay>
        <Label>Your Email:</Label>
        <Email>{user.email}</Email>
        
        <StatusBadge status={verificationStatus}>
          {verificationStatus === 'verified' ? '✓ Verified' : 
           verificationStatus === 'pending' ? '⏳ Pending' : 
           '✗ Not Verified'}
        </StatusBadge>
      </EmailDisplay>
      
      {verificationStatus !== 'verified' && (
        <>
          <VerifyButton onClick={handleVerifyEmail}>
            Send Verification Email
          </VerifyButton>
          
          {verificationStatus === 'pending' && (
            <CheckButton onClick={handleCheckStatus} disabled={checking}>
              {checking ? 'Checking...' : 'Check Verification Status'}
            </CheckButton>
          )}
          
          <Instructions>
            <p>After clicking "Send Verification Email":</p>
            <ol>
              <li>Check your email inbox</li>
              <li>Click the verification link from AWS</li>
              <li>Return here and click "Check Verification Status"</li>
            </ol>
          </Instructions>
        </>
      )}
      
      {verificationStatus === 'verified' && (
        <SuccessMessage>
          Your email is verified! You can now:
          <ul>
            <li>Send task delegations</li>
            <li>Send project updates</li>
            <li>Reply to emails from GTD</li>
          </ul>
        </SuccessMessage>
      )}
    </Container>
  );
};
```

### Email Receiving Configuration Form
```typescript
export const EmailReceivingForm: React.FC = () => {
  const [config, setConfig] = useState<EmailReceiveConfig>({
    method: 'forward',
    forwardingAddress: '',
    imapConfig: null
  });
  
  const handleConfigureForwarding = () => {
    // Generate unique forwarding address
    const forwardAddress = `${user.id}-gtd@receive.qwanyx.com`;
    
    setConfig({
      method: 'forward',
      forwardingAddress: forwardAddress
    });
    
    // Show instructions
    toast.info(`Configure your email to forward to: ${forwardAddress}`);
  };
  
  const handleConfigureIMAP = async (imapSettings: IMAPSettings) => {
    // Test IMAP connection
    const testResult = await testIMAPConnection(imapSettings);
    
    if (testResult.success) {
      setConfig({
        method: 'imap',
        imapConfig: imapSettings
      });
      
      toast.success('IMAP configured successfully!');
    } else {
      toast.error(`IMAP test failed: ${testResult.error}`);
    }
  };
  
  return (
    <Container>
      <Title>Configure Email Receiving</Title>
      
      <Tabs>
        <Tab active={config.method === 'forward'}>
          <TabTitle>Email Forwarding (Recommended)</TabTitle>
          <TabContent>
            <p>Forward emails to your GTD inbox:</p>
            <ForwardingAddress>{config.forwardingAddress || 'Not configured'}</ForwardingAddress>
            
            <GenerateButton onClick={handleConfigureForwarding}>
              Generate Forwarding Address
            </GenerateButton>
            
            {config.forwardingAddress && (
              <Instructions>
                <h4>Setup Instructions:</h4>
                <ol>
                  <li>Go to your email provider settings</li>
                  <li>Add a forwarding rule</li>
                  <li>Forward to: {config.forwardingAddress}</li>
                  <li>Optional: Create filters for specific senders</li>
                </ol>
              </Instructions>
            )}
          </TabContent>
        </Tab>
        
        <Tab active={config.method === 'imap'}>
          <TabTitle>IMAP Connection</TabTitle>
          <TabContent>
            <IMAPForm onSubmit={handleConfigureIMAP}>
              <FormField
                label="IMAP Server"
                name="host"
                placeholder="imap.gmail.com"
                required
              />
              <FormField
                label="Port"
                name="port"
                type="number"
                defaultValue="993"
                required
              />
              <FormField
                label="Username"
                name="username"
                type="email"
                required
              />
              <FormField
                label="Password"
                name="password"
                type="password"
                required
              />
              <CheckboxField
                label="Use SSL/TLS"
                name="secure"
                defaultChecked
              />
              
              <TestButton type="submit">
                Test & Save IMAP Settings
              </TestButton>
            </IMAPForm>
          </TabContent>
        </Tab>
      </Tabs>
    </Container>
  );
};
```

### Email Sending from GTD
```typescript
export const TaskDelegationEmail: React.FC<{task: GTDItem}> = ({ task }) => {
  const { user } = useAuth();
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { sendDelegation } = useGTDEmail();
  
  const handleSend = async () => {
    setSending(true);
    try {
      await sendDelegation({
        task,
        delegateTo: recipient,
        message,
        fromEmail: user.email  // User's verified email
      });
      
      toast.success('Delegation email sent!');
      
      // Update task status
      task.status = 'waiting';
      task.delegatedTo = recipient;
    } catch (error) {
      if (error.message.includes('not verified')) {
        toast.error('Please verify your email first');
        // Show verification form
      } else {
        toast.error(`Failed to send: ${error.message}`);
      }
    } finally {
      setSending(false);
    }
  };
  
  return (
    <DelegationForm>
      <TaskInfo>
        <Label>Delegating Task:</Label>
        <TaskName>{task.name}</TaskName>
      </TaskInfo>
      
      <FormField
        label="Delegate To"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="colleague@example.com"
        type="email"
        required
      />
      
      <FormField
        label="Additional Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Any additional context..."
        multiline
        rows={4}
      />
      
      <Preview>
        <Label>Email Preview:</Label>
        <EmailPreview>
          From: {user.email}
          To: {recipient}
          Subject: Task Delegation: {task.name}
          
          {generateDelegationEmailBody(task, message)}
        </EmailPreview>
      </Preview>
      
      <SendButton 
        onClick={handleSend}
        disabled={!recipient || sending}
      >
        {sending ? 'Sending...' : 'Send Delegation Email'}
      </SendButton>
    </DelegationForm>
  );
};
```

## API Endpoints

### Email Verification Endpoints
```typescript
// Backend API for email verification
router.post('/api/gtd/email/verify', async (req, res) => {
  const { email, workspace } = req.body;
  
  try {
    // Verify in AWS SES
    const ses = new AWS.SES();
    await ses.verifyEmailIdentity({ EmailAddress: email }).promise();
    
    // Store verification request
    await db.collection('email_verifications').insertOne({
      email,
      workspace,
      status: 'pending',
      requestedAt: new Date()
    });
    
    res.json({ 
      success: true, 
      message: 'Verification email sent' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/api/gtd/email/verify/status/:email', async (req, res) => {
  const { email } = req.params;
  
  try {
    // Check SES verification status
    const ses = new AWS.SES();
    const result = await ses.getIdentityVerificationAttributes({
      Identities: [email]
    }).promise();
    
    const verified = result.VerificationAttributes?.[email]?.VerificationStatus === 'Success';
    
    if (verified) {
      // Update database
      await db.collection('email_verifications').updateOne(
        { email },
        { 
          $set: { 
            status: 'verified', 
            verifiedAt: new Date() 
          }
        }
      );
      
      // Update SPU configuration
      await updateSPUEmailConfig(email);
    }
    
    res.json({ verified });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/api/gtd/email/send', async (req, res) => {
  const { from, to, subject, body, gtdContext } = req.body;
  const { user } = req;
  
  try {
    // Verify sender is the authenticated user
    if (from !== user.email) {
      return res.status(403).json({ error: 'Can only send from your own email' });
    }
    
    // Check email is verified
    const verification = await db.collection('email_verifications').findOne({
      email: from,
      status: 'verified'
    });
    
    if (!verification) {
      return res.status(403).json({ error: 'Email not verified in AWS SES' });
    }
    
    // Send via SPU
    const result = await spuCore.sendEmail({
      from,  // User's verified email
      to,
      subject,
      body,
      metadata: gtdContext
    });
    
    res.json({ success: true, messageId: result.messageId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Configuration Requirements

### Environment Variables
```env
# AWS SES Configuration
AWS_REGION=us-east-1
AWS_SES_CONFIGURATION_SET=qwanyx-gtd
AWS_SES_SANDBOX_MODE=false  # Set to true in development

# SPU Email Configuration  
SPU_EMAIL_ENDPOINT=http://localhost:8080/email
SPU_EMAIL_ENABLED=true

# Email Receiving
EMAIL_RECEIVE_DOMAIN=receive.qwanyx.com
EMAIL_FORWARD_BUCKET=qwanyx-email-inbox
```

### AWS SES Setup Requirements
1. Verify domain (qwanyx.com)
2. Set up DKIM records
3. Configure SPF records
4. Request production access (exit sandbox)
5. Set up configuration set for tracking
6. Configure SNS notifications for bounces/complaints

## Security Considerations

1. **Email Verification**: Users can only send from their verified email
2. **Rate Limiting**: Implement sending limits per user
3. **SPU Integration**: SPU validates sender before sending
4. **Audit Trail**: Log all email operations
5. **Workspace Isolation**: Emails scoped to workspace

## Benefits of This Approach

1. **No Hardcoded Emails**: Each user sends from their own verified email
2. **Trust Building**: Recipients see real sender, not noreply@
3. **Reply Handling**: Replies go back to the user naturally
4. **Compliance**: Proper sender verification for deliverability
5. **SPU Intelligence**: SPU can personalize based on sender context