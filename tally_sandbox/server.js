const express = require('express');
const cors = require('cors');
const path = require('path');
const { getEntries, saveEntry, updateEntry } = require('./db');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

// API Endpoints
// 1. Tally fetch endpoint
app.get('/tally/api/v1/tally/export/day-end', (req, res) => {
  const { firm_id, date, api_key } = req.query;
  
  if (!firm_id || !date || !api_key) {
    return res.status(400).json({ error: 'Missing required parameters: firm_id, date, api_key' });
  }
  
  const entries = getEntries();
  const filtered = entries.filter(e => e.firm_id === firm_id && e.date === date);
  
  const responseData = {
    FirmID: firm_id,
    Date: date,
    Transactions: filtered.map(e => e.transaction)
  };
  
  res.json(responseData);
});

// 2. Sandbox Create endpoint
app.post('/tally/api/sandbox/entry', (req, res) => {
  try {
    const saved = saveEntry(req.body);
    res.json({ success: true, data: saved });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 3. Sandbox Fetch endpoint
app.get('/tally/api/sandbox/entry', (req, res) => {
  try {
    const entries = getEntries();
    res.json({ success: true, data: entries });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 4. Sandbox Update endpoint
app.put('/tally/api/sandbox/entry/:id', (req, res) => {
  try {
    const updated = updateEntry(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Serve React Frontend
// Since we are deploying to /tally, the base path is /tally.
const frontendDist = path.join(__dirname, 'frontend/dist');
app.use('/tally', express.static(frontendDist));

// For React Router fallback (if we use routing, not necessary for this single page app but good practice)
app.use('/tally', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// Redirect root to /tally if hit directly
app.get('/', (req, res) => {
  res.redirect('/tally');
});

app.listen(PORT, () => {
  console.log(`Tally Sandbox Server running on http://localhost:${PORT}/tally`);
});
