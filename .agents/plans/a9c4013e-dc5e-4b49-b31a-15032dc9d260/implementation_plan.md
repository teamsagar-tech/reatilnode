# Universal Vendor File Import for Purchase Invoice

We will add a feature to easily import data from **multiple vendor formats** (both `.xls`/`.xlsx` and `.csv` files) directly into the Purchase Invoice creation screen.

Since the two sample files (`SE_N_2569_26-27.xls` and `Sales Invoice (1).csv`) have completely different column names, we will use a **smart column-matching system** that looks for aliases.

## User Review Required

Please review the updated proposed mapping and logic, which now includes your requested fields (ADAT, Salesperson, LR, Transport). Once you approve, I will finish implementing this in `PurchaseInvoice.tsx`.

## Proposed Changes

### 1. FrontEndV2 Dependencies
- Run `npm install xlsx` in `FrontEndV2` to parse both Excel and CSV files purely in the browser. 
- **Note on HTML-based `.xls` files:** Many legacy systems export "Excel" files as HTML tables disguised with an `.xls` extension (like your `SE_N_2569_26-27.xls`). The `xlsx` library natively understands and perfectly parses HTML tables out-of-the-box, so you won't need to manually convert them!

### 2. Header Auto-fill (From CSV)
If the file contains invoice-level details on every row (like the CSV does), we will extract them from the first row and automatically fill your top form:
- `INVNO` ➔ **Bill No**
- `INVDATE` ➔ **Bill Date**
- `LRNO` ➔ **L R No**
- `TRANSPORT` ➔ **Transporter**
- `ADAT %` ➔ **Commission Percent** (`invoiceData.commissionPercent`)
- `SALESPERSON` ➔ **Order By (Purchaser)**. We will use a **fuzzy matching algorithm** here. For example, if the file says "RATAN BHAI", but your user database has "Ratan", it will automatically detect the match and select the correct user from the dropdown.

### 3. Line Item Smart Mapping (For Both Files)
We will map columns based on aliases so that it works seamlessly for either vendor:
- **Item Name:** `Product Desc.` OR `ITEM` ➔ `item`
- **Quantity:** `Qty` OR `PCS` (if QTY is empty) ➔ `qty`
- **Rate:** `Rate` OR `RATE` ➔ `rate`
- **GST %:** `GST %` OR `GSTPERC` ➔ `gst`
- **HSN:** `HSN` ➔ `hsn`
- **Brand:** `BRAND` ➔ `brand` (from CSV)
- **Design:** `Design` ➔ `design` (from XLS)
- **Colour:** `Color` ➔ `colour` (from XLS)
- **Size:** `Size` ➔ `size` (from XLS)
- **Discount %:** `Dis%` OR `DISC %` ➔ `disc`
- **MRP:** `Mrp` ➔ `mrp` (from XLS)

### 4. UI Updates in `PurchaseInvoice.tsx`
- Add an **"Import (Alt+I)"** button in the top action bar or F-keys panel.
- Automatically enable the `designNo`, `colourNo`, `showSize`, and `showMarkdown` visual checkboxes if the imported file actually contains data for them.

## Verification Plan
1. Press `Alt+I` and select `SE_N_2569_26-27.xls` ➔ Verify it populates the 20 items, sizes, and colors.
2. Press `Alt+I` and select `Sales Invoice (1).csv` ➔ Verify it populates the 5 items, brands, and automatically fills the Bill No (`3375`), Date, Transporter (`J.D.LOGISTICS`), ADAT charges (`2`), and correctly selects `Ratan` for the Salesperson.
