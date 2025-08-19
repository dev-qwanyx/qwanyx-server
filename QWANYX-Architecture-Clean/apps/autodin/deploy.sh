#!/bin/bash

# Autodin Next.js Deployment Script
# This script prepares and deploys the Autodin app to the server

echo "🚀 Deploying Autodin Next.js to server..."

# Server details
SERVER="135.181.72.183"
SERVER_USER="root"
DEPLOY_PATH="/opt/qwanyx/apps/qwanyx-server/apps/autodin"
PORT=8090

# Create deployment package
echo "📦 Creating deployment package..."
tar czf autodin-deploy.tar.gz \
    .next \
    public \
    package.json \
    package-lock.json \
    next.config.js

echo "📤 Uploading to server..."
scp autodin-deploy.tar.gz ${SERVER_USER}@${SERVER}:/tmp/

echo "🔧 Setting up on server..."
ssh ${SERVER_USER}@${SERVER} << 'ENDSSH'
    echo "Extracting files..."
    mkdir -p /opt/qwanyx/apps/qwanyx-server/apps/autodin
    cd /opt/qwanyx/apps/qwanyx-server/apps/autodin
    tar xzf /tmp/autodin-deploy.tar.gz
    
    echo "Installing dependencies..."
    npm install --production
    
    echo "Stopping old process..."
    pm2 delete autodin-next 2>/dev/null || true
    
    echo "Starting with PM2..."
    PORT=8090 pm2 start npm --name "autodin-next" -- start
    pm2 save
    
    echo "Cleaning up..."
    rm /tmp/autodin-deploy.tar.gz
    
    echo "✅ Deployment complete!"
    echo "Testing connection..."
    sleep 3
    curl -I http://localhost:8090
ENDSSH

echo "🎉 Deployment finished!"
echo "Access the app at: http://135.181.72.183:8090"