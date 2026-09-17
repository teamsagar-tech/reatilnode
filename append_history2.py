import sys

new_history = """
## 2026-09-17: Tally-Style Escape Confirmation & Global Dialog Hotkeys
**Agent:** Antigravity (AI)
**Features Implemented:**
- **Escape / Quit Safeguard:** Added a Tally-style confirmation mechanism to `PurchaseInvoice.tsx`. If the user has entered any data (e.g., selected a supplier or started entering items/quantities) and presses the `Escape` key or clicks the `Quit` button, a prompt strictly asks "Quit: Yes or No?" instead of instantly dumping them back to the dashboard. If the invoice is completely blank, `Escape` will fast-exit without prompting.
- **Global Y/N Hotkeys:** Enhanced the `ConfirmDialog` component to natively listen for `Y` or `Enter` to confirm, and `N` or `Escape` to cancel. The button labels automatically reflect these hotkeys (e.g., `Yes (Y)`, `No (N)`), enabling blazing-fast keyboard navigation matching Tally ERP behavior.

**Files Modified:**
- `FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx`
- `FrontEndV2/src/components/ui/ConfirmDialog.tsx`
"""

with open('HISTORY.md', 'a') as f:
    f.write(new_history)
