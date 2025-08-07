from flask import Flask, render_template, send_from_directory
import os
import logging

# Désactiver les logs Flask
logging.getLogger('werkzeug').setLevel(logging.ERROR)

app = Flask(__name__)

# Configuration minimale
app.config['TEMPLATES_AUTO_RELOAD'] = False
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 3600

@app.route('/')
def index():
    try:
        return render_template('index.html')
    except Exception as e:
        return f"<h1>Autodin</h1><p>Erreur template: {str(e)}</p>", 500

@app.route('/favicon.ico')
def favicon():
    return send_from_directory('static/assets/img', 'favicon.ico', mimetype='image/x-icon')

# Catch all pour éviter les 404
@app.route('/<path:path>')
def catch_all(path):
    return index()

if __name__ == '__main__':
    print("\n" + "="*50)
    print("AUTODIN - VERSION ULTRA STABLE")
    print("="*50)
    print("URL: http://localhost:8090")
    print("Cette version ne devrait PAS planter")
    print("="*50 + "\n")
    
    # Mode production simple
    app.run(host='0.0.0.0', port=8090, debug=False)