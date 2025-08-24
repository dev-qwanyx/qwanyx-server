const Imap = require('imap');
const config = require('./mail-config.json');

// Test IMAP Connection
console.log('🔍 Testing IMAP connection to', config.imap.host);
console.log('   User:', config.imap.user);

const imap = new Imap({
  user: config.imap.user,
  password: config.imap.password,
  host: config.imap.host,
  port: config.imap.port,
  tls: config.imap.tls,
  tlsOptions: config.imap.tlsOptions || {},
  authTimeout: config.imap.authTimeout
});

imap.once('ready', () => {
  console.log('✅ IMAP connection successful!');
  console.log('   Connected to:', config.imap.user);
  
  // Open INBOX to test
  imap.openBox('INBOX', true, (err, box) => {
    if (err) {
      console.error('❌ Error opening INBOX:', err);
    } else {
      console.log('📧 INBOX opened successfully');
      console.log('   Total messages:', box.messages.total);
      console.log('   New messages:', box.messages.new);
    }
    imap.end();
  });
});

imap.once('error', (err) => {
  console.error('❌ IMAP connection failed:', err.message);
});

console.log('🔄 Connecting...');
imap.connect();