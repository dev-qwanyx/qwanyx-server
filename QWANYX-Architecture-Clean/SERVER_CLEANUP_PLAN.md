# Server Cleanup Plan - NEXT WEEK
Date: August 20, 2024
**DO NOT EXECUTE BEFORE DEMO (Sunday)**

## 🚨 Current Server Situation

### Running Services (Cluttered)
```
Port 8090: Flask Autodin (OLD - not needed)
Port 8091: Flask Belgicomics (OLD - not needed)  
Port 3002: Next.js Autodin (NEW - keep this!)
Port 5002: Python API (KEEP - needed for auth/data)
Port 9999: Webhook server (KEEP - for auto-deploy)
```

### Problems
- Multiple Flask services running unnecessarily
- Federation services installed (not used)
- Old Python processes consuming resources
- Duplicate Autodin versions (Flask vs Next.js)
- Messy directory structure with old experiments

## 🧹 Cleanup Plan (AFTER DEMO)

### Option A: Surgical Cleanup (Recommended)
```bash
# 1. Stop and remove old Flask services
systemctl stop autodin-flask
systemctl stop belgicomics-flask
systemctl disable autodin-flask
systemctl disable belgicomics-flask
pkill -f "python.*app_bulma"

# 2. Remove old PM2 processes
pm2 delete autodin-ui
pm2 delete belgicomics-ui
pm2 save

# 3. Clean old directories
rm -rf /opt/qwanyx/apps/qwanyx-server/autodin/frontend
rm -rf /opt/qwanyx/apps/qwanyx-server/belgicomics/frontend
rm -rf /opt/qwanyx/apps/qwanyx-server/qwanyx-modules
rm -rf /opt/qwanyx/apps/qwanyx-server/federation-*

# 4. Remove unused Python packages
pip uninstall flask-federation
```

### Option B: Complete Server Reset (Nuclear Option)
```bash
# Backup current working setup
1. Backup database
2. Save /opt/qwanyx/apps/qwanyx-server/QWANYX-Architecture-Clean
3. Save API configuration

# Fresh install
1. Reinstall Ubuntu Server
2. Install only: Node.js, PM2, Python, MongoDB
3. Deploy only: Next.js app + API
4. No Flask, no federation, no experiments
```

## 📁 What to Keep

### Essential Services
- **Next.js Autodin** (port 3002) - The new app
- **Python API** (port 5002) - For authentication/data
- **MongoDB** - Database
- **PM2** - Process manager
- **Webhook** (port 9999) - For auto-deploy

### Directory Structure (Clean)
```
/opt/qwanyx/
└── apps/
    └── qwanyx-server/
        ├── QWANYX-Architecture-Clean/  # Main codebase
        │   ├── apps/autodin/           # Next.js app
        │   ├── packages/               # Shared packages
        │   └── api/qwanyx-api/        # Python API
        └── webhook-server.py           # Deployment webhook
```

## 🔥 Services to Remove

### Flask Applications
- autodin/frontend/app_bulma.py (port 8090)
- belgicomics/frontend/app_bulma.py (port 8091)
- All Flask dependencies

### Federation Services
- flask-federation
- federation-server
- Any OAuth federation modules

### Old Experiments
- qwanyx-modules
- autodin-ui (old React attempts)
- belgicomics-ui
- Multiple backup directories

## 📊 Expected Results

### Before Cleanup
- Memory usage: ~2GB
- Running processes: 20+
- Ports used: 8090, 8091, 3002, 5002, 9999
- Disk usage: Cluttered with duplicates

### After Cleanup
- Memory usage: ~500MB
- Running processes: 5-6
- Ports used: 3002, 5002, 9999
- Disk usage: Clean, organized

## ⚠️ Pre-Cleanup Checklist

- [ ] Demo completed successfully
- [ ] Backup database
- [ ] Document current working URLs
- [ ] Save COMMANDS.sh
- [ ] Export PM2 configuration
- [ ] Backup .env files

## 🚀 Post-Cleanup Setup

1. Only these services should run:
```bash
pm2 list
# Should show:
# - autodin-next (port 3002)
# - webhook-server (port 9999)

systemctl status qwanyx-api
# Should show: active (port 5002)
```

2. Crontab should only have:
```bash
@reboot pm2 resurrect
```

3. Nginx (if used) should only proxy:
- Port 3002 for main app
- Port 5002 for API

## 📝 Notes

- **DO NOT CLEAN BEFORE DEMO**
- Current setup works, just wasteful
- Flask services auto-restart (that's why they keep coming back)
- Federation was probably for multi-app authentication (not needed now)
- After cleanup, server will be much faster

## Commands to Check Current State
```bash
# See what's using memory
ps aux | sort -nrk 3,3 | head -10

# See what's using ports
netstat -tulpn | grep LISTEN

# See PM2 processes
pm2 list

# See systemd services
systemctl list-units --type=service --state=running
```

---
*Plan created: August 20, 2024*
*TO BE EXECUTED: After demo (next week)*
*Priority: High - will free significant resources*