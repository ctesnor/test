const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const DATA_FILE = 'webhooks.json';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

let receivedData = [];

// Load any previously saved data
if (fs.existsSync(DATA_FILE)) {
  try {
    receivedData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    receivedData = [];
  }
}

// Display all raw received webhook data
app.get('/', (req, res) => {
  res.send(`
    <h1>Received Webhooks</h1>
    <pre>${JSON.stringify(receivedData, null, 2)}</pre>
  `);
});

// Store raw body exactly as posted
app.post('/webhook', (req, res) => {
  receivedData.push(req.body); // store as-is, no modification/wrapping

  fs.writeFileSync(DATA_FILE, JSON.stringify(receivedData, null, 2));
  res.status(200).json({ status: 'ok' });
});

// Listen on all interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
