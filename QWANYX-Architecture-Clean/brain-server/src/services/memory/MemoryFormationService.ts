import { ObjectId } from 'mongodb'
import OpenAI from 'openai'
import { Brain } from '../../core/Brain'

/**
 * Universal Memory Formation Service
 * Implements infinite context through temporal compression
 * Works with any memory type: emails, conversations, documents, tasks, etc.
 */
export class MemoryFormationService {
  private client: OpenAI
  private model: string
  private brain: Brain
  private compressionStats: Map<string, CompressionStats> = new Map()
  
  constructor(brainId: string) {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
    this.model = process.env.OPENAI_MODEL || 'gpt-5-nano'
    this.brain = new Brain(brainId)
  }
  
  /**
   * Main entry point - process any type of memory
   */
  async formMemory(input: MemoryInput): Promise<FormedMemory> {
    console.log(`🧠 Forming ${input.type} memory...`)
    
    // Step 1: Create initial memory node
    const memoryNode = await this.createMemoryNode(input)
    
    // Step 2: Compress based on type and importance
    const compression = await this.compressMemory(input)
    
    // Step 3: Store with compression
    const storedMemory = await this.brain.createMemory({
      type: input.type,
      content: input.content,
      compression: compression,
      metadata: {
        timestamp: new Date(),
        importance: compression.importance,
        ...input.metadata
      }
    })
    
    // Step 4: Create semantic edges
    await this.createSemanticEdges(storedMemory.id, compression)
    
    // Step 5: Run cascade on older memories
    await this.cascadeCompression(input.type)
    
    return {
      id: storedMemory.id,
      type: input.type,
      compression: compression,
      stored: true
    }
  }
  
  /**
   * Compress memory using GPT-5 Nano
   */
  private async compressMemory(input: MemoryInput): Promise<MemoryCompression> {
    // Determine compression technique based on content type
    const technique = this.selectTechnique(input)
    
    try {
      const response = await this.client.responses.create({
        model: this.model,
        reasoning: { effort: 'low' },
        max_tokens: technique.maxTokens,
        instructions: this.buildCompressionPrompt(technique, input.type),
        input: JSON.stringify({
          content: this.truncateForContext(input.content, 2000),
          type: input.type,
          metadata: input.metadata
        })
      })
      
      const result = JSON.parse(response.output_text)
      
      return {
        level: CompressionLevel.FULL,
        reversible: result.reversible || null,
        essence: result.essence || null,
        tags: result.tags || [],
        chineseTags: result.chineseTags || '',
        importance: result.importance || 5,
        entities: result.entities || {},
        technique: technique.name,
        originalSize: JSON.stringify(input.content).length,
        compressedSize: response.output_text.length,
        compressionRatio: 1 - (response.output_text.length / JSON.stringify(input.content).length)
      }
    } catch (error) {
      console.error('Compression failed:', error)
      return this.fallbackCompression(input)
    }
  }
  
  /**
   * Build compression prompt based on technique and content type
   */
  private buildCompressionPrompt(technique: CompressionTechnique, type: string): string {
    const basePrompt = `Compress this ${type} memory using ${technique.name} technique.
Output JSON with these fields based on what's applicable:
- reversible: Mathematical notation that preserves meaning (if possible)
- essence: Core meaning in ${technique.maxTokens} tokens
- tags: Array of key concepts
- chineseTags: 1-5 Chinese characters for ultra-dense encoding
- importance: 1-10 score
- entities: {people, dates, amounts, locations, objects}`

    // Type-specific instructions
    const typeInstructions: Record<string, string> = {
      email: `
Focus on: sender intent, required actions, deadlines
Reversible format: action(object) + condition = deadline || alternative`,
      
      conversation: `
Focus on: key points, decisions, questions, agreements
Reversible format: speaker:statement → response ? decision`,
      
      document: `
Focus on: main topic, key facts, conclusions
Reversible format: topic{facts} → conclusion # metadata`,
      
      task: `
Focus on: action, owner, deadline, dependencies
Reversible format: do(what) @ when || blocked_by(what)`,
      
      thought: `
Focus on: idea, connections, insights
Reversible format: concept + concept → insight`,
      
      learning: `
Focus on: concept, understanding level, applications
Reversible format: learn(topic) = understanding_level + applications`
    }
    
    return basePrompt + (typeInstructions[type] || '')
  }
  
