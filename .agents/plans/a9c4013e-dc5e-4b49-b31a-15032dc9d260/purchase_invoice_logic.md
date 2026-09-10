# Purchase Invoice Module: Business Logic & Rules

This document outlines the detailed rules, constraints ("do's and don'ts"), and calculations implemented within the Purchase Invoice module.

## 1. Header Information (Invoice Details)
*   **Supplier (Party):** 
    *   **Mandatory:** An invoice cannot be saved without a valid Party (Vendor/Supplier).
    *   **Validation:** The entered supplier name must exactly match a vendor registered in the system. If it does not match, the invoice save is rejected.
*   **Invoice Date & Receive Date:** Defaults to the current date.
*   **Bill No & Bill Date:** Used to prevent duplicate entries. The system checks `(Vendor ID + Bill No)` against the database to ensure the exact same bill isn't entered twice for the same vendor.
*   **Tax Type:** Determines if the tax applied is IGST (Inter-state) or CGST/SGST (Intra-state).

## 2. Item Entry & Table Rules
*   **Minimum Requirement:** An invoice must have at least one valid item line with a selected item and valid quantities/rates to be saved.
*   **Brand Restrictions (Party Level):** When creating or editing a Party, if their **Brand Mode** is set to "Single Brand", the system strictly enforces that only **one** brand can be added to their Allowed Brands list. An alert will block the addition of a second brand until the first is removed.
*   **Item Attributes (Size, Color, Design):** 
    *   These are dynamically shown or hidden based on the toggles (`designNo`, `colourNo`, `showSize`).
    *   If items have multiple attributes (e.g., assorted sizes/colors), they are bundled in a pop-up modal (`MultiAttributeModal`). The main row will show "Multi" and the total sum of quantities.
*   **Quantity & Rate:** Both must be greater than zero for the line to be considered valid during save.

## 3. Financial Calculations & Hierarchy
The final bill amount is calculated in a strict cascading order:

1.  **Item Subtotal:** `Quantity × Rate`
2.  **Item Discount:** Applied directly to the item's subtotal.
    *   *Line Taxable Amount* = `(Qty × Rate) - Line Discount`
3.  **Bill-Level Discount:** 
    *   Can be a Percentage (%) or a Flat Amount (₹).
    *   Applied to the sum of all *Line Taxable Amounts*.
    *   *After Discount Amount* = `Sum of Line Taxables - Bill Discount`
4.  **Commission / Adat:**
    *   Can be a Percentage (%) or a Flat Amount (₹).
    *   Applied *after* the Bill-Level Discount.
    *   *After Commission Amount* = `After Discount Amount + Commission`
5.  **GST (Tax) Calculation:** 
    *   **If GST is on Items (Item-wise):** The tax is calculated per item based on the item's specific GST %. The total tax is the sum of these individual calculations. The system proportionally distributes the Bill Discount and Commission across the items before applying the GST %.
    *   **If GST is on Bill (Bill-wise):** A single flat GST % is applied to the entire *After Commission Amount*.
6.  **Other Charges (+ / -):** Added or subtracted from the total after tax.
7.  **Grand Total (Net Amount):** 
    *   `Round(After Commission Amount + Total Tax + Other Charges)`

## 4. CSV Import Rules
*   **Mapping:** The system automatically maps CSV headers (e.g., `INVNO`, `Doc No.`, `TRANSPORT`, `SALESPERSON`) to the internal invoice fields.
*   **Vendor Matching:** During import, the system attempts to auto-match the `PARTY` or `SUPPLIER` column to existing vendors in the database. If no match is found, it flags it as an error.
*   **Item & Brand Validation:** Every row in the CSV must have a valid `Item` and `Brand` that exists in the master database. If they do not exist, the row is flagged as an error and cannot be processed until the missing masters are created.
*   **Date Formatting:** Excel serial dates (e.g., `44927`) or string dates (`DD/MM/YYYY`, `YYYY-MM-DD`) are automatically parsed and standardized to `YYYY-MM-DD`.

## 5. Background Processes
*   **GRN Generation:** Upon successful save, the backend automatically generates a Goods Receipt Note (GRN) number using the firm's specific GRN template (e.g., `GRN-0001`).
*   **Queueing:** If multiple invoices are imported via CSV, they are placed in a queue. Saving one invoice automatically loads the next one in the queue into the form.
