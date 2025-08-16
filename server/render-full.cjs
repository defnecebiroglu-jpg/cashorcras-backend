// RENDER FULL SERVER - Complete Cash or Crash Application
const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

console.log('🚀 RENDER FULL SERVER STARTING on port:', PORT);
console.log('Environment:', process.env.NODE_ENV || 'development');

// Basic middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// Session middleware  
app.use(session({
  secret: process.env.SESSION_SECRET || 'render-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Static files - serve React app
const publicPaths = [
  path.join(__dirname, '..', 'dist', 'public'),
  path.join(process.cwd(), 'dist', 'public'),
  '/app/dist/public'
];

let publicPath = null;
for (const tryPath of publicPaths) {
  if (fs.existsSync(tryPath)) {
    publicPath = tryPath;
    console.log('✅ Found React build at:', publicPath);
    break;
  }
}

if (publicPath) {
  app.use(express.static(publicPath));
} else {
  console.log('❌ React build not found - API only mode');
}

// Sample data for Turkish entrepreneurship simulation
const data = {
  companies: [
    { id: 1, name: 'ASELS', buyPrice: 95.50, sellPrice: 93.50 },
    { id: 2, name: 'THYAO', buyPrice: 310.00, sellPrice: 303.00 },
    { id: 3, name: 'BIMAS', buyPrice: 142.80, sellPrice: 139.80 },
    { id: 4, name: 'AKBNK', buyPrice: 45.20, sellPrice: 44.30 },
    { id: 5, name: 'GARAN', buyPrice: 78.90, sellPrice: 77.20 }
  ],
  currencies: [
    { id: 1, name: 'USD', buyPrice: 34.25, sellPrice: 34.15 },
    { id: 2, name: 'EUR', buyPrice: 37.10, sellPrice: 36.95 },
    { id: 3, name: 'GBP', buyPrice: 43.50, sellPrice: 43.30 }
  ],
  startups: [
    { id: 1, name: 'TechCorp', buyPrice: 250.00, sellPrice: 245.00 },
    { id: 2, name: 'GreenTech', buyPrice: 180.00, sellPrice: 176.00 },
    { id: 3, name: 'FinanceAI', buyPrice: 420.00, sellPrice: 410.00 }
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

// Health check
app.get('/health', (req, res) => {
  console.log('🔍 Health check accessed');
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    port: PORT,
    platform: 'render',
    uptime: Math.floor(process.uptime()),
    memory: Math.round(process.memoryUsage().rss / 1024 / 1024),
    node: process.version,
    reactBuild: publicPath ? 'found' : 'not found'
  });
});

// API endpoints
app.get('/api/companies', (req, res) => {
  console.log('📈 Companies API accessed');
  res.json(data.companies);
});

app.get('/api/currencies', (req, res) => {
  console.log('💱 Currencies API accessed');
  res.json(data.currencies);
});

app.get('/api/startups', (req, res) => {
  console.log('🚀 Startups API accessed');
  res.json(data.startups);
});

// Team authentication
app.post('/api/teams/login', (req, res) => {
  console.log('🔐 Team login attempt:', req.body.accessCode);
  const team = data.teams.find(t => t.accessCode === req.body.accessCode);
  if (!team) {
    return res.status(401).json({ error: 'Geçersiz erişim kodu' });
  }
  req.session.teamId = team.id;
  res.json(team);
});

app.get('/api/teams/me', (req, res) => {
  if (!req.session.teamId) {
    return res.status(401).json({ error: 'Giriş yapılmamış' });
  }
  const team = data.teams.find(t => t.id === req.session.teamId);
  res.json(team || { error: 'Takım bulunamadı' });
});

// Admin authentication
app.post('/api/admin/login', (req, res) => {
  console.log('👨‍💼 Admin login attempt');
  if (req.body.password !== 'admin123') {
    return res.status(401).json({ error: 'Geçersiz şifre' });
  }
  req.session.isAdmin = true;
  res.json({ success: true });
});

// Test page
app.get('/test', (req, res) => {
  res.send(`
    <html>
    <head>
      <title>Render Test - Cash or Crash</title>
      <style>
        body { font-family: Arial; background: #1B1B1B; color: #E3DFD6; padding: 20px; }
        h1 { color: #cae304e6; }
        .status { color: #00d4aa; }
        a { color: #00d4aa; margin: 0 10px; }
        .info { background: #333; padding: 15px; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <h1>✅ RENDER SERVER WORKING!</h1>
      <div class="info">
        <p><strong>Platform:</strong> Render.com</p>
        <p><strong>Port:</strong> ${PORT}</p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        <p><strong>Uptime:</strong> ${Math.floor(process.uptime())}s</p>
        <p><strong>React Build:</strong> ${publicPath ? 'Found ✅' : 'Not Found ❌'}</p>
      </div>
      
      <h2>🔗 Test Links:</h2>
      <p>
        <a href="/health">Health Check</a>
        <a href="/api/companies">Companies API</a>
        <a href="/api/currencies">Currencies API</a>
        <a href="/api/startups">Startups API</a>
      </p>
      
      <h2>📚 Access Info:</h2>
      <div class="info">
        <p><strong>Team Access Code:</strong> 00012024</p>
        <p><strong>Admin Password:</strong> admin123</p>
      </div>
    </body>
    </html>
  `);
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  console.log('📱 Serving React app for:', req.path);
  
  if (publicPath) {
    const indexFile = path.join(publicPath, 'index.html');
    if (fs.existsSync(indexFile)) {
      res.sendFile(indexFile);
    } else {
      res.status(404).send(`
        <h1>React Build Error</h1>
        <p>index.html not found at: ${indexFile}</p>
        <p><a href="/test">Test Page</a></p>
      `);
    }
  } else {
    // Fallback landing page if React build not found
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Cash or Crash - Entrepreneurship Simulation</title>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; background: #1B1B1B; color: #E3DFD6; margin: 0; padding: 40px; }
          .container { max-width: 1200px; margin: 0 auto; text-align: center; }
          h1 { color: #cae304e6; font-size: 4rem; font-weight: bold; margin: 40px 0; }
          h2 { color: #E3DFD6; font-size: 2rem; margin: 20px 0; }
          .status { background: #333; padding: 20px; border-radius: 10px; margin: 30px 0; }
          .links { margin: 30px 0; }
          .links a { color: #00d4aa; text-decoration: none; margin: 0 15px; font-size: 1.2rem; }
          .links a:hover { text-decoration: underline; }
          .access-info { background: #2a2a2a; padding: 25px; border-radius: 10px; margin: 30px 0; }
          .code { color: #cae304e6; font-weight: bold; font-size: 1.3rem; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>💰 Cash or Crash</h1>
          <h2>Girişimcilik Simülasyon Platformu</h2>
          
          <div class="status">
            <p><strong>Status:</strong> ✅ Server Running on Port ${PORT}</p>
            <p><strong>Time:</strong> ${new Date().toISOString()}</p>
            <p><strong>Platform:</strong> Render.com</p>
          </div>
          
          <div class="links">
            <h3>🔗 Quick Links:</h3>
            <a href="/health">Health Check</a>
            <a href="/test">Server Test</a>
            <a href="/api/companies">Companies API</a>
          </div>
          
          <div class="access-info">
            <h3>📚 Giriş Bilgileri:</h3>
            <p>Team Access Code: <span class="code">00012024</span></p>
            <p>Admin Password: <span class="code">admin123</span></p>
          </div>
          
          <p><em>React frontend build'i bulunmadı - API mode aktif</em></p>
        </div>
      </body>
      </html>
    `);
  }
});

// Error handling
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled Rejection:', reason);
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ RENDER FULL SERVER READY on 0.0.0.0:${PORT}`);
  console.log(`📍 Health: https://cashcrash.onrender.com/health`);
  console.log(`🧪 Test: https://cashcrash.onrender.com/test`);
  console.log(`🎯 Main App: https://cashcrash.onrender.com/`);
});

server.on('error', (err) => {
  console.error('💥 Server error:', err);
});

// Keep alive & memory monitoring
setInterval(() => {
  const memUsage = process.memoryUsage();
  console.log(`💓 Server alive - uptime: ${Math.floor(process.uptime())}s, memory: ${Math.round(memUsage.rss/1024/1024)}MB`);
}, 120000); // Every 2 minutes