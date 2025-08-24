const Imap = require('imap');
const nodemailer = require('nodemailer');
const config = require('./mail-config.json');

// Test IMAP Connection
console.log('🔍 Testing IMAP connection to', config.imap.host);
const imap = new Imap({
  user: config.imap.user,
  password: config.imap.password,
  host: config.imap.host,
  port: config.imap.port,
  tls: config.imap.tls,
  authTimeout: config.imap.authTimeout
});

imap.once('ready', () => {
  console.log('✅ IMAP connection successful!');
  console.log('   Connected to:', config.imap.user);
  imap.end();
  
  // Test SMTP after IMAP succeeds
  testSMTP();
});

imap.once('error', (err) => {
  console.error('❌ IMAP connection failed:', err.message);
});

imap.connect();

// Test SMTP Connection and send email
async function testSMTP() {
  console.log('\n🔍 Testing SMTP connection to', config.smtp.host);
  
  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.auth.user,
      pass: config.smtp.auth.pass
    }
  });
  
  try {
    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
    
    // Send test email
    console.log('📧 Sending test email to punbo.philippe@gmail.com...');
    const info = await transporter.sendMail({
      from: config.smtp.from,
      to: 'punbo.philippe@gmail.com',
      subject: 'Test from Digital Human Brain',
      text: 'This is a test email from the Digital Human mail system.',
      html: '<b>This is a test email</b> from the Digital Human mail system.<br><br>If you receive this, both IMAP and SMTP are working correctly!'
    });
    
    console.log('✅ Email sent successfully!');
    console.log('   Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ SMTP error:', error.message);
  }
}