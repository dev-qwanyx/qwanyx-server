import { EventEmitter } from 'events'
import * as Imap from 'imap'
import { simpleParser, ParsedMail } from 'mailparser'
import * as nodemailer from 'nodemailer'
import { Edge } from '../../types'
import { 
  MailConfig, 
  EmailData, 
  EmailNode, 
  ContactNode,
  MailServiceEvents 
} from './types'
import { SemanticCompression, ProcessedEmail } from './SemanticCompression'
import { TemporalCompression, CompressionLevel } from './TemporalCompression'

export class MailService extends EventEmitter {
  private brainId: string
  private config: MailConfig
  private imap: Imap | null = null
  private transporter: nodemailer.Transporter | null = null
  private pollingInterval: NodeJS.Timeout | null = null
  private contacts: Map<string, ContactNode> = new Map()
  private isConnected: boolean = false
  private compression: SemanticCompression
  private temporalCompression: TemporalCompression
  private emailBatch: EmailData[] = []
  private emailCount: number = 0  // Track position for compression levels

  constructor(brainId: string, config: MailConfig) {
    super()
    this.brainId = brainId
    this.config = config
    
    // Initialize compression systems
    this.compression = new SemanticCompression()
    this.temporalCompression = new TemporalCompression()
    
    // Initialize SMTP transporter for sending
    this.initSMTP()
    
    // Start batch processing timer
    this.startBatchProcessor()
  }

  // Initialize SMTP for sending emails
  private initSMTP() {
    this.transporter = nodemailer.createTransporter({
      host: this.config.smtp.host,
      port: this.config.smtp.port,
      secure: this.config.smtp.secure,
      auth: {
        user: this.config.smtp.auth.user,
        pass: this.config.smtp.auth.pass
      }
    })
    
    console.log('📧 SMTP transporter initialized')
  }

  // Connect to IMAP server
  public async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.imap = new Imap({
        user: this.config.imap.user,
        password: this.config.imap.password,
        host: this.config.imap.host,
        port: this.config.imap.port,
        tls: this.config.imap.tls,
        tlsOptions: this.config.imap.tlsOptions || {},
        authTimeout: this.config.imap.authTimeout || 10000
      })

      this.imap.once('ready', () => {
        console.log('📬 IMAP connection ready')
        this.isConnected = true
        this.emit('connected')
        
        // Start polling if enabled
        if (this.config.polling.enabled) {
          this.startPolling()
        }
        
        resolve()
      })

      this.imap.once('error', (err: Error) => {
        console.error('❌ IMAP error:', err)
        this.emit('error', err)
        reject(err)
      })

      this.imap.once('end', () => {
        console.log('📪 IMAP connection ended')
        this.isConnected = false
        this.emit('disconnected')
      })