  /**
   * Select compression technique based on content
   */
  private selectTechnique(input: MemoryInput): CompressionTechnique {
    // Size-based selection
    const contentSize = JSON.stringify(input.content).length
    
    if (contentSize < 500) {
      return TECHNIQUES.ESSENCE
    } else if (contentSize < 2000) {
      return TECHNIQUES.SKELETON  
    } else if (contentSize < 5000) {
      return TECHNIQUES.MATHEMATICAL
    } else {
      return TECHNIQUES.HIERARCHICAL
    }
  }
  
  /**
   * Create semantic edges in the graph
   */
  private async createSemanticEdges(memoryId: string, compression: MemoryCompression) {
    // Create edges for Chinese tags
    if (compression.chineseTags) {
      for (const char of compression.chineseTags) {
        await this.brain.addEdge({
          id: `tag-${memoryId}-${char}`,
          source: memoryId,
          target: `semantic-${char}`,
          type: 'tagged'
        })
      }
    }
    
    // Create edges for entities
    if (compression.entities) {
      // People edges
      for (const person of compression.entities.people || []) {
        await this.brain.addEdge({
          id: `person-${memoryId}-${person}`,
          source: memoryId,
          target: `entity-person-${person}`,
          type: 'mentions'
        })
      }
      
      // Date edges (for temporal queries)
      for (const date of compression.entities.dates || []) {
        await this.brain.addEdge({
          id: `date-${memoryId}-${date}`,
          source: memoryId,
          target: `temporal-${date}`,
          type: 'occurred'
        })
      }
    }
  }
  
  /**
   * Cascade compression on older memories
   */
  async cascadeCompression(type?: string) {
    console.log('🌊 Running compression cascade...')
    
    // Get memories of this type
    const query = type ? { type } : {}
    const memories = await this.brain.searchMemories(query)
    
    // Sort by age (newest first)
    memories.sort((a, b) => {
      const timeA = new ObjectId(a.id).getTimestamp().getTime()
      const timeB = new ObjectId(b.id).getTimestamp().getTime()
      return timeB - timeA
    })
    
    // Process each memory
    for (let i = 0; i < memories.length; i++) {
      const memory = memories[i]
      const age = Date.now() - new ObjectId(memory.id).getTimestamp().getTime()
      const currentLevel = memory.content.compression?.level || CompressionLevel.FULL
      const targetLevel = this.getTargetCompressionLevel(i, age)
      
      // Recompress if needed
      if (targetLevel > currentLevel) {
        await this.degradeMemory(memory, targetLevel)
      }
    }
    
    // Update stats
    this.updateCompressionStats(type || 'all', memories.length)
  }
  
  /**
   * Determine target compression level
   */
  private getTargetCompressionLevel(position: number, ageMs: number): CompressionLevel {
    const days = ageMs / (1000 * 60 * 60 * 24)
    
    // Position-based
    if (position <= 5) return CompressionLevel.FULL
    if (position <= 10) return CompressionLevel.SUMMARY
    if (position <= 30) return CompressionLevel.TAGS
    
    // Age-based
    if (days < 7) return CompressionLevel.FULL
    if (days < 30) return CompressionLevel.SUMMARY
    if (days < 90) return CompressionLevel.TAGS
    
    return CompressionLevel.EDGES
  }
  
  /**
   * Degrade memory to higher compression level
   */
  private async degradeMemory(memory: any, targetLevel: CompressionLevel) {
    const current = memory.content.compression || {}
    let degraded: Partial<MemoryCompression> = { ...current, level: targetLevel }
    
    switch (targetLevel) {
      case CompressionLevel.SUMMARY:
        // Keep essence and tags, remove reversible
        degraded.reversible = null
        break
        
      case CompressionLevel.TAGS:
        // Keep only tags
        degraded.reversible = null
        degraded.essence = null
        degraded.entities = null
        break
        
      case CompressionLevel.EDGES:
        // Remove all content, keep only edges
        degraded = { level: CompressionLevel.EDGES }
        break
    }
    
    // Update memory
    await this.brain.updateMemory(memory.id, {
      ...memory.content,
      compression: degraded
    })
    
    console.log(`📉 Degraded memory ${memory.id} to level ${CompressionLevel[targetLevel]}`)
  }
  
  /**
   * Reconstruct memory from compressed form
   */
  async reconstruct(memoryId: string, targetDetail: 'full' | 'summary' | 'essence' = 'summary'): Promise<string> {
    const memory = await this.brain.getMemory(memoryId)
    if (!memory) return 'Memory not found'
    
    const compression = memory.content.compression
    if (!compression) return JSON.stringify(memory.content)
    
    // If we have the full content, return it
    if (targetDetail === 'full' && memory.content.original) {
      return memory.content.original
    }
    
    // If we have reversible notation, expand it
    if (compression.reversible && targetDetail === 'full') {
      return await this.expandReversible(compression.reversible)
    }
    
    // Return what we have
    if (compression.essence) return compression.essence
    if (compression.tags) return `Memory about: ${compression.tags.join(', ')}`
    if (compression.chineseTags) return `Memory tags: ${compression.chineseTags}`
    
    return 'Memory compressed beyond reconstruction'
  }
  
