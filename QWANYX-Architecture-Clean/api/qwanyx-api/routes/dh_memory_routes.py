# Digital Human Memory Management Routes
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import os

# Create blueprint
dh_memory_bp = Blueprint('dh_memory', __name__)

# MongoDB connection
MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URI)

def get_collection_name(dh_email):
    """Convert DH email to MongoDB-friendly collection name"""
    # stephen@qwanyx.com -> stephen-qwanyx-com
    return dh_email.replace('@', '-').replace('.', '-')

@dh_memory_bp.route('/api/dh/push', methods=['POST'])
@jwt_required()
def push_memory():
    """Push (save) flow to DH memory"""
    try:
        # Get data from request
        data = request.get_json()
        
        # Get workspace from JWT, headers, or default to autodin
        claims = get_jwt()
        workspace_from_jwt = claims.get('workspace')
        workspace_from_header = request.headers.get('X-Workspace')
        
        # Priority: header > jwt > 'autodin' (default)
        workspace = workspace_from_header or workspace_from_jwt or 'autodin'
        
        print(f"[DH PUSH] JWT workspace: {workspace_from_jwt}")
        print(f"[DH PUSH] Header workspace: {workspace_from_header}")
        print(f"[DH PUSH] Final workspace: {workspace}")
        
        # Required fields
        dh_email = data.get('dh_email')
        dh_id = data.get('dh_id')  # The DH's ID or node ID (as string)
        flow_title = data.get('flow_title', 'root')  # Title of the flow (default 'root')
        nodes = data.get('nodes', [])
        edges = data.get('edges', [])
        
        if not dh_email:
            return jsonify({'error': 'DH email is required'}), 400
        
        if not dh_id:
            return jsonify({'error': 'DH ID is required'}), 400
        
        # Get database and collection
        db = client[workspace]
        collection_name = get_collection_name(dh_email)
        
        # Convert string ID to ObjectId if it's a valid ObjectId string
        try:
            # Try to convert to ObjectId if it looks like one (24 hex chars)
            if len(dh_id) == 24 and all(c in '0123456789abcdef' for c in dh_id.lower()):
                flow_id = ObjectId(dh_id)
                print(f"[DH PUSH] Using ObjectId: {flow_id}")
            else:
                # Otherwise use as string (for DH emails or other IDs)
                flow_id = dh_id
                print(f"[DH PUSH] Using string ID: {flow_id}")
        except:
            flow_id = dh_id
            print(f"[DH PUSH] Using string ID (fallback): {flow_id}")
        
        print(f"[DH PUSH] Database: {workspace}, Collection: {collection_name}")
        collection = db[collection_name]
        
        # Check if document exists to preserve created_at
        existing_doc = collection.find_one({'_id': flow_id})
        
        # Prepare flow document with node structure
        flow_doc = {
            '_id': flow_id,  # ObjectId or string
            'data': {
                'label': flow_title,  # The flow's title (e.g., 'root')
                'type': 'flow'
            },
            'nodes': nodes,  # Child nodes with their ObjectIds
            'edges': edges,  # Edges referencing node ObjectIds
            'updated_at': datetime.utcnow().isoformat()
        }
        
        # Preserve created_at if document exists, otherwise add it
        if existing_doc:
            flow_doc['created_at'] = existing_doc.get('created_at', datetime.utcnow().isoformat())
        else:
            flow_doc['created_at'] = datetime.utcnow().isoformat()
        
        # Update or insert the flow
        result = collection.replace_one(
            {'_id': flow_id},
            flow_doc,
            upsert=True
        )
        
        # List all collections to debug
        print(f"[DH PUSH] Collections in {workspace}: {db.list_collection_names()}")
        
        return jsonify({
            'success': True,
            'message': f'Flow saved successfully for DH {dh_id}',
            'modified': result.modified_count,
            'upserted': str(result.upserted_id) if result.upserted_id else None
        }), 200
        
    except Exception as e:
        print(f"Error pushing memory: {str(e)}")
        return jsonify({'error': str(e)}), 500

@dh_memory_bp.route('/api/dh/pull', methods=['POST'])
@jwt_required()
def pull_memory():
    """Pull (load) flow from DH memory"""
    try:
        # Get data from request
        data = request.get_json()
        
        # Get workspace from JWT, headers, or default to autodin
        claims = get_jwt()
        workspace_from_jwt = claims.get('workspace')
        workspace_from_header = request.headers.get('X-Workspace')
        
        # Priority: header > jwt > 'autodin' (default)
        workspace = workspace_from_header or workspace_from_jwt or 'autodin'
        
        print(f"[DH PULL] JWT workspace: {workspace_from_jwt}")
        print(f"[DH PULL] Header workspace: {workspace_from_header}")
        print(f"[DH PULL] Final workspace: {workspace}")
        
        # Required fields
        dh_email = data.get('dh_email')
        dh_id = data.get('dh_id')  # The DH's ID or node ID
        
        if not dh_email:
            return jsonify({'error': 'DH email is required'}), 400
        
        if not dh_id:
            return jsonify({'error': 'DH ID is required'}), 400
        
        # Convert string ID to ObjectId if needed
        try:
            if len(dh_id) == 24 and all(c in '0123456789abcdef' for c in dh_id.lower()):
                flow_id = ObjectId(dh_id)
                print(f"[DH PULL] Using ObjectId: {flow_id}")
            else:
                flow_id = dh_id
                print(f"[DH PULL] Using string ID: {flow_id}")
        except:
            flow_id = dh_id
            print(f"[DH PULL] Using string ID (fallback): {flow_id}")
        
        # Get database and collection
        db = client[workspace]
        collection_name = get_collection_name(dh_email)
        collection = db[collection_name]
        
        # Find the flow document by ID
        flow_doc = collection.find_one({'_id': flow_id})
        
        if not flow_doc:
            # If document doesn't exist, return empty flow with root title
            return jsonify({
                'dh_id': dh_id,
                'title': 'root',
                'nodes': [],
                'edges': [],
                'exists': False
            }), 200
        
        # Return the flow data (handle both old and new structure)
        # Get title from data.label (new) or title (old)
        title = flow_doc.get('data', {}).get('label') if 'data' in flow_doc else flow_doc.get('title', 'root')
        
        # Convert ObjectId to string for JSON serialization
        flow_id_str = str(flow_doc.get('_id'))
        
        return jsonify({
            'dh_id': flow_id_str,
            'title': title,
            'nodes': flow_doc.get('nodes', []),
            'edges': flow_doc.get('edges', []),
            'exists': True,
            'updated_at': flow_doc.get('updated_at'),
            'created_at': flow_doc.get('created_at')
        }), 200
        
    except Exception as e:
        print(f"Error pulling memory: {str(e)}")
        return jsonify({'error': str(e)}), 500