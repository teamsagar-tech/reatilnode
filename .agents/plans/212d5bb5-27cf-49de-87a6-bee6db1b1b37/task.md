# Invoice Extraction & Import Tasks

- `[x]` **Phase 1: Extract data from Invoice Images**
  - `[x]` Extract all 9 invoices (LA BASE, PANKHUDI, MOMENTO FASHION, FOCUS JEANS, SHREE TRADING x 3)
  - `[x]` Structure data into `sample/invoices/raw_invoices.json`

- `[x]` **Phase 2: Import Script & Backend Bugfixes**
  - `[x]` Create `Backend/scripts/import_invoices.js`
  - `[x]` Implement Auto-create Vendors via API
  - `[x]` Implement Auto-create Items via API
  - `[x]` Fix Backend SQL schema mismatches (`Vendors` FK, removed `created_by`/`ip_address`, removed `tax_percent`)

- `[x]` **Phase 3: Execution & Verification**
  - `[x]` Run `node Backend/scripts/import_invoices.js` on all 7 distinct invoices
  - `[x]` Verify DB constraints and successful API responses (IDs 1 through 7)
  - `[x]` Verify Stock Update Logic (adheres to "Inward after LR received" rule)
  - `[x]` Commit and push all changes to GitHub
