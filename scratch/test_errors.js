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

const availableBrands = [];
const availableItems = [];
const errors = [];

const importedProducts = data.map((row, idx) => {
    const item = getVal(row, ['Product Desc.', 'ITEM', 'Product Name']);
    const qty = parseFloat(getVal(row, ['Qty', 'QTY', 'PCS', 'Quantity'])) || 0;
    const rate = parseFloat(getVal(row, ['Rate', 'RATE', 'PRATE'])) || 0;
    const brand = getVal(row, ['BRAND', 'Brand']);
    const hsn = getVal(row, ['HSN', 'HSN/SAC']).toString();
    const mrp = parseFloat(getVal(row, ['Mrp', 'MRP'])) || 0;
    const gst = parseFloat(getVal(row, ['GST %', 'GSTPERC', 'Tax %'])) || 0;

    let brand_id = null;
    if (brand) {
        if (!errors.find(e => e.type === 'brand' && e.brand === brand)) {
            errors.push({ idx: idx + 1, item, brand, hsn, rate, mrp, gst, type: 'brand' });
        }
    }

    let item_id = null;
    if (item) {
        errors.push({ idx: idx + 1, item, brand, hsn, rate, mrp, gst, type: 'item' });
    }

    return { item, qty, rate };
}).filter(p => (p.item !== undefined && p.item !== null && String(p.item).trim() !== ''));

console.log(`Total errors: ${errors.length}`);
