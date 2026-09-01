# Multi-Firm Access via Single Login

This plan outlines the architectural changes required to allow a single user (email) to access multiple Firms within RetailNode, while strictly maintaining the SaaS Tenant Isolation (`req.firm_id`) rule.

## User Review Required

> [!IMPORTANT]
> **Data Migration & Existing Users**
> Currently, the `Users` table has a hardcoded `firm_id` column. If we allow a user to access multiple firms, they may have different roles in each firm (e.g., "Admin" in Firm A, but "Cashier" in Firm B).
> 
> To support this cleanly, we need to introduce a new **`UserFirms`** mapping table. 

## Proposed Changes

### 1. Database Schema (Backend)

We will add a new migration script to `backend/server.js` that does the following:
- Creates a `UserFirms` table: `(id, user_id, firm_id, role_id, role_name, is_active)`
- Migrates existing users into this table (copies their current `firm_id` and `role_id` into `UserFirms`).
- (Optional but recommended) Eventually drops `firm_id` from the `Users` table to prevent data duplication.

### 2. Auth Flow & JWT (Backend)

- **`POST /api/auth/login`**: When a user logs in, we will query the `UserFirms` table.
  - The login response will now include a list of `available_firms` that the user has access to.
  - The server will generate a JWT token for their "Primary" or first available firm by default.
- **`POST /api/auth/switch-firm`** `[NEW]`:
  - An endpoint that accepts a `target_firm_id`.
  - The server validates that the user is mapped to this firm in `UserFirms`.
  - It generates and returns a **NEW JWT Token** with the updated `firm_id` and `role_permissions` specific to that firm.

### 3. Frontend Multi-Firm Switcher (React)

- Add a dropdown menu in the Top Navigation Bar (`Header.tsx` or similar) that displays the user's `available_firms`.
- When a user selects a different firm from the dropdown:
  - Call `/api/auth/switch-firm`.
  - Replace the JWT token in `localStorage`.
  - Reload the dashboard or trigger a state refresh to re-fetch all data (which will now use the new `req.firm_id` token!).

## Open Questions

> [!WARNING]
> 1. **Firm Creation**: Do you want users to be able to create new Firms themselves from the Dashboard (e.g., clicking "Add New Firm" and becoming the Admin of it), or will SuperAdmins still handle all new firm creations?
> 2. **Roles**: Do you need the ability for a user to have different permissions per firm (e.g., Admin in one, Cashier in another)?

## Verification Plan
1. Apply the database migration.
2. Login with an existing user and ensure the `UserFirms` mapping is read correctly.
3. Call `/switch-firm` with another authorized `firm_id` and ensure the new JWT correctly isolates queries to the new firm.
4. Verify the frontend dropdown seamlessly changes the active workspace.
