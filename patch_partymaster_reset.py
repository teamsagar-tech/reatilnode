import sys
with open('FrontEndV2/src/pages/masters/accounting/PartyMaster.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "gstRawData: null,\n          contacts: []\n        });",
    "gstRawData: null,\n          contacts: [],\n          invoiceConfig: { designNo: false, colourNo: false, showSize: false, showPurchaseDiscount: false, showMarkdown: false }\n        });"
)

with open('FrontEndV2/src/pages/masters/accounting/PartyMaster.tsx', 'w') as f:
    f.write(content)
