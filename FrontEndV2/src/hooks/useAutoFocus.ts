import { useEffect, useRef } from 'react';

/**
 * Hook to automatically focus an element when its parent component mounts.
 * Useful for the first input field in Tally-style forms (e.g., Date or Party).
 */
export function useAutoFocus<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current && typeof ref.current.focus === 'function') {
      // Small timeout to ensure rendering is completely finished
      setTimeout(() => {
        ref.current?.focus();
      }, 0);
    }
  }, []);

  return ref;
}
