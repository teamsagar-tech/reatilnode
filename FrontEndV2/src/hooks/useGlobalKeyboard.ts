import { useEffect } from 'react';
import { useKeyboardStore } from '../store/useKeyboardStore';

export function useGlobalKeyboard() {
  const getShortcutsForKey = useKeyboardStore((state) => state.getShortcutsForKey);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // 1. Prevent default browser behavior for Alt combos (like Alt+F opening File menu)
      if (e.altKey) {
        // Allow Alt+Tab, Alt+Shift+Tab to pass through if possible, though browser usually handles it before JS.
        // Prevent default for typical character combinations
        if (e.key.length === 1 || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete') {
             e.preventDefault();
        }
      }

      // 2. Formulate the key string representation
      let keyString = '';
      if (e.altKey) keyString += 'Alt+';
      if (e.ctrlKey) keyString += 'Ctrl+';
      if (e.shiftKey) keyString += 'Shift+';
      
      // Handle letters: e.key for 's' is 's', 'S' with shift. We want to normalize.
      // If it's a single letter, uppercase it for consistency in registration (e.g., 'Alt+S')
      let keyName = e.key;
      if (keyName.length === 1 && /[a-z]/i.test(keyName)) {
        keyName = keyName.toUpperCase();
      }
      keyString += keyName;

      // 3. Look up registered shortcuts
      const matchedShortcuts = getShortcutsForKey(keyString);
      
      if (matchedShortcuts.length > 0) {
        // Execute the highest priority shortcut
        matchedShortcuts[0].callback(e);
        return; // Handled by shortcut
      }

      // 4. Default behaviors if no shortcut registered
      
      const isEnter = keyString === 'Enter';
      const isShiftTab = keyString === 'Shift+Tab';
      const isBackspace = keyString === 'Backspace';

      if (isEnter || isShiftTab) {
        const active = document.activeElement as HTMLElement;
        
        // Only intercept if we are on an input/select
        if (active && (active.tagName === 'SELECT' || active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
          
          // Let standard submit buttons work
          if (active.tagName === 'INPUT' && ((active as HTMLInputElement).type === 'submit' || (active as HTMLInputElement).type === 'button')) {
            return; 
          }

          e.preventDefault();

          // Scope to the nearest modal if we are inside one, otherwise use document
          const modalWrapper = active.closest('.fixed.inset-0, [role="dialog"], .modal, dialog');
          const rootNode = modalWrapper || document;

          // Collect focusable elements
          // Prioritize explicitly marked .tally-input fields if they exist in this scope, otherwise fallback
          const hasTallyInputs = rootNode.querySelectorAll('.tally-input').length > 0;
          const focusableStr = hasTallyInputs 
            ? '.tally-input' 
            : 'button, [href], input, select, textarea, [tabindex]';

          const focusableElements = Array.from(rootNode.querySelectorAll(focusableStr)).filter((el) => {
            const htmlEl = el as HTMLElement;
            const inputEl = el as HTMLInputElement;
            
            const text = (htmlEl.innerText || htmlEl.textContent || '').trim().toLowerCase();
            const isDestructiveButton = htmlEl.tagName === 'BUTTON' && 
              (text === 'cancel' || text === 'quit' || text === 'reset');

            return (
              !inputEl.disabled && 
              !inputEl.readOnly && 
              htmlEl.offsetParent !== null && 
              htmlEl.tabIndex !== -1 &&
              !isDestructiveButton
            );
          });

          const currentIndex = focusableElements.indexOf(active);
          const step = isEnter ? 1 : -1;

          if (currentIndex > -1) {
            const nextIndex = currentIndex + step;
            if (nextIndex >= 0 && nextIndex < focusableElements.length) {
              const nextElement = focusableElements[nextIndex] as HTMLElement;
              nextElement.focus();
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleGlobalKeyDown, { capture: true });
  }, [getShortcutsForKey]);
}
