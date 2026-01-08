const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src')));

// Serve the main HTML file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'design-preview.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 MapMates Modern SaaS Design running at http://localhost:${PORT}`);
  console.log('✨ Features: Glassmorphism nav, Indigo colors, Smooth animations');
  console.log('🎨 Modern design is fully implemented!');
});

// Try to open browser
try {
  const start = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  spawn(start, [`http://localhost:${PORT}`], { shell: true });
} catch (e) {
  console.log('Please open http://localhost:3000 in your browser');
}