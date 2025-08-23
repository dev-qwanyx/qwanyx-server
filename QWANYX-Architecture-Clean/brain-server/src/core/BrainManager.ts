/**
 * Brain Manager
 * Manages multiple living brains on the server
 */

import { Brain } from './Brain'
import { Logger } from '../utils/Logger'
import { BrainConfig, BrainStats } from '../types'

export class BrainManager {
  private static instance: BrainManager
  private brains: Map<string, Brain> = new Map()
  private logger: Logger
  
  private constructor() {
    this.logger = Logger.getInstance()
  }
  
  static getInstance(): BrainManager {
    if (!BrainManager.instance) {
      BrainManager.instance = new BrainManager()
    }
    return BrainManager.instance
  }
  
  async startBrain(id: string, type: string, config: BrainConfig): Promise<Brain> {
    // Check if brain already exists
    if (this.brains.has(id)) {
      this.logger.warn(`Brain ${id} already exists`)
      return this.brains.get(id)!
    }
    
    // Check resource limits
    const maxBrains = parseInt(process.env.MAX_BRAINS_PER_SERVER || '100')
    if (this.brains.size >= maxBrains) {
      throw new Error(`Maximum number of brains (${maxBrains}) reached`)
    }
    
    // Create and start new brain
    const brain = new Brain(id, type, config)
    await brain.start()
    
    // Add to managed brains
    this.brains.set(id, brain)
    
    this.logger.info(`Started brain ${id} (type: ${type}). Total brains: ${this.brains.size}`)
    
    // Monitor brain health
    brain.on('error', (error) => {
      this.logger.error(`Brain ${id} error`, error)
    })
    
    brain.on('state-change', (state) => {
      this.logger.info(`Brain ${id} state changed to ${state}`)
    })
    
    return brain
  }
  
  async stopBrain(id: string): Promise<void> {
    const brain = this.brains.get(id)
    
    if (!brain) {
      throw new Error(`Brain ${id} not found`)
    }
    
    await brain.stop()
    this.brains.delete(id)
    
    this.logger.info(`Stopped brain ${id}. Remaining brains: ${this.brains.size}`)
  }
  
  getBrain(id: string): Brain | undefined {
    return this.brains.get(id)
  }
  
  listBrains(): any[] {
    return Array.from(this.brains.values()).map(brain => brain.getVitals())
  }
  
  async stopAllBrains(): Promise<void> {
    this.logger.info(`Stopping all ${this.brains.size} brains...`)
    
    const stopPromises = Array.from(this.brains.values()).map(brain => brain.stop())
    await Promise.all(stopPromises)
    
    this.brains.clear()
    this.logger.info('All brains stopped')
  }
  
  getStats(): BrainStats {
    let totalThoughts = 0
    let totalMemory = 0
    let connections = 0
    
    for (const brain of this.brains.values()) {
      const vitals = brain.getVitals()
      totalThoughts += vitals.thoughtCount
      totalMemory += vitals.memoryUsage
    }
    
    return {
      activeBrains: this.brains.size,
      totalThoughts,
      memoryUsage: totalMemory,
      cpuUsage: process.cpuUsage().user / 1000000, // Convert to seconds
      connections
    }
  }
  
  // Inter-brain communication
  async sendThought(fromBrainId: string, toBrainId: string, _thought: any): Promise<void> {
    const fromBrain = this.brains.get(fromBrainId)
    const toBrain = this.brains.get(toBrainId)
    
    if (!fromBrain || !toBrain) {
      throw new Error('One or both brains not found')
    }
    
    // In future: implement brain-to-brain communication
    this.logger.info(`Brain ${fromBrainId} sending thought to ${toBrainId}`)
  }
}