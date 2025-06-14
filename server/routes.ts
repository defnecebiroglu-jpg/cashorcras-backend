import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import { insertCompanySchema, insertCurrencySchema, insertTeamSchema, insertTeamStockSchema, insertTeamCurrencySchema, insertTeamStartupSchema } from "@shared/schema";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files
  app.use('/uploads', express.static('uploads'));

  // Companies
  app.get('/api/companies', async (req, res) => {
    try {
      const companies = await storage.getCompanies();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get companies' });
    }
  });

  app.get('/api/companies/:id', async (req, res) => {
    try {
      const company = await storage.getCompany(parseInt(req.params.id));
      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get company' });
    }
  });

  app.post('/api/companies', upload.single('logo'), async (req, res) => {
    try {
      const data = insertCompanySchema.parse(req.body);
      if (req.file) {
        data.logoUrl = `/uploads/${req.file.filename}`;
      }
      const company = await storage.createCompany(data);
      res.status(201).json(company);
    } catch (error) {
      res.status(400).json({ message: 'Invalid company data' });
    }
  });

  app.put('/api/companies/:id', upload.single('logo'), async (req, res) => {
    try {
      const data = { ...req.body };
      if (req.file) {
        data.logoUrl = `/uploads/${req.file.filename}`;
      }
      const company = await storage.updateCompany(parseInt(req.params.id), data);
      res.json(company);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update company' });
    }
  });

  app.delete('/api/companies/:id', async (req, res) => {
    try {
      await storage.deleteCompany(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete company' });
    }
  });

  // Currencies
  app.get('/api/currencies', async (req, res) => {
    try {
      const currencies = await storage.getCurrencies();
      res.json(currencies);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get currencies' });
    }
  });

  app.post('/api/currencies', upload.single('logo'), async (req, res) => {
    try {
      const data = insertCurrencySchema.parse(req.body);
      if (req.file) {
        data.logoUrl = `/uploads/${req.file.filename}`;
      }
      const currency = await storage.createCurrency(data);
      res.status(201).json(currency);
    } catch (error) {
      res.status(400).json({ message: 'Invalid currency data' });
    }
  });

  app.put('/api/currencies/:id', upload.single('logo'), async (req, res) => {
    try {
      const data = { ...req.body };
      if (req.file) {
        data.logoUrl = `/uploads/${req.file.filename}`;
      }
      const currency = await storage.updateCurrency(parseInt(req.params.id), data);
      res.json(currency);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update currency' });
    }
  });

  app.delete('/api/currencies/:id', async (req, res) => {
    try {
      await storage.deleteCurrency(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete currency' });
    }
  });

  // Teams
  app.get('/api/teams', async (req, res) => {
    try {
      const teams = await storage.getTeams();
      res.json(teams);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get teams' });
    }
  });

  app.get('/api/teams/:id/portfolio', async (req, res) => {
    try {
      const portfolio = await storage.getTeamPortfolio(parseInt(req.params.id));
      if (!portfolio) {
        return res.status(404).json({ message: 'Team not found' });
      }
      res.json(portfolio);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get team portfolio' });
    }
  });

  app.post('/api/teams', async (req, res) => {
    try {
      const data = insertTeamSchema.parse(req.body);
      const team = await storage.createTeam(data);
      res.status(201).json(team);
    } catch (error) {
      res.status(400).json({ message: 'Invalid team data' });
    }
  });

  app.put('/api/teams/:id', async (req, res) => {
    try {
      const team = await storage.updateTeam(parseInt(req.params.id), req.body);
      res.json(team);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update team' });
    }
  });

  // Team Stocks
  app.post('/api/team-stocks', async (req, res) => {
    try {
      const data = insertTeamStockSchema.parse(req.body);
      const teamStock = await storage.createTeamStock(data);
      res.status(201).json(teamStock);
    } catch (error) {
      res.status(400).json({ message: 'Invalid team stock data' });
    }
  });

  app.put('/api/team-stocks/:id', async (req, res) => {
    try {
      const teamStock = await storage.updateTeamStock(parseInt(req.params.id), req.body);
      res.json(teamStock);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update team stock' });
    }
  });

  app.delete('/api/team-stocks/:id', async (req, res) => {
    try {
      await storage.deleteTeamStock(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete team stock' });
    }
  });

  // Team Currencies
  app.post('/api/team-currencies', async (req, res) => {
    try {
      const data = insertTeamCurrencySchema.parse(req.body);
      const teamCurrency = await storage.createTeamCurrency(data);
      res.status(201).json(teamCurrency);
    } catch (error) {
      res.status(400).json({ message: 'Invalid team currency data' });
    }
  });

  app.put('/api/team-currencies/:id', async (req, res) => {
    try {
      const teamCurrency = await storage.updateTeamCurrency(parseInt(req.params.id), req.body);
      res.json(teamCurrency);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update team currency' });
    }
  });

  app.delete('/api/team-currencies/:id', async (req, res) => {
    try {
      await storage.deleteTeamCurrency(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete team currency' });
    }
  });

  // Team Startups
  app.post('/api/team-startups', async (req, res) => {
    try {
      const data = insertTeamStartupSchema.parse(req.body);
      const teamStartup = await storage.createTeamStartup(data);
      res.status(201).json(teamStartup);
    } catch (error) {
      res.status(400).json({ message: 'Invalid team startup data' });
    }
  });

  app.put('/api/team-startups/:id', async (req, res) => {
    try {
      const teamStartup = await storage.updateTeamStartup(parseInt(req.params.id), req.body);
      res.json(teamStartup);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update team startup' });
    }
  });

  app.delete('/api/team-startups/:id', async (req, res) => {
    try {
      await storage.deleteTeamStartup(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete team startup' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
