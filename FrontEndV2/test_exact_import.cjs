const XLSX = require('./node_modules/xlsx');
const fs = require('fs');

const bstr = fs.readFileSync('/Users/ratan/Downloads/RetailNodeV2/sample/Sales Invoice (1).csv', 'binary');
const wb = XLSX.read(bstr, { type: 'binary' });
const wsname = wb.SheetNames[0];
const ws = wb.Sheets[wsname];
const data = XLSX.utils.sheet_to_json(ws, { defval: '' });

console.log("Number of raw rows parsed:", data.length);

if (data.length > 0) {
  const firstRow = data[0];
  console.log("--- Header Parsing ---");
  const invoiceData = {};
  const headerMap = {
    'Doc No.': 'billNo',
    'INVDATE': 'billDate',
    'Date': 'billDate',
    'LRNO': 'lrNo',
    'TRANSPORT': 'transporter',
    'ADAT %': 'commissionPercent',
    'SALESPERSON': 'purchaser',
    'SUPPLIER': 'supplier',
    'PARTY': 'supplier'
  };
  
  for (const [key, value] of Object.entries(firstRow)) {
    const trimmedKey = key.trim();
    if (headerMap[trimmedKey] && value) {
      if (trimmedKey === 'PARTY' && invoiceData.supplier) {
         console.log("SKIPPING PARTY because supplier is already set to:", invoiceData.supplier);
      } else {
         invoiceData[headerMap[trimmedKey]] = value;
         console.log(`Mapped ${trimmedKey} -> ${value}`);
      }
    }
  }
  console.log("Final Invoice Data:", invoiceData);

  console.log("--- Row Filtering ---");
  const importedProducts = data.map((row, idx) => {
    const getVal = (keys) => {
      for (const k of keys) {
        if (row[k] !== undefined && row[k] !== '') return row[k];
      }
      return '';
    };

    const item = getVal(['Product Desc.', 'ITEM', 'Product Name']);
    const qty = parseFloat(getVal(['Qty', 'QTY', 'PCS', 'Quantity'])) || 0;
    
    return {
      id: Date.now() + idx,
      item,
      qty: qty.toString()
    };
  }).filter(p => (p.item !== undefined && p.item !== null && String(p.item).trim() !== '') || Number(p.qty) > 0);

  console.log("Final Products:", importedProducts);
}
