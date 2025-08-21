// Analyze node - understands and extracts information
import { BaseNode } from './BaseNode'
import { ExecutionContext, NodeResult } from '../types'
import { z } from 'zod'

const ConfigSchema = z.object({
  analysisType: z.enum(['sentiment', 'intent', 'entities', 'summary', 'all']).default('all'),
  extractFields: z.array(z.string()).optional(),
  useAI: z.boolean().default(true)
})

export class AnalyzeNode extends BaseNode {
  static nodeType = 'analyze'
  
  getConfigSchema() {
    return ConfigSchema
  }
  
  async execute(context: ExecutionContext): Promise<NodeResult> {
    try {
      const input = context.input
      if (!input) {
        return this.failure('No input to analyze')
      }
      
      await this.log(context, 'info', 'Analyzing content', {
        type: this.data.analysisType,
        inputType: typeof input
      })
      
      // Extract text to analyze
      let textToAnalyze = ''
      if (typeof input === 'string') {
        textToAnalyze = input
      } else if (input.body) {
        textToAnalyze = input.body
      } else if (input.text) {
        textToAnalyze = input.text
      } else {
        textToAnalyze = JSON.stringify(input)
      }
      
      // Perform analysis (mock for now)
      const analysis = {
        text: textToAnalyze,
        sentiment: this.analyzeSentiment(textToAnalyze),
        intent: this.detectIntent(textToAnalyze),
        entities: this.extractEntities(textToAnalyze),
        summary: this.generateSummary(textToAnalyze),
        timestamp: new Date()
      }
      
      // Store analysis in memory
      await context.services.memory.addMemory({
        type: 'analysis',
        data: analysis,
        tags: ['analysis', this.data.analysisType],
        metadata: {
          confidence: 0.85
        }
      })
      
      await this.log(context, 'info', 'Analysis complete', {
        sentiment: analysis.sentiment,
        intent: analysis.intent
      })
      
      return this.success(
        analysis,
        undefined,
        { lastAnalysis: analysis }
      )
      
    } catch (error: any) {
      await this.log(context, 'error', 'Analysis failed', error)
      return this.failure(error.message)
    }
  }
  
  private analyzeSentiment(text: string): string {
    // Simple mock sentiment analysis
    const positiveWords = ['help', 'please', 'thank', 'appreciate', 'good']
    const negativeWords = ['problem', 'issue', 'broken', 'bad', 'angry']
    
    const textLower = text.toLowerCase()
    const hasPositive = positiveWords.some(word => textLower.includes(word))
    const hasNegative = negativeWords.some(word => textLower.includes(word))
    
    if (hasPositive && !hasNegative) return 'positive'
    if (hasNegative && !hasPositive) return 'negative'
    if (hasPositive && hasNegative) return 'mixed'
    return 'neutral'
  }
  
  private detectIntent(text: string): string {
    // Simple intent detection
    const textLower = text.toLowerCase()
    
    if (textLower.includes('help') || textLower.includes('assist')) {
      return 'request_help'
    }
    if (textLower.includes('order') || textLower.includes('purchase')) {
      return 'order_inquiry'
    }
    if (textLower.includes('cancel') || textLower.includes('refund')) {
      return 'cancellation_request'
    }
    if (textLower.includes('thank') || textLower.includes('appreciate')) {
      return 'appreciation'
    }
    
    return 'general_inquiry'
  }
  
  private extractEntities(text: string): Record<string, any> {
    // Simple entity extraction
    const entities: Record<string, any> = {}
    
    // Extract order numbers
    const orderMatch = text.match(/#(\d+)/g)
    if (orderMatch) {
      entities.orderNumbers = orderMatch.map(m => m.slice(1))
    }
    
    // Extract emails
    const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g)
    if (emailMatch) {
      entities.emails = emailMatch
    }
    
    // Extract dates
    const dateMatch = text.match(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g)
    if (dateMatch) {
      entities.dates = dateMatch
    }
    
    return entities
  }
  
  private generateSummary(text: string): string {
    // Simple summary (first 100 chars)
    return text.length > 100 ? text.substring(0, 97) + '...' : text
  }
}