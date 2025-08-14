# Deployment Error Fixes - Cash or Crash

## ❌ Render Error: "Cannot find module '/opt/render/project/src/dist/index.js'"

**Problem**: Render looking in wrong path for compiled server file.

**Solution**:
1. Use **Manual Configuration** instead of render.yaml
2. Set these exact values:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/index.js` (NOT npm start)
   - **Environment**: Node
   - **Root Directory**: Leave empty

## ❌ Railway Error: "process did not complete successfully: exit code: 127"

**Problem**: npm command not found or build environment issue.

**Solution**:
1. **Remove config files** temporarily:
   - Delete `railway.json` 
   - Delete `nixpacks.toml`
2. Let Railway **auto-detect** the build process
3. After deployment, go to Settings:
   - **Start Command**: `node dist/index.js`
4. **Redeploy** the service

## ✅ Working Manual Configuration

### Render Settings
```
Build Command: npm install && npm run build
Start Command: node dist/index.js
Environment Variables:
- NODE_ENV=production
- SESSION_SECRET=your-random-secret-key
```

### Railway Settings  
```
Build Command: (auto-detected)
Start Command: node dist/index.js
Environment Variables:
- NODE_ENV=production
- SESSION_SECRET=your-random-secret-key
```

## 🔧 Local Testing

Test build locally first:
```bash
npm install
npm run build
node dist/index.js
```

Should see: `serving on port 5000`

## 🚨 Common Issues

1. **Build fails**: Check Node.js version >= 18
2. **Path errors**: Always use `node dist/index.js` (not npm start)
3. **Dependencies**: Use `npm install` (not npm ci in production)
4. **Environment**: Set `NODE_ENV=production`

## 📞 If Still Not Working

1. Try **Docker deployment** with provided Dockerfile
2. Check platform logs for specific error messages
3. Use simple HTML deployment first to test platform connection
4. Contact platform support with error logs

Both platforms work with Node.js apps - the key is correct build/start commands!