# Sync `FrontEndV2` Structure to Modern `FrontEnd`

The goal of this phase is to migrate the complex data structures, routing, and navigation menus from the utilitarian `FrontEndV2` (Tally-style) over to the modern `FrontEnd`. While the underlying data (the forms and routes) will be the same, the **visual presentation** in `FrontEnd` will be completely overhauled to meet modern web standards (glassmorphism, smooth animations, responsive grids, and vibrant typography).

## Open Questions

> [!WARNING]
> `FrontEndV2` has over 80+ distinct routes and forms (from payroll to complex inventory). Porting and redesigning all of them into a modern UI will take significant time. 
> 
> **Question 1:** Which **2-3 specific forms** (e.g., `PurchaseInvoice`, `ItemMaster`, `POS`) would you like me to fully design and implement *first* as the foundational template for the modern `FrontEnd`?
>
> **Question 2:** `FrontEndV2` includes a `store/` directory for global state management. Do you want me to port that state management (e.g., Zustand/Redux) over to `FrontEnd` as well, or keep it strictly React-state based for now?

## Proposed Changes

### 1. Navigation & Routing Structure

I will sync the high-level architecture so both apps have the same skeleton.

#### [MODIFY] [`FrontEnd/src/components/layout/Sidebar.tsx`](file:///Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/components/layout/Sidebar.tsx)
- Replicate the menu structure from V2: Dashboard, Inventory, Sales, Customers, Settings.
- **Redesign:** Apply a highly aesthetic, modern sidebar design (e.g., floating or glassmorphic sidebar, micro-animations on hover, modern icons).

#### [MODIFY] [`FrontEnd/src/App.tsx`](file:///Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/App.tsx)
- Import and map the core routing structure from `FrontEndV2`. 
- Set up clean, animated page transitions for the routes.

### 2. Core Forms Implementation (Templates)

Once you answer **Question 1** above, I will create those specific forms in `FrontEnd`.
- **Form Data Sync:** I will extract the exact data models and input requirements from the V2 forms.
- **Modern Redesign:** Instead of a dense 3-column Tally layout, I will use modern UI patterns like stepped-wizards, floating labels, card-based groupings, and responsive grid systems to make it look premium.

## Verification Plan

### Automated Tests
- Run `npm run build` inside `FrontEnd` to ensure TypeScript compilation passes.
- Ensure ESLint/Oxlint rules pass.

### Manual Verification
- We will start the `FrontEnd` dev server (`npm run dev`).
- You will manually verify that the new Sidebar looks premium and modern.
- You will verify that the initial modernized forms capture the exact same data as V2, but look vastly superior.
