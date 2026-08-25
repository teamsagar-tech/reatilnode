# FROST PIVOT SYSTEM - LOGIC BRAIN FILE

This document provides a detailed breakdown of the business logic, data flow, and architectural patterns for core modules in the Frost Pivot system.

---

## 1. Purchase Order (PO) Logic
**Core Controller:** `orderInvoice.js`
**Model:** `OrderInvoice.js`, `OrderInvoiceProduct.js`

### 1.1 Creation Workflow
1.  **Sequence Generation:** Generates a unique `OrderNo` (format: `ORD001`) using the `Global` counter model.
2.  **Product Initialization:** 
    *   Creates `OrderInvoiceProduct` entries for each item.
    *   Supports size/color matrices (rows) and location distribution.
    *   Updates `Item` defaults (design number, unit type) based on the PO.
3.  **Approval Logic:** 
    *   Super Admins: Automatically sets status to `Approved`.
    *   Others: Sets status to `Pending` for review.
4.  **Budget Integration:** Calls `validatePOBudget` to ensure the order stays within predefined financial limits.
5.  **Fulfillment Overlay:** Automatically creates a `PurchaseFulfillmentStatus` record to track how much of this PO is later fulfilled by Purchase Invoices.
6.  **Smart Budgeting:**
    *   **Logic:** Every PO is passed through `validatePOBudget`.
    *   **Intelligent Allocation:** If a category budget is missing, it auto-generates one based on the previous month's sales.
    *   **Utilization Tracking:** Updates granular category-level `utilizedAmount` for each product on PO creation.
    *   **Override System:** POs exceeding budget are flagged with `Pending-Override` status in `PurchaseBudgetStatus`.

### 1.2 Vendor Matching Engine
1.  **Digital Reconciliation:** Matches vendor-uploaded invoice data (Rate/Quantity) against the original PO.
2.  **Discrepancy Detection:** Flags "Price Changes", "Over-shipping", and "Extra Items".
3.  **PI Integration:** When converting a PO to a Purchase Invoice using a vendor invoice:
    *   Automatically uses vendor's actual rates/quantities.
    *   **Extra Item Support:** Injects items shipped by the vendor that weren't in the original PO into the PI data flow.

### 1.3 Access Control
*   **Super Admin:** Full access.
*   **Purchase Executive (PO):** Can only view/manage orders they created.
*   **Vendor (Party):** Can only view orders assigned to their `partyId`.

---

## 2. Purchase Invoice (PI) & Performa Invoice Logic
**Core Controllers:** `invoice.js`, `performaInvoice.js`
**Models:** `Invoice.js`, `PerformaInvoice.js`, `InvoiceProduct.js`

### 2.1 Purchase Invoice (PI) Flow
1.  **GRN Generation:** Assigns a unique Goods Receipt Note (GRN) using a daily sequence (format: `EFMMDD0001`).
2.  **Duplicate Check:** Strictly prevents duplicate `billNo` for the same `party` within the same financial year.
3.  **Financials:** 
    *   Calculates `taxableAmount`, `totalTaxAmount`, and `finalAmount`.
    *   Calculates `effectiveNetRate` for each product by applying invoice-level discounts and commissions to the base `netRate`.
4.  **Inventory State:** Products are created with `lrStatus: 'In Transit'` (unless 'By Hand'), meaning they are in the system but not yet "Open" for sale.
5.  **PO Linking:** If created from a PO, stores `orderInvoiceId` to track fulfillment.

### 2.2 Performa Invoice Logic
*   Acts as a "Proforma" or draft invoice.
*   Uses a `voucherNumber` sequence instead of GRN.
*   Does not affect "Live" inventory until converted or used as a reference for a real PI.

---

## 3. Lorry Receipt (LR) & Inwarding Logic
**Core Controllers:** `lrs.js`, `inward.js`, `invoice.js` (Transit part)

### 3.1 LR Lifecycle
1.  **In Transit:** Set when a PI is created with a transporter.
2.  **Received:** Marks the physical arrival.
3.  **Inwarding (Scanning):** 
    *   Uses `InwardRecord` to track the verification of boxes.
    *   **Stock Transfer Inward:** For branch-to-branch transfers, uses a socket-based real-time scanning interface.
    *   Supports "Extra" product detection (scanning items not in the manifest).

---

## 4. Label Printing Logic
**Core Controller:** `labelPrintController2.js`
**Model:** `LabelPrintSettings.js`, `Products.js`

