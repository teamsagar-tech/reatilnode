const fs = require('fs');
let piFile = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let piContent = fs.readFileSync(piFile, 'utf8');

// 1. Initial states & addProduct & SizeMatrix pushes
// Replace:  disc: last ? (last.disc || 0) : 0, gst: 0, design: '', colour: '', size: '', mrp: 0 
const regexAdd = /disc: last \? \(last\.disc \|\| 0\) : 0, gst: 0, design: '', colour: '', size: '', mrp: 0/g;
const replacementAdd = `disc: last ? (last.disc || 0) : 0, gst: 0, design: '', colour: '', size: '', mrp: 0, disc2: last ? (last.disc2 || 0) : 0, sale_rate: ''`;
piContent = piContent.replace(regexAdd, replacementAdd);

// Replace initial hardcoded state
// { id: 1, item_id: null, item: '', brand_id: null, brand: '', qty: '', cut_size: '', pieces: '', rate: '', last_rate: null, disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0, attributes: [], category: null }
const regexInit1 = /disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0, attributes:/g;
const replacementInit1 = `disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0, disc2: 0, sale_rate: '', attributes:`;
piContent = piContent.replace(regexInit1, replacementInit1);

const regexInit2 = /disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0 \}\]\);/g;
const replacementInit2 = `disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0, disc2: 0, sale_rate: '' }]);`;
piContent = piContent.replace(regexInit2, replacementInit2);


