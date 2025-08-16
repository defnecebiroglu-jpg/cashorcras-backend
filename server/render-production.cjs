// RENDER PRODUCTION - Exact Replit Clone
const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

console.log(`[express] starting server on port ${PORT}`);
console.log(`[express] environment: ${process.env.NODE_ENV || 'development'}`);

// Trust proxy for Render
app.set('trust proxy', 1);

// Middleware exactly like Replit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Session configuration matching Replit
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'cash-or-crash-secret-key',
  resave: false,
  saveUninitialized: false,
  name: 'cash-crash.sid',
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
};

app.use(session(sessionConfig));
console.log(`[express] session config: secure=${sessionConfig.cookie.secure}, sameSite=${sessionConfig.cookie.sameSite}`);

// CORS headers for cross-origin requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Request logging like Replit
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[express] ${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
  });
  next();
});

// Static files - serve React build
const possiblePaths = [
  path.join(__dirname, '..', 'dist', 'public'),
  path.join(process.cwd(), 'dist', 'public'),
  '/app/dist/public'
];

let publicPath = null;
for (const tryPath of possiblePaths) {
  if (fs.existsSync(tryPath)) {
    publicPath = tryPath;
    console.log(`[express] serving static files from: ${publicPath}`);
    break;
  }
}

if (publicPath) {
  app.use(express.static(publicPath, {
    maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
    etag: false
  }));
}

// In-memory storage - exact copy from Replit
const storage = {
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
  teams: [
    {
      id: 1,
      name: '1 Takımı',
      accessCode: '00012024',
      cashBalance: '100000.00',
      companies: [{ companyId: 1, quantity: 10 }, { companyId: 2, quantity: 5 }],
      currencies: [{ currencyId: 1, quantity: 1000 }],
      startups: [{ startupId: 1, quantity: 3 }]
    },
    {
      id: 2,
      name: '2 Takımı',
      accessCode: '00022024',
      cashBalance: '95000.00',
      companies: [],
      currencies: [],
      startups: []
    },
    {
      id: 3,
      name: '3 Takımı',
      accessCode: '00032024',
      cashBalance: '105000.00',
      companies: [],
      currencies: [],
      startups: []
    },
    {
      id: 4,
      name: '4 Takımı',
      accessCode: '00042024',
      cashBalance: '98000.00',
      companies: [],
      currencies: [],
      startups: []
    },
    {
      id: 5,
      name: '5 Takımı',
      accessCode: '00052024',
      cashBalance: '102000.00',
      companies: [],
      currencies: [],
      startups: []
    },
    {
      id: 6,
      name: '6 Takımı',
      accessCode: '00062024',
      cashBalance: '97000.00',
      companies: [],
      currencies: [],
      startups: []
    },
    {
      id: 7,
      name: '7 Takımı',
      accessCode: '00072024',
      cashBalance: '103000.00',
      companies: [],
      currencies: [],
      startups: []
    },
    {
      id: 8,
      name: '8 Takımı',
      accessCode: '00082024',
      cashBalance: '99000.00',
      companies: [],
      currencies: [],
      startups: []
    },
    {
      id: 9,
      name: '9 Takımı',
      accessCode: '00092024',
      cashBalance: '101000.00',
      companies: [],
      currencies: [],
      startups: []
    },
    {
      id: 10,
      name: '10 Takımı',
      accessCode: '00102024',
      cashBalance: '96000.00',
      companies: [],
      currencies: [],
      startups: []
    }
  ]
};

// API Routes - Exact Replit Implementation

// Companies API
app.get('/api/companies', (req, res) => {
  res.json(storage.companies);
});

app.patch('/api/companies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const company = storage.companies.find(c => c.id === id);
  if (!company) return res.status(404).json({ error: 'Company not found' });
  
  if (req.body.buyPrice !== undefined) {
    company.buyPrice = parseFloat(req.body.buyPrice);
    company.sellPrice = company.buyPrice * 0.98; // 2% spread
  }
  if (req.body.sellPrice !== undefined) {
    company.sellPrice = parseFloat(req.body.sellPrice);
  }
  
  res.json(company);
});

// Currencies API
app.get('/api/currencies', (req, res) => {
  res.json(storage.currencies);
});

app.patch('/api/currencies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const currency = storage.currencies.find(c => c.id === id);
  if (!currency) return res.status(404).json({ error: 'Currency not found' });
  
  if (req.body.buyPrice !== undefined) {
    currency.buyPrice = parseFloat(req.body.buyPrice);
    currency.sellPrice = currency.buyPrice * 0.98; // 2% spread
  }
  if (req.body.sellPrice !== undefined) {
    currency.sellPrice = parseFloat(req.body.sellPrice);
  }
  
  res.json(currency);
});

// Startups API
app.get('/api/startups', (req, res) => {
  res.json(storage.startups);
});

app.patch('/api/startups/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const startup = storage.startups.find(s => s.id === id);
  if (!startup) return res.status(404).json({ error: 'Startup not found' });
  
  if (req.body.buyPrice !== undefined) {
    startup.buyPrice = parseFloat(req.body.buyPrice);
    startup.sellPrice = startup.buyPrice * 0.98; // 2% spread
  }
  if (req.body.sellPrice !== undefined) {
    startup.sellPrice = parseFloat(req.body.sellPrice);
  }
  
  res.json(startup);
});

// Teams API
app.get('/api/teams', (req, res) => {
  res.json(storage.teams);
});

