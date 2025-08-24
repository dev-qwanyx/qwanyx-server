# 🚀 QWANYX Quick Deploy Guide

## ⚡ FAST DEPLOYMENT (2 minutes instead of 2 hours!)

### Step 1: Build Locally (Once)
```bash
# Windows
build-local.bat

# Or manually:
cd packages/qwanyx-ui && npm run build
cd ../qwanyx-thot && npm run build  
cd ../qwanyx-dashboard-v2 && npm run build
cd ../../apps/autodin && npm run build
cd ../../brain-server && npm run build
```

### Step 2: Deploy to Server
```bash
# Windows
deploy.bat

# This uploads built files and restarts services
# Total time: 1-2 minutes!
```

## 🔧 What Changed?

### ✅ API Endpoint Configuration
- **OLD**: Hardcoded `USE_LOCAL = true` in code
- **NEW**: Environment variable `NEXT_PUBLIC_API_URL`
- **Local**: Uses `.env.local` → `http://localhost:5002`
- **Production**: Uses `.env.production` → `http://135.181.72.183:5002`

### ✅ Build Process
- **OLD**: Build on server (1-2 HOURS of hell!)
- **NEW**: Build locally, upload artifacts (2 minutes)
- **Standalone mode**: Smaller builds (~20-40MB)

### ✅ Deployment Scripts Created
1. **build-local.bat** - Builds all packages locally
2. **deploy.bat** - Uploads builds to server
3. **restart-services.sh** - Restarts services on server (no building!)

## 📋 Checklist Before Deploy

- [ ] Test locally with `npm run dev`
- [ ] Run `build-local.bat` to build everything
- [ ] Run `deploy.bat` to deploy
- [ ] Check services are running:
  - http://135.181.72.183:3002 (Autodin)
  - http://135.181.72.183:5002 (API)
  - http://135.181.72.183:3003 (Brain)

## 🎯 Benefits

| Before | After |
|--------|-------|
| 1-2 HOURS deploy time | 2 minutes |
| Build failures on server | Build failures caught locally |
| Never know what version is running | Know exactly what's deployed |
| Server at 100% CPU during builds | Server just restarts services |
| Git conflicts destroy configs | Configs preserved |
| Panic and stress | Calm and controlled |

## 🔥 Emergency Rollback

If something goes wrong:
1. Keep previous `.next` folder backup
2. Can quickly restore: `scp -r .next.backup root@server:/path/apps/autodin/.next`
3. Run `restart-services.sh` on server

## 📝 Notes

- Server only needs Node.js runtime, not build tools
- Python files are tiny, upload instantly
- Brain server now builds to `dist/` folder
- All services use PM2 for process management

---

**THE NIGHTMARE IS OVER!** Deploy in 2 minutes, not 2 hours! 🎉