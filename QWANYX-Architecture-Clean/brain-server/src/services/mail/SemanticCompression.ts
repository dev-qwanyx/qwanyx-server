import OpenAI from 'openai'
import { EmailData } from './types'

/**
 * Semantic Compression Service - Simple Version
 * - Subject: Compressed to semantic hash (5 tokens max)
 * - Body: Compressed to essential meaning
 * - Tags: Up to 5 Chinese characters (ultra-dense semantic encoding)
 */
export class SemanticCompression {
  private client: OpenAI
  private model: string
  
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
    this.model = process.env.OPENAI_MODEL || 'gpt-5-nano'
  }
  
  /**
   * Simple compression - can be refined later
   */
  async compressEmail(email: EmailData): Promise<CompressedEmail> {
    try {
      // Prepare email text
      const emailText = `
Subject: ${email.subject}
From: ${email.from.email}
Date: ${email.date}
Body: ${this.truncateBody(email.body.text || email.body.html || '', 2000)}
`
      
      // Single GPT-5 Nano call for all compressions
      const response = await this.client.responses.create({
        model: this.model,
        reasoning: { effort: 'low' },  // Fast processing
        max_tokens: 100,  // Limit total output
        instructions: `Compress this email into:
1. SUBJECT_HASH: Maximum 5 tokens capturing the essence
2. BODY_SUMMARY: One sentence, maximum 20 tokens
3. CHINESE_TAGS: Up to 5 Chinese characters, each representing a key concept
4. IMPORTANCE: Score 1-10

Format as JSON.

Example output:
{
  "subject_hash": "budget review Q4",
  "body_summary": "Sarah needs budget confirmation by Friday for board meeting",
  "chinese_tags": "急预算审核限期会",
  "importance": 8
}

Chinese character suggestions:
急(urgent) 钱(money) 会(meeting) 问(question) 答(answer)
请(request) 确(confirm) 邀(invite) 醒(remind) 告(announce)
票(invoice) 付(payment) 约(contract) 提(proposal) 价(quote)
项(project) 限(deadline) 标(milestone) 交(deliver) 预(budget)`,
        input: emailText
      })
      
      // Parse response
      const compressed = JSON.parse(response.output_text)
      
      return {
        subjectHash: compressed.subject_hash,
        bodySummary: compressed.body_summary,
        chineseTags: compressed.chinese_tags,
        importance: compressed.importance,
        originalLength: emailText.length,
        compressedLength: JSON.stringify(compressed).length,
        compressionRatio: 1 - (JSON.stringify(compressed).length / emailText.length)
      }
      
    } catch (error) {
      console.error('Compression failed:', error)
      // Fallback compression
      return this.fallbackCompression(email)
    }
  }
  
  /**
   * Batch processing for efficiency
   */
  async processBatch(emails: EmailData[]): Promise<CompressedEmail[]> {
    // For now, process individually
    // Can optimize later to use full 400k context
    const results: CompressedEmail[] = []
    
    for (const email of emails) {
      const compressed = await this.compressEmail(email)
      results.push(compressed)
      
      // Log compression stats
      console.log(`📊 Compressed: ${email.subject}`)
      console.log(`   Hash: ${compressed.subjectHash}`)
      console.log(`   Tags: ${compressed.chineseTags}`)
      console.log(`   Ratio: ${(compressed.compressionRatio * 100).toFixed(1)}%`)
    }
    
    return results
  }
  
  /**
   * Fallback when AI fails
   */
  private fallbackCompression(email: EmailData): CompressedEmail {
    const subject = email.subject || 'No Subject'
    const subjectWords = subject.split(' ').slice(0, 5).join(' ')
    
    return {
      subjectHash: subjectWords.substring(0, 30),
      bodySummary: subject,
      chineseTags: '邮',  // Generic "mail" character
      importance: 5,
      originalLength: 1000,
      compressedLength: 100,
      compressionRatio: 0.9
    }
  }
  
  /**
   * Truncate body for processing
   */
  private truncateBody(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }
  
  /**
   * Recompress all emails (for when we improve the algorithm)
   */
  async recompressAll(brain: any) {
    console.log('🔄 Starting recompression of all emails...')
    
    // Get all email nodes
    const emails = await brain.searchMemories({
      type: 'email'
    })
    
    console.log(`Found ${emails.length} emails to recompress`)
    
    // Process in batches
    const batchSize = 50
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize)
      
      for (const emailMemory of batch) {
        // Recompress
        const compressed = await this.compressEmail(emailMemory.content)
        
        // Update memory with new compression
        await brain.updateMemory(emailMemory.id, {
          ...emailMemory.content,
          compression: compressed
        })
      }
      
      console.log(`Recompressed ${Math.min(i + batchSize, emails.length)}/${emails.length}`)
    }
    
    console.log('✅ Recompression complete!')
  }
}

// Type definitions
export interface CompressedEmail {
  subjectHash: string      // 5 tokens max - semantic identifier
  bodySummary: string      // One sentence essence
  chineseTags: string      // Up to 5 Chinese characters
  importance: number       // 1-10 scale
  originalLength: number
  compressedLength: number
  compressionRatio: number
}

export interface ProcessedEmail {
  original: EmailData
  compression: CompressedEmail
}