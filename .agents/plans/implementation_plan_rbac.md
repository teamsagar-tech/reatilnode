# Enterprise SaaS RBAC & Field-Level Security Implementation

This plan outlines the steps to upgrade our backend foundation with Dynamic Role-Based Access Control (RBAC) and Field-Level Security (Data Masking) as discussed in our architectural deep dive.

## User Review Required
> [!IMPORTANT]
> **Refresh Tokens**: Should we also implement the Access Token / Refresh Token rotation right now, or focus strictly on the Roles, Permissions, and Data Masking first to keep the scope tight? The plan below focuses on RBAC and Masking.

## Proposed Changes

### Database Schema Updates
#### [NEW] [001_rbac_schema.sql](file:///Users/ratan/Downloads/frost-pivot/RetailNode/backend/database/001_rbac_schema.sql)
We will create a new SQL migration script to add the dynamic RBAC tables:
- `Roles` (`id`, `firm_id`, `name`)
- `RolePermissions` (`role_id`, `module_name`, `can_read`, `can_write`, `can_delete`)
*Note: Both tables will strictly adhere to our multi-tenancy `firm_id` rules.*

### Core RBAC & Masking Utilities
#### [NEW] [rbacMiddleware.js](file:///Users/ratan/Downloads/frost-pivot/RetailNode/backend/middleware/rbacMiddleware.js)
The `requirePermission(module, action)` middleware that checks the MySQL database (or a quick memory cache) to ensure the current `req.user.role` has the required access rights before proceeding to the controller.

#### [NEW] [fieldPermissions.js](file:///Users/ratan/Downloads/frost-pivot/RetailNode/backend/config/fieldPermissions.js)
A configuration object defining the strict data masking rules (e.g., specifying that the 'cashier' role cannot see `cost_price`).

#### [NEW] [maskData.js](file:///Users/ratan/Downloads/frost-pivot/RetailNode/backend/utils/maskData.js)
A utility function that processes outgoing JSON responses, stripping out sensitive fields based on the `fieldPermissions` configuration and the user's role.

### Role Management API
#### [NEW] [roleController.js](file:///Users/ratan/Downloads/frost-pivot/RetailNode/backend/controllers/roleController.js)
Controller logic to allow a Firm Admin to create new roles (e.g., "Manager", "Salesperson") and assign specific read/write/delete permissions.
#### [NEW] [roleRoutes.js](file:///Users/ratan/Downloads/frost-pivot/RetailNode/backend/routes/roleRoutes.js)
Express routes for managing roles, protected by `authMiddleware`, `tenantMiddleware`, and `rbacMiddleware` (requiring 'settings' admin access).

### Project Tracking (Compulsory)
#### [MODIFY] [HISTORY.md](file:///Users/ratan/Downloads/frost-pivot/RetailNode/HISTORY.md)
Append the successful implementation of the RBAC and Field-Level Security modules to our persistent history log.
#### [MODIFY] [STRICT_RULES.md](file:///Users/ratan/Downloads/frost-pivot/RetailNode/STRICT_RULES.md)
Update our strict architectural guidelines to mandate the use of `requirePermission` and `maskData` on all new feature routes.

## Verification Plan

### Automated/Manual Verification
1. Run the `001_rbac_schema.sql` script to update the MySQL database.
2. Hit the `POST /api/roles` endpoint to create a "Cashier" role with limited permissions.
3. Create a mock `GET /api/inventory/test` endpoint and verify that the `maskData` utility successfully strips out the `cost_price` when a Cashier logs in, but leaves it intact for an Admin.
