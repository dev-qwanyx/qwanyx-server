#!/bin/bash

# QWANYX Deployment Script
# This script should be run on the server after pulling from git

echo "🚀 Starting QWANYX deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/opt/qwanyx/apps/qwanyx-server"
API_DIR="${APP_DIR}/qwanyx-api"
DEPLOYMENT_DIR="${APP_DIR}/deployment"

# Function to check if command succeeded
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1 successful${NC}"
    else
        echo -e "${RED}✗ $1 failed${NC}"
        exit 1
    fi
}

# 1. Pull latest changes from git
echo -e "${YELLOW}📥 Pulling latest changes from GitHub...${NC}"
cd $APP_DIR
git pull origin main
check_status "Git pull"

# 2. Install/Update Python dependencies
echo -e "${YELLOW}📦 Installing Python dependencies...${NC}"
cd $API_DIR
source venv/bin/activate
pip install -r requirements.txt
check_status "Dependencies installation"

# 3. Install MongoDB if not installed
if ! command -v mongod &> /dev/null; then
    echo -e "${YELLOW}🗄️ Installing MongoDB...${NC}"
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    apt-get update
    apt-get install -y mongodb-org
    check_status "MongoDB installation"
fi

# 4. Start MongoDB
echo -e "${YELLOW}🗄️ Starting MongoDB...${NC}"
systemctl start mongod
systemctl enable mongod
check_status "MongoDB start"

# 5. Copy systemd service file
echo -e "${YELLOW}⚙️ Installing systemd service...${NC}"
cp ${DEPLOYMENT_DIR}/qwanyx-api.service /etc/systemd/system/
systemctl daemon-reload
check_status "Systemd service installation"

# 6. Copy Nginx configuration
echo -e "${YELLOW}🌐 Configuring Nginx...${NC}"
cp ${DEPLOYMENT_DIR}/nginx-qwanyx.conf /etc/nginx/sites-available/qwanyx
ln -sf /etc/nginx/sites-available/qwanyx /etc/nginx/sites-enabled/
nginx -t
check_status "Nginx configuration test"

# 7. Install SSL certificate with Let's Encrypt (if not exists)
if [ ! -d "/etc/letsencrypt/live/qwanyx.com" ]; then
    echo -e "${YELLOW}🔒 Installing SSL certificate...${NC}"
    apt-get install -y certbot python3-certbot-nginx
    certbot --nginx -d qwanyx.com -d api.qwanyx.com --non-interactive --agree-tos -m phil@qwanyx.com
    check_status "SSL certificate installation"
fi

# 8. Set proper permissions
echo -e "${YELLOW}🔐 Setting permissions...${NC}"
chown -R www-data:www-data $API_DIR
chmod -R 755 $API_DIR
check_status "Permissions setup"

# 9. Start services
echo -e "${YELLOW}🚀 Starting services...${NC}"
systemctl restart qwanyx-api
systemctl enable qwanyx-api
systemctl reload nginx
check_status "Services start"

# 10. Check service status
echo -e "${YELLOW}📊 Service Status:${NC}"
systemctl status qwanyx-api --no-pager | head -n 10

# 11. Test API endpoint
echo -e "${YELLOW}🧪 Testing API...${NC}"
sleep 3
curl -s http://localhost:5000/api/health > /dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ API is responding${NC}"
else
    echo -e "${RED}✗ API is not responding${NC}"
fi

echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo -e "API should be available at: https://api.qwanyx.com"