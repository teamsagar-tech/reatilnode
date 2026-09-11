# RetailNode Implementation History

This document serves as a compulsory append-only log of all major implementations, architectural decisions, and tasks completed in the RetailNode project.

## [2026-08-24] Frontend Master Pages Standardized
- **Action:** Upgraded all 18 Master `.tsx` pages (Brand, Category, Item, etc.) to use the "Premium Tally-style" layout.
- **Details:** 
  - Standardized on a 3-column layout (`flex-1 gap-6`).
  - Implemented custom `InputRow` and `SectionTitle` components.
  - Standardized keyboard navigation (Escape to quit, Ctrl+A to save, Alt+C to create new).
- **Status:** Complete. Automated via Node.js parsing script.

## [2026-08-25] SaaS Backend Initialization
- **Action:** Created the foundational backend folder and architecture.
- **Details:**
  - Initialized Node.js with Express and `mysql2/promise`.
  - Configured database schema for `retailnode_db` with `Firms` and `Users` tables.
  - Implemented strict Tenant Isolation: established `authMiddleware` (JWT verification) and `tenantMiddleware` (enforcing `req.firm_id`).
  - Built `authController.js` and `authRoutes.js` for `/api/auth/register` (creates firm + user transactionally) and `/api/auth/login`.
  - Successfully tested endpoints on port 7189 (bypassing macOS AirTunes conflict).
- **Architecture Constraints Set:** Multi-tenancy must be enforced on all future tables using `firm_id`.

## [2026-08-25] Enterprise SaaS RBAC & Field-Level Security
- **Action:** Implemented dynamic roles and data masking.
- **Details:**
  - Created `Roles` and `RolePermissions` tables to allow Firms to define custom roles.
  - Implemented `rbacMiddleware.js` to dynamically block access to modules based on role permissions (`requirePermission('inventory', 'write')`).
  - Created `config/fieldPermissions.js` and `utils/maskData.js` to strip sensitive data (like `cost_price`) from API responses before they are sent to restricted roles (e.g., Cashier).
  - Built API endpoints in `roleController.js` to allow Firm Admins to create and manage custom roles.
- **Architecture Constraints Set:** `requirePermission` MUST be used on all feature routes. Responses must be filtered through `maskData` if they contain sensitive fields.

## [2026-08-26] Backend Development Strategy & Onboarding Plan
- **Action:** Created `BACKEND_DEVELOPMENT_GUIDE.md` and defined a unified strategy for building APIs.
- **Details:**
  - Designed a single-page onboarding document for all developers to follow SaaS Multi-Tenancy rules.
  - Outlined step-by-step instructions for Route -> Middleware (`tenantMiddleware`, `rbacMiddleware`) -> Controller implementation.
  - Defined a 3-Phase Roadmap for upcoming API development (Phase 1: Masters, Phase 2: Transactions, Phase 3: Reports).
- **Architecture Constraints Set:** All new developers and agents MUST read `BACKEND_DEVELOPMENT_GUIDE.md` before creating any backend routes or controllers.

## [2026-08-26] Advanced Auth & Security System Implementation
- **Action:** Created `AUTH_SYSTEM_DOCS.md` and built the auth infrastructure.
- **Details:**
  - Integrated Google Authenticator (TOTP) and WhatsApp Mobile OTP logic.
  - Added Account Lockout (5 failed attempts).
  - Implemented Device Binding (`x-device-token`) and Global Audit Logging.

## [2026-08-26] Login Backend Integration for Tally & Standard Frontends
- **Action:** Integrated real JWT authentication into `FrontEnd` (Standard) and `FrontEndV2` (Tally-style).
- **Details:** 
  - Connected `Login.tsx` in both frontends to the `/api/auth/login` backend endpoint.
  - Implemented `ProtectedRoute.tsx` in both repositories to secure all `/dashboard/*` routes based on `localStorage` JWT token.
  - Prepared `superAdminMiddleware.js` on the backend for future System Admin panel functionality.
- **Architecture Constraints Set:** Maintained strict isolation by ensuring all regular Tenant endpoints still run through `tenantMiddleware`, while global management APIs will funnel through `superAdminMiddleware`.

## 2026-09-01: Multi-Firm (Tenant) Access Under Single Login
- **Rationale**: To support enterprise SaaS scenarios where a single user (email) needs to manage or access multiple firms, without requiring them to log out and use multiple email addresses. 
- **Changes**: 
  - Introduced `UserFirms` table to act as a junction table between `Users` and `Firms`, effectively altering the architecture from a strict 1:1 user-firm mapping to a 1:N mapping while keeping strict tenant isolation at the query level.
  - Added a backend `UserFirms` startup migration in `server.js` to transfer existing `Users.firm_id` assignments.
  - Updated `/api/auth/login` to query `UserFirms` and return an `available_firms` array for the user.
  - Added `POST /api/auth/switch-firm` to allow users to securely generate a new JWT targeted at a different `firm_id`.
  - Added `POST /api/firms/me/new` allowing a logged-in user to provision a new firm and instantly become its admin via `UserFirms`.
  - Frontend: Replaced the static profile UI in `Header.tsx` with a dynamic Firm Switcher dropdown and "+ Create New Firm" integration.
