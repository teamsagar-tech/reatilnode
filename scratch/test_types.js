const XLSX = require('xlsx');
const fs = require('fs');

const bstr = fs.readFileSync('sample/Sales Invoice.csv', 'binary');
const wb = XLSX.read(bstr, { type: 'binary' });
const wsname = wb.SheetNames[0];
const ws = wb.Sheets[wsname];
const data = XLSX.utils.sheet_to_json(ws, { defval: '' });

const getVal = (row, keys) => {
    for (const k of keys) {
    if (row[k] !== undefined && row[k] !== '') return row[k];
    }
    return '';
};

for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const brand = getVal(row, ['BRAND', 'Brand']);
    const item = getVal(row, ['Product Desc.', 'ITEM', 'Product Name']);
    if (typeof brand === 'number' || typeof item === 'number') {
        console.log(`Row ${i} has number: brand=${typeof brand}, item=${typeof item}`);
    }
}
