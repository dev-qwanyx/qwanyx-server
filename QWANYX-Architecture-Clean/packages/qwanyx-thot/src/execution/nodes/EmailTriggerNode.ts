// Email trigger node - listens for incoming emails
import { BaseNode } from './BaseNode'
import { ExecutionContext, NodeResult } from '../types'
import { z } from 'zod'

const ConfigSchema = z.object({
  checkInterval: z.number().min(10).default(60), // seconds
  folder: z.string().default('INBOX'),
  markAsRead: z.boolean().default(false),
  filters: z.object({
    from: z.string().optional(),
    subject: z.string().optional(),
    unreadOnly: z.boolean().default(true)
  }).optional()
})

export class EmailTriggerNode extends BaseNode {
  static nodeType = 'email-trigger'
  
  getConfigSchema() {
    return ConfigSchema
  }
  
  async execute(context: ExecutionContext): Promise<NodeResult> {
    try {
      await this.log(context, 'info', 'Email trigger activated', {
        folder: this.data.folder,
        filters: this.data.filters
      })
      
      // Get IMAP credentials from memory
      const credentials = await context.services.memory.get('credentials.imap')
      if (!credentials) {
        return this.failure('No IMAP credentials configured')
      }
      
      // In a real implementation, this would:
      // 1. Connect to IMAP server
      // 2. Check for new emails matching filters
      // 3. Return email data as output
      
      // For now, simulate finding an email
      const mockEmail = {
        id: 'email_' + Date.now(),
        from: 'customer@example.com',
        to: context.dhEmail,
        subject: 'Need help with order',
        body: 'Hi, I need assistance with my recent order #12345',
        date: new Date(),
        attachments: []
      }
      
      await this.log(context, 'info', 'Email received', {
        from: mockEmail.from,
        subject: mockEmail.subject
      })
      
      // Store email in memory for context
      await context.services.memory.addMemory({
        type: 'email',
        data: mockEmail,
        tags: ['inbox', 'unprocessed'],
        metadata: {
          importance: 0.7
        }
      })
      
      // Return email as output and trigger next nodes
      return this.success(
        mockEmail,
        undefined, // Let the flow determine next nodes
        { lastEmail: mockEmail }
      )
      
    } catch (error: any) {
      await this.log(context, 'error', 'Email trigger failed', error)
      return this.failure(error.message)
    }
  }
}