#!/bin/bash
# Deploy script for Next.js apps on server

echo "🚀 Deploying QWANYX Next.js Apps"
echo "================================="

# Pull latest code
git pull origin main

# Build and deploy Autodin
echo "📦 Building Autodin..."
cd autodin-next
npm install
npm run build
pm2 restart autodin-next || pm2 start npm --name "autodin-next" -- start -- -p 3001

# Build and deploy Belgicomics  
echo "📦 Building Belgicomics..."
cd ../belgicomics-next
npm install
npm run build
pm2 restart belgicomics-next || pm2 start npm --name "belgicomics-next" -- start -- -p 3002

# Restart API if needed
echo "🔄 Checking API..."
cd ../qwanyx-api
pm2 restart qwanyx-api || pm2 start app.py --name "qwanyx-api" --interpreter python3

# Show status
echo ""
echo "✅ Deployment complete!"
echo "================================="
pm2 status

echo ""
echo "Access points:"
echo "- Autodin: http://autodin.be (or http://135.181.72.183:3001)"
echo "- Belgicomics: http://belgicomics.be (or http://135.181.72.183:3002)"
echo "- API: http://135.181.72.183:5002"