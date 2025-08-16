from pymongo import MongoClient
from datetime import datetime

client = MongoClient('mongodb://localhost:27017/')
db = client['autodin-be']

# Find all codes for phil@pixanima.com
codes = list(db.auth_codes.find({'email': 'phil@pixanima.com'}))
print(f"Total codes for phil@pixanima.com: {len(codes)}")

# Show recent codes
for code in codes[-5:]:  # Last 5 codes
    expired = code['expires_at'] < datetime.utcnow()
    used = code.get('used', False)
    print(f"Code: {code['code']}, Used: {used}, Expired: {expired}, Created: {code['created_at']}")

# Find valid codes
valid_codes = list(db.auth_codes.find({
    'email': 'phil@pixanima.com',
    'used': False,
    'expires_at': {'$gt': datetime.utcnow()}
}))
print(f"\nValid codes available: {len(valid_codes)}")
for code in valid_codes:
    print(f"  - Code: {code['code']}")