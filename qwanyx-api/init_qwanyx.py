from pymongo import MongoClient
from datetime import datetime
from services import WorkspaceService, AppService

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')

# Initialize services
workspace_service = WorkspaceService(client)
app_service = AppService(client)

print("Initializing QWANYX Architecture...")

# 1. Register Apps in central registry
print("\n1. Registering apps...")

apps = [
    {
        'code': 'autodin',
        'name': 'Autodin Marketplace',
        'description': 'Marketplace de pièces détachées automobiles',
        'collections': ['users', 'products', 'orders', 'messages']
    },
    {
        'code': 'personalcash',
        'name': 'Personal CASH',
        'description': 'Gestion financière personnelle',
        'collections': ['accounts', 'transactions', 'categories', 'budgets']
    }
]

for app in apps:
    app_service.register_app(app['code'], app)
    print(f"  Registered: {app['name']}")

# 2. Create Workspaces
print("\n2. Creating workspaces...")

workspaces = [
    {
        'code': 'autodin-be',
        'domain': 'autodin.be',
        'name': 'Autodin Belgique'
    },
    {
        'code': 'philippe-qwanyx-com',
        'domain': None,
        'name': 'Philippe DH Personnel'
    }
]

for ws in workspaces:
    workspace = workspace_service.create_workspace(ws['code'], ws['domain'], ws['name'])
    print(f"  Created workspace: {ws['name']} (DB: {workspace.db_name})")

# 3. Install apps in workspaces
print("\n3. Installing apps in workspaces...")

# Autodin workspace gets autodin app
workspace_service.add_app_to_workspace('autodin-be', 'autodin')
workspace_db = workspace_service.get_workspace_db('autodin-be')
app_service.initialize_app_in_workspace(workspace_db, 'autodin')
print("  Installed Autodin in autodin-be")

# Philippe's personal workspace gets personalcash
workspace_service.add_app_to_workspace('philippe-qwanyx-com', 'personalcash')
workspace_db = workspace_service.get_workspace_db('philippe-qwanyx-com')
app_service.initialize_app_in_workspace(workspace_db, 'personalcash')
print("  Installed Personal CASH in philippe-qwanyx-com")

# 4. Add DH members
print("\n4. Adding DH members...")

# Philippe works for Autodin
workspace_service.add_dh_to_workspace('autodin-be', 'philippe@qwanyx.com')
print("  Added philippe@qwanyx.com to autodin-be")

# Stephen works for Autodin
workspace_service.add_dh_to_workspace('autodin-be', 'stephen@qwanyx.com')
print("  Added stephen@qwanyx.com to autodin-be")

print("\n✅ QWANYX Architecture initialized successfully!")
print("\nWorkspaces created:")
print("- autodin-be (Autodin Belgique)")
print("- philippe-qwanyx-com (Philippe's personal workspace)")
print("\nApps registered:")
print("- autodin (Marketplace)")
print("- personalcash (Finance)")
print("\nDH members:")
print("- philippe@qwanyx.com → autodin-be")
print("- stephen@qwanyx.com → autodin-be")