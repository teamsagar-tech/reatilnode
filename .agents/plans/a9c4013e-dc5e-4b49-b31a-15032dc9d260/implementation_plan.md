# Transaction Voucher UI Standardization Audit

Based on the newly formalized `SKILL.md` rules for the "Transaction Voucher Standard Layout (Tally Style)", I have audited the remaining transaction pages. 

## Audit Findings
The following core transaction pages currently utilize the correct `w-[120px]` Right Sidebar, but they do **NOT** follow the strict `35/65` Split Header, the `60/40` Split Footer, or the standard Bottom Status Bar layout:
1. `FrontEndV2/src/pages/sales/POSPage.tsx`
2. `FrontEndV2/src/pages/sales/Returns/SalesReturn.tsx`
3. `FrontEndV2/src/pages/purchase/Returns/PurchaseReturn.tsx`

*Note: `ManageReceivable.tsx` is considered a list/action page rather than a voucher entry page, so it will retain its current table-centric layout but can be updated to include the standard bottom status bar for consistency.*

## Proposed Changes

### Component 1: `POSPage.tsx`
- **[MODIFY]** [POSPage.tsx](file:///Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/sales/POSPage.tsx)
  - Restructure the top header from `flex gap-12` to `flex flex-row` with `w-[35%]` (Payments, Coupons) and `w-[65%]` (Customer, Salesman, Barcode Scanner) sections.
  - Restructure the footer from a single row to the Two-Part layout: `w-[60%]` left section (Narration/Notes) and `w-[40%]` right section (Detailed Totals).
  - Update the absolute bottom status bar to display the standard `Version 2.0 | Firm | Location` and keyboard shortcuts.

### Component 2: `SalesReturn.tsx`
- **[MODIFY]** [SalesReturn.tsx](file:///Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/sales/Returns/SalesReturn.tsx)
  - Apply the `35/65` Split Top Form layout.
  - Apply the `60/40` Split Footer layout.
  - Update the bottom status bar to match the global standard while retaining the red "Sales Return" header theme.

### Component 3: `PurchaseReturn.tsx`
- **[MODIFY]** [PurchaseReturn.tsx](file:///Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/purchase/Returns/PurchaseReturn.tsx)
  - Apply the `35/65` Split Top Form layout.
  - Apply the `60/40` Split Footer layout.
  - Update the bottom status bar to match the global standard while retaining the brown "Purchase Return" header theme.

## Open Questions
> [!IMPORTANT]
> The original standard includes a "Narration" text area in the `60%` footer split. Since `SalesReturn` and `PurchaseReturn` currently capture their "Remark" in the top header, should I move the "Remark" field down to the footer Narration box to perfectly match `PurchaseInvoice.tsx`?

## Verification Plan
After updating these files, I will verify the structural alignment and ensure that all React state bindings and `ref` auto-focus triggers for the Barcode Scanners still function correctly.
