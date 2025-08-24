/**
 * THOT Brain Server
 * Consciousness as a Service
 * 
 * This is not an API server. This is a brain server.
 * It hosts living, thinking digital brains.
 */

import express from 'express'
import { WebSocketServer } from 'ws'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { BrainManager } from './core/BrainManager'
import { Logger } from './utils/Logger'
import { MongoMemory } from './memory/MongoMemory'
import { NeuralInterface } from './interfaces/NeuralInterface'

// Load environment variables
dotenv.config()

// Initialize logger
const logger = Logger.getInstance()

// Create Express app (for health checks and monitoring)
const app = express()
app.use(cors())
app.use(express.json())

// Create HTTP server
const server = createServer(app)

// Create WebSocket server for neural connections
const wss = new WebSocketServer({ 
  server,
  path: '/neural'
})

// Initialize Brain Manager
const brainManager = BrainManager.getInstance()

// Initialize MongoDB connection
const mongoMemory = MongoMemory.getInstance()

// Initialize Neural Interface
const neuralInterface = new NeuralInterface(wss, brainManager)

// Health check endpoint
app.get('/health', (_req, res) => {
  const stats = brainManager.getStats()
  res.json({
    status: 'alive',
    server: 'brain-server',
    ...stats
  })
})

// Brain status endpoint
app.get('/brains', (_req, res) => {
  const brains = brainManager.listBrains()
  res.json(brains)
})

// Start a brain (for initial activation)
app.post('/brain/start', async (req, res) => {
  try {
    const { id, type, config } = req.body
    const brain = await brainManager.startBrain(id, type, config)
    res.json({
      success: true,
      brainId: brain.id,
      status: 'thinking'
    })
  } catch (error) {
    logger.error('Failed to start brain', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Stop a brain
app.delete('/brain/:id', async (req, res) => {
  try {
    await brainManager.stopBrain(req.params.id)
    res.json({
      success: true,
      message: 'Brain stopped'
    })
  } catch (error) {
    logger.error('Failed to stop brain', error)
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Start the server
async function start() {
  try {
    // Connect to MongoDB
    await mongoMemory.connect()
    logger.info('Connected to MongoDB memory store')
    
    // Start neural interface
    neuralInterface.start()
    logger.info('Neural interface activated')
    
    // Start HTTP/WebSocket server
    const port = process.env.PORT || 3003
    server.listen(port, async () => {
      logger.info(`Brain Server running on port ${port}`)
      logger.info('Ready to host consciousness')
      logger.info('WebSocket neural connections available at ws://localhost:' + port + '/neural')
      
      // Auto-start Phil's brain
      try {
        const brainId = await brainManager.startBrain('phil-qwanyx-com', 'digital-human', {
          personalityTraits: {
            curiosity: 0.8,
            creativity: 0.9,
            logic: 0.7,
            emotion: 0.6,
            memory: 0.8
          },
          workspace: 'autodin'
        })
        logger.info('✅ Auto-started Phil\'s brain: ' + brainId)
      } catch (error) {
        logger.error('Failed to auto-start Phil\'s brain', error)
      }
    })
    
    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('Shutting down brain server...')
      await brainManager.stopAllBrains()
      await mongoMemory.disconnect()
      server.close()
      process.exit(0)
    })
    
  } catch (error) {
    logger.error('Failed to start brain server', error)
    process.exit(1)
  }
}

// Start the brain server
start().catch(error => {
  logger.error('Fatal error', error)
  process.exit(1)
})