- **Current State**: The architecture maintains its strict `req.firm_id` checking, but users can now swap the `firm_id` inside their active JWT via the switcher.

## Firm Master Proper Screen & Switcher Fix
- **Backend**: Added `GET /api/firms/me/all` and `PUT /api/firms/me/:id` to `firmController.js` and `firmRoutes.js` so regular users can manage the profiles of multiple firms they belong to from a master screen. Also updated `getMyFirms` to return `max_firms` for quota display.
- **Frontend (Firm Master)**: Rewrote `FirmMaster.tsx` to match the standard list-edit proper master UI layout (matching PartyMaster). Users can now view a list of all their accessible firms, create a new firm directly, and edit existing firm details. Also added the standard F-Keys right sidebar and the 'Allowed Firm Count' quota tracking to the list view UI.
- **Frontend (Dashboard)**: Implemented an interactive Firm Switcher accessible via the `F10` hotkey, side menu, or by clicking the active firm name in the `Dashboard.tsx` Tally UI. Resolves the issue where Tally users had no way to switch contexts since `DashboardLayout` wasn't loaded.

## 2026-09-02: Universal Purchase Invoice Importer & Interactive Validation Hub
**Changes:** 
- Integrated `xlsx` into `FrontEndV2` to support client-side parsing of both legacy HTML-based `.xls` files and modern `.csv` files inside `PurchaseInvoice.tsx`.
- Built a smart aliasing engine to map disparate vendor column structures (e.g. `Product Desc.` vs `ITEM`) uniformly.
- Implemented auto-extraction of top-level headers (Bill No, Date, Transporter) and fuzzy matching for `SALESPERSON` to `Order By`.
- Added a robust **Interactive Validation Hub Modal**. Rather than allowing raw text insertion which breaks backend Foreign Key constraints (`item_id`, `brand_id`), the importer cross-references imported data against `availableItems` and `availableBrands`. 
- Added one-click "Create Missing Masters" functionality that auto-generates missing items/brands via `POST /api/items` and `POST /api/masters/brand`, auto-resolving validation errors seamlessly.

**Rationale:** Vendors provide highly variable formats. Dropping unvalidated strings into the frontend leads to crashes at submission because the backend strictly demands Master IDs. The interactive hub ensures data integrity while drastically minimizing user friction for master creation.

**Current State:** The Purchase Invoice page now natively supports resilient, zero-friction imports from arbitrary vendor files.

## 2026-09-02: Tenant Users Role Management Bug Fixes
**Changes:** 
- **Backend:** Updated `getFirmUsers` in `backend/controllers/firmController.js` to `LEFT JOIN Roles` so that the API now correctly returns both the custom `role` name and `role_id` for users.
- **Frontend (`TenantUsers.tsx`):** Fixed the role dropdown duplication bug by conditionally rendering the fallback `<option>` only when `user.role_id` is null. If a user is successfully assigned a custom role (like 'Purchase Manager'), the select dropdown elegantly binds to that `role_id` from the mapped list without generating duplicates.

**Rationale:** The API was previously only pulling the hardcoded `role` ENUM from the `Users` table and omitting `role_id`, causing the UI to constantly revert to "admin" or "user" visually on refresh, and also causing the React mapping logic to spit out the fallback text "Purchase Manager" alongside the actual Role option.

**Current State:** The Tenant Users management page correctly binds, displays, and persists custom roles assigned to firm users.

## 2026-09-02: Tenant Users Role Reversion Bug Fix
**Changes:** 
- **Backend:** Updated `updateUserRole` in `backend/controllers/userController.js` to correctly handle assigning the base roles (`admin`, `user`). It now sets `role = 'admin'` (or 'user') and `role_id = NULL` when those strings are passed, allowing a clean reversion from a custom role.
- **Frontend (`TenantUsers.tsx` & `FrontEndV2/...`):** Added explicit `<option value="admin">Admin</option>` and `<option value="user">User</option>` tags to the `select` dropdown, grouped alongside the custom roles. 

**Rationale:** The previous dynamic option-hiding logic accidentally removed the ability to select the built-in base roles once a custom role (like "Purchase Manager") was assigned, essentially trapping the user in a custom role.

**Current State:** Tenant Users management page perfectly handles assigning and reverting both built-in system roles and custom firm-specific roles.

