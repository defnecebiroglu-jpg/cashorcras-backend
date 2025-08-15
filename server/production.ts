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
  
  // Also log to stderr for Railway debugging
  if (process.env.RAILWAY_ENVIRONMENT) {
    console.error(`[RAILWAY] ${message}`);
  }
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

  // Health check endpoint - must be before registerRoutes
  app.get('/health', (req, res) => {
    try {
      res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        platform: isRailway ? 'railway' : isRender ? 'render' : 'unknown',
        port: process.env.PORT || 'unknown',
        host: process.env.HOST || 'unknown'
      });
    } catch (error) {
      res.status(500).json({ status: 'error', error: String(error) });
    }
  });

  // Serve static files from dist/public first
  app.use(express.static(publicDir));

  // Register API routes with error handling
  let httpServer;
  try {
    httpServer = await registerRoutes(app);
    log('API routes registered successfully');
  } catch (error) {
    log(`Error registering routes: ${error}`);
    throw error;
  }
  
  // SPA fallback - must be last
  app.get('*', (req, res) => {
    try {
      res.sendFile(path.join(publicDir, 'index.html'));
    } catch (error) {
      log(`Error serving SPA fallback: ${error}`);
      res.status(500).send('Server Error');
    }
  });

  // Start the HTTP server returned by registerRoutes
  const PORT = parseInt(process.env.PORT || '5000');
  const HOST = process.env.HOST || '0.0.0.0';

  // Railway requires binding to 0.0.0.0 on the provided PORT
  httpServer.listen(PORT, '0.0.0.0', () => {
    log(`serving on 0.0.0.0:${PORT} in production mode`);
    log(`platform: railway=${isRailway}, render=${isRender}`);
    log(`static files from: ${publicDir}`);
    log(`environment: NODE_ENV=${process.env.NODE_ENV}`);
    
    // Test server immediately after start
    setTimeout(() => {
      log('Server startup complete - ready for connections');
    }, 100);
  });

  httpServer.on('error', (error) => {
    log(`Server error: ${error.message}`);
    if (error.message.includes('EADDRINUSE')) {
      log(`Port ${PORT} is already in use`);
      process.exit(1);
    }
  });

  // Global error handlers
  process.on('uncaughtException', (error) => {
    log(`Uncaught Exception: ${error.message}`);
    log(`Stack: ${error.stack}`);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    log(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    log('SIGTERM received, shutting down gracefully');
    httpServer.close(() => {
      log('Process terminated');
    });
  });
}

startProductionServer().catch(console.error);