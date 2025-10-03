const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const DATA_FILE = 'webhooks.json';
const PORT = 3000;

const app = express();
app.use(bodyParser.json());

let receivedData = [];

// Load data from file if it exists
if (fs.existsSync(DATA_FILE)) {
  try {
    receivedData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    receivedData = [];
  }
}

// Route to display all received data
app.get('/', (req, res) => {
  res.send(`
    <h1>Received Webhooks</h1>
    <pre>${JSON.stringify(receivedData, null, 2)}</pre>
  `);
});

// Webhook receiver endpoint
app.post('/webhook', (req, res) => {
  receivedData.push({
    timestamp: new Date(),
    payload: req.body,
  });

  fs.writeFileSync(DATA_FILE, JSON.stringify(receivedData, null, 2));
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