## 2026-09-02: Purchase Invoice Item Autocomplete Filter Fix
**Changes:** 
- **Frontend (`PurchaseInvoice.tsx`):** Updated the item autocomplete dropdown logic (both keyboard arrow navigation and mouse click rendering) to filter the `availableItems` list based on the brand currently selected in the row (`products[index].brand_id` or `products[index].brand`).
- Fixed a silent bug where `brand_id` was not being correctly assigned to the row state when a user manually typed and selected a brand using the `Enter` key. 

**Rationale:** The autocomplete dropdown was displaying the entire global list of items rather than restricting it to items mapped to the specific Brand selected on that row. This is especially important for items newly generated from the "One-Click Import Validation Hub".

**Current State:** The item dropdown strictly enforces Brand -> Item hierarchy on manual data entry in the Purchase Invoice grid.

## 2026-09-02: Tenant Users Role Reversion State Robustness Fix
**Changes:** 
- **Frontend (`TenantUsers.tsx`):** Rewrote the local React state update logic inside the `assignRole` function. It now performs a robust type check and branch evaluation to correctly infer whether the newly assigned role is a built-in static string (`'admin'`, `'user'`, `'superadmin'`) or a dynamically fetched custom `role_id` (numeric).

**Rationale:** The previous React state mapping logic blindly attempted to `parseInt(roleId, 10)`. When the user tried to assign "admin" from the dropdown, `parseInt("admin")` returned `NaN`, which caused the local state update to fail silently and visually snap back to the previous role immediately (even though the backend API call was successful). 

**Current State:** Assigning both string-based built-in roles and numeric custom roles updates the UI state instantly and reliably.

## 2026-09-02: Purchase Invoice CSV Import Rate and Empty Row Fix
**Changes:** 
- **Frontend (`PurchaseInvoice.tsx`):** Modified the `handleKeyDown` and manual mouse click logic for the Item autocomplete dropdown to safely preserve the imported `rate` and `gst` values. Instead of unconditionally overwriting them with `selected.purchase_price` (which is often empty for newly generated items) or `0`, the logic now falls back to `newProducts[index].rate` and `newProducts[index].gst` if they are already populated.
- **Frontend (`PurchaseInvoice.tsx`):** Strengthened the CSV row filter logic during import (`!p.item.trim()`) to rigorously strip out phantom rows caused by trailing whitespace or trailing blank lines in Excel/CSV files.

**Rationale:** When users imported a CSV, the rate and GST correctly populated in the background. However, if they subsequently clicked on the row to trigger the autocomplete dropdown (or resolved missing items via the hub which then received focus), the `onChange` / `onSelect` logic would fire, immediately wiping the imported Rate and GST and setting them to empty/0 because the local master had no pre-defined values for those newly created items. Additionally, a blank CSV row was resulting in a visual artifact (an empty "# 1" row with 0.00 GST) at the top of the grid. 

**Current State:** CSV Imports flawlessly retain their imported Rate and Tax percentages regardless of post-import interactions with the autocomplete dropdown, and the grid strictly filters out empty ghost rows.

## 2026-09-02: Purchase Invoice Summary Table UI Bug Fixes
**Changes:** 
- **Frontend (`PurchaseInvoice.tsx`):** Patched the Summary Table's "Commission Amount" and "Discount Amount" input fields. Previously, these inputs only displayed a value if it was manually typed in, ignoring the calculated amounts from the imported percentages (e.g. `ADAT %` = 2). They now dynamically display `calcCommission.toFixed(2)` and `calcDiscount.toFixed(2)` and lock into a `readOnly` state if a percentage > 0 is provided.

**Rationale:** The internal state for `afterCommission` and `afterDiscount` was calculating the subtotals perfectly because the CSV mapped `ADAT %` -> `commissionPercent`. However, the UI input fields for the raw Amounts failed to display these calculations to the user.

## 2026-09-02: Purchase Invoice Save Button & Party Mapping Fix
**Changes:** 
- **Frontend (`PurchaseInvoice.tsx`):**
  - Added a dedicated "Save" button to the bottom right of the UI, next to the Quit button, to allow users to save the invoice.
  - Implemented the `Alt+S` keyboard shortcut for saving the invoice, providing a true Tally-like rapid data entry experience.
  - Updated the CSV Import parsing logic to prioritize mapping the `SUPPLIER` column over the `PARTY` column. This fixes the issue where an internal party name was overriding the intended supplier name.

### Sep 04, 2026: Purchase Invoice CSV Bulk Import Refinements & Fixes

