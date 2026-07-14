const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'opens.json');

function load() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function save(db) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function createTracker(id, meta) {
  const db = load();
  db[id] = { ...meta, opens: [] };
  save(db);
}

function recordOpen(id, meta) {
  const db = load();
  if (!db[id]) db[id] = { opens: [] };
  db[id].opens.push(meta);
  save(db);
  return db[id];
}

function get(id) {
  return load()[id];
}

function all() {
  return load();
}

module.exports = { createTracker, recordOpen, get, all };
