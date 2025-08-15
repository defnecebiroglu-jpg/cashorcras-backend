// Minimal Railway server (CommonJS)
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'railway-secret-' + Date.now(),
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Static files
const publicPath = path.join(__dirname, '..', 'dist', 'public');
app.use(express.static(publicPath));

// Simple data
const data = {
  companies: [
    { id: 1, name: 'ASELS', buyPrice: 95.5, sellPrice: 93.5 },
    { id: 2, name: 'THYAO', buyPrice: 310.0, sellPrice: 303.0 },
    { id: 3, name: 'BIMAS', buyPrice: 142.8, sellPrice: 139.8 }
  ],
  currencies: [
    { id: 1, name: 'USD', buyPrice: 34.25, sellPrice: 34.15 },
    { id: 2, name: 'EUR', buyPrice: 37.10, sellPrice: 36.95 },
    { id: 3, name: 'GBP', buyPrice: 43.50, sellPrice: 43.30 }
  ],
  startups: [
    { id: 1, name: 'TechCorp', buyPrice: 250.0, sellPrice: 245.0 },
    { id: 2, name: 'GreenTech', buyPrice: 180.0, sellPrice: 176.0 }
  ],
  teams: [{
    id: 1, name: 'Takım 1', accessCode: '00012024', cash: 100000,
    companies: [{ companyId: 1, quantity: 10 }],
    currencies: [{ currencyId: 1, quantity: 1000 }],
    startups: [{ startupId: 1, quantity: 3 }]
  }]
};

// API endpoints
app.get('/api/companies', (req, res) => res.json(data.companies));
app.get('/api/currencies', (req, res) => res.json(data.currencies));
app.get('/api/startups', (req, res) => res.json(data.startups));

app.post('/api/teams/login', (req, res) => {
  const team = data.teams.find(t => t.accessCode === req.body.accessCode);
  if (!team) return res.status(401).json({ error: 'Invalid access code' });
  req.session.teamId = team.id;
  res.json(team);
});

app.get('/api/teams/me', (req, res) => {
  if (!req.session.teamId) return res.status(401).json({ error: 'Not logged in' });
  const team = data.teams.find(t => t.id === req.session.teamId);
  res.json(team || { error: 'Team not found' });
});

app.post('/api/admin/login', (req, res) => {
  if (req.body.password !== 'admin123') return res.status(401).json({ error: 'Invalid' });
  req.session.isAdmin = true;
  res.json({ success: true });
});

app.get('/health', (req, res) => res.json({ 
  status: 'OK', railway: true, port: PORT, time: new Date().toISOString() 
}));

// Catch-all
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Error handling
process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚂 Railway server running on 0.0.0.0:${PORT}`);
  console.log(`Static files: ${publicPath}`);
});