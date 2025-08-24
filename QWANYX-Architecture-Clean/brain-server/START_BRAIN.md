# 🧠 How to Start the Brain Server

## 🚀 Quick Start (3 Ways)

### Option 1: Double-click (Windows)
```
Just double-click: start.bat
```

### Option 2: PowerShell
```powershell
./start.ps1
```

### Option 3: NPM Command
```bash
cd brain-server
npm run brain:start
```

## 🎯 What Happens When You Start

1. **Port 3003 is automatically cleaned** - No more "port in use" errors!
2. **Phil's brain auto-starts** - Ready to receive emails immediately
3. **Auto-restart on changes** - Edit code and it restarts automatically
4. **All services activate**:
   - 📧 Email monitoring (IMAP)
   - 🤖 AI responses (GPT-5 Nano)
   - 📤 Email sending (AWS SES)
   - 💾 MongoDB memories

## 🛠 Manual Commands (if needed)

```bash
# Simple start (no auto-restart)
npm run brain

# Development mode (with auto-restart)
npm run brain:dev

# Old way (still works)
npx ts-node --transpile-only src/index.ts
```

## ⚠️ Common Issues & Solutions

### Port 3003 in use?
The start scripts automatically kill the old process. But if needed:
```bash
# Windows
taskkill //F //PID $(netstat -ano | findstr :3003)

# PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3003).OwningProcess | Stop-Process -Force
```

### Brain not starting?
Check:
1. MongoDB is running
2. `.env` file exists with OpenAI API key
3. `mail-config.json` has correct credentials

## 📊 Health Check

Once started, verify at:
- http://localhost:3003/brains - Should show Phil's brain
- http://localhost:3003/health - Should return OK

## 🔥 Features Active

When the brain starts, you get:
- ✅ Automatic email checking every 30 seconds
- ✅ AI-powered responses with lead qualification
- ✅ 5-stage sales progression (COLD → HOT)
- ✅ Alex Hormozi objection handling
- ✅ BANT framework tracking
- ✅ Automatic email replies via AWS SES

## 📧 Test It!

Send an email to: **phil@qwanyx.com**
Watch the magic happen in the console!