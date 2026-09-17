import sys

new_history = """
## 2026-09-17: Party Invoice UI Defaults & Grid Cleanup Strictness
**Agent:** Antigravity (AI)
**Features Implemented:**
- **Invoice UI Defaults added to Party Master:** The `designNo`, `colourNo`, `showSize`, `showPurchaseDiscount`, and `showMarkdown` UI settings have been permanently added to the `Parties` table as a JSON column (`invoice_config`).
- **UI Integration in Master & Modal:** These checkboxes are now visible and editable in both `PartyMaster.tsx` (the main page) and `PartyModal.tsx` (the modal popup in invoices). They are equipped with React Optional Chaining `?.` to strictly prevent `undefined` crashes when creating new ledgers.
- **Immediate Config Propagation:** When editing or creating a vendor inside the `PurchaseInvoice.tsx` modal, the new `invoice_config` values are instantly injected into the active Invoice UI state upon save, bypassing the React background array update delay to provide real-time updates.
- **Strict Half-Entered Row Cleanup:** Upgraded the `cleanUpGrid` function in `PurchaseInvoice.tsx` to completely eradicate rows if their `qty` is not > 0 when focus exits the grid (such as clicking the Discount or Freight fields). Furthermore, `cleanUpGrid` will no longer append a blank row when cleaning up, satisfying the "no need of 2nd row" requirement.

**Files Modified:**
- `FrontEndV2/src/pages/masters/accounting/PartyMaster.tsx`
- `FrontEndV2/src/components/inventory/PartyModal.tsx`
- `FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx`
- `Backend/routes/partyRoutes.js`
- `Backend/controllers/partyController.js`
- `Backend/database/008_parties_schema.sql` (Executed on live DB)
"""

with open('HISTORY.md', 'a') as f:
    f.write(new_history)
