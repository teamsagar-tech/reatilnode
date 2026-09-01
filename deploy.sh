#!/bin/bash

# Configuration
SERVER="95.135.166.109"
USER="root"
PASSWORD="H-ABvSGw93024Lrs"
REMOTE_DIR="/var/www/RetailNodeV2"

echo "=========================================="
echo "    🚀 RETAILNODE DEPLOYMENT SCRIPT       "
echo "=========================================="

# 1. Build FrontEnd
echo "📦 Building FrontEnd (V1)..."
cd FrontEnd
# Temporarily use production env
echo "VITE_API_URL=https://api.retailnode.in" > .env.production
npm run build
if [ $? -ne 0 ]; then
  echo "❌ FrontEnd build failed!"
  exit 1
fi
cd ..

# 2. Build FrontEndV2
echo "📦 Building FrontEndV2..."
cd FrontEndV2
# Temporarily use production env
echo "VITE_API_URL=https://api.retailnode.in" > .env.production
npx vite build
if [ $? -ne 0 ]; then
  echo "❌ FrontEndV2 build failed!"
  exit 1
fi
cd ..

# 3. Rsync to Server
echo "🚀 Deploying to $SERVER..."

echo "-> Syncing Backend..."
sshpass -p "$PASSWORD" rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'logs' --exclude '.env' backend $USER@$SERVER:$REMOTE_DIR/

echo "-> Syncing FrontEnd (V1)..."
sshpass -p "$PASSWORD" rsync -avz FrontEnd/dist/ $USER@$SERVER:$REMOTE_DIR/FrontEnd/

echo "-> Syncing FrontEndV2..."
sshpass -p "$PASSWORD" rsync -avz FrontEndV2/dist/ $USER@$SERVER:$REMOTE_DIR/FrontEndV2/

# 4. Restart Backend on Server
echo "🔄 Restarting Backend on Server..."
sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $USER@$SERVER "cd $REMOTE_DIR/backend && npm install && pm2 restart retailnode-api"

echo "✅ Deployment Successful!"
echo "=========================================="
