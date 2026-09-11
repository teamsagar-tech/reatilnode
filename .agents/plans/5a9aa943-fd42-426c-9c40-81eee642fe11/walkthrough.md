# Price List PDF Import Module

I have successfully built and integrated the new Tally-style Price List Importer into the RetailNode system. 

## What Was Implemented

### 1. Price List Import Page (Frontend)
- **Location:** Inventory -> Advanced -> Price List Import (`/inventory/price-list-import`).
- **Layout:** Strictly follows the RetailNode Tally guidelines (Green headers, 3-column split, absolute footer).
- **Features:**
  - Auto-complete `Brand` selector to target specific brands.
  - File upload input restricted to `.pdf`.
  - **Alt+I** keyboard shortcut to quickly trigger the import.
  - Live Statistics Panel that displays:
    - New Items Created
    - Items Updated (Price synchronized)
    - New Designs Registered
    - New Colors/Shades Registered

### 2. Backend & Python Integration
- Created `POST /api/inventory/import-pricelist` to receive the PDF.
- Integrated a new Python script (`backend/scripts/parse_pdf.py`) utilizing `pdfplumber` to execute the exact mapping rules we built earlier.
- The backend parses the data inside a robust MySQL transaction and performs `INSERT IGNORE` (and `ON DUPLICATE KEY UPDATE` for item prices) across the `Items`, `Designs`, and `Colors` masters concurrently.

### 3. Application Routing & Security
- Registered the new endpoint in `inventoryRoutes.js` protected by `authMiddleware` and `tenantMiddleware` (strict tenant isolation).
- Added `priceListImport` to `TenantUsers.tsx` under `AVAILABLE_MODULES`, allowing superadmins to control access to this page via the RBAC system.
- Hooked up `App.tsx` routing.

## Verification
The feature is now live on your local environment. You can navigate to the page and test it with the `WS26 PRICE LIST.pdf` file!

> [!IMPORTANT]
> Since this feature utilizes a Python child process, you must ensure that your production server has `python3`, `pandas`, and `pdfplumber` installed before deploying this to `162.19.81.108`.
