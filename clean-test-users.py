from pymongo import MongoClient

# Connexion à MongoDB
client = MongoClient('mongodb://localhost:27017/')

# Base autodin-be
db = client['autodin-be']

# Supprimer l'utilisateur test@example.com
result = db.users.delete_one({'email': 'test@example.com'})
if result.deleted_count > 0:
    print(f"Supprimé : test@example.com")

# Afficher les utilisateurs restants
print("\n=== Utilisateurs restants dans autodin-be ===")
for user in db.users.find():
    print(f"- {user.get('email')} ({user.get('account_type', 'non défini')})")

print(f"\nTotal: {db.users.count_documents({})}")