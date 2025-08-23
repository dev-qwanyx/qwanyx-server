/**
 * Flow Manager
 * Manages flow storage and retrieval for a brain
 */

import { Collection } from 'mongodb'
import { MongoMemory } from './MongoMemory'
import { Flow } from '../types'
import { Logger } from '../utils/Logger'

export class FlowManager {
  private brainId: string
  private workspace: string
  private collection?: Collection
  private logger: Logger
  
  constructor(brainId: string, workspace: string) {
    this.brainId = brainId
    this.workspace = workspace
    this.logger = Logger.getInstance()
  }
  
  async initialize(): Promise<void> {
    const mongo = MongoMemory.getInstance()
    const collectionName = `${this.workspace}_${this.sanitizeBrainId(this.brainId)}_memory`
    this.collection = mongo.getCollection(collectionName)
    
    // Create indexes for performance
    await this.collection.createIndex({ id: 1 })
    await this.collection.createIndex({ updatedAt: -1 })
    
    this.logger.info(`Flow manager initialized for brain ${this.brainId}`)
  }
  
  async loadFlow(flowId: string): Promise<Flow | null> {
    if (!this.collection) {
      throw new Error('Flow manager not initialized')
    }
    
    const doc = await this.collection.findOne({ id: flowId })
    
    if (doc) {
      return {
        id: doc.id,
        title: doc.title || doc.data?.label || flowId,
        nodes: doc.nodes || [],
        edges: doc.edges || [],
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      }
    }
    
    return null
  }
  
  async saveFlow(flowId: string, flow: Flow): Promise<void> {
    if (!this.collection) {
      throw new Error('Flow manager not initialized')
    }
    
    const doc = {
      id: flowId,
      title: flow.title,
      nodes: flow.nodes,
      edges: flow.edges,
      data: {
        label: flow.title,
        type: 'flow'
      },
      updatedAt: new Date(),
      createdAt: flow.createdAt || new Date()
    }
    
    await this.collection.replaceOne(
      { id: flowId },
      doc,
      { upsert: true }
    )
    
    this.logger.debug(`Saved flow ${flowId} for brain ${this.brainId}`)
  }
  
  async deleteFlow(flowId: string): Promise<void> {
    if (!this.collection) {
      throw new Error('Flow manager not initialized')
    }
    
    await this.collection.deleteOne({ id: flowId })
    this.logger.debug(`Deleted flow ${flowId} for brain ${this.brainId}`)
  }
  
  async listFlows(): Promise<string[]> {
    if (!this.collection) {
      throw new Error('Flow manager not initialized')
    }
    
    const flows = await this.collection
      .find({}, { projection: { id: 1 } })
      .toArray()
    
    return flows.map(f => f.id)
  }
  
  private sanitizeBrainId(id: string): string {
    // Convert email or ID to MongoDB-friendly collection name
    return id.replace(/@/g, '-').replace(/\./g, '-').replace(/[^a-zA-Z0-9-]/g, '_')
  }
}