# Fix Matrix Rate Syncing Bug

I have successfully traced and resolved the bug where saving the Matrix would randomly fail to update the Rate and other fields in the main invoice table.

## What was wrong?
In `PurchaseInvoice.tsx`, when you clicked **Save Matrix**, the code attempted to update the main row's `qty`, `rate`, and `mrp`. However, if you were editing the **very last row** in the invoice table, the code automatically tried to add a new empty row underneath it. 

Because of how the state was structured (using a stale `products` closure to append the new row), the final command to "add an empty row" accidentally overwrote all the `qty`, `rate`, and `mrp` updates that were *just* applied milliseconds prior, reverting them back to blanks!

## How it was fixed:
- I overhauled the `onSave` logic in `SizeAllocationModal` inside `PurchaseInvoice.tsx`.
- The state updates are now bundled into a single atomic functional `setProducts` update, preventing the stale closure from wiping out your matrix allocation data.
- The average rate, total quantity, and matrix size information will now flawlessly sync to the main table upon clicking "Save Matrix", even if you are on the last row!

> [!TIP]
> **Verification**:
> The hotfix has already been compiled and deployed to the live server! Hard refresh the app on the live server (`Ctrl+Shift+R`), create a new invoice row, set some quantities in the Matrix, and click Save. The Rate and Amount will instantly populate.