      this.imap.connect()
    })
  }

  // Start polling for new emails
  private startPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
    }

    // Initial check
    this.checkNewEmails()

    // Set up interval
    this.pollingInterval = setInterval(() => {
      this.checkNewEmails()
    }, this.config.polling.interval)

    console.log(`📮 Started email polling (every ${this.config.polling.interval / 1000}s)`)
  }

  // Check for new emails
  private async checkNewEmails() {
    if (!this.imap || !this.isConnected) return

    for (const folder of this.config.polling.folders) {
      try {
        await this.fetchUnreadEmails(folder)
      } catch (error) {
        console.error(`Error checking folder ${folder}:`, error)
      }
    }
  }

  // Fetch unread emails from a folder
  private async fetchUnreadEmails(folder: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.imap) return reject(new Error('IMAP not connected'))

      this.imap.openBox(folder, false, (err, box) => {
        if (err) return reject(err)

        // Search for unseen messages
        this.imap!.search(['UNSEEN'], (err, results) => {
          if (err) return reject(err)
          if (!results || results.length === 0) {
            return resolve()
          }

          console.log(`📨 Found ${results.length} new emails in ${folder}`)

          const fetch = this.imap!.fetch(results, { 
            bodies: '',
            markSeen: true 
          })

          fetch.on('message', (msg, seqno) => {
            msg.on('body', (stream, info) => {
              simpleParser(stream, async (err, parsed) => {
                if (err) {
                  console.error('Error parsing email:', err)
                  return
                }

                try {
                  await this.processEmail(parsed, folder)
                } catch (error) {
                  console.error('Error processing email:', error)
                }
              })
            })
          })

          fetch.once('error', reject)
          fetch.once('end', () => {
            console.log(`✅ Processed emails from ${folder}`)
            resolve()
          })
        })
      })
    })
  }

  // Process a parsed email
  private async processEmail(parsed: ParsedMail, folder: string) {
    // Extract email data
    const emailData: EmailData = {
      messageId: parsed.messageId || `${Date.now()}-${Math.random()}`,
      subject: parsed.subject || '(No Subject)',
      from: this.extractAddress(parsed.from),
      to: this.extractAddresses(parsed.to),
      cc: parsed.cc ? this.extractAddresses(parsed.cc) : undefined,
      bcc: parsed.bcc ? this.extractAddresses(parsed.bcc) : undefined,
      date: parsed.date || new Date(),
      folder: folder,
      flags: [],
      body: {
        text: parsed.text || undefined,
        html: parsed.html || undefined
      },
      attachments: parsed.attachments?.map(att => ({
        filename: att.filename || 'attachment',
        size: att.size || 0,
        mimeType: att.contentType || 'application/octet-stream',
        content: att.content
      }))
    }

    // Find or create contact
    const contact = await this.findOrCreateContact(emailData.from)

    // Create email node
    const emailNode: EmailNode = {
      type: 'email',
      data: {
        ...emailData,
        contactId: contact._id,
        isRead: false,
        isAnswered: false,
        isDraft: false
      }
    }

    // Store in brain
    const storedEmail = await this.brain.createMemory({
      type: 'email',
      content: emailNode.data,
      metadata: {
        contactId: contact._id,
        folder: folder,
        received: new Date().toISOString()
      }
    })

    // Create edge between contact and email
    const edge: Edge = {
      id: `${contact._id}-${storedEmail.id}-${Date.now()}`,
      source: contact._id!,
      target: storedEmail.id,
      type: 'mail'
    }
    await this.brain.addEdge(edge)

    // Update contact's last contact date and message count
    contact.data.lastContact = emailData.date
    contact.data.messageCount = (contact.data.messageCount || 0) + 1
    await this.brain.updateMemory(contact._id!, contact.data)

    console.log(`💾 Stored email from ${emailData.from.email}: "${emailData.subject}"`)
    
    // Add to batch for semantic processing
    this.emailBatch.push(emailData)
    
    // Process immediately (even if just 1 email)
    // Later we can optimize to wait for more if we want
    await this.processBatch()
    
    // Emit event
    this.emit('email:received', { ...emailNode, _id: storedEmail.id })
  }

  // Find or create a contact
  private async findOrCreateContact(address: { email: string; name?: string }): Promise<ContactNode> {
    // Check local cache first
    if (this.contacts.has(address.email)) {
      return this.contacts.get(address.email)!
    }

    // Search in brain
    const existingContacts = await this.brain.searchMemories({
      type: 'contact',
      'content.email': address.email
    })

    if (existingContacts.length > 0) {
      const contact: ContactNode = {
        _id: existingContacts[0].id,
        type: 'contact',
        data: existingContacts[0].content
      }
      this.contacts.set(address.email, contact)
      return contact
    }

    // Create new contact
    const newContact: ContactNode = {
      type: 'contact',
      data: {
        email: address.email,
        name: address.name,
        firstContact: new Date(),
        lastContact: new Date(),
        messageCount: 0,
        metadata: {
          source: 'email',
          autoCreated: true
        }
      }
    }

    const stored = await this.brain.createMemory({
      type: 'contact',
      content: newContact.data,
      metadata: {
        autoCreated: true,
        createdAt: new Date().toISOString()
      }
    })

    newContact._id = stored.id
    this.contacts.set(address.email, newContact)
    
    console.log(`👤 Created new contact: ${address.email}`)
    this.emit('contact:created', newContact)
    
    return newContact
  }

  // Send an email
  public async sendEmail(
    to: string | string[],
    subject: string,
    body: { text?: string; html?: string },
    options?: {
      cc?: string | string[]
      bcc?: string | string[]
      attachments?: Array<{
        filename: string
        content: Buffer | string
      }>
    }
  ): Promise<void> {
    if (!this.transporter) {
      throw new Error('SMTP not configured')
    }

    const mailOptions: nodemailer.SendMailOptions = {
      from: this.config.smtp.from,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject: subject,
      text: body.text,
      html: body.html,
      cc: options?.cc,
      bcc: options?.bcc,
      attachments: options?.attachments
    }

    const info = await this.transporter.sendMail(mailOptions)
    console.log(`📤 Email sent: ${info.messageId}`)

    // Store sent email in brain
    const sentEmail: EmailNode = {
      type: 'email',
      data: {
        messageId: info.messageId,
        subject: subject,
        from: this.extractAddress(this.config.smtp.from),
        to: this.extractAddresses(to),
        date: new Date(),
        folder: 'Sent',
        flags: ['\\Seen'],
        body: body,
        isRead: true,
        isAnswered: false,
        isDraft: false
      }
    }

    const stored = await this.brain.createMemory({
      type: 'email',
      content: sentEmail.data,
      metadata: {
        folder: 'Sent',
        sent: new Date().toISOString()
      }
    })

    this.emit('email:sent', { ...sentEmail, _id: stored.id })
  }

  // Helper: Extract single address
  private extractAddress(addr: any): { email: string; name?: string } {
    if (!addr) return { email: 'unknown@unknown.com' }
    
    if (typeof addr === 'string') {
      // Parse "Name <email>" format
      const match = addr.match(/^(.+?)\s*<(.+?)>$/)
      if (match) {
        return { email: match[2], name: match[1].trim() }
      }
      return { email: addr }
    }
    
    if (addr.value && addr.value[0]) {
      return {
        email: addr.value[0].address || 'unknown@unknown.com',
        name: addr.value[0].name
      }
    }
    
    return { email: 'unknown@unknown.com' }
  }

  // Helper: Extract multiple addresses
  private extractAddresses(addr: any): Array<{ email: string; name?: string }> {
    if (!addr) return []
    
    if (typeof addr === 'string') {
      return [this.extractAddress(addr)]
    }
    
    if (addr.value && Array.isArray(addr.value)) {
      return addr.value.map((a: any) => ({
        email: a.address || 'unknown@unknown.com',
        name: a.name
      }))
    }
    
    return []
  }

  // Get all contacts
  public async getContacts(): Promise<ContactNode[]> {
    const contacts = await this.brain.searchMemories({ type: 'contact' })
    return contacts.map(c => ({
      _id: c.id,
      type: 'contact' as const,
      data: c.content
    }))
  }

  // Zoom into a specific time period - reconstruct context from compressed memories
  public async zoomIntoTimeRange(
    startDate: Date,
    endDate: Date,
    detailLevel: 'full' | 'summary' | 'pattern' = 'summary'
  ) {
    console.log(`🔍 Zooming into ${startDate.toISOString()} - ${endDate.toISOString()}`)
    return this.temporalCompression.zoomIntoTimeRange(
      this.brain,
      startDate,
      endDate,
      detailLevel
    )
  }
  
  // Get emails for a contact
  public async getEmailsForContact(contactId: string): Promise<EmailNode[]> {
    const connections = await this.brain.getConnections(contactId)
    const emailIds = connections
      .filter(c => c.type === 'received_email' || c.type === 'sent_email')
      .map(c => c.target)
    
    const emails = await Promise.all(
      emailIds.map(id => this.brain.getMemory(id))
    )
    
    return emails.filter(e => e).map(e => ({
      _id: e.id,
      type: 'email' as const,
      data: e.content
    }))
  }

  // Start batch processor for semantic compression
  private startBatchProcessor() {
    // Currently processing immediately on arrival
    // Keeping this method for future optimization where we might
    // want to batch multiple emails for efficiency with GPT-5 Nano's 400k context
    console.log('📧 Email compression enabled - processing on arrival')
  }
  
  // Process email batch with temporal-aware compression
  private async processBatch() {
    if (this.emailBatch.length === 0) return
    
    const batch = [...this.emailBatch]
    this.emailBatch = []
    
    try {
      console.log(`🧠 Processing batch of ${batch.length} emails...`)
      
      for (const email of batch) {
        this.emailCount++
        
        // Determine compression level based on position
        const compressionLevel = this.temporalCompression.getCompressionLevel(
          this.emailCount,
          0  // Age 0 for new emails
        )
        
        console.log(`📧 Email #${this.emailCount} - Compression level: ${CompressionLevel[compressionLevel]}`)
        
        // Compress with appropriate level
        const compressed = await this.temporalCompression.compressEmail(email, compressionLevel)
        
        // Update email node
        await this.updateEmailWithTemporalCompression(email, compressed)
      }
      
      // Run cascade compression on older emails periodically
      if (this.emailCount % 10 === 0) {
        console.log('🌊 Running compression cascade on older emails...')
        await this.temporalCompression.cascadeCompression(this.brain)
      }
      
      console.log(`✅ Batch processing complete`)
    } catch (error) {
      console.error('Batch processing failed:', error)
      // Re-add to batch for retry
      this.emailBatch.push(...batch)
    }
  }
  
  // Update email node with temporal compression
  private async updateEmailWithTemporalCompression(original: EmailData, compressed: any) {
    // Find the email node
    const emails = await this.brain.searchMemories({
      type: 'email',
      'content.messageId': original.messageId
    })
    
    if (emails.length > 0) {
      const emailId = emails[0].id
      
      // Update with temporal compression
      await this.brain.updateMemory(emailId, {
        ...emails[0].content,
        compression: compressed
      })
      
      // Create tag edges if we have tags
      if (compressed.tags) {
        for (let i = 0; i < compressed.tags.length; i++) {
          const tagEdge: Edge = {
            id: `tag-${emailId}-${compressed.tags[i]}`,
            source: emailId,
            target: `tag-${compressed.tags[i]}`,
            type: 'tagged'
          }
          await this.brain.addEdge(tagEdge)
        }
      }
    }
  }
  
  // Legacy method for backward compatibility
  private async updateEmailWithCompression(processed: ProcessedEmail) {
    const { original, compression } = processed
    
    // Find the email node
    const emails = await this.brain.searchMemories({
      type: 'email',
      'content.messageId': original.messageId
    })
    
    if (emails.length > 0) {
      const emailId = emails[0].id
      
      // Update with compression data
      await this.brain.updateMemory(emailId, {
        ...emails[0].content,
        compression: {
          summary: compression.summary,
          tags: compression.tags,
          entities: compression.entities,
          importance: compression.importance,
          actions: compression.actions
        }
      })
      
      // Create tag edges for graph traversal
      for (const tagIndex of compression.tags) {
        const tagEdge: Edge = {
          id: `tag-${emailId}-${tagIndex}`,
          source: emailId,
          target: `tag-${tagIndex}`,
          type: 'tagged'
        }
        await this.brain.addEdge(tagEdge)
      }
    }
  }

  // Disconnect and cleanup
  public async disconnect() {
    // Process remaining batch
    if (this.emailBatch.length > 0) {
      await this.processBatch()
    }
    
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
      this.pollingInterval = null
    }

    if (this.imap) {
      this.imap.end()
      this.imap = null
    }

    this.isConnected = false
    console.log('🔌 Mail service disconnected')
  }
}

// Type the EventEmitter
export interface MailService {
  on<K extends keyof MailServiceEvents>(
    event: K,
    listener: MailServiceEvents[K]
  ): this
  
  emit<K extends keyof MailServiceEvents>(
    event: K,
    ...args: Parameters<MailServiceEvents[K]>
  ): boolean
}