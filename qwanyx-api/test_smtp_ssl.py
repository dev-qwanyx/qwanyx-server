import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Test SMTP avec SSL (port 465)
print("Test SMTP SSL sur port 465...")

try:
    msg = MIMEMultipart()
    msg['Subject'] = "Test QWANYX API - SSL"
    msg['From'] = "Phil QWANYX <phil@qwanyx.com>"
    msg['To'] = "phil@qwanyx.com"
    
    body = "Test avec SSL sur port 465"
    msg.attach(MIMEText(body, 'plain'))
    
    print("Connexion SSL à mail.qwanyx.com:465...")
    server = smtplib.SMTP_SSL('mail.qwanyx.com', 465)
    
    print("Login...")
    server.login('phil@qwanyx.com', 'STzWpuuGU6TFFCtCxp9ho')
    
    print("Envoi...")
    server.send_message(msg)
    
    server.quit()
    print("Email envoyé avec succès!")
    
except Exception as e:
    print(f"Erreur: {e}")
    import traceback
    traceback.print_exc()