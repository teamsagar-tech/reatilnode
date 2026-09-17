import sys
with open('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', 'r') as f:
    content = f.read()

# Fix cleanUpGrid to strictly require qty
content = content.replace(
    "const cleaned = prev.filter(p => p.item || Number(p.qty) > 0);",
    "const cleaned = prev.filter(p => Number(p.qty) > 0);"
)

# Add onFocus to the footer discount input
content = content.replace(
    "input id=\"footer-discount\" type=\"number\" value={invoiceData.discountPercent || ''} onChange={e => handleInvoiceChange('discountPercent', parseFloat(e.target.value) || 0)} className=",
    "input id=\"footer-discount\" type=\"number\" value={invoiceData.discountPercent || ''} onChange={e => handleInvoiceChange('discountPercent', parseFloat(e.target.value) || 0)} onFocus={cleanUpGrid} className="
)

with open('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', 'w') as f:
    f.write(content)
