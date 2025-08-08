#!/usr/bin/env python3
"""
WEBHOOK SIMPLE - Auto-deploy sans authentification
Version simplifiée pour démarrage rapide
"""

from flask import Flask, request, jsonify
import subprocess
import os

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    """Endpoint de santé pour vérifier que le webhook fonctionne"""
    return jsonify({'status': 'ok', 'service': 'webhook-simple'}), 200

@app.route('/webhook', methods=['POST'])
def github_webhook():
    """Reçoit le webhook de GitHub et exécute le déploiement"""
    
    try:
        # Parser le payload
        payload = request.json
        
        # Vérifier que c'est un push sur main
        if payload and payload.get('ref') == 'refs/heads/main':
            print(f"🚀 Push détecté sur main")
            
            # Exécuter le déploiement
            # 1. Pull les changements
            subprocess.run([
                'git', 'pull', 'origin', 'main'
            ], cwd='/opt/qwanyx/apps/qwanyx-server', check=True)
            
            # 2. Exécuter COMMANDS.sh s'il existe
            commands_file = '/opt/qwanyx/apps/qwanyx-server/COMMANDS.sh'
            if os.path.exists(commands_file):
                print("📝 Exécution de COMMANDS.sh...")
                subprocess.run(['chmod', '+x', commands_file], check=True)
                result = subprocess.run(['bash', commands_file], 
                                       capture_output=True, 
                                       text=True,
                                       cwd='/opt/qwanyx/apps/qwanyx-server')
                print(result.stdout)
                if result.stderr:
                    print("Erreurs:", result.stderr)
            
            return jsonify({
                'status': 'success',
                'message': 'Déploiement réussi'
            }), 200
            
    except Exception as e:
        print(f"Erreur: {e}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
    
    return jsonify({'status': 'ignored', 'message': 'Not a push to main'}), 200

@app.route('/', methods=['GET'])
def index():
    """Page d'accueil du webhook"""
    return '''
    <h1>Webhook Server</h1>
    <p>Status: Running</p>
    <p>Endpoints:</p>
    <ul>
        <li>POST /webhook - GitHub webhook endpoint</li>
        <li>GET /health - Health check</li>
    </ul>
    ''', 200

if __name__ == '__main__':
    print("🚀 Webhook server démarré sur le port 9999")
    app.run(host='0.0.0.0', port=9999, debug=False)