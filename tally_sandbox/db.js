const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'data.json');

if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([]));
}

const getEntries = () => {
  try {
    const content = fs.readFileSync(dataFile, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    return [];
  }
};

const saveEntry = (entry) => {
  const entries = getEntries();
  const newEntry = {
    id: Date.now().toString(),
    ...entry,
    createdAt: new Date().toISOString()
  };
  entries.push(newEntry);
  fs.writeFileSync(dataFile, JSON.stringify(entries, null, 2));
  return newEntry;
};

const updateEntry = (id, updatedData) => {
  const entries = getEntries();
  const index = entries.findIndex(e => e.id === id);
  if (index !== -1) {
    entries[index] = { ...entries[index], ...updatedData, updatedAt: new Date().toISOString() };
    fs.writeFileSync(dataFile, JSON.stringify(entries, null, 2));
    return entries[index];
  }
  throw new Error("Entry not found");
};

module.exports = { getEntries, saveEntry, updateEntry };
