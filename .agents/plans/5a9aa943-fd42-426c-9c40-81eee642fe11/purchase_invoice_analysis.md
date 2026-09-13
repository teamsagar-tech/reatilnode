# Purchase Invoice Data Analysis (RsDB_Archive)

I have successfully extracted and analyzed a sample of **300 recent Purchase Invoices** (`GR` and `GRDetails`) from the `RsDB_Archive` MongoDB database. 

This analysis covers **1,712 individual line items**, totaling **₹3.51 Crores** in purchase value across **86 unique suppliers**. 

As a clothing retail store, the data confirms a highly varied product mix with distinct invoice structures depending on the clothing category.

---

## 1. Top Level Statistics

- **Total Invoices Sampled**: 300
- **Total Line Items**: 1,712 (Avg. 5.7 items per invoice)
- **Total Purchase Value**: ₹35,088,722.20
- **Unique Suppliers**: 86
- **Unique Brands**: 270+

---

## 2. Categorical Breakdown

The inventory is heavily skewed towards Women's Ethnic Wear, but includes diverse formats. 

### Top Categories by Line Item Count
| Category | Item Count | Primary HSN Codes |
| :--- | :--- | :--- |
| **Jari Border** | 362 | `540730` |
| **Work Saree** | 355 | `540754` |
| **WR-Readywear (Women)** | 240 | `620419` |
| **Dress Material** | 137 | `540752` |
| **Ghagra** | 106 | `620439` |
| **Synthetic** | 101 | `540710` |
| **Silk** | 89 | `500720` |
| **Suiting Shirting** | 56 | `55151190` |

---

## 3. Invoice Typology Analysis

Based on the structure of the `GRDetails`, we can identify **three distinct types of invoices** that your store processes:

### Type A: "Design/Catalog" Invoices (Sarees & Readywear)
* **Example Supplier**: `MANIBHADRA TRADELINK`
* **Brand**: `SRT-YASH CREATION`
* **Structure**: Items in these invoices often don't have traditional names. Instead, the `ItemName` is a numeric design code (e.g., `16712`, `16605`). 
* **Data Pattern**: Quantities are typically small integers (e.g., 4, 5, 6), representing the number of pieces in a catalog set or color set. Rates are high per piece (₹1,500 - ₹4,500).

### Type B: "Cut / Fabric" Invoices (Suiting & Shirting)
* **Example Supplier**: `SIYARAM SILK MILLS LTD-NOT MSME`
* **Brand**: `J.HAMPSTEAD`
* **Structure**: Items indicate cut sizes in their names, such as `ELEGON-1.60` or `BOSTAN-1.30`. 
* **Data Pattern**: Quantities are fractional (e.g., `9.6`, `13.0`), representing total meters or specific cut sets. Rates are lower (₹375 - ₹399) as they are usually per meter. 
> [!NOTE]
> This perfectly aligns with our recently implemented `CutMaster` logic, validating the need for the `Pieces = Qty / Cut Size` calculation grid on the frontend.

### Type C: "Bulk Saree" Invoices
* **Example Supplier**: `MEENAKSHI SILK KENDRA`
* **Structure**: Items have generic names like `AARTI`.
* **Data Pattern**: Highly consolidated invoices. Very few line items per invoice, but large integer quantities per line (e.g., 22 pieces of `AARTI` at ₹595 each).

---

## 4. Key Suppliers & Brands

### Top 5 Suppliers by Volume
1. **MANIBHADRA TEXTILE AGENCIES** (71 Invoices)
2. **SRI PADMAVATI CREATION** (48 Invoices)
3. **MANIBHADRA TRADELINK** (33 Invoices)
4. **MADAN EXCLUSIVES** (11 Invoices)
5. **MEENAKSHI SILK KENDRA** (10 Invoices)

### Top 5 Brands
1. **SRT-YASH CREATION** 
2. **SRT-ZIRR** 
3. **JP-SAMPAT S S** 
4. **AMBRELI** 
5. **ADI-KASVI** 

---

## 5. Architectural Takeaways for RetailNode

1. **OCR Flexibility**: Because you receive "Design Code" invoices (Type A) and "Text Name" invoices (Type C), our AI OCR system needs to be robust enough to handle purely numeric item descriptors without confusing them for HSN codes or quantities.
2. **Decimal Quantities**: The fractional quantities in Suiting/Shirting invoices (Type B) confirm that the database and frontend must always allow float/decimal inputs for `Qty` and must not accidentally truncate to integers.
3. **HSN Enforcement**: Different categories strictly adhere to different HSN families (e.g., 540xxx for raw textiles/sarees vs 620xxx for readywear).

> [!TIP]
> The database structure in `RsDB_Archive` separates the Invoice Header (`GR`) from the Line Items (`GRDetails`) via a primary key `GRN`. This matches the current standard `PurchaseInvoices` and `PurchaseInvoiceItemAttributes` relational pattern we are using in MySQL.
