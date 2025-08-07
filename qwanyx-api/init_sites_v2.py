from pymongo import MongoClient
from datetime import datetime

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')

# 1. Central database for site registry only
central_db = client['qwanyx_central']
sites_collection = central_db.sites

# Initialize sites
sites = [
    {
        'code': 'autodin',
        'name': 'Autodin',
        'domain': 'autodin.be',
        'description': 'Marketplace de pièces détachées automobiles',
        'is_active': True,
        'created_at': datetime.utcnow(),
        'settings': {
            'theme_color': '#E67E22',
            'allow_registration': True
        }
    },
    {
        'code': 'personal-cash',
        'name': 'Personal CASH',
        'domain': None,  # Local only
        'description': 'Gestion financière personnelle',
        'is_active': True,
        'created_at': datetime.utcnow(),
        'settings': {
            'theme_color': '#2ECC71',
            'allow_registration': False,
            'is_private': True
        }
    }
]

# Clear existing sites
sites_collection.delete_many({})

# Insert sites
result = sites_collection.insert_many(sites)
print(f"Inserted {len(result.inserted_ids)} sites in central registry")

# 2. Create separate database for each site
for site in sites:
    # Convert domain to DB name (replace . with -)
    db_name = site['code'].replace('.', '-')
    site_db = client[db_name]
    
    print(f"\nCreating database '{db_name}' for {site['name']}")
    
    # Create indexes
    site_db.users.create_index('email', unique=True)
    site_db.auth_codes.create_index('expires_at', expireAfterSeconds=0)
    site_db.auth_codes.create_index([('email', 1), ('code', 1)])
    
    # Create a test user for each site
    test_user = {
        'email': f"test@{site['domain'] or 'local.test'}",
        'created_at': datetime.utcnow(),
        'is_active': True,
        'auth_method': 'code'
    }
    site_db.users.insert_one(test_user)
    print(f"  Created test user: {test_user['email']}")
    
    # Show collections
    collections = site_db.list_collection_names()
    print(f"  Collections: {collections}")

print("\n✅ Databases initialized successfully!")
print("\nDatabases created:")
print("- qwanyx_central (site registry)")
print("- autodin (for autodin.be)")
print("- personal-cash (for personal-cash app)")