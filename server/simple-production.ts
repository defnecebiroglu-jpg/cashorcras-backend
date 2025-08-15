// Ultra-simple production server - step by step debugging
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '..', 'dist', 'public');

const app = express();
const PORT = parseInt(process.env.PORT || '5000');

console.log(`[SIMPLE] Starting on PORT: ${PORT}`);
console.log(`[SIMPLE] Static files from: ${publicDir}`);
console.log(`[SIMPLE] Environment: ${process.env.NODE_ENV}`);

// Basic middleware
app.use(express.json());

// Health check ONLY
app.get('/health', (req, res) => {
  console.log(`[SIMPLE] Health check called`);
  res.json({ 
    status: 'simple-ok',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Serve static files
app.use(express.static(publicDir));

// Basic SPA fallback
app.get('*', (req, res) => {
  console.log(`[SIMPLE] SPA fallback for: ${req.path}`);
  const indexPath = path.join(publicDir, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.log(`[SIMPLE] Error serving index.html: ${err}`);
      res.status(500).send('Error loading page');
    }
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[SIMPLE] ✅ Server running on 0.0.0.0:${PORT}`);
  console.log(`[SIMPLE] Process PID: ${process.pid}`);
});

// Error handling
process.on('uncaughtException', (error) => {
  console.log(`[SIMPLE] ❌ Uncaught Exception: ${error.message}`);
  console.log(`[SIMPLE] Stack: ${error.stack}`);
});

process.on('unhandledRejection', (reason) => {
  console.log(`[SIMPLE] ❌ Unhandled Rejection: ${reason}`);
});