# Digital Human Process Management Routes
from flask import Blueprint, request, jsonify
from functools import wraps
import jwt
import os
from datetime import datetime
from bson import ObjectId
import threading
import time

# Create blueprint
dh_process_bp = Blueprint('dh_process', __name__)

# JWT Secret
JWT_SECRET = os.environ.get('JWT_SECRET', 'qwanyx-secret-key-2024')

# In-memory storage for running DH processes (in production, use Redis or database)
running_dhs = {}

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            request.user = data
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid'}), 401
        return f(*args, **kwargs)
    return decorated

class DHProcess:
    """Simple DH process that runs in a thread"""
    def __init__(self, dh_id, dh_email, workspace):
        self.dh_id = dh_id
        self.dh_email = dh_email
        self.workspace = workspace
        self.running = False
        self.thread = None
        self.started_at = None
        
    def start(self):
        """Start the DH process"""
        if self.running:
            return False
        
        self.running = True
        self.started_at = datetime.utcnow()
        self.thread = threading.Thread(target=self._run)
        self.thread.daemon = True
        self.thread.start()
        return True
    
    def stop(self):
        """Stop the DH process"""
        self.running = False
        if self.thread:
            self.thread.join(timeout=2)
        return True
    
    def _run(self):
        """Main process loop - monitors and executes flow"""
        print(f"DH Process started for {self.dh_email}")
        
        while self.running:
            try:
                # In a real implementation:
                # 1. Check for triggers (email, timer, webhook, etc.)
                # 2. Execute flow nodes when triggered
                # 3. Update DH memory
                # 4. Log activities
                
                # For now, just heartbeat
                time.sleep(5)
                if self.running:
                    print(f"DH {self.dh_email} is running... (heartbeat)")
                    
            except Exception as e:
                print(f"Error in DH process {self.dh_email}: {e}")
                
        print(f"DH Process stopped for {self.dh_email}")
    
    def get_status(self):
        """Get process status"""
        return {
            'running': self.running,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'uptime': (datetime.utcnow() - self.started_at).total_seconds() if self.started_at else 0
        }

@dh_process_bp.route('/api/dh/<dh_id>/start', methods=['POST'])
@token_required
def start_dh(dh_id):
    """Start a Digital Human process"""
    try:
        from app_v2 import mongo_client
        workspace = request.user.get('workspace', 'default')
        db = mongo_client[f'qwanyx_{workspace}']
        
        # Get DH to verify it exists
        dh = db.users.find_one({'_id': ObjectId(dh_id), 'type': 'DH'})
        if not dh:
            return jsonify({'error': 'Digital Human not found'}), 404
        
        # Check if already running
        if dh_id in running_dhs and running_dhs[dh_id].running:
            return jsonify({
                'message': 'DH already running',
                'status': running_dhs[dh_id].get_status()
            }), 200
        
        # Create and start process
        process = DHProcess(dh_id, dh['email'], workspace)
        if process.start():
            running_dhs[dh_id] = process
            
            # Update DH status in database
            db.users.update_one(
                {'_id': ObjectId(dh_id)},
                {'$set': {
                    'runtime': {
                        'status': 'running',
                        'started_at': datetime.utcnow(),
                        'pid': threading.get_ident()
                    }
                }}
            )
            
            return jsonify({
                'success': True,
                'message': f'DH {dh["email"]} started successfully',
                'status': process.get_status()
            }), 200
        else:
            return jsonify({'error': 'Failed to start DH process'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dh_process_bp.route('/api/dh/<dh_id>/stop', methods=['POST'])
@token_required
def stop_dh(dh_id):
    """Stop a Digital Human process"""
    try:
        from app_v2 import mongo_client
        workspace = request.user.get('workspace', 'default')
        db = mongo_client[f'qwanyx_{workspace}']
        
        # Get DH to verify it exists
        dh = db.users.find_one({'_id': ObjectId(dh_id), 'type': 'DH'})
        if not dh:
            return jsonify({'error': 'Digital Human not found'}), 404
        
        # Check if running
        if dh_id not in running_dhs or not running_dhs[dh_id].running:
            return jsonify({
                'message': 'DH is not running',
                'status': {'running': False}
            }), 200
        
        # Stop process
        process = running_dhs[dh_id]
        if process.stop():
            # Update DH status in database
            db.users.update_one(
                {'_id': ObjectId(dh_id)},
                {'$set': {
                    'runtime': {
                        'status': 'stopped',
                        'stopped_at': datetime.utcnow()
                    }
                }}
            )
            
            # Remove from running list
            del running_dhs[dh_id]
            
            return jsonify({
                'success': True,
                'message': f'DH {dh["email"]} stopped successfully',
                'status': {'running': False}
            }), 200
        else:
            return jsonify({'error': 'Failed to stop DH process'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dh_process_bp.route('/api/dh/<dh_id>/status', methods=['GET'])
@token_required
def get_dh_status(dh_id):
    """Get Digital Human process status"""
    try:
        from app_v2 import mongo_client
        workspace = request.user.get('workspace', 'default')
        db = mongo_client[f'qwanyx_{workspace}']
        
        # Get DH to verify it exists
        dh = db.users.find_one({'_id': ObjectId(dh_id), 'type': 'DH'})
        if not dh:
            return jsonify({'error': 'Digital Human not found'}), 404
        
        # Check if running
        if dh_id in running_dhs and running_dhs[dh_id].running:
            status = running_dhs[dh_id].get_status()
        else:
            status = {'running': False}
        
        return jsonify({
            'dh_id': dh_id,
            'dh_email': dh['email'],
            'status': status
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dh_process_bp.route('/api/dh/running', methods=['GET'])
@token_required
def get_running_dhs():
    """Get all running Digital Humans"""
    try:
        workspace = request.user.get('workspace', 'default')
        
        running_list = []
        for dh_id, process in running_dhs.items():
            if process.workspace == workspace and process.running:
                running_list.append({
                    'dh_id': dh_id,
                    'dh_email': process.dh_email,
                    'status': process.get_status()
                })
        
        return jsonify({
            'count': len(running_list),
            'running_dhs': running_list
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500