# QWANYX - Décisions Architecturales

*Document créé le 07/08/2025 - Session avec Claude*

## Vision Centrale : Digital Human First

### La particularité QWANYX
**Tout passe par un Digital Human (DH) personnel** - Pas d'interfaces classiques, le DH est l'interface universelle.

```
QWANYX = Digital Human First
├── Pas d'interfaces traditionnelles (formulaires, boutons)
├── Interaction 100% conversationnelle
├── Le DH est votre assistant personnel permanent
└── Chaque service est accessible via le DH
```

## Architecture Multi-Tenant Hiérarchique

### Trois niveaux d'abstraction

```
┌─────────────────────────────────────────┐
│      NIVEAU 3: INSTANCE CLIENT          │
│  "Boulangerie Michel"  "Autodin.be"     │
│  └─ Config custom, catégories propres   │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│    NIVEAU 2: TEMPLATE MÉTIER            │
│  Boulangerie    Pharmacie    Garage     │
│  └─ Modèles standards du métier         │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│    NIVEAU 1: CORE QWANYX                │
│  Auth, Paiements, Stock, Users          │
└─────────────────────────────────────────┘
```

### Types d'utilisateurs

1. **CLIENTS B2B (comme Autodin)**
   - Site web dédié avec leur domaine
   - DH pour l'équipe (Manager, Comptable, Support)
   - Peuvent collaborer en team
   - Base de données isolée

2. **UTILISATEURS QWANYX (particuliers)**
   - Accès via qwanyx.com
   - DH personnel unique
   - Services via conversation (Personal-CASH, etc.)
   - Base chainée personnelle

## Architecture Technique

### Structure des APIs

```python
# 1. API Core QWANYX (générique)
/api/products       # CRUD produits base
/api/stock          # Gestion stock
/api/orders         # Commandes
/api/auth           # Authentification

# 2. API Métier (par template)
/api/bakery/recipes      # Spécifique boulangerie
/api/garage/oem-parts    # Spécifique garage

# 3. API Instance (par client)
/api/autodin/compatibility   # Spécifique Autodin
/api/michel/specialites      # Spécifique Boulangerie Michel
```

### Modèle de données flexible (MongoDB)

```javascript
// Collection: business_templates
{
    "_id": "bakery_template",
    "name": "Boulangerie",
    "default_roles": ["boulanger", "vendeur", "apprenti"],
    "default_categories": ["pains", "viennoiseries"],
    "workflows": ["preparation", "cuisson", "vente"]
}

// Collection: workspaces (instances client)
{
    "_id": "boulangerie-michel",
    "template": "bakery_template",
    "domain": "michel-boulangerie.fr",
    "custom_config": {
        "roles": ["chef_sans_gluten"],
        "categories": ["bio_michel", "tradition_1920"]
    }
}

// Collection: users (multi-workspace)
{
    "_id": "user_marie",
    "email": "marie@example.com",
    "workspaces": {
        "boulangerie-michel": {
            "roles": ["vendeur", "chef_sans_gluten"]
        },
        "autodin": {
            "roles": ["manager"]
        }
    }
}
```

## Architecture Mémoire DH (Innovation Clé)

### Principe : Mémoire Chainée Inspirée du Cerveau

```
CERVEAU HUMAIN                    QWANYX DH
────────────────                  ────────────
Hippocampe (court terme)      →   Context Window (2-4K tokens)
Cortex (long terme)           →   MongoDB (permanent)
Rappel associatif             →   Vector Search
Consolidation                →   Summarization
Connexions neuronales         →   Chaînage mémoires
```

### Implementation

```python
# Structure mémoire chainée
memory_document = {
    "conversation_id": "conv_2025_01_15_001",
    "user_id": "user_123",
    "summary": "Discussion budget janvier",
    "key_decisions": ["limite 500€", "priorité courses"],
    "embeddings": [0.123, -0.456, ...],  # Vector pour recherche
    "linked_memories": ["conv_2024_12", "conv_budget_global"],
    "importance": 0.85,
    "last_accessed": "2025-01-15",
    "decay_rate": 0.1  # Oubli progressif si non utilisé
}

def get_relevant_context(query):
    # Recherche vectorielle (comme activation neuronale)
    relevant = vector_search(query, limit=5)
    
    # Propagation (mémoires liées)
    for memory in relevant:
        linked = get_linked_memories(memory.linked_memories)
    
    # Construction contexte minimal (2K tokens max)
    return build_context(relevant + linked)
```

### Avantages de cette approche

1. **Scalabilité** : Contexte toujours < 4K tokens (vs 100K+)
2. **Coût** : Linéaire, pas exponentiel
3. **Performance** : Récupération rapide du pertinent
4. **Évolution** : Apprentissage continu sans surcharge
5. **Naturel** : Fonctionne comme mémoire humaine

## Évolution Future (2025-2027)

### Génération d'UI Dynamique

```python
# 2026: Interfaces générées à la volée
@app.route('/ui/<context>')
def dynamic_ui(context):
    # Check cache
    if cached := get_cache(context):
        return cached
    
    # IA génère l'UI optimale
    ui = DH.generate_interface(
        user_preferences,
        device_type,
        context
    )
    
    # Cache 24h
    cache(ui, ttl=86400)
    return ui
```

### Timeline prévisionnelle

- **2025** : DH avec skills modulaires
- **2026** : UI générées et cachées
- **2027** : Pure conversation (no-UI)

## Décisions Techniques Prises

### Infrastructure
- ✅ **MongoDB** pour flexibilité schéma
- ✅ **API REST** centrale (Flask/Python)
- ✅ **Nginx** comme reverse proxy
- ✅ **Systemd** pour services
- ✅ **GitHub** pour CI/CD

### Déploiement
- ✅ VPS Hetzner (135.181.72.183)
- ✅ Port 5002 pour API QWANYX
- ✅ Port 8090 pour Autodin
- ✅ Architecture git pull/push

### Sécurité
- ✅ JWT pour authentification
- ✅ Isolation par workspace
- ✅ Rôles contextuels par business
- ✅ HTTPS via Let's Encrypt (à venir)

## Principes Directeurs

1. **DH-First** : Toujours penser interaction conversationnelle
2. **Flexible** : Templates réutilisables + customisation
3. **Scalable** : Architecture qui supporte 1 ou 10000 clients
4. **Cognitif** : S'inspirer du cerveau pour la mémoire
5. **Pragmatique** : Commencer simple, évoluer progressivement

## Notes de Session

Cette architecture a été conçue en collaboration avec Claude le 07/08/2025. Les décisions sont basées sur :
- Best practices industrie
- Inspiration cognitive (mémoire chainée)
- Vision future de l'interaction homme-machine
- Pragmatisme technique (MongoDB, Flask, etc.)

L'objectif est de créer une plateforme où le Digital Human n'est pas une feature mais LE cœur du système.