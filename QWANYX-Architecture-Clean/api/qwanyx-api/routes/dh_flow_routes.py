# Digital Human Flow Execution Routes
from flask import Blueprint, request, jsonify, current_app
from functools import wraps
import jwt
import os
from datetime import datetime
from bson import ObjectId
import json
from typing import Dict, List, Optional

# Create blueprint
dh_flow_bp = Blueprint('dh_flow', __name__)

# JWT Secret
JWT_SECRET = os.environ.get('JWT_SECRET', 'qwanyx-secret-key-2024')

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

# Routes for DH Flow Management

@dh_flow_bp.route('/api/dh/<dh_id>/flow', methods=['GET'])
@token_required
def get_dh_flow(dh_id):
    """Get the flow configuration for a Digital Human"""
    try:
        from app_v2 import mongo_client
        workspace = request.user.get('workspace', 'default')
        db = mongo_client[f'qwanyx_{workspace}']
        
        # Get DH to verify it exists
        dh = db.users.find_one({'_id': ObjectId(dh_id), 'type': 'DH'})
        if not dh:
            return jsonify({'error': 'Digital Human not found'}), 404
        
        # Get flow from DH's memory
        dh_service = DHService(mongo_client)
        collections = dh_service.get_dh_collections(db, dh['email'])
        
        # Look for flow configuration in memory
        flow_config = collections['memory'].find_one({'type': 'flow_config'})
        
        if flow_config:
            # Convert ObjectId to string
            flow_config['_id'] = str(flow_config['_id'])
            return jsonify(flow_config), 200
        else:
            # Return empty flow
            return jsonify({
                'dhId': dh_id,
                'nodes': [],
                'edges': [],
                'created': datetime.utcnow().isoformat(),
                'updated': datetime.utcnow().isoformat()
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dh_flow_bp.route('/api/dh/<dh_id>/flow', methods=['POST'])
@token_required
def save_dh_flow(dh_id):
    """Save the flow configuration for a Digital Human"""
    try:
        from app_v2 import mongo_client
        workspace = request.user.get('workspace', 'default')
        db = mongo_client[f'qwanyx_{workspace}']
        
        # Get DH to verify it exists
        dh = db.users.find_one({'_id': ObjectId(dh_id), 'type': 'DH'})
        if not dh:
            return jsonify({'error': 'Digital Human not found'}), 404
        
        # Get flow data
        flow_data = request.json
        
        # Prepare flow document
        flow_doc = {
            'type': 'flow_config',
            'subtype': 'visual_flow',
            'dhId': dh_id,
            'nodes': flow_data.get('nodes', []),
            'edges': flow_data.get('edges', []),
            'updated': datetime.utcnow(),
            'data': {
                'name': flow_data.get('name', 'Main Flow'),
                'description': flow_data.get('description', ''),
                'active': flow_data.get('active', True)
            },
            'tags': ['flow', 'configuration'],
            'metadata': {
                'importance': 1.0,
                'confidence': 1.0
            }
        }
        
        # Save to DH's memory
        dh_service = DHService(mongo_client)
        collections = dh_service.get_dh_collections(db, dh['email'])
        
        # Update or insert
        result = collections['memory'].replace_one(
            {'type': 'flow_config'},
            flow_doc,
            upsert=True
        )
        
        return jsonify({
            'success': True,
            'message': 'Flow saved successfully',
            'modified': result.modified_count,
            'upserted': str(result.upserted_id) if result.upserted_id else None
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dh_flow_bp.route('/api/dh/<dh_id>/flow/execute', methods=['POST'])
@token_required
def execute_dh_flow(dh_id):
    """Execute a flow for a Digital Human"""
    try:
        from app_v2 import mongo_client
        workspace = request.user.get('workspace', 'default')
        db = mongo_client[f'qwanyx_{workspace}']
        
        # Get DH
        dh = db.users.find_one({'_id': ObjectId(dh_id), 'type': 'DH'})
        if not dh:
            return jsonify({'error': 'Digital Human not found'}), 404
        
        # Get trigger data
        trigger_data = request.json
        trigger_id = trigger_data.get('triggerId')
        trigger_type = trigger_data.get('triggerType', 'manual')
        
        # Get flow configuration
        dh_service = DHService(mongo_client)
        collections = dh_service.get_dh_collections(db, dh['email'])
        flow_config = collections['memory'].find_one({'type': 'flow_config'})
        
        if not flow_config:
            return jsonify({'error': 'No flow configured for this DH'}), 400
        
        # Create execution record
        execution = {
            'dhId': dh_id,
            'dhEmail': dh['email'],
            'workspace': workspace,
            'triggerId': trigger_id,
            'triggerType': trigger_type,
            'startTime': datetime.utcnow(),
            'status': 'running',
            'nodes': flow_config.get('nodes', []),
            'edges': flow_config.get('edges', []),
            'results': [],
            'logs': []
        }
        
        # Insert execution record
        execution_result = collections['memory'].insert_one({
            'type': 'execution',
            'subtype': 'flow_execution',
            'timestamp': datetime.utcnow(),
            'data': execution,
            'tags': ['execution', trigger_type],
            'metadata': {
                'importance': 0.8
            }
        })
        
        execution_id = str(execution_result.inserted_id)
        
        # Note: In a real implementation, this would trigger async execution
        # For now, we'll simulate immediate completion
        
        # Update execution status
        collections['memory'].update_one(
            {'_id': execution_result.inserted_id},
            {
                '$set': {
                    'data.status': 'completed',
                    'data.endTime': datetime.utcnow(),
                    'data.results': [
                        {
                            'nodeId': trigger_id,
                            'success': True,
                            'output': {'message': 'Simulated execution'}
                        }
                    ]
                }
            }
        )
        
        return jsonify({
            'executionId': execution_id,
            'status': 'started',
            'message': 'Flow execution started'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dh_flow_bp.route('/api/dh/<dh_id>/flow/execution/<execution_id>', methods=['GET'])
@token_required
def get_execution_status(dh_id, execution_id):
    """Get the status of a flow execution"""
    try:
        from app_v2 import mongo_client
        workspace = request.user.get('workspace', 'default')
        db = mongo_client[f'qwanyx_{workspace}']
        
        # Get DH
        dh = db.users.find_one({'_id': ObjectId(dh_id), 'type': 'DH'})
        if not dh:
            return jsonify({'error': 'Digital Human not found'}), 404
        
        # Get execution record
        dh_service = DHService(mongo_client)
        collections = dh_service.get_dh_collections(db, dh['email'])
        
        execution = collections['memory'].find_one({
            '_id': ObjectId(execution_id),
            'type': 'execution'
        })
        
        if not execution:
            return jsonify({'error': 'Execution not found'}), 404
        
        # Convert ObjectId to string
        execution['_id'] = str(execution['_id'])
        
        return jsonify({
            'executionId': execution['_id'],
            'status': execution['data']['status'],
            'startTime': execution['data']['startTime'].isoformat(),
            'endTime': execution['data'].get('endTime', {}).isoformat() if execution['data'].get('endTime') else None,
            'results': execution['data'].get('results', []),
            'logs': execution['data'].get('logs', [])
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dh_flow_bp.route('/api/dh/<dh_id>/flow/nodes', methods=['GET'])
@token_required
def get_available_nodes(dh_id):
    """Get available node types for building flows"""
    try:
        # Return the node types that are available
        node_types = [
            {
                'type': 'email-trigger',
                'category': 'trigger',
                'name': 'Email Trigger',
                'description': 'Listens for incoming emails',
                'icon': '📧',
                'color': '#FF6B6B',
                'defaultData': {
                    'checkInterval': 60,
                    'folder': 'INBOX',
                    'markAsRead': False
                }
            },
            {
                'type': 'analyze',
                'category': 'ai',
                'name': 'Analyze',
                'description': 'Analyzes content for sentiment and intent',
                'icon': '🔍',
                'color': '#4ECDC4',
                'defaultData': {
                    'analysisType': 'all',
                    'useAI': True
                }
            },
            {
                'type': 'response',
                'category': 'action',
                'name': 'Response',
                'description': 'Generates and sends responses',
                'icon': '💬',
                'color': '#95E77E',
                'defaultData': {
                    'responseType': 'email',
                    'useAI': True,
                    'tone': 'professional'
                }
            },
            {
                'type': 'memory-store',
                'category': 'memory',
                'name': 'Store Memory',
                'description': 'Stores information in DH memory',
                'icon': '💾',
                'color': '#FFE66D',
                'defaultData': {
                    'memoryType': 'knowledge'
                }
            },
            {
                'type': 'memory-retrieve',
                'category': 'memory',
                'name': 'Retrieve Memory',
                'description': 'Retrieves information from DH memory',
                'icon': '🔍',
                'color': '#FFE66D',
                'defaultData': {
                    'searchType': 'keyword'
                }
            },
            {
                'type': 'condition',
                'category': 'logic',
                'name': 'Condition',
                'description': 'Routes flow based on conditions',
                'icon': '🔀',
                'color': '#B4A7D6',
                'defaultData': {
                    'conditions': []
                }
            }
        ]
        
        return jsonify(node_types), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Import DH service
from services.dh_service import DHService