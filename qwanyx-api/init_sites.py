from pymongo import MongoClient
from datetime import datetime

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['qwanyx_central']

# Initialize sites
sites = [
    {
        'code': 'autodin',
        'name': 'Autodin',
        'domain': 'autodin.com',
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
db.sites.delete_many({})

# Insert sites
result = db.sites.insert_many(sites)
print(f"Inserted {len(result.inserted_ids)} sites")

# Create indexes
db.auth_codes.create_index('expires_at', expireAfterSeconds=0)
db.auth_codes.create_index([('email', 1), ('code', 1)])

print("Sites initialized successfully!")