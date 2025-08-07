from flask import Flask, render_template, request, jsonify, redirect, url_for, send_from_directory
import os

app = Flask(__name__, 
    template_folder='templates',
    static_folder='static'
)

# Configuration
app.config['SECRET_KEY'] = 'autodin-secret-key-change-in-production'

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static/assets/img'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/portfolio-details')
def portfolio_details():
    return render_template('portfolio-details.html')

@app.route('/service-details')
def service_details():
    return render_template('service-details.html')

@app.route('/starter-page')
def starter_page():
    return render_template('sarter-page.html')

# Contact form handler (remplace contact.php)
@app.route('/forms/contact', methods=['POST'])
def contact():
    # Récupérer les données du formulaire
    name = request.form.get('name')
    email = request.form.get('email')
    subject = request.form.get('subject')
    message = request.form.get('message')
    
    # TODO: Intégrer avec le service Mail
    # Pour l'instant, on retourne juste un succès
    return jsonify({
        'status': 'success',
        'message': 'Votre message a été envoyé. Merci!'
    })

# Newsletter form handler (remplace newsletter.php)
@app.route('/forms/newsletter', methods=['POST'])
def newsletter():
    email = request.form.get('email')
    
    # TODO: Sauvegarder dans DB ou envoyer vers service
    return jsonify({
        'status': 'success',
        'message': 'Vous êtes inscrit à la newsletter!'
    })

# Gestion des erreurs 404
@app.errorhandler(404)
def page_not_found(e):
    return render_template('index.html'), 404

if __name__ == '__main__':
    # Mode développement
    app.run(debug=True, host='0.0.0.0', port=8090)