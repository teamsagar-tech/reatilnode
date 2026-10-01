const XLSX = require('xlsx');
const wb = XLSX.readFile('/Users/ratan/Downloads/RetailNodeV2/sample/Sales Invoice (1).csv');
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws, { defval: '' });
const importedProducts = data.map((row, idx) => {
    const getVal = (keys) => {
        for (const k of keys) {
            if (row[k] !== undefined && row[k] !== '') return row[k];
        }
        return '';
    };
    const item = getVal(['Product Desc.', 'ITEM', 'Product Name']);
    const qty = parseFloat(getVal(['Qty', 'QTY', 'PCS', 'Quantity'])) || 0;
    return { item, qty };
});
console.log(importedProducts.filter(p => (p.item && p.item.trim()) || Number(p.qty) > 0));
