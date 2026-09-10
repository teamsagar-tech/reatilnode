# Global Keyboard Navigation & Shortcut System (Tally ERP Style)

This plan outlines the architecture for a robust, global keyboard shortcut system in the React application, mimicking the high-speed data entry and navigation of Tally ERP while using a web-safe "Alt" (Windows) / "Option" (Mac) paradigm.

## Goal
Implement a centralized keyboard event manager that handles global shortcuts (Alt+S, Alt+C, etc.), core navigation (Enter/Esc), and prevents browser default behaviors that conflict with the web ERP experience.

## Open Questions
> [!IMPORTANT]
> 1. **State Management**: The project currently uses Zustand (`store` directory). I plan to use Zustand for the `useKeyboardStore`. Is this acceptable, or would you prefer React Context?
> 2. **Existing Logic**: There is an existing global `Enter-to-Tab` listener in `App.tsx`. Should I refactor this into the new global keyboard manager, or leave it as-is and just add the new `Alt` shortcuts alongside it?
> 3. **Navigation (Esc key)**: Tally uses Esc to retreat/cancel. For backing out of routes, should the global listener use `react-router-dom`'s `useNavigate(-1)` when Esc is pressed outside of an input/modal, or should each component handle Esc individually?

## Proposed Architecture

1.  **Centralized State (`useKeyboardStore`)**:
    A store to track the currently active context (e.g., "global", "sales_invoice", "item_master") and a registry of active shortcut callbacks.

2.  **Global Event Hook (`useGlobalKeyboard`)**:
    A single hook placed high in the DOM tree (e.g., in `App.tsx` or a root layout). It will listen to `keydown` events, check for `e.altKey`, call `e.preventDefault()` to block browser menus, and execute the registered callback for the active context.

3.  **Consumer Hook (`useShortcut`)**:
    A hook for components to easily register and unregister shortcuts when they mount/unmount or gain/lose focus.

## Proposed Changes

### Global State & Hooks

#### [NEW] `src/store/useKeyboardStore.ts`
- Create a Zustand store to manage active contexts and a registry of callbacks mapped by key combination.

#### [NEW] `src/hooks/useShortcut.ts`
- Create a React hook that components can use: `useShortcut('Alt+S', handleSave, { preventDefault: true })`. This will register the callback with the `useKeyboardStore`.

#### [NEW] `src/hooks/useGlobalKeyboard.ts`
- Create the core listener hook. It will:
  - Attach to `window.addEventListener('keydown')`.
  - Block `e.altKey` defaults (browser menus).
  - Intercept `Alt+S`, `Alt+C`, `Alt+X`, `Alt+P`, etc.
  - Route the keypress to the appropriate callback registered in `useKeyboardStore`.
  - Handle `Esc` and specific `Enter` behaviors if needed.

### Application Root

#### [MODIFY] `src/App.tsx`
- Integrate `useGlobalKeyboard()` into the root to ensure it catches events across the entire application.
- Migrate the existing `Enter-to-Tab` logic into the new centralized hook for cleaner architecture.

## Verification Plan

### Manual Verification
1.  **Browser Menu Suppression**: Pressing `Alt`, `Alt+F`, `Alt+E` on Windows should NOT open the browser's top menu.
2.  **Global Save (`Alt+S`)**: Implement a test shortcut in a form (e.g., `BrandMaster.tsx`) and verify that pressing `Alt+S` from any input triggers the save function.
3.  **Conflict Resolution**: Verify that `Alt+Arrow` keys do not trigger browser history navigation if we decide to handle them, or that they are explicitly ignored if not meant for grid navigation.
4.  **Enter/Esc**: Ensure the existing Enter-to-advance logic still works seamlessly and that Esc behaves as expected (e.g., closing modals or retreating).
