# Excel Import Task List

- `[/]` Install `xlsx` package in `FrontEndV2`.
- `[ ]` Add "Import (Alt+I)" button and hidden `<input type="file">` to `PurchaseInvoice.tsx`.
- `[ ]` Implement `handleImport` logic with `xlsx` parsing.
  - Map generic column aliases (`Product Desc.`, `ITEM`, `Qty`, `PCS`, etc.).
  - Map header info if available (`INVNO`, `INVDATE`, `LRNO`, `TRANSPORT`, `SUPPLIER`).
- `[ ]` Test compilation.
- `[ ]` Update `walkthrough.md`.
