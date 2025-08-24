import { Router, Request, Response } from 'express'
import { MemoryFormationService } from '../services/memory/MemoryFormationService'
import { ObjectId } from 'mongodb'

const router = Router()

/**
 * Memory Formation API Routes
 * Endpoints for creating, compressing, and querying memories
 */

// Initialize service (would normally be dependency injected)
let memoryService: MemoryFormationService

// Middleware to ensure service is initialized
router.use((req, res, next) => {
  const brainId = req.headers['x-brain-id'] as string || req.query.brainId as string
  if (!brainId) {
    return res.status(400).json({ error: 'Brain ID required' })
  }
  memoryService = new MemoryFormationService(brainId)
  next()
})

/**
 * POST /api/memory/form
 * Form a new memory with automatic compression
 */
router.post('/form', async (req: Request, res: Response) => {
  try {
    const { type, content, metadata } = req.body
    
    if (!type || !content) {
      return res.status(400).json({ error: 'Type and content required' })
    }
    
    const memory = await memoryService.formMemory({
      type,
      content,
      metadata
    })
    
    res.json({
      success: true,
      memory,
      compression: {
        ratio: memory.compression.compressionRatio,
        technique: memory.compression.technique,
        level: memory.compression.level
      }
    })
  } catch (error) {
    console.error('Memory formation error:', error)
    res.status(500).json({ error: 'Failed to form memory' })
  }
})

/**
 * POST /api/memory/compress
 * Manually trigger compression cascade
 */
router.post('/compress', async (req: Request, res: Response) => {
  try {
    const { type } = req.body
    
    await memoryService.cascadeCompression(type)
    
    res.json({
      success: true,
      message: `Compression cascade completed for ${type || 'all'} memories`
    })
  } catch (error) {
    console.error('Compression cascade error:', error)
    res.status(500).json({ error: 'Compression cascade failed' })
  }
})

/**
 * GET /api/memory/reconstruct/:id
 * Reconstruct a memory from its compressed form
 */
router.get('/reconstruct/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { detail = 'summary' } = req.query
    
    const reconstructed = await memoryService.reconstruct(
      id,
      detail as 'full' | 'summary' | 'essence'
    )
    
    res.json({
      success: true,
      memoryId: id,
      detail,
      content: reconstructed
    })
  } catch (error) {
    console.error('Reconstruction error:', error)
    res.status(500).json({ error: 'Failed to reconstruct memory' })
  }
})

/**
 * POST /api/memory/query/tags
 * Query memories by semantic tags
 */
router.post('/query/tags', async (req: Request, res: Response) => {
  try {
    const { tags, timeRange } = req.body
    
    if (!tags || !Array.isArray(tags)) {
      return res.status(400).json({ error: 'Tags array required' })
    }
    
    const results = await memoryService.queryByTags(tags, timeRange)
    
    res.json({
      success: true,
      count: results.length,
      memories: results
    })
  } catch (error) {
    console.error('Tag query error:', error)
    res.status(500).json({ error: 'Tag query failed' })
  }
})

/**
 * POST /api/memory/query/time
 * Query memories by time range with zoom level
 */
router.post('/query/time', async (req: Request, res: Response) => {
  try {
    const { start, end, detail = 'summary' } = req.body
    
    if (!start || !end) {
      return res.status(400).json({ error: 'Start and end dates required' })
    }
    
    const startDate = new Date(start)
    const endDate = new Date(end)
    
    // Convert to ObjectId range
    const startId = ObjectId.createFromTime(startDate.getTime() / 1000)
    const endId = ObjectId.createFromTime(endDate.getTime() / 1000)
    
    // This would query the brain for memories in range
    // For now, return structure
    res.json({
      success: true,
      range: { start: startDate, end: endDate },
      detail,
      memories: [] // Would be populated from brain query
    })
  } catch (error) {
    console.error('Time query error:', error)
    res.status(500).json({ error: 'Time query failed' })
  }
})

/**
 * GET /api/memory/stats
 * Get compression statistics
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const { type } = req.query
    
    const stats = memoryService.getStats(type as string)
    
    res.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('Stats error:', error)
    res.status(500).json({ error: 'Failed to get stats' })
  }
})

/**
 * POST /api/memory/batch
 * Form multiple memories at once
 */
router.post('/batch', async (req: Request, res: Response) => {
  try {
    const { memories } = req.body
    
    if (!memories || !Array.isArray(memories)) {
      return res.status(400).json({ error: 'Memories array required' })
    }
    
    const results = []
    for (const memory of memories) {
      const formed = await memoryService.formMemory(memory)
      results.push(formed)
    }
    
    res.json({
      success: true,
      count: results.length,
      memories: results,
      averageCompression: results.reduce((acc, m) => acc + m.compression.compressionRatio, 0) / results.length
    })
  } catch (error) {
    console.error('Batch formation error:', error)
    res.status(500).json({ error: 'Batch formation failed' })
  }
})

export default router