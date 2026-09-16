const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(file, 'utf8');

const t1 = `<input type="number" value={(invoiceData.taxPercent || 0)/2} readOnly className="w-full bg-transparent px-1 text-center text-slate-500 font-normal outline-none" />`;
const r1 = `<input type="text" value={Number((invoiceData.taxPercent || 0)/2).toFixed(2)} readOnly className="w-full bg-transparent px-1 text-center text-slate-500 font-normal outline-none" />`;
content = content.replaceAll(t1, r1);

const t2 = `<input type="number" value={invoiceData.taxPercent || 0} readOnly className="w-full bg-transparent px-1 text-center text-slate-500 font-normal outline-none" />`;
const r2 = `<input type="text" value={Number(invoiceData.taxPercent || 0).toFixed(2)} readOnly className="w-full bg-transparent px-1 text-center text-slate-500 font-normal outline-none" />`;
content = content.replaceAll(t2, r2);

// And Rate column while we are at it
const tRate = `<input id={\`row-\${index}-rate\`} type="number" value={item.rate}`;
const rRate = `<input id={\`row-\${index}-rate\`} type="number" step="0.01" value={item.rate !== undefined && item.rate !== null && item.rate !== '' ? Number(item.rate).toFixed(2) : ''}`;
if (content.includes(tRate)) {
    content = content.replace(tRate, rRate);
    console.log("Patched Rate column to 2 decimal");
}

fs.writeFileSync(file, content);
console.log("Patched global GST");
