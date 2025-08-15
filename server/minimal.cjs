// MINIMAL Railway test
const http = require('http');
const PORT = process.env.PORT || 3000;

console.log('Starting minimal server on port:', PORT);

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
      platform: 'railway'
    }));
    return;
  }
  
  if (req.url === '/test') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <h1>✅ RAILWAY SERVER WORKING!</h1>
      <p>Port: ${PORT}</p>
      <p>Time: ${new Date().toISOString()}</p>
      <p><a href="/health">Health Check</a></p>
    `);
    return;
  }
  
  // Default response
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <h1>🚂 Railway Minimal Server</h1>
    <p>Server is running on port ${PORT}</p>
    <p><a href="/health">Health</a> | <a href="/test">Test</a></p>
  `);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Minimal server running on 0.0.0.0:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

// Keep alive
setInterval(() => {
  console.log(`Server uptime: ${Math.floor(process.uptime())}s`);
}, 30000);