**Summary of Changes:**
1. **Bulk Exists Check:** Implemented a new backend endpoint (`POST /api/purchase-invoices/check-bulk`) to pre-verify all parsed CSV rows against the database before adding them to the import queue. This automatically strips out duplicates based on \`vendor_id\` and \`bill_no\`.
2. **Double Discounting Bug Fix:** Removed the duplicate mapping of the \`DISC %\` CSV column which was previously being applied both to individual item rows and the global invoice footer. It now only applies to individual rows.
3. **Excel Serial Date Parsing:** Fixed a crash (500 Error: Incorrect date value) caused by \`xlsx\` parsing CSV dates as numeric Excel serials by adding conversion logic in the frontend before payload submission.
4. **Auto-Round Off Reconciliation:** Introduced a \`useEffect\` hook in \`PurchaseInvoice.tsx\` that intelligently computes the difference between the user-targeted \`Bill Amount\` and the mathematically computed \`Final Amount\`. If the difference is a small fractional discrepancy (e.g. 1 paisa rounding error), it automatically plugs the difference into the \`Round Off\` field, guaranteeing exact matches.
5. **Audit Logging (User & IP):** Altered the live MySQL \`PurchaseInvoices\` table schema to include \`created_by\` and \`ip_address\` tracking columns, and updated the backend controller to inject these values from the auth token and network requests.

**Rationale:**
These refinements transform the CSV import from a basic shell to a highly reliable, mathematically precise ERP workflow that guards against duplicate entries, prevents DB crashes from malformed dates, strictly enforces user attribution for audits, and intuitively resolves standard rounding errors for massive bulk imports.

## [2026-09-05] Phase 2: Logistics & LR Management Migration
- **Backend**: Converted Transporter, Hundekari, and UnlinkedLR schemas from MongoDB to strictly typed relational MySQL tables in `009_logistics_schema.sql`.
- **Controllers**: Ported Mongoose logic to `mysql2/promise` raw queries with strict `firm_id` tenant isolation in `logisticsController.js`.
- **Frontend**: Created fully functional `TransporterMaster.tsx`, `HundekariMaster.tsx`, and `LRPendingList.tsx` components connected to the backend API with Bearer token authentication.

## [2026-09-05] Phase 3: Inventory & Label Printing Migration
- **Backend Database**: Converted massive Mongoose `Products` and `InvoiceProducts` schemas (including nested arrays) into strict relational MySQL tables in `010_inventory_schema.sql`.
- **Backend API**: Built `labelPrintController.js` utilizing SQL JOINs to fetch product batches, replacing NoSQL `.populate()`. Registered endpoints under `/api/label-print`.
- **Frontend**: Successfully ported the cross-domain, hidden-form POST logic into `LabelPrintPage.tsx` within `FrontEndV2`, retaining secure label generation while conforming to the Tally UI standards.

## [2026-09-05] Phase 4: Sales & POS Migration Completed
- **Backend Database**: Built `012_sales_schema.sql` to replace NoSQL SalesBill and SaleLineItem collections with secure, relational MySQL tables strictly enforcing `firm_id` tenant isolation.
- **Backend API**: Engineered `salesController.js` utilizing SQL transactions for billing (to prevent race conditions) and fast `JOIN`s for barcode scanning. Secured via RBAC.
- **Frontend**: Delivered the `POSPage.tsx` interface. Designed following the RetailNode Tally guidelines with robust keyboard navigation, dynamic cart calculation, and an auto-focus supermarket-style barcode scanner flow.

## [2026-09-05] Phase 5: Manage Receivable Module
- **Backend API**: Created `manageReceivableController.js` utilizing MySQL transactions for safely Splitting products (generating sequenced barcodes) and Bulk-Updating `vrp_rate`/`mrp` strictly scoped by `firm_id`.
- **Frontend Interface**: Ported the `ManageReceivable` UI into the strict RetailNode Tally-style format. Replaced terminology 'VRP' with 'Sales Price' per administrative request. Wired up complex keyboard navigation including F2 (Batch Edit) and F3 (Split Piece).

## [2026-09-05] Phase 6: Returns Management Completed
- **Backend Database**: Designed `014_returns_schema.sql` tracking `SalesReturns` (Credit Notes) and `PurchaseReturns` (Debit Notes) completely isolated by `firm_id`.
- **Backend API**: Engineered `returnsController.js` to execute MySQL transactions flipping product flags (`is_sold`, `is_returned`) upon refund to enforce flawless inventory count re-integration.
- **Frontend Interface**: Overwrote placeholder pages for `SalesReturn.tsx` and `PurchaseReturn.tsx` with customized Tally-style grids, featuring color-coded headers (Red for Sales Refund, Brown for Purchase Return) and robust keyboard bindings.

## [2026-09-05] Phase 7: Data Migration (Dry Run Ready)
- **Database Schema Fixes**: Revisited Phase 6 Returns schema to add tracking for `total_commission_reversed`, `total_coupon_discount_reversed`, and `loyalty_points_debited` to ensure 1:1 legacy parity.
- **Data Migration Pipeline**: Wrote and executed `backend/scripts/migrateData.js` connecting local MongoDB (`vrp_db`) to local MySQL (`retailnode_db`).
- **Execution Results**: Scanned legacy `kalambproducts` collection. Filtered out duplicate barcodes using new rigid SQL `UNIQUE` constraints, resulting in 2,220 perfectly verified products successfully ported into the new architecture for immediate Dry Run testing.

## [2026-09-05] Phase 8: Comprehensive Audit & Corrections
- **Migration Rewrite**: Rewrote `migrateData.js` to capture the full breadth of legacy financial variables (GST, Commissions, Net Rates) rather than just the core identifiers, ensuring zero data loss from MongoDB to MySQL.
- **Frontend POS Overhaul**: Discovered a gap between backend schema capabilities and UI inputs. Upgraded `POSPage.tsx` to natively support input capture for Credit Sales, Loyalty Points, Coupons, and real-time visualization of Item Commission, cementing 1:1 legacy feature parity.

## [2026-09-05] Phase 9: Purchase Orders & Core Financial Ledgers
- **Procurement Module Built**: Completely engineered the missing Purchase Order lifecycle. Created `015_purchase_orders_schema.sql`, `purchaseOrderController.js`, and the `PurchaseOrder.tsx` UI (Tally-style layout). Wired GRN (Purchase Invoices) to automatically fulfill POs.
- **Party Ledgers Built**: Created `016_ledgers_schema.sql` (`PartyLedgers`) to track Accounts Payable/Receivable. 
- **Ledger Integrations**: 
  - Altered `Customers` and `Vendors` tables to track `current_balance` for high-speed UI reads.
  - `purchaseInvoiceController.js` now automatically Credits the Vendor Ledger upon GRN generation.
  - `salesController.js` now automatically Debits the Customer Ledger upon Credit/Udhaar POS sales.

### Phase 9.1: Logistics & UI Fixes
*   **Keyboard Navigation Fix:** Fixed a critical bug in `PurchaseInvoice.tsx`, `PurchaseOrder.tsx`, and `SearchableDropdown.tsx` where navigating dropdowns with arrow keys and pressing Tab/ArrowRight would fail to auto-commit the selection. Tab and ArrowRight now behave identically to Enter for fast keyboarding.
*   **API URLs:** Removed hardcoded production API URLs (e.g. \`https://api.retailnode.in\`) from frontend data-entry pages and replaced them with relative paths so they fetch from the local proxy/backend accurately, preventing ID mismatches.
*   **LR Pending Module:** 
    *   Added \`lr_no\`, \`transporter\`, and \`bales\` tracking to the \`PurchaseInvoices\` database table.
    *   Updated the Purchase Invoice creation API to save these logistics fields and set the invoice status to "LR PENDING".
    *   Added \`GET /api/logistics/pending-lrs\` endpoint to fetch all pending invoices.
    *   Wired \`LRList.tsx\` to fetch live data instead of dummy data.
- **[2026-09-08] Master Flow & Purchase Order Rewrite**: Completely rewrote the PurchaseOrder.tsx frontend layout to strictly comply with the dense, Tally-style spreadsheet UI and keyboard workflow. Conducted a massive application-wide audit of all 60+ pages. Executed an automated Python script to patch the 'Enter' key focus chain across all 22 Master pages, ensuring focus flawlessly jumps from the final InputRow directly to the Save button. Verified Escape key handlers globally.

## [2026-09-09] Transaction Voucher Layout Standardization
- **Action**: Completely rewrote `PurchaseOrder.tsx` UI to structurally match the "Gold Standard" Tally layout defined in `PurchaseInvoice.tsx` (Split Header Panels, Split Footer Narration/Totals, right Sidebar for function keys, and absolute bottom Status bar).
- **Rule Update**: Formalized this layout structure by updating `.agents/skills/page-creation/SKILL.md` (Section 4.1). Future AI generation of transaction/voucher pages MUST strictly adhere to this exact structural hierarchy.
- **Compliance**: Copied implementation plan to `.agents/plans/purchase-order-ui-tally-standard-plan.md` to permanently archive this architectural layout decision.

### Phase 2: Application-Wide Standardization
- **Action**: Audited and completely refactored all remaining core transaction pages (`POSPage.tsx`, `SalesReturn.tsx`, and `PurchaseReturn.tsx`) to conform to the newly formalized `SKILL.md` Section 4.1 rules.
- **Details**:
  - Implemented the strict `35/65` Split Header layout.
  - Implemented the `60/40` Split Footer layout (Narration & Totals). Relocated the "Remark" input from the header down to the footer Narration block in return vouchers for structural consistency.
  - Normalized the bottom Status Bar to dynamically render `Version 2.0 | Firm | Location` and F-Key shortcuts across all pages.

## [2026-09-09] Global API Endpoint Correction
- **Bug Fix**: Discovered that numerous frontend pages (e.g., `PurchaseInvoiceList.tsx`, 17 Master pages, and modals) were failing to fetch live local data because their fetch requests were hardcoded to the production URL (`https://api.retailnode.in`).
- **Resolution**: Ran a custom Node.js script to traverse the entire codebase and replace all instances of hardcoded `https://api.retailnode.in` URLs with dynamic environment variables (``${import.meta.env.VITE_API_URL || 'http://localhost:5000'}``), ensuring the frontend correctly targets the local development server and enabling live data population.

