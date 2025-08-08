import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import { ObjectStorageService } from './objectStorage';
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

  // Serve public objects from object storage
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Authentication routes
  app.post('/api/auth/team', async (req, res) => {
    try {
      const { accessCode } = req.body;
      const team = await storage.authenticateTeam(accessCode);
      if (!team) {
        return res.status(401).json({ message: 'Geçersiz erişim kodu' });
      }
      
      req.session = req.session || {};
      req.session.teamId = team.id;
      res.json({ team });
    } catch (error) {
      res.status(500).json({ message: 'Kimlik doğrulama hatası' });
    }
  });

  app.post('/api/auth/admin', async (req, res) => {
    try {
      const { password } = req.body;
      const isValid = await storage.authenticateAdmin(password);
      if (!isValid) {
        return res.status(401).json({ message: 'Geçersiz admin şifresi' });
      }
      
      req.session = req.session || {};
      req.session.isAdmin = true;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Kimlik doğrulama hatası' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session = {};
    res.json({ success: true });
  });

  // Admin dividend distribution endpoint
  app.post('/api/admin/distribute-dividend/:companyId', async (req, res) => {
    try {
      const companyId = parseInt(req.params.companyId);
      const company = await storage.getCompany(companyId);
      
      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }
      
      const dividendRate = parseFloat(company.dividend) / 100; // Convert percentage to decimal
      if (dividendRate <= 0) {
        return res.status(400).json({ message: 'Company has no dividend' });
      }
      
      const teams = await storage.getTeams();
      let totalDistributed = 0;
      let affectedTeams = 0;
      
      // Process dividend payments for each team (give additional shares)
      for (const team of teams) {
        const teamStocks = await storage.getTeamStocks(team.id);
        const companyStock = teamStocks.find(stock => stock.companyId === companyId);
        
        if (companyStock && companyStock.shares > 0) {
          const dividendShares = Math.floor(companyStock.shares * dividendRate);
          
          if (dividendShares > 0) {
            // Add dividend shares to the team's existing stock
            await storage.createTeamStock({
              teamId: team.id,
              companyId,
              shares: dividendShares
            });
            
            totalDistributed += dividendShares;
            affectedTeams++;
          }
        }
      }
      
      res.json({
        success: true,
        totalDistributed: totalDistributed.toFixed(2),
        affectedTeams,
        dividendRate: (dividendRate * 100).toFixed(1)
      });
    } catch (error) {
      res.status(500).json({ message: 'Dividend distribution failed' });
    }
  });

  // Admin salesman endpoints for managing team portfolios
  app.post('/api/admin/assign-stock', async (req, res) => {
    try {
      const { teamId, companyId, shares } = req.body;
      
      const team = await storage.getTeam(teamId);
      const company = await storage.getCompany(companyId);
      
      if (!team || !company) {
        return res.status(404).json({ message: 'Team or company not found' });
      }
      
      const totalCost = shares * parseFloat(company.price);
      const currentBalance = parseFloat(team.cashBalance);
      
      // Admin can assign without balance limits - deduct cost from team balance
      await storage.updateTeam(teamId, {
        cashBalance: (currentBalance - totalCost).toFixed(2)
      });
      
      // Assign shares
      const teamStock = await storage.createTeamStock({
        teamId,
        companyId,
        shares
      });
      
      res.status(201).json(teamStock);
    } catch (error) {
      res.status(400).json({ message: 'Failed to assign stock' });
    }
  });

  app.post('/api/admin/unassign-stock', async (req, res) => {
    try {
      const { teamId, companyId, shares } = req.body;
      
      const team = await storage.getTeam(teamId);
      const company = await storage.getCompany(companyId);
      
      if (!team || !company) {
        return res.status(404).json({ message: 'Team or company not found' });
      }
      
      // Check if team has enough shares
      const teamStocks = await storage.getTeamStocks(teamId);
      const currentStock = teamStocks.find(s => s.companyId === companyId);
      
      if (!currentStock || currentStock.shares < shares) {
        return res.status(400).json({ message: 'Yetersiz hisse' });
      }
      
      const totalRevenue = shares * parseFloat(company.sellPrice);
      const currentBalance = parseFloat(team.cashBalance);
      
      // Add revenue to team balance
      await storage.updateTeam(teamId, {
        cashBalance: (currentBalance + totalRevenue).toFixed(2)
      });
      
      // Remove shares
      await storage.createTeamStock({
        teamId,
        companyId,
        shares: -shares
      });
      
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).json({ message: 'Failed to unassign stock' });
    }
  });

  app.post('/api/admin/assign-currency', async (req, res) => {
    try {
      const { teamId, currencyId, amount } = req.body;
      
      const team = await storage.getTeam(teamId);
      const currency = await storage.getCurrency(currencyId);
      
      if (!team || !currency) {
        return res.status(404).json({ message: 'Team or currency not found' });
      }
      
      const totalCost = parseFloat(amount) * parseFloat(currency.rate);
      const currentBalance = parseFloat(team.cashBalance);
      
      // Admin can assign without balance limits - deduct cost from team balance
      await storage.updateTeam(teamId, {
        cashBalance: (currentBalance - totalCost).toFixed(2)
      });
      
      // Assign currency
      const teamCurrency = await storage.createTeamCurrency({
        teamId,
        currencyId,
        amount: parseFloat(amount).toFixed(2)
      });
      
      res.status(201).json(teamCurrency);
    } catch (error) {
      res.status(400).json({ message: 'Failed to assign currency' });
    }
  });

  app.post('/api/admin/unassign-currency', async (req, res) => {
    try {
      const { teamId, currencyId, amount } = req.body;
      
      const team = await storage.getTeam(teamId);
      const currency = await storage.getCurrency(currencyId);
      
      if (!team || !currency) {
        return res.status(404).json({ message: 'Team or currency not found' });
      }
      
      // Check if team has enough currency
      const teamCurrencies = await storage.getTeamCurrencies(teamId);
      const currentCurrency = teamCurrencies.find(c => c.currencyId === currencyId);
      
      if (!currentCurrency || parseFloat(currentCurrency.amount) < parseFloat(amount)) {
        return res.status(400).json({ message: 'Yetersiz döviz' });
      }
      
      const totalRevenue = parseFloat(amount) * parseFloat(currency.sellRate);
      const currentBalance = parseFloat(team.cashBalance);
      
      // Add revenue to team balance
      await storage.updateTeam(teamId, {
        cashBalance: (currentBalance + totalRevenue).toFixed(2)
      });
      
      // Remove currency
      await storage.createTeamCurrency({
        teamId,
        currencyId,
        amount: (-parseFloat(amount)).toFixed(2)
      });
      
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).json({ message: 'Failed to unassign currency' });
    }
  });

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

  // Get upload URL for company logos
  app.post('/api/companies/upload', async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error('Error getting upload URL:', error);
      res.status(500).json({ error: 'Internal server error' });
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

  // Update company logo via object storage
  app.put('/api/companies/:id/logo', async (req, res) => {
    try {
      const { logoUrl } = req.body;
      if (!logoUrl) {
        return res.status(400).json({ error: 'logoUrl is required' });
      }

      const objectStorageService = new ObjectStorageService();
      const normalizedPath = objectStorageService.normalizeObjectEntityPath(logoUrl);
      
      const company = await storage.updateCompany(parseInt(req.params.id), { 
        logoUrl: normalizedPath 
      });
      res.json({ company, logoPath: normalizedPath });
    } catch (error) {
      console.error('Error updating company logo:', error);
      res.status(500).json({ error: 'Internal server error' });
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

  // PATCH endpoint for bulk price updates
  app.patch('/api/companies/:id', async (req, res) => {
    try {
      const { price } = req.body;
      if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
        return res.status(400).json({ message: 'Invalid price value' });
      }
      
      const company = await storage.updateCompany(parseInt(req.params.id), { price });
      res.json(company);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update company price' });
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

  // PATCH endpoint for bulk rate updates
  app.patch('/api/currencies/:id', async (req, res) => {
    try {
      const { rate } = req.body;
      if (!rate || isNaN(parseFloat(rate)) || parseFloat(rate) <= 0) {
        return res.status(400).json({ message: 'Invalid rate value' });
      }
      
      const currency = await storage.updateCurrency(parseInt(req.params.id), { rate });
      res.json(currency);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update currency rate' });
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

  // Team trading endpoint
  app.post('/api/teams/:id/trade', async (req, res) => {
    try {
      const teamId = parseInt(req.params.id);
      const { companyId, shares, type } = req.body;
      
      if (!['buy', 'sell'].includes(type) || !companyId || !shares || shares <= 0) {
        return res.status(400).json({ message: 'Geçersiz işlem verileri' });
      }
      
      const team = await storage.getTeam(teamId);
      const company = await storage.getCompany(companyId);
      
      if (!team || !company) {
        return res.status(404).json({ message: 'Takım veya şirket bulunamadı' });
      }
      
      const currentBalance = parseFloat(team.cashBalance);
      const price = type === 'buy' ? parseFloat(company.price) : parseFloat(company.sellPrice);
      const totalAmount = shares * price;
      
      if (type === 'buy') {
        // Check if team has enough cash
        if (currentBalance < totalAmount) {
          return res.status(400).json({ message: 'Yetersiz nakit bakiye' });
        }
        
        // Deduct cash and add shares
        await storage.updateTeam(teamId, {
          cashBalance: (currentBalance - totalAmount).toFixed(2)
        });
        
        await storage.createTeamStock({
          teamId,
          companyId,
          shares
        });
        
      } else { // sell
        // Check if team has enough shares
        const teamStocks = await storage.getTeamStocks(teamId);
        const currentStock = teamStocks.find(s => s.companyId === companyId);
        
        if (!currentStock || currentStock.shares < shares) {
          return res.status(400).json({ message: 'Yetersiz hisse senedi' });
        }
        
        // Add cash and remove shares
        await storage.updateTeam(teamId, {
          cashBalance: (currentBalance + totalAmount).toFixed(2)
        });
        
        await storage.createTeamStock({
          teamId,
          companyId,
          shares: -shares
        });
      }
      
      // Return updated portfolio
      const updatedPortfolio = await storage.getTeamPortfolio(teamId);
      res.json({
        success: true,
        portfolio: updatedPortfolio,
        transaction: {
          type,
          companyName: company.name,
          shares,
          price: price.toFixed(2),
          total: totalAmount.toFixed(2)
        }
      });
      
    } catch (error) {
      console.error('Trade error:', error);
      res.status(500).json({ message: 'İşlem gerçekleştirilemedi' });
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

  app.put('/api/teams/:id', upload.single('profilePic'), async (req, res) => {
    try {
      const data = { ...req.body };
      if (req.file) {
        data.profilePicUrl = `/uploads/${req.file.filename}`;
      }
      const team = await storage.updateTeam(parseInt(req.params.id), data);
      res.json(team);
    } catch (error) {
      res.status(400).json({ message: 'Takım güncelleme hatası' });
    }
  });

  app.patch('/api/teams/:id', async (req, res) => {
    try {
      const team = await storage.updateTeam(parseInt(req.params.id), req.body);
      res.json(team);
    } catch (error) {
      res.status(400).json({ message: 'Takım güncelleme hatası' });
    }
  });

  app.delete('/api/teams/:id', async (req, res) => {
    try {
      await storage.deleteTeam(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Takım silme hatası' });
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

  // Buy/Sell Stock endpoint with cash balance handling
  app.post('/api/teams/:teamId/stocks/trade', async (req, res) => {
    try {
      const { companyId, shares, action } = req.body; // action: 'buy' or 'sell'
      const teamId = parseInt(req.params.teamId);
      
      if (!['buy', 'sell'].includes(action)) {
        return res.status(400).json({ message: 'Invalid action' });
      }
      
      const team = await storage.getTeam(teamId);
      const company = await storage.getCompany(companyId);
      
      if (!team || !company) {
        return res.status(404).json({ message: 'Team or company not found' });
      }
      
      const currentBalance = parseFloat(team.cashBalance);
      const shareCount = Math.abs(shares);
      
      if (action === 'buy') {
        const totalCost = shareCount * parseFloat(company.price);
        
        if (currentBalance < totalCost) {
          return res.status(400).json({ message: 'Yetersiz bakiye' });
        }
        
        // Deduct cost from team balance
        await storage.updateTeam(teamId, {
          cashBalance: (currentBalance - totalCost).toFixed(2)
        });
        
        // Add shares to portfolio
        await storage.createTeamStock({
          teamId,
          companyId,
          shares: shareCount
        });
        
      } else { // sell
        // Check if team has enough shares
        const teamStocks = await storage.getTeamStocks(teamId);
        const currentStock = teamStocks.find(s => s.companyId === companyId);
        
        if (!currentStock || currentStock.shares < shareCount) {
          return res.status(400).json({ message: 'Yetersiz hisse' });
        }
        
        const totalRevenue = shareCount * parseFloat(company.sellPrice);
        
        // Add revenue to team balance
        await storage.updateTeam(teamId, {
          cashBalance: (currentBalance + totalRevenue).toFixed(2)
        });
        
        // Remove shares from portfolio
        await storage.createTeamStock({
          teamId,
          companyId,
          shares: -shareCount
        });
      }
      
      res.status(201).json({ success: true, action, shares: shareCount });
    } catch (error) {
      res.status(400).json({ message: 'İşlem başarısız' });
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

  // Buy/Sell Currency endpoint with cash balance handling
  app.post('/api/teams/:teamId/currencies/trade', async (req, res) => {
    try {
      const { currencyId, amount, action } = req.body; // action: 'buy' or 'sell'
      const teamId = parseInt(req.params.teamId);
      
      if (!['buy', 'sell'].includes(action)) {
        return res.status(400).json({ message: 'Invalid action' });
      }
      
      const team = await storage.getTeam(teamId);
      const currency = await storage.getCurrency(currencyId);
      
      if (!team || !currency) {
        return res.status(404).json({ message: 'Team or currency not found' });
      }
      
      const currentBalance = parseFloat(team.cashBalance);
      const currencyAmount = Math.abs(parseFloat(amount));
      
      if (action === 'buy') {
        const totalCost = currencyAmount * parseFloat(currency.rate);
        
        if (currentBalance < totalCost) {
          return res.status(400).json({ message: 'Yetersiz bakiye' });
        }
        
        // Deduct cost from team balance
        await storage.updateTeam(teamId, {
          cashBalance: (currentBalance - totalCost).toFixed(2)
        });
        
        // Add currency to portfolio
        await storage.createTeamCurrency({
          teamId,
          currencyId,
          amount: currencyAmount.toFixed(2)
        });
        
      } else { // sell
        // Check if team has enough currency
        const teamCurrencies = await storage.getTeamCurrencies(teamId);
        const currentCurrency = teamCurrencies.find(c => c.currencyId === currencyId);
        
        if (!currentCurrency || parseFloat(currentCurrency.amount) < currencyAmount) {
          return res.status(400).json({ message: 'Yetersiz döviz' });
        }
        
        const totalRevenue = currencyAmount * parseFloat(currency.sellRate);
        
        // Add revenue to team balance
        await storage.updateTeam(teamId, {
          cashBalance: (currentBalance + totalRevenue).toFixed(2)
        });
        
        // Remove currency from portfolio
        await storage.createTeamCurrency({
          teamId,
          currencyId,
          amount: (-currencyAmount).toFixed(2)
        });
      }
      
      res.status(201).json({ success: true, action, amount: currencyAmount });
    } catch (error) {
      res.status(400).json({ message: 'İşlem başarısız' });
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
