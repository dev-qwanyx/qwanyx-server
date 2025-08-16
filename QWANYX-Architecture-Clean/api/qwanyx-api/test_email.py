#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Test email sending with AWS SES credentials"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_email_send(to_email):
    """Test sending email with current SMTP configuration"""
    
    # Get configuration from environment
    SMTP_HOST = os.getenv('SMTP_HOST', 'email-smtp.us-east-1.amazonaws.com')
    SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
    SMTP_USER = os.getenv('SMTP_USER')
    SMTP_PASS = os.getenv('SMTP_PASS')
    SMTP_FROM = os.getenv('SMTP_FROM', 'Phil QWANYX <phil@qwanyx.com>')
    
    print(f"\n{'='*60}")
    print("SMTP Configuration Test")
    print(f"{'='*60}")
    print(f"Host: {SMTP_HOST}")
    print(f"Port: {SMTP_PORT}")
    print(f"User: {SMTP_USER}")
    print(f"From: {SMTP_FROM}")
    print(f"To: {to_email}")
    print(f"{'='*60}\n")
    
    if not SMTP_USER or not SMTP_PASS:
        print("ERROR: SMTP credentials not found in .env file")
        return False
    
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"Test Email - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        msg['From'] = SMTP_FROM
        msg['To'] = to_email
        
        # HTML body
        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Test Email from QWANYX API</h2>
            <p>This is a test email sent at: <strong>{datetime.now()}</strong></p>
            <h1 style="background: #f0f0f0; padding: 20px; text-align: center; letter-spacing: 5px;">
                123456
            </h1>
            <p>If you received this email, the SMTP configuration is working correctly.</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
                SMTP Host: {SMTP_HOST}<br>
                SMTP Port: {SMTP_PORT}<br>
                From: {SMTP_FROM}
            </p>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(html, 'html'))
        
        print("Connecting to SMTP server...")
        
        # Send email based on port
        if SMTP_PORT == 465:
            # Port 465 uses SSL
            print("Using SMTP_SSL (port 465)...")
            with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
                print("Logging in...")
                server.login(SMTP_USER, SMTP_PASS)
                print("Sending message...")
                server.send_message(msg)
        else:
            # Port 587 uses STARTTLS
            print(f"Using SMTP with STARTTLS (port {SMTP_PORT})...")
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                print("Starting TLS...")
                server.starttls()
                print("Logging in...")
                server.login(SMTP_USER, SMTP_PASS)
                print("Sending message...")
                result = server.send_message(msg)
                print(f"Send result: {result}")
        
        print(f"\nSUCCESS: Email sent to {to_email}")
        print("Please check your inbox (and spam folder)")
        return True
        
    except smtplib.SMTPAuthenticationError as e:
        print(f"\nAUTHENTICATION ERROR: {e}")
        print("Check your SMTP_USER and SMTP_PASS in .env file")
        return False
    except smtplib.SMTPException as e:
        print(f"\nSMTP ERROR: {e}")
        return False
    except Exception as e:
        print(f"\nGENERAL ERROR: {e}")
        print(f"Error type: {type(e).__name__}")
        return False

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        email = sys.argv[1]
    else:
        email = input("Enter email address to test: ").strip()
    
    if not email:
        print("ERROR: No email address provided")
        sys.exit(1)
    
    success = test_email_send(email)
    sys.exit(0 if success else 1)