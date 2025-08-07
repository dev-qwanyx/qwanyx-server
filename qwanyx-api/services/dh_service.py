from pymongo import MongoClient
from typing import Dict, List, Optional
from datetime import datetime

class DHService:
    """Service to manage Digital Humans data in workspaces"""
    
    def __init__(self, mongo_client: MongoClient):
        self.client = mongo_client
    
    def get_dh_prefix(self, dh_email: str) -> str:
        """Convert DH email to collection prefix"""
        return f"dh.{dh_email.replace('@', '-').replace('.', '-')}"
    
    def get_dh_collections(self, workspace_db, dh_email: str) -> Dict:
        """Get all collections for a DH in a workspace"""
        prefix = self.get_dh_prefix(dh_email)
        return {
            'memory': workspace_db[f"{prefix}.memory"],
            'conversations': workspace_db[f"{prefix}.conversations"],
            'context': workspace_db[f"{prefix}.context"],
            'tasks': workspace_db[f"{prefix}.tasks"],
            'knowledge': workspace_db[f"{prefix}.knowledge"]
        }
    
    def save_conversation(self, workspace_db, dh_email: str, conversation: Dict):
        """Save a conversation for a DH"""
        collections = self.get_dh_collections(workspace_db, dh_email)
        conversation['timestamp'] = datetime.utcnow()
        return collections['conversations'].insert_one(conversation)
    
    def get_conversations(self, workspace_db, dh_email: str, 
                         contact_email: Optional[str] = None) -> List[Dict]:
        """Get conversations for a DH"""
        collections = self.get_dh_collections(workspace_db, dh_email)
        
        query = {}
        if contact_email:
            query['contact_email'] = contact_email
            
        return list(collections['conversations'].find(query).sort('timestamp', -1))
    
    def update_memory(self, workspace_db, dh_email: str, memory_key: str, memory_value: any):
        """Update DH memory"""
        collections = self.get_dh_collections(workspace_db, dh_email)
        return collections['memory'].update_one(
            {'key': memory_key},
            {
                '$set': {
                    'value': memory_value,
                    'updated_at': datetime.utcnow()
                }
            },
            upsert=True
        )
    
    def add_task(self, workspace_db, dh_email: str, task: Dict):
        """Add a task for a DH"""
        collections = self.get_dh_collections(workspace_db, dh_email)
        task['created_at'] = datetime.utcnow()
        task['status'] = task.get('status', 'pending')
        return collections['tasks'].insert_one(task)
    
    def get_tasks(self, workspace_db, dh_email: str, status: Optional[str] = None) -> List[Dict]:
        """Get tasks for a DH"""
        collections = self.get_dh_collections(workspace_db, dh_email)
        
        query = {}
        if status:
            query['status'] = status
            
        return list(collections['tasks'].find(query).sort('created_at', -1))