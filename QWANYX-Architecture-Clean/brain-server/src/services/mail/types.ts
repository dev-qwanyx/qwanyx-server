// Mail Service Types and Interfaces

export interface MailConfig {
  imap: {
    user: string
    password: string
    host: string
    port: number
    tls: boolean
    authTimeout?: number
  }
  smtp: {
    host: string
    port: number
    secure: boolean
    auth: {
      user: string
      pass: string
    }
    from: string  // Default from address
  }
  polling: {
    enabled: boolean
    interval: number  // milliseconds
    folders: string[]  // ['INBOX', 'Sent']
  }
}

export interface EmailData {
  messageId: string
  threadId?: string
  from: {
    email: string
    name?: string
  }
  to: Array<{
    email: string
    name?: string
  }>
  cc?: Array<{
    email: string
    name?: string
  }>
  bcc?: Array<{
    email: string
    name?: string
  }>
  subject: string
  body: {
    text?: string
    html?: string
  }
  date: Date
  folder: string
  flags: string[]  // ['\\Seen', '\\Answered', etc.]
  attachments?: Array<{
    filename: string
    size: number
    mimeType: string
    content?: Buffer
  }>
}

export interface ContactNode {
  _id?: string
  type: 'contact'
  data: {
    email: string
    name?: string
    firstName?: string
    lastName?: string
    company?: string
    tags?: string[]
    firstContact?: Date
    lastContact?: Date
    messageCount?: number
    metadata?: {
      source: 'email'
      autoCreated: boolean
    }
  }
}

export interface EmailNode {
  _id?: string
  type: 'email'
  data: EmailData & {
    contactId?: string  // Reference to contact node
    isRead?: boolean
    isAnswered?: boolean
    isDraft?: boolean
    labels?: string[]
  }
}

export interface MailServiceEvents {
  'email:received': (email: EmailNode) => void
  'email:sent': (email: EmailNode) => void
  'mail:received': (email: EmailNode) => void
  'contact:created': (contact: ContactNode) => void
  'contact:updated': (contact: ContactNode) => void
  'error': (error: Error) => void
  'connected': () => void
  'disconnected': () => void
}