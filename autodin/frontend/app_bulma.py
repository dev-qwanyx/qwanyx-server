from flask import Flask, render_template, send_from_directory, jsonify, request, redirect, url_for
import os
import requests
from functools import wraps

app = Flask(__name__)
app.secret_key = 'autodin-secret-key-change-in-production'

# Configuration
API_URL = 'http://135.181.72.183'

@app.route('/')
def index():
    services = [
        {
            'icon': 'fa-search',
            'title': 'Chercher dans le stock',
            'description': 'Accédez instantanément au vaste inventaire de nos partenaires. Des milliers de références disponibles.',
            'delay': '100',
            'link': '/mon-autodin/recherche',
            'auth_required': True
        },
        {
            'icon': 'fa-comments',
            'title': 'Faire une demande',
            'description': 'Diffusez facilement vos besoins spécifiques. Notre réseau vous répond rapidement.',
            'delay': '200',
            'link': '/mon-autodin/nouvelle-demande',
            'auth_required': True
        },
        {
            'icon': 'fa-car',
            'title': 'Proposer un véhicule',
            'description': 'Valorisez vos véhicules endommagés ou destinés aux pièces auprès d\'acheteurs qualifiés.',
            'delay': '300',
            'link': '/mon-autodin/nouvelle-annonce?type=vehicule',
            'auth_required': True
        },
        {
            'icon': 'fa-tags',
            'title': 'Véhicules d\'occasion',
            'description': 'Découvrez notre sélection de véhicules d\'occasion vérifiés par des vendeurs de confiance.',
            'delay': '400',
            'link': '/mon-autodin/vehicules',
            'auth_required': True
        },
        {
            'icon': 'fa-handshake',
            'title': 'Devenir partenaire',
            'description': 'Rejoignez notre réseau et accédez à des milliers d\'acheteurs potentiels.',
            'delay': '500',
            'link': '/mon-autodin/profil',
            'auth_required': True
        },
        {
            'icon': 'fa-truck',
            'title': 'Livraison rapide',
            'description': 'Expédition sous 24-48h avec nos partenaires transporteurs de confiance.',
            'delay': '600'
        }
    ]
    return render_template('index_bulma.html', services=services)

@app.route('/favicon.ico')
def favicon():
    try:
        return send_from_directory('static/assets/img', 'favicon.ico')
    except:
        return '', 204

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/mon-autodin')
def mon_autodin():
    return render_template('mon-autodin.html')

@app.route('/mon-autodin/recherche')
def recherche():
    return render_template('mon-autodin/recherche.html')

@app.route('/mon-autodin/annonces')
def mes_annonces():
    return render_template('mon-autodin/annonces.html')

@app.route('/mon-autodin/nouvelle-annonce')
def nouvelle_annonce():
    return render_template('mon-autodin/nouvelle-annonce.html')

@app.route('/mon-autodin/nouvelle-demande')
def nouvelle_demande():
    return render_template('mon-autodin/nouvelle-demande.html')

@app.route('/mon-autodin/vehicules')
def vehicules():
    return render_template('mon-autodin/vehicules.html')

@app.route('/mon-autodin/messages')
def messages():
    return render_template('mon-autodin/messages.html')

@app.route('/mon-autodin/profil')
def profil():
    return render_template('mon-autodin/profil.html')

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
    print("AUTODIN - VERSION BULMA")
    print("="*50)
    print("URL: http://localhost:8090")
    print("Framework CSS Bulma - Simple et stable")
    print("="*50 + "\n")
    
    app.run(
        host='0.0.0.0',
        port=8090,
        debug=True  # Pour le développement avec auto-reload
    )