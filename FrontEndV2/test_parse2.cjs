const XLSX = require('./node_modules/xlsx');
const wb = XLSX.readFile('/Users/ratan/Downloads/RetailNodeV2/sample/Sales Invoice (1).csv');
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws, { defval: '' });
console.log("CSV Rows:", data.length);
if (data.length > 0) {
    console.log("First row keys:", Object.keys(data[0]));
    console.log("First row:", data[0]);
}
