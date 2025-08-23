/**
 * MongoDB Memory Store
 * Long-term memory for all brains
 */

import { MongoClient, Db, Collection } from 'mongodb'
import { Logger } from '../utils/Logger'

export class MongoMemory {
  private static instance: MongoMemory
  private client?: MongoClient
  private db?: Db
  private logger: Logger
  
  private constructor() {
    this.logger = Logger.getInstance()
  }
  
  static getInstance(): MongoMemory {
    if (!MongoMemory.instance) {
      MongoMemory.instance = new MongoMemory()
    }
    return MongoMemory.instance
  }
  
  async connect(): Promise<void> {
    try {
      const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017'
      const dbName = process.env.MONGODB_DB_NAME || 'qwanyx_brains'
      
      this.client = new MongoClient(uri)
      await this.client.connect()
      
      this.db = this.client.db(dbName)
      this.logger.info(`Connected to MongoDB: ${dbName}`)
      
    } catch (error) {
      this.logger.error('Failed to connect to MongoDB', error)
      throw error
    }
  }
  
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.logger.info('Disconnected from MongoDB')
    }
  }
  
  getDatabase(): Db {
    if (!this.db) {
      throw new Error('Database not connected')
    }
    return this.db
  }
  
  getCollection(name: string): Collection {
    if (!this.db) {
      throw new Error('Database not connected')
    }
    return this.db.collection(name)
  }
}