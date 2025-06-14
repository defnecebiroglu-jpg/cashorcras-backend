import { 
  companies, currencies, teams, teamStocks, teamCurrencies, teamStartups,
  type Company, type Currency, type Team, type TeamStock, type TeamCurrency, type TeamStartup,
  type InsertCompany, type InsertCurrency, type InsertTeam, 
  type InsertTeamStock, type InsertTeamCurrency, type InsertTeamStartup,
  type TeamPortfolio
} from "@shared/schema";

export interface IStorage {
  // Companies
  getCompanies(): Promise<Company[]>;
  getCompany(id: number): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: number, company: Partial<InsertCompany>): Promise<Company>;
  deleteCompany(id: number): Promise<void>;

  // Currencies
  getCurrencies(): Promise<Currency[]>;
  getCurrency(id: number): Promise<Currency | undefined>;
  createCurrency(currency: InsertCurrency): Promise<Currency>;
  updateCurrency(id: number, currency: Partial<InsertCurrency>): Promise<Currency>;
  deleteCurrency(id: number): Promise<void>;

  // Teams
  getTeams(): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: number, team: Partial<InsertTeam>): Promise<Team>;
  deleteTeam(id: number): Promise<void>;

  // Team Portfolio
  getTeamPortfolio(teamId: number): Promise<TeamPortfolio | undefined>;
  
  // Team Stocks
  getTeamStocks(teamId: number): Promise<(TeamStock & { company: Company })[]>;
  createTeamStock(teamStock: InsertTeamStock): Promise<TeamStock>;
  updateTeamStock(id: number, teamStock: Partial<InsertTeamStock>): Promise<TeamStock>;
  deleteTeamStock(id: number): Promise<void>;

  // Team Currencies
  getTeamCurrencies(teamId: number): Promise<(TeamCurrency & { currency: Currency })[]>;
  createTeamCurrency(teamCurrency: InsertTeamCurrency): Promise<TeamCurrency>;
  updateTeamCurrency(id: number, teamCurrency: Partial<InsertTeamCurrency>): Promise<TeamCurrency>;
  deleteTeamCurrency(id: number): Promise<void>;

  // Team Startups
  getTeamStartup(teamId: number): Promise<TeamStartup | undefined>;
  createTeamStartup(teamStartup: InsertTeamStartup): Promise<TeamStartup>;
  updateTeamStartup(id: number, teamStartup: Partial<InsertTeamStartup>): Promise<TeamStartup>;
  deleteTeamStartup(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private companies: Map<number, Company> = new Map();
  private currencies: Map<number, Currency> = new Map();
  private teams: Map<number, Team> = new Map();
  private teamStocks: Map<number, TeamStock> = new Map();
  private teamCurrencies: Map<number, TeamCurrency> = new Map();
  private teamStartups: Map<number, TeamStartup> = new Map();
  
  private currentCompanyId = 1;
  private currentCurrencyId = 1;
  private currentTeamId = 1;
  private currentTeamStockId = 1;
  private currentTeamCurrencyId = 1;
  private currentTeamStartupId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize companies
    const initialCompanies: InsertCompany[] = [
      { name: "Apple Inc.", symbol: "AAPL", price: "170.00", dividend: "2.1", description: "Technology company specializing in consumer electronics and software", logoUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64" },
      { name: "Microsoft Corp.", symbol: "MSFT", price: "340.00", dividend: "1.8", description: "Technology corporation developing software and cloud services", logoUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64" },
      { name: "Tesla Inc.", symbol: "TSLA", price: "240.00", dividend: "0", description: "Electric vehicle and clean energy company", logoUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64" },
      { name: "Amazon Inc.", symbol: "AMZN", price: "3420.50", dividend: "1.2", description: "E-commerce and cloud computing leader with global reach", logoUrl: "https://images.unsplash.com/photo-1586880244386-8b3e34c8382c?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64" },
      { name: "Alphabet Inc.", symbol: "GOOGL", price: "2750.25", dividend: "0", description: "Search engine and advertising technology company", logoUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64" },
      { name: "Netflix Inc.", symbol: "NFLX", price: "485.75", dividend: "0", description: "Global streaming entertainment platform and content creator", logoUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64" },
      { name: "Nike Inc.", symbol: "NKE", price: "128.40", dividend: "1.1", description: "Global athletic footwear and apparel brand", logoUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64" },
      { name: "Coca-Cola Co.", symbol: "KO", price: "58.90", dividend: "3.2", description: "Global beverage corporation and brand", logoUrl: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64" }
    ];

    initialCompanies.forEach(company => {
      const id = this.currentCompanyId++;
      this.companies.set(id, { ...company, id });
    });

    // Initialize currencies
    const initialCurrencies: InsertCurrency[] = [
      { name: "Euro", code: "EUR", rate: "1.10", logoUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64" },
      { name: "British Pound", code: "GBP", rate: "1.245", logoUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64" },
      { name: "Japanese Yen", code: "JPY", rate: "0.0068", logoUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64" },
      { name: "Canadian Dollar", code: "CAD", rate: "0.74", logoUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64" },
      { name: "Swiss Franc", code: "CHF", rate: "1.10", logoUrl: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64" }
    ];

    initialCurrencies.forEach(currency => {
      const id = this.currentCurrencyId++;
      this.currencies.set(id, { ...currency, id });
    });

    // Initialize teams
    const initialTeams: InsertTeam[] = [
      { name: "Team Alpha", cashBalance: "25430.00" },
      { name: "Team Beta", cashBalance: "18250.00" },
      { name: "Team Gamma", cashBalance: "32100.00" },
      { name: "Team Delta", cashBalance: "28750.00" }
    ];

    initialTeams.forEach(team => {
      const id = this.currentTeamId++;
      this.teams.set(id, { ...team, id });
    });

    // Initialize team stocks for Team Alpha
    const teamAlphaStocks: InsertTeamStock[] = [
      { teamId: 1, companyId: 1, shares: 25 }, // Apple
      { teamId: 1, companyId: 2, shares: 15 }, // Microsoft
      { teamId: 1, companyId: 3, shares: 8 }   // Tesla
    ];

    teamAlphaStocks.forEach(stock => {
      const id = this.currentTeamStockId++;
      this.teamStocks.set(id, { ...stock, id });
    });

    // Initialize team currencies for Team Alpha
    const teamAlphaCurrencies: InsertTeamCurrency[] = [
      { teamId: 1, currencyId: 1, amount: "2500.00" }, // EUR
      { teamId: 1, currencyId: 2, amount: "1200.00" }, // GBP
      { teamId: 1, currencyId: 3, amount: "150000.00" } // JPY
    ];

    teamAlphaCurrencies.forEach(currency => {
      const id = this.currentTeamCurrencyId++;
      this.teamCurrencies.set(id, { ...currency, id });
    });

    // Initialize team startup for Team Alpha
    const teamAlphaStartup: InsertTeamStartup = {
      teamId: 1,
      name: "EcoTech Solutions",
      description: "A revolutionary green technology startup focused on developing sustainable energy storage solutions for residential and commercial applications. The company specializes in advanced battery technology and smart grid integration.",
      value: "25000.00",
      industry: "Clean Technology",
      riskLevel: "Medium-High"
    };

    const startupId = this.currentTeamStartupId++;
    this.teamStartups.set(startupId, { ...teamAlphaStartup, id: startupId });
  }

  // Companies
  async getCompanies(): Promise<Company[]> {
    return Array.from(this.companies.values());
  }

  async getCompany(id: number): Promise<Company | undefined> {
    return this.companies.get(id);
  }

  async createCompany(company: InsertCompany): Promise<Company> {
    const id = this.currentCompanyId++;
    const newCompany: Company = { ...company, id };
    this.companies.set(id, newCompany);
    return newCompany;
  }

  async updateCompany(id: number, company: Partial<InsertCompany>): Promise<Company> {
    const existing = this.companies.get(id);
    if (!existing) throw new Error("Company not found");
    const updated = { ...existing, ...company };
    this.companies.set(id, updated);
    return updated;
  }

  async deleteCompany(id: number): Promise<void> {
    this.companies.delete(id);
  }

  // Currencies
  async getCurrencies(): Promise<Currency[]> {
    return Array.from(this.currencies.values());
  }

  async getCurrency(id: number): Promise<Currency | undefined> {
    return this.currencies.get(id);
  }

  async createCurrency(currency: InsertCurrency): Promise<Currency> {
    const id = this.currentCurrencyId++;
    const newCurrency: Currency = { ...currency, id };
    this.currencies.set(id, newCurrency);
    return newCurrency;
  }

  async updateCurrency(id: number, currency: Partial<InsertCurrency>): Promise<Currency> {
    const existing = this.currencies.get(id);
    if (!existing) throw new Error("Currency not found");
    const updated = { ...existing, ...currency };
    this.currencies.set(id, updated);
    return updated;
  }

  async deleteCurrency(id: number): Promise<void> {
    this.currencies.delete(id);
  }

  // Teams
  async getTeams(): Promise<Team[]> {
    return Array.from(this.teams.values());
  }

  async getTeam(id: number): Promise<Team | undefined> {
    return this.teams.get(id);
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const id = this.currentTeamId++;
    const newTeam: Team = { ...team, id };
    this.teams.set(id, newTeam);
    return newTeam;
  }

  async updateTeam(id: number, team: Partial<InsertTeam>): Promise<Team> {
    const existing = this.teams.get(id);
    if (!existing) throw new Error("Team not found");
    const updated = { ...existing, ...team };
    this.teams.set(id, updated);
    return updated;
  }

  async deleteTeam(id: number): Promise<void> {
    this.teams.delete(id);
  }

  // Team Portfolio
  async getTeamPortfolio(teamId: number): Promise<TeamPortfolio | undefined> {
    const team = this.teams.get(teamId);
    if (!team) return undefined;

    const stocks = await this.getTeamStocks(teamId);
    const currencies = await this.getTeamCurrencies(teamId);
    const startup = await this.getTeamStartup(teamId);

    const totalStockValue = stocks.reduce((sum, stock) => {
      return sum + (parseFloat(stock.company.price) * stock.shares);
    }, 0);

    const totalCurrencyValue = currencies.reduce((sum, currency) => {
      return sum + (parseFloat(currency.amount) * parseFloat(currency.currency.rate));
    }, 0);

    const startupValue = startup ? parseFloat(startup.value) : 0;
    const totalPortfolioValue = parseFloat(team.cashBalance) + totalStockValue + totalCurrencyValue + startupValue;

    return {
      team,
      stocks,
      currencies,
      startup,
      totalStockValue: totalStockValue.toFixed(2),
      totalCurrencyValue: totalCurrencyValue.toFixed(2),
      totalPortfolioValue: totalPortfolioValue.toFixed(2)
    };
  }

  // Team Stocks
  async getTeamStocks(teamId: number): Promise<(TeamStock & { company: Company })[]> {
    const teamStocks = Array.from(this.teamStocks.values()).filter(s => s.teamId === teamId);
    return teamStocks.map(stock => {
      const company = this.companies.get(stock.companyId);
      if (!company) throw new Error("Company not found");
      return { ...stock, company };
    });
  }

  async createTeamStock(teamStock: InsertTeamStock): Promise<TeamStock> {
    const id = this.currentTeamStockId++;
    const newTeamStock: TeamStock = { ...teamStock, id };
    this.teamStocks.set(id, newTeamStock);
    return newTeamStock;
  }

  async updateTeamStock(id: number, teamStock: Partial<InsertTeamStock>): Promise<TeamStock> {
    const existing = this.teamStocks.get(id);
    if (!existing) throw new Error("Team stock not found");
    const updated = { ...existing, ...teamStock };
    this.teamStocks.set(id, updated);
    return updated;
  }

  async deleteTeamStock(id: number): Promise<void> {
    this.teamStocks.delete(id);
  }

  // Team Currencies
  async getTeamCurrencies(teamId: number): Promise<(TeamCurrency & { currency: Currency })[]> {
    const teamCurrencies = Array.from(this.teamCurrencies.values()).filter(c => c.teamId === teamId);
    return teamCurrencies.map(currency => {
      const currencyData = this.currencies.get(currency.currencyId);
      if (!currencyData) throw new Error("Currency not found");
      return { ...currency, currency: currencyData };
    });
  }

  async createTeamCurrency(teamCurrency: InsertTeamCurrency): Promise<TeamCurrency> {
    const id = this.currentTeamCurrencyId++;
    const newTeamCurrency: TeamCurrency = { ...teamCurrency, id };
    this.teamCurrencies.set(id, newTeamCurrency);
    return newTeamCurrency;
  }

  async updateTeamCurrency(id: number, teamCurrency: Partial<InsertTeamCurrency>): Promise<TeamCurrency> {
    const existing = this.teamCurrencies.get(id);
    if (!existing) throw new Error("Team currency not found");
    const updated = { ...existing, ...teamCurrency };
    this.teamCurrencies.set(id, updated);
    return updated;
  }

  async deleteTeamCurrency(id: number): Promise<void> {
    this.teamCurrencies.delete(id);
  }

  // Team Startups
  async getTeamStartup(teamId: number): Promise<TeamStartup | undefined> {
    return Array.from(this.teamStartups.values()).find(s => s.teamId === teamId);
  }

  async createTeamStartup(teamStartup: InsertTeamStartup): Promise<TeamStartup> {
    const id = this.currentTeamStartupId++;
    const newTeamStartup: TeamStartup = { ...teamStartup, id };
    this.teamStartups.set(id, newTeamStartup);
    return newTeamStartup;
  }

  async updateTeamStartup(id: number, teamStartup: Partial<InsertTeamStartup>): Promise<TeamStartup> {
    const existing = this.teamStartups.get(id);
    if (!existing) throw new Error("Team startup not found");
    const updated = { ...existing, ...teamStartup };
    this.teamStartups.set(id, updated);
    return updated;
  }

  async deleteTeamStartup(id: number): Promise<void> {
    this.teamStartups.delete(id);
  }
}

export const storage = new MemStorage();
