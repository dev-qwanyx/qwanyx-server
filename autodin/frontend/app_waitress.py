from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory('static/assets/img', 'favicon.ico')

if __name__ == '__main__':
    print("\n" + "="*50)
    print("AUTODIN - SERVEUR PRODUCTION (WAITRESS)")
    print("="*50)
    print("URL: http://localhost:8090")
    print("Cette version utilise un serveur WSGI stable")
    print("="*50 + "\n")
    
    # Utiliser Waitress au lieu du serveur de développement Flask
    from waitress import serve
    serve(app, host='0.0.0.0', port=8090)