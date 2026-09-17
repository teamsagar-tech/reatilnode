import sys
with open('FrontEndV2/src/components/inventory/PartyModal.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "onSave({ id: isEdit ? editPartyData.id : data.partyId, ...payload, name: payload.partyName, brand_type: payload.brandType });",
    "onSave({ id: isEdit ? editPartyData.id : data.partyId, ...payload, name: payload.partyName, brand_type: payload.brandType, invoice_config: payload.invoiceConfig });"
)

with open('FrontEndV2/src/components/inventory/PartyModal.tsx', 'w') as f:
    f.write(content)
