const fs = require('fs');
const content = fs.readFileSync('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('<tr')) {
    console.log(`Line ${i+1}: ${line.trim()}`);
  }
});
