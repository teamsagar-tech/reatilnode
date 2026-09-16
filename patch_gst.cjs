const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetGST = `<input id={\`row-\${index}-gst\`} type="number" value={item.gst || ''}`;
const replacementGST = `<input id={\`row-\${index}-gst\`} type="number" step="0.01" value={item.gst !== undefined && item.gst !== null && item.gst !== '' ? Number(item.gst).toFixed(2) : ''}`;

if (content.includes(targetGST)) {
  content = content.replace(targetGST, replacementGST);
  console.log('Patched GST input in row');
} else {
  console.log('Target GST input not found');
}

// And rate as well? The screenshot showed Rate as 5450.8, maybe they want Rate with 2 decimals too?
// "GST % always to be in 2 decimal value" - only GST % was mentioned explicitly.

fs.writeFileSync(file, content);
