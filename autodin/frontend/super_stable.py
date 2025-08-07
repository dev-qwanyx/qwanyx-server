from flask import Flask, render_template, jsonify, send_from_directory
import os
import signal
import sys

app = Flask(__name__, 
    template_folder='templates',
    static_folder='static'
)

# Désactiver TOUTES les fonctionnalités qui peuvent causer des crashes
app.config.update(
    ENV='production',
    DEBUG=False,
    TESTING=False,
    PROPAGATE_EXCEPTIONS=False,
    PRESERVE_CONTEXT_ON_EXCEPTION=False,
    TRAP_BAD_REQUEST_ERRORS=False,
    TRAP_HTTP_EXCEPTIONS=False,
    EXPLAIN_TEMPLATE_LOADING=False,
    TEMPLATES_AUTO_RELOAD=False
)

@app.route('/favicon.ico')
def favicon():
    try:
        return send_from_directory('static/assets/img', 'favicon.ico')
    except:
        return '', 204

@app.route('/')
def index():
    try:
        return render_template('index.html')
    except Exception as e:
        print(f"Erreur: {e}")
        return "<h1>Autodin</h1><p>Erreur de template</p>", 200

# Routes simplifiées
@app.route('/<path:path>')
def catch_all(path):
    return index()

# Gestionnaire de signal pour fermeture propre
def signal_handler(sig, frame):
    print('\nArrêt du serveur...')
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)

if __name__ == '__main__':
    print("\n" + "="*50)
    print("AUTODIN - VERSION SUPER STABLE")
    print("="*50)
    print("URL: http://localhost:8090")
    print("Ctrl+C pour arrêter")
    print("="*50 + "\n")
    
    # Utiliser le serveur Werkzeug simple, pas de threads
    from werkzeug.serving import run_simple
    run_simple('0.0.0.0', 8090, app, 
               use_reloader=False, 
               use_debugger=False,
               threaded=False)