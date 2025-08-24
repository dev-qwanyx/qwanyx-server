/**
 * Simple Contact Processing
 * 1. Receive email
 * 2. Check if contact exists
 * 3. Create contact if not
 */

const { MongoClient, ObjectId } = require('mongodb');
const Imap = require('imap');
const { simpleParser } = require('mailparser');

// Mail config
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

async function processContacts() {
  console.log('📧 Contact Processing System');
  console.log('============================\n');
  
  // Connect to MongoDB
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  
  const db = client.db('autodin');
  const contactsCollection = db.collection('contacts');
  
  console.log('✅ Connected to MongoDB (autodin database)\n');
  
  // Check existing contacts
  const existingContacts = await contactsCollection.find({}).toArray();
  console.log(`📇 Existing contacts: ${existingContacts.length}`);
  if (existingContacts.length > 0) {
    existingContacts.forEach(c => {
      console.log(`   - ${c.email} (${c.firstName} ${c.lastName || ''})`);
    });
  }
  console.log('');
  
  // Connect to IMAP
  console.log('📬 Checking emails...\n');
  
  return new Promise((resolve, reject) => {
    const imap = new Imap(mailConfig.imap);
    
    imap.once('ready', () => {
      imap.openBox('INBOX', false, async (err, box) => {
        if (err) {
          console.error('Error:', err);
          imap.end();
          return reject(err);
        }
        
        console.log(`Found ${box.messages.total} emails in inbox\n`);
        
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
        
        let processedCount = 0;
        const totalEmails = box.messages.total;
        
        fetch.on('message', (msg, seqno) => {
          msg.on('body', (stream) => {
            simpleParser(stream, async (err, mail) => {
              if (!err && mail) {
                console.log(`\n=== EMAIL #${seqno} ===`);
                console.log('From:', mail.from?.text);
                console.log('Subject:', mail.subject);
                
                // Extract sender info
                const fromAddress = mail.from?.value[0];
                if (fromAddress) {
                  const email = fromAddress.address.toLowerCase();
                  const fullName = fromAddress.name || '';
                  
                  console.log(`\n🔍 Checking for contact: ${email}`);
                  
                  // Check if contact exists
                  const existingContact = await contactsCollection.findOne({ email });
                  
                  if (existingContact) {
                    console.log(`✅ Contact exists: ${existingContact.firstName} ${existingContact.lastName || ''}`);
                    console.log(`   Created: ${existingContact.createdAt}`);
                    console.log(`   Message count: ${existingContact.messageCount || 1}`);
                    
                    // Update message count
                    await contactsCollection.updateOne(
                      { email },
                      { $inc: { messageCount: 1 }, $set: { lastSeen: new Date() } }
                    );
                  } else {
                    console.log(`📝 Creating new contact...`);
                    
                    // Parse name
                    const nameParts = fullName.split(' ');
                    const firstName = nameParts[0] || email.split('@')[0];
                    const lastName = nameParts.slice(1).join(' ') || '';
                    
                    // Create contact with proper ID
                    const newContact = {
                      _id: new ObjectId(),
                      email: email,
                      firstName: firstName,
                      lastName: lastName,
                      fullName: fullName || email,
                      createdAt: new Date(),
                      firstEmailDate: mail.date,
                      firstEmailSubject: mail.subject,
                      messageCount: 1,
                      type: 'contact'
                    };
                    
                    await contactsCollection.insertOne(newContact);
                    console.log(`✅ Contact created: ${firstName} ${lastName}`);
                    console.log(`   ID: ${newContact._id}`);
                  }
                }
              }
              
              processedCount++;
              
              // Check if all emails processed
              if (processedCount >= totalEmails) {
                setTimeout(async () => {
                  console.log('\n=================================');
                  console.log('📊 Final Summary:');
                  
                  const finalContacts = await contactsCollection.find({}).toArray();
                  console.log(`Total contacts: ${finalContacts.length}`);
                  
                  finalContacts.forEach(c => {
                    console.log(`   - ${c.email}: ${c.messageCount || 1} messages`);
                  });
                  
                  imap.end();
                  await client.close();
                  resolve();
                }, 1000);
              }
            });
          });
        });
        
        fetch.once('end', () => {
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

processContacts()
  .then(() => console.log('\n✅ Contact processing complete'))
  .catch(console.error);