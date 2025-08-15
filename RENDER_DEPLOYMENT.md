# Cash or Crash - Render Deployment Guide

## Quick Deploy
1. **Connect Repository**: Link your GitHub repo to Render
2. **Service Type**: Web Service
3. **Build & Start Commands** (copy exactly):

### Environment Variables
```
NODE_ENV=production
SESSION_SECRET=your-super-secret-session-key-here
HOST=0.0.0.0
```

### Build Command
```bash
npm cache clean --force && npm install --omit=dev --no-audit --no-fund && vite build && npx esbuild server/production.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/production.js
```

### Start Command
```bash
node dist/production.js
```

## Alternative: Using render.yaml
1. Add the provided `render.yaml` to your repo root
2. Connect repository to Render
3. Render will auto-detect the configuration

## Features
- ✅ **No import.meta.dirname issues** - Uses production-safe server  
- ✅ **Session management** - Memory store with secure cookies
- ✅ **Static file serving** - Optimized for production
- ✅ **Admin endpoints** - Full functionality enabled
- ✅ **Upload handling** - /tmp/uploads for file storage
- ✅ **Health check** - /health endpoint for monitoring

## Admin Access
- **Team Login**: Use access code "00012024" for Team 1
- **Admin Panel**: Click "Admin Girişi" from team dashboard

## Troubleshooting
- **502 Bad Gateway**: Check logs for PORT/HOST binding issues
- **Session errors**: Verify SESSION_SECRET is set
- **File upload issues**: /tmp/uploads should be writable
- **Build failures**: npm cache clean fixes most dependency issues