// Response node - generates and sends responses
import { BaseNode } from './BaseNode'
import { ExecutionContext, NodeResult } from '../types'
import { z } from 'zod'

const ConfigSchema = z.object({
  responseType: z.enum(['email', 'sms', 'webhook', 'database']).default('email'),
  template: z.string().optional(),
  useAI: z.boolean().default(true),
  tone: z.enum(['formal', 'friendly', 'casual', 'professional']).default('professional')
})

export class ResponseNode extends BaseNode {
  static nodeType = 'response'
  
  getConfigSchema() {
    return ConfigSchema
  }
  
  async execute(context: ExecutionContext): Promise<NodeResult> {
    try {
      const analysis = context.variables.lastAnalysis
      const email = context.variables.lastEmail
      
      if (!analysis && !email) {
        return this.failure('No context to respond to')
      }
      
      await this.log(context, 'info', 'Generating response', {
        type: this.data.responseType,
        useAI: this.data.useAI
      })
      
      // Generate response based on analysis
      let responseText = ''
      
      if (this.data.template) {
        // Use template
        responseText = this.applyTemplate(this.data.template, { analysis, email, context })
      } else if (this.data.useAI) {
        // Generate with AI (mock for now)
        responseText = this.generateAIResponse(analysis, email)
      } else {
        // Default response
        responseText = 'Thank you for your message. We have received your inquiry and will respond shortly.'
      }
      
      // Apply tone
      responseText = this.applyTone(responseText, this.data.tone)
      
      // Send response based on type
      let result = null
      switch (this.data.responseType) {
        case 'email':
          result = await this.sendEmailResponse(context, email, responseText)
          break
        case 'database':
          result = await this.saveToDatabaseResponse(context, responseText)
          break
        default:
          result = { sent: true, type: this.data.responseType }
      }
      
      // Log the response
      await context.services.memory.addMemory({
        type: 'response',
        data: {
          text: responseText,
          type: this.data.responseType,
          recipient: email?.from,
          result
        },
        tags: ['response', 'sent'],
        metadata: {
          importance: 0.8
        }
      })
      
      await this.log(context, 'info', 'Response sent', {
        type: this.data.responseType,
        length: responseText.length
      })
      
      return this.success({
        response: responseText,
        result
      })
      
    } catch (error: any) {
      await this.log(context, 'error', 'Response generation failed', error)
      return this.failure(error.message)
    }
  }
  
  private applyTemplate(template: string, data: any): string {
    // Simple template replacement
    let result = template
    
    // Replace {{variable}} patterns
    result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return this.getNestedValue(data, key) || match
    })
    
    return result
  }
  
  private getNestedValue(obj: any, path: string): any {
    const keys = path.split('.')
    let value = obj
    
    for (const key of keys) {
      if (value && typeof value === 'object') {
        value = value[key]
      } else {
        return undefined
      }
    }
    
    return value
  }
  
  private generateAIResponse(analysis: any, email: any): string {
    // Mock AI response generation based on intent
    const intent = analysis?.intent || 'general_inquiry'
    const sentiment = analysis?.sentiment || 'neutral'
    
    let response = ''
    
    // Greeting
    response += `Hello${email?.from ? ' ' + email.from.split('@')[0] : ''},\n\n`
    
    // Main response based on intent
    switch (intent) {
      case 'request_help':
        response += 'I understand you need assistance. I\'m here to help you resolve your issue as quickly as possible.'
        break
      case 'order_inquiry':
        response += 'I see you have a question about your order. Let me look into that for you.'
        if (analysis?.entities?.orderNumbers) {
          response += ` I can see you mentioned order #${analysis.entities.orderNumbers[0]}.`
        }
        break
      case 'cancellation_request':
        response += 'I understand you\'d like to cancel or request a refund. I\'ll help you with that process.'
        break
      case 'appreciation':
        response += 'Thank you for your kind words! It\'s our pleasure to assist you.'
        break
      default:
        response += 'Thank you for contacting us. I\'ve received your message and I\'m here to help.'
    }
    
    // Add sentiment-based touch
    if (sentiment === 'negative') {
      response += '\n\nI apologize for any inconvenience you may have experienced.'
    }
    
    // Closing
    response += '\n\nIs there anything specific I can help you with today?\n\nBest regards,\nSupport Team'
    
    return response
  }
  
  private applyTone(text: string, tone: string): string {
    // Apply tone adjustments (simplified)
    switch (tone) {
      case 'formal':
        return text.replace(/Hi /g, 'Dear ')
                   .replace(/Thanks/g, 'Thank you')
                   .replace(/\!/g, '.')
      case 'casual':
        return text.replace(/Dear /g, 'Hey ')
                   .replace(/Thank you/g, 'Thanks')
      case 'friendly':
        return text.replace(/\./g, '! ')
                   .replace(/! !/g, '!')
                   .replace(/! $/, '! 😊')
      default:
        return text
    }
  }
  
  private async sendEmailResponse(context: ExecutionContext, email: any, text: string): Promise<any> {
    // Get SMTP credentials from memory
    const credentials = await context.services.memory.get('credentials.smtp')
    if (!credentials) {
      throw new Error('No SMTP credentials configured')
    }
    
    // In real implementation, would send email via SMTP
    // For now, mock the sending
    await this.log(context, 'info', 'Sending email', {
      to: email?.from,
      subject: `Re: ${email?.subject || 'Your inquiry'}`
    })
    
    return {
      sent: true,
      to: email?.from,
      subject: `Re: ${email?.subject || 'Your inquiry'}`,
      timestamp: new Date()
    }
  }
  
  private async saveToDatabaseResponse(context: ExecutionContext, text: string): Promise<any> {
    // Save response to database
    const result = await context.services.memory.addMemory({
      type: 'response',
      data: { text, generated: new Date() },
      tags: ['response', 'database'],
      metadata: { importance: 0.7 }
    })
    
    return {
      saved: true,
      id: result,
      timestamp: new Date()
    }
  }
}