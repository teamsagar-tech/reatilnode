# Restore MRP Markdown Logic and Grid Sequence

## Goal
Restore the uncommitted changes that were accidentally lost during the layout refactoring. This includes the exact grid sequence for `MRP Markdown` mode, the `Disc 2%` and `Sale Rate` columns, and the correct bottom subtotal and amount calculations to prevent double-discounting.

## Why this happened
During the UI layout fix for the Footer, I reverted the file to an older state which accidentally wiped out uncommitted changes you made locally earlier today regarding `Disc 2%`, `Sale Rate`, and the MRP markdown sequence. I take full responsibility for this and will ensure it is correctly restored.

## Proposed Sequence (When MRP Markdown is Checked)

After the `Quantity` column, the sequence will strictly be:
1. **MRP** (`mrp`)
2. **Disc 1 %** (`disc`)
3. **Rate** (`rate`) - *Auto-calculates as: `MRP * (1 - Disc1/100)`*
4. **GST%** (`gst`) - *(If GST On Items is enabled)*
5. **Amount** - *Calculates as: `Qty * Rate` (No double discount!)*
6. **Disc 2 %** (`disc2`) - *New Column*
7. **Sale Rate** (`sale_rate`) - *Calculates as: `Rate * (1 - Disc2/100)` or `MRP * (1 - TotalDisc)` based on your exact requirement.*

## Open Questions for You (Please clarify before I execute)
> [!IMPORTANT]
> 1. **Sale Rate Formula**: Should `Sale Rate` be calculated as a discount on the `Rate` (e.g., `Sale Rate = Rate * (1 - Disc2/100)`) or on the `MRP`?
> 2. **Amount Formula**: Since `Rate` will be auto-calculated from `MRP` and `Disc 1`, I will make sure `Amount` is simply `Qty * Rate` and `Subtotal` is the sum of `Amount`. Is this correct?

## Proposed Changes

### [PurchaseInvoice.tsx]
#### [MODIFY] `PurchaseInvoice.tsx`
- **State Update**: Add `disc2: 0` and `sale_rate: ''` to the `products` initialization, `addProduct` function, and Size Matrix save functions.
- **Table Headers**: Rearrange the `<th ...>` tags to match the sequence above when `showMarkdown` is true.
- **Table Cells**: Rearrange the `<td ...>` tags inside the map loop to match the header sequence.
- **Auto-Calculation Logic**: Update `updateProduct` so that:
  - If `MRP` or `Disc 1` changes -> `Rate` is updated.
  - If `Disc 2` changes -> `Sale Rate` is updated.
- **Keyboard Navigation**: Update the `handleKeyDown` fields array so that `Enter/Tab` flows perfectly through the new sequence: `..., 'qty', 'mrp', 'disc', 'rate', 'gst', 'disc2', 'sale_rate']`.
- **Bottom Subtotal**: Fix the `subtotal` reduction formula so it strictly sums up `(Qty * Rate)` without subtracting the discount twice.

## Verification Plan
After deploying, I will ask you to:
1. Check the `MRP Markdown` box.
2. Enter an item, set Qty to 10, MRP to 440, and Disc 1 to 42%. 
3. Verify that Rate auto-fills to 255.20, and Amount shows 2552.00.
4. Verify that entering a Disc 2% correctly populates the Sale Rate.
