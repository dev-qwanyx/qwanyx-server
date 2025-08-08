from flask import Flask, render_template, send_from_directory, jsonify, request, redirect, url_for
import os
import requests
from functools import wraps
from config import *

app = Flask(__name__)

# Function to get template context
def get_template_context():
    """Get common context for all templates"""
    return {
        'site_name': SITE_NAME,
        'site_tagline': SITE_TAGLINE,
        'site_description': SITE_DESCRIPTION,
        'brand_colors': BRAND_COLORS,
        'contact_info': CONTACT_INFO,
        'services': SERVICES,
        'api_url': API_BASE_URL
    }

# Routes
@app.route('/')
def index():
    return render_template('index_bulma.html', **get_template_context())

@app.route('/login')
def login():
    return render_template('login.html', **get_template_context())

@app.route('/register')
def register():
    return render_template('register.html', **get_template_context())

@app.route('/catalogue')
def catalogue():
    return render_template('catalogue.html', **get_template_context())

@app.route('/panier')
def panier():
    return render_template('panier.html', **get_template_context())

@app.route('/compte')
def compte():
    return render_template('compte.html', **get_template_context())

@app.route('/mes-annonces')
def mes_annonces():
    return render_template('mes_annonces.html', **get_template_context())

@app.route('/nouvelle-annonce')
def nouvelle_annonce():
    return render_template('nouvelle_annonce.html', **get_template_context())

# Static files (for completeness, Flask handles this automatically)
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

# Auth endpoints (proxied to API)
@app.route('/auth/<path:path>', methods=['GET', 'POST', 'OPTIONS'])
def proxy_auth(path):
    """Proxy auth requests to the API"""
    if request.method == 'OPTIONS':
        # Handle CORS preflight
        return '', 200
    
    api_url = f"{API_BASE_URL}/auth/{path}"
    
    if request.method == 'POST':
        resp = requests.post(api_url, json=request.get_json())
    else:
        resp = requests.get(api_url)
    
    return resp.json(), resp.status_code

@app.route('/logout')
def logout():
    # Frontend handles logout by clearing localStorage
    return redirect(url_for('index'))

@app.route('/contact', methods=['POST'])
def contact():
    try:
        data = request.get_json()
        
        # Send to API to save in database
        api_response = requests.post(f'{API_BASE_URL}/contacts', json={
            'workspace': 'autodin-be',  # Updated to workspace
            'name': data.get('name'),
            'email': data.get('email'),
            'subject': data.get('subject'),
            'message': data.get('message')
        })
        
        if api_response.status_code == 201:
            return jsonify({"status": "ok", "message": "Message reçu et enregistré"})
        else:
            return jsonify({"status": "error", "message": "Erreur lors de l'enregistrement"}), 500
            
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    print("\n" + "="*50)
    print("BELGICOMICS - STABLE SERVER")
    print("="*50)
    print("URL: http://localhost:8091")
    print("No debug mode - More stable!")
    print("="*50 + "\n")
    
    # Run without debug mode for stability
    app.run(
        host='0.0.0.0',
        port=8091,
        debug=False,  # No debug mode
        use_reloader=False,  # No auto-reload
        threaded=True  # Handle multiple requests
    )