  /**
   * Expand reversible notation using GPT-5
   */
  private async expandReversible(reversible: string): Promise<string> {
    try {
      const response = await this.client.responses.create({
        model: this.model,
        reasoning: { effort: 'low' },
        instructions: 'Expand this mathematical notation to natural language',
        input: reversible
      })
      return response.output_text
    } catch {
      return reversible  // Return as-is if expansion fails
    }
  }
  
  /**
   * Query memories by semantic tags
   */
  async queryByTags(tags: string[], timeRange?: { start: Date, end: Date }): Promise<any[]> {
    const results: any[] = []
    
    for (const tag of tags) {
      // Find edges with this tag
      const edges = await this.brain.getEdges({
        target: `semantic-${tag}`,
        type: 'tagged'
      })
      
      // Get source memories
      for (const edge of edges) {
        const memory = await this.brain.getMemory(edge.source)
        if (memory) {
          // Check time range if specified
          if (timeRange) {
            const memoryTime = new ObjectId(memory.id).getTimestamp()
            if (memoryTime < timeRange.start || memoryTime > timeRange.end) {
              continue
            }
          }
          results.push(memory)
        }
      }
    }
    
    return results
  }
  
  /**
   * Get compression statistics
   */
  getStats(type?: string): CompressionStats {
    return this.compressionStats.get(type || 'all') || {
      totalMemories: 0,
      averageCompressionRatio: 0,
      levelDistribution: {},
      totalSaved: 0
    }
  }
  
  private updateCompressionStats(type: string, count: number) {
    const current = this.compressionStats.get(type) || {
      totalMemories: 0,
      averageCompressionRatio: 0,
      levelDistribution: {},
      totalSaved: 0
    }
    
    current.totalMemories = count
    this.compressionStats.set(type, current)
  }
  
  private truncateForContext(content: any, maxLength: number): string {
    const str = typeof content === 'string' ? content : JSON.stringify(content)
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str
  }
  
  private fallbackCompression(input: MemoryInput): MemoryCompression {
    return {
      level: CompressionLevel.FULL,
      reversible: null,
      essence: this.truncateForContext(input.content, 50),
      tags: [],
      chineseTags: '忆',  // Generic "memory"
      importance: 5,
      entities: {},
      technique: 'fallback',
      originalSize: JSON.stringify(input.content).length,
      compressedSize: 50,
      compressionRatio: 0.95
    }
  }
  
  private async createMemoryNode(input: MemoryInput) {
    // Implementation depends on memory type
    return {
      type: input.type,
      content: input.content,
      metadata: input.metadata
    }
  }
}

// Compression techniques
const TECHNIQUES = {
  ESSENCE: {
    name: 'essence',
    maxTokens: 10,
    description: 'Ultra-compressed essence'
  },
  SKELETON: {
    name: 'skeleton',
    maxTokens: 30,
    description: 'Semantic skeleton'
  },
  MATHEMATICAL: {
    name: 'mathematical',
    maxTokens: 50,
    description: 'Reversible mathematical notation'
  },
  HIERARCHICAL: {
    name: 'hierarchical',
    maxTokens: 100,
    description: 'Hierarchical compression'
  }
}

// Types
export enum CompressionLevel {
  FULL = 1,      // Complete reversible
  SUMMARY = 2,   // Essence + tags
  TAGS = 3,      // Tags only
  EDGES = 4      // Just graph edges
}

export interface MemoryInput {
  type: 'email' | 'conversation' | 'document' | 'task' | 'thought' | 'learning' | string
  content: any
  metadata?: Record<string, any>
}

export interface MemoryCompression {
  level: CompressionLevel
  reversible: string | null
  essence: string | null
  tags: string[]
  chineseTags: string
  importance: number
  entities: {
    people?: string[]
    dates?: string[]
    amounts?: number[]
    locations?: string[]
    objects?: string[]
  }
  technique: string
  originalSize: number
  compressedSize: number
  compressionRatio: number
}

export interface FormedMemory {
  id: string
  type: string
  compression: MemoryCompression
  stored: boolean
}

export interface CompressionTechnique {
  name: string
  maxTokens: number
  description: string
}

export interface CompressionStats {
  totalMemories: number
  averageCompressionRatio: number
  levelDistribution: Record<string, number>
  totalSaved: number
}