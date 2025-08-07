from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from pymongo import MongoClient
from datetime import datetime, timedelta
import bcrypt
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-this-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
app.config['MONGO_URI'] = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
# Each site has its own database

# Email config
app.config['SMTP_HOST'] = os.getenv('SMTP_HOST', 'smtp.gmail.com')
app.config['SMTP_PORT'] = int(os.getenv('SMTP_PORT', '587'))
app.config['SMTP_USER'] = os.getenv('SMTP_USER')
app.config['SMTP_PASS'] = os.getenv('SMTP_PASS')
app.config['SMTP_FROM'] = os.getenv('SMTP_FROM', 'QWANYX <noreply@qwanyx.com>')

# Extensions
CORS(app, origins="*", supports_credentials=True)
jwt = JWTManager(app)

# MongoDB
client = MongoClient(app.config['MONGO_URI'])

# Central database for site management only
central_db = client['qwanyx_central']
sites_collection = central_db.sites

# Function to get site-specific database
def get_site_db(site_code):
    """Get database for a specific site"""
    # Convert domain to valid DB name (replace . with -)
    db_name = site_code.replace('.', '-')
    return client[db_name]

# Function to get collections for a site
def get_site_collections(site_code):
    """Get all collections for a specific site"""
    db = get_site_db(site_code)
    return {
        'users': db.users,
        'sessions': db.sessions,
        'auth_codes': db.auth_codes,
        'contacts': db.contacts,
        'notifications': db.notifications
    }

# Email sending function
def send_auth_code_email(to_email, code, site_code=None):
    """Send authentication code via email"""
    try:
        # Get site info for branding
        site_name = "QWANYX"
        if site_code:
            site = sites_collection.find_one({'code': site_code})
            if site:
                site_name = site.get('name', 'QWANYX')
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"{site_name} - Code de connexion"
        msg['From'] = app.config['SMTP_FROM']
        msg['To'] = to_email
        
        # HTML body
        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Votre code de connexion {site_name}</h2>
            <p>Utilisez ce code pour vous connecter :</p>
            <h1 style="background: #f0f0f0; padding: 20px; text-align: center; letter-spacing: 5px;">
                {code}
            </h1>
            <p>Ce code expire dans 10 minutes.</p>
            <p>Si vous n'avez pas demandé ce code, ignorez cet email.</p>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(html, 'html'))
        
        # Send email
        if app.config['SMTP_PORT'] == 465:
            # Port 465 uses SSL
            with smtplib.SMTP_SSL(app.config['SMTP_HOST'], app.config['SMTP_PORT']) as server:
                server.login(app.config['SMTP_USER'], app.config['SMTP_PASS'])
                server.send_message(msg)
        else:
            # Port 587 uses STARTTLS
            with smtplib.SMTP(app.config['SMTP_HOST'], app.config['SMTP_PORT']) as server:
                server.starttls()
                server.login(app.config['SMTP_USER'], app.config['SMTP_PASS'])
                server.send_message(msg)
            
        print(f"Email sent to {to_email}")
        
    except Exception as e:
        print(f"Failed to send email: {e}")
        raise

# Health check
@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'service': 'QWANYX Central API',
        'timestamp': datetime.utcnow().isoformat()
    })

