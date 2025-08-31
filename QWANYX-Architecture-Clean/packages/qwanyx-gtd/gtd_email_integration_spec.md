# GTD Email Integration & Mail Processor Specification

## Email Validation & Integration Architecture

### Email Account Management
```typescript
interface GTDEmailAccount {
  id: string;
  userEmail: string;              // User's QWANYX account
  workspace: string;
  
  emailAccounts: EmailAccount[];  // Multiple email accounts per user
  primaryAccount?: string;         // ID of primary account for sending
  
  validation: {
    status: 'pending' | 'validated' | 'failed';
    validatedAt?: Date;
    validationToken?: string;
    lastError?: string;
  };
}

interface EmailAccount {
  id: string;
  email: string;
  provider: 'gmail' | 'outlook' | 'yahoo' | 'imap' | 'other';
  
  // Validation status
  validation: {
    isValidated: boolean;
    validatedAt?: Date;
    verificationMethod: 'oauth' | 'smtp' | 'imap' | 'confirmation_email';
  };
  
  // Connection settings
  connection: {
    type: 'oauth2' | 'imap' | 'pop3';
    
    // For OAuth2
    oauth?: {
      provider: string;
      accessToken?: string;
      refreshToken?: string;
      expiresAt?: Date;
    };
    
    // For IMAP/POP3
    imap?: {
      host: string;
      port: number;
      secure: boolean;
      username: string;
      password?: string;  // Encrypted
    };
    
    // For sending (SMTP)
    smtp?: {
      host: string;
      port: number;
      secure: boolean;
      username: string;
      password?: string;  // Encrypted
    };
  };
  
  // Processing preferences
  processing: {
    autoProcess: boolean;
    checkInterval: number;  // minutes
    folders: string[];      // Folders to watch
    rules: EmailRule[];
    lastCheck?: Date;
  };
}
```

## Email Validation Flow

### Multi-Method Validation System
```typescript
class EmailValidator {
  private spu: SPUCore;
  private mailProcessor: MailProcessor;
  
  async validateEmailAccount(
    account: EmailAccount,
    userMemory: GTDUserMemory
  ): Promise<ValidationResult> {
    switch (account.provider) {
      case 'gmail':
        return this.validateGmail(account);
      case 'outlook':
        return this.validateOutlook(account);
      default:
        return this.validateIMAP(account);
    }
  }
  
  // OAuth2 validation for Gmail
  private async validateGmail(account: EmailAccount): Promise<ValidationResult> {
    try {
      // Step 1: OAuth2 flow
      const authUrl = await this.getGoogleAuthUrl(account.email);
      
      // Step 2: User authorizes
      const authCode = await this.waitForUserAuth(authUrl);
      
      // Step 3: Exchange for tokens
      const tokens = await this.exchangeCodeForTokens(authCode);
      
      // Step 4: Verify access
      const verified = await this.verifyGmailAccess(tokens);
      
      if (verified) {
        // Store encrypted tokens
        await this.storeTokens(account.id, tokens);
        
        return {
          success: true,
          method: 'oauth',
          capabilities: ['read', 'send', 'labels', 'attachments']
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // IMAP validation for generic accounts
  private async validateIMAP(account: EmailAccount): Promise<ValidationResult> {
    try {
      // Step 1: Test IMAP connection
      const imapClient = await this.connectIMAP({
        host: account.connection.imap!.host,
        port: account.connection.imap!.port,
        secure: account.connection.imap!.secure,
        auth: {
          user: account.connection.imap!.username,
          pass: account.connection.imap!.password
        }
      });
      
      // Step 2: Send verification email
      const verificationCode = generateVerificationCode();
      await this.sendVerificationEmail(account.email, verificationCode);
      
      // Step 3: Monitor inbox for verification
      const verified = await this.waitForVerification(imapClient, verificationCode);
      
      if (verified) {
        // Step 4: Test SMTP for sending
        const smtpVerified = await this.verifySMTP(account);
        
        return {
          success: true,
          method: 'imap',
          capabilities: smtpVerified 
            ? ['read', 'send', 'attachments']
            : ['read', 'attachments']
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Send verification email
  private async sendVerificationEmail(
    email: string, 
    code: string
  ): Promise<void> {
    const template = `
      <h2>Verify your email for QWANYX GTD</h2>
      <p>Please reply to this email with the following code to verify your account:</p>
      <h3>${code}</h3>
      <p>Or click this link: ${process.env.APP_URL}/gtd/verify?code=${code}</p>
    `;
    
    await this.mailProcessor.sendEmail({
      to: email,
      subject: 'Verify your email for QWANYX GTD',
      html: template
    });
  }
}
```

