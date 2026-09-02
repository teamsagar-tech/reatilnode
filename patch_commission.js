const fs = require('fs');

function patchFile(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Patch Discount Amount Input
    const oldDisc = `<input type="number" value={invoiceData.discountAmount || ''} onChange={e => handleInvoiceChange('discountAmount', parseFloat(e.target.value) || 0)} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right" />`;
    const newDisc = `<input type="number" value={invoiceData.discountPercent > 0 ? calcDiscount.toFixed(2) : (invoiceData.discountAmount || '')} onChange={e => handleInvoiceChange('discountAmount', parseFloat(e.target.value) || 0)} readOnly={invoiceData.discountPercent > 0} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right" />`;
    
    // Patch Commission Amount Input
    const oldComm = `<input type="number" value={invoiceData.commissionAmount || ''} onChange={e => handleInvoiceChange('commissionAmount', parseFloat(e.target.value) || 0)} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right" />`;
    const newComm = `<input type="number" value={invoiceData.commissionPercent > 0 ? calcCommission.toFixed(2) : (invoiceData.commissionAmount || '')} onChange={e => handleInvoiceChange('commissionAmount', parseFloat(e.target.value) || 0)} readOnly={invoiceData.commissionPercent > 0} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right" />`;

    content = content.replace(oldDisc, newDisc).replace(oldComm, newComm);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Patched Commission/Discount in', filePath);
  }
}

patchFile('FrontEnd/src/pages/inventory/PurchaseInvoice.tsx');
patchFile('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx');
