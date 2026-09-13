# Store Size Matrix & Pre-Tax Charges Data Properly

We need to ensure that the data captured by the new `SizeAllocationModal` (Matrix Data) and `AdditionalChargesModal` (Pre-Tax Charges) is saved correctly into the database.

During our investigation, we found the following backend constraints:

1. **Pre-Tax Charges Database Fields Missing**:
   The `PurchaseInvoices` table does not have columns to store `freight`, `insurance`, and `packing_charges`.
   
2. **Matrix Rate/MRP Database Fields Missing**:
   The backend logic tries to insert `purchase_rate` and `mrp` into the `PurchaseInvoiceItemAttributes` table for size matrix data, but these columns do not exist in the database schema, which would cause a crash.

3. **Size Group Tracking Missing**:
   The `PurchaseInvoiceItems` table stores the main line item, but it doesn't currently store the `size_group_id` that generated the matrix. This is required if we want to properly re-edit or track the specific size set used for that row.

4. **Matrix Size-Wise Price & Qty Missing**:
   While the backend tries to insert size-wise `purchase_rate` and `mrp`, it fails because the columns are missing. The frontend also wasn't sending the matrix `qty`, `rate`, and `mrp` values.

5. **Frontend Payload Mapping Missing**:
   The `PurchaseInvoice.tsx` currently strips out `matrixData` when constructing the JSON payload, meaning size matrix data never reaches the backend. Pre-tax charges and the `size_group_id` are also not sent.

## User Review Required

> [!WARNING]
> This requires database schema modifications (`ALTER TABLE`) which I will apply to the server once you approve. Please confirm you are okay with adding these columns.

## Proposed Changes

### Database Schema (Local & Production 162.19.81.108)
I will execute the following SQL to add the missing columns:
```sql
ALTER TABLE PurchaseInvoices 
  ADD COLUMN freight DECIMAL(15,2) DEFAULT 0,
  ADD COLUMN insurance DECIMAL(15,2) DEFAULT 0,
  ADD COLUMN packing_charges DECIMAL(15,2) DEFAULT 0;

ALTER TABLE PurchaseInvoiceItems
  ADD COLUMN size_group_id INT NULL;

ALTER TABLE PurchaseInvoiceItemAttributes 
  ADD COLUMN purchase_rate DECIMAL(15,2) NULL,
  ADD COLUMN mrp DECIMAL(15,2) NULL;
```

### Backend (`controllers/purchaseInvoiceController.js`)
#### [MODIFY] `purchaseInvoiceController.js`
- Extract `freight`, `insurance`, and `packing_charges` from `req.body`.
- Include them in the `INSERT INTO PurchaseInvoices` SQL query.
- Add `size_group_id` to the `INSERT INTO PurchaseInvoiceItems` SQL query mapping.

### Frontend (`PurchaseInvoice.tsx` & `SizeAllocationModal.tsx`)
#### [MODIFY] `SizeAllocationModal.tsx`
- Ensure `summaryInfo` exports `size_group_id: selectedGroupId`.

#### [MODIFY] `PurchaseInvoice.tsx`
- In `handleSaveInvoice`, include `freight`, `insurance`, and `packing_charges` in the root `payload`.
- In `handleSaveInvoice` inside `payload.items` mapping, ensure `matrixData: p.matrixData || []` and `size_group_id: p.size_group_id` are passed to the backend.
- When `SizeAllocationModal` triggers `onSave`, update the product row with `size_group_id: summaryInfo.size_group_id`.

## Verification Plan
1. Alter tables manually via SSH.
2. Complete backend & frontend edits and run the frontend build + rsync.
3. Verify that creating a Purchase Invoice with F2 charges and Size Matrix successfully saves without API crashes.
