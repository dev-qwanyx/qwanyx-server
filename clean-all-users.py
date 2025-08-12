from pymongo import MongoClient

# Connexion à MongoDB
client = MongoClient('mongodb://localhost:27017/')

# Base autodin-be
db = client['autodin-be']

# Compter avant suppression
count_before = db.users.count_documents({})
print(f"Nombre d'utilisateurs avant suppression : {count_before}")

# Supprimer TOUS les utilisateurs
result = db.users.delete_many({})
print(f"Supprimé {result.deleted_count} utilisateurs")

# Vérifier qu'il n'y a plus d'utilisateurs
count_after = db.users.count_documents({})
print(f"Nombre d'utilisateurs après suppression : {count_after}")

# Nettoyer aussi les codes d'authentification
codes_result = db.auth_codes.delete_many({})
print(f"Supprimé {codes_result.deleted_count} codes d'authentification")

print("\n✅ Base de données autodin-be nettoyée !")