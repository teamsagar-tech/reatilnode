const fs = require('fs');
let file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix Size onBlur
content = content.replace(
  `onClick={() => { setActiveSizeRow(index); setSizeSuggestionIndex(0); }} className="w-full`,
  `onClick={() => { setActiveSizeRow(index); setSizeSuggestionIndex(0); }} onBlur={() => setTimeout(() => setActiveSizeRow(null), 200)} className="w-full`
);

// 2. Fix updateProduct logic properly
const updateProductRegex = /if \(invoiceData\.showMarkdown\) \{\s*if \(field === 'mrp' \|\| field === 'disc' \|\| field === 'rate'\) \{[\s\S]*?\}\s*\}/;
const newUpdateProduct = `if (invoiceData.showMarkdown) {
        if (field === 'mrp' || field === 'disc' || field === 'rate') {
          const m = parseFloat(p.mrp) || 0;
          if (field === 'mrp' || field === 'disc') {
            const d = parseFloat(p.disc) || 0;
            if (m > 0) p.rate = (m * (1 - d / 100)).toFixed(2);
          } else if (field === 'rate') {
            const r = parseFloat(p.rate) || 0;
            if (m > 0 && r > 0 && r <= m) p.disc = parseFloat((((m - r) / m) * 100).toFixed(2));
            else if (m > 0 && r === 0) p.disc = 0;
          }
          if (field === 'mrp' && (parseFloat(p.disc2) || 0) > 0) {
            p.sale_rate = (m * (1 - (parseFloat(p.disc2) || 0) / 100)).toFixed(2);
          }
        }
        if (field === 'mrp' || field === 'disc2' || field === 'sale_rate') {
          const m = parseFloat(p.mrp) || 0;
          if (field === 'mrp' || field === 'disc2') {
             const d2 = parseFloat(p.disc2) || 0;
             if (m > 0) p.sale_rate = (m * (1 - d2 / 100)).toFixed(2);
          } else if (field === 'sale_rate') {
             const sr = parseFloat(p.sale_rate) || 0;
             if (m > 0 && sr > 0 && sr <= m) p.disc2 = parseFloat((((m - sr) / m) * 100).toFixed(2));
             else if (m > 0 && sr === 0) p.disc2 = 0;
          }
        }
      }`;
content = content.replace(updateProductRegex, newUpdateProduct);

// 3. Fix <td> sequence which completely failed last time!
const startIdx = content.indexOf('<td className="border-r border-slate-300 px-1 py-[2px]">');
const searchString = `                          <input id={\`row-\${index}-rate\`} type="number" value={item.rate} onChange={e => updateProduct(index, 'rate', e.target.value)} onKeyDown={(e) => handleKeyDown(e, index, 'rate')} className={\`w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold \${item.last_rate ? (parseFloat(item.rate) > item.last_rate ? 'text-red-600 bg-red-50' : parseFloat(item.rate) < item.last_rate ? 'text-green-600 bg-green-50' : '') : ''}\`} title={item.last_rate ? \`Last Rate: ₹\${item.last_rate}\` : ''} />
                        </td>
                        {showDiscCol && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input id={\`row-\${index}-disc\`} type="number" value={item.disc || ''} onChange={e => updateProduct(index, 'disc', parseFloat(e.target.value) || 0)} onKeyDown={(e) => handleKeyDown(e, index, 'disc')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
                          </td>
                        )}
                        {showMRPCol && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input id={\`row-\${index}-mrp\`} type="number" value={item.mrp || ''} onChange={e => updateProduct(index, 'mrp', parseFloat(e.target.value) || 0)} onKeyDown={(e) => handleKeyDown(e, index, 'mrp')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
                          </td>
                        )}
                        {invoiceData.gstOn === 'items' && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input id={\`row-\${index}-gst\`} type="number" value={item.gst || ''} onChange={e => updateProduct(index, 'gst', parseFloat(e.target.value) || 0)} onKeyDown={(e) => handleKeyDown(e, index, 'gst')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
                          </td>
                        )}
                        <td className="px-1 py-[2px]">
                          <input type="text" value={((parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0) * (1 - (item.disc || 0)/100)).toFixed(2)} readOnly className="w-full bg-transparent focus:outline-none px-1 text-right font-bold" />
                        </td>`;

