from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__)

# Mode développement avec rechargement automatique
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['ENV'] = 'development'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory('static/assets/img', 'favicon.ico')

# Route générique pour éviter les 404
@app.route('/<path:path>')
def catch_all(path):
    return index()

if __name__ == '__main__':
    print("\n" + "="*50)
    print("AUTODIN - MODE DÉVELOPPEMENT")
    print("="*50)
    print("URL: http://localhost:8090")
    print("* Rechargement automatique active")
    print("* Les modifications sont prises en compte")
    print("="*50 + "\n")
    
    # Mode debug activé pour le rechargement automatique
    app.run(
        host='0.0.0.0',
        port=8090,
        debug=True,
        use_reloader=True,
        use_debugger=False
    )