### 4.1 Barcode Generation
1.  **Sequence Types:** 
    *   `Unique`: Every single piece gets a unique 8-digit barcode.
    *   `Batch`: All pieces of the same batch/style share one barcode.
    *   `Universal`: Uses a pre-existing group barcode.
2.  **Product Promotion:** When labels are printed, the "Invoice Product" is marked as `isOpened`, and individual `Product` (live inventory) entries are created.
3.  **Pricing Calculation:** 
    *   Calculates `VRP Rate` and `MRP`.
    *   Applies Salesman Commission settings (Percentage/Fixed) at the label level.
4.  **Meters Logic:** Special handling for fabric; allows "breaking" a total quantity into multiple unique barcodes with specific lengths.

---

## 5. Inventory Masters (Category, Subcategory, Style)
**Core Controllers:** `category.js`, `subCategory.js`, `style.js`

### 5.1 Hierarchy & Search
1.  **Structure:** `Department` -> `Category` -> `Subcategory`.
2.  **Search Optimization:** 
    *   Uses a Redis-based search index for ultra-fast lookups in the UI.
    *   Automated re-indexing on create/update/delete.
3.  **Grouped Retrieval:** Supports fetching categories grouped by department for easier navigation in sidebars/dropdowns.

---

## 6. HR & Employee Management Logic
**Core Controller:** `user.js`
**Model:** `User.js`, `UserCount.js`

### 6.1 Employee Identity
1.  **USERID:** A 6-digit numeric sequence (e.g., `000001`).
2.  **Employee ID:** A template-based string (e.g., `EMP-MMYY-0001`) generated based on firm settings.
3.  **Roles & Permissions:** 
    *   RBAC system where each user is assigned a `Role` with a matrix of permissions (Read, Write, Delete, Approve, etc.).
    *   Supports "Party" type users for Vendor Portal access.

### 6.2 Payroll Logic
*   Stores `salaryPerMonth`.
*   Tracks `department` and `location` history for payroll reporting.

---

## 7. Expense Management Logic
**Core Controller:** `expense.js`
**Model:** `Expense.js`, `ExpenseCategory.js`

### 7.1 Lifecycle
1.  **Categorization:** Expenses are linked to an `ExpenseCategory` (e.g., Operational, Salary, Rent).
2.  **Petty Cash:** A specialized flow that automatically uses the "Petty Cash" category and defaults vendor names.
3.  **Bank Integration:** Links expenses to `BankDetail` for non-cash payments (UPI, Card, Bank Transfer).
4.  **Attachments:** Supports uploading document/receipt images stored in `/uploads/expenses/`.
5.  **Statistics:** Aggregate reporting by month, payment mode, and day for financial dashboards.

---

## 8. Summary of Logic Relationships

| Trigger Action | Affected Modules | Logic Applied |
| :--- | :--- | :--- |
| **Create PO** | Budget, Fulfillment | Checks limits, sets up tracking. |
| **Create PI** | GRN, Inventory (Transit) | Assigns GRN, creates transit products. |
| **Print Labels** | Inventory (Live) | Promotes transit goods to salable stock. |
| **Stock Transfer** | Inwarding, Sockets | Real-time verification of branch transfers. |
| **Add Expense** | Bank/Cash, Budget | Deducts from allocated funds. |

---

## 9. RetailNode High-Frequency Data Entry UI Logic

### 9.1 Keyboard-Driven Navigation
1.  **Global Hotkeys:** The UI implements extensive global keyboard listeners. Function keys `F1` through `F7` are mapped to core screens (Purchase Order, Purchase Invoice, LR, Sales, Sales Return, Purchase Return, and Receivables).
2.  **macOS Support:** Explicit support for `Command` (Meta) keys alongside `Option`/`Alt` keys to ensure seamless data entry for macOS users without intercepting browser defaults negatively.

### 9.2 Real-Time Context Switching
1.  **Live Firm Context:** Authentic integration fetching real database companies.
2.  **Dynamic Masters:** Upon switching the active company/firm, the system dynamically queries and refreshes live parties, stock items, and location retrieval to ensure data integrity during voucher entry.

### 9.3 Voucher Triggers
1.  **Voucher Submission:** Keyboard and UI triggers are wired to emit POST requests for Purchase Orders and Purchase Invoices directly into the backend database.
2.  **Aesthetics:** High-fidelity layouts designed to match the dense, data-heavy RetailNode aesthetics.

---
*Generated on 2026-05-14 by Antigravity*

