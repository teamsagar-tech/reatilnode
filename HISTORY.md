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
