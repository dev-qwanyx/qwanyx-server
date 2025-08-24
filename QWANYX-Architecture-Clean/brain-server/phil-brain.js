/**
 * Phil's Brain - Email Processing Demo
 * Reads emails, forms memories, generates responses
 */

const { MongoClient } = require('mongodb');
const Imap = require('imap');
const { simpleParser } = require('mailparser');

// Mail config from mail-config.json
const mailConfig = {
  imap: {
    host: 'mail.qwanyx.com',
    port: 993,
    user: 'phil@qwanyx.com',
    password: 'STzWpuuGU6TFFCtCxp9ho',
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
  }
};

async function processEmails() {
  console.log('🧠 Phil\'s Digital Human Brain');
  console.log('===============================\n');
  
  // Connect to MongoDB
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  
  const db = client.db('autodin');
  const collection = db.collection('phil-qwanyx-com');
  
  console.log('✅ Connected to autodin/phil-qwanyx-com\n');
  
  // Check current memories
  const existingMemories = await collection.find({}).toArray();
  console.log(`📊 Current memories: ${existingMemories.length}\n`);
  
  // Connect to IMAP
  console.log('📧 Checking emails...\n');
  
  return new Promise((resolve, reject) => {
    const imap = new Imap(mailConfig.imap);
    
    imap.once('ready', () => {
      imap.openBox('INBOX', false, async (err, box) => {
        if (err) {
          console.error('Error:', err);
          imap.end();
          return reject(err);
        }
        
        console.log(`📬 Found ${box.messages.total} emails\n`);
        
        if (box.messages.total === 0) {
          console.log('📭 No emails to process');
          imap.end();
          await client.close();
          return resolve();
        }
        
        // Fetch emails
        const fetch = imap.seq.fetch('1:*', {
          bodies: '',
          struct: true
        });
        
        // Track processed emails
        let processedCount = 0;
        const totalEmails = box.messages.total;
        
        fetch.on('message', (msg, seqno) => {
          msg.on('body', (stream) => {
            simpleParser(stream, async (err, mail) => {
              if (!err && mail) {
                console.log(`\n=== EMAIL #${seqno} ===`);
                console.log('From:', mail.from?.text);
                console.log('Subject:', mail.subject);
                console.log('Date:', mail.date);
                
                // Create memory record (not a visual node)
                const memoryNode = {
                  _id: `email_${Date.now()}_${seqno}`,
                  type: 'email_memory',
                  from: mail.from?.text,
                  subject: mail.subject,
                  body: mail.text?.substring(0, 500), // First 500 chars
                  date: mail.date,
                  processed_at: new Date(),
                  messageId: mail.messageId,
                  importance: mail.subject?.toLowerCase().includes('urgent') ? 'high' : 'normal'
                };
                
                try {
                  // Save memory to Phil's collection
                  await collection.insertOne(memoryNode);
                  console.log('✅ Memory formed and saved to database');
                } catch (error) {
                  console.error('❌ Failed to save memory:', error.message);
                }
                
                // Generate response (simple for demo)
                console.log('\n📝 Response generated:');
                console.log('   "Thank you for your email. Message received and stored in memory."');
              }
              
              processedCount++;
              
              // Check if all emails processed
              if (processedCount >= totalEmails) {
                setTimeout(async () => {
                  console.log('\n✅ All emails processed');
                  
                  // Check new memory count
                  const newCount = await collection.countDocuments();
                  console.log(`📊 Total memories now: ${newCount}`);
                  
                  imap.end();
                  await client.close();
                  resolve();
                }, 1000);
              }
            });
          });
        });
        
        fetch.once('end', () => {
          // Just log, don't close connections here
          console.log('\nFetch completed');
        });
      });
    });
    
    imap.once('error', (err) => {
      console.error('IMAP Error:', err);
      reject(err);
    });
    
    imap.connect();
  });
}

processEmails()
  .then(() => console.log('\n✅ Phil\'s brain processing complete'))
  .catch(console.error);