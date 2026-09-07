const fs = require('fs');
const XLSX = require('xlsx');

const fileBuffer = fs.readFileSync('sample/Sales Invoice (1).csv');
const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
const firstSheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[firstSheetName];
const data = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

const getVal = (row, keys) => {
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== '') return row[k];
  }
  return '';
};

const importedProducts = data.map((row, idx) => {
  const item = getVal(row, ['Product Desc.', 'ITEM', 'Product Name']);
  const qty = parseFloat(getVal(row, ['Qty', 'QTY', 'PCS', 'Quantity'])) || 0;
  const rate = parseFloat(getVal(row, ['Rate', 'RATE', 'PRATE'])) || 0;
  return { idx, item, qty, rate };
});

console.log("ALL MAPPED PRODUCTS:", importedProducts);

const filtered = importedProducts.filter(p => (p.item !== undefined && p.item !== null && String(p.item).trim() !== ''));

console.log("FILTERED PRODUCTS:", filtered);
