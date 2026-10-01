import { useEffect } from 'react';

export default function GlobalEnterNavigation() {
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const activeElement = document.activeElement as HTMLElement;
        
        // Don't intercept if it's a textarea
        if (activeElement.tagName === 'TEXTAREA') return;
        
        // Don't intercept if it's inside a table (Grid layout handles its own Enter logic)
        if (activeElement.closest('table') || activeElement.closest('.grid-container')) return;

        // If it's an input or select, find the next focusable element
        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'SELECT' || activeElement.tagName === 'BUTTON') {
          // If it's the Save button, let it click naturally
          if (activeElement.id === 'btn-save' || activeElement.innerText?.toLowerCase().includes('save')) {
            return;
          }

          e.preventDefault();
          
          // Get all focusable elements in the current container (excluding hidden/disabled)
          const focusableElements = Array.from(
            document.querySelectorAll('input:not([disabled]):not([type="hidden"]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"])')
          ) as HTMLElement[];

          // Find current index
          const currentIndex = focusableElements.indexOf(activeElement);
          
          if (currentIndex > -1 && currentIndex < focusableElements.length - 1) {
            // Find the next element that is actually visible
            let nextElement = focusableElements[currentIndex + 1];
            
            // Skip buttons that are not the "Save" button to avoid accidentally focusing "Reset" or sidebar buttons
            while (
              nextElement && 
              nextElement.tagName === 'BUTTON' && 
              !nextElement.innerText?.toLowerCase().includes('save') &&
              nextElement.id !== 'btn-save'
            ) {
              const nextIndex = focusableElements.indexOf(nextElement) + 1;
              if (nextIndex < focusableElements.length) {
                nextElement = focusableElements[nextIndex];
              } else {
                break;
              }
            }

            if (nextElement) {
              nextElement.focus();
              if (nextElement.tagName === 'INPUT') {
                (nextElement as HTMLInputElement).select();
              }
            }
          }
        }
      }
    };

    // Use capture phase to intercept before React handlers
    window.addEventListener('keydown', handleGlobalKeyDown, true);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown, true);
  }, []);

  return null;
}
