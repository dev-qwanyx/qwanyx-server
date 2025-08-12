#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pour vérifier les bases de données MongoDB et leur contenu
"""

from pymongo import MongoClient
from datetime import datetime
import sys
import io

# Force UTF-8 output
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Connexion MongoDB
client = MongoClient('mongodb://localhost:27017/')

print("=" * 60)
print("VÉRIFICATION DES BASES DE DONNÉES QWANYX")
print("=" * 60)
print(f"\nDate: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print("\n📊 BASES DE DONNÉES DISPONIBLES:")
print("-" * 40)

# Lister toutes les bases
all_dbs = client.list_database_names()
for db_name in sorted(all_dbs):
    if db_name not in ['admin', 'config', 'local']:  # Ignorer les bases système
        db = client[db_name]
        collections = db.list_collection_names()
        
        # Compter les utilisateurs si la collection existe
        user_count = 0
        if 'users' in collections:
            user_count = db.users.count_documents({})
        
        print(f"\n🗄️  {db_name}")
        print(f"   Collections: {', '.join(collections) if collections else 'Aucune'}")
        if user_count > 0:
            print(f"   Utilisateurs: {user_count}")
            
            # Afficher les derniers utilisateurs
            last_users = list(db.users.find({}, {'email': 1, 'created_at': 1}).sort('created_at', -1).limit(3))
            if last_users:
                print("   Derniers inscrits:")
                for user in last_users:
                    email = user.get('email', 'N/A')
                    created = user.get('created_at', 'N/A')
                    if created != 'N/A':
                        created = created.strftime('%Y-%m-%d %H:%M')
                    print(f"     - {email} ({created})")

print("\n" + "=" * 60)
print("RÉSUMÉ:")
print("-" * 40)

# Identifier les bases actives
active_workspaces = {
    'autodin': 'Base pour Autodin.be',
    'belgicomics': 'Base pour Belgicomics.be',
    'qwanyx_central': 'Base centrale (gestion des sites)',
    'autodin-be': '⚠️  Ancienne base (legacy)',
    'personalcash': 'Base pour Personal Cash'
}

for db_name, description in active_workspaces.items():
    if db_name in all_dbs:
        db = client[db_name]
        user_count = 0
        if 'users' in db.list_collection_names():
            user_count = db.users.count_documents({})
        status = "✅ ACTIVE" if user_count > 0 else "📭 VIDE"
        print(f"{status} {db_name}: {description}")

print("\n💡 NOTES:")
print("  - Les sites utilisent le paramètre 'workspace' pour identifier la base")
print("  - Autodin → workspace: 'autodin'")
print("  - Belgicomics → workspace: 'belgicomics'")
print("  - L'API route automatiquement vers la bonne base")
print("=" * 60)