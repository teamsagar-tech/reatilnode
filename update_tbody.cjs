const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldTbodyStart = `<td className="border-r border-slate-300 px-1 py-[2px]">
                          <input autoComplete="off"  id={\`row-\${index}-rate\`} type="number" step="0.01" value={item.rate === undefined || item.rate === null ? '' : item.rate} onChange={e => updateProduct(index, 'rate', e.target.value)} onBlur={(e) => { if (e.target.value !== '') updateProduct(index, 'rate', Number(e.target.value).toFixed(2)); }} onKeyDown={(e) => handleKeyDown(e, index, 'rate')} className={\`w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold \${item.last_rate ? (parseFloat(item.rate) > item.last_rate ? 'text-red-600 bg-red-50' : parseFloat(item.rate) < item.last_rate ? 'text-green-600 bg-green-50' : '') : ''}\`} title={item.last_rate ? \`Last Rate: ₹\${item.last_rate}\` : ''} />
                        </td>
                        {showDiscCol && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input autoComplete="off"  id={\`row-\${index}-disc\`} type="number" value={item.disc === undefined || item.disc === null ? '' : item.disc} onChange={e => updateProduct(index, 'disc', e.target.value)} onBlur={(e) => { if (e.target.value !== '') updateProduct(index, 'disc', Number(e.target.value).toFixed(2)); }} onKeyDown={(e) => handleKeyDown(e, index, 'disc')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
                          </td>
                        )}
                        {showMRPCol && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input autoComplete="off"  id={\`row-\${index}-mrp\`} type="number" value={item.mrp === undefined || item.mrp === null ? '' : item.mrp} onChange={e => updateProduct(index, 'mrp', e.target.value)} onBlur={(e) => { if (e.target.value !== '') updateProduct(index, 'mrp', Number(e.target.value).toFixed(2)); }} onKeyDown={(e) => handleKeyDown(e, index, 'mrp')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
                          </td>
                        )}
                        {invoiceData.gstOn === 'items' && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input autoComplete="off"  id={\`row-\${index}-gst\`} type="number" step="0.01" value={item.gst === undefined || item.gst === null ? '' : item.gst} onChange={e => updateProduct(index, 'gst', e.target.value)} onBlur={(e) => { if (e.target.value !== '') updateProduct(index, 'gst', Number(e.target.value).toFixed(2)); }} onKeyDown={(e) => handleKeyDown(e, index, 'gst')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
                          </td>
                        )}
                        <td className="px-1 py-[2px]">
                          <input autoComplete="off"  type="text" value={((parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0) * (1 - (item.disc || 0)/100)).toFixed(2)} readOnly className="w-full bg-transparent focus:outline-none px-1 text-right font-bold" />
                        </td>`;