## [2026-09-09] Logistics API Auth Fix
- **Bug Fix**: The `/lrs` frontend route was failing to display pending LRs because the backend `logisticsRoutes.js` was missing `authenticateToken` and `tenantMiddleware`. This omission caused the `requirePermission` middleware to crash with a `500 Internal Server Error` when trying to read user roles.
- **Resolution**: Injected the required authentication and tenant isolation middlewares into `backend/routes/logisticsRoutes.js`, ensuring secure and functional data fetching for pending LRs.

## September 10, 2026: Employee ID and User Series Management
**Feature Summary:**
- Added the ability for Tenant Admins to manage User Employee IDs and ID Series via `Settings > Users` (User Master).
- Added `employee_id` to the `Users` table and created a `UserSeries` table for managing logical ranges for employees (e.g., Admins 1-100, 1st Floor 101-200).
- Updated the `SearchableDropdown` component in the frontend to support an array of `searchKeys`, allowing users to be searched by their Name or Employee ID.
- Upgraded the Purchase Invoice "Order By" dropdown so typing the Employee ID (e.g., 7) automatically searches for the assigned user and selects them upon Enter.

**Rationale:**
- Customers requested the ability to quickly select order buyers using a unique numerical ID, particularly when multiple users share similar names or when operating via quick numerical entry (Tally-style data entry). 
- Providing customizable ID Series allows physical shop floors or departments to logically group IDs.

