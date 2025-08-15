// RENDER OPTIMIZED SERVER - BULLETPROOF
const http = require('http');
const PORT = process.env.PORT || 10000; // Render default port

console.log('🚀 RENDER SERVER STARTING on port:', PORT);
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Platform: RENDER DEPLOYMENT');

const server = http.createServer((req, res) => {
  console.log('Request:', req.method, req.url);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'WORKING',
      port: PORT,
      time: new Date().toISOString(),
      platform: 'render',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      node: process.version
    }));
    return;
  }
  
  if (req.url === '/test') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <h1>✅ RENDER SERVER WORKING!</h1>
      <p><strong>Platform:</strong> Render.com</p>
      <p><strong>Port:</strong> ${PORT}</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      <p><strong>Uptime:</strong> ${Math.floor(process.uptime())}s</p>
      <p><a href="/health" style="color: #00d4aa;">Health Check</a></p>
      <p><a href="/api/companies" style="color: #00d4aa;">Test API</a></p>
      <hr>
      <p><strong>Cash or Crash - Entrepreneurship Simulation</strong></p>
    `);
    return;
  }
  
  // API endpoints
  if (req.url === '/api/companies') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([
      { id: 1, name: 'ASELS', buyPrice: 95.5, sellPrice: 93.5 },
      { id: 2, name: 'THYAO', buyPrice: 310.0, sellPrice: 303.0 },
      { id: 3, name: 'BIMAS', buyPrice: 142.8, sellPrice: 139.8 }
    ]));
    return;
  }
  
  // Default response - Simple frontend
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Cash or Crash - Simulation</title>
      <style>
        body { font-family: Arial; background: #1B1B1B; color: #E3DFD6; padding: 20px; }
        h1 { color: #cae304e6; }
        a { color: #00d4aa; text-decoration: none; margin-right: 15px; }
        .container { max-width: 800px; margin: 0 auto; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>💰 Cash or Crash</h1>
        <h2>Entrepreneurship Simulation Platform</h2>
        <p><strong>Status:</strong> ✅ Server Running on Port ${PORT}</p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        
        <h3>🔗 Quick Links:</h3>
        <p>
          <a href="/health">Health Check</a>
          <a href="/test">Server Test</a>
          <a href="/api/companies">Companies API</a>
        </p>
        
        <h3>📚 Access Instructions:</h3>
        <p>Team Access Code: <strong>00012024</strong></p>
        <p>Admin Password: <strong>admin123</strong></p>
      </div>
    </body>
    </html>
  `);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ RENDER SERVER READY on 0.0.0.0:${PORT}`);
  console.log(`📍 Health: http://0.0.0.0:${PORT}/health`);
  console.log(`🧪 Test: http://0.0.0.0:${PORT}/test`);
  console.log(`🎯 App URL will be: https://cash-or-crash.onrender.com`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

// Add API endpoints before server.listen
// This was incorrectly placed - moving to the request handler above

// Keep alive & memory monitoring
setInterval(() => {
  const memUsage = process.memoryUsage();
  console.log(`💓 Server alive - uptime: ${Math.floor(process.uptime())}s, memory: ${Math.round(memUsage.rss/1024/1024)}MB`);
}, 60000); // Every minute