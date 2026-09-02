const XLSX = require('xlsx');
const wb = XLSX.readFile('/Users/ratan/Downloads/RetailNodeV2/sample/Sales Invoice (1).csv');
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws, { defval: '' });
console.log(data.slice(0, 3));
