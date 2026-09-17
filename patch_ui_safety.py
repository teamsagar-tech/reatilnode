import sys
import glob

for filename in ['FrontEndV2/src/components/inventory/PartyModal.tsx', 'FrontEndV2/src/pages/masters/accounting/PartyMaster.tsx']:
    with open(filename, 'r') as f:
        content = f.read()

    # Apply safe optional chaining
    content = content.replace("checked={formData.invoiceConfig.designNo}", "checked={formData.invoiceConfig?.designNo || false}")
    content = content.replace("checked={formData.invoiceConfig.colourNo}", "checked={formData.invoiceConfig?.colourNo || false}")
    content = content.replace("checked={formData.invoiceConfig.showSize}", "checked={formData.invoiceConfig?.showSize || false}")
    content = content.replace("checked={formData.invoiceConfig.showPurchaseDiscount}", "checked={formData.invoiceConfig?.showPurchaseDiscount || false}")
    content = content.replace("checked={formData.invoiceConfig.showMarkdown}", "checked={formData.invoiceConfig?.showMarkdown || false}")

    with open(filename, 'w') as f:
        f.write(content)
