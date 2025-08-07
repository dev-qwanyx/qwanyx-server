# Autodin - Documentation Instance

## Vue d'ensemble

Autodin est une marketplace de pièces automobiles B2B/B2C utilisant l'infrastructure QWANYX.

### Informations Clés
- **URL Production** : autodin.be
- **URL Dev** : http://135.181.72.183:8090
- **Template de base** : Garage/Automotive
- **Statut** : En développement

## Architecture Spécifique

```
Autodin
├── Frontend (Flask + Bulma CSS)
│   ├── Site vitrine public
│   ├── Marketplace pièces
│   └── Interface recherche
│
├── API Extensions
│   ├── /api/autodin/compatibility
│   ├── /api/autodin/oem-search
│   └── /api/autodin/inventory
│
└── Digital Humans Team
    ├── DH Support Client
    ├── DH Expert Technique
    └── DH Manager Stock
```

## Configuration Custom

### Rôles Spécifiques
- `expert_mecanique` : Peut valider compatibilité
- `gestionnaire_stock` : Gère inventaire
- `commercial_b2b` : Accès prix pro

### Catégories Produits
```javascript
{
  "moteur": ["filtres", "bougies", "courroies"],
  "carrosserie": ["pare-chocs", "rétroviseurs", "portières"],
  "freinage": ["plaquettes", "disques", "étriers"],
  "eclairage": ["phares", "feux", "ampoules"],
  "pieces_tuning": ["jantes", "suspensions", "échappements"]
}
```

## API Endpoints Spécifiques

### Vérification Compatibilité
```http
POST /api/autodin/compatibility
{
  "part_number": "BOS-0986424797",
  "vehicle_vin": "WVWZZZ1JZ3W386752"
}
```

### Recherche par OEM
```http
GET /api/autodin/oem-search?number=06A906461L
```

## Déploiement

### Local (Windows)
```bash
cd autodin/frontend
python app_bulma.py
# Accessible sur http://localhost:8090
```

### Production (Serveur)
```bash
ssh root@135.181.72.183
cd /opt/qwanyx/apps/qwanyx-server
git pull
systemctl restart autodin
```

## Configuration Nginx

Autodin est accessible via :
- Port direct : `http://IP:8090`
- Sous-domaine : `autodin.qwanyx.com` (à venir)
- Domaine propre : `autodin.be` (après config DNS)

## Digital Humans Autodin

### DH Support Client
- Répond aux questions techniques
- Aide à la recherche de pièces
- Gère les réclamations

### DH Expert Technique
- Valide les compatibilités
- Conseille sur les alternatives
- Formation technique

### DH Manager Stock
- Alertes stock bas
- Suggestions réapprovisionnement
- Analyse tendances

## Données Spécifiques

### Collections MongoDB
```
autodin_db
├── products       # Catalogue pièces
├── vehicles       # Base véhicules
├── compatibility  # Matrices compatibilité
├── suppliers      # Fournisseurs
└── orders         # Commandes
```

## Roadmap Autodin

- [x] Site vitrine Bulma CSS
- [x] Intégration API QWANYX
- [ ] Système recherche avancée
- [ ] Module compatibilité VIN
- [ ] DH Support intégré
- [ ] Paiement en ligne
- [ ] App mobile

## Support

- **Contact Tech** : dev@autodin.be
- **DH Support** : Via interface chat
- **Documentation API** : [API Autodin](./custom-api.md)