const replacementTds = `{!invoiceData.showMarkdown && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input id={\`row-\${index}-rate\`} type="number" value={item.rate} onChange={e => updateProduct(index, 'rate', e.target.value)} onKeyDown={(e) => handleKeyDown(e, index, 'rate')} className={\`w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold \${item.last_rate ? (parseFloat(item.rate) > item.last_rate ? 'text-red-600 bg-red-50' : parseFloat(item.rate) < item.last_rate ? 'text-green-600 bg-green-50' : '') : ''}\`} title={item.last_rate ? \`Last Rate: ₹\${item.last_rate}\` : ''} />
                          </td>
                        )}
                        {!invoiceData.showMarkdown && showDiscCol && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input id={\`row-\${index}-disc\`} type="number" value={item.disc || ''} onChange={e => updateProduct(index, 'disc', parseFloat(e.target.value) || 0)} onKeyDown={(e) => handleKeyDown(e, index, 'disc')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
                          </td>
                        )}
                        {invoiceData.showMarkdown && (
                          <>
                            <td className="border-r border-slate-300 px-1 py-[2px]">
                              <input id={\`row-\${index}-mrp\`} type="number" value={item.mrp || ''} onChange={e => updateProduct(index, 'mrp', parseFloat(e.target.value) || 0)} onKeyDown={(e) => handleKeyDown(e, index, 'mrp')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
                            </td>
                            <td className="border-r border-slate-300 px-1 py-[2px]">
                              <input id={\`row-\${index}-disc\`} type="number" value={item.disc || ''} onChange={e => updateProduct(index, 'disc', parseFloat(e.target.value) || 0)} onKeyDown={(e) => handleKeyDown(e, index, 'disc')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold text-red-600" />
                            </td>
                            <td className="border-r border-slate-300 px-1 py-[2px]">
                              <input id={\`row-\${index}-rate\`} type="number" value={item.rate} onChange={e => updateProduct(index, 'rate', e.target.value)} onKeyDown={(e) => handleKeyDown(e, index, 'rate')} className={\`w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold text-green-700 \${item.last_rate ? (parseFloat(item.rate) > item.last_rate ? 'text-red-600 bg-red-50' : parseFloat(item.rate) < item.last_rate ? 'text-green-600 bg-green-50' : '') : ''}\`} title={item.last_rate ? \`Last Rate: ₹\${item.last_rate}\` : ''} />
                            </td>
                          </>
                        )}
                        {invoiceData.gstOn === 'items' && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input id={\`row-\${index}-gst\`} type="number" value={item.gst || ''} onChange={e => updateProduct(index, 'gst', parseFloat(e.target.value) || 0)} onKeyDown={(e) => handleKeyDown(e, index, 'gst')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
                          </td>
                        )}
                        <td className={\`px-1 py-[2px] \${invoiceData.showMarkdown ? 'border-r border-slate-300' : ''}\`}>
                          <input type="text" value={invoiceData.showMarkdown ? ((parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0)).toFixed(2) : ((parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0) * (1 - (item.disc || 0)/100)).toFixed(2)} readOnly className="w-full bg-transparent focus:outline-none px-1 text-right font-bold text-slate-900 bg-slate-100" />
                        </td>
                        {invoiceData.showMarkdown && (
                          <>
                            <td className="border-r border-slate-300 px-1 py-[2px]">
                              <input id={\`row-\${index}-mrp_2\`} type="number" value={item.mrp || ''} onChange={e => updateProduct(index, 'mrp', parseFloat(e.target.value) || 0)} onKeyDown={(e) => handleKeyDown(e, index, 'mrp_2')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold text-gray-500" />
                            </td>
                            <td className="border-r border-slate-300 px-1 py-[2px]">
                              <input id={\`row-\${index}-disc2\`} type="number" value={item.disc2 || ''} onChange={e => updateProduct(index, 'disc2', parseFloat(e.target.value) || 0)} onKeyDown={(e) => handleKeyDown(e, index, 'disc2')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold text-red-600" />
                            </td>
                            <td className="px-1 py-[2px]">
                              <input id={\`row-\${index}-sale_rate\`} type="number" value={item.sale_rate} onChange={e => updateProduct(index, 'sale_rate', e.target.value)} onKeyDown={(e) => handleKeyDown(e, index, 'sale_rate')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold text-blue-700" />
                            </td>
                          </>
                        )}`;

if (content.includes(searchString)) {
  content = content.replace(searchString, replacementTds);
  console.log("SUCCESS: Replaced TDs!");
} else {
  console.log("FAILED: Could not find search string for TDs. Here is a snippet around rate:");
  console.log(content.substring(startIdx, startIdx + 1000));
}

fs.writeFileSync(file, content);
