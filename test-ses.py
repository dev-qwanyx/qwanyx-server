import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# AWS SES Configuration
SMTP_HOST = "email-smtp.eu-west-1.amazonaws.com"
SMTP_PORT = 587
SMTP_USER = "AKIASIUVSCNOIYDDKYUC"
SMTP_PASS = "BI222lL2lNMOLeHvX7+sHZoAyrkPWXozXsiIkwplaXNX"
SMTP_FROM = "noreply@qwanyx.com"  # Must be from verified domain

# Test parameters
TO_EMAIL = "phil@qwanyx.com"  # Change to your test email
CODE = "TEST-123"

print("Testing AWS SES email...")
print(f"From: {SMTP_FROM}")
print(f"To: {TO_EMAIL}")

# Create message
msg = MIMEMultipart('alternative')
msg['Subject'] = "Test SES - QWANYX Authentication"
msg['From'] = f"QWANYX <{SMTP_FROM}>"
msg['To'] = TO_EMAIL

# HTML body
html = f"""
<html>
<body style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Test AWS SES - QWANYX</h2>
    <p>Ce mail est envoyé via AWS SES pour tester la configuration.</p>
    <h1 style="background: #f0f0f0; padding: 20px; text-align: center; letter-spacing: 5px; color: #333;">
        {CODE}
    </h1>
    <p>Si vous recevez ce mail, SES fonctionne correctement!</p>
    <p style="color: #666; font-size: 12px;">Envoyé depuis AWS SES eu-west-1</p>
</body>
</html>
"""

msg.attach(MIMEText(html, 'html'))

try:
    # Connect to SES
    print("\nConnecting to SES...")
    server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
    server.starttls()
    server.login(SMTP_USER, SMTP_PASS)
    
    # Send email
    print("Sending email...")
    server.send_message(msg)
    server.quit()
    
    print(f"\n✅ SUCCESS! Email sent to {TO_EMAIL}")
    print("Check your inbox (and spam folder)")
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    print("\nPossible issues:")
    print("- Email address not verified (in Sandbox mode)")
    print("- Domain not verified")
    print("- Wrong credentials")