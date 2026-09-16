const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix rate
content = content.replace(
  /value={item\.rate !== undefined && item\.rate !== null && item\.rate !== '' \? Number\(item\.rate\)\.toFixed\(2\) : ''} onChange={e => updateProduct\(index, 'rate', e\.target\.value\)}/g,
  `value={item.rate === undefined || item.rate === null ? '' : item.rate} onChange={e => updateProduct(index, 'rate', e.target.value)} onBlur={(e) => { if (e.target.value !== '') updateProduct(index, 'rate', Number(e.target.value).toFixed(2)); }}`
);

// Fix disc
content = content.replace(
  /value={item\.disc \|\| ''} onChange={e => updateProduct\(index, 'disc', parseFloat\(e\.target\.value\) \|\| 0\)}/g,
  `value={item.disc === undefined || item.disc === null ? '' : item.disc} onChange={e => updateProduct(index, 'disc', e.target.value)} onBlur={(e) => { if (e.target.value !== '') updateProduct(index, 'disc', Number(e.target.value).toFixed(2)); }}`
);

// Fix mrp
content = content.replace(
  /value={item\.mrp \|\| ''} onChange={e => updateProduct\(index, 'mrp', parseFloat\(e\.target\.value\) \|\| 0\)}/g,
  `value={item.mrp === undefined || item.mrp === null ? '' : item.mrp} onChange={e => updateProduct(index, 'mrp', e.target.value)} onBlur={(e) => { if (e.target.value !== '') updateProduct(index, 'mrp', Number(e.target.value).toFixed(2)); }}`
);

// Fix gst
content = content.replace(
  /value={item\.gst !== undefined && item\.gst !== null && item\.gst !== '' \? Number\(item\.gst\)\.toFixed\(2\) : ''} onChange={e => updateProduct\(index, 'gst', parseFloat\(e\.target\.value\) \|\| 0\)}/g,
  `value={item.gst === undefined || item.gst === null ? '' : item.gst} onChange={e => updateProduct(index, 'gst', e.target.value)} onBlur={(e) => { if (e.target.value !== '') updateProduct(index, 'gst', Number(e.target.value).toFixed(2)); }}`
);


fs.writeFileSync(file, content);
console.log("Fixed decimals");
