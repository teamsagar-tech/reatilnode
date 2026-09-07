# Phase 9: Purchase Orders & Core Financial Ledgers

You are completely correct. While our new MySQL architecture has the foundation for Inventory and POS, we missed porting the **Procurement (Purchase Orders)** module and the deep **Financial Ledger Logic** from the legacy `onevastra` backend. Just copying the tables wasn't enough; we need to wire up the ERP logic.

I have researched the legacy source code and identified exactly what we need to build for this phase to achieve true 1:1 ERP functionality.

## 1. Purchase Orders (Procurement)
In the legacy system, this was managed under `OrderInvoice.js`. 
**Proposed Fix**:
- **Schema**: Create `015_purchase_orders_schema.sql` (PurchaseOrders, PurchaseOrderItems) to track PO status (Pending, Approved, Fulfilled).
- **Backend Logic**: Create `purchaseOrderController.js` to handle creation and approval of POs.
- **Frontend UI**: Build `PurchaseOrder.tsx` in the frontend (matching the Tally-style grid) so you can raise POs to vendors.
- **Integration**: Update `purchaseInvoiceController.js` (GRN) so that when goods arrive, it can link to a PO and mark it as "Fulfilled".

## 2. Party Ledgers (Accounts Payable/Receivable)
In the legacy system, `PartyPayment.js` tracked all the running balances. In our new system, if you do a Credit Sale (Udhaar) at the POS, the amount is saved to the `SalesBills` table, but there is no running ledger to track the customer's total outstanding balance!
**Proposed Fix**:
- **Schema**: Create `016_ledgers_schema.sql` (`PartyLedgers`) to track every Debit/Credit transaction (Invoices, Payments, Returns).
- **Backend Logic**: Hook up the ledger logic!
  - When `salesController.js` processes a POS bill with `credit_amount > 0`, it will automatically insert a **Debit** entry into the customer's ledger.
  - When `purchaseInvoiceController.js` processes a GRN, it will automatically insert a **Credit** entry into the vendor's ledger.
  - When `returnsController.js` processes a return, it will automatically reverse the ledger balances.

## User Review Required
> [!IMPORTANT]
> **Ledger Balances**: Should I add a real-time `current_balance` column to the `Parties` table that auto-updates on every ledger insert (faster for the UI to read), or should the UI calculate the balance dynamically by summing the `PartyLedgers` history? (I recommend auto-updating `current_balance` on the `Parties` table for performance).

> [!WARNING]
> **Purchase Order Budgets**: The legacy app had a `PurchaseBudgetStatus` model. Do you want me to rebuild the Budget enforcement logic as well, or just stick to standard Purchase Orders for now?

Please review and approve this plan so we can wire up the true core ERP logic!
