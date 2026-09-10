---
name: retailnode-form-accessibility
description: Standard Operating Procedure for creating and maintaining accessible Master Forms in RetailNode.
---

# RetailNode Form Accessibility and UX Standards

When creating or modifying ANY form (Master, Invoice, or Setting) in the RetailNode project, you MUST strictly adhere to the following accessibility and UX standards.

## 1. Global Keyboard Navigation (Enter-to-Tab)
RetailNode uses a global `Enter-to-Tab` mechanism inside `App.tsx` (via `GlobalEnterNavigation`).
- Users rely on the `Enter` key to navigate between inputs sequentially.
- You do NOT need to write custom `onKeyDown` listeners to focus the next input manually.
- **Rule:** Do NOT intercept the `Enter` key on standard `input` fields unless it is a SearchableDropdown that specifically requires Enter to select an option.

## 2. Preventing Accidental Resets (`tabIndex={-1}`)
Since users press `Enter` repeatedly to traverse forms, they will inevitably reach the end of the form. If the first button after the inputs is "Reset", they will accidentally clear the entire form.
- **Rule:** ALL dangerous buttons (like "Reset", "Clear", or "Delete") MUST have `tabIndex={-1}`.
- This tells the global Enter-to-Tab script to skip over the Reset button and focus the "Save" button instead.
- Example:
  ```tsx
  <button 
    onClick={() => setShowResetConfirm(true)} 
    tabIndex={-1} 
    className="..."
  >
    Reset
  </button>
  ```

## 3. Mandatory Reset Confirmations
Never reset a form immediately upon a single click.
- **Rule:** All "Reset" buttons MUST trigger a `<ConfirmModal />` rather than immediately clearing the state.
- Implement a local state `const [showResetConfirm, setShowResetConfirm] = useState(false);`.
- Only clear the form when the user clicks "Yes" in the Confirm Modal.
- *Note:* The `<ConfirmModal />` component natively handles keyboard shortcuts when open: pressing `Y`, `y`, or `Enter` triggers confirmation, while pressing `N`, `n`, or `Escape` triggers cancellation. You do not need to build custom listeners for these inside the modal.

## 4. Toast Notifications
Do NOT use the native browser `alert()` for user feedback (saves, validation errors, etc.).
- **Rule:** Use the global `useToastStore` for all feedback.
- Import: `import { toast } from '../../../store/useToastStore';` (adjust relative path).
- Usage: `toast.success('Party Saved Successfully!', 'Success');`, `toast.error('Failed to save party', 'Error');`

## 5. Standard Keyboard Shortcuts
All Master layouts must include the following shortcuts in their right sidebar action panel:
- **Alt+C**: Create New (Switches to 'create' mode).
- **F4 / Enter**: Edit (Opens an item from the list).
- **Cmd+A / Ctrl+A**: Save (When in 'create' mode).
- **Esc**: Go back to list mode (When in 'create' mode).

## 6. Modal Interferences with Global Keyboard Shortcuts
When building custom global/page-level keyboard listeners (e.g. `window.addEventListener('keydown', handleKeyDown)`), background pages will continue to receive and process keypresses (like `Enter`, `F5`, `Escape`) even when a modal (like `ConfirmModal`) is visibly covering the screen.
- **Rule:** If a page contains a global `handleKeyDown` function, you MUST add an early exit condition at the top to ignore inputs while any modal is open.
- Example:
  ```tsx
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // PREVENT BACKGROUND ACTIONS WHEN MODALS ARE OPEN
      if (showResetConfirm || showDeleteConfirm) return;
      
      if (e.key === 'Enter') { ... }
    };
    // ...
  }, [showResetConfirm, showDeleteConfirm, ...]);
  ```