## Mail Processor Integration

### Email Processing Pipeline
```typescript
interface MailProcessorIntegration {
  // Process incoming emails into GTD items
  processEmail(email: Email): Promise<GTDItem>;
  
  // Extract actionable items from email
  extractActions(email: Email): Promise<ActionableItem[]>;
  
  // Categorize and link to contacts
  categorizeEmail(email: Email): Promise<CategorySuggestion>;
  
  // Handle attachments
  processAttachments(email: Email): Promise<ProcessedAttachment[]>;
}

class GTDMailProcessor {
  private spu: SPUCore;
  private documentProcessor: SPUDocumentProcessor;
  private userMemory: GTDUserMemory;
  
  async processIncomingEmail(
    email: Email,
    account: EmailAccount
  ): Promise<GTDItem> {
    // Step 1: SPU analysis of email content
    const analysis = await this.spu.analyzeWithMemory({
      command: 'analyze_email_for_gtd',
      payload: {
        subject: email.subject,
        content: email.body,
        from: email.from,
        to: email.to,
        date: email.date
      },
      memoryContext: this.userMemory
    });
    
    // Step 2: Process attachments if any
    const attachments = await this.processEmailAttachments(email);
    
    // Step 3: Create GTD item
    const gtdItem: GTDItem = {
      id: generateId(),
      name: email.subject || 'Email from ' + email.from,
      content: email.body,
      contentPreview: email.body.substring(0, 200),
      dateAdded: new Date(),
      
      // Email-specific metadata
      source: {
        type: 'email',
        emailId: email.id,
        from: email.from,
        to: email.to,
        cc: email.cc,
        account: account.email
      },
      
      // SPU suggestions
      category: analysis.suggestedCategory,
      contact: email.from,
      priority: analysis.priority,
      status: analysis.isActionable ? 'inbox' : 'reference',
      
      // Extracted items
      actionableItems: analysis.extractedActions,
      deadlines: analysis.extractedDeadlines,
      contexts: analysis.suggestedContexts,
      
      // Attachments processed to S3
      attachments: attachments.map(a => ({
        name: a.filename,
        s3Key: a.s3Key,
        mimeType: a.mimeType,
        size: a.size,
        processed: a.processed
      })),
      
      // Auto-categorization based on memory
      spuAnalysis: {
        suggestedAction: analysis.suggestedAction,
        confidence: analysis.confidence,
        reasoning: analysis.reasoning,
        autoCategory: analysis.category,
        extractedContacts: analysis.extractedContacts,
        suggestedContexts: analysis.contexts
      }
    };
    
    // Step 4: Learn from email pattern
    await this.learnEmailPattern(email, gtdItem);
    
    return gtdItem;
  }
  
  private async processEmailAttachments(
    email: Email
  ): Promise<ProcessedAttachment[]> {
    const processed: ProcessedAttachment[] = [];
    
    for (const attachment of email.attachments || []) {
      // Upload to S3
      const s3Key = await this.uploadAttachment(attachment);
      
      // Process based on type
      let analysis = null;
      if (this.isDocument(attachment.mimeType)) {
        analysis = await this.documentProcessor.processDocument({
          name: attachment.filename,
          content: attachment.content,
          mimeType: attachment.mimeType
        }, this.userMemory);
      }
      
      processed.push({
        filename: attachment.filename,
        s3Key,
        mimeType: attachment.mimeType,
        size: attachment.size,
        processed: analysis
      });
    }
    
    return processed;
  }
  
  private async learnEmailPattern(
    email: Email,
    gtdItem: GTDItem
  ): Promise<void> {
    // Store pattern for similar emails
    const pattern = {
      sender: email.from,
      subjectPattern: this.extractSubjectPattern(email.subject),
      typicalAction: gtdItem.spuAnalysis?.suggestedAction,
      category: gtdItem.category,
      priority: gtdItem.priority
    };
    
    await this.userMemory.updateMemory({
      type: 'email_pattern_learned',
      pattern
    });
  }
}
```

## Email Rules & Automation

