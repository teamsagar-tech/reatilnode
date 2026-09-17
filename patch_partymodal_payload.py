import sys
with open('FrontEndV2/src/components/inventory/PartyModal.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "brandType: brandType\n      };",
    "brandType: brandType,\n        invoiceConfig: formData.invoiceConfig\n      };"
)

with open('FrontEndV2/src/components/inventory/PartyModal.tsx', 'w') as f:
    f.write(content)
