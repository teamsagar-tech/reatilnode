import sys
with open('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', 'r') as f:
    content = f.read()

old_local_save = """    try {
      localStorage.setItem(`party_pref_${invoiceData.supplier}`, JSON.stringify({
        designNo: invoiceData.designNo,
        colourNo: invoiceData.colourNo,
        showSize: invoiceData.showSize
      }));
    } catch(e) {}"""

content = content.replace(old_local_save, "")

with open('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', 'w') as f:
    f.write(content)
