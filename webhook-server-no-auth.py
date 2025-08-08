#!/usr/bin/env python3
"""
WEBHOOK SERVER - Auto-deploy sur push GitHub (SANS AUTHENTIFICATION POUR TEST)
"""

from flask import Flask, request, jsonify
import subprocess
import os

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def github_webhook():
    """Reçoit le webhook de GitHub et exécute le déploiement"""
    
    # Parser le payload
    payload = request.json
    print(f"📨 Webhook reçu: {payload.get('ref', 'unknown ref')}")
    
    # Vérifier que c'est un push sur main
    if payload.get('ref') == 'refs/heads/main':
        print(f"🚀 Push détecté sur main par {payload.get('pusher', {}).get('name', 'unknown')}")
        
        # Exécuter le déploiement
        try:
            # 1. Pull les changements
            print("→ Git pull...")
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
                if result.stderr:
                    print(f"Erreurs: {result.stderr}")
                
                # 3. Reset COMMANDS.sh
                with open(commands_file, 'w') as f:
                    f.write('''#!/bin/bash
# COMMANDES À EXÉCUTER SUR LE SERVEUR
# Claude écrit ici, le serveur exécute automatiquement après push

echo "📝 Pas de nouvelles commandes"
''')
                print("✅ COMMANDS.sh réinitialisé")
            
            return jsonify({
                'status': 'success',
                'message': 'Déploiement réussi'
            }), 200
            
        except Exception as e:
            print(f"❌ Erreur: {str(e)}")
            return jsonify({
                'status': 'error',
                'message': str(e)
            }), 500
    
    return jsonify({'status': 'ignored', 'ref': payload.get('ref')}), 200

@app.route('/health', methods=['GET'])
def health_check():
    """Point de santé pour vérifier que le serveur tourne"""
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    print("🚀 Webhook server démarré sur le port 9999 (SANS AUTH)")
    app.run(host='0.0.0.0', port=9999)