**Current State:**
- The Tenant can now view their users at `/api/users` and manage series at `/api/user-series`. Both frontend and backend are successfully deployed.

### Brand Master & Party Contacts Updates
- **Brand Master API & DB Fix**: The UI previously supported selecting a `type` (Single Brand vs Multiple Brands) but the underlying MySQL `Brands` table was missing the `type` column. This resulted in SQL errors (`Unknown column 'type'`) during `INSERT` and `UPDATE` operations, causing Brand creation and updates to fail. Added `type VARCHAR(50) DEFAULT 'Single Brand'` to the database and restarted the backend API on PM2. All CRUD operations (Create, Update, Delete) are now fully functional and verified via the API.
- **Brand Master UI Update**: Modified `BrandMaster.tsx` to display inputs on a single page without scrollbars. Restructured input width from full width (`flex-1`) to explicit required widths (`w-[250px]`) as requested.
- **Party Master & Modal**: Updated the "Mobile" label in dynamic contacts to dynamically reflect the contact person's first name if available (e.g., "Rajesh Mobile").

- **[2026-09-10] PartyMaster Layout Update**: Re-engineered `PartyMaster.tsx` to utilize a denser row-wise stacked layout structure instead of the default 3-column Tally vertical stack, fulfilling user request for a tighter UX.

- **[2026-09-10] PartyMaster Minor Layout Updates**: Removed 'Type' and 'Opening Bal' fields per user request, and upgraded the Contact Information block to use a dynamic adding/removing list structure instead of hardcoded 1/2/3 inputs.

- **[2026-09-10] PartyModal API Fix**: Updated the `PartyModal.tsx` (used in Purchase Invoice) to target the `/api/masters/party` endpoint instead of `/api/vendors`, and re-mapped its payload fields to properly insert into the `Parties` table so that newly created parties show up in `PartyMaster.tsx`.

- **[2026-09-10] PartyModal Layout Clone**: Migrated the exact dense, row-wise layout architecture (including state tracking, dynamic contacts, and form UI) from `PartyMaster.tsx` into the `PartyModal.tsx` popup to ensure absolute visual parity between the master ledger and the invoice popup ledger creation form.

- **[2026-09-10] PartyModal Brand Dependencies Fix**: Resolved a `ReferenceError: tempBrand is not defined` bug that occurred during the layout clone by injecting the missing state variables (brands, tempBrand, availableBrands) and the `MasterCreationModal` import/rendering logic into `PartyModal.tsx`.

