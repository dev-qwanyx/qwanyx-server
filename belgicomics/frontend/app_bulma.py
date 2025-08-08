from flask import Flask, render_template, send_from_directory, jsonify, request, redirect, url_for
import os
import requests
from functools import wraps
from config import *

app = Flask(__name__)
app.secret_key = 'belgicomics-secret-key-change-in-production'
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

# Configuration
API_URL = API_BASE_URL

@app.route('/')
def index():
    print(f"Loading template from: {app.template_folder}")
    import os
    template_path = os.path.join(app.template_folder, 'index_bulma.html')
    print(f"Template exists: {os.path.exists(template_path)}")
    print(f"Template path: {template_path}")
    # Add delay to services for animation
    services_with_delay = []
    print(f"Loading SERVICES from config: {SERVICES}")
    for i, service in enumerate(SERVICES):
        service_copy = service.copy()
        service_copy['delay'] = str((i + 1) * 100)
        service_copy['auth_required'] = service.get('auth_required', False)
        services_with_delay.append(service_copy)
        print(f"Service {i}: {service_copy['title']} - {service_copy['description']}")
    
    return render_template('index_bulma.html', 
                         services=services_with_delay,
                         site_name=SITE_NAME,
                         site_tagline=SITE_TAGLINE,
                         site_description=SITE_DESCRIPTION,
                         brand_colors=BRAND_COLORS,
                         contact_info=CONTACT_INFO)

@app.route('/favicon.ico')
def favicon():
    try:
        return send_from_directory('static/assets/img', 'favicon.ico')
    except:
        return '', 204

@app.route('/login')
def login():
    return render_template('login_new.html')

@app.route('/register')
def register():
    return render_template('register_new.html')

@app.route('/mon-espace')
def mon_espace():
    return render_template('mon-espace.html')

@app.route('/mon-espace/catalogue')
def catalogue():
    return render_template('mon-espace/catalogue.html')

@app.route('/mon-espace/commandes')
def mes_commandes():
    return render_template('mon-espace/commandes.html')

@app.route('/mon-espace/nouvelle-commande')
def nouvelle_commande():
    return render_template('mon-espace/nouvelle-commande.html')

@app.route('/mon-espace/abonnements')
def abonnements():
    return render_template('mon-espace/abonnements.html')

@app.route('/mon-espace/favoris')
def favoris():
    return render_template('mon-espace/favoris.html')

@app.route('/mon-espace/messages')
def messages():
    return render_template('mon-espace/messages.html')

@app.route('/mon-espace/profil')
def profil():
    return render_template('mon-espace/profil.html')

@app.route('/api/auth/register', methods=['POST'])
def api_register():
    """Handle user registration"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password required'}), 400
            
        # Forward to QWANYX API if configured, otherwise handle locally
        try:
            response = requests.post(f'{API_URL}/auth/register', json=data)
            return jsonify(response.json()), response.status_code
        except:
            # Fallback: Simple local registration (for testing)
            return jsonify({
                'message': 'Registration successful',
                'user': {
                    'email': data.get('email'),
                    'firstName': data.get('firstName'),
                    'lastName': data.get('lastName')
                }
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def api_login():
    """Handle user login"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password required'}), 400
            
        # Forward to QWANYX API if configured, otherwise handle locally
        try:
            response = requests.post(f'{API_URL}/auth/login', json=data)
            return jsonify(response.json()), response.status_code
        except:
            # Fallback: Simple local login (for testing)
            if data.get('email') and data.get('password'):
                return jsonify({
                    'message': 'Login successful',
                    'token': 'test-token-' + data.get('email'),
                    'user': {
                        'email': data.get('email')
                    }
                }), 200
            else:
                return jsonify({'error': 'Invalid credentials'}), 401
                
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/logout')
def logout():
    # Frontend handles logout by clearing localStorage
    return redirect(url_for('index'))

@app.route('/contact', methods=['POST'])
def contact():
    try:
        data = request.get_json()
        
        # Send to API to save in database
        api_response = requests.post(f'{API_URL}/contacts', json={
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
    print("BELGICOMICS - QWANYX WORKSPACE")
    print("="*50)
    print("URL: http://localhost:8091")
    print("La plus grande librairie de BD en ligne")
    print("="*50 + "\n")
    
    app.run(
        host='0.0.0.0',
        port=8091,
        debug=True,  # Pour le développement
        use_reloader=False  # Disable auto-reload to prevent crashes
    )