### Rule-Based Processing
```typescript
interface EmailRule {
  id: string;
  name: string;
  enabled: boolean;
  
  // Conditions
  conditions: {
    from?: string | string[] | RegExp;
    to?: string | string[] | RegExp;
    subject?: string | RegExp;
    body?: string | RegExp;
    hasAttachment?: boolean;
    folder?: string;
  };
  
  // Actions
  actions: {
    autoProcess?: boolean;
    category?: string;
    project?: string;
    status?: GTDItem['status'];
    priority?: GTDItem['priority'];
    contexts?: string[];
    delegate?: string;
    archive?: boolean;
    forward?: string;
    executeScript?: string;
  };
  
  // Learning
  confidence: number;
  timesUsed: number;
  lastUsed?: Date;
}

class EmailRuleEngine {
  private rules: Map<string, EmailRule>;
  private userMemory: GTDUserMemory;
  
  async applyRules(email: Email): Promise<GTDItem | null> {
    // Find matching rules
    const matchingRules = this.findMatchingRules(email);
    
    if (matchingRules.length === 0) {
      return null;
    }
    
    // Apply highest confidence rule
    const rule = matchingRules.sort((a, b) => b.confidence - a.confidence)[0];
    
    // Create GTD item based on rule
    const gtdItem = await this.createItemFromRule(email, rule);
    
    // Update rule statistics
    await this.updateRuleStats(rule);
    
    return gtdItem;
  }
  
  private findMatchingRules(email: Email): EmailRule[] {
    return Array.from(this.rules.values()).filter(rule => {
      if (!rule.enabled) return false;
      
      const conditions = rule.conditions;
      
      // Check each condition
      if (conditions.from && !this.matchesPattern(email.from, conditions.from)) {
        return false;
      }
      
      if (conditions.subject && !this.matchesPattern(email.subject, conditions.subject)) {
        return false;
      }
      
      if (conditions.hasAttachment !== undefined && 
          (email.attachments?.length > 0) !== conditions.hasAttachment) {
        return false;
      }
      
      return true;
    });
  }
  
  async learnNewRule(
    emails: Email[],
    commonAction: ProcessingDecision
  ): Promise<EmailRule | null> {
    // Find common patterns in emails
    const patterns = await this.spu.findCommonPatterns(emails);
    
    if (patterns.confidence < 0.7) {
      return null;
    }
    
    // Create new rule
    const rule: EmailRule = {
      id: generateId(),
      name: `Auto-rule: ${patterns.description}`,
      enabled: false,  // Start disabled for user review
      conditions: patterns.conditions,
      actions: {
        category: commonAction.category,
        status: commonAction.status,
        priority: commonAction.priority
      },
      confidence: patterns.confidence,
      timesUsed: 0
    };
    
    return rule;
  }
}
```

## Email Sending Capabilities

### Send Emails from GTD
```typescript
interface GTDEmailSender {
  // Send task-related emails
  sendTaskEmail(task: GTDItem, recipient: string): Promise<void>;
  
  // Delegate via email
  delegateViaEmail(task: GTDItem, delegateTo: string): Promise<void>;
  
  // Send project updates
  sendProjectUpdate(project: GTDProject, recipients: string[]): Promise<void>;
  
  // Reply to original email
  replyToEmail(originalEmail: Email, response: string): Promise<void>;
}

class GTDEmailSender {
  private mailProcessor: MailProcessor;
  private account: EmailAccount;
  
  async delegateViaEmail(
    task: GTDItem,
    delegateTo: string
  ): Promise<void> {
    const template = await this.generateDelegationEmail(task);
    
    await this.mailProcessor.sendEmail({
      from: this.account.email,
      to: delegateTo,
      subject: `Task Delegation: ${task.name}`,
      html: template,
      headers: {
        'X-GTD-Task-ID': task.id,
        'X-GTD-Type': 'delegation'
      }
    });
    
    // Update task status
    task.status = 'waiting';
    task.delegatedTo = delegateTo;
    task.delegatedAt = new Date();
  }
  
  async replyToEmail(
    originalEmail: Email,
    response: string,
    gtdItem?: GTDItem
  ): Promise<void> {
    // Generate smart reply with context
    const smartReply = await this.spu.generateReply({
      originalEmail,
      userResponse: response,
      gtdContext: gtdItem,
      userMemory: this.userMemory
    });
    
    await this.mailProcessor.sendEmail({
      from: this.account.email,
      to: originalEmail.from,
      subject: `Re: ${originalEmail.subject}`,
      html: smartReply.html,
      inReplyTo: originalEmail.id,
      references: originalEmail.references
    });
  }
}
```

