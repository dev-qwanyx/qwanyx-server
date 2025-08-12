from pymongo import MongoClient
from pprint import pprint

# Connexion à MongoDB
client = MongoClient('mongodb://localhost:27017/')

# Vérifier la base autodin-be
db = client['autodin-be']

print("=== Utilisateurs dans autodin-be ===")
users = db.users.find().limit(5)
for user in users:
    print(f"\nEmail: {user.get('email')}")
    print(f"Type de compte: {user.get('account_type', 'Non défini')}")
    if user.get('account_type') == 'professionnel':
        print(f"  Entreprise: {user.get('company_name', 'Non défini')}")
        print(f"  TVA: {user.get('vat_number', 'Non défini')}")
        print(f"  Types d'activité: {user.get('pro_types', [])}")
    print("-" * 40)

# Compter les utilisateurs
total = db.users.count_documents({})
pros = db.users.count_documents({'account_type': 'professionnel'})
print(f"\nTotal utilisateurs: {total}")
print(f"Professionnels: {pros}")