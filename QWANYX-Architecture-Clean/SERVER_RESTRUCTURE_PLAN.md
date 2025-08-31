# 🚨 QWANYX Server Restructuring Plan

## Current Server Chaos Analysis

### 🔴 CRITICAL PROBLEMS IDENTIFIED

1. **27 different directories** in `/opt/qwanyx/apps/qwanyx-server/`
2. **Multiple duplicate projects** (autodin, autodin-be, autodin-next, autodin-ui, autodin-ui-next)
3. **4.8GB of wasted space** (mostly duplicates)
4. **Conflicting services** running on different ports
5. **No clear deployment structure** - everything mixed together
6. **Old Flask apps** still running (ports 8090, 8091)

### 📊 Current Running Services

| Port | Service | Path | Status |
|------|---------|------|--------|
| 3002 | Next.js Autodin | QWANYX-Architecture-Clean/apps/autodin | ✅ KEEP |
| 5002 | Python API | QWANYX-Architecture-Clean/api/qwanyx-api | ✅ KEEP |
| 8090 | Old Flask Autodin | autodin/frontend | ❌ REMOVE |
| 8091 | Old Belgicomics | belgicomics | ❌ REMOVE |
| 9999 | Webhook | webhook-simple.py | ✅ KEEP |
| 5000 | Vite (qwanyx-modules) | qwanyx-modules | ❌ REMOVE |

## 🎯 NEW CLEAN STRUCTURE

```
/opt/qwanyx/
├── production/                    # Live production code (git managed)
│   └── QWANYX-Architecture-Clean/ # Direct mirror of your local repo
│       ├── apps/                  # All frontend apps
│       ├── api/                   # API service
│       ├── packages/              # Shared packages
│       └── scripts/               # Deployment scripts
├── services/                      # Service management
│   ├── webhook.py                 # GitHub webhook (port 9999)
│   └── nginx/                     # Nginx configs
├── data/                          # Persistent data
│   └── mongodb/                   # MongoDB data (preserved)
└── backup/                        # Backup old structure (temporary)
    └── old-structure-2024-08-31/  # Everything moved here first
```

## 🔧 MIGRATION STEPS

### Phase 1: Backup Everything (30 minutes)
```bash
# Create backup of current structure
cd /opt/qwanyx
mkdir -p backup/old-structure-$(date +%Y-%m-%d)
mv apps/qwanyx-server/* backup/old-structure-$(date +%Y-%m-%d)/
# Keep only QWANYX-Architecture-Clean
mv backup/old-structure-*/QWANYX-Architecture-Clean apps/qwanyx-server/
```

### Phase 2: Stop All Services
```bash
# Kill all Python services except webhook and API
pkill -f "app_bulma.py"
pkill -f "http.server 8091"

# Stop unnecessary Node services
pm2 stop all
pm2 delete all
```

### Phase 3: Create New Structure
```bash
# Create clean structure
cd /opt/qwanyx
mkdir -p production
mkdir -p services
mkdir -p data/mongodb

# Move current working project
mv apps/qwanyx-server/QWANYX-Architecture-Clean production/

# Move webhook service
mv apps/qwanyx-server/webhook-simple.py services/webhook.py
```

### Phase 4: Setup Deployment Symmetry
```bash
# Create deployment script
cat > /opt/qwanyx/services/deploy.sh << 'EOF'
#!/bin/bash
# Simple deployment that mirrors local development

cd /opt/qwanyx/production/QWANYX-Architecture-Clean

# Pull latest changes
git pull origin main

# Install dependencies (only if package.json changed)
if git diff HEAD^ HEAD --name-only | grep -q "package.json"; then
    npm install
fi

# Restart services
pm2 restart qwanyx-api
pm2 restart autodin-next

echo "Deployment complete!"
EOF

chmod +x /opt/qwanyx/services/deploy.sh
```

### Phase 5: Setup PM2 Process Management
```bash
# Create PM2 ecosystem file
cat > /opt/qwanyx/services/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'qwanyx-api',
      script: 'python3',
      args: 'app_v2.py',
      cwd: '/opt/qwanyx/production/QWANYX-Architecture-Clean/api/qwanyx-api',
      interpreter: 'none',
      env: {
        PORT: 5002
      }
    },
    {
      name: 'autodin-next',
      script: 'npm',
      args: 'run dev',
      cwd: '/opt/qwanyx/production/QWANYX-Architecture-Clean/apps/autodin',
      env: {
        PORT: 3002
      }
    },
    {
      name: 'webhook',
      script: 'python3',
      args: 'webhook.py',
      cwd: '/opt/qwanyx/services',
      interpreter: 'none'
    }
  ]
};
EOF

# Start with PM2
pm2 start /opt/qwanyx/services/ecosystem.config.js
pm2 save
pm2 startup
```

