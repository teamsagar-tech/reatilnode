const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetLogic = `      if (Math.abs(diff) > 0 && Math.abs(diff) < 10) {
         if (Number((invoiceData.roundOff || 0).toFixed(2)) !== Number(diff.toFixed(2))) {
            setInvoiceData(prev => ({ ...prev, roundOff: Number(diff.toFixed(2)) }));
         }
      }`;
const replacementLogic = `      if (Math.abs(diff) < 10) {
         if (Number((invoiceData.roundOff || 0).toFixed(2)) !== Number(diff.toFixed(2))) {
            setInvoiceData(prev => ({ ...prev, roundOff: Number(diff.toFixed(2)) }));
         }
      }`;

if (content.includes(targetLogic)) {
  content = content.replace(targetLogic, replacementLogic);
  console.log('Patched billAmount round off logic');
}

const targetLogic2 = `       if (Math.abs(diff) > 0 && Math.abs(diff) < 1) { // Normal round off is always < 1
          if (Number((invoiceData.roundOff || 0).toFixed(2)) !== Number(diff.toFixed(2))) {
             setInvoiceData(prev => ({ ...prev, roundOff: Number(diff.toFixed(2)) }));
          }
       }`;
const replacementLogic2 = `       if (Math.abs(diff) < 1) {
          if (Number((invoiceData.roundOff || 0).toFixed(2)) !== Number(diff.toFixed(2))) {
             setInvoiceData(prev => ({ ...prev, roundOff: Number(diff.toFixed(2)) }));
          }
       }`;
       
if (content.includes(targetLogic2)) {
  content = content.replace(targetLogic2, replacementLogic2);
  console.log('Patched auto round off logic');
}

// Now for the 2 decimal places in the input
const targetInput = `<input type="number" value={invoiceData.roundOff || ''} onChange={e => handleInvoiceChange('roundOff', parseFloat(e.target.value) || 0)} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right" />`;
const replacementInput = `<input type="number" step="0.01" value={invoiceData.roundOff !== undefined ? invoiceData.roundOff.toFixed(2) : '0.00'} onChange={e => handleInvoiceChange('roundOff', parseFloat(e.target.value) || 0)} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right" />`;

if (content.includes(targetInput)) {
  content = content.replace(targetInput, replacementInput);
  console.log('Patched input display');
} else {
  // Try alternative format
  const t2 = `<input type="number" value={invoiceData.roundOff || ''} onChange={e => handleInvoiceChange('roundOff', parseFloat(e.target.value) || 0)}`;
  const r2 = `<input type="number" step="0.01" value={invoiceData.roundOff !== undefined ? Number(invoiceData.roundOff).toFixed(2) : '0.00'} onChange={e => handleInvoiceChange('roundOff', parseFloat(e.target.value) || 0)}`;
  if (content.includes(t2)) {
      content = content.replace(t2, r2);
      console.log('Patched input display (partial match)');
  }
}

fs.writeFileSync(file, content);
