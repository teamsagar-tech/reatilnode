# Optimize Purchase Invoice Data Entry 

Based on our analysis of 2,000 invoices across `RsDB_Archive`, we have proven that the data requirements drastically shift depending on the clothing category (e.g., Sarees need zero MRPs and zero Barcodes; Innerwear needs 100% Barcodes and MRPs; Suiting needs Cuts/Fractions).

Currently, `PurchaseInvoice.tsx` uses global manual toggles (`Alt+X`, `Alt+M`, `Alt+V`) or crude Supplier-level category matching to show/hide columns. This is not flawless and requires high user effort.

## Proposed Changes

### 1. Item-Level Category Awareness (Dynamic Grid Rows)
Instead of forcing the entire grid to show/hide the `MRP`, `Barcode`, `GST`, and `Discount` columns, the grid will react intelligently to the **selected item**.
- When an item mapped to **Innerwear** is selected, the row will strictly require `MRP` and `Barcode`.
- When an item mapped to **Saree** is selected, the `MRP` and `Barcode` fields will grey out (disable) and skip over during `Enter` key navigation, speeding up data entry.
- When an item mapped to **Suiting** is selected, the `Qty` field will auto-switch to a fractional input and prompt for `Cut Size`.

### 2. Keyboard Navigation Refinement (Tally Style)
We will rewrite the `onKeyDown` handlers inside the grid to ensure flawless "Tally-style" data entry:
- Hitting `Enter` will move to the next logical cell.
- If a cell is disabled (e.g., MRP for Sarees), `Enter` will automatically skip it.
- Hitting `Enter` on the last cell (Amount) will automatically spawn a new row and focus the Item Name input.

### 3. Smart Matrix Popups (MultiAttributeModal)
Currently, users have to manually trigger `MultiAttributeModal`. We will change this so that if an item belongs to **Readywear** or **Innerwear** (which use Sizes and Colors), the matrix modal will **auto-open** the moment the user selects the item.
For **Sarees**, it will not open, keeping the flow purely linear.

### 4. Remove Clunky Global Toggles
We will clean up the UI by removing the manual `Alt+M` (Show Markdown/MRP) and `Alt+V` (Show Discount) toggles. The UI will automatically render these headers if at least one item in the grid requires them, keeping the interface clean but perfectly contextual.

## User Review Required

> [!IMPORTANT]
> The biggest change here is moving from "Global Invoice Settings" to "Item-Specific Row Behavior". This means the user must select the **Item Name** first before typing the Quantity/Rate, so the system knows what fields to enable/disable. Does this match your intended workflow?

## Verification Plan
- [ ] Open Purchase Invoice UI.
- [ ] Select a Saree item -> Verify MRP is skipped on `Enter`.
- [ ] Select an Innerwear item -> Verify MRP is required and Matrix auto-opens.
- [ ] Ensure `Alt+S` saves without errors and respects the new payload structure.
