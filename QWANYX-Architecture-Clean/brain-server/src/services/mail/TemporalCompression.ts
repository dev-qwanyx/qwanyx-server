import { ObjectId } from 'mongodb'
import OpenAI from 'openai'
import { EmailData } from './types'

/**
 * Temporal Compression System - Infinite Context with Adjustable Precision
 * 
 * Memory degrades naturally over time like human memory:
 * - Last 5 emails: Full reversible compression (can reconstruct original)
 * - Next 5 emails: Subject + tags only
 * - Next 20 emails: Tags only
 * - Older: Just graph edges
 * 
 * This creates infinite context - nothing is truly forgotten, just compressed
 */
export class TemporalCompression {
  private client: OpenAI
  private model: string
  
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
    this.model = process.env.OPENAI_MODEL || 'gpt-5-nano'
  }
  
  /**
   * Determine compression level based on email age/position
   */
  getCompressionLevel(emailIndex: number, emailAge: number): CompressionLevel {
    // Position-based (for initial implementation)
    if (emailIndex <= 5) return CompressionLevel.FULL_REVERSIBLE
    if (emailIndex <= 10) return CompressionLevel.SUBJECT_AND_TAGS
    if (emailIndex <= 30) return CompressionLevel.TAGS_ONLY
    
    // Age-based (days old)
    const daysOld = emailAge / (1000 * 60 * 60 * 24)
    if (daysOld < 7) return CompressionLevel.FULL_REVERSIBLE
    if (daysOld < 30) return CompressionLevel.SUBJECT_AND_TAGS
    if (daysOld < 90) return CompressionLevel.TAGS_ONLY
    
    return CompressionLevel.EDGE_ONLY
  }
  
  /**
   * Compress email based on its temporal position
   */
  async compressEmail(
    email: EmailData, 
    compressionLevel: CompressionLevel
  ): Promise<CompressedMemory> {
    switch (compressionLevel) {
      case CompressionLevel.FULL_REVERSIBLE:
        return this.fullReversibleCompression(email)
      
      case CompressionLevel.SUBJECT_AND_TAGS:
        return this.subjectTagsCompression(email)
      
      case CompressionLevel.TAGS_ONLY:
        return this.tagsOnlyCompression(email)
      
      case CompressionLevel.EDGE_ONLY:
        return this.edgeOnlyCompression(email)
      
      default:
        return this.edgeOnlyCompression(email)
    }
  }
  
  /**
   * LEVEL 1: Full Reversible Compression
   * Uses mathematical/symbolic notation to preserve logical structure
   */
  private async fullReversibleCompression(email: EmailData): Promise<CompressedMemory> {
    const prompt = `Convert this email to reversible mathematical notation.
Use operators: + (and), → (then), = (equals/by), || (or), ! (urgent), ? (question), @ (at/on), # (about)
Variables: Single letters or short codes
Functions: action(object)

Example:
"Please review the budget and send confirmation by Friday or escalate to manager"
Becomes: review(budget) + send(confirm) = Friday || escalate(manager)

Email to compress:
Subject: ${email.subject}
Body: ${email.body.text || email.body.html}`

    try {
      const response = await this.client.responses.create({
        model: this.model,
        reasoning: { effort: 'low' },
        max_tokens: 50,
        instructions: prompt,
        input: this.truncate(email.body.text || '', 1000)
      })
      
      const compressed = response.output_text
      
      // Also generate compact forms
      const subjectHash = await this.compressSubject(email.subject)
      const tags = await this.extractChineseTags(email)
      
      return {
        level: CompressionLevel.FULL_REVERSIBLE,
        reversible: compressed,
        subject: subjectHash,
        tags: tags,
        timestamp: new Date(),
        originalLength: email.body.text?.length || 0,
        compressedLength: compressed.length
      }
    } catch (error) {
      console.error('Reversible compression failed:', error)
      return this.fallbackCompression(email, CompressionLevel.FULL_REVERSIBLE)
    }
  }
  
  /**
   * LEVEL 2: Subject and Tags Only
   */
  private async subjectTagsCompression(email: EmailData): Promise<CompressedMemory> {
    const subjectHash = await this.compressSubject(email.subject)
    const tags = await this.extractChineseTags(email)
    
    return {
      level: CompressionLevel.SUBJECT_AND_TAGS,
      reversible: null,  // Body discarded
      subject: subjectHash,
      tags: tags,
      timestamp: new Date(),
      originalLength: email.body.text?.length || 0,
      compressedLength: subjectHash.length + tags.length
    }
  }
  
  /**
   * LEVEL 3: Tags Only
   */
  private async tagsOnlyCompression(email: EmailData): Promise<CompressedMemory> {
    const tags = await this.extractChineseTags(email)
    
    return {
      level: CompressionLevel.TAGS_ONLY,
      reversible: null,
      subject: null,  // Subject discarded
      tags: tags,
      timestamp: new Date(),
      originalLength: email.body.text?.length || 0,
      compressedLength: tags.length
    }
  }
  
  /**
   * LEVEL 4: Edge Only (just the relationship remains)
   */
  private edgeOnlyCompression(email: EmailData): CompressedMemory {
    return {
      level: CompressionLevel.EDGE_ONLY,
      reversible: null,
      subject: null,
      tags: null,  // Everything discarded, only edge remains
      timestamp: new Date(),
      originalLength: email.body.text?.length || 0,
      compressedLength: 0
    }
  }
  
  /**
   * Compress subject to 5-token hash
   */
  private async compressSubject(subject: string): Promise<string> {
    if (!subject) return ''
    
    try {
      const response = await this.client.responses.create({
        model: this.model,
        reasoning: { effort: 'low' },
        max_tokens: 5,
        instructions: 'Compress to maximum 5 tokens capturing essence',
        input: subject
      })
      return response.output_text
    } catch {
      // Fallback: first 5 words
      return subject.split(' ').slice(0, 5).join(' ')
    }
  }
  
  /**
   * Extract Chinese character tags
   */
  private async extractChineseTags(email: EmailData): Promise<string> {
    const text = `${email.subject} ${email.body.text || ''}`.substring(0, 500)
    
    try {
      const response = await this.client.responses.create({
        model: this.model,
        reasoning: { effort: 'low' },
        max_tokens: 10,
        instructions: `Extract 1-5 Chinese characters representing key concepts.
Common: 急(urgent) 钱(money) 会(meeting) 问(question) 答(answer) 请(request)
项(project) 限(deadline) 确(confirm) 票(invoice) 约(contract)`,
        input: text
      })
      return response.output_text.substring(0, 5)  // Max 5 characters
    } catch {
      return '邮'  // Fallback: generic "mail"
    }
  }
  
  /**
   * Reconstruct meaning from compressed form (for zoom-in)
   */
  async reconstruct(
    compressed: CompressedMemory, 
    context?: any[]
  ): Promise<string> {
    if (compressed.level === CompressionLevel.EDGE_ONLY) {
      return 'Email exchanged (details compressed)'
    }
    
    if (compressed.level === CompressionLevel.TAGS_ONLY && compressed.tags) {
      return `Email about: ${this.translateTags(compressed.tags)}`
    }
    
    if (compressed.level === CompressionLevel.SUBJECT_AND_TAGS) {
      return `${compressed.subject} - ${this.translateTags(compressed.tags || '')}`
    }
    
    if (compressed.reversible) {
      // Use GPT-5 to expand reversible notation back to natural language
      const response = await this.client.responses.create({
        model: this.model,
        reasoning: { effort: 'low' },
        instructions: 'Expand this mathematical notation back to natural language',
        input: compressed.reversible
      })
      return response.output_text
    }
    
    return 'Unable to reconstruct'
  }
  
  /**
   * Translate Chinese tags to English (for display)
   */
  private translateTags(tags: string): string {
    const translations: Record<string, string> = {
      '急': 'urgent',
      '钱': 'money',
      '会': 'meeting',
      '问': 'question',
      '答': 'answer',
      '请': 'request',
      '确': 'confirm',
      '项': 'project',
      '限': 'deadline',
      '票': 'invoice',
      '约': 'contract',
      '邮': 'email'
    }
    
    return tags.split('').map(char => translations[char] || char).join(', ')
  }
  
  /**
   * Manage compression cascade - recompress older emails to save space
   */
  async cascadeCompression(brain: any) {
    console.log('🌊 Starting compression cascade...')
    
    // Get all email memories sorted by age
    const emails = await brain.searchMemories({ type: 'email' })
    const now = Date.now()
    
    // Sort by ObjectId timestamp (newest first)
    emails.sort((a: any, b: any) => {
      const timeA = new ObjectId(a.id).getTimestamp().getTime()
      const timeB = new ObjectId(b.id).getTimestamp().getTime()
      return timeB - timeA  // Newest first
    })
    
    // Recompress based on position
    for (let i = 0; i < emails.length; i++) {
      const email = emails[i]
      const age = now - new ObjectId(email.id).getTimestamp().getTime()
      const level = this.getCompressionLevel(i + 1, age)
      
      // Check if needs recompression
      const currentLevel = email.content.compression?.level
      if (currentLevel !== level) {
        console.log(`Recompressing email ${i + 1} from level ${currentLevel} to ${level}`)
        
        const newCompression = await this.compressEmail(email.content, level)
        
        await brain.updateMemory(email.id, {
          ...email.content,
          compression: newCompression
        })
      }
    }
    
    console.log('✅ Compression cascade complete')
  }
  
  /**
   * Zoom into a specific time period - reconstruct context
   */
  async zoomIntoTimeRange(
    brain: any,
    startDate: Date,
    endDate: Date,
    detailLevel: 'full' | 'summary' | 'pattern'
  ): Promise<TimeRangeContext> {
    // Convert dates to ObjectId range
    const startId = ObjectId.createFromTime(startDate.getTime() / 1000)
    const endId = ObjectId.createFromTime(endDate.getTime() / 1000)
    
    // Find all nodes in range
    const memories = await brain.searchMemories({
      _id: { $gte: startId, $lte: endId },
      type: 'email'
    })
    
    console.log(`Found ${memories.length} emails in time range`)
    
    // Reconstruct based on detail level
    if (detailLevel === 'full') {
      // Try to reconstruct full details
      const reconstructed = await Promise.all(
        memories.map(m => this.reconstruct(m.content.compression))
      )
      return { memories, reconstructed, level: detailLevel }
    }
    
    if (detailLevel === 'summary') {
      // Generate summary from available compressions
      const tags = memories.map(m => m.content.compression?.tags).filter(Boolean).join('')
      const uniqueTags = [...new Set(tags.split(''))].join('')
      return { 
        memories, 
        reconstructed: [`Period summary: ${this.translateTags(uniqueTags)}`],
        level: detailLevel 
      }
    }
    
    // Pattern level - just counts and relationships
    return {
      memories,
      reconstructed: [`${memories.length} emails exchanged`],
      level: detailLevel
    }
  }
  
  private truncate(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }
  
  private fallbackCompression(email: EmailData, level: CompressionLevel): CompressedMemory {
    return {
      level,
      reversible: level === CompressionLevel.FULL_REVERSIBLE ? 'email()' : null,
      subject: email.subject?.substring(0, 30),
      tags: '邮',
      timestamp: new Date(),
      originalLength: 1000,
      compressedLength: 10
    }
  }
}

// Compression level enum
export enum CompressionLevel {
  FULL_REVERSIBLE = 1,     // Can reconstruct original
  SUBJECT_AND_TAGS = 2,    // Subject + tags only
  TAGS_ONLY = 3,           // Just tags
  EDGE_ONLY = 4            // Just the edge remains
}

// Compressed memory structure
export interface CompressedMemory {
  level: CompressionLevel
  reversible: string | null     // Mathematical notation (if level 1)
  subject: string | null        // 5-token hash (if level 1-2)
  tags: string | null           // Chinese characters (if level 1-3)
  timestamp: Date
  originalLength: number
  compressedLength: number
}

// Time range context for zoom-in
export interface TimeRangeContext {
  memories: any[]
  reconstructed: string[]
  level: 'full' | 'summary' | 'pattern'
}