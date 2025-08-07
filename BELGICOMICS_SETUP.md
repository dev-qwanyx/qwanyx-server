# Belgicomics Setup - QWANYX Multi-Workspace Architecture

## Overview
We've successfully created **Belgicomics** as a second workspace in the QWANYX architecture, demonstrating the multi-tenant capabilities of the system.

## What Was Created

### 1. **Belgicomics Workspace**
- **ID**: `belgicomics`
- **Domain**: belgicomics.be
- **Description**: La plus grande librairie de BD en ligne de Belgique
- **Port**: 8090
- **Theme Colors**:
  - Primary: #E74C3C (Rouge BD)
  - Secondary: #2C3E50 (Bleu foncé)
  - Accent: #F39C12 (Jaune/Orange)

### 2. **Directory Structure**
```
belgicomics/
├── frontend/
│   ├── app_bulma.py           # Flask application
│   ├── config.py              # Belgicomics-specific configuration
│   ├── templates/
│   │   ├── index_bulma.html   # Homepage
│   │   ├── register.html      # Registration page
│   │   ├── mon-espace/        # Dashboard pages (renamed from mon-autodin)
│   │   └── components/        # Shared components
│   └── static/
│       └── assets/
│           └── img/           # Images and logos
```

### 3. **Key Differences from Autodin**

| Feature | Autodin | Belgicomics |
|---------|---------|-------------|
| **Focus** | Auto parts marketplace | Comic book store |
| **Services** | Search parts, Request parts, Sell vehicles | Catalog, Rare editions, Subscriptions |
| **Dashboard** | /mon-autodin | /mon-espace |
| **Menu Items** | My ads, Create ad, Vehicles | My orders, Favorites, Wishlist |
| **Professional Types** | Garagiste, Fournisseur, Carrossier | (To be defined for book sellers) |

### 4. **Workspace Isolation**
- **MongoDB Database**: `qwanyx_workspace_belgicomics` (separate from autodin)
- **LocalStorage Keys**: `belgicomics_token`, `belgicomics_user`, etc.
- **JWT Auth**: Same system, different workspace ID in payload
- **Collections**: All prefixed with workspace ID (e.g., `belgicomics_users`)

### 5. **Services Configuration**
```javascript
// Belgicomics services
- Catalogue Complet (50,000+ BD, mangas, comics)
- Éditions Rares (First editions, limited prints)
- Nouveautés (Latest releases)
- Abonnements (Subscription service)
- Précommandes (Pre-orders)
- Club Lecteurs (Reader community)
```

## Testing

### Run Both Applications
```bash
# Terminal 1 - API
cd qwanyx-api
python app_v2.py

# Terminal 2 - Autodin
cd autodin/frontend
python app_bulma.py

# Terminal 3 - Belgicomics
cd belgicomics/frontend
python app_bulma.py
```

### Access URLs
- **QWANYX API**: http://localhost:5002
- **Autodin**: http://localhost:8080
- **Belgicomics**: http://localhost:8090

### Test Multi-Workspace
```bash
python test_multiworkspace.py
```

## Next Steps

### 1. **Complete Belgicomics Features**
- [ ] Adapt registration form for book sellers/buyers
- [ ] Create catalog browsing pages
- [ ] Implement shopping cart functionality
- [ ] Add review/rating system
- [ ] Create subscription management

### 2. **Deployment on VPS**
When your Hetzner server is ready:
1. Install Docker & Docker Compose
2. Create containers for each workspace
3. Use Nginx as reverse proxy:
   - autodin.be → Autodin container
   - belgicomics.be → Belgicomics container
4. Setup SSL with Let's Encrypt

### 3. **Shared Components**
Consider creating shared components:
- Authentication system
- Payment integration
- Email templates
- Admin dashboard

## Architecture Benefits Demonstrated

1. **Code Reuse**: 90% of code shared between workspaces
2. **Data Isolation**: Complete separation of data
3. **Easy Scaling**: Add new workspaces without touching existing ones
4. **Unified Management**: Single API, multiple frontends
5. **Cost Efficient**: One server, multiple businesses

## Important Notes

- Each workspace uses **separate localStorage** keys
- Users must register separately for each workspace
- Workspaces can have completely different features
- The API handles all workspaces uniformly
- Frontend apps can be deployed independently

This demonstrates the power of the QWANYX multi-tenant architecture - you can run multiple businesses on the same infrastructure while keeping them completely isolated!