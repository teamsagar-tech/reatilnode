# Purchase Invoice Architecture Upgrade

I have completed the refactoring of the `PurchaseInvoice.tsx` grid based on the data analysis from `RsDB_Archive`. 

## 1. Category-Aware Intelligent Grid
The data entry grid is now contextually aware of the **Category** of the item you select.
- When you type and select an item, the grid instantly analyzes its master category (`Innerwear`, `Readywear`, `Suiting`, `Saree`).
- It automatically builds a customized Tally-style `Enter` key navigation path just for that specific row.
- **Example:** Hitting `Enter` on a Saree item will instantly skip the `MRP`, `Discount`, and `Size` fields and drop you straight into `Amount/Next Row`. Hitting `Enter` on an Innerwear item will strictly require `MRP`.

## 2. Auto-Trigger Matrix Modal
For `Readywear` and `Innerwear` items, the moment you select the item from the dropdown, the `MultiAttributeModal` (Size/Colour/Barcode matrix) will **automatically pop up**. You no longer need to manually press `Alt+X` to invoke it.

## 3. Clean Interface (No Manual Global Toggles)
I have stripped out the confusing manual column toggles (`Alt+M` for Markdown, `Alt+V` for Discount). 
The grid headers now evaluate the items present in the bill. If *any* item in the bill is Innerwear/Readywear, the MRP column automatically appears. If it's a pure Saree bill, the MRP column completely disappears, keeping the screen clean.

### What's Next?
The code is saved directly to your local `RetailNodeV2` codebase. You can test it out by firing up `npm run dev` and creating a new Purchase Invoice. Try selecting an item from the "Saree" category and another from "Innerwear" to see how the row behaves!
