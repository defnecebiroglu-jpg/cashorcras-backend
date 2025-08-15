// BULLETPROOF Railway server
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚂 RAILWAY SERVER STARTING...');
console.log('PORT:', PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PWD:', process.cwd());

// Basic middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// CORS headers for Railway
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Health check (CRITICAL)
app.get('/health', (req, res) => {
  console.log('🔍 Health check accessed');
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    port: PORT,
    platform: 'railway',
    uptime: process.uptime()
  });
});

// Simple API endpoints
const companies = [
  { id: 1, name: 'ASELS', buyPrice: 95.5, sellPrice: 93.5 },
  { id: 2, name: 'THYAO', buyPrice: 310.0, sellPrice: 303.0 },
  { id: 3, name: 'BIMAS', buyPrice: 142.8, sellPrice: 139.8 }
];

app.get('/api/companies', (req, res) => {
  console.log('📈 Companies API accessed');
  res.json(companies);
});

app.get('/api/currencies', (req, res) => {
  res.json([
    { id: 1, name: 'USD', buyPrice: 34.25, sellPrice: 34.15 },
    { id: 2, name: 'EUR', buyPrice: 37.10, sellPrice: 36.95 }
  ]);
});

// Test endpoint 
app.get('/test', (req, res) => {
  res.send(`
    <h1>🚂 Railway Server Working!</h1>
    <p>Time: ${new Date().toISOString()}</p>
    <p>Port: ${PORT}</p>
    <p><a href="/health">Health Check</a></p>
    <p><a href="/api/companies">Companies API</a></p>
  `);
});

// Static files - try multiple paths
const possiblePaths = [
  path.join(__dirname, '..', 'dist', 'public'),
  path.join(process.cwd(), 'dist', 'public'),
  '/app/dist/public'
];

let publicPath = null;
for (const tryPath of possiblePaths) {
  if (fs.existsSync(tryPath)) {
    publicPath = tryPath;
    console.log('✅ Found static files at:', publicPath);
    break;
  }
}

if (publicPath) {
  app.use(express.static(publicPath));
  
  // Serve React app
  app.get('*', (req, res) => {
    const indexPath = path.join(publicPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Frontend not built - run npm run build');
    }
  });
} else {
  console.log('❌ No static files found - serving API only');
  app.get('*', (req, res) => {
    res.send(`
      <h1>🚂 Railway Server - API Mode</h1>
      <p>Static files not found, but server is running!</p>
      <p><a href="/health">Health Check</a></p>
      <p><a href="/api/companies">Test API</a></p>
    `);
  });
}

// Error handling
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled Rejection:', reason);
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚂 Railway server READY on 0.0.0.0:${PORT}`);
  console.log(`📍 Health: http://0.0.0.0:${PORT}/health`);
  console.log(`🧪 Test: http://0.0.0.0:${PORT}/test`);
});

server.on('error', (err) => {
  console.error('💥 Server error:', err);
});

// Keep alive
setInterval(() => {
  console.log(`💓 Server alive - uptime: ${Math.floor(process.uptime())}s`);
}, 30000);