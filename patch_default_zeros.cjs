const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldInitialState = `disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0, attributes: [], category: null }`;
const newInitialState = `disc: '', gst: '', design: '', colour: '', size: '', mrp: '', attributes: [], category: null }`;
content = content.replace(oldInitialState, newInitialState);

const oldAddProduct = `qty: '', cut_size: '', pieces: '', rate: '', last_rate: null, disc: last ? (last.disc || 0) : 0, disc2: last ? (last.disc2 || 0) : 0, gst: 0, design: '', colour: '', size: '', mrp: 0`;
const newAddProduct = `qty: '', cut_size: '', pieces: '', rate: '', last_rate: null, disc: last ? last.disc : '', disc2: last ? last.disc2 : '', gst: '', design: '', colour: '', size: '', mrp: ''`;
content = content.replace(oldAddProduct, newAddProduct);

// Also verify in tbody that value={item.mrp === undefined || item.mrp === null ? '' : item.mrp} is safe for empty strings.
// It is. If it's '', it will show empty. 
// However, there is a place where we show 0.00:
// value={((parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0)).toFixed(2)}
// That's Amount. Amount can be 0.00.

fs.writeFileSync(file, content);
console.log("Updated default zeros to empty string!");
