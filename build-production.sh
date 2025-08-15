#!/bin/bash
# Production build script for Railway/Render deployment

echo "🔨 Building Cash or Crash for production deployment..."

# Clean previous builds
rm -rf dist/

# Build frontend (static files)
echo "📦 Building frontend..."
npm run build 2>&1 | grep -E "(error|warning|✓)" || true

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

# Build production server (without Vite dependencies)
echo "🚀 Building production server..."
npx esbuild server/production.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --outfile=dist/production.js

if [ $? -ne 0 ]; then
    echo "❌ Production server build failed" 
    exit 1
fi

echo "✅ Production build complete!"
echo "📁 Files created:"
echo "   - dist/public/ (frontend assets)"
echo "   - dist/production.js (production server)"
echo ""
echo "🚀 Ready for Railway/Render deployment!"
echo "   Start command: node dist/production.js"