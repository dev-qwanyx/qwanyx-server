from flask import Flask, render_template, request, jsonify, redirect, url_for, send_from_directory
import os
import logging

# Désactiver les logs verbeux
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__, 
    template_folder='templates',
    static_folder='static'
)

# Configuration
app.config['SECRET_KEY'] = 'autodin-secret-key-change-in-production'
app.config['PROPAGATE_EXCEPTIONS'] = False

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

# Contact form handler
@app.route('/forms/contact', methods=['POST'])
def contact():
    return jsonify({
        'status': 'success',
        'message': 'Votre message a été envoyé. Merci!'
    })

# Newsletter form handler
@app.route('/forms/newsletter', methods=['POST'])
def newsletter():
    return jsonify({
        'status': 'success',
        'message': 'Vous êtes inscrit à la newsletter!'
    })

# Gestion des erreurs 404
@app.errorhandler(404)
def page_not_found(e):
    return render_template('index.html'), 404

# Gestionnaire d'erreurs global pour éviter les crashes
@app.errorhandler(Exception)
def handle_exception(e):
    app.logger.error(f'Erreur non gérée: {e}')
    return render_template('index.html'), 500

if __name__ == '__main__':
    print("=" * 50)
    print("AUTODIN - Mode Production (Anti-Crash)")
    print("URL: http://localhost:8090")
    print("Appuyez sur Ctrl+C pour arrêter")
    print("=" * 50)
    
    # Mode production - pas de debug, pas de reloader
    app.run(
        host='0.0.0.0',
        port=8090,
        debug=False,
        use_reloader=False,
        threaded=True
    )