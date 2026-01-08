const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, 'design-preview.html');
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
      return;
    }
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Modern SaaS Design Preview running at http://localhost:${PORT}`);
  console.log('✨ Features: Glassmorphism nav, Indigo colors, Smooth animations');
});