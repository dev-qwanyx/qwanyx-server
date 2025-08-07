from pymongo import MongoClient
from typing import Dict, List, Optional
from datetime import datetime

class AppService:
    """Service to manage apps in workspaces"""
    
    def __init__(self, mongo_client: MongoClient):
        self.client = mongo_client
        self.central_db = self.client['qwanyx_central']
        self.apps_registry = self.central_db.apps_registry
    
    def register_app(self, app_code: str, app_info: Dict):
        """Register an app in the central registry"""
        app_data = {
            'code': app_code,
            'name': app_info.get('name'),
            'description': app_info.get('description'),
            'version': app_info.get('version', '1.0.0'),
            'collections': app_info.get('collections', []),
            'created_at': datetime.utcnow(),
            'is_active': True
        }
        
        return self.apps_registry.update_one(
            {'code': app_code},
            {'$set': app_data},
            upsert=True
        )
    
    def get_app(self, app_code: str) -> Optional[Dict]:
        """Get app info from registry"""
        return self.apps_registry.find_one({'code': app_code})
    
    def list_apps(self) -> List[Dict]:
        """List all available apps"""
        return list(self.apps_registry.find({'is_active': True}))
    
    def get_app_collections(self, workspace_db, app_code: str) -> Dict:
        """Get collections for an app in a workspace"""
        app = self.get_app(app_code)
        if not app:
            return {}
        
        collections = {}
        for collection_name in app.get('collections', []):
            full_name = f"{app_code}.{collection_name}"
            collections[collection_name] = workspace_db[full_name]
        
        return collections
    
    def initialize_app_in_workspace(self, workspace_db, app_code: str):
        """Initialize app collections and indexes in a workspace"""
        app = self.get_app(app_code)
        if not app:
            return False
        
        # App-specific initialization
        if app_code == 'autodin':
            workspace_db['autodin.users'].create_index('email', unique=True)
            workspace_db['autodin.products'].create_index([('title', 'text'), ('description', 'text')])
            workspace_db['autodin.products'].create_index('created_at')
            
        elif app_code == 'personalcash':
            workspace_db['personalcash.accounts'].create_index('name', unique=True)
            workspace_db['personalcash.transactions'].create_index('date')
            workspace_db['personalcash.transactions'].create_index('account_id')
        
        return True