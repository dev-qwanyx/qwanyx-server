from flask import Flask, render_template, send_from_directory, jsonify
import os

app = Flask(__name__)

# Configuration pour éviter les erreurs
app.config['TEMPLATES_AUTO_RELOAD'] = True

@app.route('/')
def index():
    try:
        return render_template('index_minimal.html')
    except Exception as e:
        print(f"Erreur template: {e}")
        return f"<h1>Autodin</h1><p>Erreur: {str(e)}</p>", 500

@app.route('/favicon.ico')
def favicon():
    try:
        return send_from_directory('static/assets/img', 'favicon.ico')
    except:
        return '', 204

# Route placeholder pour le formulaire de contact
@app.route('/contact', methods=['POST'])
def contact():
    return jsonify({"status": "ok", "message": "Message reçu"})

# Catch all
@app.route('/<path:path>')
def catch_all(path):
    return index()

if __name__ == '__main__':
    print("\n" + "="*50)
    print("AUTODIN - VERSION CLEAN")
    print("="*50)
    print("URL: http://localhost:8090")
    print("Toutes les routes sont gérées")
    print("="*50 + "\n")
    
    app.run(host='0.0.0.0', port=8090, debug=True)