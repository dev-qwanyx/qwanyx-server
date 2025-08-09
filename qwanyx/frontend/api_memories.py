"""
API endpoints for memory management
"""

from flask import Blueprint, request, jsonify
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))
from db_memories import create_memory, get_user_dashboard, update_memory_access, move_memory, soft_delete_memory

memories_bp = Blueprint('memories', __name__)

@memories_bp.route('/api/memories/column', methods=['POST'])
def create_column():
    """Create a new column"""
    data = request.get_json()
    
    # For now, use a test user_id - will be from session later
    user_id = data.get('user_id', 'test-user')
    
    column = create_memory(
        memory_type='column',
        title=data.get('title', 'New Column'),
        parent_uuid=data.get('parent'),
        icon=data.get('icon')
    )
    
    return jsonify(column), 201

@memories_bp.route('/api/memories/card', methods=['POST'])
def create_card():
    """Create a new card in a column"""
    data = request.get_json()
    
    card = create_memory(
        memory_type='card',
        title=data.get('title', 'New Card'),
        parent_uuid=data.get('column_uuid'),
        icon=data.get('icon'),
        content=data.get('content', {})
    )
    
    return jsonify(card), 201

@memories_bp.route('/api/memories/dashboard/<user_id>', methods=['GET'])
def get_dashboard(user_id):
    """Get all columns and cards for a user"""
    dashboard = get_user_dashboard(user_id)
    return jsonify(dashboard)

@memories_bp.route('/api/memories/move', methods=['PUT'])
def move():
    """Move a memory to new parent"""
    data = request.get_json()
    move_memory(
        data.get('memory_uuid'),
        data.get('new_parent_uuid')
    )
    return jsonify({'status': 'moved'}), 200

@memories_bp.route('/api/memories/<memory_uuid>', methods=['DELETE'])
def delete(memory_uuid):
    """Delete a memory"""
    soft_delete_memory(memory_uuid)
    return jsonify({'status': 'deleted'}), 200