- **[2026-09-10] PartyModal Layout Clone (Final)**: Successfully replaced the old 3-column legacy layout structure of `PartyModal.tsx` with the dense, row-wise layout block natively extracted from `PartyMaster.tsx`, ensuring absolute parity between the modal and master page.

- **[2026-09-10] PartyModal Layout Clone (Final)**: Successfully replaced the old 3-column legacy layout structure of `PartyModal.tsx` with the dense, row-wise layout block natively extracted from `PartyMaster.tsx`, ensuring absolute parity between the modal and master page.

- **[2026-09-10] Party Categories Master Sync**: Replaced the plain-text Category & Subcategory inputs in `PartyMaster.tsx` and `PartyModal.tsx` with smart auto-suggest dropdowns synced with a new backend master tables (`PartyCategories` and `PartySubCategories`). Implemented parent-child linkage, preventing subcategory selection until a valid category is chosen, and enabled on-the-fly creation via `Alt+C` using the `MasterCreationModal`.

### 2026-09-10 - Party Brand Constraints
- **Database**: Added `brand_type` ENUM('Single', 'Multi') column to `Parties` table.
- **Backend API**: Updated `partyController.js` to save/update the `brand_type` field.
- **Party Master/Modal**: Added a "Brand Type: Single / Multi" dropdown to the Categorization & Brands UI section, allowing users to configure whether a party is restricted to a single brand.
- **Purchase Invoice Grid**:
  - Automatically restricts the Brand dropdown to ONLY the brands assigned to the selected party.
  - Hides the "Alt+C" brand creation shortcut if the party has specific brands assigned.
  - Enforces the "Single Brand" rule by locking all subsequent rows in the invoice to the brand selected in the first row.
  - Allows full brand access and creation if the party has no brands assigned.

### 2026-09-10 - Purchase Invoice Size Matrix (Horizontal Input)
- **Database**: 
  - Created `SizeGroups` (id, group_name, sizes array) for Global Size Masters.
  - Altered `PurchaseInvoiceItemAttributes` to include `purchase_rate` and `mrp` columns to support size-level pricing variations.
- **Backend API**:
  - Created `sizeGroupController.js` and `sizeGroupRoutes.js` for CRUD operations on Size Groups.
  - Updated `purchaseInvoiceController.js` to parse `matrixData` array and insert size-level quantities, purchase rates, and MRPs directly into the Attributes table.
- **Frontend UI**:
  - Created `SizeGroupMaster.tsx` for defining named size arrays (e.g. "Momento Sizes (1 to 16)").
  - Updated `BrandMaster.tsx` UI to allow assigning Size Groups to Brands (Hybrid Option C).
  - Created `SizeAllocationModal.tsx` for Purchase Invoices. This modal features an "Auto-Increment Setup Bar" for rapidly generating rate/MRP steps across sizes, and a Horizontal Matrix Grid for Tally-style rapid data entry (Tab to move across sizes).
  - Integrated `SizeAllocationModal` into `PurchaseInvoice.tsx`. Pressing Enter on the Item field now opens the Matrix modal, which auto-summarizes back into a single clean line item on the main grid.

## 2026-09-10: Form Accessibility and Reset Bug Fix
**Features Implemented:**
1. **Form Accessibility Skill**: Created a permanent Agent Skill (`retailnode-form-accessibility`) to enforce standards for keyboard navigation, shortcut consistency, safe resets, and toast notifications.
2. **Enter-to-Tab Refactor**: Updated `GlobalEnterNavigation` in `App.tsx` to automatically skip any element with `tabIndex={-1}`.
3. **Safe Resets**: Refactored over 20+ Master Forms to assign `tabIndex={-1}` to their "Reset" buttons. This completely prevents the critical bug where users accidentally cleared their entire form when pressing Enter at the last input field. 
4. **Confirm Modal for Resets**: Integrated `ConfirmModal` for all Reset actions across Master Forms to ask the user "yes or no" before clearing.
5. **Toast Notifications**: Replaced browser `alert()` on `PartyMaster.tsx` saves with standard `toast` notifications.

### 2026-09-10 - Global Keyboard Navigation System (Tally Style)
- **Frontend Architecture**: Implemented a centralized keyboard shortcut and navigation system mimicking Tally ERP, using a web-safe "Alt" (Windows) / "Option" (Mac) paradigm.
- **State Management**: Created `useKeyboardStore.ts` (Zustand) to maintain a registry of active shortcut callbacks, supporting contextual shortcuts (e.g., specific to `SalesInvoice` vs `Global`).
- **Core Event Listener**: Created `useGlobalKeyboard.ts` hook (integrated into `App.tsx`) that intercepts `window` `keydown` events. It aggressively neutralizes browser defaults for `e.altKey` (blocking menu popups) and handles the legacy global `Enter-to-Tab` logic.
- **Consumer Hook**: Provided `useShortcut.ts` for developers to easily register/unregister component-level shortcuts (e.g., `Alt+S` for Save) with automatic cleanup on unmount.
- **Artifacts**: Implementation plan, tasks, and walkthrough have been persisted to `.agents/plans/`.

