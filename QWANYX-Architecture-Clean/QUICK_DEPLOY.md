# 🚀 QWANYX Quick Deploy Guide

## After Server Restructuring - Your New 5-Minute Deployment

### 🎯 Local Development → Production in 3 Steps

#### Step 1: Develop Locally
```bash
cd E:\qwanyxDev\QWANYX-Architecture\QWANYX-Architecture-Clean
# Make your changes
# Test locally with:
npm run dev        # Frontend
python app_v2.py   # API
```

#### Step 2: Commit and Push
```bash
git add .
git commit -m "feature: your changes"
git push origin main
```

#### Step 3: Automatic Deployment
**That's it!** The webhook on the server automatically:
- Pulls your changes
- Installs dependencies (if needed)
- Restarts services
- Your changes are live in ~30 seconds

### 🔧 Manual Deployment (if webhook fails)
```bash
ssh root@135.181.72.183
/opt/qwanyx/services/deploy.sh
```

### 📊 Check Service Status
```bash
ssh root@135.181.72.183 "pm2 list"
```

### 🌐 Access Your Services
- **Autodin App**: http://135.181.72.183:3002
- **API**: http://135.181.72.183:5002
- **API Docs**: http://135.181.72.183:5002/docs

### 🔍 View Logs
```bash
# All logs
ssh root@135.181.72.183 "pm2 logs"

# Specific service
ssh root@135.181.72.183 "pm2 logs autodin-next"
ssh root@135.181.72.183 "pm2 logs qwanyx-api"
```

### 🔄 Restart Services
```bash
# Restart all
ssh root@135.181.72.183 "pm2 restart all"

# Restart specific
ssh root@135.181.72.183 "pm2 restart autodin-next"
ssh root@135.181.72.183 "pm2 restart qwanyx-api"
```

## 🎨 Development Workflow

### Perfect Symmetry: Local = Server
Your local structure:
```
QWANYX-Architecture-Clean/
├── apps/autodin/        # Next.js app
├── api/qwanyx-api/      # Python API
└── packages/            # Shared packages
```

Server structure (identical):
```
/opt/qwanyx/production/QWANYX-Architecture-Clean/
├── apps/autodin/        # Same Next.js app
├── api/qwanyx-api/      # Same Python API
└── packages/            # Same shared packages
```

### No More Confusion!
- **One source of truth**: Your local repo
- **One deployment method**: Git push
- **One structure**: Perfectly mirrored
- **One command**: That's all you need

## 🚨 Common Tasks

### Add New Feature
```bash
# Local
git checkout -b feature/new-feature
# ... make changes ...
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
# Create PR and merge to main
# Auto-deployed when merged!
```

### Fix Production Bug
```bash
# Local
# ... fix bug ...
git add .
git commit -m "fix: critical bug"
git push origin main
# Fixed in production in 30 seconds!
```

### Update Dependencies
```bash
# Local
npm install new-package
git add package*.json
git commit -m "deps: add new-package"
git push origin main
# Server automatically runs npm install!
```

## 📝 What Changed?

### Before (Nightmare)
- 27 confusing directories
- Multiple duplicate projects
- Manual file copying
- Hours of deployment
- Never sure what's running where

### After (Dream)
- 1 production directory
- 1 source of truth
- Automatic git deployment
- 5-minute deployments
- Perfect clarity

## 🎯 Remember

**Your entire deployment is now:**
```bash
git push
```

That's it. Nothing more. The server handles everything else.