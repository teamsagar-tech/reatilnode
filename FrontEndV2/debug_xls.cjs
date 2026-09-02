const XLSX = require('./node_modules/xlsx');
const wb = XLSX.readFile('/Users/ratan/Downloads/RetailNodeV2/sample/SE_N_2569_26-27.xls');
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws, { defval: '' });
console.log("XLS Rows:", data.length);
if (data.length > 0) {
    console.log("First row:", data[0]);
    console.log("Second row:", data[1]);
    console.log("Third row:", data[2]);
}
