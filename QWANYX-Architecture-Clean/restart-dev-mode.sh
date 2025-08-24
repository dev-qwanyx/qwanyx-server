#!/bin/bash
# Run everything in dev mode - no build needed!

echo "========================================" 
echo "   STARTING SERVICES IN DEV MODE"
echo "   No build - just run!"
echo "========================================"
echo ""

# Kill existing processes
echo "🛑 Stopping old services..."
pkill -f "python3.*app_v2.py" || true
pkill -f "npm.*dev" || true
pkill -f "ts-node" || true
pm2 delete all 2>/dev/null || true

sleep 2

# Start Python API (no build needed)
echo "🐍 Starting Python API..."
cd /opt/qwanyx/QWANYX-Architecture-Clean/api/qwanyx-api
nohup python3 app_v2.py > /tmp/qwanyx-api.log 2>&1 &

# Start Autodin in dev mode
echo "⚛️ Starting Autodin (dev mode)..."
cd /opt/qwanyx/QWANYX-Architecture-Clean/apps/autodin
nohup npm run dev > /tmp/autodin.log 2>&1 &

# Start Brain Server in dev mode
echo "🧠 Starting Brain Server (dev mode)..."
cd /opt/qwanyx/QWANYX-Architecture-Clean/brain-server
nohup npm run brain:start > /tmp/brain.log 2>&1 &

sleep 5

# Check if running
echo ""
echo "📊 Checking services..."
ps aux | grep -E "npm|python3|ts-node" | grep -v grep

echo ""
echo "📝 Logs available at:"
echo "  - API: /tmp/qwanyx-api.log"
echo "  - Autodin: /tmp/autodin.log"
echo "  - Brain: /tmp/brain.log"

echo ""
echo "========================================" 
echo "   DEV MODE DEPLOYMENT COMPLETE!"
echo "   No build needed - just works!"
echo "========================================"