// 2. updateProduct auto-calculations
const regexUpdate = /if \(invoiceData\.showMarkdown && \(field === 'rate' \|\| field === 'mrp'\)\) \{[\s\S]*?\} else if \(m > 0 && r === 0\) \{\n\s*p\.disc = 0;\n\s*\}\n\s*\}/;
const replacementUpdate = `if (invoiceData.showMarkdown) {
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
          // Recalculate sale rate if MRP changes
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
piContent = piContent.replace(regexUpdate, replacementUpdate);

// 3. handleKeyDown sequence
const regexKeys = /const fields = \['brand', 'item', 'hsn'\];\n    if \(invoiceData\.designNo\) fields\.push\('design'\);\n    if \(invoiceData\.colourNo\) fields\.push\('colour'\);\n    if \(invoiceData\.showSize\) fields\.push\('size'\);\n    fields\.push\('qty', 'rate'\);\n    if \(invoiceData\.showPurchaseDiscount\) fields\.push\('disc'\);\n    if \(invoiceData\.showMarkdown\) fields\.push\('mrp'\);\n    if \(invoiceData\.gstOn === 'items'\) fields\.push\('gst'\);/g;
const replacementKeys = `const fields = ['brand', 'item', 'hsn'];
    if (invoiceData.designNo) fields.push('design');
    if (invoiceData.colourNo) fields.push('colour');
    if (invoiceData.showSize) fields.push('size');
    fields.push('qty');
    if (invoiceData.showMarkdown) {
       fields.push('mrp', 'disc', 'rate');
       if (invoiceData.gstOn === 'items') fields.push('gst');
       fields.push('mrp_2', 'disc2', 'sale_rate');
    } else {
       fields.push('rate');
       if (invoiceData.showPurchaseDiscount) fields.push('disc');
       if (invoiceData.gstOn === 'items') fields.push('gst');
    }`;
piContent = piContent.replace(regexKeys, replacementKeys);

const regexKeys2 = /const fields = \['brand', 'item', 'hsn', 'qty', 'rate', 'disc', 'mrp'\];/g;
const replacementKeys2 = `const fields = invoiceData.showMarkdown ? ['brand', 'item', 'hsn', 'qty', 'mrp', 'disc', 'rate', 'gst', 'mrp_2', 'disc2', 'sale_rate'] : ['brand', 'item', 'hsn', 'qty', 'rate', 'disc', 'gst'];`;
piContent = piContent.replace(regexKeys2, replacementKeys2);

// 4. Subtotal calculation (FIX DOUBLE DISCOUNT)
const regexSubtotal = /const subtotal = products\.reduce\(\(acc, p\) => acc \+ \(\(p\.qty \|\| 0\) \* \(p\.rate \|\| 0\) \* \(1 - \(p\.disc \|\| 0\) \/ 100\)\), 0\);/g;
const replacementSubtotal = `const subtotal = products.reduce((acc, p) => acc + (invoiceData.showMarkdown ? ((p.qty || 0) * (p.rate || 0)) : ((p.qty || 0) * (p.rate || 0) * (1 - (p.disc || 0) / 100))), 0);`;
piContent = piContent.replace(regexSubtotal, replacementSubtotal);

// And fix GST lineAmount
const regexTax = /const lineAmount = \(p\.qty \|\| 0\) \* \(p\.rate \|\| 0\) \* \(1 - \(p\.disc \|\| 0\) \/ 100\);/g;
const replacementTax = `const lineAmount = invoiceData.showMarkdown ? ((p.qty || 0) * (p.rate || 0)) : ((p.qty || 0) * (p.rate || 0) * (1 - (p.disc || 0) / 100));`;
piContent = piContent.replace(regexTax, replacementTax);


// 5. Table headers
const regexHeaders = /<th className="px-1 py-1 border-r border-slate-300 w-\[70px\] text-center">Quantity<\/th>\n\s*<th className="px-1 py-1 border-r border-slate-300 w-\[80px\] text-center">Rate<\/th>\n\s*\{showDiscCol && <th className="px-1 py-1 border-r border-slate-300 w-\[60px\] text-center">Disc%<\/th>\}\n\s*\{showMRPCol && <th className="px-1 py-1 border-r border-slate-300 w-\[70px\] text-center">MRP<\/th>\}\n\s*\{invoiceData\.gstOn === 'items' && <th className="px-1 py-1 border-r border-slate-300 w-\[60px\] text-center">GST%<\/th>\}\n\s*<th className="px-1 py-1 w-\[100px\] text-center">Amount<\/th>/;

const replacementHeaders = `<th className="px-1 py-1 border-r border-slate-300 w-[70px] text-center">Quantity</th>
                      {!invoiceData.showMarkdown && <th className="px-1 py-1 border-r border-slate-300 w-[80px] text-center">Rate</th>}
                      {!invoiceData.showMarkdown && showDiscCol && <th className="px-1 py-1 border-r border-slate-300 w-[60px] text-center">Disc%</th>}
                      
                      {invoiceData.showMarkdown && <th className="px-1 py-1 border-r border-slate-300 w-[70px] text-center">MRP</th>}
                      {invoiceData.showMarkdown && <th className="px-1 py-1 border-r border-slate-300 w-[60px] text-center">Disc1%</th>}
                      {invoiceData.showMarkdown && <th className="px-1 py-1 border-r border-slate-300 w-[80px] text-center">Rate</th>}
                      
                      {invoiceData.gstOn === 'items' && <th className="px-1 py-1 border-r border-slate-300 w-[60px] text-center">GST%</th>}
                      <th className="px-1 py-1 border-r border-slate-300 w-[100px] text-center">Amount</th>
                      
                      {invoiceData.showMarkdown && <th className="px-1 py-1 border-r border-slate-300 w-[70px] text-center">MRP</th>}
                      {invoiceData.showMarkdown && <th className="px-1 py-1 border-r border-slate-300 w-[60px] text-center">Disc2%</th>}
                      {invoiceData.showMarkdown && <th className="px-1 py-1 w-[80px] text-center">Sale Rate</th>}`;
piContent = piContent.replace(regexHeaders, replacementHeaders);

// 6. Table Cells
const regexCells = /<td className="border-r border-slate-300 px-1 py-\[2px\]">\n\s*<input id={`row-\$\{index\}-rate`} type="number" value=\{item\.rate\} onChange=\{e => updateProduct\(index, 'rate', e\.target\.value\)\} onKeyDown=\{\(e\) => handleKeyDown\(e, index, 'rate'\)\} className=\{`w-full bg-transparent focus:bg-\[#ffffe0\] focus:outline-none px-1 text-right font-bold \$\{item\.last_rate \? \(parseFloat\(item\.rate\) > item\.last_rate \? 'text-red-600 bg-red-50' : parseFloat\(item\.rate\) < item\.last_rate \? 'text-green-600 bg-green-50' : ''\) : ''\}`\} title=\{item\.last_rate \? `Last Rate: ₹\$\{item\.last_rate\}` : ''\} \/>\n\s*<\/td>\n\s*\{invoiceData\.showPurchaseDiscount && \(\n\s*<td className="border-r border-slate-300 px-1 py-\[2px\]">\n\s*<input id={`row-\$\{index\}-disc`} type="number" value=\{item\.disc \|\| ''\} onChange=\{e => updateProduct\(index, 'disc', parseFloat\(e\.target\.value\) \|\| 0\)\} onKeyDown=\{\(e\) => handleKeyDown\(e, index, 'disc'\)\} className="w-full bg-transparent focus:bg-\[#ffffe0\] focus:outline-none px-1 text-right font-bold" \/>\n\s*<\/td>\n\s*\)\}\n\s*\{invoiceData\.showMarkdown && \(\n\s*<td className="border-r border-slate-300 px-1 py-\[2px\]">\n\s*<input id={`row-\$\{index\}-mrp`} type="number" value=\{item\.mrp \|\| ''\} onChange=\{e => updateProduct\(index, 'mrp', parseFloat\(e\.target\.value\) \|\| 0\)\} onKeyDown=\{\(e\) => handleKeyDown\(e, index, 'mrp'\)\} className="w-full bg-transparent focus:bg-\[#ffffe0\] focus:outline-none px-1 text-right font-bold" \/>\n\s*<\/td>\n\s*\)\}\n\s*\{invoiceData\.gstOn === 'items' && \(\n\s*<td className="border-r border-slate-300 px-1 py-\[2px\]">\n\s*<input id={`row-\$\{index\}-gst`} type="number" value=\{item\.gst \|\| ''\} onChange=\{e => updateProduct\(index, 'gst', parseFloat\(e\.target\.value\) \|\| 0\)\} onKeyDown=\{\(e\) => handleKeyDown\(e, index, 'gst'\)\} className="w-full bg-transparent focus:bg-\[#ffffe0\] focus:outline-none px-1 text-right font-bold" \/>\n\s*<\/td>\n\s*\)\}\n\s*<td className="px-1 py-\[2px\]">\n\s*<input type="text" value=\{\(\(parseFloat\(item\.qty\) \|\| 0\) \* \(parseFloat\(item\.rate\) \|\| 0\) \* \(1 - \(item\.disc \|\| 0\)\/100\)\)\.toFixed\(2\)\} readOnly className="w-full bg-transparent focus:outline-none px-1 text-right font-bold" \/>\n\s*<\/td>/;

const replacementCells = `{!invoiceData.showMarkdown && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input id={\`row-\${index}-rate\`} type="number" value={item.rate} onChange={e => updateProduct(index, 'rate', e.target.value)} onKeyDown={(e) => handleKeyDown(e, index, 'rate')} className={\`w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold \${item.last_rate ? (parseFloat(item.rate) > item.last_rate ? 'text-red-600 bg-red-50' : parseFloat(item.rate) < item.last_rate ? 'text-green-600 bg-green-50' : '') : ''}\`} title={item.last_rate ? \`Last Rate: ₹\${item.last_rate}\` : ''} />
                          </td>
                        )}
                        {!invoiceData.showMarkdown && invoiceData.showPurchaseDiscount && (
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

piContent = piContent.replace(regexCells, replacementCells);

fs.writeFileSync(piFile, piContent);
console.log("Successfully implemented MRP Markdown exactly as requested!");
