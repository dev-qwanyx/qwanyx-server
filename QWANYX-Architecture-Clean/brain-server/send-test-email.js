const nodemailer = require('nodemailer');

// Send a test email to phil@qwanyx.com to trigger a response
async function sendTestEmail() {
  console.log('📧 Sending test email to phil@qwanyx.com...');
  
  // Create a simple transporter using a test account
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'test@example.com', // Replace with your email
      pass: 'your-password' // Replace with your password
    }
  });
  
  try {
    const info = await transporter.sendMail({
      from: '"Test User" <test@example.com>',
      to: 'phil@qwanyx.com',
      subject: 'Interested in your AI services',
      text: 'Hello Phil, I am interested in learning more about your AI email automation services. Can you tell me about the pricing and features? Thanks, John',
      html: '<p>Hello Phil,</p><p>I am interested in learning more about your AI email automation services. Can you tell me about the pricing and features?</p><p>Thanks,<br>John</p>'
    });
    
    console.log('✅ Test email sent:', info.messageId);
  } catch (error) {
    console.error('❌ Failed to send test email:', error.message);
    console.log('\nAlternative: Send a manual email to phil@qwanyx.com with subject "Test" to trigger the brain response.');
  }
}

sendTestEmail();