### Sep 11, 2026: Restored Custom Size Master UI (Scale/Set Split)
- **Files Modified**: `FrontEndV2/src/pages/masters/inventory/SizeMaster.tsx`
- **Rationale**: An earlier specialized UI for `SizeMaster` (which displayed sizes grouped by primary scales like INCH, SIZE, CM separately from complex Size Sets) had been overwritten by a standard master boilerplate during a deployment sync. The user uploaded a screenshot to prove the desired state. 
- **Implementation**: 
  - Rewrote the `SizeMaster.tsx` list view to fetch from `/api/masters/generic/sizesets`.
  - Used JS array filtering to extract primary scales (`['inch', 'size', 'cm', 'number']`) and rendered them as side-by-side pill badges (Top Section).
  - Remaining sets (e.g. `S-L` matrix definitions) are rendered in a lower `SCALE: SIZE` data table.
  - Wired the "Manage Size Sets" button to route to `/masters/sizeset`.
  - Implemented the standard "Create Mode" 2-column input layout for creating individual generic sizes, wired strictly to global keyboard listeners (`Alt+C`, `Ctrl+A`, `Escape`) with modal protection.
- **Architecture State**: The frontend components are strictly unified around accessibility patterns. Generic masters share standard components (`ConfirmModal`), and specialized visual layouts (like `SizeMaster`) fall back to standardized 2-column input blocks when entering 'create' mode.
- **Minor Update**: Fixed a focus loss bug in `SizeMaster.tsx`'s Create Mode by moving `InputRow` and `SectionTitle` component definitions outside the main component. Added a `Size Scale` dropdown in the first position to explicitly classify single sizes.
- **Database Seeded**: Populated the production `Sizes` and `SizeGroups` tables with CM, INCH, and SIZE matrices so `SizeSetMaster` has exact sizes for allocation.

## 2026-09-11: Cut Master & Purchase Invoice Automation
- **Backend**: Created `CutMaster` table and `/api/masters/cut` CRUD APIs.
- **Frontend**: Added `CutMaster.tsx` for managing standard cut sizes.
- **Frontend (Purchase Invoice)**: Added dynamic column toggling for Suiting/Shirting vs Readymade vendors. Added `Cut Size` and `Pieces` columns with auto-calculation (`Pieces = Qty / Cut Size`). Implemented last rate fetching and color coding on the Rate field (Red if higher, Green if lower).

## 2026-09-11: Price List PDF Importer Module
**Action:** Created a Tally-style module for users to upload and parse tabular PDF Price Lists.
**Details:**
- **Frontend:** Built `PriceListImport.tsx` featuring an `availableBrands` autocomplete selector, `Alt+I` import shortcut, and a live statistics panel tracking newly inserted Items, Designs, and Colors.
- **Backend Parsing Strategy:** Standard Node.js parsers (e.g. `pdf-parse`) mangle tabular PDF formats. To preserve layout integrity, I deployed a Python script (`parse_pdf.py`) utilizing `pdfplumber` to accurately extract columns into JSON.
- **Backend Ingestion:** Created `POST /api/inventory/import-pricelist`. It executes the Python script via `child_process`, receives the JSON, and opens a MySQL transaction. It performs a mass `INSERT` across the `Items`, `Designs`, and `Colors` tables, while dynamically updating prices (`cost_price`, `selling_price`) for existing items.
- **Routing & RBAC:** Added `priceListImport` to `TenantUsers.tsx` (`AVAILABLE_MODULES`) ensuring proper RBAC constraints.
**State:** The module perfectly parses complex multi-shade PDF lists and bulk-loads the resulting data into the backend.

## 2026-09-11: Digital Bill OCR (Tesseract Prototype)
**Action:** Created an experimental standalone module to test extracting invoice tables from JPEG images using Tesseract OCR.
**Details:**
- **Backend:** Created `ocr_image.py` to run `pytesseract.image_to_string()` and perform a naive table-line heuristic extraction. Created `ocrController.js` and exposed `POST /api/purchase/ocr-test`.
- **Frontend:** Created a standalone `OCRTest.tsx` UI under `Inventory > Advanced > OCR Prototype` allowing users to upload an image and compare raw Tesseract text against the heuristically parsed table.
- **Live Server:** Installed `tesseract-ocr`, `pytesseract`, and `Pillow` via apt/pip on the production server to enable the Python subprocess.
**State:** Currently testing viability of local OCR for complex tabular extraction.
