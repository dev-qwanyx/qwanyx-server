#!/bin/bash
# COMMANDES À EXÉCUTER SUR LE SERVEUR
# Claude écrit ici, le serveur exécute automatiquement après pull

echo "📝 Installation du webhook-server.py corrigé..."

# Remplacer le webhook-server.py par la version corrigée
cat > /opt/qwanyx/apps/qwanyx-server/webhook-server.py << 'EOF'
#!/usr/bin/env python3
"""
WEBHOOK SERVER - Auto-deploy sur push GitHub
À installer sur le serveur 135.181.72.183
"""

from flask import Flask, request, jsonify
import subprocess
import hmac
import hashlib
import os

app = Flask(__name__)

# Secret pour sécuriser le webhook (à configurer dans GitHub)
WEBHOOK_SECRET = "ghp_IKOdJCQJWQBLAPbHGY6vBFpZhtxVxO3ucZ2K"

def verify_signature(payload, signature):
    """Vérifie que le webhook vient bien de GitHub"""
    expected = hmac.new(
        WEBHOOK_SECRET.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)

@app.route('/webhook', methods=['POST'])
def github_webhook():
    """Reçoit le webhook de GitHub et exécute le déploiement"""
    
    # Vérifier la signature
    signature = request.headers.get('X-Hub-Signature-256')
    if not verify_signature(request.data, signature):
        return jsonify({'error': 'Invalid signature'}), 401
    
    # Parser le payload
    payload = request.json
    
    # Vérifier que c'est un push sur main
    if payload.get('ref') == 'refs/heads/main':
        print(f"🚀 Push détecté sur main par {payload['pusher']['name']}")
        
        # Exécuter le déploiement
        try:
            # 1. Pull les changements
            subprocess.run([
                'git', 'pull', 'origin', 'main'
            ], cwd='/opt/qwanyx/apps/qwanyx-server', check=True)
            
            # 2. Exécuter COMMANDS.sh s'il existe
            commands_file = '/opt/qwanyx/apps/qwanyx-server/COMMANDS.sh'
            if os.path.exists(commands_file):
                print("📝 Exécution de COMMANDS.sh...")
                subprocess.run(['chmod', '+x', commands_file], check=True)
                result = subprocess.run([commands_file], capture_output=True, text=True)
                print(result.stdout)
                
                # 3. Reset COMMANDS.sh
                with open(commands_file, 'w') as f:
                    f.write('''#!/bin/bash
# COMMANDES À EXÉCUTER SUR LE SERVEUR
# Claude écrit ici, le serveur exécute automatiquement après push

echo "📝 Pas de nouvelles commandes"
''')
                
                # Commit le reset
                subprocess.run(['git', 'add', 'COMMANDS.sh'], 
                             cwd='/opt/qwanyx/apps/qwanyx-server')
                subprocess.run(['git', 'commit', '-m', 'Reset COMMANDS.sh après exécution'], 
                             cwd='/opt/qwanyx/apps/qwanyx-server')
                # Note: On ne push pas pour éviter une boucle infinie
            
            return jsonify({
                'status': 'success',
                'message': 'Déploiement réussi',
                'pusher': payload['pusher']['name']
            }), 200
            
        except Exception as e:
            return jsonify({
                'status': 'error',
                'message': str(e)
            }), 500
    
    return jsonify({'status': 'ignored'}), 200

@app.route('/health', methods=['GET'])
def health_check():
    """Point de santé pour vérifier que le serveur tourne"""
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    print("🚀 Webhook server démarré sur le port 9999")
    app.run(host='0.0.0.0', port=9999)
EOF

echo "✅ webhook-server.py corrigé"

# Tester le fichier Python
echo "→ Test de syntaxe Python..."
python3 -m py_compile /opt/qwanyx/apps/qwanyx-server/webhook-server.py && echo "✅ Syntaxe OK" || echo "❌ Erreur de syntaxe"

# Lancer le webhook server
echo "→ Lancement du webhook server..."
cd /opt/qwanyx/apps/qwanyx-server
nohup python3 webhook-server.py > webhook.log 2>&1 &
echo "✅ Webhook server lancé en arrière-plan"

# Afficher les logs
sleep 2
echo "→ Logs du webhook server:"
tail -n 20 webhook.log