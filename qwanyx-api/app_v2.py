from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from pymongo import MongoClient
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Import services
from services import WorkspaceService, DHService, AppService

# Import routes
from routes import workspaces_bp, init_services as init_route_services

load_dotenv()

app = Flask(__name__)

# Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-this-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
app.config['MONGO_URI'] = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')

# Email config
app.config['SMTP_HOST'] = os.getenv('SMTP_HOST', 'smtp.gmail.com')
app.config['SMTP_PORT'] = int(os.getenv('SMTP_PORT', '587'))
app.config['SMTP_USER'] = os.getenv('SMTP_USER')
app.config['SMTP_PASS'] = os.getenv('SMTP_PASS')
app.config['SMTP_FROM'] = os.getenv('SMTP_FROM', 'QWANYX <noreply@qwanyx.com>')

# Extensions - Allow all origins in development for simplicity
CORS(app, 
     origins="*",
     allow_headers=["Content-Type", "Authorization", "X-Workspace"],
     allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     supports_credentials=True)
jwt = JWTManager(app)

# MongoDB
client = MongoClient(app.config['MONGO_URI'])

# Initialize services
workspace_service = WorkspaceService(client)
dh_service = DHService(client)
app_service = AppService(client)

# Initialize routes with services
init_route_services(workspace_service, app_service, dh_service)

# Register blueprints
app.register_blueprint(workspaces_bp)

# Import email functions from original app
from bson import ObjectId
import random
import string
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Email sending function
def send_auth_code_email(to_email, code, workspace_code=None):
    """Send authentication code via email"""
    try:
        # Get workspace info for branding
        workspace_name = "QWANYX"
        if workspace_code:
            workspace = workspace_service.get_workspace(workspace_code)
            if workspace:
                workspace_name = workspace.get('name', 'QWANYX')
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"{workspace_name} - Code de connexion"
        msg['From'] = app.config['SMTP_FROM']
        msg['To'] = to_email
        
        # HTML body
        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Votre code de connexion {workspace_name}</h2>
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
        'service': 'QWANYX API v2',
        'timestamp': datetime.utcnow().isoformat()
    })

