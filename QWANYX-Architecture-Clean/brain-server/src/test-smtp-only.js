const nodemailer = require('nodemailer');
const config = require('./mail-config.json');

// Test SMTP Connection and send email
async function testSMTP() {
  console.log('🔍 Testing SMTP connection to', config.smtp.host);
  
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
      html: '<b>This is a test email</b> from the Digital Human mail system.<br><br>SMTP is working correctly via AWS SES!'
    });
    
    console.log('✅ Email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('   Response:', info.response);
  } catch (error) {
    console.error('❌ SMTP error:', error.message);
    if (error.responseCode) {
      console.error('   Response code:', error.responseCode);
    }
  }
}

testSMTP();