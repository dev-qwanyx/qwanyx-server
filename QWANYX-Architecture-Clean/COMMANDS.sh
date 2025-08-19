#!/bin/bash

# QWANYX Server Deployment Script
# This script is executed automatically after git pull

echo "🚀 Starting deployment..."

# Kill old processes
echo "Stopping old services..."
pkill -f "python3.*autodin" || true
pkill -f "node.*autodin" || true
pm2 delete autodin-next 2>/dev/null || true

# Navigate to project directory
cd /opt/qwanyx/apps/qwanyx-server

# Pull latest changes (already done by webhook)
echo "Code already updated by webhook"

# Install/Update Node.js dependencies for Autodin Next.js
echo "📦 Installing dependencies for Autodin Next.js..."
cd apps/autodin
npm install

# Build Next.js production version
echo "🔨 Building Autodin Next.js..."
npm run build

# Start Autodin with PM2 on port 8090 (replacing Flask)
echo "🚀 Starting Autodin Next.js on port 8090..."
PORT=8090 pm2 start npm --name "autodin-next" -- start
pm2 save

# Keep Belgicomics Flask running
echo "🚀 Restarting Belgicomics Flask..."
pkill -f "python3.*belgicomics" || true
cd /opt/qwanyx/apps/qwanyx-server/belgicomics/frontend
nohup python3 app_bulma.py > /tmp/belgicomics.log 2>&1 &

# Keep API running
echo "🚀 Restarting QWANYX API..."
pkill -f "python3.*app_v2" || true
cd /opt/qwanyx/apps/qwanyx-server/api/qwanyx-api
nohup python3 app_v2.py > /tmp/qwanyx-api.log 2>&1 &

# Wait for services to start
sleep 5

# Check services status
echo "✅ Checking services..."
curl -s -o /dev/null -w "Autodin Next.js: %{http_code}\n" http://localhost:8090
curl -s -o /dev/null -w "Belgicomics: %{http_code}\n" http://localhost:8091
curl -s -o /dev/null -w "QWANYX API: %{http_code}\n" http://localhost:5002

echo "🎉 Deployment complete!"