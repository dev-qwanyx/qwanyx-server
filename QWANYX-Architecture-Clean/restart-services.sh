#!/bin/bash
# Restart services on server WITHOUT building
# This runs on the server after deployment

echo "========================================" 
echo "   RESTARTING QWANYX SERVICES"
echo "   No building - just restart!"
echo "========================================"
echo ""

# Kill existing processes
echo "🛑 Stopping existing services..."
pkill -f "python3.*app_v2.py" || true
pm2 stop autodin-next 2>/dev/null || true
pm2 stop brain-server 2>/dev/null || true
pkill -f "node.*brain-server" || true

# Give processes time to stop
sleep 2

# Start Python API
echo "🐍 Starting Python API..."
cd /opt/qwanyx/QWANYX-Architecture-Clean/api/qwanyx-api
nohup python3 app_v2.py > /tmp/qwanyx-api.log 2>&1 &
echo "   API started on port 5002"

# Start Autodin Next.js
echo "⚛️ Starting Autodin Next.js..."
cd /opt/qwanyx/QWANYX-Architecture-Clean/apps/autodin
pm2 start npm --name "autodin-next" -- start
echo "   Autodin started on port 3002"

# Start Brain Server
echo "🧠 Starting Brain Server..."
cd /opt/qwanyx/QWANYX-Architecture-Clean/brain-server
pm2 start dist/index.js --name "brain-server"
echo "   Brain Server started on port 3003"

# Wait a moment for services to start
sleep 3

# Check status
echo ""
echo "📊 Checking service status..."
echo ""

# Check if services are responding
curl -s -o /dev/null -w "✅ API: %{http_code}\n" http://localhost:5002/health
curl -s -o /dev/null -w "✅ Autodin: %{http_code}\n" http://localhost:3002
curl -s -o /dev/null -w "✅ Brain: %{http_code}\n" http://localhost:3003/health

echo ""
echo "========================================" 
echo "   ALL SERVICES RESTARTED!"
echo "   Deployment complete in seconds!"
echo "========================================"