## 🚀 BENEFITS OF NEW STRUCTURE

### 1. **Perfect Symmetry**
- Server structure = Local structure
- No confusion about where things go
- Git pull updates everything

### 2. **5-Minute Deployments**
```bash
# Local development
git add .
git commit -m "feature: new update"
git push

# Server (automatic via webhook or manual)
cd /opt/qwanyx/production/QWANYX-Architecture-Clean
git pull
pm2 restart all
# DONE!
```

### 3. **Clear Separation**
- `production/` - Only production code
- `services/` - Infrastructure services
- `data/` - Persistent data
- `backup/` - Old stuff (can delete after verification)

### 4. **Space Savings**
- Current: 5.2GB total
- After cleanup: ~1.5GB
- **Saved: 3.7GB**

## 📝 WHAT TO DELETE

### Definitely Delete (Duplicates/Old)
- `autodin/` - Old Flask version
- `autodin-be/` - Duplicate
- `autodin-next/` - Old attempt
- `autodin-ui/` - Old UI attempt
- `autodin-ui-next/` - Another duplicate (611MB!)
- `belgicomics/` - Old Flask
- `belgicomics-ui/` - Old UI
- `dashboard-ui/` - Not used
- `qwanyx-modules/` - Old modules
- `qwanyx-ui/` - Old UI (176MB)
- `qwanyx-ui-dist/` - Build artifacts
- `Personal-CASH/` - Old version
- `qwanyx/` - Old structure
- `qwanyx-api/` - Old API (use the one in QWANYX-Architecture-Clean)
- `qwanyx-com/` - Old site
- `qwanyx-site/` - Old site
- `qwanyx-website/` - Old site
- `qwanyx-bulma-components/` - Obsolete
- `visible-film/` - Not related

### Keep (Move to appropriate location)
- `QWANYX-Architecture-Clean/` → `/opt/qwanyx/production/`
- `webhook-simple.py` → `/opt/qwanyx/services/webhook.py`
- MongoDB data → `/opt/qwanyx/data/mongodb/`
- Nginx configs → `/opt/qwanyx/services/nginx/`

## 🔄 NEW DEPLOYMENT WORKFLOW

### Development (Your Local Machine)
```bash
# Make changes
cd E:\qwanyxDev\QWANYX-Architecture\QWANYX-Architecture-Clean
# Test locally
npm run dev
# Commit and push
git add .
git commit -m "feature: description"
git push origin main
```

### Production (Server - Automatic)
Webhook receives push notification and runs:
```bash
cd /opt/qwanyx/production/QWANYX-Architecture-Clean
git pull origin main
npm install # if needed
pm2 restart all
```

### Manual Deployment (if webhook fails)
```bash
ssh root@135.181.72.183
/opt/qwanyx/services/deploy.sh
```

## ⚠️ IMPORTANT NOTES

1. **MongoDB Data** - DO NOT touch MongoDB data during migration
2. **DNS/Nginx** - Update nginx configs after migration
3. **Backup First** - Always backup before deleting
4. **Test Services** - Test each service after migration
5. **Keep Webhook** - The webhook is your automatic deployment

## 🎯 IMPLEMENTATION TIMELINE

1. **Hour 1**: Backup everything, stop old services
2. **Hour 2**: Create new structure, move files
3. **Hour 3**: Setup PM2, test services
4. **Hour 4**: Verify everything works, update documentation
5. **Hour 5**: Delete old backups (after 1 week of stability)

## 🔍 VALIDATION CHECKLIST

After migration, verify:
- [ ] Next.js app works on port 3002
- [ ] API works on port 5002
- [ ] Webhook works on port 9999
- [ ] MongoDB connection works
- [ ] Git pull updates code correctly
- [ ] PM2 manages all services
- [ ] No old services running
- [ ] Disk space recovered (check with `df -h`)

## 💡 FINAL RESULT

Instead of:
- 27 confusing directories
- Multiple duplicate projects
- Hours of deployment confusion
- 5.2GB of mess

You'll have:
- 4 clean directories
- Single source of truth
- 5-minute deployments
- 1.5GB clean structure
- Perfect local/server symmetry

**Deployment becomes:** Push to git → Auto deployed. That's it!