const newTbody = `                        {invoiceData.showMarkdown ? (
                          <>
                            <td className="border-r border-slate-300 px-1 py-[2px]">
                              <input autoComplete="off"  id={\`row-\${index}-mrp\`} type="number" value={item.mrp === undefined || item.mrp === null ? '' : item.mrp} onChange={e => updateProduct(index, 'mrp', e.target.value)} onBlur={(e) => { if (e.target.value !== '') updateProduct(index, 'mrp', Number(e.target.value).toFixed(2)); }} onKeyDown={(e) => handleKeyDown(e, index, 'mrp')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
                            </td>
                            {showDiscCol && (
                              <td className="border-r border-slate-300 px-1 py-[2px]">
                                <input autoComplete="off"  id={\`row-\${index}-disc\`} type="number" value={item.disc === undefined || item.disc === null ? '' : item.disc} onChange={e => updateProduct(index, 'disc', e.target.value)} onBlur={(e) => { if (e.target.value !== '') updateProduct(index, 'disc', Number(e.target.value).toFixed(2)); }} onKeyDown={(e) => handleKeyDown(e, index, 'disc')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
                              </td>
                            )}
                            <td className="border-r border-slate-300 px-1 py-[2px]">
                              <input autoComplete="off"  id={\`row-\${index}-rate\`} type="number" step="0.01" value={item.rate === undefined || item.rate === null ? '' : item.rate} onChange={e => updateProduct(index, 'rate', e.target.value)} onBlur={(e) => { if (e.target.value !== '') updateProduct(index, 'rate', Number(e.target.value).toFixed(2)); }} onKeyDown={(e) => handleKeyDown(e, index, 'rate')} className={\`w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold \${item.last_rate ? (parseFloat(item.rate) > item.last_rate ? 'text-red-600 bg-red-50' : parseFloat(item.rate) < item.last_rate ? 'text-green-600 bg-green-50' : '') : ''}\`} title={item.last_rate ? \`Last Rate: ₹\${item.last_rate}\` : ''} />
                            </td>
                            {invoiceData.gstOn === 'items' && (
                              <td className="border-r border-slate-300 px-1 py-[2px]">
                                <input autoComplete="off"  id={\`row-\${index}-gst\`} type="number" step="0.01" value={item.gst === undefined || item.gst === null ? '' : item.gst} onChange={e => updateProduct(index, 'gst', e.target.value)} onBlur={(e) => { if (e.target.value !== '') updateProduct(index, 'gst', Number(e.target.value).toFixed(2)); }} onKeyDown={(e) => handleKeyDown(e, index, 'gst')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
                              </td>
                            )}
                            <td className="border-r border-slate-300 px-1 py-[2px]">
                              <input autoComplete="off"  type="text" value={((parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0)).toFixed(2)} readOnly className="w-full bg-transparent focus:outline-none px-1 text-right font-bold" />
                            </td>
                            <td className="px-1 py-[2px]">
                              <input autoComplete="off" id={\`row-\${index}-sales_rate\`} type="number" step="0.01" value={item.sales_rate === undefined || item.sales_rate === null ? '' : item.sales_rate} onChange={e => updateProduct(index, 'sales_rate', e.target.value)} onBlur={(e) => { if (e.target.value !== '') updateProduct(index, 'sales_rate', Number(e.target.value).toFixed(2)); }} onKeyDown={(e) => handleKeyDown(e, index, 'sales_rate')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold text-[#1b5e58]" />
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="border-r border-slate-300 px-1 py-[2px]">
                              <input autoComplete="off"  id={\`row-\${index}-rate\`} type="number" step="0.01" value={item.rate === undefined || item.rate === null ? '' : item.rate} onChange={e => updateProduct(index, 'rate', e.target.value)} onBlur={(e) => { if (e.target.value !== '') updateProduct(index, 'rate', Number(e.target.value).toFixed(2)); }} onKeyDown={(e) => handleKeyDown(e, index, 'rate')} className={\`w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold \${item.last_rate ? (parseFloat(item.rate) > item.last_rate ? 'text-red-600 bg-red-50' : parseFloat(item.rate) < item.last_rate ? 'text-green-600 bg-green-50' : '') : ''}\`} title={item.last_rate ? \`Last Rate: ₹\${item.last_rate}\` : ''} />
                            </td>
                            {showDiscCol && (
                              <td className="border-r border-slate-300 px-1 py-[2px]">
                                <input autoComplete="off"  id={\`row-\${index}-disc\`} type="number" value={item.disc === undefined || item.disc === null ? '' : item.disc} onChange={e => updateProduct(index, 'disc', e.target.value)} onBlur={(e) => { if (e.target.value !== '') updateProduct(index, 'disc', Number(e.target.value).toFixed(2)); }} onKeyDown={(e) => handleKeyDown(e, index, 'disc')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
                              </td>
                            )}
                            {showMRPCol && (
                              <td className="border-r border-slate-300 px-1 py-[2px]">
                                <input autoComplete="off"  id={\`row-\${index}-mrp\`} type="number" value={item.mrp === undefined || item.mrp === null ? '' : item.mrp} onChange={e => updateProduct(index, 'mrp', e.target.value)} onBlur={(e) => { if (e.target.value !== '') updateProduct(index, 'mrp', Number(e.target.value).toFixed(2)); }} onKeyDown={(e) => handleKeyDown(e, index, 'mrp')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
                              </td>
                            )}
                            {invoiceData.gstOn === 'items' && (
                              <td className="border-r border-slate-300 px-1 py-[2px]">
                                <input autoComplete="off"  id={\`row-\${index}-gst\`} type="number" step="0.01" value={item.gst === undefined || item.gst === null ? '' : item.gst} onChange={e => updateProduct(index, 'gst', e.target.value)} onBlur={(e) => { if (e.target.value !== '') updateProduct(index, 'gst', Number(e.target.value).toFixed(2)); }} onKeyDown={(e) => handleKeyDown(e, index, 'gst')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
                              </td>
                            )}
                            <td className="px-1 py-[2px]">
                              <input autoComplete="off"  type="text" value={((parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0) * (1 - (item.disc || 0)/100)).toFixed(2)} readOnly className="w-full bg-transparent focus:outline-none px-1 text-right font-bold" />
                            </td>
                          </>
                        )}`;

if(content.includes(oldTbodyStart)) {
    content = content.replace(oldTbodyStart, newTbody);
    fs.writeFileSync(file, content);
    console.log("Updated tbody!");
} else {
    console.log("Failed to find tbody");
}

