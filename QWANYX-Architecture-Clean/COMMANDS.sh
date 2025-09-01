#!/bin/bash
# QWANYX SMART DEPLOYMENT SCRIPT
# Optimized for speed - only rebuilds what changed
# Expected time: 1-3 minutes (5 max if SPU changes)

echo "🚀 QWANYX SMART DEPLOYMENT"
echo "=========================================="
echo "Date: $(date)"
echo ""

# Configuration
REPO_DIR="/opt/qwanyx/apps/qwanyx-server/QWANYX-Architecture-Clean"
SPU_DIR="$REPO_DIR/qwanyx-brain/spu-core"
AUTODIN_DIR="$REPO_DIR/apps/autodin"

# Navigate to repository
cd "$REPO_DIR" || exit 1

# ========== GIT OPERATIONS ==========
echo "📥 PULLING LATEST CHANGES"
echo "--------------------------------------------"

# Store current commit hash
OLD_COMMIT=$(git rev-parse HEAD)

# Pull latest changes
git pull origin main
if [ $? -ne 0 ]; then
    echo "❌ Git pull failed!"
    exit 1
fi

# Get new commit hash
NEW_COMMIT=$(git rev-parse HEAD)

# Check if anything changed
if [ "$OLD_COMMIT" = "$NEW_COMMIT" ]; then
    echo "✅ No changes detected - deployment skipped"
    exit 0
fi

echo "✅ Changes pulled successfully"

# Detect what changed
PACKAGES_CHANGED=$(git diff --name-only "$OLD_COMMIT" "$NEW_COMMIT" | grep "^packages/" | wc -l)
SPU_CHANGED=$(git diff --name-only "$OLD_COMMIT" "$NEW_COMMIT" | grep "^qwanyx-brain/spu-core/" | wc -l)
AUTODIN_CHANGED=$(git diff --name-only "$OLD_COMMIT" "$NEW_COMMIT" | grep "^apps/autodin/" | wc -l)

echo ""
echo "📊 CHANGE DETECTION"
echo "--------------------------------------------"
echo "Packages changed: $PACKAGES_CHANGED files"
echo "SPU changed: $SPU_CHANGED files"
echo "Autodin changed: $AUTODIN_CHANGED files"
echo ""

# ========== MONOREPO DEPENDENCIES ==========
# Always check if package.json changed at root
if git diff --name-only "$OLD_COMMIT" "$NEW_COMMIT" | grep -q "^package.json$"; then
    echo "📦 Root package.json changed - installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
fi

# ========== BUILD PACKAGES (if changed) ==========
if [ $PACKAGES_CHANGED -gt 0 ]; then
    echo ""
    echo "📦 BUILDING PACKAGES"
    echo "--------------------------------------------"
    
    # Turbo will only rebuild what actually changed
    npx turbo run build --filter='./packages/*'
    
    if [ $? -eq 0 ]; then
        echo "✅ Packages built successfully"
    else
        echo "❌ Package build failed!"
        exit 1
    fi
else
    echo "✅ No package changes - skipping package build"
fi

# ========== BUILD AUTODIN (if packages or app changed) ==========
if [ $PACKAGES_CHANGED -gt 0 ] || [ $AUTODIN_CHANGED -gt 0 ]; then
    echo ""
    echo "🚗 BUILDING AUTODIN APP"
    echo "--------------------------------------------"
    
    cd "$AUTODIN_DIR"
    
    # Try production build first
    npm run build
    BUILD_RESULT=$?
    
    if [ $BUILD_RESULT -eq 0 ]; then
        echo "✅ Autodin production build successful"
        
        # Restart with production build
        pm2 stop autodin-next 2>/dev/null || true
        pm2 delete autodin-next 2>/dev/null || true
        PORT=3002 pm2 start npm --name "autodin-next" -- start
    else
        echo "⚠️ Production build failed, using dev mode"
        
        # Restart in dev mode
        pm2 stop autodin-next 2>/dev/null || true
        pm2 delete autodin-next 2>/dev/null || true
        PORT=3002 pm2 start "npm run dev" --name "autodin-next"
    fi
    
    pm2 save
    echo "✅ Autodin restarted"
else
    echo "✅ No Autodin changes - service continues running"
fi

# ========== BUILD SPU BACKEND (if changed) ==========
if [ $SPU_CHANGED -gt 0 ]; then
    echo ""
    echo "🦀 BUILDING SPU BACKEND"
    echo "--------------------------------------------"
    
    cd "$SPU_DIR"
    
    # Load Rust environment
    source /root/.cargo/env
    
    echo "🔨 Building SPU Core..."
    cargo build --release
    
    if [ $? -eq 0 ]; then
        echo "✅ SPU build successful"
        
        # Restart SPU with PM2
        pm2 stop spu-core 2>/dev/null || true
        pm2 delete spu-core 2>/dev/null || true
        
        cd "$SPU_DIR"
        MONGODB_URI='mongodb://qwanyx:Iwb35TnYj#Vf@localhost:27017/?authSource=admin' \
        pm2 start ./target/release/spu-core --name "spu-core"
        
        pm2 save
        echo "✅ SPU restarted"
    else
        echo "❌ SPU build failed!"
        exit 1
    fi
else
    echo "✅ No SPU changes - backend continues running"
fi

# ========== HEALTH CHECKS ==========
echo ""
echo "🔍 VERIFYING SERVICES"
echo "--------------------------------------------"

# Wait for services to stabilize
sleep 5

# Check service status
AUTODIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002)
SPU_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5002/health)

echo "Autodin Next.js (3002): $AUTODIN_STATUS"
echo "SPU Core (5002): $SPU_STATUS"

# Verify both are running
if [ "$AUTODIN_STATUS" != "200" ] || [ "$SPU_STATUS" != "200" ]; then
    echo ""
    echo "❌ DEPLOYMENT VERIFICATION FAILED"
    echo "Check logs with:"
    echo "  pm2 logs autodin-next"
    echo "  pm2 logs spu-core"
    exit 1
fi

# ========== SUCCESS ==========
echo ""
echo "🎉 DEPLOYMENT SUCCESSFUL"
echo "=========================================="
echo ""
echo "📊 Deployment Stats:"
echo "  - Previous commit: ${OLD_COMMIT:0:7}"
echo "  - New commit: ${NEW_COMMIT:0:7}"
echo "  - Files changed: $(git diff --name-only "$OLD_COMMIT" "$NEW_COMMIT" | wc -l)"
echo "  - Deployment time: $SECONDS seconds"
echo ""
echo "🌐 Services Running:"
echo "  - Autodin: http://135.181.72.183:3002"
echo "  - SPU Backend: http://135.181.72.183:5002"
echo ""
echo "📝 PM2 Status:"
pm2 list
echo ""
echo "=========================================="
date