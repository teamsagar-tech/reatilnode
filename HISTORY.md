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
