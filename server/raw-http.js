// Raw Node.js HTTP - no Express dependency
const http = require('http');

console.log("=== RAW HTTP SERVER START ===");
console.log("Node version:", process.version);
console.log("- NODE_ENV:", process.env.NODE_ENV);
console.log("- PORT:", process.env.PORT);

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  res.setHeader('Content-Type', 'application/json');
  
  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ 
      status: 'raw-http-ok', 
      port: PORT, 
      timestamp: new Date().toISOString() 
    }));
  } else if (req.url === '/') {
    res.writeHead(200);
    res.end(JSON.stringify({ 
      message: 'Raw HTTP server working!', 
      port: PORT 
    }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log("=== SERVER STARTED ===");
  console.log(`✅ Raw HTTP server on 0.0.0.0:${PORT}`);
});

server.on('error', (error) => {
  console.error("=== SERVER ERROR ===");
  console.error("Error:", error.message);
});

console.log("=== RAW HTTP SETUP COMPLETE ===");