# Walkthrough: Dynamic Party Invoice Configuration

I have successfully implemented the dynamic invoice configuration feature for Party Masters. Here is a summary of what was built and deployed:

## 1. Database Schema Update
- Safely altered the `Parties` table in both your local environment and the **live production server (`162.19.81.108`)** to include a new `invoice_config` column as JSON. This ensures the configuration is safely persisted.

## 2. Party Master UI (Frontend)
- Added an **"Invoice UI Defaults"** section to both `PartyMaster.tsx` (the main Party page) and `PartyModal.tsx` (the quick-add popup).
- This section allows you to specifically toggle:
  - `Design No`
  - `Colour No`
  - `Size`
  - `Discount %`
  - `MRP Markdown`
- These values are mapped securely to the backend on Save/Update.

## 3. Dynamic Purchase Invoice (Frontend)
- **Auto-Fill:** In the Purchase Invoice screen, whenever you select a Party, the system will now fetch their `invoice_config` from the backend and instantly configure the 5 checkboxes on the invoice header.
- **Auto-Learn (Background Save):** If you select a Party that currently has *no* invoice configuration saved, the system tracks the checkboxes you manually select. When you successfully save that first invoice, a silent API request runs in the background and permanently saves that configuration to the Party Master. The next time you select that Party, the checkboxes will be exactly as you left them!

## 4. Backend Architecture 
- Added a `PUT /api/masters/party/:id/invoice-config` API route securely locked behind RBAC middleware (`accounting` permissions required).

## Verification & Deployment
- The React frontend was successfully built using Vite.
- Backend routing files (`partyRoutes.js`) and controllers (`partyController.js`) were synchronized with the live server.
- The `retailnode-api` PM2 instance was restarted to load the new API routes.

Everything is live and ready for testing on your production instance. Try editing a party to add a specific layout, then create a Purchase Invoice with them!