# Authentication by code (updated for workspaces)
@app.route('/auth/request-code', methods=['POST'])
@app.route('/auth/login', methods=['POST'])  # Alias for compatibility
def request_code():
    try:
        data = request.get_json()
        email = data.get('email')
        workspace_code = data.get('workspace')  # Changed from 'site' to 'workspace'
        
        if not email or not workspace_code:
            return jsonify({'error': 'Email and workspace required'}), 400
        
        # Get workspace
        workspace = workspace_service.get_workspace(workspace_code)
        if not workspace:
            return jsonify({'error': 'Workspace not found'}), 404
            
        workspace_db = workspace_service.get_workspace_db(workspace_code)
        
        # Check if user exists
        existing_user = workspace_db.users.find_one({'email': email})
        if not existing_user:
            return jsonify({'error': 'Aucun compte trouvé avec cet email. Veuillez vous inscrire.'}), 404
        
        # Generate 6-digit code
        code = ''.join(random.choices(string.digits, k=6))
        
        # Store code in workspace database
        workspace_db.auth_codes.insert_one({
            'email': email,
            'code': code,
            'created_at': datetime.utcnow(),
            'expires_at': datetime.utcnow() + timedelta(minutes=10),
            'used': False
        })
        
        # Send email with code
        if app.config['SMTP_USER'] and app.config['SMTP_PASS']:
            try:
                send_auth_code_email(email, code, workspace_code)
            except Exception as email_error:
                print(f"Email error: {email_error}")
        
        # Always print for testing/dev
        print(f"AUTH CODE for {email}: {code}", flush=True)
        
        return jsonify({'message': 'Code sent'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        email = data.get('email')
        workspace_code = data.get('workspace')
        
        # Minimum required: email and workspace
        if not email or not workspace_code:
            return jsonify({'error': 'Email and workspace required'}), 400
            
        workspace_db = workspace_service.get_workspace_db(workspace_code)
        if workspace_db is None:
            return jsonify({'error': 'Workspace not found'}), 404
        
        # Check if user already exists
        existing_user = workspace_db.users.find_one({'email': email})
        if existing_user:
            return jsonify({'error': 'User already exists'}), 409
        
        # Create basic user with optional metadata
        user = {
            'email': email,
            'created_at': datetime.utcnow(),
            'is_active': True,
            'auth_method': 'code'
        }
        
        # Add any additional fields from metadata
        metadata = data.get('metadata', {})
        if metadata:
            # Store all metadata fields directly in user document
            user.update(metadata)
        
        # Legacy support: handle old field names if present
        if data.get('firstName'):
            user['first_name'] = data.get('firstName')
        if data.get('lastName'):
            user['last_name'] = data.get('lastName')
        if data.get('phone'):
            user['phone'] = data.get('phone')
        if data.get('accountType'):
            user['account_type'] = data.get('accountType')
        
        # Legacy support for professional fields
        if data.get('accountType') == 'professionnel' or metadata.get('account_type') == 'professionnel':
            if data.get('proTypes'):
                user['pro_types'] = data.get('proTypes')
            if data.get('companyName'):
                user['company_name'] = data.get('companyName')
            if data.get('vatNumber'):
                user['vat_number'] = data.get('vatNumber')
        
        result = workspace_db.users.insert_one(user)
        
        # Generate and send auth code for immediate login
        code = ''.join(random.choices(string.digits, k=6))
        
        workspace_db.auth_codes.insert_one({
            'email': email,
            'code': code,
            'created_at': datetime.utcnow(),
            'expires_at': datetime.utcnow() + timedelta(minutes=10),
            'used': False
        })
        
        # Send welcome email with code
        if app.config['SMTP_USER'] and app.config['SMTP_PASS']:
            try:
                send_auth_code_email(email, code, workspace_code)
            except Exception as email_error:
                print(f"Email error: {email_error}")
        
        print(f"AUTH CODE for {email}: {code}")
        
        return jsonify({
            'message': 'Registration successful',
            'user_id': str(result.inserted_id)
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/auth/verify-code', methods=['POST'])
def verify_code():
    try:
        data = request.get_json()
        email = data.get('email')
        code = data.get('code')
        workspace_code = data.get('workspace')
        
        # Also check for 'site' for backward compatibility
        if not workspace_code:
            workspace_code = data.get('site')
        
        if not email or not code or not workspace_code:
            return jsonify({'error': 'Email, code and workspace required'}), 400
            
        workspace_db = workspace_service.get_workspace_db(workspace_code)
        if workspace_db is None:
            return jsonify({'error': 'Workspace not found'}), 404
        
        # Find valid code
        auth_code = workspace_db.auth_codes.find_one({
            'email': email,
            'code': code,
            'used': False,
            'expires_at': {'$gt': datetime.utcnow()}
        })
        
        if not auth_code:
            return jsonify({'error': 'Invalid or expired code'}), 401
        
        # Mark as used
        workspace_db.auth_codes.update_one(
            {'_id': auth_code['_id']},
            {'$set': {'used': True, 'used_at': datetime.utcnow()}}
        )
        
        # Find or create user in workspace
        user = workspace_db.users.find_one({'email': email})
        if not user:
            # Create new user
            user = {
                'email': email,
                'created_at': datetime.utcnow(),
                'is_active': True,
                'auth_method': 'code'
            }
            result = workspace_db.users.insert_one(user)
            user_id = str(result.inserted_id)
        else:
            user_id = str(user['_id'])
        
        # Create token (include workspace in token)
        access_token = create_access_token(
            identity=user_id,
            additional_claims={
                'workspace': workspace_code,
                'email': email
            }
        )
        
        # Log session
        workspace_db.sessions.insert_one({
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

# User profile update endpoint
@app.route('/users/<user_id>/profile', methods=['PUT'])
@jwt_required()
def update_user_profile(user_id):
    try:
        # Get workspace from JWT
        claims = get_jwt()
        workspace_code = claims.get('workspace')
        
        if not workspace_code:
            return jsonify({'error': 'Workspace not found in token'}), 400
            
        workspace_db = workspace_service.get_workspace_db(workspace_code)
        if workspace_db is None:
            return jsonify({'error': 'Workspace not found'}), 404
        
        # Verify user is updating their own profile
        current_user_id = get_jwt_identity()
        if current_user_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Get update data
        data = request.get_json()
        
        # Prepare update fields
        update_fields = {}
        
        # Add allowed fields to update
        allowed_fields = [
            'account_type', 'pro_types', 'company_name', 'vat_number',
            'first_name', 'last_name', 'phone', 'address', 'city', 
            'postal_code', 'country'
        ]
        
        for field in allowed_fields:
            if field in data:
                update_fields[field] = data[field]
        
        if not update_fields:
            return jsonify({'error': 'No fields to update'}), 400
        
        # Update user
        result = workspace_db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {**update_fields, 'updated_at': datetime.utcnow()}}
        )
        
        if result.modified_count == 0:
            return jsonify({'error': 'User not found or no changes made'}), 404
        
        # Return updated user
        updated_user = workspace_db.users.find_one({'_id': ObjectId(user_id)})
        updated_user['id'] = str(updated_user['_id'])
        del updated_user['_id']
        
        return jsonify(updated_user), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Digital Humans management endpoints
@app.route('/api/workspaces/<workspace_code>/users', methods=['GET'])
def list_workspace_users(workspace_code):
    """List users in a workspace, optionally filtered by type"""
    try:
        workspace_db = workspace_service.get_workspace_db(workspace_code)
        if workspace_db is None:
            return jsonify({'error': 'Workspace not found'}), 404
        
        # Get query parameters
        user_type = request.args.get('type')
        
        # Build query
        query = {}
        if user_type:
            query['type'] = user_type
        
        # Find users
        users = list(workspace_db.users.find(query))
        
        # Convert ObjectId to string
        for user in users:
            user['_id'] = str(user['_id'])
            if 'created_at' in user:
                user['created_at'] = user['created_at'].isoformat()
            if 'updated_at' in user:
                user['updated_at'] = user['updated_at'].isoformat()
        
        return jsonify(users), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/workspaces/<workspace_code>/users', methods=['POST'])
def create_workspace_user(workspace_code):
    """Create a user in a workspace (alternative to /auth/register)"""
    try:
        workspace_db = workspace_service.get_workspace_db(workspace_code)
        if workspace_db is None:
            return jsonify({'error': 'Workspace not found'}), 404
        
        data = request.get_json()
        
        # Check if user already exists
        email = data.get('email')
        if not email:
            return jsonify({'error': 'Email required'}), 400
            
        existing_user = workspace_db.users.find_one({'email': email})
        if existing_user:
            return jsonify({'error': 'User already exists'}), 409
        
        # Create user
        user = {
            'email': email,
            'created_at': datetime.utcnow(),
            'is_active': True,
            **data  # Include all other fields
        }
        
        result = workspace_db.users.insert_one(user)
        user['_id'] = str(result.inserted_id)
        
        # If it's a DH, create memory collection
        if data.get('type') == 'DH':
            collection_name = email.replace('@', '-').replace('.', '-') + '-memory'
            # Collection is created automatically when first document is inserted
            # Initialize with a config document
            workspace_db[collection_name].insert_one({
                'type': 'config',
                'created_at': datetime.utcnow(),
                'dh_email': email
            })
        
        return jsonify(user), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/workspaces/<workspace_code>/users/<user_id>', methods=['DELETE'])
def delete_workspace_user(workspace_code, user_id):
    """Delete a user from a workspace"""
    try:
        workspace_db = workspace_service.get_workspace_db(workspace_code)
        if workspace_db is None:
            return jsonify({'error': 'Workspace not found'}), 404
        
        # Find user first to get email (for DH collection cleanup)
        user = workspace_db.users.find_one({'_id': ObjectId(user_id)})
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Delete user
        result = workspace_db.users.delete_one({'_id': ObjectId(user_id)})
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Failed to delete user'}), 500
        
        # If it's a DH, drop the memory collection
        if user.get('type') == 'DH':
            collection_name = user['email'].replace('@', '-').replace('.', '-') + '-memory'
            workspace_db[collection_name].drop()
        
        return jsonify({'message': 'User deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/workspaces/<workspace_code>/users/<user_id>', methods=['PUT'])  
def update_workspace_user(workspace_code, user_id):
    """Update a user in a workspace"""
    try:
        workspace_db = workspace_service.get_workspace_db(workspace_code)
        if workspace_db is None:
            return jsonify({'error': 'Workspace not found'}), 404
        
        data = request.get_json()
        
        # Remove fields that shouldn't be updated
        data.pop('_id', None)
        data.pop('created_at', None)
        
        # Add updated timestamp
        data['updated_at'] = datetime.utcnow()
        
        # Update user
        result = workspace_db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': data}
        )
        
        if result.modified_count == 0:
            return jsonify({'error': 'User not found or no changes made'}), 404
        
        # Return updated user
        updated_user = workspace_db.users.find_one({'_id': ObjectId(user_id)})
        updated_user['_id'] = str(updated_user['_id'])
        
        return jsonify(updated_user), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Contact management (updated for workspaces)
@app.route('/contacts', methods=['POST'])
def create_contact():
    try:
        data = request.get_json()
        workspace_code = data.get('workspace')
        
        if not workspace_code:
            return jsonify({'error': 'Workspace code required'}), 400
            
        workspace_db = workspace_service.get_workspace_db(workspace_code)
        if workspace_db is None:
            return jsonify({'error': 'Workspace not found'}), 404
        
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
        
        result = workspace_db.contacts.insert_one(contact)
        
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

if __name__ == '__main__':
    print("\n" + "="*50)
    print("QWANYX API v2 - Multi-Workspace Architecture")
    print("="*50)
    print("URL: http://localhost:5002")
    print("MongoDB:", app.config['MONGO_URI'])
    print("="*50 + "\n")
    
    app.run(
        host='0.0.0.0',
        port=5002,
        debug=True
    )