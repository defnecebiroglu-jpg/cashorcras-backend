// Minimal test server for Railway debugging
import express from "express";
import { createServer } from "http";

const app = express();
const PORT = parseInt(process.env.PORT || '5000');
const HOST = process.env.HOST || '0.0.0.0';

console.log(`[MINIMAL] Starting minimal server on ${HOST}:${PORT}`);

// Basic health check only
app.get('/health', (req, res) => {
  console.log('[MINIMAL] Health check requested');
  res.json({ 
    status: 'minimal-ok', 
    timestamp: new Date().toISOString(),
    port: PORT,
    host: HOST
  });
});

// Catch all
app.get('*', (req, res) => {
  console.log(`[MINIMAL] Request to: ${req.path}`);
  res.json({ message: 'Minimal server working', path: req.path });
});

const server = createServer(app);
server.listen(PORT, HOST, () => {
  console.log(`[MINIMAL] ✅ Server running on ${HOST}:${PORT}`);
});

// Error handling
server.on('error', (error) => {
  console.log(`[MINIMAL] ❌ Server error: ${error}`);
});

process.on('SIGTERM', () => {
  console.log('[MINIMAL] SIGTERM received, shutting down');
  server.close();
});