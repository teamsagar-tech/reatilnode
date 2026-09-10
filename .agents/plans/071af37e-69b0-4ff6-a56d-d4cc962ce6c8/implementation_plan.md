# Tally-Style Input Indexing Architecture

This plan addresses the implementation of Tally-style focus management, specifically Enter-to-advance, reverse indexing, grid breakout rules, and modal focus restoration.

## Open Questions
> [!IMPORTANT]
> **DOM Query vs. Ref Array**
> Your requirements mention both querying `.tally-input` elements *and* maintaining a React `useRef([])` array. 
> 
> *Recommendation*: The **DOM Query approach** (`document.querySelectorAll`) is generally much safer for dynamic grids in React because it always guarantees elements are sorted in their true visual/DOM order, regardless of render timing. A `useRef([])` array can easily get out of sync when deleting/adding rows in the middle of a grid. 
> 
> *Proposal*: I will implement a robust DOM Query approach in the global keyboard listener that respects a specific `.tally-input` class (if present) or falls back to standard focusable elements, while strictly ignoring `tabindex="-1"`. Is this acceptable, or do you strictly require a context-based Ref Array?

## Proposed Architecture

1.  **Global Forward/Reverse Indexing (`useGlobalKeyboard`)**
    - Modify the existing `Enter` fallback to handle forward progression (+1).
    - Add `Shift+Enter` and `Shift+Tab` as reverse progression (-1).
    - Add `Backspace` as reverse progression (-1) *only if* the current input is completely empty (or cursor is at position 0).
    - The query will explicitly skip any element with `tabindex="-1"`, `disabled`, or `readOnly`.

2.  **Modal Return Indexing (`useKeyboardStore`)**
    - Add two new actions to the Zustand store: `saveFocus()` and `restoreFocus()`.
    - `saveFocus()` will store `document.activeElement` into the store's state.
    - `restoreFocus()` will call `.focus()` on that stored element.
    - Modals (like `SizeAllocationModal` or Party Creation) will call `saveFocus()` on mount, and `restoreFocus()` on unmount/close.

3.  **Auto-Focus on Mount (`useAutoFocus`)**
    - Create a simple hook `useAutoFocus(ref)` that components can use to immediately snap focus to their primary input on mount, bypassing mouse clicks.

4.  **Grid Indexing & Breakouts (Component Level)**
    - For grids (like in `PurchaseInvoice`), we will use the `useShortcut` hook with a higher priority on specific inputs to intercept the global `Enter`.
    - **Row Loop**: On the last column, an `Enter` shortcut will trigger `addRow()` and programmatically focus the first column of the new row after render.
    - **End of List Breakout**: On the first column, an `Enter` shortcut will check if the input is empty. If yes, it will call `.focus()` on a ref attached to the footer/tax section, breaking out of the standard DOM progression.

## Proposed Changes

### [MODIFY] `src/hooks/useGlobalKeyboard.ts`
- Refactor the default behavior section.
- Extract the DOM traversal logic into a reusable helper function.
- Add handlers for `Backspace` (when empty) and `Shift+Tab` to reverse index.

### [MODIFY] `src/store/useKeyboardStore.ts`
- Add `savedFocusElement: HTMLElement | null`.
- Add `saveFocus` and `restoreFocus` functions.

### [NEW] `src/hooks/useAutoFocus.ts`
- Create the auto-focus hook for initial component mounts.

## Verification Plan
1. **Reverse Indexing**: Open any master form. Tab into a field, press Backspace when empty -> focus should jump to the previous field.
2. **Modal Restoration**: Open a modal via shortcut (e.g., Alt+C). Close it. Focus should return exactly to where it was.
3. **Skip Rule**: Verify that fields with `tabindex="-1"` (like reset buttons) are skipped by the Enter key.
