"""
Memory persistence for QWANYX dashboard
Handles columns and cards (all are memories)
"""

from pymongo import MongoClient
from datetime import datetime
import uuid
import os

# MongoDB connection
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URI)

def get_user_database(workspace, user_email):
    """Get database for a specific workspace and user"""
    # Database name: workspace.users.email
    db_name = f"{workspace}.users.{user_email}"
    db = client[db_name]
    
    return {
        'memories': db['memories'],
        'edges': db['edges'],
        'profile': db['qwanyx.profile'],
        'preferences': db['qwanyx.preferences'],
        'firmware': db['qwanyx.firmware'],
        'connections': db['qwanyx.connections'],
        'lineage': db['qwanyx.lineage']
    }

def create_memory(workspace, user_email, memory_type, title, parent_uuid=None, icon=None, content=None):
    """Create a new memory (column or card)"""
    db = get_user_database(workspace, user_email)
    memories = db['memories']
    
    memory = {
        'uuid': str(uuid.uuid4()),
        'p': parent_uuid,  # Parent UUID
        'type': memory_type,  # 'column' or 'card'
        'title': title,
        'brief': '',
        'icon': icon,
        'content': content or {},
        'workspace': workspace,
        'user_id': user_id,
        'created': datetime.utcnow(),
        'lastAccess': datetime.utcnow(),
        'deleted': False,  # Soft delete flag
        'deletedAt': None  # When it was deleted
    }
    
    memories.insert_one(memory)
    return memory

def get_user_dashboard(workspace, user_id):
    """Get all columns and cards for a user's dashboard"""
    collections = get_collections(workspace, user_id)
    memories = collections['memories']
    
    # Get root columns (no parent) - exclude deleted
    columns = list(memories.find({
        'type': 'column',
        'p': None,  # Root level columns
        'deleted': False  # Only active items
    }))
    
    # Get all cards - exclude deleted
    for column in columns:
        column['cards'] = list(memories.find({
            'type': 'card',
            'p': column['uuid'],
            'deleted': False  # Only active items
        }))
    
    return columns

def update_memory_access(memory_uuid):
    """Update lastAccess when memory is viewed/modified"""
    memories.update_one(
        {'uuid': memory_uuid},
        {'$set': {'lastAccess': datetime.utcnow()}}
    )

def move_memory(memory_uuid, new_parent_uuid):
    """Move a memory to a new parent (column or position)"""
    memories.update_one(
        {'uuid': memory_uuid},
        {'$set': {
            'p': new_parent_uuid,
            'lastAccess': datetime.utcnow()
        }}
    )

def create_edge(from_uuid, to_uuid, edge_type='link'):
    """Create an edge (link) between two memories"""
    edge = {
        'uuid': str(uuid.uuid4()),
        'from': from_uuid,
        'to': to_uuid,
        'type': edge_type,
        'created': datetime.utcnow(),
        'deleted': False
    }
    edges.insert_one(edge)
    return edge

def soft_delete_memory(memory_uuid):
    """Soft delete a memory and all its children (move to trash)"""
    # Find all children recursively
    def get_descendants(parent_uuid):
        children = list(memories.find({'p': parent_uuid, 'deleted': False}))
        descendants = []
        for child in children:
            descendants.append(child['uuid'])
            descendants.extend(get_descendants(child['uuid']))
        return descendants
    
    # Soft delete the memory and all descendants
    to_delete = [memory_uuid] + get_descendants(memory_uuid)
    
    # Mark memories as deleted
    memories.update_many(
        {'uuid': {'$in': to_delete}},
        {'$set': {
            'deleted': True,
            'deletedAt': datetime.utcnow()
        }}
    )
    
    # Mark all edges involving these memories as deleted
    edges.update_many(
        {'$or': [
            {'from': {'$in': to_delete}},
            {'to': {'$in': to_delete}}
        ]},
        {'$set': {
            'deleted': True,
            'deletedAt': datetime.utcnow()
        }}
    )

def restore_memory(memory_uuid):
    """Restore a memory from trash"""
    memories.update_one(
        {'uuid': memory_uuid},
        {'$set': {
            'deleted': False,
            'deletedAt': None,
            'lastAccess': datetime.utcnow()
        }}
    )

def get_trash(user_id):
    """Get all deleted items for a user"""
    return list(memories.find({
        'owner': user_id,
        'deleted': True
    }).sort('deletedAt', -1))

def permanent_delete_memory(memory_uuid):
    """Permanently delete a memory and all its children"""
    # Find all children recursively (including deleted ones)
    def get_descendants(parent_uuid):
        children = list(memories.find({'p': parent_uuid}))
        descendants = []
        for child in children:
            descendants.append(child['uuid'])
            descendants.extend(get_descendants(child['uuid']))
        return descendants
    
    # Permanently delete the memory and all descendants
    to_delete = [memory_uuid] + get_descendants(memory_uuid)
    
    # Delete memories
    memories.delete_many({'uuid': {'$in': to_delete}})
    
    # Delete all edges involving these memories
    edges.delete_many({
        '$or': [
            {'from': {'$in': to_delete}},
            {'to': {'$in': to_delete}}
        ]
    })