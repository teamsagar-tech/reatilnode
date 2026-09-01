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
- **Backend**: Added `GET /api/firms/me/all` and `PUT /api/firms/me/:id` to `firmController.js` and `firmRoutes.js` so regular users can manage the profiles of multiple firms they belong to from a master screen.
- **Frontend (Firm Master)**: Rewrote `FirmMaster.tsx` to match the standard list-edit proper master UI layout (matching PartyMaster). Users can now view a list of all their accessible firms, create a new firm directly, and edit existing firm details.
- **Frontend (Dashboard)**: Implemented an interactive Firm Switcher accessible via the `F10` hotkey, side menu, or by clicking the active firm name in the `Dashboard.tsx` Tally UI. Resolves the issue where Tally users had no way to switch contexts since `DashboardLayout` wasn't loaded.
