# Global Keyboard System Implementation

- [x] 1. Create `src/store/useKeyboardStore.ts`
  - Define state for active shortcuts and context.
- [x] 2. Create `src/hooks/useShortcut.ts`
  - Implement hook to register/unregister shortcuts.
- [x] 3. Create `src/hooks/useGlobalKeyboard.ts`
  - Implement core event listener (Alt blocker, Enter/Esc handling, routing to callbacks).
- [x] 4. Modify `src/App.tsx`
  - Integrate `useGlobalKeyboard`.
  - Remove old inline Enter-to-Tab logic.
- [x] 5. Write walkthrough.md
