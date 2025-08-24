/**
 * Actually process mail and form memories
 */

import { BrainManager } from './src/core/BrainManager'
import { Logger } from './src/utils/Logger'
import { MongoMemory } from './src/memory/MongoMemory'

const logger = Logger.getInstance()

async function processMailNow() {
  console.log('🧠 Starting Phil\'s brain to process email...\n')
  
  // Connect to MongoDB first
  console.log('🔌 Connecting to MongoDB...')
  const mongoMemory = MongoMemory.getInstance()
  await mongoMemory.connect()
  console.log('✅ MongoDB connected\n')

  // Get brain manager instance
  const brainManager = BrainManager.getInstance()

  // Start Phil's brain
  const brain = await brainManager.startBrain('phil-qwanyx-com', 'digital-human', {
    type: 'digital-human',
    workspace: 'autodin'
  })

  console.log('✅ Brain started\n')
  console.log('📧 Connecting to mail service...\n')

  // The brain should have mail service from config
  if (brain.mailService) {
    await brain.mailService.connect()
    
    // Wait a bit for processing
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    console.log('\n✅ Mail processed and memories formed')
  } else {
    console.log('❌ Mail service not initialized')
  }

  // Check brain state
  const vitals = brain.getVitals()
  console.log(`\n📊 Brain stats:`)
  console.log(`   Thoughts: ${vitals.thoughtCount}`)
  console.log(`   State: ${vitals.state}`)
  
  // Keep running for a bit to ensure memory is saved
  setTimeout(() => {
    console.log('\n✅ Done')
    process.exit(0)
  }, 10000)
}

processMailNow().catch(console.error)