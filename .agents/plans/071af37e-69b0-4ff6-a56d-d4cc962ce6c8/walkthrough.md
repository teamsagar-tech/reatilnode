# Walkthrough: Global Keyboard Shortcut System

I have successfully implemented the architectural foundation for the Tally-style global keyboard shortcut system. The application can now safely handle `Alt`/`Option` shortcuts without triggering unwanted browser defaults.

## What Was Completed

1. **State Management (`useKeyboardStore`)**:
   - Created a Zustand store to maintain a registry of active shortcut callbacks.
   - It supports contextual shortcuts, allowing different screens (like `SalesInvoice` vs `MainMenu`) to define their own handlers for the same keys.
   - Priority support ensures that modals or overlapping layers can override lower-level shortcuts.

2. **Core Event Listener (`useGlobalKeyboard`)**:
   - Created a root-level hook that attaches to the `window` `keydown` event in the capture phase.
   - **Crucially, it intercepts `e.altKey` and aggressively calls `e.preventDefault()`** for single-character keys, arrows, and delete keys, effectively neutralizing browser menu popups and accidental history navigation.
   - The existing `Enter-to-Tab` logic was cleanly migrated into this hook as the default fallback behavior when no specific Enter shortcut is registered.

3. **Consumer Hook (`useShortcut`)**:
   - Provided a simple, declarative hook for components to register their shortcuts:
     ```tsx
     useShortcut({
       keys: 'Alt+S',
       callback: handleSave,
       context: 'SalesInvoice'
     });
     ```
   - Automatically handles cleanup (unregistration) when the component unmounts.

4. **Integration**:
   - Integrated the `useGlobalKeyboard` hook into `App.tsx`, replacing the old inline `useEffect` and activating the system application-wide.

## Next Steps for You

You can now start wiring up your forms! For example, inside `BrandMaster.tsx`, you can add:

```tsx
import { useShortcut } from '../../hooks/useShortcut';
import { useAutoFocus } from '../../hooks/useAutoFocus';

// inside the component:
const firstInputRef = useAutoFocus<HTMLInputElement>();

// ... attach ref={firstInputRef} to your first input ...

useShortcut({
  keys: 'Alt+S',
  callback: () => {
    // trigger form submission logic
    console.log("Global save triggered!");
  }
});
```

### Grid Inputs (`PurchaseInvoice.tsx`)
To implement the "End of List" breakout rule on grids, you can attach a shortcut specifically to the first column of your grid row:

```tsx
useShortcut({
  keys: 'Enter',
  priority: 10, // Higher priority intercepts the global Enter
  callback: (e) => {
    if (inputValue === '') {
      // Breakout to footer!
      e.preventDefault();
      footerRef.current?.focus();
    }
  }
});
```

### Modal Restoration
When opening modals like `SizeAllocationModal`, call `useKeyboardStore.getState().saveFocus()` right before setting your modal `isOpen` state to `true`. 
When closing it, call `useKeyboardStore.getState().restoreFocus()`.

> [!TIP]
> Remember to utilize the `context` parameter if you only want a shortcut to be active when a specific route or modal is "active". You can set the active context globally via `useKeyboardStore.getState().setActiveContext('...')`.
> 
> Also, if you need strict focus ordering inside a complex form, you can optionally add `className="tally-input"` to your inputs. The global hook will prioritize those elements and traverse them in DOM order.
