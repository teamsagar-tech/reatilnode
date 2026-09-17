import sys
with open('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', 'r') as f:
    content = f.read()

old_logic = """      try {
        const prefStr = localStorage.getItem(`party_pref_${value}`);
        if (prefStr) {
          const pref = JSON.parse(prefStr);
          setInvoiceData(prev => ({
            ...prev,
            [field]: value,
            designNo: pref.designNo ?? prev.designNo,
            colourNo: pref.colourNo ?? prev.colourNo,
            showSize: pref.showSize ?? prev.showSize
          }));
          return;
        }
      } catch (e) {}"""

new_logic = """      const selectedVendor = vendors.find(v => (v.name || '').toLowerCase() === (value || '').toLowerCase());
      if (selectedVendor && selectedVendor.invoice_config) {
        try {
          const config = typeof selectedVendor.invoice_config === 'string' 
            ? JSON.parse(selectedVendor.invoice_config) 
            : selectedVendor.invoice_config;
          setInvoiceData(prev => ({
            ...prev,
            [field]: value,
            designNo: config.designNo ?? prev.designNo,
            colourNo: config.colourNo ?? prev.colourNo,
            showSize: config.showSize ?? prev.showSize,
            showPurchaseDiscount: config.showPurchaseDiscount ?? prev.showPurchaseDiscount,
            showMarkdown: config.showMarkdown ?? prev.showMarkdown
          }));
          return;
        } catch (e) {
          console.error("Error parsing invoice config:", e);
        }
      }"""

content = content.replace(old_logic, new_logic)

with open('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', 'w') as f:
    f.write(content)
