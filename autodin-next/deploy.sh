#!/bin/bash
# Deployment script for Autodin Next.js

echo "🚀 Deploying Autodin Next.js"
echo "============================"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building for production..."
npm run build

# Start with PM2 (if available) or regular start
if command -v pm2 &> /dev/null; then
    echo "🔄 Starting with PM2..."
    pm2 stop autodin-next 2>/dev/null || true
    pm2 start npm --name "autodin-next" -- start -- -p 3001
    pm2 save
else
    echo "▶️ Starting with npm..."
    PORT=3001 npm start
fi

echo ""
echo "✅ Autodin Next.js deployed!"
echo "Access at:"
echo "  - http://localhost:3001"
echo "  - http://135.181.72.183:3001"
echo "  - http://135.181.72.183/autodin (with Nginx)"