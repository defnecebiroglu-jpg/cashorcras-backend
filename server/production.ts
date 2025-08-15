// Production server entry point - NO Vite dependencies
import express from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { registerRoutes } from "./routes";

// Production logging function
function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit", 
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

// Production-safe path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.resolve(projectRoot, 'dist', 'public');

async function startProductionServer() {
  const app = express();
  
  // Trust proxy for Railway/Render
  app.set('trust proxy', 1);
  
  // Session configuration
  const MemStore = MemoryStore(session);
  const isProduction = process.env.NODE_ENV === 'production';
  const isRailway = process.env.RAILWAY_ENVIRONMENT !== undefined;
  const isRender = process.env.RENDER !== undefined;
  
  // @ts-ignore - Express session type issue workaround
  app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-key',
    resave: false,
    saveUninitialized: false,
    store: new MemStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    cookie: {
      secure: isProduction && (isRailway || isRender),
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: isProduction ? 'strict' : 'lax'
    }
  }));

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // CORS headers for production
  app.use((req, res, next) => {
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      platform: isRailway ? 'railway' : isRender ? 'render' : 'unknown'
    });
  });

  // Register API routes
  const httpServer = await registerRoutes(app);

  // Serve static files from dist/public
  app.use(express.static(publicDir));
  
  // SPA fallback
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });

  // Start server
  const PORT = parseInt(process.env.PORT || '5000');
  const HOST = process.env.HOST || '0.0.0.0';

  httpServer.listen(PORT, HOST, () => {
    log(`serving on ${HOST}:${PORT} in production mode`);
    log(`platform: railway=${isRailway}, render=${isRender}`);
    log(`static files from: ${publicDir}`);
  });
}

startProductionServer().catch(console.error);