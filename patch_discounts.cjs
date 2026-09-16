const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetDiscount = `{/* Discount */}
                  <div className="flex border-b border-slate-300 bg-white">
                    <div className="w-[45%] border-r border-slate-300 px-1 py-0 bg-[#fcfaf2]">Discount %</div>
                    <div className="w-[20%] border-r border-slate-300 px-0 py-0">
                      <input type="number" value={invoiceData.discountPercent || ''} onChange={e => handleInvoiceChange('discountPercent', parseFloat(e.target.value) || 0)} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-center" />
                    </div>
                    <div className="w-[35%] px-0 py-0">
                      <input type="number" value={invoiceData.discountPercent > 0 ? Number(calcDiscount.toFixed(2)) : (invoiceData.discountAmount || '')} onChange={e => handleInvoiceChange('discountAmount', parseFloat(e.target.value) || 0)} readOnly={invoiceData.discountPercent > 0} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right" />
                    </div>
                  </div>`;
                  
const replacementDiscount = `{/* Discount */}
                  <div className="flex border-b border-slate-300 bg-white">
                    <div className="w-[45%] border-r border-slate-300 px-1 py-0 bg-[#fcfaf2]">Discount %</div>
                    <div className="w-[20%] border-r border-slate-300 px-0 py-0">
                      <input type="number" step="0.01" value={invoiceData.discountPercent > 0 ? Number(invoiceData.discountPercent).toFixed(2) : (invoiceData.discountAmount > 0 && taxableAmount > 0 ? ((invoiceData.discountAmount / taxableAmount) * 100).toFixed(2) : '')} onChange={e => { handleInvoiceChange('discountPercent', parseFloat(e.target.value) || 0); handleInvoiceChange('discountAmount', 0); }} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-center" />
                    </div>
                    <div className="w-[35%] px-0 py-0">
                      <input type="number" step="0.01" value={invoiceData.discountAmount > 0 ? Number(invoiceData.discountAmount).toFixed(2) : (invoiceData.discountPercent > 0 ? Number(calcDiscount).toFixed(2) : '')} onChange={e => { handleInvoiceChange('discountAmount', parseFloat(e.target.value) || 0); handleInvoiceChange('discountPercent', 0); }} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right" />
                    </div>
                  </div>`;
                  
if (content.includes(targetDiscount)) {
    content = content.replace(targetDiscount, replacementDiscount);
    console.log("Patched Discount");
}

const targetCommission = `{/* Commission */}
                  <div className="flex border-b border-slate-300 bg-white">
                    <div className="w-[45%] border-r border-slate-300 px-1 py-0 bg-[#fcfaf2]">Commission %</div>
                    <div className="w-[20%] border-r border-slate-300 px-0 py-0">
                      <input type="number" value={invoiceData.commissionPercent || ''} onChange={e => handleInvoiceChange('commissionPercent', parseFloat(e.target.value) || 0)} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-center" />
                    </div>
                    <div className="w-[35%] px-0 py-0">
                      <input type="number" value={invoiceData.commissionPercent > 0 ? Number(calcCommission.toFixed(2)) : (invoiceData.commissionAmount || '')} onChange={e => handleInvoiceChange('commissionAmount', parseFloat(e.target.value) || 0)} readOnly={invoiceData.commissionPercent > 0} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right" />
                    </div>
                  </div>`;
                  
const replacementCommission = `{/* Commission */}
                  <div className="flex border-b border-slate-300 bg-white">
                    <div className="w-[45%] border-r border-slate-300 px-1 py-0 bg-[#fcfaf2]">Commission %</div>
                    <div className="w-[20%] border-r border-slate-300 px-0 py-0">
                      <input type="number" step="0.01" value={invoiceData.commissionPercent > 0 ? Number(invoiceData.commissionPercent).toFixed(2) : (invoiceData.commissionAmount > 0 && afterDiscount > 0 ? ((invoiceData.commissionAmount / afterDiscount) * 100).toFixed(2) : '')} onChange={e => { handleInvoiceChange('commissionPercent', parseFloat(e.target.value) || 0); handleInvoiceChange('commissionAmount', 0); }} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-center" />
                    </div>
                    <div className="w-[35%] px-0 py-0">
                      <input type="number" step="0.01" value={invoiceData.commissionAmount > 0 ? Number(invoiceData.commissionAmount).toFixed(2) : (invoiceData.commissionPercent > 0 ? Number(calcCommission).toFixed(2) : '')} onChange={e => { handleInvoiceChange('commissionAmount', parseFloat(e.target.value) || 0); handleInvoiceChange('commissionPercent', 0); }} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right" />
                    </div>
                  </div>`;
                  
if (content.includes(targetCommission)) {
    content = content.replace(targetCommission, replacementCommission);
    console.log("Patched Commission");
}

fs.writeFileSync(file, content);
