import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Test SMTP direct
print("Test SMTP direct...")

try:
    msg = MIMEMultipart()
    msg['Subject'] = "Test QWANYX API"
    msg['From'] = "Phil QWANYX <phil@qwanyx.com>"
    msg['To'] = "phil@qwanyx.com"
    
    body = "Ceci est un test depuis l'API QWANYX"
    msg.attach(MIMEText(body, 'plain'))
    
    print("Connexion à mail.qwanyx.com:587...")
    server = smtplib.SMTP('mail.qwanyx.com', 587)
    
    print("STARTTLS...")
    server.starttls()
    
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