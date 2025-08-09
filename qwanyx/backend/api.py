"""
QWANYX API Server
Handles memory operations for the dashboard
"""

from flask import Flask, request, jsonify, session
from flask_cors import CORS
import sys
import os

# Make sure we import the correct module
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from db_memories_objectid import (
    create_memory, get_user_dashboard, update_memory, 
    move_memory, soft_delete_memory, get_or_create_user_identity
)

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'qwanyx-secret-2025')
# Allow CORS from frontend
CORS(app, 
     resources={r"/api/*": {"origins": ["http://localhost:8083", "http://localhost:8080", "http://127.0.0.1:8083"]}},
     supports_credentials=True,
     allow_headers=["Content-Type"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# For development, we'll use a test workspace and user
DEFAULT_WORKSPACE = 'qwanyx'
DEFAULT_USER = 'test@qwanyx.com'

@app.route('/api/identity', methods=['GET'])
def get_identity():
    """Get or create user identity"""
    # In production, get from session/auth
    workspace = session.get('workspace', DEFAULT_WORKSPACE)
    user_email = session.get('user_email', DEFAULT_USER)
    
    user_id = get_or_create_user_identity(workspace, user_email)
    
    return jsonify({
        'success': True,
        'data': {
            'id': user_id,
            'email': user_email,
            'workspace': workspace
        }
    })

@app.route('/api/memories', methods=['POST'])
def create_memory_endpoint():
    """Create a new memory (column or card)"""
    data = request.get_json()
    
    # Get workspace and user from session (or defaults for now)
    workspace = session.get('workspace', DEFAULT_WORKSPACE)
    user_email = session.get('user_email', DEFAULT_USER)
    
    try:
        memory = create_memory(
            workspace=workspace,
            user_email=user_email,
            memory_type=data.get('type', 'card'),
            title=data.get('title'),
            parent_id=data.get('p'),  # Parent ID
            icon=data.get('icon'),
            content=data.get('content')
        )
        
        return jsonify({
            'success': True,
            'data': memory
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/dashboard', methods=['GET'])
def get_dashboard():
    """Get user's dashboard with all memories"""
    workspace = session.get('workspace', DEFAULT_WORKSPACE)
    user_email = session.get('user_email', DEFAULT_USER)
    
    try:
        dashboard = get_user_dashboard(workspace, user_email)
        return jsonify({
            'success': True,
            'data': dashboard
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/memories/<memory_id>', methods=['PUT'])
def update_memory_endpoint(memory_id):
    """Update a memory"""
    data = request.get_json()
    workspace = session.get('workspace', DEFAULT_WORKSPACE)
    user_email = session.get('user_email', DEFAULT_USER)
    
    try:
        update_memory(workspace, user_email, memory_id, data)
        return jsonify({
            'success': True
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/memories/<memory_id>/move', methods=['PUT'])
def move_memory_endpoint(memory_id):
    """Move a memory to new parent"""
    data = request.get_json()
    workspace = session.get('workspace', DEFAULT_WORKSPACE)
    user_email = session.get('user_email', DEFAULT_USER)
    
    try:
        move_memory(
            workspace, 
            user_email,
            memory_id,
            data.get('new_parent_id')
        )
        return jsonify({
            'success': True
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/memories/<memory_id>', methods=['DELETE'])
def delete_memory_endpoint(memory_id):
    """Soft delete a memory"""
    workspace = session.get('workspace', DEFAULT_WORKSPACE)
    user_email = session.get('user_email', DEFAULT_USER)
    
    try:
        soft_delete_memory(workspace, user_email, memory_id)
        return jsonify({
            'success': True
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/session', methods=['POST'])
def set_session():
    """Set workspace and user for testing"""
    data = request.get_json()
    session['workspace'] = data.get('workspace', DEFAULT_WORKSPACE)
    session['user_email'] = data.get('user_email', DEFAULT_USER)
    
    return jsonify({
        'success': True,
        'data': {
            'workspace': session['workspace'],
            'user_email': session['user_email']
        }
    })

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'QWANYX API',
        'version': '1.0.0'
    })

if __name__ == '__main__':
    port = int(os.getenv('API_PORT', 5001))
    app.run(
        host='0.0.0.0',
        port=port,
        debug=True
    )