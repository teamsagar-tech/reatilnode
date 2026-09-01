# Implementation Plan: Additional Master APIs

After scanning the frontend repository, I found that there are many more master screens in the application than just the foundational ones. 

The frontend expects masters for:
- **Accounting:** Hundekari, Transporter, Commission
- **Config:** ItemPercentage, ChargesType, Location (Godowns)
- **Inventory:** Department, Size, Color, Material, Style, Section, SubCategory, SubStyle, HSNSAC

To build backend APIs for all ~15 of these masters efficiently, I propose building a **Generic Master Controller**.

## User Review Required

> [!IMPORTANT]
> **Generic Controller Architecture:** Instead of creating 15 separate controller files (e.g., `colorController.js`, `sizeController.js`, etc.) which would be hard to maintain, I propose creating a single `GenericMasterController.js`. 
> 
> The frontend would call endpoints like:
> `POST /api/masters/generic/colors`
> `GET /api/masters/generic/sizes`
> 
> The backend will maintain an allowed list of these tables and automatically handle the CRUD operations, while strictly enforcing the `firm_id` SaaS isolation rule. 
> 
> **Do you approve of using a Generic Controller for these simple lookup masters?**

---

## Proposed Changes

### 1. Database Schema (`004_additional_masters_schema.sql`)
We will create the required tables for all the missing masters. Every table will have `id`, `firm_id`, `name`, `description`, `is_active`, and `created_at`.
- `Hundekaris`, `Transporters`, `Commissions`
- `ItemPercentages`, `ChargesTypes`, `Locations`
- `Departments`, `Sizes`, `Colors`, `Materials`, `Styles`, `Sections`, `SubCategories`, `SubStyles`, `HSNSACs`

### 2. Express Controllers & Routes (`genericMasterController.js`)
We will create a highly reusable controller:
```javascript
// Example logic
const allowedTables = ['Colors', 'Sizes', 'Departments', 'Transporters', ...];
// Validate table name against allowed list
// Execute: SELECT * FROM ${tableName} WHERE firm_id = req.firm_id
```

We will expose standard routes in `genericMasterRoutes.js`:
- `GET /api/masters/generic/:type`
- `GET /api/masters/generic/:type/:id`
- `POST /api/masters/generic/:type`
- `PUT /api/masters/generic/:type/:id`
- `DELETE /api/masters/generic/:type/:id`

This route will be registered in `server.js` and protected by the standard `authMiddleware`, `tenantMiddleware`, and `auditMiddleware`.

## Verification Plan
- Execute `004_additional_masters_schema.sql` to ensure all 15+ tables are created with `firm_id`.
- Test the generic route: `POST /api/masters/generic/colors` to create a color for Firm A.
- Test `GET /api/masters/generic/colors` using Firm B's token to verify that Tenant Isolation strictly prevents them from seeing Firm A's colors.
