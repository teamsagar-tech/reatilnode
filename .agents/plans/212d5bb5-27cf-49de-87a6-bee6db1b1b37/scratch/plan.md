# Global Toast & Modal Refactor

We need to remove all browser-based `alert()` and `window.confirm()` dialogs across the entire project (185+ occurrences of `alert`, 13 occurrences of `confirm`) and replace them with the existing custom toast notification system and a new custom confirmation modal.

## Proposed Changes

### 1. New Confirmation Dialog Component
- Create a global `useConfirmStore.ts` (Zustand) and a `<ConfirmDialog />` component.
- Inject `<ConfirmDialog />` into `App.tsx`.
- Expose an async `confirmDialog(message, title)` function that returns a Promise resolving to `true` or `false`.

### 2. Refactoring `window.confirm()` (13 files)
- Convert synchronous `window.confirm()` calls into asynchronous `await confirmDialog()` calls.
- Update the containing functions to be `async` where necessary.

### 3. Refactoring `alert()` (Bulk operation via Script)
- Write a Node.js/Python script to systematically replace `alert(...)` with `toast.error(...)`, `toast.success(...)`, or `toast.info(...)` across all `.tsx` and `.ts` files in `FrontEndV2/src`.
- The script will use heuristics based on the message content (e.g., if it contains "success" -> `toast.success`, if it contains "failed" or "required" -> `toast.error`).
- Ensure `import { toast } from '...'` is correctly injected at the top of modified files, resolving the correct relative path.

## Verification Plan
- Build the frontend (`npm run build`) to ensure no TypeScript or syntax errors were introduced during the bulk refactor.
- Test a few known workflows (e.g., LR Inward save, delete actions) to verify the new toast and modal behaviors visually.

