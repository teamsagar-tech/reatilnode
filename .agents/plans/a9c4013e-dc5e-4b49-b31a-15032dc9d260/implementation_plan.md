# One-Click Item & Brand Creation during Import

Instead of just showing a static error message when an imported item or brand is missing from the database, we will transform the Validation Errors modal into an **Interactive Resolution Hub**.

## User Review Required

Please review the proposed UI flow for the "One-Click Create" functionality.

## Proposed Changes

### 1. Interactive Validation Modal (`PurchaseInvoice.tsx`)
We will upgrade the current red validation popup into a table that lists all missing items and brands found in the Excel file.
- **Unmapped Items Table:** Shows the `Item Name`, `Brand`, `HSN`, `Purchase Rate`, and `MRP` directly extracted from the Excel row.
- **Action Buttons:** Next to each row, there will be a **"Create Item"** button.

### 2. Auto-Creation Logic
When you click **"Create Item"**:
1. The frontend will immediately send a request to your backend (`POST /api/items`) using the data from that Excel row (e.g. assigning the extracted HSN, Brand, and Rate to the new item).
2. If the Brand is also missing, it will automatically create the Brand first (`POST /api/masters/brand`), then link it to the Item.
3. Upon success, the item will disappear from the errors list.
4. The system will auto-link the newly created `item_id` to the Purchase Invoice grid, so you can seamlessly continue!

### 3. "Create All" Bulk Action
We will also add a **"Create All Missing Items"** button at the top of the modal. With a single click, it will loop through all missing items and brands, create them in the backend, and clear the errors list.

## Verification Plan
1. Import `SE_N_2569_26-27.xls`.
2. The modal will pop up showing the 20 missing items (like `MANGO KASHMIRI D`) and their corresponding details.
3. Click "Create All Missing Items".
4. Verify the modal closes, the items are created in your master database, and the Purchase Invoice grid is now fully validated and ready for submission.