## React Components for Email Management

### Email Account Setup
```typescript
export const EmailAccountSetup: React.FC = () => {
  const { userMemory } = useGTDMemory();
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [validating, setValidating] = useState(false);
  
  const addEmailAccount = async (accountData: Partial<EmailAccount>) => {
    setValidating(true);
    
    try {
      // Validate account
      const validator = new EmailValidator();
      const result = await validator.validateEmailAccount(accountData as EmailAccount, userMemory);
      
      if (result.success) {
        // Save validated account
        const newAccount = {
          ...accountData,
          validation: {
            isValidated: true,
            validatedAt: new Date(),
            verificationMethod: result.method
          }
        };
        
        setAccounts([...accounts, newAccount]);
        
        // Start email monitoring
        await startEmailMonitoring(newAccount);
      }
    } finally {
      setValidating(false);
    }
  };
  
  return (
    <Container>
      <Header>Email Account Management</Header>
      
      <AccountList>
        {accounts.map(account => (
          <AccountCard key={account.id}>
            <EmailAddress>{account.email}</EmailAddress>
            <Provider>{account.provider}</Provider>
            <ValidationStatus validated={account.validation.isValidated}>
              {account.validation.isValidated ? 'Validated' : 'Pending'}
            </ValidationStatus>
            <LastCheck>
              Last check: {account.processing.lastCheck?.toLocaleString() || 'Never'}
            </LastCheck>
          </AccountCard>
        ))}
      </AccountList>
      
      <AddAccountButton onClick={() => setShowAddDialog(true)}>
        Add Email Account
      </AddAccountButton>
      
      {showAddDialog && (
        <EmailAccountDialog
          onAdd={addEmailAccount}
          onClose={() => setShowAddDialog(false)}
          validating={validating}
        />
      )}
    </Container>
  );
};
```

### Email Processing View
```typescript
export const EmailProcessingView: React.FC = () => {
  const { processEmail } = useGTDMailProcessor();
  const [emails, setEmails] = useState<Email[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);
  
  const handleProcessEmail = async (email: Email) => {
    setProcessing(email.id);
    
    try {
      const gtdItem = await processEmail(email);
      
      // Remove from unprocessed list
      setEmails(emails.filter(e => e.id !== email.id));
      
      // Show success
      toast.success(`Email processed: ${gtdItem.name}`);
    } catch (error) {
      toast.error(`Failed to process email: ${error.message}`);
    } finally {
      setProcessing(null);
    }
  };
  
  return (
    <Container>
      <Header>Unprocessed Emails</Header>
      
      <EmailList>
        {emails.map(email => (
          <EmailItem key={email.id}>
            <From>{email.from}</From>
            <Subject>{email.subject}</Subject>
            <Preview>{email.preview}</Preview>
            
            {email.spuSuggestion && (
              <Suggestion>
                SPU suggests: {email.spuSuggestion.action} 
                ({Math.round(email.spuSuggestion.confidence * 100)}%)
              </Suggestion>
            )}
            
            <Actions>
              <ProcessButton 
                onClick={() => handleProcessEmail(email)}
                loading={processing === email.id}
              >
                Process to GTD
              </ProcessButton>
              <QuickActions email={email} />
            </Actions>
          </EmailItem>
        ))}
      </EmailList>
    </Container>
  );
};
```

## Security Considerations

### Email Credential Security
```typescript
const emailSecurity = {
  // Credential encryption
  encryption: {
    algorithm: 'AES-256-GCM',
    keyDerivation: 'PBKDF2',
    storage: 'encrypted-vault'
  },
  
  // OAuth token management
  oauth: {
    storage: 'secure-token-store',
    refresh: 'automatic',
    scope: 'minimal-required'
  },
  
  // Access control
  access: {
    readEmails: 'user-only',
    sendEmails: 'user-authorized',
    credentials: 'never-exposed'
  }
};
```

## Integration Points

1. **SPU-Core**: Analyze emails and suggest actions
2. **Document Processor**: Handle email attachments
3. **S3**: Store attachments securely
4. **User Memory**: Learn from email patterns
5. **Mail Processor**: Send and receive emails
6. **Dashboard**: Display email status and processing queue