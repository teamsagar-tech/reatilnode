---
name: retailnode-page-creation
description: Standard Operating Procedure for creating and routing new pages, hubs, and modules in the RetailNode architecture.
---

# RetailNode Page Creation & Routing SOP

When instructed to create a new page, view, or module in RetailNode, you **MUST** follow this standardized workflow to ensure the page is properly categorized, routed, and exposed in the UI navigation system.

## 1. Directory Structure (Module & Sub-module)
Always place the new component in the correct semantic directory inside `FrontEnd/src/pages/` (and identically for `FrontEndV2`). 
- `pages/[module]/[sub-module]/[PageName].tsx`
- **Example:** A new "Tax Config" page belongs in `pages/masters/config/TaxConfig.tsx`.
- **Example:** A new "Sales Returns" page belongs in `pages/sales/returns/SalesReturn.tsx`.

## 2. Route Registration (`App.tsx`)
Every new page must be registered in the central router.
- Open `FrontEnd/src/App.tsx`.
- Import the component at the top, grouping imports by module.
- Add the `<Route path="/module/submodule/page-name" element={<PageName />} />` inside the `<Route element={<DashboardLayout />}>` wrapper.

## 3. UI Navigation Exposure (Hubs & Headers)
Creating a route is not enough. The user MUST be able to navigate to it.

### If it is a top-level Module:
- Add a direct link to `FrontEnd/src/components/layout/Header.tsx` inside the `menuItems` array.
- You **MUST** wrap it with a permission check: `show: check('module_name')`.
- Example: `{ name: "Logistics", icon: Truck, path: "/logistics", show: check('logistics') }`

### If it is a Sub-module or Child Page:
- Do **NOT** add child pages directly to the global Header (to prevent UI clutter).
- Instead, link them inside their respective **Hub Page**.
- Example: If creating a new Master page, you must add its link/card into `FrontEnd/src/pages/masters/MastersHub.tsx`. 
- If a Hub Page does not exist for that module yet, you must propose creating one (e.g. `LogisticsHub.tsx`).

## 4. Layout & Styling Standards
- Always wrap the main content of the page in a responsive Tailwind container (e.g., `max-w-7xl mx-auto py-6 px-4`).
- Use `react-helmet-async` to set the page title dynamically: `<Helmet><title>Page Name - RetailNode</title></Helmet>`.
- Forms and masters should utilize a flex-column layout or the standard 3-column UI (`flex-1 gap-6`) as described in the global `AGENTS.md` rules.

## 5. RBAC & Auth Configuration (Mandatory SaaS Rule)
For the SaaS authorization system to work, every new page must be tracked in the permissions tree.
- The single source of truth for the Auth/RBAC tree is the `AVAILABLE_MODULES` array inside `FrontEnd/src/pages/superadmin/TenantUsers.tsx`.
- Whenever you create a new page, you MUST append its ID and Label into the correct `submodules -> pages` array in `TenantUsers.tsx`.
- Example: If you build a `Tax Config` page, you must add `{ id: 'taxConfig', label: 'Tax Config' }` under the `masters -> config` submodule in `AVAILABLE_MODULES`.
