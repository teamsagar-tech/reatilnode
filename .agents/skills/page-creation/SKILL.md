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
- Always wrap the main content of generic pages in a responsive Tailwind container (e.g., `max-w-7xl mx-auto py-6 px-4`).
- Use `react-helmet-async` to set the page title dynamically: `<Helmet><title>Page Name - RetailNode</title></Helmet>`.
- Master forms should utilize a flex-column layout or the standard 3-column UI (`flex-1 gap-6`) as described in the global `AGENTS.md` rules.

### 4.1 Transaction Voucher Standard Layout (Tally Style)
All data entry transaction pages (e.g. Invoices, Orders, Receipts) MUST strictly follow this exact visual structure and Tailwind hierarchy. Refer to `PurchaseInvoice.tsx` as the gold standard template.
- **Main Wrapper**: `<div className="flex flex-col h-screen font-sans text-[13px] overflow-hidden bg-[#e0efeb] w-full">`
- **Inner Flex container**: `<div className="flex flex-1 p-1 gap-1 overflow-hidden h-full">`
- **Right Sidebar**: You MUST include a right sidebar (`w-[120px] bg-[#e0efeb]`) containing function keys (F1-F9), the RN branding logo, and Save(S)/Quit(Q) shortcuts at the bottom.
- **Voucher Header**: `<div className="bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0">`
- **Split Top Form**: The top meta-data area must be split `w-[35%]` left and `w-[65%]` right.
- **Grid Layout**: The items table `thead` must use `bg-[#eef5ed]` and dark borders, and rows hover on `bg-yellow-50`.
- **Two-Part Footer**: The bottom section of the voucher container must be split into `w-[60%]` (Narration input) and `w-[40%]` (Detailed Totals and summary calculations).
- **Bottom Status Bar**: The absolute bottom of the screen (outside the flex-1 layout) must have a `bg-[#1b5e58]` status bar showing Version, Firm, Location, and active Keyboard Shortcuts.

## 5. RBAC & Auth Configuration (Mandatory SaaS Rule)
For the SaaS authorization system to work, every new page must be tracked in the permissions tree.
- The single source of truth for the Auth/RBAC tree is the `AVAILABLE_MODULES` array inside `FrontEnd/src/pages/superadmin/TenantUsers.tsx`.
- Whenever you create a new page, you MUST append its ID and Label into the correct `submodules -> pages` array in `TenantUsers.tsx`.
- Example: If you build a `Tax Config` page, you must add `{ id: 'taxConfig', label: 'Tax Config' }` under the `masters -> config` submodule in `AVAILABLE_MODULES`.
