const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update fields logic 1
content = content.replace(
  /fields\.push\('qty', 'mrp'\);\n\s*if \(showDiscCol\) fields\.push\('disc'\);\n\s*fields\.push\('rate'\);\n\s*if \(invoiceData\.gstOn === 'items'\) fields\.push\('gst'\);\n\s*fields\.push\('sales_rate'\);/g,
  `fields.push('qty', 'mrp');\n      if (showDiscCol) fields.push('disc');\n      fields.push('rate');\n      if (invoiceData.gstOn === 'items') fields.push('gst');\n      fields.push('disc2', 'sales_rate');`
);

content = content.replace(
  /fields\.push\('qty', 'mrp'\);\n\s*if \(showDiscCol2\) fields\.push\('disc'\);\n\s*fields\.push\('rate'\);\n\s*if \(invoiceData\.gstOn === 'items'\) fields\.push\('gst'\);\n\s*fields\.push\('sales_rate'\);/g,
  `fields.push('qty', 'mrp');\n                                          if (showDiscCol2) fields.push('disc');\n                                          fields.push('rate');\n                                          if (invoiceData.gstOn === 'items') fields.push('gst');\n                                          fields.push('disc2', 'sales_rate');`
);

// Update updateProduct logic
const oldUpdateProduct = `// Auto-calculate Rate if MRP or Disc changes and MRP Markdown is checked
      if (invoiceData.showMarkdown && (field === 'mrp' || field === 'disc')) {
        const mrp = parseFloat(prod.mrp) || 0;
        const disc = parseFloat(prod.disc) || 0;
        if (mrp > 0) {
          prod.rate = (mrp * (1 - (disc / 100))).toFixed(2);
        }
      }`;

const newUpdateProduct = `// Auto-calculate Rate if MRP or Disc changes and MRP Markdown is checked
      if (invoiceData.showMarkdown && (field === 'mrp' || field === 'disc' || field === 'disc2')) {
        const mrp = parseFloat(prod.mrp) || 0;
        
        if (field === 'mrp' || field === 'disc') {
          const disc = parseFloat(prod.disc) || 0;
          if (mrp > 0) {
            prod.rate = (mrp * (1 - (disc / 100))).toFixed(2);
          }
        }
        
        if (field === 'mrp' || field === 'disc2') {
          const disc2 = parseFloat(prod.disc2) || 0;
          if (mrp > 0) {
            prod.sales_rate = (mrp * (1 - (disc2 / 100))).toFixed(2);
          }
        }
      }`;
      
content = content.replace(oldUpdateProduct, newUpdateProduct);

// Update thead
const oldThead = `<th className="px-1 py-1 border-r border-slate-300 w-[100px] text-center">Amount</th>
                          <th className="px-1 py-1 w-[80px] text-center">Sales Rate</th>`;
const newThead = `<th className="px-1 py-1 border-r border-slate-300 w-[100px] text-center">Amount</th>
                          <th className="px-1 py-1 border-r border-slate-300 w-[70px] text-center">MRP</th>
                          <th className="px-1 py-1 border-r border-slate-300 w-[60px] text-center">Disc 2%</th>
                          <th className="px-1 py-1 w-[80px] text-center">Sales Rate</th>`;
content = content.replace(oldThead, newThead);

// Update tbody
const oldTbody = `<td className="px-1 py-[2px]">
                              <input autoComplete="off" id={\`row-\${index}-sales_rate\`} type="number" step="0.01" value={item.sales_rate === undefined || item.sales_rate === null ? '' : item.sales_rate} onChange={e => updateProduct(index, 'sales_rate', e.target.value)} onBlur={(e) => { if (e.target.value !== '') updateProduct(index, 'sales_rate', Number(e.target.value).toFixed(2)); }} onKeyDown={(e) => handleKeyDown(e, index, 'sales_rate')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold text-[#1b5e58]" />
                            </td>`;

const newTbody = `<td className="border-r border-slate-300 px-1 py-[2px]">
                              <input autoComplete="off" type="text" value={item.mrp === undefined || item.mrp === null ? '' : item.mrp} readOnly className="w-full bg-transparent focus:outline-none px-1 text-right font-bold text-slate-500" />
                            </td>
                            <td className="border-r border-slate-300 px-1 py-[2px]">
                              <input autoComplete="off" id={\`row-\${index}-disc2\`} type="number" step="0.01" value={item.disc2 === undefined || item.disc2 === null ? '' : item.disc2} onChange={e => updateProduct(index, 'disc2', e.target.value)} onBlur={(e) => { if (e.target.value !== '') updateProduct(index, 'disc2', Number(e.target.value).toFixed(2)); }} onKeyDown={(e) => handleKeyDown(e, index, 'disc2')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
                            </td>
                            <td className="px-1 py-[2px]">
                              <input autoComplete="off" id={\`row-\${index}-sales_rate\`} type="number" step="0.01" value={item.sales_rate === undefined || item.sales_rate === null ? '' : item.sales_rate} onChange={e => updateProduct(index, 'sales_rate', e.target.value)} onBlur={(e) => { if (e.target.value !== '') updateProduct(index, 'sales_rate', Number(e.target.value).toFixed(2)); }} onKeyDown={(e) => handleKeyDown(e, index, 'sales_rate')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold text-[#1b5e58]" />
                            </td>`;
                            
content = content.replace(oldTbody, newTbody);

fs.writeFileSync(file, content);
console.log("Updated MRP markdown 2 logic!");
