require('dotenv').config();
const path = require('path');
const express = require('express');
const store = require('./lib/store');
const { parseUserAgent } = require('./lib/ua');
const { summarize } = require('./lib/summarize');

const app = express();
const PORT = process.env.PORT || 3000;

// 1x1 transparent GIF
const PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBTAA7',
  'base64'
);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/track/:id.png', (req, res) => {
  const { id } = req.params;
  const userAgent = req.headers['user-agent'] || null;
  const { browser, os, device } = parseUserAgent(userAgent);

  store.recordOpen(id, {
    timestamp: new Date().toISOString(),
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    userAgent,
    browser,
    os,
    device,
  });

  res.set({
    'Content-Type': 'image/gif',
    'Content-Length': PIXEL.length,
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    Pragma: 'no-cache',
    Expires: '0',
  });
  res.end(PIXEL);
});

app.get('/opens/:id', (req, res) => {
  const record = store.get(req.params.id);
  if (!record) return res.status(404).json({ error: 'unknown tracker id' });
  res.json(record);
});

app.get('/opens', (req, res) => {
  res.json(store.all());
});

app.get('/api/opens', (req, res) => {
  res.json(summarize(store.all()));
});

app.listen(PORT, () => {
  console.log(`Tracking server listening on http://localhost:${PORT}`);
});
