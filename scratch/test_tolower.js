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

try {
    const importedProducts = data.map((row, idx) => {
        const item = getVal(row, ['Product Desc.', 'ITEM', 'Product Name']);
        const brand = getVal(row, ['BRAND', 'Brand']);

        let brand_id = null;
        if (brand) {
            const matchedBrand = availableBrands.find(b => (b.name || '').toLowerCase() === brand.toLowerCase());
        }

        let item_id = null;
        if (item) {
            const matchedItem = availableItems.find(i => (i.name || i.item_name || '').toLowerCase() === item.toLowerCase());
        }

        return { item };
    });
    console.log('Passed');
} catch (e) {
    console.log('Failed:', e.message);
}
