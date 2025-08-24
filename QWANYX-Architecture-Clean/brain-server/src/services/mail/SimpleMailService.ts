import { EventEmitter } from 'events'
const Imap = require('imap')
const nodemailer = require('nodemailer')
import { simpleParser, ParsedMail } from 'mailparser'
import { MailConfig, EmailData } from './types'

/**
 * Simplified Mail Service that just connects and emits events
 * The Brain will handle memory formation
 */
export class SimpleMailService extends EventEmitter {
  private brainId: string
  private config: MailConfig
  private imap: Imap | null = null
  private smtpTransporter: any = null
  private isConnected: boolean = false
  private processedCount: number = 0

  constructor(brainId: string, config: MailConfig) {
    super()
    this.brainId = brainId
    this.config = config
    
    // Initialize SMTP transporter for AWS SES
    if (config.smtp) {
      this.smtpTransporter = nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.secure || false,
        auth: config.smtp.auth
      })
    }
    console.log(`📧 SimpleMailService created for brain ${brainId}`)
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('📧 Connecting to IMAP...')
      
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
        console.log('✅ IMAP connected successfully')
        this.isConnected = true
        this.emit('connected')
        resolve()
      })

      this.imap.once('error', (err: Error) => {
        console.error('❌ IMAP error:', err)
        this.emit('error', err)
        reject(err)
      })

      this.imap.connect()
    })
  }

  async checkEmails(): Promise<void> {
    // Reconnect if needed
    if (!this.isConnected) {
      console.log('📧 Reconnecting to IMAP...')
      await this.connect()
    }
    
    if (!this.imap) return

    this.imap.openBox('INBOX', false, (err, box) => {
      if (err) {
        console.error('❌ Error opening INBOX:', err)
        this.isConnected = false
        return
      }

      console.log(`📬 INBOX opened: ${box.messages.total} total`)
      
      // Search for unread emails
      this.imap!.search(['UNSEEN'], (err, results) => {
        if (err) {
          console.error('❌ Error searching for unread emails:', err)
          return
        }
        
        if (results.length === 0) {
          console.log('📭 No unread emails')
          // Don't close connection, we'll need it for next check
          return
        }
        
        console.log(`📧 Found ${results.length} unread emails`)
        
        // Fetch only unread emails - fetch complete RFC822 message
        const fetch = this.imap!.fetch(results, {
          bodies: '',  // Fetch entire message
          struct: false,  // Don't need structure
          markSeen: true  // Mark as seen when fetched
        })

      fetch.on('message', (msg, seqno) => {
        msg.on('body', (stream, info) => {
          // Use simpleParser to parse the complete email
          simpleParser(stream, async (err, parsed) => {
            if (!err && parsed) {
              this.processedCount++
              
              // Emit simple event with email data including body
              this.emit('mail:received', {
                from: parsed.from?.text || 'Unknown',
                to: parsed.to,
                subject: parsed.subject || 'No Subject',
                date: parsed.date || new Date(),
                text: parsed.text || '',
                html: parsed.html || '',
                messageId: parsed.messageId,
                count: this.processedCount
              })

              // Emit for brain to see
              this.emit('email:processed', {
                messageId: parsed.messageId || `email_${Date.now()}`,
                from: parsed.from?.text,
                subject: parsed.subject,
                processed: this.processedCount,
                total: box.messages.total
              })
              
            }
          })
        })
      })

        fetch.once('end', () => {
          console.log(`✅ Processed ${this.processedCount} emails`)
          // Don't close connection, keep it open for next check
        })
      })
    })
  }

  async disconnect(): Promise<void> {
    if (this.imap) {
      this.imap.end()
      this.isConnected = false
      this.emit('disconnected')
    }
  }

  async sendEmail(to: string, subject: string, body: string, inReplyTo?: string): Promise<void> {
    if (!this.smtpTransporter) {
      throw new Error('SMTP transporter not configured')
    }
    
    const mailOptions = {
      from: this.config.smtp?.from || 'phil@qwanyx.com',
      to: to,
      subject: subject,
      text: body,
      html: body.replace(/\n/g, '<br>'),
      headers: inReplyTo ? {
        'In-Reply-To': inReplyTo,
        'References': inReplyTo
      } : undefined
    }
    
    try {
      const result = await this.smtpTransporter.sendMail(mailOptions)
      console.log('📤 Email sent successfully:', result.messageId)
      this.emit('email:sent', {
        to,
        subject,
        messageId: result.messageId
      })
      return result
    } catch (error) {
      console.error('❌ Failed to send email:', error)
      throw error
    }
  }

  getStatus() {
    return {
      connected: this.isConnected,
      processed: this.processedCount,
      config: {
        host: this.config.imap.host,
        user: this.config.imap.user
      }
    }
  }
}