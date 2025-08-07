#!/bin/bash

# Autodin Deployment Script
echo "🚗 Deploying Autodin..."

# Configuration
APP_DIR="/opt/qwanyx/apps/qwanyx-server"
AUTODIN_DIR="${APP_DIR}/autodin/frontend"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Check function
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1 successful${NC}"
    else
        echo -e "${RED}✗ $1 failed${NC}"
        exit 1
    fi
}

# 1. Pull latest code
echo "📥 Pulling latest changes..."
cd $APP_DIR
git pull origin main
check_status "Git pull"

# 2. Install Python dependencies for Autodin
echo "📦 Installing dependencies..."
cd $AUTODIN_DIR
pip3 install flask bulma
check_status "Dependencies"

# 3. Copy systemd service
echo "⚙️ Installing Autodin service..."
cp ${APP_DIR}/deployment/autodin.service /etc/systemd/system/
systemctl daemon-reload
check_status "Service installation"

# 4. Configure Nginx location for Autodin
echo "🌐 Configuring Nginx..."
cat > /etc/nginx/sites-available/autodin << 'EOF'
# Autodin on port 8090
server {
    listen 8090;
    server_name _;
    
    location / {
        proxy_pass http://127.0.0.1:8091;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /static {
        alias /opt/qwanyx/apps/qwanyx-server/autodin/frontend/static;
        expires 30d;
    }
}
EOF

ln -sf /etc/nginx/sites-available/autodin /etc/nginx/sites-enabled/
nginx -t
check_status "Nginx configuration"

# 5. Set permissions
echo "🔐 Setting permissions..."
chown -R www-data:www-data $AUTODIN_DIR
chmod -R 755 $AUTODIN_DIR
check_status "Permissions"

# 6. Start services
echo "🚀 Starting Autodin..."
systemctl restart autodin
systemctl enable autodin
systemctl reload nginx
check_status "Service start"

# 7. Test
echo "🧪 Testing Autodin..."
sleep 3
curl -s http://localhost:8091/ > /dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Autodin is running${NC}"
    echo "Access at: http://$(curl -s -4 ifconfig.me):8090"
else
    echo -e "${RED}✗ Autodin not responding${NC}"
fi

echo -e "${GREEN}🎉 Autodin deployment complete!${NC}"