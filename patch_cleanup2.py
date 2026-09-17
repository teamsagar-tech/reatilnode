import sys
with open('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "onChange={e => handleInvoiceChange('discountAmount', parseFloat(e.target.value) || 0)} readOnly={invoiceData.discountPercent > 0} className=",
    "onChange={e => handleInvoiceChange('discountAmount', parseFloat(e.target.value) || 0)} onFocus={cleanUpGrid} readOnly={invoiceData.discountPercent > 0} className="
)

with open('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', 'w') as f:
    f.write(content)
