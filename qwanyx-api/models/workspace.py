from datetime import datetime
from typing import List, Dict, Optional

class Workspace:
    """Workspace (Organisation/Domaine) model"""
    
    def __init__(self, code: str, domain: str, name: str):
        self.code = code  # 'autodin-be'
        self.domain = domain  # 'autodin.be'
        self.name = name  # 'Autodin Belgique'
        self.apps: List[str] = []  # ['autodin', 'personalcash']
        self.dh_members: List[str] = []  # ['philippe@qwanyx.com']
        self.settings: Dict = {}
        self.created_at = datetime.utcnow()
        self.is_active = True
    
    @property
    def db_name(self) -> str:
        """Get database name for this workspace"""
        return self.code.replace('.', '-')
    
    def add_app(self, app_code: str):
        """Add an app to this workspace"""
        if app_code not in self.apps:
            self.apps.append(app_code)
    
    def add_dh(self, dh_email: str):
        """Add a DH member to this workspace"""
        if dh_email not in self.dh_members:
            self.dh_members.append(dh_email)
    
    def to_dict(self) -> Dict:
        """Convert to dictionary for MongoDB"""
        return {
            'code': self.code,
            'domain': self.domain,
            'name': self.name,
            'apps': self.apps,
            'dh_members': self.dh_members,
            'settings': self.settings,
            'created_at': self.created_at,
            'is_active': self.is_active,
            'db_name': self.db_name
        }