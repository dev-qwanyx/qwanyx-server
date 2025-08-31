#!/bin/bash
# QWANYX Server Restructuring Script
# WARNING: This will completely restructure the server
# Make sure to run this on the server as root

set -e  # Exit on error

echo "======================================"
echo "QWANYX Server Restructuring Script"
echo "======================================"
echo ""
echo "This script will:"
echo "1. Backup current structure"
echo "2. Stop old services"
echo "3. Create new clean structure"
echo "4. Setup PM2 process management"
echo "5. Migrate to clean deployment"
echo ""
read -p "Are you sure you want to proceed? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 1
fi

# Variables
BACKUP_DIR="/opt/qwanyx/backup/old-structure-$(date +%Y-%m-%d-%H%M)"
PROD_DIR="/opt/qwanyx/production"
SERVICES_DIR="/opt/qwanyx/services"
DATA_DIR="/opt/qwanyx/data"

echo ""
echo "Step 1: Creating backup..."
echo "======================================"
mkdir -p "$BACKUP_DIR"
cd /opt/qwanyx/apps/qwanyx-server

# Backup everything except QWANYX-Architecture-Clean
for dir in */; do
    if [ "$dir" != "QWANYX-Architecture-Clean/" ]; then
        echo "Backing up $dir..."
        mv "$dir" "$BACKUP_DIR/" 2>/dev/null || true
    fi
done

# Backup loose files
mv *.py "$BACKUP_DIR/" 2>/dev/null || true
mv *.sh "$BACKUP_DIR/" 2>/dev/null || true
mv *.md "$BACKUP_DIR/" 2>/dev/null || true
mv *.txt "$BACKUP_DIR/" 2>/dev/null || true
mv *.png "$BACKUP_DIR/" 2>/dev/null || true
mv *.exe "$BACKUP_DIR/" 2>/dev/null || true
mv *.zip "$BACKUP_DIR/" 2>/dev/null || true

echo "Backup completed at: $BACKUP_DIR"

echo ""
echo "Step 2: Stopping old services..."
echo "======================================"
# Kill old Flask services
pkill -f "app_bulma.py" || true
pkill -f "http.server 8091" || true
pkill -f "http.server 8090" || true

# List current PM2 processes
pm2 list

echo ""
echo "Step 3: Creating new structure..."
echo "======================================"
mkdir -p "$PROD_DIR"
mkdir -p "$SERVICES_DIR"
mkdir -p "$DATA_DIR/mongodb"

# Move QWANYX-Architecture-Clean to production
if [ -d "/opt/qwanyx/apps/qwanyx-server/QWANYX-Architecture-Clean" ]; then
    echo "Moving QWANYX-Architecture-Clean to production..."
    mv /opt/qwanyx/apps/qwanyx-server/QWANYX-Architecture-Clean "$PROD_DIR/"
fi

# Find and move webhook script
if [ -f "$BACKUP_DIR/webhook-simple.py" ]; then
    echo "Moving webhook service..."
    cp "$BACKUP_DIR/webhook-simple.py" "$SERVICES_DIR/webhook.py"
fi

echo ""
echo "Step 4: Creating deployment script..."
echo "======================================"
cat > "$SERVICES_DIR/deploy.sh" << 'EOF'
#!/bin/bash
# QWANYX Simple Deployment Script

echo "Starting deployment..."
cd /opt/qwanyx/production/QWANYX-Architecture-Clean

# Pull latest changes
echo "Pulling latest changes..."
git pull origin main

# Check if package.json changed
if git diff HEAD^ HEAD --name-only | grep -q "package.json"; then
    echo "Dependencies changed, running npm install..."
    npm install
fi

# Restart services with PM2
echo "Restarting services..."
pm2 restart qwanyx-api
pm2 restart autodin-next

echo "Deployment complete!"
echo "Services status:"
pm2 list
EOF

chmod +x "$SERVICES_DIR/deploy.sh"

echo ""
echo "Step 5: Creating PM2 ecosystem config..."
echo "======================================"
cat > "$SERVICES_DIR/ecosystem.config.js" << 'EOF'
module.exports = {
  apps: [
    {
      name: 'qwanyx-api',
      script: 'python3',
      args: 'app_v2.py',
      cwd: '/opt/qwanyx/production/QWANYX-Architecture-Clean/api/qwanyx-api',
      interpreter: 'none',
      env: {
        PORT: 5002,
        PYTHONUNBUFFERED: 1
      },
      error_file: '/opt/qwanyx/logs/api-error.log',
      out_file: '/opt/qwanyx/logs/api-out.log',
      time: true
    },
    {
      name: 'autodin-next',
      script: 'npm',
      args: 'run dev',
      cwd: '/opt/qwanyx/production/QWANYX-Architecture-Clean/apps/autodin',
      env: {
        PORT: 3002,
        NODE_ENV: 'production'
      },
      error_file: '/opt/qwanyx/logs/autodin-error.log',
      out_file: '/opt/qwanyx/logs/autodin-out.log',
      time: true
    },
    {
      name: 'webhook',
      script: 'python3',
      args: 'webhook.py',
      cwd: '/opt/qwanyx/services',
      interpreter: 'none',
      env: {
        PYTHONUNBUFFERED: 1
      },
      error_file: '/opt/qwanyx/logs/webhook-error.log',
      out_file: '/opt/qwanyx/logs/webhook-out.log',
      time: true
    }
  ]
};
EOF

# Create logs directory
mkdir -p /opt/qwanyx/logs

echo ""
echo "Step 6: Starting services with PM2..."
echo "======================================"
# Stop all current PM2 processes
pm2 delete all || true

# Start new services
pm2 start "$SERVICES_DIR/ecosystem.config.js"
pm2 save
pm2 startup

echo ""
echo "Step 7: Verification..."
echo "======================================"
echo "Checking services status..."
pm2 list

echo ""
echo "Checking ports..."
netstat -tlnp | grep -E ":(3002|5002|9999)"

echo ""
echo "Checking disk usage..."
df -h /opt/qwanyx

echo ""
echo "======================================"
echo "RESTRUCTURING COMPLETE!"
echo "======================================"
echo ""
echo "New structure:"
echo "  /opt/qwanyx/production/    - Production code"
echo "  /opt/qwanyx/services/      - Service management"
echo "  /opt/qwanyx/data/          - Persistent data"
echo "  /opt/qwanyx/backup/        - Old structure backup"
echo ""
echo "Services running:"
echo "  Port 3002 - Autodin Next.js"
echo "  Port 5002 - QWANYX API"
echo "  Port 9999 - GitHub Webhook"
echo ""
echo "To deploy updates:"
echo "  Automatic: git push (webhook will handle it)"
echo "  Manual: /opt/qwanyx/services/deploy.sh"
echo ""
echo "Old structure backed up at: $BACKUP_DIR"
echo "(Can be deleted after verifying everything works)"
echo ""