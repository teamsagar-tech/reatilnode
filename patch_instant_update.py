import sys
with open('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', 'r') as f:
    content = f.read()

new_logic = """          handleInvoiceChange('supplier', newParty.name);
          if (newParty.invoice_config) {
             try {
                 const config = typeof newParty.invoice_config === 'string' ? JSON.parse(newParty.invoice_config) : newParty.invoice_config;
                 setInvoiceData(prev => ({
                    ...prev,
                    designNo: config.designNo ?? prev.designNo,
                    colourNo: config.colourNo ?? prev.colourNo,
                    showSize: config.showSize ?? prev.showSize,
                    showPurchaseDiscount: config.showPurchaseDiscount ?? prev.showPurchaseDiscount,
                    showMarkdown: config.showMarkdown ?? prev.showMarkdown
                 }));
             } catch(e) {}
          }
          setShowPartyModal(false);"""

content = content.replace(
    "          handleInvoiceChange('supplier', newParty.name);\n          setShowPartyModal(false);",
    new_logic
)

with open('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', 'w') as f:
    f.write(content)
