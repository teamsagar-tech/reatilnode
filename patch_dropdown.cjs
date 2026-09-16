const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `{suggestion.isSizeSet && <span className="text-[10px] px-1 bg-blue-100 text-blue-700 font-semibold rounded">Size Set</span>}`;
const replacement = `{suggestion.isSizeSet && <span className="text-[10px] px-1 bg-blue-100 text-blue-700 font-semibold rounded">Size Set {suggestion.size_scale ? \`(\${suggestion.size_scale})\` : ''}</span>}`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content);
  console.log('Patched PurchaseInvoice dropdown');
} else {
  console.log('Target not found');
}
