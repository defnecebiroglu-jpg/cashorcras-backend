// RENDER ULTRA-OPTIMIZED SERVER - Production Ready
const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

console.log('🚀 RENDER OPTIMIZED SERVER STARTING');
console.log('Port:', PORT, 'Environment:', process.env.NODE_ENV);

// Trust proxy for Render
app.set('trust proxy', 1);

// Basic middleware with increased limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Optimized session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'cash-or-crash-2024-secret',
  resave: false,
  saveUninitialized: false,
  name: 'cashcrash.sid',
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// Enhanced CORS for Render deployment
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, Pragma');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Request logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Static files detection
const possiblePaths = [
  path.join(__dirname, '..', 'dist', 'public'),
  path.join(process.cwd(), 'dist', 'public'),
  '/app/dist/public'
];

let publicPath = null;
for (const tryPath of possiblePaths) {
  if (fs.existsSync(tryPath)) {
    publicPath = tryPath;
    console.log('✅ React build found:', publicPath);
    break;
  }
}

if (publicPath) {
  app.use(express.static(publicPath, {
    maxAge: process.env.NODE_ENV === 'production' ? '1d' : '0',
    etag: false
  }));
}

// Comprehensive sample data
const data = {
  companies: [
    { id: 1, name: 'ASELS', buyPrice: 95.50, sellPrice: 93.50 },
    { id: 2, name: 'THYAO', buyPrice: 310.00, sellPrice: 303.00 },
    { id: 3, name: 'BIMAS', buyPrice: 142.80, sellPrice: 139.80 },
    { id: 4, name: 'AKBNK', buyPrice: 45.20, sellPrice: 44.30 },
    { id: 5, name: 'GARAN', buyPrice: 78.90, sellPrice: 77.20 },
    { id: 6, name: 'ISCTR', buyPrice: 12.34, sellPrice: 12.15 },
    { id: 7, name: 'KRDMD', buyPrice: 23.67, sellPrice: 23.20 },
    { id: 8, name: 'SAHOL', buyPrice: 67.89, sellPrice: 66.50 }
  ],
  currencies: [
    { id: 1, name: 'USD', buyPrice: 34.25, sellPrice: 34.15 },
    { id: 2, name: 'EUR', buyPrice: 37.10, sellPrice: 36.95 },
    { id: 3, name: 'GBP', buyPrice: 43.50, sellPrice: 43.30 },
    { id: 4, name: 'CHF', buyPrice: 38.90, sellPrice: 38.70 }
  ],
  startups: [
    { id: 1, name: 'TechCorp', buyPrice: 250.00, sellPrice: 245.00 },
    { id: 2, name: 'GreenTech', buyPrice: 180.00, sellPrice: 176.00 },
    { id: 3, name: 'FinanceAI', buyPrice: 420.00, sellPrice: 410.00 },
    { id: 4, name: 'HealthTech', buyPrice: 320.00, sellPrice: 315.00 }
  ],
  teams: [{
    id: 1, 
    name: 'Takım 1', 
    accessCode: '00012024', 
    cash: 100000,
    companies: [
      { companyId: 1, quantity: 10 },
      { companyId: 2, quantity: 5 }
    ],
    currencies: [
      { currencyId: 1, quantity: 1000 }
    ],
    startups: [
      { startupId: 1, quantity: 3 }
    ]
  }]
};

// Health check with comprehensive info
app.get('/health', (req, res) => {
  const memUsage = process.memoryUsage();
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    port: PORT,
    platform: 'render',
    uptime: Math.floor(process.uptime()),
    memory: {
      rss: Math.round(memUsage.rss / 1024 / 1024),
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024)
    },
    node: process.version,
    reactBuild: publicPath ? 'found' : 'not_found',
    env: process.env.NODE_ENV,
    sessionCount: Object.keys(req.sessionStore.sessions || {}).length
  });
});

