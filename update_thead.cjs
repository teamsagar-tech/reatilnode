const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldThead = `                      <th className="px-1 py-1 border-r border-slate-300 w-[70px] text-center">Quantity</th>
                      <th className="px-1 py-1 border-r border-slate-300 w-[80px] text-center">Rate</th>
                      {showDiscCol && <th className="px-1 py-1 border-r border-slate-300 w-[60px] text-center">Disc%</th>}
                      {showMRPCol && <th className="px-1 py-1 border-r border-slate-300 w-[70px] text-center">MRP</th>}
                      {invoiceData.gstOn === 'items' && <th className="px-1 py-1 border-r border-slate-300 w-[60px] text-center">GST%</th>}
                      <th className="px-1 py-1 w-[100px] text-center">Amount</th>`;

const newThead = `                      {invoiceData.showMarkdown ? (
                        <>
                          <th className="px-1 py-1 border-r border-slate-300 w-[70px] text-center">Quantity</th>
                          <th className="px-1 py-1 border-r border-slate-300 w-[70px] text-center">MRP</th>
                          {showDiscCol && <th className="px-1 py-1 border-r border-slate-300 w-[60px] text-center">Disc%</th>}
                          <th className="px-1 py-1 border-r border-slate-300 w-[80px] text-center">Rate</th>
                          {invoiceData.gstOn === 'items' && <th className="px-1 py-1 border-r border-slate-300 w-[60px] text-center">GST%</th>}
                          <th className="px-1 py-1 border-r border-slate-300 w-[100px] text-center">Amount</th>
                          <th className="px-1 py-1 w-[80px] text-center">Sales Rate</th>
                        </>
                      ) : (
                        <>
                          <th className="px-1 py-1 border-r border-slate-300 w-[70px] text-center">Quantity</th>
                          <th className="px-1 py-1 border-r border-slate-300 w-[80px] text-center">Rate</th>
                          {showDiscCol && <th className="px-1 py-1 border-r border-slate-300 w-[60px] text-center">Disc%</th>}
                          {showMRPCol && <th className="px-1 py-1 border-r border-slate-300 w-[70px] text-center">MRP</th>}
                          {invoiceData.gstOn === 'items' && <th className="px-1 py-1 border-r border-slate-300 w-[60px] text-center">GST%</th>}
                          <th className="px-1 py-1 w-[100px] text-center">Amount</th>
                        </>
                      )}`;

content = content.replace(oldThead, newThead);
fs.writeFileSync(file, content);
console.log("Updated thead logic");