# Site management
@app.route('/sites', methods=['GET'])
def get_sites():
    try:
        site_list = list(sites_collection.find({}, {'_id': 0}))
        return jsonify(site_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/sites', methods=['POST'])
@jwt_required()
def create_site():
    try:
        data = request.get_json()
        site = {
            'code': data['code'],  # 'autodin', 'personal-cash', etc.
            'name': data['name'],
            'domain': data.get('domain'),
            'description': data.get('description'),
            'is_active': True,
            'created_at': datetime.utcnow(),
            'settings': data.get('settings', {})
        }
        sites_collection.insert_one(site)
        
        # Create database for this site
        site_db = get_site_db(data['code'])
        # Create indexes
        site_db.users.create_index('email', unique=True)
        site_db.auth_codes.create_index('expires_at', expireAfterSeconds=0)
        
        return jsonify({'message': 'Site created'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Authentication by code (passwordless)
@app.route('/auth/request-code', methods=['POST'])
def request_code():
    try:
        data = request.get_json()
        email = data.get('email')
        site_code = data.get('site')  # Which site is requesting
        
        if not email:
            return jsonify({'error': 'Email required'}), 400
        
        # Get site collections
        if not site_code:
            return jsonify({'error': 'Site code required'}), 400
            
        collections = get_site_collections(site_code)
        
        # Generate 6-digit code
        code = ''.join(random.choices(string.digits, k=6))
        
        # Store code (expires in 10 minutes)
        collections['auth_codes'].insert_one({
            'email': email,
            'code': code,
            'site': site_code,
            'created_at': datetime.utcnow(),
            'expires_at': datetime.utcnow() + timedelta(minutes=10),
            'used': False
        })
        
        # Send email with code
        if app.config['SMTP_USER'] and app.config['SMTP_PASS']:
            try:
                send_auth_code_email(email, code, site_code)
            except Exception as email_error:
                print(f"Email error: {email_error}")
        
        # Always print for testing/dev
        print(f"AUTH CODE for {email}: {code}")
        
        return jsonify({'message': 'Code sent'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/auth/verify-code', methods=['POST'])
def verify_code():
    try:
        data = request.get_json()
        email = data.get('email')
        code = data.get('code')
        site_code = data.get('site')
        
        # Get site collections
        if not site_code:
            return jsonify({'error': 'Site code required'}), 400
            
        collections = get_site_collections(site_code)
        
        # Find valid code
        auth_code = collections['auth_codes'].find_one({
            'email': email,
            'code': code,
            'used': False,
            'expires_at': {'$gt': datetime.utcnow()}
        })
        
        if not auth_code:
            return jsonify({'error': 'Invalid or expired code'}), 401
        
        # Mark as used
        collections['auth_codes'].update_one(
            {'_id': auth_code['_id']},
            {'$set': {'used': True, 'used_at': datetime.utcnow()}}
        )
        
        # Find or create user IN SITE-SPECIFIC DATABASE
        user = collections['users'].find_one({'email': email})
        if not user:
            # Create new user
            user = {
                'email': email,
                'created_at': datetime.utcnow(),
                'is_active': True,
                'auth_method': 'code'
            }
            result = collections['users'].insert_one(user)
            user_id = str(result.inserted_id)
        else:
            user_id = str(user['_id'])
        
        # Create token (include site in token)
        access_token = create_access_token(
            identity=user_id,
            additional_claims={'site': site_code}
        )
        
        # Log session
        collections['sessions'].insert_one({
            'user_id': ObjectId(user_id),
            'login_at': datetime.utcnow(),
            'auth_method': 'code',
            'ip': request.remote_addr
        })
        
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user_id,
                'email': email
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Authentication endpoints
@app.route('/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        
        # Validate
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        # Check if user exists
        if users.find_one({'email': email}):
            return jsonify({'error': 'User already exists'}), 409
        
        # Hash password
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Create user
        user = {
            'email': email,
            'password': hashed,
            'name': name,
            'created_at': datetime.utcnow(),
            'apps': [],
            'is_active': True
        }
        
        result = users.insert_one(user)
        
        # Create token
        access_token = create_access_token(identity=str(result.inserted_id))
        
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': str(result.inserted_id),
                'email': email,
                'name': name
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        # Find user
        user = users.find_one({'email': email})
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Check password
        if not bcrypt.checkpw(password.encode('utf-8'), user['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Create token
        access_token = create_access_token(identity=str(user['_id']))
        
        # Log session
        sessions.insert_one({
            'user_id': user['_id'],
            'login_at': datetime.utcnow(),
            'ip': request.remote_addr,
            'user_agent': request.headers.get('User-Agent')
        })
        
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': str(user['_id']),
                'email': user['email'],
                'name': user.get('name'),
                'apps': user.get('apps', [])
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/auth/me', methods=['GET'])
@jwt_required()
def me():
    try:
        user_id = get_jwt_identity()
        user = users.find_one({'_id': ObjectId(user_id)})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'id': str(user['_id']),
            'email': user['email'],
            'name': user.get('name'),
            'apps': user.get('apps', []),
            'created_at': user['created_at'].isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# User management
@app.route('/users/<user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    try:
        user = users.find_one({'_id': ObjectId(user_id)})
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'id': str(user['_id']),
            'email': user['email'],
            'name': user.get('name'),
            'created_at': user['created_at'].isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/users/<user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    try:
        current_user_id = get_jwt_identity()
        if current_user_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        data = request.get_json()
        update = {}
        
        if 'name' in data:
            update['name'] = data['name']
        if 'email' in data:
            update['email'] = data['email']
        
        if update:
            update['updated_at'] = datetime.utcnow()
            users.update_one({'_id': ObjectId(user_id)}, {'$set': update})
        
        return jsonify({'message': 'User updated'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Notifications
@app.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    try:
        user_id = get_jwt_identity()
        notifs = list(notifications.find({
            'user_id': ObjectId(user_id),
            'read': False
        }).sort('created_at', -1).limit(50))
        
        for notif in notifs:
            notif['id'] = str(notif.pop('_id'))
            notif['user_id'] = str(notif['user_id'])
            notif['created_at'] = notif['created_at'].isoformat()
        
        return jsonify(notifs)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/notifications', methods=['POST'])
@jwt_required()
def create_notification():
    try:
        data = request.get_json()
        
        notification = {
            'user_id': ObjectId(data['user_id']),
            'title': data['title'],
            'message': data['message'],
            'type': data.get('type', 'info'),
            'app': data.get('app'),
            'read': False,
            'created_at': datetime.utcnow()
        }
        
        result = notifications.insert_one(notification)
        
        return jsonify({
            'id': str(result.inserted_id),
            'message': 'Notification created'
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/notifications/<notif_id>/read', methods=['PUT'])
@jwt_required()
def mark_notification_read(notif_id):
    try:
        user_id = get_jwt_identity()
        
        result = notifications.update_one(
            {
                '_id': ObjectId(notif_id),
                'user_id': ObjectId(user_id)
            },
            {'$set': {'read': True, 'read_at': datetime.utcnow()}}
        )
        
        if result.modified_count == 0:
            return jsonify({'error': 'Notification not found'}), 404
        
        return jsonify({'message': 'Notification marked as read'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# App registration (for tracking which apps users have access to)
@app.route('/apps/register', methods=['POST'])
@jwt_required()
def register_app():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        app_name = data.get('app_name')
        
        if not app_name:
            return jsonify({'error': 'App name required'}), 400
        
        # Add app to user's list
        users.update_one(
            {'_id': ObjectId(user_id)},
            {'$addToSet': {'apps': app_name}}
        )
        
        # Log app access
        apps.insert_one({
            'user_id': ObjectId(user_id),
            'app_name': app_name,
            'registered_at': datetime.utcnow()
        })
        
        return jsonify({'message': f'App {app_name} registered'}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Contact management
@app.route('/contacts', methods=['POST'])
def create_contact():
    try:
        data = request.get_json()
        site_code = data.get('site')
        
        if not site_code:
            return jsonify({'error': 'Site code required'}), 400
            
        collections = get_site_collections(site_code)
        
        # Create contact
        contact = {
            'name': data.get('name'),
            'email': data.get('email'),
            'subject': data.get('subject'),
            'message': data.get('message'),
            'created_at': datetime.utcnow(),
            'ip': request.remote_addr,
            'status': 'new'
        }
        
        result = collections['contacts'].insert_one(contact)
        
        # Optional: Send notification email
        # send_contact_notification(contact, site_code)
        
        return jsonify({
            'id': str(result.inserted_id),
            'message': 'Contact saved successfully'
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Error handlers
@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({'error': 'Internal server error'}), 500

# Import ObjectId after MongoDB setup
from bson import ObjectId
import random
import string
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

if __name__ == '__main__':
    print("\n" + "="*50)
    print("QWANYX CENTRAL API")
    print("="*50)
    print("URL: http://localhost:5002")
    print("MongoDB:", app.config['MONGO_URI'])
    print("Database: qwanyx_central")
    print("="*50 + "\n")
    
    app.run(
        host='0.0.0.0',
        port=5002,  # Changed to 5002 to avoid conflicts
        debug=True
    )