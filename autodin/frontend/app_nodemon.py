from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory('static/assets/img', 'favicon.ico')

@app.route('/<path:path>')
def catch_all(path):
    return index()

if __name__ == '__main__':
    print("\n" + "="*50)
    print("AUTODIN - VERSION SIMPLE")
    print("="*50)
    print("URL: http://localhost:8090")
    print("Utilisez nodemon pour auto-reload!")
    print("="*50 + "\n")
    
    app.run(host='0.0.0.0', port=8090, debug=False)