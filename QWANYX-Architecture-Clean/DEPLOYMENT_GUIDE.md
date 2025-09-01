# QWANYX Architecture - Deployment Guide

## 🚀 Quick Deploy

```bash
# Make your changes locally
git add .
git commit -m "Your changes"
git push origin main

# That's it! The server auto-deploys via webhook
```

## 📊 Production Environment

- **Server**: 135.181.72.183 (Hetzner VPS)
- **Next.js App**: http://135.181.72.183:3002 (Autodin)
- **SPU Backend**: http://135.181.72.183:5002 (Rust)
- **MongoDB**: localhost:27017 (on server)
- **Webhook**: port 9999 (GitHub integration)

## 🔄 Deployment Process

### Automatic via Git Push (Recommended)

1. **Make changes locally**
2. **Commit and push to GitHub**
3. **Webhook triggers on server**
4. **COMMANDS.sh executes automatically**
5. **Smart rebuild based on changes**
6. **Services restart with PM2**
7. **Health checks verify deployment**

### Manual Deployment (If needed)

```bash
# SSH to server
ssh root@135.181.72.183

# Navigate to repo
cd /opt/qwanyx/apps/qwanyx-server/QWANYX-Architecture-Clean

# Run deployment script
./COMMANDS.sh
```

## 📦 Architecture Overview

### Monorepo Structure
```
QWANYX-Architecture-Clean/
├── packages/               # Shared packages (npm workspace)
│   ├── qwanyx-ui/         # UI components
│   ├── qwanyx-dashboard/  # Dashboard features
│   └── autodin-request-management/  # Request system
├── apps/
│   └── autodin/           # Next.js frontend
└── qwanyx-brain/
    └── spu-core/          # Rust backend
```

### Service Ports
- **3002**: Next.js Autodin app
- **5002**: SPU Core backend (Rust)
- **27017**: MongoDB
- **9999**: Webhook listener

## 🛠️ Smart Deployment Features

The `COMMANDS.sh` script includes:

### Change Detection
- Detects what changed since last deployment
- Only rebuilds affected components:
  - Packages changed → Rebuild packages
  - SPU changed → Rebuild Rust backend
  - Autodin changed → Rebuild Next.js app

### Build Optimization
- Uses Turbo for incremental builds
- Caches unchanged components
- Parallel processing where possible

### Expected Times
- **No changes**: Skip deployment (0 seconds)
- **Package changes**: 1-2 minutes
- **Frontend changes**: 2-3 minutes
- **Backend changes**: 3-5 minutes (Rust compilation)
- **Everything changed**: Max 5 minutes

### Health Checks
After deployment:
- Verifies HTTP 200 from Autodin (port 3002)
- Verifies HTTP 200 from SPU (port 5002)
- Shows PM2 process status

## 🔧 Server Setup

### Prerequisites Installed
```bash
# Node.js & npm (v18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Rust & Cargo
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Build dependencies
apt-get install -y pkg-config libssl-dev

# PM2 for process management
npm install -g pm2

# MongoDB
# Already configured with auth
```

### Environment Variables
```bash
# MongoDB (in PM2)
MONGODB_URI='mongodb://qwanyx:Iwb35TnYj#Vf@localhost:27017/?authSource=admin'

# Ports
PORT=3002  # Next.js
```

## 📝 Common Tasks

### View Logs
```bash
# All services
pm2 logs

# Specific service
pm2 logs autodin-next
pm2 logs spu-core

# Clear logs
pm2 flush
```

### Restart Services
```bash
# Restart all
pm2 restart all

# Restart specific
pm2 restart autodin-next
pm2 restart spu-core

# Save configuration
pm2 save
pm2 startup  # Enable on boot
```

### Check Status
```bash
# Service status
pm2 list

# System resources
pm2 monit

# Test endpoints
curl http://localhost:3002  # Autodin
curl http://localhost:5002/health  # SPU
```

## 🐛 Troubleshooting

### Build Failures

#### Next.js Build Error
```bash
# If production build fails, dev mode starts automatically
# Check logs for specific error:
pm2 logs autodin-next --lines 100
```

#### Rust Compilation Error
```bash
# Check cargo output
cd /opt/qwanyx/apps/qwanyx-server/QWANYX-Architecture-Clean/qwanyx-brain/spu-core
cargo build --release

# Common fix for OpenSSL issues
apt-get update && apt-get install -y pkg-config libssl-dev
```

### Service Not Starting

#### Port Already in Use
```bash
# Find process using port
lsof -i :3002
lsof -i :5002

# Kill if needed
kill -9 <PID>
```

#### MongoDB Connection Failed
```bash
# Check MongoDB status
systemctl status mongod

# Restart if needed
systemctl restart mongod

# Verify auth works
mongosh -u qwanyx -p 'Iwb35TnYj#Vf' --authenticationDatabase admin
```

### CORS Issues
The SPU backend has CORS enabled for the frontend origin.
If issues persist, check:
1. SPU is running on port 5002
2. Frontend uses correct URL in `spu.config.ts`

## 🔐 Security Notes

### SSH Access
- Root login with SSH key only
- Password authentication disabled
- Firewall configured for specific ports

### Database
- MongoDB has authentication enabled
- User: `qwanyx`
- Auth database: `admin`
- Separate databases per workspace

### API Security
- CORS configured for production origin
- Rate limiting on endpoints
- Input validation with Zod

## 📈 Monitoring

### Quick Health Check
```bash
# Run from local machine
curl -s -o /dev/null -w "Autodin: %{http_code}\n" http://135.181.72.183:3002
curl -s -o /dev/null -w "SPU: %{http_code}\n" http://135.181.72.183:5002/health
```

### PM2 Monitoring
```bash
# Real-time monitoring
pm2 monit

# Web dashboard (optional)
pm2 install pm2-logrotate
pm2 web
```

## 🚦 Deployment Checklist

Before pushing:
- [ ] Test locally with `npm run dev`
- [ ] Run TypeScript check: `npm run type-check`
- [ ] Verify SPU backend runs: `cargo run --release`
- [ ] Check for console errors

After deployment:
- [ ] Check deployment logs in console
- [ ] Verify services are running: `pm2 list`
- [ ] Test main functionality
- [ ] Check browser console for errors

## 📞 Support

If deployment fails:
1. Check the deployment output for errors
2. SSH to server and check PM2 logs
3. Run manual deployment for detailed output
4. Check MongoDB connection
5. Verify all ports are available

---

**Last Updated**: September 2024
**Deployment Time**: 1-5 minutes depending on changes
**Server Location**: Hetzner Cloud (Germany)