app.get('/api/teams/:id/portfolio', (req, res) => {
  const id = parseInt(req.params.id);
  const team = storage.teams.find(t => t.id === id);
  if (!team) return res.status(404).json({ error: 'Team not found' });
  
  // Calculate portfolio values
  let totalCompanyValue = 0;
  const companyHoldings = team.companies.map(holding => {
    const company = storage.companies.find(c => c.id === holding.companyId);
    const value = company ? holding.quantity * company.sellPrice : 0;
    totalCompanyValue += value;
    return {
      ...holding,
      company: company,
      currentValue: value
    };
  });
  
  let totalCurrencyValue = 0;
  const currencyHoldings = team.currencies.map(holding => {
    const currency = storage.currencies.find(c => c.id === holding.currencyId);
    const value = currency ? holding.quantity * currency.sellPrice : 0;
    totalCurrencyValue += value;
    return {
      ...holding,
      currency: currency,
      currentValue: value
    };
  });
  
  let totalStartupValue = 0;
  const startupHoldings = team.startups.map(holding => {
    const startup = storage.startups.find(s => s.id === holding.startupId);
    const value = startup ? holding.quantity * startup.sellPrice : 0;
    totalStartupValue += value;
    return {
      ...holding,
      startup: startup,
      currentValue: value
    };
  });
  
  const totalPortfolioValue = parseFloat(team.cashBalance) + totalCompanyValue + totalCurrencyValue + totalStartupValue;
  
  res.json({
    team: team,
    companies: companyHoldings,
    currencies: currencyHoldings,
    startups: startupHoldings,
    totalValue: totalPortfolioValue,
    breakdown: {
      cash: parseFloat(team.cashBalance),
      companies: totalCompanyValue,
      currencies: totalCurrencyValue,
      startups: totalStartupValue
    }
  });
});

// Team Authentication
app.post('/api/teams/login', (req, res) => {
  const { accessCode } = req.body;
  if (!accessCode) {
    return res.status(400).json({ error: 'Erişim kodu gerekli' });
  }
  
  const team = storage.teams.find(t => t.accessCode === accessCode);
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
  
  const team = storage.teams.find(t => t.id === req.session.teamId);
  if (!team) {
    return res.status(404).json({ error: 'Takım bulunamadı' });
  }
  
  res.json(team);
});

// Admin Authentication
app.post('/api/auth/admin', (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Şifre gerekli' });
  }
  
  if (password !== 'admin123') {
    return res.status(401).json({ error: 'Geçersiz şifre' });
  }
  
  req.session.isAdmin = true;
  res.json({ success: true });
});

app.get('/api/auth/admin/check', (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(401).json({ error: 'Admin girişi gerekli' });
  }
  res.json({ isAdmin: true });
});

// Bulk price update
app.post('/api/bulk-update', (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(401).json({ error: 'Admin girişi gerekli' });
  }
  
  try {
    const { companies, currencies, startups } = req.body;
    let updated = 0;
    
    if (companies) {
      companies.forEach(update => {
        const company = storage.companies.find(c => c.name === update.name);
        if (company && update.buyPrice && update.sellPrice) {
          company.buyPrice = parseFloat(update.buyPrice);
          company.sellPrice = parseFloat(update.sellPrice);
          updated++;
        }
      });
    }
    
    if (currencies) {
      currencies.forEach(update => {
        const currency = storage.currencies.find(c => c.name === update.name);
        if (currency && update.buyPrice && update.sellPrice) {
          currency.buyPrice = parseFloat(update.buyPrice);
          currency.sellPrice = parseFloat(update.sellPrice);
          updated++;
        }
      });
    }
    
    if (startups) {
      startups.forEach(update => {
        const startup = storage.startups.find(s => s.name === update.name);
        if (startup && update.buyPrice && update.sellPrice) {
          startup.buyPrice = parseFloat(update.buyPrice);
          startup.sellPrice = parseFloat(update.sellPrice);
          updated++;
        }
      });
    }
    
    res.json({ success: true, updated });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ error: 'Bulk update failed' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    port: PORT,
    platform: 'render',
    uptime: Math.floor(process.uptime()),
    memory: Math.round(process.memoryUsage().rss / 1024 / 1024),
    teams: storage.teams.length,
    companies: storage.companies.length
  });
});

// Serve React app
app.get('*', (req, res) => {
  if (publicPath) {
    const indexPath = path.join(publicPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('React build not found');
    }
  } else {
    res.send(`
      <h1>Cash or Crash</h1>
      <p>Server running on port ${PORT}</p>
      <p><a href="/health">Health Check</a></p>
      <p>React build not found - run: npm run build</p>
    `);
  }
});

// Error handling
process.on('uncaughtException', (err) => {
  console.error('[express] uncaught exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('[express] unhandled rejection:', err);
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[express] serving on 0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  const isProduction = process.env.NODE_ENV === 'production';
  console.log(`[express] deployment: replit=false, railway=false, production-mode=${isProduction}`);
});

server.on('error', (err) => {
  console.error('[express] server error:', err);
});

// Keep alive for Render
setInterval(() => {
  const memUsage = process.memoryUsage();
  console.log(`[express] heartbeat - uptime: ${Math.floor(process.uptime())}s, memory: ${Math.round(memUsage.rss/1024/1024)}MB`);
}, 120000);

// Anti-sleep ping for Render free tier
if (process.env.NODE_ENV === 'production') {
  const https = require('https');
  
  setInterval(() => {
    https.get(`https://${process.env.RENDER_EXTERNAL_URL || 'cashcrash.onrender.com'}/health`, (res) => {
      console.log('[express] anti-sleep ping:', res.statusCode === 200 ? 'OK' : 'FAIL');
    }).on('error', (err) => {
      console.log('[express] anti-sleep ping error:', err.code);
    });
  }, 600000); // 10 minutes
}