const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from src directory
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`MapMates app running at http://localhost:${port}`);
  console.log('AI Chatbot is ready! Look for the robot icon 🤖');
});