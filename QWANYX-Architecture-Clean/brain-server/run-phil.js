/**
 * Run Phil's Brain - Simple standalone script
 * Uses the correct database and collection
 */

const { MongoClient } = require('mongodb');

async function runPhil() {
  console.log('🧠 Starting Phil\'s Digital Human Brain');
  console.log('=====================================\n');
  
  // Connect to the RIGHT database
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  
  const db = client.db('autodin');  // The correct database
  const collection = db.collection('phil-qwanyx-com');  // The correct collection
  
  console.log('📂 Database: autodin');
  console.log('📁 Collection: phil-qwanyx-com\n');
  
  // Load personality flow
  const personalityFlow = await db.collection('flows').findOne({ 
    'data.label': 'personality' 
  });
  
  if (personalityFlow) {
    console.log('🎭 Personality loaded:');
    if (personalityFlow.nodes && personalityFlow.nodes[0]) {
      const node = personalityFlow.nodes[0];
      console.log('   Type:', node.data?.brief || 'Unknown');
      console.log('   Label:', node.data?.label || 'Unknown');
    }
  }
  
  // Check for existing memories
  const memories = await collection.find({}).toArray();
  console.log(`\n📊 Current memories: ${memories.length}`);
  
  // Simulate processing an email
  console.log('\n📧 Checking for emails...');
  
  // Here we would check IMAP, but for now just show what would happen
  console.log('   Would check phil@qwanyx.com inbox');
  console.log('   Would form memories from emails');
  console.log('   Would generate responses based on personality');
  
  await client.close();
  console.log('\n✅ Done');
}

runPhil().catch(console.error);