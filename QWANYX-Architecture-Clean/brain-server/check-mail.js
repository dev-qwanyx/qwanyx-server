const Imap = require('imap');

console.log('📧 Checking for new emails...\n');

const imap = new Imap({
  user: 'phil@qwanyx.com',
  password: 'STzWpuuGU6TFFCtCxp9ho',
  host: 'mail.qwanyx.com',
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
});

imap.once('ready', () => {
  imap.openBox('INBOX', false, (err, box) => {
    if (err) {
      console.log('Error:', err);
      imap.end();
      return;
    }
    
    console.log(`📬 Found ${box.messages.total} emails in inbox\n`);
    
    if (box.messages.total > 0) {
      // Fetch the emails
      const fetch = imap.seq.fetch('1:*', {
        bodies: '',
        struct: true
      });
      
      fetch.on('message', (msg, seqno) => {
        console.log(`\n=== EMAIL #${seqno} ===`);
        
        msg.on('body', (stream) => {
          let buffer = '';
          stream.on('data', (chunk) => {
            buffer += chunk.toString('utf8');
          });
          stream.once('end', () => {
            const header = Imap.parseHeader(buffer);
            console.log('From:', header.from ? header.from[0] : 'Unknown');
            console.log('Subject:', header.subject ? header.subject[0] : 'No Subject');
            console.log('Date:', header.date ? header.date[0] : 'Unknown');
            
            // This is where the brain would form a memory
            console.log('\n🧠 MEMORY FORMED:');
            console.log('   Type: email_memory');
            console.log('   From:', header.from ? header.from[0] : 'Unknown');
            console.log('   Subject:', header.subject ? header.subject[0] : 'No Subject');
            console.log('   Timestamp:', new Date().toISOString());
          });
        });
      });
      
      fetch.once('end', () => {
        console.log('\n✅ All emails processed');
        imap.end();
      });
    } else {
      console.log('📭 No emails to process');
      imap.end();
    }
  });
});

imap.once('error', (err) => {
  console.log('Connection error:', err.message);
});

console.log('🔌 Connecting to mail server...');
imap.connect();