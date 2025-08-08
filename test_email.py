#!/usr/bin/env python3
"""
Test d'envoi d'email après changement DMARC
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

# Configuration SMTP
smtp_host = 'mail.qwanyx.com'
smtp_port = 587
smtp_user = 'phil@qwanyx.com'
smtp_pass = 'Phil070185!@'

# Création du message
msg = MIMEMultipart('alternative')
msg['Subject'] = f'Test SMTP Unblocked - {datetime.now().strftime("%H:%M:%S")}'
msg['From'] = 'Phil QWANYX <phil@qwanyx.com>'
msg['To'] = 'phil@pixanima.com'

# Corps du message HTML
html = f"""
<html>
<body style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Test après déblocage SMTP sur Hetzner</h2>
    <p>Ce test vérifie que les ports SMTP sont maintenant débloqués et que l'envoi d'emails fonctionne depuis le serveur de production.</p>
    <p>Envoyé le: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
    <p style="color: green;">Si vous recevez cet email, les ports SMTP sont débloqués et fonctionnels ✓</p>
    <hr>
    <h3>Détails techniques:</h3>
    <ul>
        <li>Ports SMTP: 25, 465, 587 maintenant débloqués</li>
        <li>DMARC: p=none (accepte les emails même sans DKIM)</li>
        <li>SPF: Include l'IP du serveur 135.181.72.183</li>
        <li>Serveur SMTP: {smtp_host}:{smtp_port}</li>
    </ul>
</body>
</html>
"""

# Corps texte simple (fallback)
text = f"""
Test après déblocage SMTP sur Hetzner

Ce test vérifie que les ports SMTP sont maintenant débloqués 
et que l'envoi d'emails fonctionne depuis le serveur de production.

Envoyé le: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

Si vous recevez cet email, les ports SMTP sont débloqués et fonctionnels.

Détails techniques:
- Ports SMTP: 25, 465, 587 maintenant débloqués
- DMARC: p=none (accepte les emails même sans DKIM)
- SPF: Include l'IP du serveur 135.181.72.183
- Serveur SMTP: {smtp_host}:{smtp_port}
"""

msg.attach(MIMEText(text, 'plain'))
msg.attach(MIMEText(html, 'html'))

# Envoi
try:
    print(f"Connexion à {smtp_host}:{smtp_port}...")
    with smtplib.SMTP(smtp_host, smtp_port, timeout=30) as server:
        print("Démarrage TLS...")
        server.starttls()
        print(f"Authentification avec {smtp_user}...")
        server.login(smtp_user, smtp_pass)
        print("Envoi du message...")
        server.send_message(msg)
        print("\n✓ Email envoyé avec succès vers phil@pixanima.com")
        print("→ Vérifiez la boîte de réception pour confirmer la livraison")
        print("→ Les ports SMTP sont maintenant fonctionnels sur le serveur Hetzner")
except smtplib.SMTPConnectError as e:
    print(f"\n✗ Erreur de connexion SMTP: {e}")
    print("→ Le serveur mail.qwanyx.com n'est pas accessible depuis cette machine")
    print("→ Essayez d'exécuter ce script depuis le serveur de production")
except smtplib.SMTPAuthenticationError as e:
    print(f"\n✗ Erreur d'authentification: {e}")
    print("→ Vérifiez les identifiants SMTP")
except Exception as e:
    print(f"\n✗ Erreur: {e}")
    print(f"→ Type d'erreur: {type(e).__name__}")