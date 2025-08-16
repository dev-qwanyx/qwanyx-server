from pymongo import MongoClient
from typing import Optional, List, Dict
from models.workspace import Workspace

class WorkspaceService:
    """Service to manage workspaces and their databases"""
    
    def __init__(self, mongo_client: MongoClient):
        self.client = mongo_client
        self.central_db = self.client['qwanyx_central']
        self.workspaces_collection = self.central_db.workspaces
    
    def create_workspace(self, code: str, domain: str, name: str) -> Workspace:
        """Create a new workspace with its database"""
        workspace = Workspace(code, domain, name)
        
        # Save to central registry
        self.workspaces_collection.insert_one(workspace.to_dict())
        
        # Create workspace database
        workspace_db = self.client[workspace.db_name]
        
        # Create indexes
        workspace_db.users.create_index('email', unique=True)
        workspace_db.auth_codes.create_index('expires_at', expireAfterSeconds=0)
        
        return workspace
    
    def get_workspace(self, code: str) -> Optional[Dict]:
        """Get workspace by code - SIMPLIFIÉ: le workspace existe toujours"""
        # Plus besoin de chercher dans qwanyx_central
        # Le workspace code EST le nom de la base
        if code:
            return {
                'code': code,
                'db_name': code,  # Le nom de la base = le code du workspace
                'is_active': True
            }
        return None
    
    def get_workspace_db(self, workspace_code: str):
        """Get MongoDB database for a workspace - DIRECT"""
        # Utilise directement le workspace_code comme nom de base
        if workspace_code:
            return self.client[workspace_code]
        return None
    
    def list_workspaces(self) -> List[Dict]:
        """List all workspaces"""
        return list(self.workspaces_collection.find({'is_active': True}))
    
    def add_dh_to_workspace(self, workspace_code: str, dh_email: str):
        """Add a DH member to workspace"""
        self.workspaces_collection.update_one(
            {'code': workspace_code},
            {'$addToSet': {'dh_members': dh_email}}
        )
        
        # Create DH collections in workspace DB
        workspace_db = self.get_workspace_db(workspace_code)
        if workspace_db is not None:
            dh_prefix = f"dh.{dh_email.replace('@', '-').replace('.', '-')}"
            # Collections will be created on first use
            return True
        return False
    
    def add_app_to_workspace(self, workspace_code: str, app_code: str):
        """Install an app in workspace"""
        self.workspaces_collection.update_one(
            {'code': workspace_code},
            {'$addToSet': {'apps': app_code}}
        )
        
        # App collections will be created by the app itself
        return True