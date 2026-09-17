# Dynamic Party Invoice Configuration

Allow users to define specific invoice column configurations (Design No, Colour No, Size, Discount %, MRP Markdown) at the Party Master level. When a Party is selected during Purchase Invoice creation, their specific column configuration will be dynamically loaded. If a Party has no configuration saved yet, the system will intuitively learn and save the configuration when the user saves their first invoice for that Party.

## User Review Required

- This requires adding a JSON column to the `Parties` table to store this configuration flexibly.
- Are there any other checkboxes on the invoice screen (like "Cut Size") that you want to include in this master config in the future? Storing it as JSON allows us to easily add more later without changing the database schema again.

## Proposed Changes

### Backend Layer

#### [MODIFY] `Backend/controllers/partyController.js`
- Update `getParties` to select the new `invoice_config` column.
- Update `createParty` and `updateParty` queries to accept and store `invoice_config`.
- Create a new dedicated function `updatePartyInvoiceConfig(req, res)` that specifically updates just the `invoice_config` column. This will be used by the background-save feature in the Purchase Invoice screen.

#### [MODIFY] `Backend/routes/partyRoutes.js`
- Expose a new route: `PUT /api/masters/party/:id/invoice-config` pointing to the new controller function.

### Frontend Layer

#### [MODIFY] `FrontEndV2/src/pages/masters/inventory/PartyMaster.tsx`
- Add a new "Invoice UI Defaults" section to the UI with the 5 checkboxes (Design No, Colour No, Size, Discount %, MRP Markdown).
- Map these checkboxes to a new `formData.invoice_config` object so they can be viewed and edited by the user.

#### [MODIFY] `FrontEndV2/src/components/inventory/PartyModal.tsx`
- Replicate the exact same checkbox UI in the popup Party Modal so users can configure this when creating a party on-the-fly.

#### [MODIFY] `FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx`
- **Dynamic Loading:** Modify `handleInvoiceChange('supplier', val)`. When a supplier is selected, locate the supplier in the `vendors` array. If the vendor has an `invoice_config`, automatically apply those boolean values to `invoiceData` instead of relying on `localStorage`.
- **Auto-Learning (Background Save):** Modify `handleSaveInvoice()`. After the invoice saves successfully, check if the originally selected vendor had an empty/null `invoice_config`. If it was empty, fire an asynchronous background API request to `PUT /api/masters/party/:id/invoice-config` to permanently save the current checkbox states to that Party Master.

## Verification Plan

### Manual Verification
1. Open the Party Master, edit an existing party, check "Size" and "Discount %" in the new section, and Save.
2. Go to Purchase Invoice, select that Party, and verify that "Size" and "Discount %" checkboxes instantly activate.
3. Select a completely new party (with no configuration). Check "MRP Markdown" manually on the invoice screen, then Save the Invoice.
4. Go back to Party Master and verify that the newly saved Party has "MRP Markdown" checked automatically.
