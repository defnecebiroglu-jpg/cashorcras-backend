// Production server - Railway compatible (ESM)
import express from 'express';
import session from 'express-session';
import path from 'path';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'cashcrash-railway-' + Date.now(),
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // HTTP for Railway
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  }
}));

// Static files - serve from dist/public  
const publicPath = path.join(__dirname, '..', 'dist', 'public');
app.use(express.static(publicPath));
console.log('Static files serving from:', publicPath);

// In-memory storage
class MemStorage {
  constructor() {
    this.companies = [
      { id: 1, name: 'ASELS', buyPrice: 95.5, sellPrice: 93.5 },
      { id: 2, name: 'THYAO', buyPrice: 310.0, sellPrice: 303.0 },
      { id: 3, name: 'BIMAS', buyPrice: 142.8, sellPrice: 139.8 }
    ];
    
    this.currencies = [
      { id: 1, name: 'USD', buyPrice: 34.25, sellPrice: 34.15 },
      { id: 2, name: 'EUR', buyPrice: 37.10, sellPrice: 36.95 },
      { id: 3, name: 'GBP', buyPrice: 43.50, sellPrice: 43.30 }
    ];
    
    this.startups = [
      { id: 1, name: 'TechCorp', buyPrice: 250.0, sellPrice: 245.0 },
      { id: 2, name: 'GreenTech', buyPrice: 180.0, sellPrice: 176.0 }
    ];
    
    this.teams = [
      { 
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
      }
    ];
  }
}

const storage = new MemStorage();

// API Routes
app.get('/api/companies', (req, res) => {
  res.json(storage.companies);
});

app.get('/api/currencies', (req, res) => {
  res.json(storage.currencies);
});

app.get('/api/startups', (req, res) => {
  res.json(storage.startups);
});

app.post('/api/teams/login', (req, res) => {
  const { accessCode } = req.body;
  const team = storage.teams.find(t => t.accessCode === accessCode);
  
  if (!team) {
    return res.status(401).json({ error: 'Invalid access code' });
  }
  
  req.session.teamId = team.id;
  res.json(team);
});

app.get('/api/teams/me', (req, res) => {
  if (!req.session.teamId) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  
  const team = storage.teams.find(t => t.id === req.session.teamId);
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }
  
  res.json(team);
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password !== 'admin123') {
    return res.status(401).json({ error: 'Invalid password' });
  }
  
  req.session.isAdmin = true;
  res.json({ success: true });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    platform: 'railway',
    port: PORT,
    host: HOST
  });
});

// Catch all - serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start server
const server = createServer(app);

server.listen(PORT, HOST, () => {
  console.log(`🚂 Railway server running on ${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`Platform: Railway`);
  console.log(`Static files: ${path.join(__dirname, '..', 'dist', 'public')}`);
});