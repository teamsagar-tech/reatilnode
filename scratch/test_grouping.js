const XLSX = require('xlsx');
const fs = require('fs');

const bstr = fs.readFileSync('sample/Sales Invoice.csv', 'binary');
const wb = XLSX.read(bstr, { type: 'binary' });
const wsname = wb.SheetNames[0];
const ws = wb.Sheets[wsname];
const data = XLSX.utils.sheet_to_json(ws, { defval: '' });

const getVal = (row, keys) => {
    for (const k of keys) {
        if (row[k] !== undefined && row[k] !== '') return String(row[k]);
    }
    return '';
};

// Group by INVNO
const grouped = {};
for (const row of data) {
    const invno = getVal(row, ['INVNO', 'Doc No.']);
    if (!invno) continue;
    if (!grouped[invno]) grouped[invno] = [];
    grouped[invno].push(row);
}

const groups = Object.values(grouped);
console.log(`Found ${groups.length} distinct invoices.`);
console.log(`Invoice 1 has ${groups[0].length} rows`);
console.log(`Invoice 2 has ${groups[1].length} rows`);
