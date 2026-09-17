---
name: retailnode-form-accessibility
description: Standard Operating Procedure for creating and maintaining accessible Master Forms in RetailNode.
---

# RetailNode Form Accessibility and UX Standards

When creating or modifying ANY form (Master, Invoice, or Setting) in the RetailNode project, you MUST strictly adhere to the following accessibility and UX standards.

## 1. Global Keyboard Navigation (Enter-to-Tab)
RetailNode uses a global `Enter-to-Tab` mechanism inside `App.tsx` (via `useGlobalKeyboard.ts`).
- Users rely on the `Enter` key to navigate between inputs sequentially.
- You do NOT need to write custom `onKeyDown` listeners to focus the next input manually.
- **Rule:** Do NOT intercept the `Enter` key on standard `input` fields unless it is a SearchableDropdown that specifically requires Enter to select an option.

## 2. Preventing Accidental Cancellations/Resets (`tabIndex={-1}`)
Since users press `Enter` repeatedly to traverse forms, they will inevitably reach the end of the form. If the first button after the inputs is "Reset", "Cancel", or "Quit", they will accidentally trigger it.
- **Rule:** ALL dangerous or destructive buttons (like "Reset", "Clear", "Delete", "Cancel", "Close", or "Quit") across ALL pages and popups MUST have `tabIndex={-1}`.
- This tells the global Enter-to-Tab script to skip over them and focus the "Save" or "Submit" button instead.

## 3. Auto-Focusing First Input
- **Rule:** Whenever ANY form or modal opens, the first input field MUST be focused automatically.
- Use a `setTimeout` inside a `useEffect` (or when `isOpen` becomes true) to focus the input by its ID (e.g. `document.getElementById('input-name')?.focus()`).

## 4. Mandatory Reset Confirmations
Never reset a form immediately upon a single click.
- **Rule:** All "Reset" buttons MUST trigger a `<ConfirmModal />` rather than immediately clearing the state.
- Implement a local state `const [showResetConfirm, setShowResetConfirm] = useState(false);`.
- Only clear the form when the user clicks "Yes" in the Confirm Modal.

## 5. Toast Notifications
Do NOT use the native browser `alert()` for user feedback (saves, validation errors, etc.).
- **Rule:** Use the global `useToastStore` for all feedback.
- Import: `import { toast } from '../../../store/useToastStore';` (adjust relative path).
- Usage: `toast.success('Party Saved Successfully!', 'Success');`, `toast.error('Failed to save party', 'Error');`

## 6. Standard Keyboard Shortcuts
All Master layouts must include the following shortcuts in their right sidebar action panel:
- **Alt+C**: Create New (Switches to 'create' mode).
- **F4 / Enter**: Edit (Opens an item from the list).
- **Cmd+A / Ctrl+A**: Save (When in 'create' mode).
- **Esc**: Go back to list mode (When in 'create' mode).

## 7. Modal Interferences with Global Keyboard Shortcuts
When building custom global/page-level keyboard listeners, background pages will continue to receive and process keypresses even when a modal is visibly covering the screen.
- **Rule:** If a page contains a global `handleKeyDown` function, you MUST add an early exit condition at the top to ignore inputs while any modal is open.

## 8. Tally-Style Escape Navigation & Global Dialogs
- **Escape Key Interception:** On all data entry forms, if the user presses `Escape` (or clicks "Quit"), you MUST check if any unsaved data has been entered.
- **Quit Confirmation:** If data is entered, intercept the navigation and prompt "Quit: Yes or No?" using the global `confirmDialog` from `useConfirmStore`.
- **Fast Exit:** If the form is completely blank, `Escape` should back out instantly without prompting.
- **View Mode Exception:** If the form is currently in "View" or "Read-Only" mode (e.g. `isReadOnly` is true), `Escape` MUST completely bypass the confirmation prompt (even if the form has data) because the data has not been modified.
- **Dynamic Return Navigation:** When escaping or quitting, ALWAYS use `navigate(-1)` to return the user to the exact page they came from, rather than hardcoding a route like `navigate('/dashboard')`.
- **Global Y/N Hotkeys:** The global `ConfirmDialog` component natively listens for `Y` or `Enter` to confirm, and `N` or `Escape` to cancel. Always ensure these shortcuts are preserved or implemented in any custom dialogs to maintain Tally-like fast keyboard operability.
