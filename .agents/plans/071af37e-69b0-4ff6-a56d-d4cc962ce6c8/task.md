# Advanced Tally Indexing Implementation

- [x] 1. Update `src/store/useKeyboardStore.ts`
  - Add `savedFocusElement` state.
  - Add `saveFocus()` and `restoreFocus()` actions.
- [x] 2. Create `src/hooks/useAutoFocus.ts`
  - Implement hook to auto-focus a provided ref on mount.
- [x] 3. Modify `src/hooks/useGlobalKeyboard.ts`
  - Extract DOM traversal logic into a helper function.
  - Implement forward traversal on `Enter`.
  - Implement reverse traversal on `Backspace` (if empty) and `Shift+Tab`.
  - Ensure skipping of `tabindex="-1"`, `disabled`, and `readOnly` elements.
- [x] 4. Update Walkthrough