// API Routes with error handling
app.get('/api/companies', (req, res) => {
  try {
    console.log('📈 Companies API accessed');
    res.json(data.companies);
  } catch (error) {
    console.error('Companies API error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/currencies', (req, res) => {
  try {
    console.log('💱 Currencies API accessed');
    res.json(data.currencies);
  } catch (error) {
    console.error('Currencies API error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/startups', (req, res) => {
  try {
    console.log('🚀 Startups API accessed');
    res.json(data.startups);
  } catch (error) {
    console.error('Startups API error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Enhanced team authentication
app.post('/api/teams/login', (req, res) => {
  try {
    console.log('🔐 Team login request received');
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('Session ID:', req.sessionID);
    
    if (!req.body || typeof req.body.accessCode === 'undefined') {
      console.log('❌ No access code provided');
      return res.status(400).json({ 
        error: 'Erişim kodu gerekli',
        debug: { bodyReceived: !!req.body, accessCode: req.body?.accessCode }
      });
    }
    
    const accessCode = String(req.body.accessCode).trim();
    console.log('🔍 Checking access code:', accessCode);
    
    const team = data.teams.find(t => t.accessCode === accessCode);
    if (!team) {
      console.log('❌ Invalid access code:', accessCode);
      return res.status(401).json({ 
        error: 'Geçersiz erişim kodu',
        debug: { providedCode: accessCode, availableCodes: data.teams.map(t => t.accessCode) }
      });
    }
    
    req.session.teamId = team.id;
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ error: 'Session error' });
      }
      
      console.log('✅ Team login successful:', team.name, 'Session ID:', req.sessionID);
      res.json({
        ...team,
        sessionId: req.sessionID,
        debug: { sessionSaved: true }
      });
    });
  } catch (error) {
    console.error('Team login error:', error);
    res.status(500).json({ 
      error: 'Server error',
      debug: { error: error.message }
    });
  }
});

app.get('/api/teams/me', (req, res) => {
  try {
    console.log('👤 Team info request, Session ID:', req.sessionID);
    console.log('Team ID in session:', req.session?.teamId);
    
    if (!req.session?.teamId) {
      return res.status(401).json({ 
        error: 'Giriş yapılmamış',
        debug: { sessionId: req.sessionID, hasSession: !!req.session }
      });
    }
    
    const team = data.teams.find(t => t.id === req.session.teamId);
    if (!team) {
      return res.status(404).json({ 
        error: 'Takım bulunamadı',
        debug: { teamId: req.session.teamId }
      });
    }
    
    res.json(team);
  } catch (error) {
    console.error('Team info error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Enhanced admin authentication
app.post('/api/admin/login', (req, res) => {
  try {
    console.log('👨‍💼 Admin login request');
    console.log('Body:', JSON.stringify(req.body, null, 2));
    
    if (!req.body || typeof req.body.password === 'undefined') {
      return res.status(400).json({ 
        error: 'Şifre gerekli',
        debug: { bodyReceived: !!req.body }
      });
    }
    
    const password = String(req.body.password).trim();
    
    if (password !== 'admin123') {
      console.log('❌ Invalid admin password');
      return res.status(401).json({ error: 'Geçersiz şifre' });
    }
    
    req.session.isAdmin = true;
    req.session.save((err) => {
      if (err) {
        console.error('Admin session save error:', err);
        return res.status(500).json({ error: 'Session error' });
      }
      
      console.log('✅ Admin login successful');
      res.json({ 
        success: true,
        sessionId: req.sessionID
      });
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Test endpoint with detailed info
app.get('/test', (req, res) => {
  const memUsage = process.memoryUsage();
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Cash or Crash - Test Page</title>
      <style>
        body { font-family: Arial; background: #1B1B1B; color: #E3DFD6; padding: 20px; }
        h1 { color: #cae304e6; }
        .info { background: #333; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .success { color: #00d4aa; }
        .warning { color: #ff9800; }
        a { color: #00d4aa; margin: 0 10px; }
        .test-btn { 
          background: #00d4aa; color: #000; padding: 10px 15px; 
          border: none; border-radius: 5px; margin: 5px; cursor: pointer; 
        }
      </style>
    </head>
    <body>
      <h1>✅ RENDER SERVER TEST</h1>
      
      <div class="info">
        <h3>Server Status:</h3>
        <p><strong>Platform:</strong> Render.com</p>
        <p><strong>Port:</strong> ${PORT}</p>
        <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
        <p><strong>Uptime:</strong> ${Math.floor(process.uptime())}s</p>
        <p><strong>Memory:</strong> ${Math.round(memUsage.rss/1024/1024)}MB</p>
        <p><strong>React Build:</strong> ${publicPath ? '✅ Found' : '❌ Not Found'}</p>
        <p><strong>Session Store:</strong> ${req.sessionStore ? '✅ Active' : '❌ Missing'}</p>
      </div>
      
      <div class="info">
        <h3>API Test Links:</h3>
        <p>
          <a href="/health" target="_blank">Health Check</a>
          <a href="/api/companies" target="_blank">Companies</a>
          <a href="/api/currencies" target="_blank">Currencies</a>
          <a href="/api/startups" target="_blank">Startups</a>
        </p>
      </div>
      
      <div class="info">
        <h3>Authentication Test:</h3>
        <button class="test-btn" onclick="testTeamLogin()">Test Team Login</button>
        <button class="test-btn" onclick="testAdminLogin()">Test Admin Login</button>
        <div id="test-results"></div>
      </div>
      
      <div class="info">
        <h3>Access Info:</h3>
        <p><strong>Team Code:</strong> 00012024</p>
        <p><strong>Admin Password:</strong> admin123</p>
      </div>
      
      <script>
        async function testTeamLogin() {
          const result = document.getElementById('test-results');
          try {
            const response = await fetch('/api/teams/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ accessCode: '00012024' })
            });
            const data = await response.json();
            result.innerHTML = '<p class="success">Team Login: ' + (response.ok ? '✅ SUCCESS' : '❌ FAILED') + '</p><pre>' + JSON.stringify(data, null, 2) + '</pre>';
          } catch (error) {
            result.innerHTML = '<p class="warning">Team Login Error: ' + error.message + '</p>';
          }
        }
        
        async function testAdminLogin() {
          const result = document.getElementById('test-results');
          try {
            const response = await fetch('/api/admin/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ password: 'admin123' })
            });
            const data = await response.json();
            result.innerHTML = '<p class="success">Admin Login: ' + (response.ok ? '✅ SUCCESS' : '❌ FAILED') + '</p><pre>' + JSON.stringify(data, null, 2) + '</pre>';
          } catch (error) {
            result.innerHTML = '<p class="warning">Admin Login Error: ' + error.message + '</p>';
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  if (publicPath) {
    const indexFile = path.join(publicPath, 'index.html');
    if (fs.existsSync(indexFile)) {
      res.sendFile(indexFile, (err) => {
        if (err) {
          console.error('Error serving React app:', err);
          res.status(500).send('Error loading application');
        }
      });
    } else {
      res.status(404).send(`
        <h1>Build Error</h1>
        <p>React build files not found</p>
        <p><a href="/test">Test Page</a> | <a href="/health">Health Check</a></p>
      `);
    }
  } else {
    // Serve fallback page
    res.redirect('/test');
  }
});

// Enhanced error handling
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled Rejection:', reason);
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ RENDER OPTIMIZED SERVER READY on 0.0.0.0:${PORT}`);
  console.log(`📍 Health: https://yourapp.onrender.com/health`);
  console.log(`🧪 Test: https://yourapp.onrender.com/test`);
  console.log(`🎯 App: https://yourapp.onrender.com/`);
});

server.on('error', (err) => {
  console.error('💥 Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is busy, server will retry...`);
  }
});

// Keep alive system
let pingCount = 0;
setInterval(() => {
  const memUsage = process.memoryUsage();
  console.log(`💓 Server heartbeat ${++pingCount} - uptime: ${Math.floor(process.uptime())}s, memory: ${Math.round(memUsage.rss/1024/1024)}MB`);
}, 120000);

// Anti-sleep ping for Render
if (process.env.NODE_ENV === 'production') {
  const https = require('https');
  
  setInterval(() => {
    const hostname = process.env.RENDER_EXTERNAL_URL 
      ? process.env.RENDER_EXTERNAL_URL.replace('https://', '')
      : 'cashcrash.onrender.com';
    
    const req = https.request({
      hostname,
      path: '/health',
      method: 'GET',
      timeout: 5000
    }, (res) => {
      console.log(`🏓 Anti-sleep ping: ${res.statusCode === 200 ? 'OK' : 'FAIL'}`);
    });
    
    req.on('error', (err) => {
      console.log('🏓 Anti-sleep ping error:', err.code);
    });
    
    req.on('timeout', () => {
      console.log('🏓 Anti-sleep ping timeout');
      req.destroy();
    });
    
    req.end();
  }, 600000); // Every 10 minutes
}