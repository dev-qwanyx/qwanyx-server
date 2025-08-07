from flask import Flask, render_template_string, send_from_directory
import os

app = Flask(__name__)

# Template minimaliste pour tester
SIMPLE_TEMPLATE = '''
<!DOCTYPE html>
<html>
<head>
    <title>Autodin</title>
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
</head>
<body>
    <h1>Autodin - Marketplace de pièces auto</h1>
    <p>Version simplifiée pour tests</p>
    <ul>
        <li><a href="/">Accueil</a></li>
        <li><a href="/test">Test</a></li>
    </ul>
</body>
</html>
'''

@app.route('/')
def index():
    # Utiliser un template simple pour voir si c'est le template complexe qui cause le problème
    return render_template_string(SIMPLE_TEMPLATE)

@app.route('/test')
def test():
    return "<h1>Page de test</h1><p>Si vous voyez ceci, le serveur fonctionne!</p>"

@app.route('/favicon.ico')
def favicon():
    try:
        return send_from_directory('static/assets/img', 'favicon.ico')
    except:
        return '', 204

if __name__ == '__main__':
    print("\nAutodin - Version Simple")
    print("http://localhost:8090")
    print("Cette version utilise un template minimal\n")
    
    app.run(port=8090, debug=False)