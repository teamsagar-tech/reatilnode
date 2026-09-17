import sys
with open('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', 'r') as f:
    content = f.read()

new_logic = """      toast.success(`Purchase Invoice Saved Successfully! GRN No: ${data.grn_no}`);

      // Auto-Learn Invoice Config if not present
      if (matchedVendor && !matchedVendor.invoice_config) {
        try {
          await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/party/${matchedVendor.id}/invoice-config`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              invoiceConfig: {
                designNo: invoiceData.designNo,
                colourNo: invoiceData.colourNo,
                showSize: invoiceData.showSize,
                showPurchaseDiscount: invoiceData.showPurchaseDiscount,
                showMarkdown: invoiceData.showMarkdown
              }
            })
          });
          // Update the vendor in local state so it doesn't auto-save repeatedly if they don't refresh
          setVendors(prev => prev.map(v => v.id === matchedVendor.id ? {
            ...v, 
            invoice_config: JSON.stringify({
                designNo: invoiceData.designNo,
                colourNo: invoiceData.colourNo,
                showSize: invoiceData.showSize,
                showPurchaseDiscount: invoiceData.showPurchaseDiscount,
                showMarkdown: invoiceData.showMarkdown
            })
          } : v));
        } catch (e) {
          console.error('Failed to auto-save invoice config to party master', e);
        }
      }

      if (importQueue.length > 0) {"""

content = content.replace(
    "      toast.success(`Purchase Invoice Saved Successfully! GRN No: ${data.grn_no}`);\n      if (importQueue.length > 0) {",
    new_logic
)

with open('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', 'w') as f:
    f.write(content)
