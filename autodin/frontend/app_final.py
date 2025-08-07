from flask import Flask, render_template, send_from_directory, jsonify
import os
import logging

# Réduire les logs
logging.basicConfig(level=logging.WARNING)

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index_minimal.html')

@app.route('/favicon.ico')
def favicon():
    try:
        return send_from_directory('static/assets/img', 'favicon.ico')
    except:
        return '', 204

@app.route('/contact', methods=['POST'])
def contact():
    return jsonify({"status": "ok", "message": "Message reçu"})

# Route générique
@app.route('/<path:path>')
def catch_all(path):
    return index()

if __name__ == '__main__':
    print("\n" + "="*50)
    print("AUTODIN - VERSION FINALE STABLE")
    print("="*50)
    print("URL: http://localhost:8090")
    print("Template minimal chargé")
    print("="*50 + "\n")
    
    # Mode production sans debug
    app.run(
        host='0.0.0.0',
        port=8090,
        debug=False,
        use_reloader=True,  # Pour le développement
        threaded=True
    )