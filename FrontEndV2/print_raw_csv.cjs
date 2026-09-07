const XLSX = require('./node_modules/xlsx');
const fs = require('fs');

const bstr = fs.readFileSync('/Users/ratan/Downloads/RetailNodeV2/sample/Sales Invoice (1).csv', 'binary');
const wb = XLSX.read(bstr, { type: 'binary' });
const wsname = wb.SheetNames[0];
const ws = wb.Sheets[wsname];
const data = XLSX.utils.sheet_to_json(ws, { defval: '' });

console.log("RAW DATA:");
data.forEach((row, i) => {
  console.log(`ROW ${i}:`, row);
});
