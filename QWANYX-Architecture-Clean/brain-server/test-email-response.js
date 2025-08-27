// Test Email Response Service
require('dotenv').config();

console.log('Testing Email Response Service Configuration...\n');

// Check environment variables
console.log('1. Environment Variables:');
console.log('   OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing');
console.log('   OPENAI_MODEL:', process.env.OPENAI_MODEL || 'Not set (will default to gpt-5-nano)');
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');

// Test OpenAI connection
const OpenAI = require('openai');

async function testOpenAI() {
  console.log('\n2. Testing OpenAI Connection:');
  
  if (!process.env.OPENAI_API_KEY) {
    console.log('   ❌ Cannot test - OPENAI_API_KEY is missing');
    return;
  }
  
  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    // Try with the model from EmailResponseService
    console.log('   Testing with model: gpt-5');
    const response1 = await client.chat.completions.create({
      model: 'gpt-5',
      messages: [{ role: 'user', content: 'Say "test"' }],
      max_tokens: 10
    }).catch(err => {
      console.log('   ❌ gpt-5 failed:', err.message);
      return null;
    });
    
    if (response1) {
      console.log('   ✅ gpt-5 works!');
    }
    
    // Try with gpt-5-nano
    console.log('   Testing with model: gpt-5-nano');
    const response2 = await client.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [{ role: 'user', content: 'Say "test"' }],
      max_tokens: 10
    }).catch(err => {
      console.log('   ❌ gpt-5-nano failed:', err.message);
      return null;
    });
    
    if (response2) {
      console.log('   ✅ gpt-5-nano works!');
    }
    
    // Try with a known working model
    console.log('   Testing with model: gpt-4o-mini');
    const response3 = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Say "test"' }],
      max_tokens: 10
    }).catch(err => {
      console.log('   ❌ gpt-4o-mini failed:', err.message);
      return null;
    });
    
    if (response3) {
      console.log('   ✅ gpt-4o-mini works!');
    }
    
  } catch (error) {
    console.log('   ❌ OpenAI client error:', error.message);
  }
}

// Test MongoDB connection
async function testMongoDB() {
  console.log('\n3. Testing MongoDB Connection:');
  
  if (!process.env.MONGODB_URI) {
    console.log('   ❌ Cannot test - MONGODB_URI is missing');
    return;
  }
  
  try {
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('   ✅ MongoDB connected successfully');
    await client.close();
  } catch (error) {
    console.log('   ❌ MongoDB connection failed:', error.message);
  }
}

// Run tests
async function runTests() {
  await testOpenAI();
  await testMongoDB();
  
  console.log('\n4. Recommendations:');
  console.log('   - If gpt-5 or gpt-5-nano fail, update EmailResponseService.js line 65');
  console.log('   - Use a working model like gpt-4o-mini or gpt-3.5-turbo');
  console.log('   - Make sure OPENAI_API_KEY is set in .env file');
}

runTests();