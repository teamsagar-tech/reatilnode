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

const errors = [];
const importedProducts = data.map((row, idx) => {
    const item = getVal(row, ['Product Desc.', 'ITEM', 'Product Name']);
    const qty = parseFloat(getVal(row, ['Qty', 'QTY', 'PCS', 'Quantity'])) || 0;
    const rate = parseFloat(getVal(row, ['Rate', 'RATE', 'PRATE'])) || 0;
    return { item, qty, rate };
});

console.log(`Parsed ${data.length} rows`);
console.log(`First row item: "${importedProducts[0].item}"`);
console.log(`4th row item: "${importedProducts[3].item}"`);
