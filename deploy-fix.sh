#!/bin/bash
# Deployment troubleshooting script for Cash or Crash

echo "🔍 Checking build requirements..."

# Check Node version
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Clean install and build
echo "📦 Installing dependencies..."
rm -rf node_modules package-lock.json
npm install

echo "🏗️ Building application..."
npm run build

# Check build output
echo "📁 Build output:"
ls -la dist/
echo "📄 Built files:"
ls -la dist/public/

# Test production server
echo "🚀 Testing production server..."
echo "Starting server for 5 seconds..."
timeout 5s node dist/index.js &
PID=$!
sleep 2

if kill -0 $PID 2>/dev/null; then
    echo "✅ Production server started successfully"
    kill $PID
else
    echo "❌ Production server failed to start"
fi

echo "🎯 Deployment readiness check complete!"
echo ""
echo "For Render deployment:"
echo "1. Use: buildCommand: npm install && npm run build"
echo "2. Use: startCommand: node dist/index.js" 
echo ""
echo "For Railway deployment:"
echo "1. Remove railway.json and nixpacks.toml temporarily"
echo "2. Let Railway auto-detect the build process"
echo "3. Set start command manually to: node dist/index.js"